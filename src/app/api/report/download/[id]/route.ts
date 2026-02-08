import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: reportId } = await context.params;

  const report = await prisma.reportRequest.findUnique({
    where: { id: reportId },
    select: {
      status: true,
      pdfPath: true,
    },
  });

  if (!report) {
    return NextResponse.json(
      { ok: false, error: "Report not found" },
      { status: 404 },
    );
  }

  if (report.status !== "PAID") {
    return NextResponse.json(
      { ok: false, error: "Payment required" },
      { status: 403 },
    );
  }

  return NextResponse.json({
    ok: true,
    pdfPath: report.pdfPath,
  });
}
