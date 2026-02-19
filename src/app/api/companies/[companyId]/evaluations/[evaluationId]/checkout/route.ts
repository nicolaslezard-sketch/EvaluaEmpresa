import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserEntitlements } from "@/lib/access/userAccess";
import { createMercadoPagoCheckout } from "@/lib/payments/mp";
import { createLemonCheckout } from "@/lib/payments/lemon";
import type { EvaluationUnlockMetadata } from "@/lib/payments/mp";

export async function POST(
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

  if (!evaluation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (evaluation.companyId !== companyId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (evaluation.company.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (evaluation.status !== "FINALIZED") {
    return NextResponse.json(
      { error: "Evaluation not finalized" },
      { status: 400 },
    );
  }

  // Si ya tiene plan o unlock → no permitir checkout
  const ent = await getUserEntitlements(session.user.id);

  if (ent.canDownloadPdf) {
    return NextResponse.json({ error: "ALREADY_HAS_ACCESS" }, { status: 400 });
  }

  const existingUnlock = await prisma.evaluationUnlock.findUnique({
    where: {
      userId_evaluationId: {
        userId: session.user.id,
        evaluationId,
      },
    },
  });

  if (existingUnlock) {
    return NextResponse.json({ error: "ALREADY_UNLOCKED" }, { status: 400 });
  }

  // Detectar país (simple por ahora)
  const isArgentina = session.user.email?.endsWith(".ar");

  const metadata: EvaluationUnlockMetadata = {
    userId: session.user.id,
    evaluationId,
    companyId,
    type: "evaluation_unlock",
  };

  let url: string;

  if (isArgentina) {
    url = await createMercadoPagoCheckout(metadata);
  } else {
    url = await createLemonCheckout(metadata);
  }

  return NextResponse.json({ url });
}
