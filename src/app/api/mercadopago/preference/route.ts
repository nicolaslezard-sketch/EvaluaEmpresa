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

    const { reportId } = await req.json();

    if (!reportId) {
      return NextResponse.json(
        { error: "reportId requerido" },
        { status: 400 },
      );
    }

    const report = await prisma.reportRequest.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Reporte no encontrado" },
        { status: 404 },
      );
    }

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
        back_urls: {
          success: `${APP_URL}/api/mercadopago/return`,
          failure: `${APP_URL}/success?status=failure`,
          pending: `${APP_URL}/success?status=pending`,
        },
        auto_return: "approved",
        external_reference: reportId,
      },
    });

    return NextResponse.json({
      init_point: preference.init_point,
      sandbox_init_point: preference.sandbox_init_point,
    });
  } catch {
    return NextResponse.json(
      { error: "Error creando preferencia" },
      { status: 500 },
    );
  }
}
