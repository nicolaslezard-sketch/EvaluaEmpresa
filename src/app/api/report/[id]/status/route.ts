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
      lastError: true,
    },
  });

  if (!report) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    status: report.status,
    error: report.lastError ?? null,
  });
}
