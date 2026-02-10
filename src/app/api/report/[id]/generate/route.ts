import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { buildEvaluaEmpresaPrompt } from "@/lib/prompts/evaluaEmpresa";
import { openai } from "@/lib/openai";
import { generateReportPdf } from "@/lib/pdf/generateReportPdf";
import { r2 } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);

  // 🔐 Auth obligatoria
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const report = await prisma.reportRequest.findUnique({
    where: { id },
  });

  // ❌ No existe o no es del user
  if (!report || report.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // ✅ Idempotente
  if (report.status === "DELIVERED") {
    return NextResponse.json({ ok: true });
  }

  // 🔒 Estados válidos para generar
  if (!["PAID", "FAILED"].includes(report.status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  // 🧨 Límite de intentos
  if (report.attempts >= 3) {
    return NextResponse.json(
      { error: "Máximo de intentos alcanzado" },
      { status: 400 },
    );
  }

  // 🧠 Validar formData
  if (
    !report.formData ||
    typeof report.formData !== "object" ||
    Array.isArray(report.formData)
  ) {
    await prisma.reportRequest.update({
      where: { id },
      data: {
        status: "FAILED",
        lastError: "formData inválido",
      },
    });

    return NextResponse.json(
      { error: "Datos de formulario inválidos" },
      { status: 400 },
    );
  }

  // 🔄 Marcar como GENERATING
  await prisma.reportRequest.update({
    where: { id },
    data: {
      status: "GENERATING",
      attempts: { increment: 1 },
      lastError: null,
    },
  });

  try {
    // 🧠 Prompt
    const prompt = buildEvaluaEmpresaPrompt(
      report.formData as Record<string, unknown>,
    );

    // 🤖 OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const text = completion.choices[0].message.content;
    if (!text) throw new Error("Respuesta vacía de OpenAI");

    const parsed = JSON.parse(text);

    // 📄 Generar PDF (Buffer)
    const pdfBuffer = await generateReportPdf(parsed);

    // ☁️ Subir a R2
    const pdfKey = `reports/${report.userId}/${report.id}.pdf`;

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: pdfKey,
        Body: pdfBuffer,
        ContentType: "application/pdf",
      }),
    );

    // ✅ Guardar estado final
    await prisma.reportRequest.update({
      where: { id },
      data: {
        reportText: text,
        status: "DELIVERED",
        pdfKey,
        pdfSize: pdfBuffer.length,
        pdfMime: "application/pdf",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    await prisma.reportRequest.update({
      where: { id },
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
