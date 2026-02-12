export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentById } from "@/lib/mercadopago/client";
import { verifyApprovedPayment } from "@/lib/mercadopago/verifyPayment";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const paymentId =
      body?.data?.id || body?.id || body?.resource?.split("/")?.pop();

    if (!paymentId) {
      return NextResponse.json({ ok: true });
    }

    // 🔎 Consultamos MP (fuente de verdad)
    const payment = await getPaymentById(paymentId);

    const verification = verifyApprovedPayment(payment);

    if (!verification.ok) {
      return NextResponse.json({ ok: true });
    }

    const { reportRequestId, amount, currency, status } = verification;

    // 🧱 Idempotencia: ya procesado
    const existing = await prisma.reportRequest.findFirst({
      where: { mercadopagoPaymentId: paymentId },
    });

    if (existing) {
      return NextResponse.json({ ok: true });
    }

    // ✅ Actualizamos reporte
    await prisma.reportRequest.update({
      where: { id: reportRequestId },
      data: {
        status: "PAID",
        mercadopagoPaymentId: paymentId,
        mercadopagoStatus: status,

        paidAt: new Date(),
      },
    });

    // 🔔 Disparo interno (no await)
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/report/${reportRequestId}/generate`,
      {
        method: "POST",
        headers: {
          "x-internal-secret": process.env.INTERNAL_API_SECRET!,
        },
      },
    ).catch((err) => {
      console.error("Error disparando generate", err);
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("MP WEBHOOK ERROR", error);
    return NextResponse.json({ ok: true });
  }
}
