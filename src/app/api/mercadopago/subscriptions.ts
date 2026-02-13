const MP_API = "https://api.mercadopago.com";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Falta env ${name}`);
  return v;
}

function getAccessToken(): string {
  return requireEnv("MP_ACCESS_TOKEN");
}

export type MpPreapproval = {
  id: string;
  status: string;
  reason?: string;
  payer_email?: string;
  back_url?: string;
  auto_recurring?: {
    frequency: number;
    frequency_type: "days" | "months" | "years" | string;
    transaction_amount: number;
    currency_id: string;
    start_date?: string;
    end_date?: string;
  };
  date_created?: string;
  last_modified?: string;
};

export async function createPreapproval(params: {
  reason: string;
  payerEmail: string;
  amount: number;
  currencyId: string;
  frequency: number;
  frequencyType: "months" | "days" | "years";
  backUrl: string;
  notificationUrl: string;
}): Promise<{ init_point: string; preapproval: MpPreapproval }> {
  const res = await fetch(`${MP_API}/preapproval`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reason: params.reason,
      payer_email: params.payerEmail,
      back_url: params.backUrl,
      notification_url: params.notificationUrl,
      auto_recurring: {
        frequency: params.frequency,
        frequency_type: params.frequencyType,
        transaction_amount: params.amount,
        currency_id: params.currencyId,
      },
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`MP preapproval create failed: ${res.status} ${txt}`);
  }

  const preapproval = (await res.json()) as any;

  const init_point = preapproval?.init_point as string | undefined;
  if (!init_point)
    throw new Error("MP preapproval response missing init_point");

  return {
    init_point,
    preapproval: {
      id: String(preapproval.id),
      status: String(preapproval.status),
      reason: preapproval.reason,
      payer_email: preapproval.payer_email,
      back_url: preapproval.back_url,
      auto_recurring: preapproval.auto_recurring,
      date_created: preapproval.date_created,
      last_modified: preapproval.last_modified,
    },
  };
}

export async function getPreapprovalById(id: string): Promise<MpPreapproval> {
  const res = await fetch(`${MP_API}/preapproval/${id}`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`MP preapproval fetch failed: ${res.status} ${txt}`);
  }

  const p = (await res.json()) as any;
  return {
    id: String(p.id),
    status: String(p.status),
    reason: p.reason,
    payer_email: p.payer_email,
    back_url: p.back_url,
    auto_recurring: p.auto_recurring,
    date_created: p.date_created,
    last_modified: p.last_modified,
  };
}
