import type {
  AlertSeverity,
  CriticalityLevel,
  ExecutiveCategory,
} from "@prisma/client";

export type ReportData = {
  executiveSummary: string;
  keyFindings: string[];
  priorityRisks: string[];
  recommendations: string[];
  nextReviewSuggestedDays: number | null;
};

type ScorePayload = {
  overallScore: number;
  executiveCategory: ExecutiveCategory;
  pillars: {
    financial: number;
    commercial: number;
    operational: number;
    legal: number;
    strategic: number;
  };
};

type DeltaPayload = {
  overall: number;
  pillars: {
    financial: number;
    commercial: number;
    operational: number;
    legal: number;
    strategic: number;
  };
};

type InputAlert = {
  severity: AlertSeverity;
  type: string;
  message: string;
};

type BuildReportDataInput = {
  companyName: string;
  criticality: CriticalityLevel;
  score: ScorePayload;
  deltas: DeltaPayload;
  alerts: InputAlert[];
};

function pillarLabel(key: keyof ScorePayload["pillars"]) {
  switch (key) {
    case "financial":
      return "Financiero";
    case "commercial":
      return "Comercial";
    case "operational":
      return "Operativo";
    case "legal":
      return "Legal";
    case "strategic":
      return "Estratégico";
  }
}

function getWeakestPillars(
  pillars: ScorePayload["pillars"],
  limit = 2,
): Array<{ key: keyof ScorePayload["pillars"]; value: number }> {
  return Object.entries(pillars)
    .map(([key, value]) => ({
      key: key as keyof ScorePayload["pillars"],
      value,
    }))
    .sort((a, b) => a.value - b.value)
    .slice(0, limit);
}

function getStrongestPillars(
  pillars: ScorePayload["pillars"],
  limit = 2,
): Array<{ key: keyof ScorePayload["pillars"]; value: number }> {
  return Object.entries(pillars)
    .map(([key, value]) => ({
      key: key as keyof ScorePayload["pillars"],
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function getMostNegativeDeltas(
  deltas: DeltaPayload["pillars"],
  limit = 2,
): Array<{ key: keyof DeltaPayload["pillars"]; value: number }> {
  return Object.entries(deltas)
    .map(([key, value]) => ({
      key: key as keyof DeltaPayload["pillars"],
      value,
    }))
    .filter((item) => item.value < 0)
    .sort((a, b) => a.value - b.value)
    .slice(0, limit);
}

function buildExecutiveSummary({
  companyName,
  criticality,
  score,
  alerts,
}: Pick<
  BuildReportDataInput,
  "companyName" | "criticality" | "score" | "alerts"
>) {
  const alertCount = alerts.length;
  const criticalAlerts = alerts.filter((a) => a.severity === "CRITICAL").length;

  const base =
    `La evaluación actual de ${companyName} ubica a la empresa en la categoría ` +
    `${score.executiveCategory.toLowerCase()} con un score general de ${score.overallScore.toFixed(1)}.`;

  const criticalityText =
    criticality === "HIGH"
      ? " Dado que se trata de una relación de alta criticidad, cualquier desvío relevante requiere seguimiento prioritario."
      : criticality === "MEDIUM"
        ? " Al tratarse de una relación de criticidad media, conviene mantener seguimiento periódico y revisión ante cambios relevantes."
        : " La criticidad actual permite un seguimiento más espaciado, siempre que no aparezcan señales nuevas de deterioro.";

  const alertText =
    alertCount === 0
      ? " No se generaron alertas persistidas en este ciclo."
      : criticalAlerts > 0
        ? ` Se registraron ${alertCount} alertas, incluyendo ${criticalAlerts} de severidad crítica.`
        : ` Se registraron ${alertCount} alertas persistidas en este ciclo.`;

  return `${base}${alertText}${criticalityText}`;
}

function buildKeyFindings({
  score,
  deltas,
}: Pick<BuildReportDataInput, "score" | "deltas">): string[] {
  const findings: string[] = [];

  const weakest = getWeakestPillars(score.pillars, 2);
  const strongest = getStrongestPillars(score.pillars, 1);
  const negativeDeltas = getMostNegativeDeltas(deltas.pillars, 2);

  if (weakest.length > 0) {
    findings.push(
      `Los pilares más débiles del ciclo actual son ${weakest
        .map((p) => `${pillarLabel(p.key)} (${p.value.toFixed(1)})`)
        .join(" y ")}.`,
    );
  }

  if (strongest.length > 0) {
    findings.push(
      `El principal punto relativamente favorable se observa en ${pillarLabel(
        strongest[0].key,
      )} (${strongest[0].value.toFixed(1)}).`,
    );
  }

  if (deltas.overall < 0) {
    findings.push(
      `El score general muestra una caída de ${Math.abs(deltas.overall).toFixed(1)} puntos respecto de la evaluación anterior.`,
    );
  } else if (deltas.overall > 0) {
    findings.push(
      `El score general mejora ${deltas.overall.toFixed(1)} puntos respecto del ciclo anterior.`,
    );
  } else {
    findings.push(
      "El score general se mantiene estable respecto del ciclo anterior.",
    );
  }

  if (negativeDeltas.length > 0) {
    findings.push(
      `Los mayores deterioros relativos se observan en ${negativeDeltas
        .map((p) => `${pillarLabel(p.key)} (${p.value.toFixed(1)})`)
        .join(" y ")}.`,
    );
  }

  return findings.slice(0, 4);
}

function buildPriorityRisks({
  criticality,
  score,
  alerts,
}: Pick<BuildReportDataInput, "criticality" | "score" | "alerts">): string[] {
  const risks: string[] = [];

  const weakest = getWeakestPillars(score.pillars, 2);

  for (const pillar of weakest) {
    if (pillar.value < 60) {
      risks.push(
        `El pilar ${pillarLabel(
          pillar.key,
        )} presenta un nivel bajo (${pillar.value.toFixed(1)}), lo que puede afectar la confiabilidad operativa o estratégica de la relación.`,
      );
    }
  }

  const criticalOrWarningAlerts = alerts.filter(
    (a) => a.severity === "CRITICAL" || a.severity === "WARNING",
  );

  for (const alert of criticalOrWarningAlerts.slice(0, 2)) {
    risks.push(alert.message);
  }

  if (criticality === "HIGH" && score.overallScore < 70) {
    risks.push(
      "La combinación de score moderado o bajo con criticidad alta incrementa la exposición del vínculo y justifica seguimiento reforzado.",
    );
  }

  if (risks.length === 0) {
    risks.push(
      "No se identifican riesgos prioritarios de alta urgencia en este ciclo, aunque se recomienda sostener monitoreo periódico.",
    );
  }

  return risks.slice(0, 4);
}

function buildRecommendations({
  criticality,
  score,
  deltas,
  alerts,
}: Pick<
  BuildReportDataInput,
  "criticality" | "score" | "deltas" | "alerts"
>): string[] {
  const recommendations: string[] = [];

  if (deltas.overall < 0) {
    recommendations.push(
      "Realizar una reevaluación focalizada sobre los factores que explican la caída del score general antes del próximo ciclo regular.",
    );
  }

  const weakest = getWeakestPillars(score.pillars, 2);
  for (const pillar of weakest) {
    if (pillar.value < 65) {
      recommendations.push(
        `Profundizar el análisis del frente ${pillarLabel(
          pillar.key,
        ).toLowerCase()} y validar medidas correctivas o controles adicionales.`,
      );
    }
  }

  if (alerts.some((a) => a.severity === "CRITICAL")) {
    recommendations.push(
      "Escalar internamente la revisión del caso y definir si corresponde seguimiento extraordinario o medidas de mitigación adicionales.",
    );
  }

  if (criticality === "HIGH") {
    recommendations.push(
      "Mantener frecuencia de monitoreo corta debido a la criticidad de la relación, aun cuando no existan incidentes inmediatos.",
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Mantener monitoreo periódico y actualizar la evaluación ante cualquier cambio relevante en la relación o en la operatoria.",
    );
  }

  return recommendations.slice(0, 4);
}

function suggestNextReviewDays({
  criticality,
  score,
  alerts,
}: Pick<BuildReportDataInput, "criticality" | "score" | "alerts">):
  | number
  | null {
  const hasCriticalAlert = alerts.some((a) => a.severity === "CRITICAL");
  const hasAnyAlert = alerts.length > 0;

  if (hasCriticalAlert) return 30;
  if (criticality === "HIGH" && score.overallScore < 70) return 30;
  if (criticality === "HIGH") return 45;
  if (hasAnyAlert) return 60;
  if (criticality === "MEDIUM") return 90;
  if (criticality === "LOW" && score.overallScore >= 75) return 180;

  return 120;
}

export function buildReportData(input: BuildReportDataInput): ReportData {
  return {
    executiveSummary: buildExecutiveSummary(input),
    keyFindings: buildKeyFindings(input),
    priorityRisks: buildPriorityRisks(input),
    recommendations: buildRecommendations(input),
    nextReviewSuggestedDays: suggestNextReviewDays(input),
  };
}
