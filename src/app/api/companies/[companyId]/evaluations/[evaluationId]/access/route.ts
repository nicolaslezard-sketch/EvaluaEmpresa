import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEvaluationAccess } from "@/lib/access/getEvaluationAccess";

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

  if (!evaluation || evaluation.companyId !== companyId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (evaluation.company.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const access = await getEvaluationAccess({
    userId: session.user.id,
    evaluationId,
  });

  if (access.canViewFullReport) {
    return NextResponse.json({
      hasAccess: true,
      canViewFullReport: true,
      canDownloadPdf: access.canDownloadPdf,
      reason: access.reason,
    });
  }

  const pendingMpPayment = await prisma.paymentEvent.findFirst({
    where: {
      provider: "mp",
      type: "payment_one_time",
      payload: {
        path: ["metadata", "evaluationId"],
        equals: evaluationId,
      },
    },
  });

  const pendingLemonOrder = await prisma.paymentEvent.findFirst({
    where: {
      provider: "lemon",
      type: "order_one_time",
      payload: {
        path: ["data", "attributes", "custom", "evaluationId"],
        equals: evaluationId,
      },
    },
  });

  if (pendingMpPayment || pendingLemonOrder) {
    return NextResponse.json({
      hasAccess: false,
      canViewFullReport: false,
      canDownloadPdf: false,
      reason: "pending",
    });
  }

  return NextResponse.json({
    hasAccess: false,
    canViewFullReport: false,
    canDownloadPdf: false,
    reason: "none",
  });
}
