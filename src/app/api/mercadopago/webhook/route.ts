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

    // 🔎 Fuente de verdad
    const payment = await getPaymentById(paymentId);
    const verification = verifyApprovedPayment(payment);

    if (!verification.ok) {
      return NextResponse.json({ ok: true });
    }

    const { reportRequestId, status } = verification;

    type MpPaymentMetadata = {
      type?: "REPORT_UNLOCK" | "REPORT_GENERATION";
      reportId?: string;
      userId?: string;
    };

    type MpPayment = {
      metadata?: MpPaymentMetadata;
    };

    const mpPayment = payment as MpPayment;

    const metadata = mpPayment.metadata ?? {};
    const type = metadata.type;

    // Idempotencia general
    const existingReport = await prisma.reportRequest.findFirst({
      where: { mercadopagoPaymentId: paymentId },
    });

    if (existingReport) {
      return NextResponse.json({ ok: true });
    }

    // ===============================
    // 🔓 UNLOCK INDIVIDUAL
    // ===============================
    if (type === "REPORT_UNLOCK") {
      const userId = metadata.userId;

      if (!userId) {
        return NextResponse.json({ ok: true });
      }

      // Evitar duplicados
      const existingUnlock = await prisma.reportUnlock.findUnique({
        where: {
          userId_reportId: {
            userId,
            reportId: reportRequestId,
          },
        },
      });

      if (!existingUnlock) {
        await prisma.reportUnlock.create({
          data: {
            userId,
            reportId: reportRequestId,
          },
        });
      }

      return NextResponse.json({ ok: true });
    }

    // ===============================
    // 📄 GENERACIÓN INFORME (flujo original)
    // ===============================

    await prisma.reportRequest.update({
      where: { id: reportRequestId },
      data: {
        status: "PAID",
        mercadopagoPaymentId: paymentId,
        mercadopagoStatus: status,
        paidAt: new Date(),
      },
    });

    // Disparar generación
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
