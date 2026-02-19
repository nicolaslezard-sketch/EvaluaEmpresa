import { prisma } from "@/lib/prisma";
import { resolveEntitlements } from "./entitlements";
import type { Entitlements } from "./types";

export async function getUserEntitlements(
  userId: string,
): Promise<Entitlements> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
    select: { plan: true, status: true },
  });

  // Si no existe o no está activa → FREE
  if (!subscription || subscription.status !== "ACTIVE") {
    return resolveEntitlements("FREE");
  }

  return resolveEntitlements(subscription.plan);
}
