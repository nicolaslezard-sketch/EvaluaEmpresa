export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function mapMpStatus(
  status: string,
): "ACTIVE" | "PAUSED" | "CANCELLED" | "EXPIRED" {
  switch (status) {
    case "authorized":
      return "ACTIVE";
    case "paused":
      return "PAUSED";
    case "cancelled":
      return "CANCELLED";
    case "expired":
      return "EXPIRED";
    default:
      return "ACTIVE";
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const topic = body.type;
    const dataId = body.data?.id;
    // 🔓 UNLOCK PAYMENT (one-time)
    if (topic === "payment" && dataId) {
      const paymentRes = await fetch(
        `https://api.mercadopago.com/v1/payments/${dataId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        },
      );

      if (!paymentRes.ok) {
        return NextResponse.json(
          { error: "MP payment fetch failed" },
          { status: 500 },
        );
      }

      const payment = await paymentRes.json();

      // 🔐 Validaciones duras
      if (payment.status !== "approved") {
        return NextResponse.json({ ok: true });
      }

      if (payment.transaction_amount !== 15000) {
        return NextResponse.json({ ok: true }); // monto incorrecto
      }

      const metadata = payment.metadata;

      if (metadata?.type === "evaluation_unlock") {
        await prisma.$transaction(async (tx) => {
          // Guardar evento para auditoría
          await tx.paymentEvent.create({
            data: {
              provider: "mp",
              externalId: String(dataId),
              type: "payment_unlock",
              payload: payment,
            },
          });

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
      }

      return NextResponse.json({ ok: true });
    }

    if (!dataId) {
      return NextResponse.json({ ok: true });
    }

    // 🔁 IDPOTENCIA — si ya procesamos este evento, salimos
    const existingEvent = await prisma.paymentEvent.findUnique({
      where: {
        provider_externalId: {
          provider: "mp",
          externalId: dataId,
        },
      },
    });

    if (existingEvent) {
      return NextResponse.json({ ok: true });
    }

    const mpRes = await fetch(
      `https://api.mercadopago.com/preapproval/${dataId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      },
    );

    if (!mpRes.ok) {
      return NextResponse.json({ error: "MP fetch failed" }, { status: 500 });
    }

    const subscription = await mpRes.json();

    const externalReference = subscription.external_reference as string;
    if (!externalReference) return NextResponse.json({ ok: true });

    const parts = externalReference.split(":");
    if (parts.length < 4) return NextResponse.json({ ok: true });

    const userId = parts[1];
    const plan = parts[2] as "PRO" | "BUSINESS";

    const mappedStatus = mapMpStatus(subscription.status);

    await prisma.$transaction(async (tx) => {
      // Guardar evento primero
      await tx.paymentEvent.create({
        data: {
          provider: "mp",
          externalId: dataId,
          type: topic,
          payload: body,
        },
      });

      // Actualizar suscripción
      await tx.subscription.upsert({
        where: { userId },
        update: {
          plan,
          status: mappedStatus,
          currentPeriodStart: subscription.date_created
            ? new Date(subscription.date_created)
            : null,
          currentPeriodEnd: subscription.next_payment_date
            ? new Date(subscription.next_payment_date)
            : null,
        },
        create: {
          userId,
          plan,
          status: mappedStatus,
        },
      });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("MP webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
