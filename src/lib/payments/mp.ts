import { MercadoPagoConfig, Preference } from "mercadopago";
import { PRICING } from "@/lib/pricing/config";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export type OneTimeEvaluationMetadata = {
  userId: string;
  evaluationId: string;
  companyId: string;
  region: "AR" | "INTL";
  sku: "EVALUACION_UNICA";
  type: "evaluation_one_time";
};

export async function createMercadoPagoCheckout(
  metadata: OneTimeEvaluationMetadata,
): Promise<string> {
  const preference = new Preference(client);

  const price = PRICING.AR.oneTime.EVALUACION_UNICA.amount;

  const result = await preference.create({
    body: {
      items: [
        {
          id: "evaluation_one_time",
          title: "Evaluación única empresarial",
          quantity: 1,
          unit_price: price,
        },
      ],
      metadata,
      notification_url: `${process.env.APP_URL}/api/webhooks/mp`,
      back_urls: {
        success: `${process.env.APP_URL}/companies/${metadata.companyId}/evaluations/${metadata.evaluationId}`,
        failure: `${process.env.APP_URL}/companies/${metadata.companyId}/evaluations/${metadata.evaluationId}`,
        pending: `${process.env.APP_URL}/companies/${metadata.companyId}/evaluations/${metadata.evaluationId}`,
      },
      auto_return: "approved",
    },
  });

  if (!result.init_point) {
    throw new Error("MercadoPago checkout creation failed");
  }

  return result.init_point;
}
