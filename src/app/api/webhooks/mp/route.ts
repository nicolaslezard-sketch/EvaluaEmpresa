export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRICING } from "@/lib/pricing/config";
import {
  parseProviderDate,
  upsertPaidSubscription,
} from "@/lib/payments/subscriptionPersistence";

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

function buildMpEventExternalId(topic: string, dataId: string) {
  return `${topic}:${dataId}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: true });
    }

    const topic = typeof body.type === "string" ? body.type : "";
    const dataId =
      body.data?.id !== undefined && body.data?.id !== null
        ? String(body.data.id)
        : "";

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

      if (payment.status !== "approved") {
        return NextResponse.json({ ok: true });
      }

      const metadata = payment.metadata;

      if (metadata?.type === "evaluation_one_time") {
        const expectedAmount = PRICING.AR.oneTime.EVALUACION_UNICA.amount;

        if (payment.transaction_amount !== expectedAmount) {
          return NextResponse.json({ ok: true });
        }

        const existingEvent = await prisma.paymentEvent.findUnique({
          where: {
            provider_externalId: {
              provider: "mp",
              externalId: String(dataId),
            },
          },
        });

        if (existingEvent) {
          return NextResponse.json({ ok: true });
        }

        await prisma.$transaction(async (tx) => {
          await tx.paymentEvent.create({
            data: {
              provider: "mp",
              externalId: String(dataId),
              type: "payment_one_time",
              payload: payment,
            },
          });

          await tx.oneTimeEvaluationAccess.upsert({
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
      }

      return NextResponse.json({ ok: true });
    }

    if (!topic || !dataId) {
      return NextResponse.json({ ok: true });
    }

    const eventExternalId = buildMpEventExternalId(topic, dataId);

    const existingEvent = await prisma.paymentEvent.findUnique({
      where: {
        provider_externalId: {
          provider: "mp",
          externalId: eventExternalId,
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

    const externalReference =
      typeof subscription.external_reference === "string"
        ? subscription.external_reference
        : "";

    if (!externalReference.startsWith("sub:")) {
      return NextResponse.json({ ok: true });
    }

    const parts = externalReference.split(":");
    if (parts.length < 4) {
      return NextResponse.json({ ok: true });
    }

    const userId = parts[1];
    const plan = parts[2] as "PRO" | "BUSINESS";

    if (!userId || !["PRO", "BUSINESS"].includes(plan)) {
      return NextResponse.json({ ok: true });
    }

    const mappedStatus = mapMpStatus(String(subscription.status || ""));

    const currentPeriodStart =
      parseProviderDate(subscription.date_created) ||
      parseProviderDate(subscription.last_modified);

    const currentPeriodEnd =
      parseProviderDate(subscription.next_payment_date) ||
      parseProviderDate(subscription.auto_recurring?.end_date);

    await prisma.$transaction(async (tx) => {
      await tx.paymentEvent.create({
        data: {
          provider: "mp",
          externalId: eventExternalId,
          type: topic,
          payload: {
            webhook: body,
            subscription,
          },
        },
      });

      await upsertPaidSubscription(tx, {
        userId,
        plan,
        status: mappedStatus,
        source: "MP",
        currentPeriodStart,
        currentPeriodEnd,
        providerSubscriptionId:
          subscription.id !== undefined && subscription.id !== null
            ? String(subscription.id)
            : null,
        providerCustomerId:
          subscription.payer_id !== undefined && subscription.payer_id !== null
            ? String(subscription.payer_id)
            : null,
      });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("MP webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
