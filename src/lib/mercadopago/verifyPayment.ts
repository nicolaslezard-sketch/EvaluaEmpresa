export function verifyApprovedPayment(payment: any) {
  if (!payment) return { ok: false };

  const { status, transaction_amount, currency_id, external_reference } =
    payment;

  if (status !== "approved") return { ok: false };

  if (transaction_amount !== 100) return { ok: false };
  if (currency_id !== "ARS") return { ok: false };

  if (!external_reference) return { ok: false };

  return {
    ok: true,
    reportRequestId: external_reference,
    amount: transaction_amount,
    currency: currency_id,
    status,
  };
}
