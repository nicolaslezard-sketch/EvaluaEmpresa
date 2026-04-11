import { PRICING, assertConfig } from "@/lib/pricing/config";

export async function createMpSubscriptionCheckout({
  plan,
  period,
}: {
  userId: string;
  payerEmail: string;
  plan: "PRO" | "BUSINESS";
  period: "monthly";
}) {
  const checkoutUrl = PRICING.AR.subscription[plan][period].mp_checkout_url;

  assertConfig(
    checkoutUrl,
    plan === "PRO"
      ? "MP_PRO_MONTHLY_CHECKOUT_URL"
      : "MP_BUSINESS_MONTHLY_CHECKOUT_URL",
  );

  return checkoutUrl;
}
