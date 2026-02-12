export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { AssessmentV2Schema } from "@/lib/assessment/v2/schema";
import { normalizeAssessmentV2 } from "@/lib/assessment/v2/normalize";

export async function POST(req: Request) {
  try {
    const raw = await req.json();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Email: prioridad body, fallback session
    const emailFromBody =
      typeof raw?.email === "string" ? raw.email.trim() : "";
    const email = emailFromBody || session.user.email || "";
    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    // Armamos payload v2 (forzamos version + email)
    const payload = {
      ...raw,
      version: "v2",
      email,
    };

    const parsed = AssessmentV2Schema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Formulario inválido",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { metrics, inconsistencies } = normalizeAssessmentV2(parsed.data);

    // Guardamos TODO dentro de formData (sin migraciones)
    const formData = {
      version: "v2",
      submittedAt: new Date().toISOString(),
      answers: parsed.data,
      metrics,
      inconsistencies,
      // scoring vendrá después (Fase 2)
      preScore: null,
    };

    const report = await prisma.reportRequest.create({
      data: {
        userId: session.user.id,
        email,
        title:
          `Evaluación ${parsed.data.perfil.nombreComercial || parsed.data.perfil.razonSocial}`.slice(
            0,
            120,
          ),
        formData,
      },
    });

    return NextResponse.json({ id: report.id });
  } catch (error) {
    console.error("Error creando reporte:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
