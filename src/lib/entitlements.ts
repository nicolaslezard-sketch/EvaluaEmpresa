import { prisma } from "@/lib/prisma";
import { EvaluationTier, SubscriptionStatus } from "@prisma/client";

export type AccessLevel = "FREE" | "REPORT_UNLOCK" | "PYME" | "EMPRESA";

export async function getUserAccessLevel(userId: string): Promise<AccessLevel> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (subscription && subscription.status === SubscriptionStatus.AUTHORIZED) {
    if (subscription.tier === EvaluationTier.EMPRESA) {
      return "EMPRESA";
    }

    if (subscription.tier === EvaluationTier.PYME) {
      return "PYME";
    }
  }

  return "FREE";
}
