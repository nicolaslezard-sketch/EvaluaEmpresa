export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { prisma } from "@/lib/prisma";

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Falta env ${name}`);
  return v;
}

const mp = new MercadoPagoConfig({
  accessToken: requireEnv("MP_ACCESS_TOKEN"),
});

type MPPayment = {
  id: number;
  status: string;
  transaction_amount: number;
  currency_id: string;
  external_reference?: string;
};

export async function GET(req: Request) {
  const APP_URL = requireEnv("APP_URL");

  try {
    const url = new URL(req.url);

    const paymentId =
      url.searchParams.get("payment_id") ||
      url.searchParams.get("collection_id");

    if (!paymentId) {
      return NextResponse.redirect(
        `${APP_URL}/success?status=missing_payment_id`,
      );
    }

    const paymentClient = new Payment(mp);

    const payment = (await paymentClient.get({
      id: Number(paymentId),
    })) as unknown as MPPayment;

    const reportId = payment.external_reference;

    if (!reportId) {
      return NextResponse.redirect(
        `${APP_URL}/success?status=missing_report_id`,
      );
    }

    // 1️⃣ Validaciones duras
    if (payment.status !== "approved") {
      await prisma.reportRequest.update({
        where: { id: reportId },
        data: {
          status: "FAILED",
          mercadopagoStatus: payment.status,
        },
      });

      return NextResponse.redirect(
        `${APP_URL}/success?status=${payment.status}&reportId=${reportId}`,
      );
    }

    if (payment.transaction_amount !== 100 || payment.currency_id !== "ARS") {
      await prisma.reportRequest.update({
        where: { id: reportId },
        data: {
          status: "FAILED",
          mercadopagoStatus: "INVALID_AMOUNT",
        },
      });

      return NextResponse.redirect(
        `${APP_URL}/success?status=invalid_amount&reportId=${reportId}`,
      );
    }

    // 2️⃣ Marcar como PAGADO (idempotente)
    await prisma.reportRequest.update({
      where: { id: reportId },
      data: {
        status: "PAID",
        mercadopagoPaymentId: String(payment.id),
        mercadopagoStatus: payment.status,
        paidAt: new Date(),
      },
    });

    // 3️⃣ (siguiente paso) disparar generación async
    // por ahora solo dejamos el estado listo

    return NextResponse.redirect(
      `${APP_URL}/success?status=approved&reportId=${reportId}`,
    );
  } catch {
    return NextResponse.redirect(`${APP_URL}/success?status=error`);
  }
}
