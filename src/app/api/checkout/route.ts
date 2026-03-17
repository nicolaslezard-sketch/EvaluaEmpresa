import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { detectRegion } from "@/lib/geo/region";
import { createMpSubscriptionCheckout } from "@/lib/payments/mp/subscriptionCheckout";
import { createLemonSubscriptionCheckout } from "@/lib/payments/lemon/subscriptionCheckout";
import { prisma } from "@/lib/prisma";
import { getEvaluationAccess } from "@/lib/access/getEvaluationAccess";
import { createMercadoPagoCheckout } from "@/lib/payments/mp";
import { createLemonCheckout } from "@/lib/payments/lemon";
import type { OneTimeEvaluationMetadata } from "@/lib/payments/mp";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const kind = body.kind as "subscription" | "one_time";
  const region = detectRegion(req);

  if (kind === "subscription") {
    const plan = body.plan as "PRO" | "BUSINESS";
    const period = (body.period as "monthly") || "monthly";

    if (!plan || !["PRO", "BUSINESS"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const checkoutUrl =
      region === "AR"
        ? await createMpSubscriptionCheckout({
            userId: session.user.id,
            plan,
            period,
          })
        : await createLemonSubscriptionCheckout({
            userId: session.user.id,
            plan,
            period,
          });

    return NextResponse.json({ checkoutUrl });
  }

  if (kind === "one_time") {
    const evaluationId = body.evaluationId as string;
    const companyId = body.companyId as string;

    if (!evaluationId || !companyId) {
      return NextResponse.json(
        { error: "Missing companyId or evaluationId" },
        { status: 400 },
      );
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

    if (access.canViewFullReport) {
      return NextResponse.json(
        { error: "ALREADY_HAS_ACCESS" },
        { status: 400 },
      );
    }

    const metadata: OneTimeEvaluationMetadata = {
      userId: session.user.id,
      evaluationId,
      companyId,
      region,
      sku: "EVALUACION_UNICA",
      type: "evaluation_one_time",
    };

    const checkoutUrl =
      region === "AR"
        ? await createMercadoPagoCheckout(metadata)
        : await createLemonCheckout(metadata);

    return NextResponse.json({ checkoutUrl });
  }

  return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
}
