import { prisma } from "@/lib/prisma";
import { resolveEntitlements } from "./entitlements";
import type { Entitlements } from "./entitlements";

export async function getUserEntitlements(
  userId: string,
): Promise<Entitlements> {
  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      plan: true,
    },
  });

  const rawPlan = activeSubscription?.plan ?? "FREE";
  const plan = String(rawPlan).toUpperCase() as "FREE" | "PRO" | "BUSINESS";

  return resolveEntitlements(plan);
}
