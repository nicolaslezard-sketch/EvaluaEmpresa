export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { safeJsonParse } from "@/lib/analysis/parseReport";

type RouteContext = { params: Promise<{ id: string }> };

function buildPreviewPrompt(formData: unknown) {
  return `
Sos un sistema de evaluación empresarial. Devolvé JSON válido SOLO JSON.

Objetivo: generar una VISTA PREVIA ejecutiva para que el usuario vea el score antes de pagar.

Salida JSON OBLIGATORIA:
{
  "overallScore": number (0-100),
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "pillarScores": {
    "financial": number (0-100),
    "commercial": number (0-100),
    "operational": number (0-100),
    "legal": number (0-100),
    "strategic": number (0-100)
  },
  "oneStrength": string,
  "oneWeakness": string
}

Reglas:
- No menciones IA.
- No repitas literalmente datos.
- Sé sobrio y ejecutivo.
- Valores realistas y coherentes.

DATOS:
${JSON.stringify(formData)}
`;
}

export async function POST(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const report = await prisma.reportRequest.findUnique({ where: { id } });
  if (!report)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (report.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (report.status !== "PENDING_PAYMENT") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (
    !report.formData ||
    typeof report.formData !== "object" ||
    Array.isArray(report.formData)
  ) {
    return NextResponse.json({ error: "Invalid formData" }, { status: 400 });
  }

  const fd = report.formData as Record<string, unknown>;

  // ya existe preview
  if (fd.preScore) {
    return NextResponse.json({ preScore: fd.preScore });
  }

  const prompt = buildPreviewPrompt(report.formData);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const text = completion.choices[0].message.content;
  if (!text)
    return NextResponse.json({ error: "Empty response" }, { status: 500 });

  type PreviewRaw = {
    overallScore?: unknown;
    riskLevel?: unknown;
    pillarScores?: {
      financial?: unknown;
      commercial?: unknown;
      operational?: unknown;
      legal?: unknown;
      strategic?: unknown;
    };
    oneStrength?: unknown;
    oneWeakness?: unknown;
  };

  const raw = safeJsonParse(text) as PreviewRaw;

  const preScore = {
    overallScore: typeof raw.overallScore === "number" ? raw.overallScore : 0,

    riskLevel:
      raw.riskLevel === "LOW" ||
      raw.riskLevel === "MEDIUM" ||
      raw.riskLevel === "HIGH"
        ? raw.riskLevel
        : "MEDIUM",

    pillarScores: {
      financial:
        typeof raw.pillarScores?.financial === "number"
          ? raw.pillarScores.financial
          : 0,

      commercial:
        typeof raw.pillarScores?.commercial === "number"
          ? raw.pillarScores.commercial
          : 0,

      operational:
        typeof raw.pillarScores?.operational === "number"
          ? raw.pillarScores.operational
          : 0,

      legal:
        typeof raw.pillarScores?.legal === "number"
          ? raw.pillarScores.legal
          : 0,

      strategic:
        typeof raw.pillarScores?.strategic === "number"
          ? raw.pillarScores.strategic
          : 0,
    },

    oneStrength:
      typeof raw.oneStrength === "string" ? raw.oneStrength.slice(0, 220) : "",

    oneWeakness:
      typeof raw.oneWeakness === "string" ? raw.oneWeakness.slice(0, 220) : "",
  };

  // guardamos dentro de formData para evitar migración
  const nextFormData = { ...fd, preScore };

  await prisma.reportRequest.update({
    where: { id },
    data: { formData: nextFormData },
  });

  return NextResponse.json({ preScore });
}
