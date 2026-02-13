export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPreapprovalById } from "@/lib/mercadopago/client";
import { Plan } from "@prisma/client";

function mapSubStatus(
  mpStatus: string,
): "PENDING" | "AUTHORIZED" | "PAUSED" | "CANCELLED" | "EXPIRED" | "FAILED" {
  const s = (mpStatus || "").toLowerCase();
  if (s === "authorized") return "AUTHORIZED";
  if (s === "paused") return "PAUSED";
  if (s === "cancelled" || s === "canceled") return "CANCELLED";
  if (s === "expired") return "EXPIRED";
  if (s === "rejected" || s === "failed") return "FAILED";
  return "PENDING";
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const preapprovalId =
      body?.data?.id || body?.id || body?.resource?.split("/")?.pop();

    if (!preapprovalId || typeof preapprovalId !== "string") {
      return NextResponse.json({ ok: true });
    }

    const mp = await getPreapprovalById(preapprovalId);
    const status = mapSubStatus(mp.status);

    const sub = await prisma.subscription.findFirst({
      where: { mpPreapprovalId: preapprovalId },
      select: { id: true, userId: true },
    });

    if (!sub) return NextResponse.json({ ok: true });

    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        status,
        mpStatus: mp.status,
        currentPeriodStart: mp.auto_recurring?.start_date
          ? new Date(mp.auto_recurring.start_date)
          : undefined,
        currentPeriodEnd: mp.auto_recurring?.end_date
          ? new Date(mp.auto_recurring.end_date)
          : undefined,
      },
    });

    const nextPlan = status === "AUTHORIZED" ? Plan.PRO : Plan.FREE;

    await prisma.user.update({
      where: { id: sub.userId },
      data: { plan: nextPlan },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[MP_SUBSCRIPTION_WEBHOOK_ERROR]", error);
    return NextResponse.json({ ok: true });
  }
}
