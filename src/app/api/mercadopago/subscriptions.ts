const MP_API = "https://api.mercadopago.com";

/* =========================================================
   RAW TYPES (lo que devuelve MP — todo unknown)
========================================================= */

type MpPreapprovalRaw = {
  id?: unknown;
  status?: unknown;
  reason?: unknown;
  payer_email?: unknown;
  back_url?: unknown;
  auto_recurring?: unknown;
  date_created?: unknown;
  last_modified?: unknown;
  init_point?: unknown;
};

/* =========================================================
   SAFE TYPES (lo que usa tu app)
========================================================= */

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

/* =========================================================
   HELPERS
========================================================= */

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Falta env ${name}`);
  return v;
}

function getAccessToken(): string {
  return requireEnv("MP_ACCESS_TOKEN");
}

function normalizePreapproval(raw: MpPreapprovalRaw): MpPreapproval {
  return {
    id: typeof raw.id === "string" ? raw.id : String(raw.id ?? ""),
    status:
      typeof raw.status === "string" ? raw.status : String(raw.status ?? ""),

    reason: typeof raw.reason === "string" ? raw.reason : undefined,
    payer_email:
      typeof raw.payer_email === "string" ? raw.payer_email : undefined,
    back_url: typeof raw.back_url === "string" ? raw.back_url : undefined,

    auto_recurring:
      typeof raw.auto_recurring === "object" && raw.auto_recurring !== null
        ? (raw.auto_recurring as MpPreapproval["auto_recurring"])
        : undefined,

    date_created:
      typeof raw.date_created === "string" ? raw.date_created : undefined,

    last_modified:
      typeof raw.last_modified === "string" ? raw.last_modified : undefined,
  };
}

/* =========================================================
   CREATE PREAPPROVAL
========================================================= */

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

  const raw = (await res.json()) as MpPreapprovalRaw;

  if (typeof raw.init_point !== "string") {
    throw new Error("MP preapproval response missing init_point");
  }

  return {
    init_point: raw.init_point,
    preapproval: normalizePreapproval(raw),
  };
}

/* =========================================================
   GET PREAPPROVAL
========================================================= */

export async function getPreapprovalById(id: string): Promise<MpPreapproval> {
  const res = await fetch(`${MP_API}/preapproval/${id}`, {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`MP preapproval fetch failed: ${res.status} ${txt}`);
  }

  const raw = (await res.json()) as MpPreapprovalRaw;

  return normalizePreapproval(raw);
}
