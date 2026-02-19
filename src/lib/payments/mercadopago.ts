import { NextResponse } from "next/server";

export async function handleMercadoPago(plan: string, userId: string) {
  // TODO: crear preference real
  // Por ahora placeholder

  const checkoutUrl = "https://www.mercadopago.com.ar/checkout";

  return NextResponse.redirect(checkoutUrl);
}
