type MpPaymentRaw = {
  status?: unknown;
  transaction_amount?: unknown;
  currency_id?: unknown;
  external_reference?: unknown;
};

type VerifyApprovedPaymentResult =
  | { ok: false }
  | {
      ok: true;
      reportRequestId: string;
      amount: number;
      currency: string;
      status: string;
    };

export function verifyApprovedPayment(
  payment: unknown,
): VerifyApprovedPaymentResult {
  if (!payment || typeof payment !== "object") {
    return { ok: false };
  }

  const p = payment as MpPaymentRaw;

  if (p.status !== "approved") return { ok: false };

  if (typeof p.transaction_amount !== "number") return { ok: false };
  if (p.transaction_amount !== 100) return { ok: false };

  if (p.currency_id !== "ARS") return { ok: false };

  if (typeof p.external_reference !== "string") return { ok: false };

  return {
    ok: true,
    reportRequestId: p.external_reference,
    amount: p.transaction_amount,
    currency: p.currency_id as string,
    status: p.status as string,
  };
}
