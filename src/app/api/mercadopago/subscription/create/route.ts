export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPreapproval } from "@/lib/mercadopago/client";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { tier } = body as { tier: "PYME" | "EMPRESA" };

    if (!tier || !["PYME", "EMPRESA"].includes(tier)) {
      return NextResponse.json({ error: "Tier inválido" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { subscription: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Si ya tiene suscripción activa
    if (user.subscription?.status === "AUTHORIZED") {
      return NextResponse.json(
        { error: "Ya tiene una suscripción activa" },
        { status: 400 },
      );
    }

    const priceEnv =
      tier === "PYME"
        ? process.env.EE_PRICE_PYME_ARS
        : process.env.EE_PRICE_EMPRESA_ARS;

    const amount = Number(priceEnv ?? "0");

    if (!amount || Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Config inválida de precios" },
        { status: 500 },
      );
    }

    const APP_URL = process.env.APP_URL!;
    const reason =
      tier === "PYME"
        ? "EvaluaEmpresa – Plan PYME"
        : "EvaluaEmpresa – Plan EMPRESA";

    const { init_point } = await createPreapproval({
      reason,
      payerEmail: user.email,
      amount,
      currencyId: "ARS",
      frequency: 1,
      frequencyType: "months",
      backUrl: `${APP_URL}/app/dashboard?upgrade=return`,
      notificationUrl: `${APP_URL}/api/mercadopago/subscription/webhook`,
    });

    return NextResponse.json({ url: init_point });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error creando suscripción" },
      { status: 500 },
    );
  }
}
