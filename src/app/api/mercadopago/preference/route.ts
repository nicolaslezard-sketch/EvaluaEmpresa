export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { reportId, type } = body;

    if (!reportId || typeof reportId !== "string") {
      return NextResponse.json(
        { error: "reportId requerido" },
        { status: 400 },
      );
    }

    if (!["REPORT_GENERATION", "REPORT_UNLOCK"].includes(type)) {
      return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
    }

    const report = await prisma.reportRequest.findUnique({
      where: { id: reportId },
      select: {
        id: true,
        status: true,
        userId: true,
      },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Reporte no encontrado" },
        { status: 404 },
      );
    }

    // ===============================
    // VALIDACIONES SEGÚN TIPO
    // ===============================

    if (type === "REPORT_GENERATION") {
      if (report.status !== "PENDING_PAYMENT") {
        return NextResponse.json(
          { error: "El reporte no está disponible para pago" },
          { status: 400 },
        );
      }
    }

    if (type === "REPORT_UNLOCK") {
      // Evitar doble unlock
      const existingUnlock = await prisma.reportUnlock.findUnique({
        where: {
          userId_reportId: {
            userId: session.user.id,
            reportId,
          },
        },
      });

      if (existingUnlock) {
        return NextResponse.json({ error: "Ya desbloqueado" }, { status: 400 });
      }
    }

    // ===============================
    // CREAR PREFERENCE
    // ===============================

    const preference = await new Preference(mp).create({
      body: {
        items: [
          {
            id:
              type === "REPORT_UNLOCK"
                ? "evaluaempresa-unlock"
                : "evaluaempresa-informe",
            title:
              type === "REPORT_UNLOCK"
                ? "Desbloqueo de Informe Empresarial"
                : "Generación de Informe Empresarial",
            quantity: 1,
            unit_price: 100, // Ajustar precio dinámicamente si querés
            currency_id: "ARS",
          },
        ],

        external_reference: reportId,

        metadata: {
          type,
          reportId,
          userId: session.user.id,
        },

        back_urls: {
          success: `${APP_URL}/app/analysis/${reportId}`,
          failure: `${APP_URL}/app/analysis/${reportId}`,
          pending: `${APP_URL}/app/analysis/${reportId}`,
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
