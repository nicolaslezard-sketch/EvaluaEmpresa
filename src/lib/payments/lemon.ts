import type { EvaluationUnlockMetadata } from "./mp";

export async function createLemonCheckout(
  metadata: EvaluationUnlockMetadata,
): Promise<string> {
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
              id: process.env.LEMON_VARIANT_UNLOCK_ID!,
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
