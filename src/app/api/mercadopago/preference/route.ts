export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { prisma } from "@/lib/prisma";

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Falta env ${name}`);
  return v;
}

const mp = new MercadoPagoConfig({
  accessToken: requireEnv("MP_ACCESS_TOKEN"),
});

export async function POST(req: Request) {
  try {
    const APP_URL = requireEnv("APP_URL");

    const body = await req.json();
    const { reportId } = body;

    if (!reportId || typeof reportId !== "string") {
      return NextResponse.json(
        { error: "reportId requerido" },
        { status: 400 },
      );
    }

    // 🔎 Validar reporte
    const report = await prisma.reportRequest.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        status: true,
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Reporte no encontrado" },
        { status: 404 },
      );
    }

    // 🔒 Evitar pagar dos veces
    if (report.status !== "PENDING_PAYMENT") {
      return NextResponse.json(
        { error: "El reporte no está disponible para pago" },
        { status: 400 },
      );
    }

    // 💳 Crear preferencia MP
    const preference = await new Preference(mp).create({
      body: {
        items: [
          {
            id: "evaluaempresa-informe",
            title: "Informe de Riesgo Empresarial",
            quantity: 1,
            unit_price: 100,
            currency_id: "ARS",
          },
        ],
        external_reference: reportId,

        back_urls: {
          success: `${APP_URL}/api/mercadopago/return`,
          failure: `${APP_URL}/success?status=failure`,
          pending: `${APP_URL}/success?status=pending`,
        },

        auto_return: "approved",
      },
    });

    return NextResponse.json({
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });
  } catch (error) {
    console.error("[MP_PREFERENCE_ERROR]", error);

    return NextResponse.json(
      { error: "Error creando preferencia" },
      { status: 500 },
    );
  }
}
