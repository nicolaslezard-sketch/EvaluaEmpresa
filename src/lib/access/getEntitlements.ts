import { prisma } from "@/lib/prisma";
import { resolveEntitlements } from "./entitlements";
import type { Entitlements } from "./entitlements";

export async function getUserEntitlements(
  userId: string,
): Promise<Entitlements> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscription: true,
    },
  });

  const plan = user?.subscription?.plan ?? "FREE";

  return resolveEntitlements(plan);
}
