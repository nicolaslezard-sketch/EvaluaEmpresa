import type { Subscription, SubscriptionPlan } from "@prisma/client";
import { resolveEntitlements } from "./entitlements";
import type { Entitlements } from "./entitlements";

export function getEntitlementsFromSubscription(
  subscription: Subscription | null,
): Entitlements {
  if (!subscription || subscription.status !== "ACTIVE") {
    return resolveEntitlements("FREE");
  }

  return resolveEntitlements(subscription.plan as SubscriptionPlan);
}
