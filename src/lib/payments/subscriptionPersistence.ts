import type {
  Prisma,
  SubscriptionPlan,
  SubscriptionSource,
  SubscriptionStatus,
} from "@prisma/client";

type PaidSubscriptionSource = Extract<SubscriptionSource, "MP" | "LEMON">;
type PaidSubscriptionPlan = Extract<SubscriptionPlan, "PRO" | "BUSINESS">;

export function parseProviderDate(value: unknown): Date | null {
  if (!value || typeof value !== "string") return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function upsertPaidSubscription(
  tx: Prisma.TransactionClient,
  {
    userId,
    plan,
    status,
    source,
    currentPeriodStart,
    currentPeriodEnd,
    providerSubscriptionId,
    providerCustomerId,
  }: {
    userId: string;
    plan: PaidSubscriptionPlan;
    status: SubscriptionStatus;
    source: PaidSubscriptionSource;
    currentPeriodStart?: Date | null;
    currentPeriodEnd?: Date | null;
    providerSubscriptionId?: string | null;
    providerCustomerId?: string | null;
  },
) {
  return tx.subscription.upsert({
    where: { userId },
    update: {
      plan,
      status,
      source,
      isTrial: false,
      currentPeriodStart: currentPeriodStart ?? null,
      currentPeriodEnd: currentPeriodEnd ?? null,
      providerSubscriptionId:
        providerSubscriptionId !== undefined
          ? providerSubscriptionId
          : undefined,
      providerCustomerId:
        providerCustomerId !== undefined ? providerCustomerId : undefined,
    },
    create: {
      userId,
      plan,
      status,
      source,
      isTrial: false,
      currentPeriodStart: currentPeriodStart ?? null,
      currentPeriodEnd: currentPeriodEnd ?? null,
      providerSubscriptionId: providerSubscriptionId ?? null,
      providerCustomerId: providerCustomerId ?? null,
    },
  });
}
