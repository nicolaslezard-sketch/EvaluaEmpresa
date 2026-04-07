import type { SubscriptionSource } from "@prisma/client";
import { lemonHeaders } from "@/lib/payments/lemon/client";
import { mpHeaders } from "@/lib/payments/mp/client";
import { parseProviderDate } from "@/lib/payments/subscriptionPersistence";

type CancelSubscriptionParams = {
  userId: string;
  userEmail?: string | null;
  source: SubscriptionSource;
  providerSubscriptionId?: string | null;
};

export type CancelSubscriptionResult = {
  remoteId: string | null;
  status: "CANCELLED";
  currentPeriodEnd: Date | null;
};

function extractMpRemoteId(payload: unknown, userId: string): string | null {
  if (!payload || typeof payload !== "object") return null;

  const data = payload as {
    subscription?: {
      id?: string | number;
      external_reference?: string | null;
    };
  };

  const externalReference = data.subscription?.external_reference;

  if (
    typeof externalReference === "string" &&
    externalReference.startsWith(`sub:${userId}:`)
  ) {
    const id = data.subscription?.id;
    return id !== undefined && id !== null ? String(id) : null;
  }

  return null;
}

function extractLemonRemoteId(
  payload: unknown,
  userId: string,
  userEmail?: string | null,
): string | null {
  if (!payload || typeof payload !== "object") return null;

  const data = payload as {
    meta?: {
      custom_data?: {
        userId?: string;
        user_id?: string;
      };
    };
    data?: {
      id?: string | number;
      attributes?: {
        user_email?: string | null;
      };
    };
  };

  const payloadUserId =
    typeof data.meta?.custom_data?.userId === "string"
      ? data.meta.custom_data.userId
      : typeof data.meta?.custom_data?.user_id === "string"
        ? data.meta.custom_data.user_id
        : null;

  if (payloadUserId && payloadUserId === userId) {
    const id = data.data?.id;
    return id !== undefined && id !== null ? String(id) : null;
  }

  const payloadEmail = data.data?.attributes?.user_email;
  if (
    userEmail &&
    typeof payloadEmail === "string" &&
    payloadEmail.toLowerCase() === userEmail.toLowerCase()
  ) {
    const id = data.data?.id;
    return id !== undefined && id !== null ? String(id) : null;
  }

  return null;
}

async function findMpRemoteSubscriptionId(userId: string) {
  const events = await import("@/lib/prisma").then(({ prisma }) =>
    prisma.paymentEvent.findMany({
      where: {
        provider: "mp",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
      select: {
        payload: true,
      },
    }),
  );

  for (const event of events) {
    const remoteId = extractMpRemoteId(event.payload, userId);
    if (remoteId) return remoteId;
  }

  return null;
}

async function findLemonRemoteSubscriptionId(
  userId: string,
  userEmail?: string | null,
) {
  const prismaModule = await import("@/lib/prisma");

  const events = await prismaModule.prisma.paymentEvent.findMany({
    where: {
      provider: "lemon",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
    select: {
      payload: true,
    },
  });

  for (const event of events) {
    const remoteId = extractLemonRemoteId(event.payload, userId, userEmail);
    if (remoteId) return remoteId;
  }

  if (!userEmail) return null;

  const res = await fetch(
    `https://api.lemonsqueezy.com/v1/subscriptions?filter[user_email]=${encodeURIComponent(
      userEmail,
    )}`,
    {
      method: "GET",
      headers: lemonHeaders(),
    },
  );

  if (!res.ok) {
    return null;
  }

  const json = await res.json();

  type LemonSubscriptionListItem = {
    id?: string | number | null;
    attributes?: {
      status?: string | null;
    } | null;
  };

  const subscriptions: LemonSubscriptionListItem[] = Array.isArray(json?.data)
    ? (json.data as LemonSubscriptionListItem[])
    : [];

  const preferred = subscriptions.find((item) => {
    const status = String(item.attributes?.status || "");
    return ["active", "cancelled", "paused", "past_due", "unpaid"].includes(
      status,
    );
  });

  if (preferred?.id !== undefined && preferred.id !== null) {
    return String(preferred.id);
  }

  return null;
}

async function cancelMpSubscription(
  remoteId: string,
): Promise<CancelSubscriptionResult> {
  const res = await fetch(
    `https://api.mercadopago.com/preapproval/${remoteId}`,
    {
      method: "PUT",
      headers: mpHeaders(),
      body: JSON.stringify({
        status: "cancelled",
      }),
    },
  );

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      json?.message || "No se pudo cancelar la suscripción de Mercado Pago.",
    );
  }

  return {
    remoteId,
    status: "CANCELLED",
    currentPeriodEnd:
      parseProviderDate(json?.next_payment_date) ||
      parseProviderDate(json?.auto_recurring?.end_date) ||
      null,
  };
}

async function cancelLemonSubscription(
  remoteId: string,
): Promise<CancelSubscriptionResult> {
  const res = await fetch(
    `https://api.lemonsqueezy.com/v1/subscriptions/${remoteId}`,
    {
      method: "DELETE",
      headers: lemonHeaders(),
    },
  );

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      json?.errors?.[0]?.detail ||
        "No se pudo cancelar la suscripción de Lemon.",
    );
  }

  const attributes = json?.data?.attributes;

  return {
    remoteId,
    status: "CANCELLED",
    currentPeriodEnd:
      parseProviderDate(attributes?.ends_at) ||
      parseProviderDate(attributes?.renews_at) ||
      null,
  };
}

export async function cancelPaidSubscription({
  userId,
  userEmail,
  source,
  providerSubscriptionId,
}: CancelSubscriptionParams): Promise<CancelSubscriptionResult> {
  if (source === "MP") {
    const remoteId =
      providerSubscriptionId || (await findMpRemoteSubscriptionId(userId));

    if (!remoteId) {
      throw new Error(
        "No se encontró la suscripción remota de Mercado Pago para cancelar.",
      );
    }

    return cancelMpSubscription(remoteId);
  }

  if (source === "LEMON") {
    const remoteId =
      providerSubscriptionId ||
      (await findLemonRemoteSubscriptionId(userId, userEmail));

    if (!remoteId) {
      throw new Error(
        "No se encontró la suscripción remota de Lemon para cancelar.",
      );
    }

    return cancelLemonSubscription(remoteId);
  }

  if (source === "MANUAL") {
    return {
      remoteId: null,
      status: "CANCELLED",
      currentPeriodEnd: null,
    };
  }

  throw new Error("Esta suscripción no admite cancelación remota.");
}
