import {
  FIELD_METADATA,
  PILLAR_LABELS,
} from "@/lib/evaluationV2/fieldMetadata";
import type {
  ActionRecommendation,
  EvaluationFormData,
  FieldAssessment,
  PillarKey,
} from "@/lib/types/evaluationForm";
import type {
  AlertSeverity,
  CriticalityLevel,
  ExecutiveCategory,
} from "@prisma/client";

export type ReportFinding = {
  pillar: PillarKey;
  pillarLabel: string;
  fieldKey: string;
  fieldLabel: string;
  severity: "OBSERVACION" | "DEBIL" | "CRITICO";
  value: 60 | 40 | 20;
  rationale: string | null;
  evidenceNote: string | null;
  primaryIssue: string | null;
  actionRecommendation: ActionRecommendation | null;
};

export type ReportCycleChange = {
  kind: "WORSENED" | "PERSISTING_RISK" | "IMPROVED";
  pillar: PillarKey;
  pillarLabel: string;
  fieldKey: string;
  fieldLabel: string;
  previousValue: number | null;
  currentValue: number;
  delta: number | null;
  currentSeverity:
    | "FAVORABLE"
    | "ESTABLE"
    | "OBSERVACION"
    | "DEBIL"
    | "CRITICO";
  rationale: string | null;
};

export type ReportData = {
  executiveSummary: string;
  keyFindings: string[];
  priorityRisks: string[];
  recommendations: string[];
  nextReviewSuggestedDays: number | null;
  priorityFindings: ReportFinding[];
  relevantCycleChanges: ReportCycleChange[];
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
  formData: EvaluationFormData;
  previousFormData?: EvaluationFormData | null;
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

function findingSeverityLabel(value: 60 | 40 | 20) {
  switch (value) {
    case 20:
      return "CRITICO" as const;
    case 40:
      return "DEBIL" as const;
    default:
      return "OBSERVACION" as const;
  }
}

function buildPriorityFindings(formData: EvaluationFormData): ReportFinding[] {
  const findings: ReportFinding[] = [];
  const pillars: PillarKey[] = [
    "financial",
    "commercial",
    "operational",
    "legal",
    "strategic",
  ];

  for (const pillar of pillars) {
    const pillarData = formData[pillar] as
      | Record<string, FieldAssessment | undefined>
      | undefined;

    if (!pillarData) continue;

    for (const [fieldKey, field] of Object.entries(pillarData)) {
      if (!field?.value) continue;
      if (field.value !== 60 && field.value !== 40 && field.value !== 20) {
        continue;
      }

      const meta = FIELD_METADATA[fieldKey as keyof typeof FIELD_METADATA];
      if (!meta) continue;

      findings.push({
        pillar,
        pillarLabel: PILLAR_LABELS[pillar],
        fieldKey,
        fieldLabel: meta.label,
        severity: findingSeverityLabel(field.value),
        value: field.value,
        rationale: field.rationale?.trim() || null,
        evidenceNote: field.evidenceNote?.trim() || null,
        primaryIssue: field.conditionalAnswers?.primaryIssue?.trim() || null,
        actionRecommendation: field.actionRecommendation ?? null,
      });
    }
  }

  const sorted = findings.sort((a, b) => a.value - b.value);

  const severeFindings = sorted.filter(
    (finding) => finding.severity === "CRITICO" || finding.severity === "DEBIL",
  );

  if (severeFindings.length > 0) {
    return severeFindings.slice(0, 6);
  }

  return sorted.slice(0, 6);
}

function cycleSeverityLabel(
  value: number | undefined,
): "FAVORABLE" | "ESTABLE" | "OBSERVACION" | "DEBIL" | "CRITICO" {
  if (value === 20) return "CRITICO";
  if (value === 40) return "DEBIL";
  if (value === 60) return "OBSERVACION";
  if (value === 75) return "ESTABLE";
  return "FAVORABLE";
}

function buildRelevantCycleChanges(
  currentFormData: EvaluationFormData,
  previousFormData?: EvaluationFormData | null,
): ReportCycleChange[] {
  if (!previousFormData) return [];

  const pillars: PillarKey[] = [
    "financial",
    "commercial",
    "operational",
    "legal",
    "strategic",
  ];

  const worsened: ReportCycleChange[] = [];
  const persisting: ReportCycleChange[] = [];
  const improved: ReportCycleChange[] = [];

  for (const pillar of pillars) {
    const currentPillar = currentFormData[pillar] as
      | Record<string, FieldAssessment | undefined>
      | undefined;

    const previousPillar = previousFormData[pillar] as
      | Record<string, FieldAssessment | undefined>
      | undefined;

    if (!currentPillar) continue;

    for (const [fieldKey, currentField] of Object.entries(currentPillar)) {
      const currentValue = currentField?.value;
      const previousValue = previousPillar?.[fieldKey]?.value;

      if (
        typeof currentValue !== "number" ||
        typeof previousValue !== "number"
      ) {
        continue;
      }

      const meta = FIELD_METADATA[fieldKey as keyof typeof FIELD_METADATA];
      if (!meta) continue;

      const delta = currentValue - previousValue;

      const base: ReportCycleChange = {
        kind: "WORSENED",
        pillar,
        pillarLabel: PILLAR_LABELS[pillar],
        fieldKey,
        fieldLabel: meta.label,
        previousValue,
        currentValue,
        delta,
        currentSeverity: cycleSeverityLabel(currentValue),
        rationale: currentField?.rationale?.trim() || null,
      };

      if (delta < 0) {
        worsened.push({
          ...base,
          kind: "WORSENED",
        });
        continue;
      }

      if (delta > 0) {
        improved.push({
          ...base,
          kind: "IMPROVED",
        });
        continue;
      }

      if (currentValue <= 40 && previousValue <= 40) {
        persisting.push({
          ...base,
          kind: "PERSISTING_RISK",
        });
      }
    }
  }

  worsened.sort((a, b) => {
    if ((a.currentValue ?? 999) !== (b.currentValue ?? 999)) {
      return (a.currentValue ?? 999) - (b.currentValue ?? 999);
    }
    return (a.delta ?? 0) - (b.delta ?? 0);
  });

  persisting.sort((a, b) => {
    if ((a.currentValue ?? 999) !== (b.currentValue ?? 999)) {
      return (a.currentValue ?? 999) - (b.currentValue ?? 999);
    }
    return a.fieldLabel.localeCompare(b.fieldLabel);
  });

  improved.sort((a, b) => {
    if ((b.delta ?? 0) !== (a.delta ?? 0)) {
      return (b.delta ?? 0) - (a.delta ?? 0);
    }
    return a.fieldLabel.localeCompare(b.fieldLabel);
  });

  return [
    ...worsened.slice(0, 2),
    ...persisting.slice(0, 2),
    ...improved.slice(0, 2),
  ].slice(0, 6);
}

function actionRecommendationLabel(
  action: ActionRecommendation | null | undefined,
) {
  switch (action) {
    case "MONITOR":
      return "mantener seguimiento mensual";
    case "REQUEST_INFO":
      return "solicitar información complementaria";
    case "LIMIT_EXPOSURE":
      return "limitar exposición";
    case "ESCALATE":
      return "escalar internamente";
    case "REASSESS_EARLY":
      return "reevaluar antes del próximo cierre mensual";
    default:
      return null;
  }
}

function recommendationFromFinding(finding: ReportFinding): string | null {
  const actionText = actionRecommendationLabel(finding.actionRecommendation);

  if (finding.severity === "CRITICO") {
    if (actionText) {
      return `Priorizar ${finding.fieldLabel.toLowerCase()} en ${finding.pillarLabel.toLowerCase()} y ${actionText}.`;
    }

    if (finding.primaryIssue) {
      return `Priorizar ${finding.fieldLabel.toLowerCase()} en ${finding.pillarLabel.toLowerCase()} y tratar el problema principal informado: ${finding.primaryIssue.toLowerCase()}.`;
    }

    return `Priorizar ${finding.fieldLabel.toLowerCase()} en ${finding.pillarLabel.toLowerCase()} con seguimiento reforzado e intervención inmediata.`;
  }

  if (finding.severity === "DEBIL") {
    if (actionText) {
      return `Revisar ${finding.fieldLabel.toLowerCase()} en ${finding.pillarLabel.toLowerCase()} y ${actionText}.`;
    }

    if (finding.primaryIssue) {
      return `Revisar ${finding.fieldLabel.toLowerCase()} en ${finding.pillarLabel.toLowerCase()} por el foco detectado: ${finding.primaryIssue.toLowerCase()}.`;
    }

    return `Revisar ${finding.fieldLabel.toLowerCase()} en ${finding.pillarLabel.toLowerCase()} y validar medidas correctivas antes del próximo cierre mensual.`;
  }

  return null;
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

function buildRecommendations(input: BuildReportDataInput): string[] {
  const { score, deltas, alerts, formData } = input;
  const recommendations: string[] = [];

  const priorityFindings = buildPriorityFindings(formData);

  const criticalFindings = priorityFindings.filter(
    (finding) => finding.severity === "CRITICO",
  );
  const weakFindings = priorityFindings.filter(
    (finding) => finding.severity === "DEBIL",
  );

  for (const finding of criticalFindings) {
    const recommendation = recommendationFromFinding(finding);
    if (recommendation) recommendations.push(recommendation);
  }

  for (const finding of weakFindings.slice(0, 2)) {
    const recommendation = recommendationFromFinding(finding);
    if (recommendation) recommendations.push(recommendation);
  }

  if (criticalFindings.length === 0 && weakFindings.length >= 2) {
    recommendations.push(
      "Consolidar un seguimiento focalizado sobre los frentes débiles detectados antes del próximo cierre mensual.",
    );
  }

  if ((deltas.overall ?? 0) <= -8) {
    recommendations.push(
      "Realizar una revisión focalizada sobre los factores que explican la caída del score general antes del próximo cierre mensual.",
    );
  }

  if (score.pillars.financial < 65) {
    recommendations.push(
      "Profundizar la revisión de la solidez financiera y validar capacidad de pago, liquidez y exposición antes del próximo cierre mensual.",
    );
  }

  if (score.pillars.operational < 65) {
    recommendations.push(
      "Revisar continuidad operativa, dependencias críticas y capacidad de respuesta ante incidentes.",
    );
  }

  if (score.pillars.legal < 65) {
    recommendations.push(
      "Validar formalidad, documentación crítica y contingencias regulatorias o contractuales pendientes.",
    );
  }

  if (score.pillars.commercial < 65) {
    recommendations.push(
      "Revisar confiabilidad comercial, concentración y estabilidad de la relación para reducir exposición innecesaria.",
    );
  }

  if (score.pillars.strategic < 65) {
    recommendations.push(
      "Fortalecer seguimiento interno, actualización de información y gestión de desvíos con responsables claros.",
    );
  }

  if (alerts.some((a) => a.severity === "CRITICAL")) {
    recommendations.push(
      "Mantener seguimiento mensual reforzado hasta estabilizar los focos críticos activos.",
    );
  } else if (alerts.length > 0) {
    recommendations.push(
      "Mantener seguimiento mensual y actualizar la evaluación ante cualquier cambio relevante en la contraparte o en la operatoria.",
    );
  } else {
    recommendations.push(
      "Conservar trazabilidad documental y señales tempranas para anticipar eventuales desvíos antes de la próxima revisión mensual.",
    );
  }

  return [...new Set(recommendations)].slice(0, 5);
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
    priorityFindings: buildPriorityFindings(input.formData),
    relevantCycleChanges: buildRelevantCycleChanges(
      input.formData,
      input.previousFormData,
    ),
  };
}
