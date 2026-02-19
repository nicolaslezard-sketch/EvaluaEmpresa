export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    const eventName = event?.meta?.event_name;

    // Solo procesamos órdenes creadas
    if (eventName !== "order_created") {
      return NextResponse.json({ ok: true });
    }

    const orderId = event?.data?.id;

    if (!orderId) {
      return NextResponse.json({ ok: true });
    }

    // 🔒 Idempotencia
    const existing = await prisma.paymentEvent.findUnique({
      where: {
        provider_externalId: {
          provider: "lemon",
          externalId: orderId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ ok: true });
    }

    const attributes = event?.data?.attributes;

    // 🔒 Validar estado pago
    if (attributes?.status !== "paid") {
      return NextResponse.json({ ok: true });
    }

    const metadata = attributes?.custom;

    if (!metadata || metadata.type !== "evaluation_unlock") {
      return NextResponse.json({ ok: true });
    }

    if (!metadata.userId || !metadata.evaluationId) {
      return NextResponse.json({ ok: true });
    }

    await prisma.$transaction(async (tx) => {
      // Guardar evento
      await tx.paymentEvent.create({
        data: {
          provider: "lemon",
          externalId: orderId,
          type: "order_unlock",
          payload: event,
        },
      });

      // Crear unlock (idempotente)
      await tx.evaluationUnlock.upsert({
        where: {
          userId_evaluationId: {
            userId: metadata.userId,
            evaluationId: metadata.evaluationId,
          },
        },
        update: {},
        create: {
          userId: metadata.userId,
          evaluationId: metadata.evaluationId,
        },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lemon webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
