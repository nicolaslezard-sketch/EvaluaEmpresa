import { prisma } from "@/lib/prisma";
import { entitlementsFrom, type Entitlements, type Plan } from "./limits";

export async function getUserEntitlements(
  userId: string,
): Promise<Entitlements> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: { plan: true, status: true },
  });

  let plan: Plan = "FREE";

  if (sub?.status === "ACTIVE") {
    plan = sub.plan as Plan; // PRO | BUSINESS
  }

  return entitlementsFrom(plan);
}
