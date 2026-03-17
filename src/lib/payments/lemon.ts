import type { OneTimeEvaluationMetadata } from "./mp";
import { PRICING } from "@/lib/pricing/config";

export async function createLemonCheckout(
  metadata: OneTimeEvaluationMetadata,
): Promise<string> {
  const variantId = PRICING.INTL.oneTime.EVALUACION_UNICA.lemon_price_id;

  if (!variantId) {
    throw new Error("Missing Lemon price id for EVALUACION_UNICA");
  }

  const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.LEMON_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          checkout_data: {
            custom: metadata,
          },
          product_options: {
            redirect_url: `${process.env.APP_URL}/companies/${metadata.companyId}/evaluations/${metadata.evaluationId}`,
          },
          expires_at: null,
        },
        relationships: {
          store: {
            data: {
              type: "stores",
              id: process.env.LEMON_STORE_ID!,
            },
          },
          variant: {
            data: {
              type: "variants",
              id: variantId,
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Lemon error:", text);
    throw new Error("Lemon checkout creation failed");
  }

  const json = await response.json();
  const url = json?.data?.attributes?.url;

  if (!url) {
    throw new Error("Lemon checkout URL missing");
  }

  return url;
}
