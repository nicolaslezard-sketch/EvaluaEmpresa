const MP_API = "https://api.mercadopago.com";

/* ============================
   🔹 Helper interno
============================ */

async function mpFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${MP_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MercadoPago error: ${text}`);
  }

  return res.json();
}

/* ============================
   🔹 Tipos MercadoPago
============================ */

export type MPPreapproval = {
  id: string;
  status: string;
  auto_recurring?: {
    start_date?: string;
    end_date?: string;
  };
};

/* ============================
   🔹 Obtener pago puntual
============================ */

export async function getPaymentById(id: string) {
  return mpFetch(`/v1/payments/${id}`);
}

/* ============================
   🔹 Crear suscripción (Preapproval)
============================ */

export async function createPreapproval(params: {
  reason: string;
  payerEmail: string;
  amount: number;
  currencyId: string;
  frequency: number;
  frequencyType: "months";
  backUrl: string;
  notificationUrl: string;
}) {
  const body = {
    reason: params.reason,
    payer_email: params.payerEmail,
    auto_recurring: {
      frequency: params.frequency,
      frequency_type: params.frequencyType,
      transaction_amount: params.amount,
      currency_id: params.currencyId,
    },
    back_url: params.backUrl,
    notification_url: params.notificationUrl,
  };

  const data = await mpFetch<{
    id: string;
    init_point: string;
  }>("/preapproval", {
    method: "POST",
    body: JSON.stringify(body),
  });

  return {
    id: data.id,
    init_point: data.init_point,
  };
}

/* ============================
   🔹 Obtener suscripción por ID
============================ */

export async function getPreapprovalById(id: string): Promise<MPPreapproval> {
  return mpFetch<MPPreapproval>(`/preapproval/${id}`);
}
