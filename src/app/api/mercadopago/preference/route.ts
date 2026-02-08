import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Preference } from "mercadopago";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(req: Request) {
  try {
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
            title: "Informe de riesgo empresarial",
            quantity: 1,
            unit_price: 100,
            currency_id: "ARS",
          },
        ],
        external_reference: report.id,
        back_urls: {
          success: "https://example.com/success",
          failure: "https://example.com/failure",
          pending: "https://example.com/pending",
        },
      },
    });

    return NextResponse.json({
      init_point: preference.init_point,
    });
  } catch (error) {
    console.error("MP preference error", error);
    return NextResponse.json({ error: "Error MercadoPago" }, { status: 500 });
  }
}
