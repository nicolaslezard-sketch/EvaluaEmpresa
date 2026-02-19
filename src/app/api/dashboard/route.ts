import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserEntitlements } from "@/lib/access/userAccess";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ent = await getUserEntitlements(session.user.id);

  const companies = await prisma.company.findMany({
    where: {
      ownerId: session.user.id,
      status: "ACTIVE",
    },
    include: {
      evaluations: {
        where: { status: "FINALIZED" },
        orderBy: { createdAt: "desc" },
        take: ent.trendDepth > 0 ? ent.trendDepth : 1,
      },
      alerts: ent.canSeeAlerts
        ? {
            orderBy: { createdAt: "desc" },
            take: 5,
          }
        : false,
    },
  });

  return NextResponse.json({
    plan: ent.plan,
    trendDepth: ent.trendDepth,
    canCreateEvaluation: ent.canCreateEvaluation,
    canSeeAlerts: ent.canSeeAlerts,
    companies,
  });
}
