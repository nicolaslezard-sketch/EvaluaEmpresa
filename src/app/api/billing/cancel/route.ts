import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cancelPaidSubscription } from "@/lib/payments/cancelSubscription";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: {
      plan: true,
      status: true,
      source: true,
      isTrial: true,
      currentPeriodStart: true,
      currentPeriodEnd: true,
      providerSubscriptionId: true,
    },
  });

  if (!subscription || subscription.plan === "FREE") {
    return NextResponse.json(
      {
        error: "NO_ACTIVE_SUBSCRIPTION",
        message: "No hay una suscripción paga para cancelar.",
      },
      { status: 400 },
    );
  }

  if (subscription.isTrial || subscription.source === "TRIAL") {
    return NextResponse.json(
      {
        error: "TRIAL_CANNOT_BE_CANCELLED_HERE",
        message: "El trial no requiere cancelación manual.",
      },
      { status: 400 },
    );
  }

  if (subscription.status === "CANCELLED") {
    return NextResponse.json({
      ok: true,
      alreadyCancelled: true,
      currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
    });
  }

  if (subscription.status === "EXPIRED") {
    return NextResponse.json(
      {
        error: "SUBSCRIPTION_ALREADY_EXPIRED",
        message: "La suscripción ya está vencida.",
      },
      { status: 400 },
    );
  }

  const result = await cancelPaidSubscription({
    userId,
    userEmail: session.user.email,
    source: subscription.source,
    providerSubscriptionId: subscription.providerSubscriptionId,
  });

  const nextCurrentPeriodEnd =
    result.currentPeriodEnd ?? subscription.currentPeriodEnd ?? null;

  await prisma.$transaction(async (tx) => {
    await tx.subscription.update({
      where: { userId },
      data: {
        status: "CANCELLED",
        currentPeriodEnd: nextCurrentPeriodEnd,
      },
    });

    await tx.paymentEvent.create({
      data: {
        provider:
          subscription.source === "LEMON"
            ? "lemon"
            : subscription.source === "MP"
              ? "mp"
              : "internal",
        externalId: `cancel_request:${subscription.source}:${userId}:${Date.now()}`,
        type: "subscription_cancel_requested",
        payload: {
          userId,
          source: subscription.source,
          remoteId: result.remoteId,
          currentPeriodEnd:
            nextCurrentPeriodEnd?.toISOString?.() ?? nextCurrentPeriodEnd,
        },
      },
    });
  });

  return NextResponse.json({
    ok: true,
    status: "CANCELLED",
    currentPeriodEnd: nextCurrentPeriodEnd?.toISOString() ?? null,
  });
}
