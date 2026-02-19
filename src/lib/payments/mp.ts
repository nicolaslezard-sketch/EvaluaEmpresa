import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export type EvaluationUnlockMetadata = {
  userId: string;
  evaluationId: string;
  companyId: string;
  type: "evaluation_unlock";
};

export async function createMercadoPagoCheckout(
  metadata: EvaluationUnlockMetadata,
): Promise<string> {
  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items: [
        {
          id: "evaluation_unlock",
          title: "Desbloqueo Informe Empresarial",
          quantity: 1,
          unit_price: 15000,
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
