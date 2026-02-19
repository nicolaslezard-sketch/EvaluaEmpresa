import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserEntitlements } from "@/lib/access/userAccess";

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

  const ent = await getUserEntitlements(session.user.id);

  if (ent.canDownloadPdf) {
    return NextResponse.json({
      hasAccess: true,
      reason: "plan",
    });
  }

  const unlock = await prisma.evaluationUnlock.findUnique({
    where: {
      userId_evaluationId: {
        userId: session.user.id,
        evaluationId,
      },
    },
  });

  if (unlock) {
    return NextResponse.json({
      hasAccess: true,
      reason: "unlock",
    });
  }

  // 🔎 Verificar pago pendiente
  const pendingPayment = await prisma.paymentEvent.findFirst({
    where: {
      provider: "mp",
      type: "payment_unlock",
      payload: {
        path: ["metadata", "evaluationId"],
        equals: evaluationId,
      },
    },
  });

  if (pendingPayment) {
    return NextResponse.json({
      hasAccess: false,
      reason: "pending",
    });
  }

  return NextResponse.json({
    hasAccess: false,
    reason: "none",
  });
}
