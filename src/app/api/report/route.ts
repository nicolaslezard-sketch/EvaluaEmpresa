export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

import { AssessmentV2Schema } from "@/lib/assessment/v2/schema";
import { normalizeAssessmentV2 } from "@/lib/assessment/v2/normalize";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { assessment, tier } = body;

    // Validación básica de tier
    if (tier !== "PYME" && tier !== "EMPRESA") {
      return NextResponse.json({ error: "Tier inválido" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Email: prioridad assessment, fallback session
    const emailFromBody =
      typeof assessment?.email === "string" ? assessment.email.trim() : "";

    const email = emailFromBody || session.user.email || "";

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    // Armamos payload v2
    const payload = {
      ...assessment,
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

    const formData = {
      version: "v2",
      tier, // 👈 guardamos tier en snapshot
      submittedAt: new Date().toISOString(),
      answers: parsed.data,
      metrics,
      inconsistencies,
      preScore: null,
    };

    const report = await prisma.reportRequest.create({
      data: {
        userId: session.user.id,
        email,
        tier, // 👈 NUEVO CAMPO EN DB
        title: `Evaluación ${
          parsed.data.perfil.nombreComercial || parsed.data.perfil.razonSocial
        }`.slice(0, 120),
        formData,
      },
    });

    return NextResponse.json({ id: report.id });
  } catch (error) {
    console.error("Error creando reporte:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
