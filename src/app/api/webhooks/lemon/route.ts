export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  parseProviderDate,
  upsertPaidSubscription,
} from "@/lib/payments/subscriptionPersistence";

function mapLemonStatus(
  status: string,
): "ACTIVE" | "PAUSED" | "CANCELLED" | "EXPIRED" {
  switch (status) {
    case "active":
    case "on_trial":
      return "ACTIVE";
    case "paused":
    case "past_due":
    case "unpaid":
      return "PAUSED";
    case "cancelled":
      return "CANCELLED";
    case "expired":
      return "EXPIRED";
    default:
      return "ACTIVE";
  }
}

const SUBSCRIPTION_EVENTS = new Set([
  "subscription_created",
  "subscription_updated",
  "subscription_cancelled",
  "subscription_resumed",
  "subscription_expired",
  "subscription_paused",
  "subscription_unpaused",
]);

function buildLemonEventExternalId(eventName: string, dataId: string) {
  return `${eventName}:${dataId}`;
}

export async function POST(req: NextRequest) {
  try {
    const event = await req.json().catch(() => null);

    if (!event || typeof event !== "object") {
      return NextResponse.json({ ok: true });
    }

    const eventName =
      typeof event?.meta?.event_name === "string" ? event.meta.event_name : "";

    const dataId =
      event?.data?.id !== undefined && event?.data?.id !== null
        ? String(event.data.id)
        : "";

    if (!eventName || !dataId) {
      return NextResponse.json({ ok: true });
    }

    const eventExternalId = buildLemonEventExternalId(eventName, dataId);

    const existing = await prisma.paymentEvent.findUnique({
      where: {
        provider_externalId: {
          provider: "lemon",
          externalId: eventExternalId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ ok: true });
    }

    if (eventName === "order_created") {
      const attributes = event?.data?.attributes;
      const metadata = event?.meta?.custom_data;

      if (attributes?.status !== "paid") {
        return NextResponse.json({ ok: true });
      }

      if (!metadata || metadata.type !== "evaluation_one_time") {
        return NextResponse.json({ ok: true });
      }

      if (!metadata.userId || !metadata.evaluationId) {
        return NextResponse.json({ ok: true });
      }

      await prisma.$transaction(async (tx) => {
        await tx.paymentEvent.create({
          data: {
            provider: "lemon",
            externalId: eventExternalId,
            type: "order_one_time",
            payload: event,
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

    if (!SUBSCRIPTION_EVENTS.has(eventName)) {
      return NextResponse.json({ ok: true });
    }

    if (event?.data?.type !== "subscriptions") {
      return NextResponse.json({ ok: true });
    }

    const attributes = event?.data?.attributes;
    const metadata = event?.meta?.custom_data;

    if (!metadata || metadata.kind !== "subscription") {
      return NextResponse.json({ ok: true });
    }

    const userId =
      typeof metadata.userId === "string"
        ? metadata.userId
        : typeof metadata.user_id === "string"
          ? metadata.user_id
          : "";

    const plan =
      typeof metadata.plan === "string" ? metadata.plan.toUpperCase() : "";

    if (!userId || !["PRO", "BUSINESS"].includes(plan)) {
      return NextResponse.json({ ok: true });
    }

    const mappedStatus = mapLemonStatus(String(attributes?.status || ""));

    const currentPeriodStart =
      parseProviderDate(attributes?.created_at) ||
      parseProviderDate(attributes?.updated_at);

    const currentPeriodEnd =
      parseProviderDate(attributes?.renews_at) ||
      parseProviderDate(attributes?.ends_at) ||
      parseProviderDate(attributes?.trial_ends_at);

    await prisma.$transaction(async (tx) => {
      await tx.paymentEvent.create({
        data: {
          provider: "lemon",
          externalId: eventExternalId,
          type: eventName,
          payload: event,
        },
      });

      await upsertPaidSubscription(tx, {
        userId,
        plan: plan as "PRO" | "BUSINESS",
        status: mappedStatus,
        source: "LEMON",
        currentPeriodStart,
        currentPeriodEnd,
        providerSubscriptionId:
          event?.data?.id !== undefined && event?.data?.id !== null
            ? String(event.data.id)
            : null,
        providerCustomerId:
          event?.data?.attributes?.customer_id !== undefined &&
          event?.data?.attributes?.customer_id !== null
            ? String(event.data.attributes.customer_id)
            : null,
      });
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lemon webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
