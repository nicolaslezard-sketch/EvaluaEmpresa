import { prisma } from "@/lib/prisma";
import {
  calculateScore,
  computeDeltas,
  generateAlerts,
  validateRequiredStructured,
  type EvaluationInput,
} from "@/lib/engine";
import type { EvaluationFormData } from "@/lib/types/evaluationForm";

/**
 * 1️⃣ Crear o reutilizar Draft
 */
export async function createOrReuseDraft(companyId: string) {
  const existing = await prisma.evaluation.findFirst({
    where: {
      companyId,
      status: "DRAFT",
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.evaluation.create({
    data: {
      companyId,
      status: "DRAFT",
      formData: {},
    },
  });
}

/**
 * 2️⃣ Expiración lazy (14 días)
 */
export async function expireIfNeeded(evaluationId: string) {
  const evalData = await prisma.evaluation.findUnique({
    where: { id: evaluationId },
  });

  if (!evalData || evalData.status !== "DRAFT") {
    return evalData;
  }

  const now = new Date().getTime();
  const created = new Date(evalData.createdAt).getTime();

  const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));

  if (diffDays > 14) {
    return prisma.evaluation.update({
      where: { id: evaluationId },
      data: { status: "EXPIRED" },
    });
  }

  return evalData;
}

/**
 * 3️⃣ Patch Draft (merge formData)
 */

export async function patchDraft(
  evaluationId: string,
  partialData: EvaluationFormData,
) {
  const existing = await prisma.evaluation.findUnique({
    where: { id: evaluationId },
  });

  if (!existing || existing.status !== "DRAFT") {
    throw new Error("Evaluation not editable");
  }

  const current = (existing.formData ?? {}) as EvaluationFormData;

  const merged: EvaluationFormData = {
    financial: {
      ...(current.financial ?? {}),
      ...(partialData.financial ?? {}),
    },
    commercial: {
      ...(current.commercial ?? {}),
      ...(partialData.commercial ?? {}),
    },
    operational: {
      ...(current.operational ?? {}),
      ...(partialData.operational ?? {}),
    },
    legal: { ...(current.legal ?? {}), ...(partialData.legal ?? {}) },
    strategic: {
      ...(current.strategic ?? {}),
      ...(partialData.strategic ?? {}),
    },
    context: { ...(current.context ?? {}), ...(partialData.context ?? {}) },
  };

  return prisma.evaluation.update({
    where: { id: evaluationId },
    data: { formData: merged },
  });
}

/**
 * 4️⃣ Finalize (transacción)
 */
export async function finalizeEvaluation(evaluationId: string) {
  // 1) Finalizamos en DB y devolvemos lo necesario para el post-proceso
  const finalized = await prisma.$transaction(async (tx) => {
    const evaluation = await tx.evaluation.findUnique({
      where: { id: evaluationId },
      include: {
        company: true,
      },
    });

    if (!evaluation || evaluation.status !== "DRAFT") {
      throw new Error("Invalid evaluation state");
    }

    const validation = validateRequiredStructured(
      evaluation.formData as EvaluationInput,
    );

    if (validation) {
      throw new Error("Incomplete evaluation sections");
    }

    const previous = await tx.evaluation.findFirst({
      where: {
        companyId: evaluation.companyId,
        status: "FINALIZED",
      },
      orderBy: { createdAt: "desc" },
    });

    const score = calculateScore(evaluation.formData as EvaluationInput);

    const prevPayload = previous
      ? {
          engineVersion: previous.engineVersion,
          overallScore: previous.overallScore ?? 0,
          executiveCategory: previous.executiveCategory ?? "ESTABLE",
          pillars: {
            financial: previous.financialScore ?? 0,
            commercial: previous.commercialScore ?? 0,
            operational: previous.operationalScore ?? 0,
            legal: previous.legalScore ?? 0,
            strategic: previous.strategicScore ?? 0,
          },
        }
      : null;

    const deltas = computeDeltas(score, prevPayload);

    const alerts = generateAlerts({
      companyCriticality: evaluation.company.criticality,
      current: score,
      previous: prevPayload,
      deltas,
    });

    // Finalizar de forma "race-safe"
    const updated = await tx.evaluation.updateMany({
      where: { id: evaluationId, status: "DRAFT" },
      data: {
        status: "FINALIZED",
        engineVersion: score.engineVersion,
        overallScore: score.overallScore,
        executiveCategory: score.executiveCategory,
        financialScore: score.pillars.financial,
        commercialScore: score.pillars.commercial,
        operationalScore: score.pillars.operational,
        legalScore: score.pillars.legal,
        strategicScore: score.pillars.strategic,
        deltaOverall: deltas.overall,
        deltaFinancial: deltas.pillars.financial,
        deltaCommercial: deltas.pillars.commercial,
        deltaOperational: deltas.pillars.operational,
        deltaLegal: deltas.pillars.legal,
        deltaStrategic: deltas.pillars.strategic,
      },
    });

    if (updated.count === 0) {
      throw new Error("Evaluation already finalized");
    }

    if (alerts.length > 0) {
      await tx.alert.createMany({
        data: alerts.map((a) => ({
          companyId: evaluation.companyId,
          evaluationId: evaluation.id,
          severity: a.severity,
          type: a.type,
          message: a.message,
        })),
      });
    }

    // Re-fetch FINALIZED (para tener el estado actual y reportData/pdfKey)
    const finalizedNow = await tx.evaluation.findUnique({
      where: { id: evaluationId },
      include: { company: true },
    });

    if (!finalizedNow) throw new Error("Finalize failed");

    return finalizedNow;
  });

  return finalized;
}
