import { prisma } from "@/lib/prisma";
import type { Entitlements } from "./entitlements";
import { getEntitlementsFromSubscription } from "./userAccessCore";

/**
 * Wrapper legacy para mantener compatibilidad
 */
export async function getUserEntitlements(
  userId: string,
): Promise<Entitlements> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "ACTIVE",
    },
  });

  return getEntitlementsFromSubscription(subscription);
}
