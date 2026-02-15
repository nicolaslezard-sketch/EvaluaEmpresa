export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const report = await prisma.reportRequest.findUnique({
      where: { id },
    });

    if (!report) {
      return NextResponse.redirect(new URL("/app/dashboard", req.url));
    }

    const existingUnlock = await prisma.reportUnlock.findUnique({
      where: {
        userId_reportId: {
          userId: session.user.id,
          reportId: report.id,
        },
      },
    });

    if (existingUnlock) {
      return NextResponse.redirect(
        new URL(`/app/analysis/${report.id}`, req.url),
      );
    }

    return NextResponse.redirect(
      new URL(`/api/payments/mercadopago/preference`, req.url),
    );
  } catch (error) {
    console.error("Error unlock:", error);
    return NextResponse.redirect(new URL("/app/dashboard", req.url));
  }
}
