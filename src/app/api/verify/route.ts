import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { formalId, code } = await req.json();

  const report = await prisma.reportRequest.findFirst({
    where: {
      formalId,
      verifyCode: code,
      status: "DELIVERED",
    },
  });

  if (!report) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({
    valid: true,
    date: report.deliveredAt,
  });
}
