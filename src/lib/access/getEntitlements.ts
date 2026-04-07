import { prisma } from "@/lib/prisma";
import { resolveEntitlements } from "./entitlements";
import type { Entitlements } from "./entitlements";

export async function getUserEntitlements(
  userId: string,
): Promise<Entitlements> {
  const now = new Date();

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: {
      plan: true,
      status: true,
      isTrial: true,
      trialEndsAt: true,
      currentPeriodEnd: true,
    },
  });

  if (!subscription) {
    return resolveEntitlements("FREE");
  }

  if (subscription.isTrial) {
    const trialExpired =
      subscription.trialEndsAt === null || subscription.trialEndsAt < now;

    if (trialExpired) {
      await prisma.subscription.update({
        where: { userId },
        data: {
          status: "EXPIRED",
        },
      });

      return resolveEntitlements("FREE");
    }

    return resolveEntitlements(subscription.plan);
  }

  if (subscription.status === "EXPIRED") {
    return resolveEntitlements("FREE");
  }

  const periodExpired =
    subscription.currentPeriodEnd !== null &&
    subscription.currentPeriodEnd < now;

  if (periodExpired) {
    await prisma.subscription.update({
      where: { userId },
      data: {
        status: "EXPIRED",
      },
    });

    return resolveEntitlements("FREE");
  }

  if (
    subscription.status === "ACTIVE" ||
    subscription.status === "PAUSED" ||
    subscription.status === "CANCELLED"
  ) {
    return resolveEntitlements(subscription.plan);
  }

  return resolveEntitlements("FREE");
}
