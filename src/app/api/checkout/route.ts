import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { detectRegion } from "@/lib/geo/region";
import { createMpSubscriptionCheckout } from "@/lib/payments/mp/subscriptionCheckout";
import { createLemonSubscriptionCheckout } from "@/lib/payments/lemon/subscriptionCheckout";
import { createMpUnlockCheckout } from "@/lib/payments/mp/unlockCheckout";
import { createLemonUnlockCheckout } from "@/lib/payments/lemon/unlockCheckout";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const kind = body.kind as "subscription" | "unlock";
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

  if (kind === "unlock") {
    const evaluationId = body.evaluationId as string;
    if (!evaluationId) {
      return NextResponse.json(
        { error: "Missing evaluationId" },
        { status: 400 },
      );
    }

    const checkoutUrl =
      region === "AR"
        ? await createMpUnlockCheckout({
            userId: session.user.id,
            evaluationId,
          })
        : await createLemonUnlockCheckout({
            userId: session.user.id,
            evaluationId,
          });

    return NextResponse.json({ checkoutUrl });
  }

  return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
}
