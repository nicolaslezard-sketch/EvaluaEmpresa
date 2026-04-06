import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const TRIAL_DAYS = 21;

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const now = new Date();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      proTrialUsedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.proTrialUsedAt) {
    return NextResponse.json(
      {
        error: "TRIAL_ALREADY_USED",
        message: "Esta cuenta ya utilizó el trial Pro.",
      },
      { status: 400 },
    );
  }

  const existingSubscription = await prisma.subscription.findUnique({
    where: { userId },
    select: {
      id: true,
      plan: true,
      status: true,
      isTrial: true,
      source: true,
    },
  });

  if (
    existingSubscription &&
    (existingSubscription.status === "ACTIVE" ||
      existingSubscription.status === "PAUSED" ||
      existingSubscription.status === "CANCELLED")
  ) {
    return NextResponse.json(
      {
        error: "SUBSCRIPTION_ALREADY_EXISTS",
        message: "La cuenta ya tiene una suscripción asociada.",
      },
      { status: 400 },
    );
  }

  const trialEndsAt = new Date(now);
  trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DAYS);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        proTrialUsedAt: now,
      },
    }),
    prisma.subscription.upsert({
      where: { userId },
      update: {
        plan: "PRO",
        status: "ACTIVE",
        source: "TRIAL",
        isTrial: true,
        trialStartedAt: now,
        trialEndsAt,
        currentPeriodStart: now,
        currentPeriodEnd: trialEndsAt,
      },
      create: {
        userId,
        plan: "PRO",
        status: "ACTIVE",
        source: "TRIAL",
        isTrial: true,
        trialStartedAt: now,
        trialEndsAt,
        currentPeriodStart: now,
        currentPeriodEnd: trialEndsAt,
      },
    }),
  ]);

  return NextResponse.json({
    ok: true,
    plan: "PRO",
    trialDays: TRIAL_DAYS,
    trialEndsAt: trialEndsAt.toISOString(),
  });
}
