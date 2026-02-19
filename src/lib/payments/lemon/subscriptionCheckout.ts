import { PRICING, assertConfig } from "@/lib/pricing/config";
import { lemonHeaders } from "@/lib/payments/lemon/client";

export async function createLemonSubscriptionCheckout({
  userId,
  plan,
  period,
}: {
  userId: string;
  plan: "PRO" | "BUSINESS";
  period: "monthly";
}) {
  const priceId = PRICING.INTL.subscription[plan][period].lemon_price_id;
  assertConfig(
    priceId,
    plan === "PRO"
      ? "LEMON_PRO_MONTHLY_PRICE_ID"
      : "LEMON_BUSINESS_MONTHLY_PRICE_ID",
  );

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: lemonHeaders(),
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: {
              userId,
              kind: "subscription",
              plan,
              period,
            },
          },
          product_options: {
            redirect_url: `${baseUrl}/app/billing`,
          },
        },
        relationships: {
          store: { data: { type: "stores", id: process.env.LEMON_STORE_ID } },
          variant: { data: { type: "variants", id: priceId } },
        },
      },
    }),
  });

  const json = await res.json();
  if (!res.ok)
    throw new Error(json?.errors?.[0]?.detail || "Lemon checkout failed");

  const url = json?.data?.attributes?.url as string;
  if (!url) throw new Error("Lemon missing checkout url");
  return url;
}
