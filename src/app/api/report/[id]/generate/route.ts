export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildEvaluaEmpresaPrompt } from "@/lib/prompts/evaluaEmpresa";
import { openai } from "@/lib/openai";
import { generateReportPdf } from "@/lib/pdf/generateReportPdf";
import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { safeJsonParse } from "@/lib/analysis/parseReport";
import { validateAndNormalizeReport } from "@/lib/analysis/validateReport";
import { generateFormalId, generateVerifyCode } from "@/lib/domain/identifiers";

/* build-safe */
type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, context: RouteContext) {
  const { id: reportId } = await context.params;

  console.log("[GENERATE] start", reportId);

  const internalSecret = req.headers.get("x-internal-secret");
  const isInternal =
    internalSecret && internalSecret === process.env.INTERNAL_API_SECRET;

  let userId: string | null = null;

  if (!isInternal) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.log("[GENERATE] unauthorized");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    userId = session.user.id;
  }

  const report = await prisma.reportRequest.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    console.log("[GENERATE] report not found");
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!isInternal && report.userId !== userId) {
    console.log("[GENERATE] forbidden");
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (report.status === "DELIVERED") {
    console.log("[GENERATE] immutable report");
    return NextResponse.json(
      { error: "Report is immutable once delivered." },
      { status: 400 },
    );
  }

  if (!["PAID", "FAILED"].includes(report.status)) {
    console.log("[GENERATE] invalid status", report.status);
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (report.attempts >= 3) {
    console.log("[GENERATE] max attempts reached");
    return NextResponse.json(
      { error: "Max attempts reached" },
      { status: 400 },
    );
  }

  if (
    !report.formData ||
    typeof report.formData !== "object" ||
    Array.isArray(report.formData)
  ) {
    await prisma.reportRequest.update({
      where: { id: reportId },
      data: { status: "FAILED", lastError: "formData inválido" },
    });
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  await prisma.reportRequest.update({
    where: { id: reportId },
    data: {
      status: "GENERATING",
      attempts: { increment: 1 },
      lastError: null,
    },
  });

  try {
    const prompt = buildEvaluaEmpresaPrompt(
      report.formData as Record<string, unknown>,
    );

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const text = completion.choices[0].message.content;
    if (!text) throw new Error("Respuesta vacía de OpenAI");

    const rawJson = safeJsonParse(text);
    const { report: reportData, extracted } =
      validateAndNormalizeReport(rawJson);

    const pdfBuffer = await generateReportPdf(reportData);

    const pdfKey = `reports/${report.userId}/${report.id}.pdf`;

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: pdfKey,
        Body: pdfBuffer,
        ContentType: "application/pdf",
      }),
    );

    // 🔥 Generar identificadores institucionales
    let formalId = report.formalId;
    let verifyCode = report.verifyCode;

    if (!formalId) {
      if (!report.companyId) {
        throw new Error("Company not associated with report");
      }

      formalId = await generateFormalId(report.companyId);
      verifyCode = generateVerifyCode();
    }

    await prisma.reportRequest.update({
      where: { id: reportId },
      data: {
        // legacy
        reportText: text,

        // estructurado
        reportData: reportData as Prisma.JsonObject,
        overallScore: extracted.overallScore,
        executiveCategory: extracted.executiveCategory,

        financialScore: extracted.financialScore,
        commercialScore: extracted.commercialScore,
        operationalScore: extracted.operationalScore,
        legalScore: extracted.legalScore,
        strategicScore: extracted.strategicScore,

        // institucional
        formalId,
        verifyCode,
        deliveredAt: new Date(),

        status: "DELIVERED",

        pdfKey,
        pdfSize: pdfBuffer.length,
        pdfMime: "application/pdf",
      },
    });

    console.log("[GENERATE] delivered", reportId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[GENERATE] error", err);

    await prisma.reportRequest.update({
      where: { id: reportId },
      data: {
        status: "FAILED",
        lastError: err instanceof Error ? err.message : String(err),
      },
    });

    return NextResponse.json(
      { error: "Error generando informe" },
      { status: 500 },
    );
  }
}
