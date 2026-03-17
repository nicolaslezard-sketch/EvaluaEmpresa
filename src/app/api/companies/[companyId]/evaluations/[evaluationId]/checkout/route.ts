import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { detectRegion } from "@/lib/geo/region";
import { getEvaluationAccess } from "@/lib/access/getEvaluationAccess";
import { createMercadoPagoCheckout } from "@/lib/payments/mp";
import { createLemonCheckout } from "@/lib/payments/lemon";
import type { OneTimeEvaluationMetadata } from "@/lib/payments/mp";

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

  if (!evaluation || evaluation.companyId !== companyId) {
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

  const access = await getEvaluationAccess({
    userId: session.user.id,
    evaluationId,
  });

  if (!access.exists || !access.isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (access.canViewFullReport) {
    return NextResponse.json({ error: "ALREADY_HAS_ACCESS" }, { status: 400 });
  }

  const region = detectRegion(_req);

  const metadata: OneTimeEvaluationMetadata = {
    userId: session.user.id,
    evaluationId,
    companyId,
    region,
    sku: "EVALUACION_UNICA",
    type: "evaluation_one_time",
  };

  const url =
    region === "AR"
      ? await createMercadoPagoCheckout(metadata)
      : await createLemonCheckout(metadata);

  return NextResponse.json({ url });
}
