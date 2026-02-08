import { NextResponse } from "next/server";
import MercadoPagoConfig, { Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN_TEST!,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const reportId = formData.get("reportId") as string;

  if (!reportId) {
    return NextResponse.json({ error: "Missing reportId" }, { status: 400 });
  }

  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items: [
        {
          id: reportId,
          title: "Informe de Riesgo Empresarial",
          quantity: 1,
          unit_price: 5000,
        },
      ],
      back_urls: {
        success: `http://localhost:3000/report/${reportId}?paid=success`,
        pending: `http://localhost:3000/report/${reportId}?paid=pending`,
        failure: `http://localhost:3000/report/${reportId}?paid=failure`,
      },
      auto_return: "approved",
    },
  });

  return NextResponse.redirect(result.init_point!);
}
