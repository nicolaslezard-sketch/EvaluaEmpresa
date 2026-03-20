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

function scoreState(score: number) {
  if (score >= 80) return "strong";
  if (score >= 65) return "stable";
  if (score >= 50) return "vulnerable";
  return "critical";
}

function hasMeaningfulSpread(pillars: ScorePayload["pillars"]) {
  const values = Object.values(pillars);
  const min = Math.min(...values);
  const max = Math.max(...values);
  return max - min >= 8;
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
  const overallState = scoreState(score.overallScore);

  let base = "";

  if (overallState === "strong") {
    base =
      `La evaluación actual de ${companyName} ubica a la empresa en una posición sólida, ` +
      `con un score general de ${score.overallScore.toFixed(1)} y una exposición relativamente acotada en este ciclo.`;
  } else if (overallState === "stable") {
    base =
      `La evaluación actual de ${companyName} ubica a la empresa en una posición estable, ` +
      `con un score general de ${score.overallScore.toFixed(1)} y fundamentos razonables para sostener la relación bajo monitoreo preventivo.`;
  } else if (overallState === "vulnerable") {
    base =
      `La evaluación actual de ${companyName} ubica a la empresa en una posición vulnerable, ` +
      `con un score general de ${score.overallScore.toFixed(1)} y señales que justifican seguimiento reforzado.`;
  } else {
    base =
      `La evaluación actual de ${companyName} ubica a la empresa en una posición crítica, ` +
      `con un score general de ${score.overallScore.toFixed(1)} y necesidad de revisión prioritaria sobre los frentes más sensibles.`;
  }

  const criticalityText =
    criticality === "HIGH"
      ? " Dado que se trata de una relación de alta criticidad, conviene sostener seguimiento mensual y tratar cualquier desvío relevante con prioridad."
      : criticality === "MEDIUM"
        ? " Al tratarse de una relación de criticidad media, conviene sostener revisión mensual y validar cambios relevantes sin demoras."
        : " Aun con criticidad baja, se recomienda revisión mensual liviana para detectar cambios tempranos y mantener el perfil actualizado.";

  const alertText =
    alertCount === 0
      ? " No se registraron alertas persistidas en este ciclo."
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
  const strongest = getStrongestPillars(score.pillars, 2);
  const negativeDeltas = getMostNegativeDeltas(deltas.pillars, 2);
  const overallState = scoreState(score.overallScore);
  const spread = hasMeaningfulSpread(score.pillars);

  if (overallState === "strong") {
    findings.push(
      `El perfil general del ciclo es sólido, con un score de ${score.overallScore.toFixed(1)} y sin señales estructurales severas inmediatas.`,
    );

    if (spread && strongest.length > 0) {
      findings.push(
        `Los pilares con mejor desempeño relativo son ${strongest
          .map((p) => `${pillarLabel(p.key)} (${p.value.toFixed(1)})`)
          .join(" y ")}.`,
      );
    } else {
      findings.push(
        "Los cinco pilares muestran un comportamiento homogéneo y favorable, sin brechas internas relevantes en este ciclo.",
      );
    }
  } else {
    if (weakest.length > 0) {
      findings.push(
        `Los pilares de menor desempeño relativo son ${weakest
          .map((p) => `${pillarLabel(p.key)} (${p.value.toFixed(1)})`)
          .join(" y ")}.`,
      );
    }

    if (strongest.length > 0) {
      findings.push(
        `El frente relativamente más sólido se observa en ${pillarLabel(
          strongest[0].key,
        )} (${strongest[0].value.toFixed(1)}).`,
      );
    }
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
      "No se observa variación del score general respecto del ciclo anterior.",
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
  const overallState = scoreState(score.overallScore);

  for (const pillar of weakest) {
    if (pillar.value < 60) {
      risks.push(
        `El pilar ${pillarLabel(
          pillar.key,
        )} presenta un nivel comprometido (${pillar.value.toFixed(1)}), lo que puede impactar la confiabilidad operativa, contractual o estratégica del vínculo.`,
      );
    } else if (pillar.value < 70 && overallState !== "strong") {
      risks.push(
        `El pilar ${pillarLabel(
          pillar.key,
        )} requiere seguimiento preventivo (${pillar.value.toFixed(1)}), ya que concentra parte relevante de la fragilidad relativa del ciclo.`,
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
      "La combinación de score moderado o bajo con criticidad alta incrementa la exposición del vínculo y justifica un esquema de seguimiento reforzado.",
    );
  }

  if (risks.length === 0) {
    if (overallState === "strong") {
      risks.push(
        "No se identifican riesgos prioritarios de alta urgencia en este ciclo; la recomendación principal es sostener monitoreo periódico para detectar cambios tempranos.",
      );
    } else {
      risks.push(
        "No se identifican riesgos críticos inmediatos adicionales en este ciclo, aunque conviene mantener seguimiento preventivo sobre los frentes de menor desempeño relativo.",
      );
    }
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
  const weakest = getWeakestPillars(score.pillars, 2);
  const overallState = scoreState(score.overallScore);

  if (deltas.overall < 0) {
    recommendations.push(
      "Realizar una revisión focalizada sobre los factores que explican la caída del score general antes del próximo cierre mensual.",
    );
  }

  for (const pillar of weakest) {
    if (pillar.value < 65) {
      recommendations.push(
        `Profundizar el análisis del frente ${pillarLabel(
          pillar.key,
        ).toLowerCase()} y validar controles, mitigaciones o medidas correctivas específicas.`,
      );
    }
  }

  if (alerts.some((a) => a.severity === "CRITICAL")) {
    recommendations.push(
      "Escalar internamente la revisión del caso y definir si corresponde seguimiento extraordinario o medidas adicionales de mitigación.",
    );
  }

  if (criticality === "HIGH") {
    recommendations.push(
      "Mantener una frecuencia de monitoreo corta dada la criticidad de la relación, aun cuando no existan incidentes inmediatos.",
    );
  }

  if (recommendations.length === 0) {
    if (overallState === "strong") {
      recommendations.push(
        "Mantener seguimiento mensual y actualizar la evaluación ante cualquier cambio relevante en la contraparte o en la operatoria.",
      );
      recommendations.push(
        "Conservar trazabilidad documental y señales tempranas para anticipar eventuales desvíos antes de la próxima revisión mensual.",
      );
    } else {
      recommendations.push(
        "Mantener seguimiento mensual y actualizar la evaluación ante cualquier cambio relevante en la relación o en la operatoria.",
      );
    }
  }

  return recommendations.slice(0, 4);
}

function suggestNextReviewDays(): number | null {
  return 30;
}

export function buildReportData(input: BuildReportDataInput): ReportData {
  return {
    executiveSummary: buildExecutiveSummary(input),
    keyFindings: buildKeyFindings(input),
    priorityRisks: buildPriorityRisks(input),
    recommendations: buildRecommendations(input),
    nextReviewSuggestedDays: suggestNextReviewDays(),
  };
}
