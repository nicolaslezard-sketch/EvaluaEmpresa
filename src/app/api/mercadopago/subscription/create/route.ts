export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Plan } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createPreapproval } from "@/lib/mercadopago/client";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.plan === Plan.PRO) {
      return NextResponse.json({ error: "Already PRO" }, { status: 400 });
    }

    const amount = Number(process.env.EE_PRO_PRICE_ARS ?? "0");
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Config inválida: EE_PRO_PRICE_ARS" },
        { status: 500 },
      );
    }

    const APP_URL = process.env.APP_URL!;
    const reason = process.env.EE_PRO_REASON ?? "EvaluaEmpresa – Plan PRO";

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
