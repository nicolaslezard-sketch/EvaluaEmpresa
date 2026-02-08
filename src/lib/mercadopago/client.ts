const MP_API = "https://api.mercadopago.com";

export async function getPaymentById(id: string) {
  const res = await fetch(`${MP_API}/v1/payments/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
    },
  });

  if (!res.ok) {
    throw new Error("MP payment fetch failed");
  }

  return res.json();
}
