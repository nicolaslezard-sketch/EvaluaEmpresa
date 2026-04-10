import { PRICING, assertConfig } from "@/lib/pricing/config";
import { mpHeaders } from "@/lib/payments/mp/client";

export async function createMpSubscriptionCheckout({
  userId,
  payerEmail,
  plan,
  period,
}: {
  userId: string;
  payerEmail: string;
  plan: "PRO" | "BUSINESS";
  period: "monthly";
}) {
  const planId = PRICING.AR.subscription[plan][period].mp_preapproval_plan_id;

  assertConfig(
    planId,
    plan === "PRO" ? "MP_PRO_MONTHLY_PLAN_ID" : "MP_BUSINESS_MONTHLY_PLAN_ID",
  );

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const webhookUrl =
    process.env.MP_SUBSCRIPTION_WEBHOOK_URL || `${baseUrl}/api/webhooks/mp`;

  const res = await fetch("https://api.mercadopago.com/preapproval", {
    method: "POST",
    headers: mpHeaders(),
    body: JSON.stringify({
      preapproval_plan_id: planId,
      reason: `EvaluaEmpresa ${plan} (monthly)`,
      external_reference: `sub:${userId}:${plan}:${period}`,
      payer_email: payerEmail,
      back_url: `${baseUrl}/billing`,
      status: "pending",
      notification_url: webhookUrl,
    }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json?.message ||
        json?.error ||
        json?.cause?.[0]?.description ||
        "MP preapproval failed",
    );
  }

  const initPoint = json?.init_point as string | undefined;

  if (!initPoint) {
    throw new Error("MP missing init_point");
  }

  return initPoint;
}
