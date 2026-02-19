import { PRICING, assertConfig } from "@/lib/pricing/config";
import { mpHeaders } from "@/lib/payments/mp/client";

export async function createMpSubscriptionCheckout({
  userId,
  plan,
  period,
}: {
  userId: string;
  plan: "PRO" | "BUSINESS";
  period: "monthly";
}) {
  const planId = PRICING.AR.subscription[plan][period].mp_preapproval_plan_id;
  assertConfig(
    planId,
    plan === "PRO" ? "MP_PRO_MONTHLY_PLAN_ID" : "MP_BUSINESS_MONTHLY_PLAN_ID",
  );

  const backUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const webhookUrl = process.env.MP_SUBSCRIPTION_WEBHOOK_URL || ""; // opcional, podemos usar /api/webhooks/mp
  // NOTA: MP usa preapproval “subscription” sobre un plan. Endpoint según API.
  // Implementamos URL de init_point desde respuesta.

  const res = await fetch("https://api.mercadopago.com/preapproval", {
    method: "POST",
    headers: mpHeaders(),
    body: JSON.stringify({
      preapproval_plan_id: planId,
      reason: `EvaluaEmpresa ${plan} (monthly)`,
      external_reference: `sub:${userId}:${plan}:${period}`,
      back_url: `${backUrl}/app/billing`,
      status: "pending",
      auto_recurring: undefined,
      notification_url: webhookUrl || undefined,
    }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "MP preapproval failed");

  // MP suele devolver init_point
  const initPoint = json.init_point as string;
  if (!initPoint) throw new Error("MP missing init_point");
  return initPoint;
}
