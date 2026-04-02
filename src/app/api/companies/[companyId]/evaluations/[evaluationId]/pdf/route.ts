import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEvaluationAccess } from "@/lib/access/getEvaluationAccess";
import {
  getEvaluationPdfObject,
  uploadEvaluationPdf,
} from "@/lib/reports/storage";
import { generateReportPdf } from "@/lib/pdf/generateReportPdf";
import type { DeterministicPdfData } from "@/lib/pdf/generateReportPdf";
export async function GET(
  _req: NextRequest,
  context: {
    params: Promise<{
      companyId: string;
      evaluationId: string;
    }>;
  },
) {
  const { companyId, evaluationId } = await context.params;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const evaluation = await prisma.evaluation.findUnique({
    where: { id: evaluationId },
    include: { company: true },
  });

  if (!evaluation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (evaluation.companyId !== companyId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (evaluation.company.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (evaluation.status !== "FINALIZED") {
    return NextResponse.json(
      { error: "Evaluation not finalized" },
      { status: 400 },
    );
  }

  const access = await getEvaluationAccess({
    userId: session.user.id,
    evaluationId,
  });

  if (!access.canDownloadPdf) {
    return NextResponse.json({ error: "PDF_ACCESS_DENIED" }, { status: 403 });
  }

  // 🔥 GENERACIÓN ON-DEMAND
  if (!evaluation.pdfKey) {
    if (!evaluation.reportData) {
      return NextResponse.json(
        { error: "Report data missing" },
        { status: 400 },
      );
    }

    const reportData =
      evaluation.reportData as DeterministicPdfData["reportData"];

    const pdfData: DeterministicPdfData = {
      companyName: evaluation.company.name,
      generatedAt: (evaluation.updatedAt ?? evaluation.createdAt).toISOString(),
      evaluationCreatedAtISO: evaluation.createdAt.toISOString(),
      companyCriticality: evaluation.company.criticality,
      overallScore: evaluation.overallScore ?? 0,
      executiveCategory: evaluation.executiveCategory ?? "SIN_CATEGORIA",
      pillars: {
        financial: evaluation.financialScore,
        commercial: evaluation.commercialScore,
        operational: evaluation.operationalScore,
        legal: evaluation.legalScore,
        strategic: evaluation.strategicScore,
      },
      deltas: {
        overall: evaluation.deltaOverall,
        financial: evaluation.deltaFinancial,
        commercial: evaluation.deltaCommercial,
        operational: evaluation.deltaOperational,
        legal: evaluation.deltaLegal,
        strategic: evaluation.deltaStrategic,
      },
      reportData,
    };

    const buffer = await generateReportPdf(pdfData);

    const { key, size, mime } = await uploadEvaluationPdf(
      evaluation.id,
      buffer,
    );

    await prisma.evaluation.update({
      where: { id: evaluation.id },
      data: {
        pdfKey: key,
        pdfSize: size,
        pdfMime: mime,
      },
    });

    evaluation.pdfKey = key;
    evaluation.pdfMime = mime;
  }

  const obj = await getEvaluationPdfObject(evaluation.pdfKey);

  if (!obj.Body) {
    return NextResponse.json(
      { error: "PDF_MISSING_IN_STORAGE" },
      { status: 404 },
    );
  }

  return new NextResponse(obj.Body as unknown as ReadableStream, {
    headers: {
      "Content-Type": evaluation.pdfMime ?? "application/pdf",
      "Content-Disposition": `attachment; filename="evaluation-${evaluationId}.pdf"`,
      "Cache-Control": "private, max-age=0, no-cache",
    },
  });
}
