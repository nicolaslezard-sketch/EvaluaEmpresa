import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const report = await prisma.reportRequest.findUnique({
    where: { id },
    select: {
      status: true,
      pdfPath: true,
      lastError: true,
    },
  });

  if (!report) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: report.status,
    downloadUrl: report.pdfPath ?? null,
    error: report.lastError ?? null,
  });
}
