export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReportPdf } from "@/lib/pdf/generateReportPdf";
import { ReportJson } from "@/lib/types/report";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const report = await prisma.reportRequest.findUnique({
    where: { id },
    select: {
      reportData: true,
    },
  });

  if (!report?.reportData) {
    return new Response("Reporte no encontrado", { status: 404 });
  }

  const parsed = report.reportData as ReportJson;

  const pdfBuffer = await generateReportPdf(parsed);

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="informe-${id}.pdf"`,
    },
  });
}
