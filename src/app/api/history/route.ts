import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      subscription: true,
    },
  });

  const tier =
    user?.subscription?.status === "AUTHORIZED"
      ? user.subscription.tier
      : "FREE";

  const reports = await prisma.reportRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      createdAt: true,
      title: true,
      overallScore: true,
      executiveCategory: true,
      pdfKey: true,
    },
  });

  return NextResponse.json({ reports, tier });
}
