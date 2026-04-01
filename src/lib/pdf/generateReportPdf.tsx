import {
  renderToBuffer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Polygon,
  Line,
  Circle,
} from "@react-pdf/renderer";
import { getNextReviewInfo } from "@/lib/reviews/getNextReviewInfo";
import { getReviewStatus } from "@/lib/reviews/getReviewStatus";
import { getCompanyActionCard } from "@/lib/companies/getCompanyActionCard";
import {
  RELATIONSHIP_IMPORTANCE_LABEL,
  relationshipImportanceLabel,
} from "@/lib/ui/relationshipImportance";

export type DeterministicPdfData = {
  companyName: string;
  generatedAt: string;
  evaluationCreatedAtISO: string;
  companyCriticality: string;
  overallScore: number;
  executiveCategory: string;
  pillars: {
    financial: number | null;
    commercial: number | null;
    operational: number | null;
    legal: number | null;
    strategic: number | null;
  };
  deltas: {
    overall: number | null;
    financial: number | null;
    commercial: number | null;
    operational: number | null;
    legal: number | null;
    strategic: number | null;
  };
  reportData: {
    executiveSummary: string;
    keyFindings: string[];
    priorityRisks: string[];
    recommendations: string[];
    nextReviewSuggestedDays: number | null;
    priorityFindings: Array<{
      pillar:
        | "financial"
        | "commercial"
        | "operational"
        | "legal"
        | "strategic";
      pillarLabel: string;
      fieldKey: string;
      fieldLabel: string;
      severity: "OBSERVACION" | "DEBIL" | "CRITICO";
      value: 60 | 40 | 20;
      rationale: string | null;
      evidenceNote: string | null;
      primaryIssue: string | null;
      actionRecommendation:
        | "NONE"
        | "MONITOR"
        | "REQUEST_INFO"
        | "ESCALATE"
        | "LIMIT_EXPOSURE"
        | "REASSESS_EARLY"
        | null;
    }>;
    relevantCycleChanges: Array<{
      kind: "WORSENED" | "PERSISTING_RISK" | "IMPROVED";
      pillar:
        | "financial"
        | "commercial"
        | "operational"
        | "legal"
        | "strategic";
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
    }>;
  };
};

const COLORS = {
  ink: "#111827",
  slate: "#475569",
  muted: "#6b7280",
  line: "#e5e7eb",
  panel: "#f8fafc",
  dark: "#0f172a",
  greenBg: "#dcfce7",
  greenText: "#166534",
  blueBg: "#dbeafe",
  blueText: "#1d4ed8",
  amberBg: "#fef3c7",
  amberText: "#b45309",
  redBg: "#fee2e2",
  redText: "#b91c1c",
};

const PILLAR_COLORS = {
  financial: "#2563eb", // azul
  commercial: "#16a34a", // verde
  operational: "#b45309", // ámbar oscuro
  legal: "#dc2626", // rojo
  strategic: "#7c3aed", // violeta
} as const;

function pillarColor(key: keyof DeterministicPdfData["pillars"]) {
  return PILLAR_COLORS[key];
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 32,
    paddingHorizontal: 32,
    fontSize: 10.5,
    fontFamily: "Helvetica",
    color: COLORS.ink,
    backgroundColor: "#ffffff",
  },

  pillarDetailStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillarDetailStatusText: {
    fontSize: 8.4,
    fontWeight: "bold",
  },

  findingCard: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    padding: 10,
    marginBottom: 8,
  },
  findingTitle: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 4,
  },
  findingMeta: {
    fontSize: 9,
    lineHeight: 1.3,
    color: COLORS.slate,
    marginBottom: 2,
  },
  findingMetaStrong: {
    fontWeight: "bold",
    color: COLORS.dark,
  },

  pillarDetailCard: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    padding: 12,
    marginBottom: 10,
  },
  pillarDetailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  pillarDetailTitle: {
    fontSize: 12,
    fontWeight: "bold",
  },
  pillarDetailStatus: {
    fontSize: 9,
    color: COLORS.slate,
    fontWeight: "bold",
  },
  pillarDetailScoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  pillarDetailScore: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  pillarDetailDelta: {
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.slate,
  },
  pillarDetailNarrative: {
    marginTop: 9,
    fontSize: 9,
    lineHeight: 1.3,
    color: COLORS.slate,
  },

  infoGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    marginBottom: 12,
  },
  infoCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#ffffff",
  },
  compactInfoCard: {
    padding: 10,
  },
  infoCardTitle: {
    fontSize: 9,
    color: COLORS.muted,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  infoCardHeadline: {
    fontSize: 13,
    fontWeight: 700,
    color: COLORS.dark,
    marginBottom: 6,
  },
  infoCardBody: {
    fontSize: 9.5,
    color: COLORS.slate,
    lineHeight: 1.45,
  },
  summaryInfoCardNeutral: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
  },
  infoCardTitleNeutral: {
    fontSize: 9,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    color: "#475569",
    marginBottom: 6,
  },
  infoCardHeadlineNeutral: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0f172a",
    marginBottom: 6,
    lineHeight: 1.25,
  },
  infoCardBodyNeutral: {
    fontSize: 9.5,
    color: "#475569",
    lineHeight: 1.45,
  },
  cycleChangeCard: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#ffffff",
  },
  cycleChangeTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cycleChangeTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: COLORS.dark,
    maxWidth: "72%",
  },
  cycleChangeBadge: {
    fontSize: 8.5,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 999,
  },
  cycleChangeMeta: {
    fontSize: 9,
    color: COLORS.slate,
    marginBottom: 4,
  },
  cycleChangeBody: {
    fontSize: 9.5,
    color: COLORS.ink,
    lineHeight: 1.4,
  },

  overviewGrid: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  overviewLeft: {
    width: "56%",
  },
  overviewRight: {
    width: "44%",
  },
  overviewBlock: {
    border: `1 solid ${COLORS.line}`,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    padding: 14,
  },
  pillarGridWrap: {
    marginTop: 12,
  },
  pillarGridTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 6,
  },
  pillarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  pillarGridItem: {
    width: "48.5%",
    marginBottom: 8,
  },

  section: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    color: COLORS.dark,
  },
  bodyText: {
    fontSize: 10.5,
    lineHeight: 1.45,
    color: COLORS.slate,
  },
  smallText: {
    fontSize: 9,
    color: COLORS.muted,
    lineHeight: 1.4,
  },

  topBar: {
    borderBottom: `1 solid ${COLORS.line}`,
    paddingBottom: 12,
  },
  brand: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  brandSub: {
    marginTop: 3,
    fontSize: 9.5,
    color: COLORS.muted,
  },
  docTitle: {
    marginTop: 16,
    fontSize: 21,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  docMeta: {
    marginTop: 6,
    fontSize: 10,
    color: COLORS.slate,
  },

  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
    rowGap: 6,
  },
  badgeBase: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontSize: 9,
    fontWeight: "bold",
    marginRight: 8,
  },

  radarLabel: { fontSize: 9, fontWeight: "bold" },
  pillarTitleAccent: { fontSize: 10.5, fontWeight: "bold", marginBottom: 6 },
  heroCard: {
    marginTop: 18,
    border: `1 solid ${COLORS.line}`,
    borderRadius: 14,
    backgroundColor: COLORS.panel,
    padding: 18,
  },
  heroGrid: {
    flexDirection: "row",
  },
  heroLeft: {
    width: "40%",
    paddingRight: 16,
  },
  heroRight: {
    width: "60%",
  },
  heroLabel: {
    fontSize: 9.5,
    color: COLORS.muted,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  heroScore: {
    fontSize: 40,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  heroCategory: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.slate,
  },
  heroDelta: {
    marginTop: 8,
    fontSize: 10,
    color: COLORS.slate,
  },
  heroSummaryBox: {
    borderLeft: `3 solid ${COLORS.dark}`,
    paddingLeft: 10,
  },

  progressWrap: {
    marginTop: 14,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
  },
  progressFill: {
    height: 8,
    borderRadius: 999,
    backgroundColor: COLORS.dark,
  },

  kpiRow: {
    flexDirection: "row",
    marginTop: 14,
  },
  kpiCard: {
    width: "32%",
    border: `1 solid ${COLORS.line}`,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    padding: 12,
    minHeight: 82,
  },
  kpiSpacer: {
    width: "2%",
  },
  kpiLabel: {
    fontSize: 9,
    color: COLORS.muted,
    marginBottom: 5,
  },
  kpiValue: {
    fontSize: 11.5,
    fontWeight: "bold",
    color: COLORS.dark,
    lineHeight: 1.25,
  },

  summaryInfoCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#ffffff",
  },

  findingHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 8,
  },

  findingBadge: {
    fontSize: 9,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    marginRight: 6,
  },
  findingPillarBadge: {
    fontSize: 9,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#f3f4f6",
    color: COLORS.slate,
  },
  findingRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  findingLabel: {
    width: 92,
    fontSize: 10,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  findingValue: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.4,
    color: COLORS.slate,
  },

  bulletRow: {
    flexDirection: "row",
    marginBottom: 7,
  },
  bulletDot: {
    width: 10,
    fontSize: 12,
    color: COLORS.dark,
  },
  bulletText: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 1.45,
    color: COLORS.slate,
  },

  pageHeader: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottom: `1 solid ${COLORS.line}`,
  },
  pageHeaderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  pageHeaderSub: {
    marginTop: 4,
    fontSize: 9.5,
    color: COLORS.muted,
  },

  page2HeroCard: {
    border: `1 solid ${COLORS.line}`,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  radarHeroWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  radarHeroLegend: {
    marginTop: 10,
    width: "86%",
  },
  radarHeroLegendGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  radarHeroLegendItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  radarHeroLegendDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    marginRight: 6,
  },
  radarHeroLegendText: {
    fontSize: 9,
    color: COLORS.slate,
  },
  page2InsightsCard: {
    marginTop: 12,
    border: `1 solid ${COLORS.line}`,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    padding: 14,
  },
  insightRowCompact: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 7,
    borderBottom: `1 solid ${COLORS.line}`,
  },
  insightRowCompactLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  insightLabel: {
    width: "34%",
    fontSize: 9,
    color: COLORS.muted,
  },
  insightValue: {
    width: "64%",
    fontSize: 9.6,
    lineHeight: 1.35,
    color: COLORS.dark,
  },

  pillarDetailGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 2,
  },
  pillarDetailItem: {
    width: "48.5%",
    marginBottom: 10,
  },
  pillarDetailItemFull: {
    width: "100%",
    marginBottom: 10,
  },

  pillarDetailReading: {
    marginTop: 7,
    fontSize: 9.2,
    lineHeight: 1.35,
    color: COLORS.slate,
  },

  page4TwoCol: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  page4Col: {
    width: "48.5%",
  },
  closingInfoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  closingInfoCard: {
    width: "48.5%",
    border: `1 solid ${COLORS.line}`,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#ffffff",
  },
  closingInfoLabel: {
    fontSize: 9,
    color: COLORS.muted,
    marginBottom: 5,
    textTransform: "uppercase",
  },
  closingInfoValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 4,
  },

  pillarCard: {
    width: "100%",
    border: `1 solid ${COLORS.line}`,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  pillarCardOdd: {},
  pillarTitle: {
    fontSize: 10.5,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 6,
  },
  pillarScoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  pillarScore: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  pillarDelta: {
    fontSize: 9,
    color: COLORS.slate,
  },
  barTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
    marginBottom: 6,
  },
  barFill: {
    height: 6,
    borderRadius: 999,
    backgroundColor: COLORS.dark,
  },
  pillarState: {
    fontSize: 9,
    color: COLORS.slate,
  },

  tableWrap: {
    marginTop: 4,
    border: `1 solid ${COLORS.line}`,
    borderRadius: 10,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.panel,
    borderBottom: `1 solid ${COLORS.line}`,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: `1 solid ${COLORS.line}`,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableColPillar: {
    width: "18%",
  },
  tableColScore: {
    width: "13%",
  },
  tableColDelta: {
    width: "14%",
  },
  tableColState: {
    width: "15%",
  },
  tableColReading: {
    width: "40%",
  },
  tableHeadText: {
    fontSize: 9,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  tableText: {
    fontSize: 9.5,
    color: COLORS.slate,
    lineHeight: 1.35,
  },

  footer: {
    marginTop: 16,
    paddingTop: 10,
    borderTop: `1 solid ${COLORS.line}`,
  },
});

function formatScore(value: number | null) {
  return typeof value === "number" && Number.isFinite(value)
    ? value.toFixed(1)
    : "—";
}

function safeScore(value: number | null) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function formatDelta(delta?: number | null) {
  if (typeof delta !== "number" || !Number.isFinite(delta)) {
    return "0.0";
  }

  return `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`;
}

function pillarLabel(key: keyof DeterministicPdfData["pillars"]) {
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

function getCategoryPalette(category: string) {
  switch (category) {
    case "SOLIDO":
      return { bg: COLORS.greenBg, text: COLORS.greenText };
    case "ESTABLE":
      return { bg: COLORS.blueBg, text: COLORS.blueText };
    case "VULNERABLE":
      return { bg: COLORS.amberBg, text: COLORS.amberText };
    case "CRITICO":
      return { bg: COLORS.redBg, text: COLORS.redText };
    default:
      return { bg: "#f3f4f6", text: "#374151" };
  }
}

function scoreState(score: number | null) {
  if (typeof score !== "number" || !Number.isFinite(score)) return "Sin dato";
  if (score >= 80) return "Fuerte";
  if (score >= 65) return "Estable";
  if (score >= 50) return "Vulnerable";
  return "Crítico";
}

function monitoringStatus(score: number) {
  if (score >= 80) return "Seguimiento estándar";
  if (score >= 65) return "Seguimiento preventivo";
  if (score >= 50) return "Seguimiento reforzado";
  return "Seguimiento inmediato";
}

function monitoringStatusShort(score: number) {
  if (score >= 80) return "Estándar";
  if (score >= 65) return "Preventivo";
  if (score >= 50) return "Reforzado";
  return "Inmediato";
}

function getPillarNarrative(
  pillarKey: "financial" | "commercial" | "operational" | "legal" | "strategic",
  score: number,
  delta?: number | null,
) {
  const safeDelta =
    typeof delta === "number" && Number.isFinite(delta) ? delta : 0;

  const baseByPillar = {
    financial:
      "Refleja la solidez económico-financiera, la previsibilidad de fondos y la capacidad de sostener compromisos sin tensión relevante.",
    commercial:
      "Refleja la estabilidad comercial, la generación de ingresos y la consistencia de la relación con clientes, contratos o demanda.",
    operational:
      "Refleja la capacidad de ejecución, continuidad operativa y respuesta ante desvíos o exigencias del ciclo.",
    legal:
      "Refleja el nivel de orden contractual, cumplimiento y exposición a fricciones regulatorias o documentales.",
    strategic:
      "Refleja el grado de dirección, formalización, adaptabilidad y resiliencia del negocio ante cambios relevantes.",
  } as const;

  let performanceText = "";
  if (score >= 80) {
    performanceText =
      "Actualmente se ubica en una posición fuerte dentro del ciclo, con señales favorables y baja presión relativa.";
  } else if (score >= 70) {
    performanceText =
      "Actualmente muestra un desempeño estable, con fundamentos razonables y sin señales de deterioro severo.";
  } else if (score >= 60) {
    performanceText =
      "Actualmente se mantiene en una zona sensible, todavía gestionable, pero con necesidad de seguimiento más atento.";
  } else {
    performanceText =
      "Actualmente se ubica en una zona comprometida del ciclo y requiere atención prioritaria para evitar mayor fragilidad.";
  }

  let deltaText = "";
  if (safeDelta >= 4) {
    deltaText =
      "Además, registra una mejora clara respecto al ciclo anterior, lo que refuerza la evolución positiva de este frente.";
  } else if (safeDelta > 0) {
    deltaText =
      "También muestra una mejora moderada frente al ciclo anterior, aunque todavía conviene sostener seguimiento.";
  } else if (safeDelta <= -4) {
    deltaText =
      "A su vez, evidencia un deterioro relevante frente al ciclo anterior, por lo que conviene revisar causas y señales tempranas.";
  } else if (safeDelta < 0) {
    deltaText =
      "Presenta un leve retroceso frente al ciclo anterior, sin quiebre mayor, pero con margen para corrección preventiva.";
  } else {
    deltaText =
      "No muestra cambios relevantes frente al ciclo anterior y conserva una dinámica similar a la evaluación previa.";
  }

  return `${baseByPillar[pillarKey]} ${performanceText} ${deltaText}`;
}

function pickStrongestPillars(data: DeterministicPdfData) {
  return Object.entries(data.pillars)
    .sort((a, b) => safeScore(b[1]) - safeScore(a[1]))
    .slice(0, 2)
    .map(([key]) => pillarLabel(key as keyof DeterministicPdfData["pillars"]));
}

function pickWeakestPillars(data: DeterministicPdfData) {
  return Object.entries(data.pillars)
    .sort((a, b) => safeScore(a[1]) - safeScore(b[1]))
    .slice(0, 2)
    .map(([key]) => pillarLabel(key as keyof DeterministicPdfData["pillars"]));
}

function executiveHeadline(data: DeterministicPdfData) {
  const score = safeScore(data.overallScore);
  const company = data.companyName;

  if (score >= 80) {
    return `${company} presenta un perfil de riesgo sólido, con una posición general favorable para continuidad operativa y seguimiento periódico estándar.`;
  }
  if (score >= 65) {
    return `${company} presenta un perfil de riesgo estable, con fundamentos razonables y algunos focos que conviene monitorear en próximos ciclos.`;
  }
  if (score >= 50) {
    return `${company} presenta un perfil vulnerable, con señales que ameritan seguimiento reforzado y priorización de medidas preventivas.`;
  }
  return `${company} presenta un perfil crítico, con exposición relevante y necesidad de revisión prioritaria sobre los pilares más sensibles.`;
}

function executiveHighlights(data: DeterministicPdfData) {
  const score = safeScore(data.overallScore);
  const strongest = pickStrongestPillars(data);
  const weakest = pickWeakestPillars(data);

  if (score >= 80) {
    return [
      `Los pilares con mejor desempeño relativo son ${strongest.join(" y ")}.`,
      "La evaluación no muestra señales severas inmediatas, aunque el monitoreo debe mantenerse activo.",
      "Conviene sostener disciplina de revisión periódica para detectar cambios tempranos en la contraparte.",
    ];
  }

  if (score >= 65) {
    return [
      `Los pilares más sólidos actualmente son ${strongest.join(" y ")}.`,
      `Los focos de atención relativa se concentran en ${weakest.join(" y ")}.`,
      "Se recomienda revisión preventiva antes de que los desvíos se consoliden.",
    ];
  }

  if (score >= 50) {
    return [
      `Los focos de mayor fragilidad relativa se concentran en ${weakest.join(" y ")}.`,
      "El perfil general justifica seguimiento más frecuente y revisión de exposición operativa/comercial.",
      "La prioridad es contener deterioros antes de que impacten en continuidad, cumplimiento o relación contractual.",
    ];
  }

  return [
    `Los pilares más comprometidos actualmente se concentran en ${weakest.join(" y ")}.`,
    "La exposición observada exige seguimiento inmediato y una revisión priorizada de continuidad y controles.",
    "Se recomienda definir medidas concretas de mitigación en el corto plazo.",
  ];
}

function RadarChart({ data }: { data: DeterministicPdfData["pillars"] }) {
  const entries: Array<{
    key: keyof DeterministicPdfData["pillars"];
    label: string;
    value: number;
    color: string;
  }> = [
    {
      key: "financial",
      label: "Financiero",
      value: safeScore(data.financial),
      color: pillarColor("financial"),
    },
    {
      key: "commercial",
      label: "Comercial",
      value: safeScore(data.commercial),
      color: pillarColor("commercial"),
    },
    {
      key: "operational",
      label: "Operativo",
      value: safeScore(data.operational),
      color: pillarColor("operational"),
    },
    {
      key: "legal",
      label: "Legal",
      value: safeScore(data.legal),
      color: pillarColor("legal"),
    },
    {
      key: "strategic",
      label: "Estratégico",
      value: safeScore(data.strategic),
      color: pillarColor("strategic"),
    },
  ];

  const size = 220;
  const center = size / 2;
  const radius = 72;
  const levels = [20, 40, 60, 80, 100];

  function pointFor(index: number, valuePct: number, r = radius) {
    const angle = (-90 + index * 72) * (Math.PI / 180);
    const scaled = (r * valuePct) / 100;
    const x = center + Math.cos(angle) * scaled;
    const y = center + Math.sin(angle) * scaled;
    return { x, y };
  }

  function polygonPoints(pct: number) {
    return entries
      .map((_, i) => {
        const p = pointFor(i, pct);
        return `${p.x},${p.y}`;
      })
      .join(" ");
  }

  const dataPolygon = entries
    .map((entry, i) => {
      const p = pointFor(i, entry.value);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <View style={styles.radarHeroWrap} wrap={false}>
      <Svg width={size} height={size}>
        {levels.map((level) => (
          <Polygon
            key={`level-${level}`}
            points={polygonPoints(level)}
            stroke={COLORS.line}
            strokeWidth={1}
            fill="none"
          />
        ))}

        {entries.map((entry, i) => {
          const p = pointFor(i, 100);
          return (
            <Line
              key={`axis-${entry.key}`}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke={entry.color}
              strokeWidth={1}
            />
          );
        })}

        <Polygon
          points={dataPolygon}
          fill="#CBD5E1"
          stroke={COLORS.dark}
          strokeWidth={1.4}
        />

        {entries.map((entry, i) => {
          const p = pointFor(i, entry.value);
          return (
            <Circle
              key={`dot-${entry.key}`}
              cx={p.x}
              cy={p.y}
              r={3}
              fill={entry.color}
            />
          );
        })}
      </Svg>

      <View style={styles.radarHeroLegend}>
        <View style={styles.radarHeroLegendGrid}>
          {entries.map((entry) => (
            <View key={entry.key} style={styles.radarHeroLegendItem}>
              <View
                style={[
                  styles.radarHeroLegendDot,
                  { backgroundColor: entry.color },
                ]}
              />
              <Text style={styles.radarHeroLegendText}>
                {entry.label}: {entry.value.toFixed(1)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

function BulletList({
  items,
  emptyText,
}: {
  items: string[];
  emptyText: string;
}) {
  if (!items.length) {
    return <Text style={styles.bodyText}>{emptyText}</Text>;
  }

  return (
    <View>
      {items.map((item, index) => (
        <View key={`${item}-${index}`} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function getPillarEntries(data: DeterministicPdfData) {
  const entries: Array<{
    key: keyof DeterministicPdfData["pillars"];
    label: string;
    score: number;
    delta: number | null;
    color: string;
  }> = [
    {
      key: "financial",
      label: "Financiero",
      score: safeScore(data.pillars.financial),
      delta: data.deltas.financial,
      color: pillarColor("financial"),
    },
    {
      key: "commercial",
      label: "Comercial",
      score: safeScore(data.pillars.commercial),
      delta: data.deltas.commercial,
      color: pillarColor("commercial"),
    },
    {
      key: "operational",
      label: "Operativo",
      score: safeScore(data.pillars.operational),
      delta: data.deltas.operational,
      color: pillarColor("operational"),
    },
    {
      key: "legal",
      label: "Legal",
      score: safeScore(data.pillars.legal),
      delta: data.deltas.legal,
      color: pillarColor("legal"),
    },
    {
      key: "strategic",
      label: "Estratégico",
      score: safeScore(data.pillars.strategic),
      delta: data.deltas.strategic,
      color: pillarColor("strategic"),
    },
  ];

  return entries;
}

function getStrongestPillar(data: DeterministicPdfData) {
  return [...getPillarEntries(data)].sort((a, b) => b.score - a.score)[0];
}

function getWeakestPillar(data: DeterministicPdfData) {
  return [...getPillarEntries(data)].sort((a, b) => a.score - b.score)[0];
}

function getBestDeltaPillar(data: DeterministicPdfData) {
  return (
    [...getPillarEntries(data)]
      .filter(
        (entry) =>
          typeof entry.delta === "number" && Number.isFinite(entry.delta),
      )
      .sort((a, b) => (b.delta ?? -999) - (a.delta ?? -999))[0] ?? null
  );
}

function pillarStatusLabel(score: number) {
  if (score >= 80) return "Fuerte";
  if (score >= 70) return "Estable";
  if (score >= 60) return "Vulnerable";
  return "Crítico";
}

function pillarStatusTone(score: number) {
  const status = pillarStatusLabel(score);

  if (status === "Crítico") {
    return {
      bg: "#FEF2F2",
      text: "#B91C1C",
      border: "#FECACA",
    };
  }

  if (status === "Vulnerable") {
    return {
      bg: "#FFF7ED",
      text: "#B45309",
      border: "#FED7AA",
    };
  }

  if (status === "Fuerte") {
    return {
      bg: "#ECFDF5",
      text: "#047857",
      border: "#A7F3D0",
    };
  }

  return {
    bg: "#F8FAFC",
    text: "#475569",
    border: "#CBD5E1",
  };
}

function normalizeFindingSeverityLabel(value?: string | null) {
  if (!value) return "Estable";

  const normalized = value.trim().toLowerCase();

  if (
    normalized === "critico" ||
    normalized === "crítico" ||
    normalized === "critical"
  ) {
    return "Crítico";
  }

  if (
    normalized === "debil" ||
    normalized === "débil" ||
    normalized === "weak" ||
    normalized === "vulnerable"
  ) {
    return "Vulnerable";
  }

  if (normalized === "fuerte" || normalized === "strong") {
    return "Fuerte";
  }

  if (normalized === "estable" || normalized === "stable") {
    return "Estable";
  }

  return value;
}

function getWorstDeltaPillar(data: DeterministicPdfData) {
  return (
    [...getPillarEntries(data)]
      .filter(
        (entry) =>
          typeof entry.delta === "number" && Number.isFinite(entry.delta),
      )
      .sort((a, b) => (a.delta ?? 999) - (b.delta ?? 999))[0] ?? null
  );
}

function MapReadingCard({ data }: { data: DeterministicPdfData }) {
  const strongest = getStrongestPillar(data);
  const weakest = getWeakestPillar(data);
  const bestDelta = getBestDeltaPillar(data);
  const worstDelta = getWorstDeltaPillar(data);

  const rows = [
    {
      label: "Pilar más sólido",
      value: strongest
        ? `${strongest.label} (${strongest.score.toFixed(1)})`
        : "Sin dato suficiente",
    },
    {
      label: "Pilar más comprometido",
      value: weakest
        ? `${weakest.label} (${weakest.score.toFixed(1)})`
        : "Sin dato suficiente",
    },
    {
      label: "Mayor mejora",
      value:
        bestDelta && typeof bestDelta.delta === "number" && bestDelta.delta > 0
          ? `${bestDelta.label} (${formatDelta(bestDelta.delta)})`
          : "No se registran mejoras relevantes en este ciclo.",
    },
    {
      label: "Mayor deterioro",
      value:
        worstDelta &&
        typeof worstDelta.delta === "number" &&
        worstDelta.delta < 0
          ? `${worstDelta.label} (${formatDelta(worstDelta.delta)})`
          : "No se registran deterioros relevantes en este ciclo.",
    },
  ];

  return (
    <View style={styles.page2InsightsCard} wrap={false}>
      <Text style={styles.sectionTitle}>Lectura ejecutiva del mapa</Text>
      {rows.map((row, index) => (
        <View
          key={row.label}
          style={
            index === rows.length - 1
              ? [styles.insightRowCompact, styles.insightRowCompactLast]
              : styles.insightRowCompact
          }
        >
          <Text style={styles.insightLabel}>{row.label}</Text>
          <Text style={styles.insightValue}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
}

function PillarDetailCard({
  pillarKey,
  title,
  score,
  delta,
}: {
  pillarKey: "financial" | "commercial" | "operational" | "legal" | "strategic";
  title: string;
  score: number;
  delta?: number | null;
}) {
  const status = pillarStatusLabel(score);
  const statusTone = pillarStatusTone(score);
  const deltaLabel = formatDelta(delta);
  const narrative = getPillarNarrative(pillarKey, score, delta);

  return (
    <View style={styles.pillarDetailCard} wrap={false}>
      <View style={styles.pillarDetailHeader}>
        <Text
          style={[styles.pillarDetailTitle, { color: pillarColor(pillarKey) }]}
        >
          {title}
        </Text>

        <View
          style={[
            styles.pillarDetailStatusBadge,
            {
              backgroundColor: statusTone.bg,
              borderColor: statusTone.border,
            },
          ]}
        >
          <Text
            style={[styles.pillarDetailStatusText, { color: statusTone.text }]}
          >
            {status}
          </Text>
        </View>
      </View>

      <View style={styles.pillarDetailScoreRow}>
        <Text style={styles.pillarDetailScore}>{score.toFixed(1)}</Text>
        <Text style={styles.pillarDetailDelta}>{deltaLabel}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.max(0, Math.min(100, score))}%`,
              backgroundColor: pillarColor(pillarKey),
            },
          ]}
        />
      </View>

      <Text style={styles.pillarDetailNarrative}>{narrative}</Text>
    </View>
  );
}

function limitPriorityFindings(
  items: DeterministicPdfData["reportData"]["priorityFindings"],
) {
  return items.slice(0, 3);
}

function limitRecommendations(items: string[]) {
  return items.slice(0, 5);
}

function softenActionTitle(title: string) {
  const normalized = title.trim().toLowerCase();
  if (normalized === "analizar deterioros del último ciclo") {
    return "Revisar desvíos recientes";
  }
  if (normalized === "revisar alertas activas") {
    return "Revisar focos activos";
  }
  return title;
}

function softenActionDescription(description: string) {
  return description
    .replace("Se detectaron deterioros", "Se detectaron cambios")
    .replace("Conviene revisar los deterioros", "Conviene revisar el detalle")
    .replace("antes de la próxima revisión.", "en este ciclo.");
}

function FindingCard({
  title,
  severity,
  impact,
  issue,
  action,
}: {
  title: string;
  severity?: string | null;
  impact?: string | null;
  issue?: string | null;
  action?: string | null;
}) {
  const normalizedSeverity = normalizeFindingSeverityLabel(severity);

  return (
    <View style={styles.findingCard} wrap={false}>
      <Text style={styles.findingTitle}>{title}</Text>

      {!!severity && (
        <Text style={styles.findingMeta}>
          Severidad:{" "}
          <Text style={styles.findingMetaStrong}>{normalizedSeverity}</Text>
        </Text>
      )}

      {!!impact && (
        <Text style={styles.findingMeta}>
          Impacto: <Text style={styles.findingMetaStrong}>{impact}</Text>
        </Text>
      )}

      {!!issue && (
        <Text style={styles.findingMeta}>
          Señal detectada: <Text style={styles.findingMetaStrong}>{issue}</Text>
        </Text>
      )}

      {!!action && (
        <Text style={styles.findingMeta}>
          Acción sugerida:{" "}
          <Text style={styles.findingMetaStrong}>{action}</Text>
        </Text>
      )}
    </View>
  );
}

function actionRecommendationLabel(
  action:
    | "NONE"
    | "MONITOR"
    | "REQUEST_INFO"
    | "ESCALATE"
    | "LIMIT_EXPOSURE"
    | "REASSESS_EARLY"
    | null,
) {
  switch (action) {
    case "MONITOR":
      return "Monitorear";
    case "REQUEST_INFO":
      return "Solicitar información";
    case "LIMIT_EXPOSURE":
      return "Limitar exposición";
    case "ESCALATE":
      return "Escalar internamente";
    case "REASSESS_EARLY":
      return "Reevaluar antes";
    case "NONE":
      return "Sin acción definida";
    default:
      return null;
  }
}

export async function generateReportPdf(
  data: DeterministicPdfData,
): Promise<Buffer> {
  const categoryPalette = getCategoryPalette(data.executiveCategory);
  const overall = safeScore(data.overallScore);

  const highlights = executiveHighlights(data).slice(0, 2);
  const priorityFindings = limitPriorityFindings(
    data.reportData.priorityFindings ?? [],
  );
  const recommendations = limitRecommendations(
    data.reportData.recommendations ?? [],
  );

  const reviewStatus = getReviewStatus(new Date(data.evaluationCreatedAtISO));
  const nextReviewInfo = getNextReviewInfo(
    new Date(data.evaluationCreatedAtISO),
  );
  const worsenedChangesCount = (
    data.reportData.relevantCycleChanges ?? []
  ).filter((change) => change.kind === "WORSENED").length;

  const actionCard = getCompanyActionCard({
    hasLatestFinalized: true,
    hasActiveDraft: false,
    reviewTone: reviewStatus.tone,
    activeAlertsCount: 0,
    worsenedChangesCount,
  });

  const doc = (
    <Document>
      {/* PAGE 1 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar}>
          <Text style={styles.brand}>EvaluaEmpresa</Text>
          <Text style={styles.brandSub}>
            Monitoreo continuo de riesgo de terceros
          </Text>
        </View>

        <Text style={styles.docTitle}>{data.companyName}</Text>
        <Text style={styles.docMeta}>
          Informe ejecutivo de monitoreo · Fecha de generación:{" "}
          {data.generatedAt}
        </Text>

        <View style={styles.badgeRow}>
          <Text
            style={[
              styles.badgeBase,
              { backgroundColor: "#f3f4f6", color: COLORS.dark },
            ]}
          >
            {RELATIONSHIP_IMPORTANCE_LABEL}:{" "}
            {relationshipImportanceLabel(data.companyCriticality)}{" "}
          </Text>

          <Text
            style={[
              styles.badgeBase,
              {
                backgroundColor: categoryPalette.bg,
                color: categoryPalette.text,
              },
            ]}
          >
            Categoría: {data.executiveCategory}
          </Text>

          <Text
            style={[
              styles.badgeBase,
              {
                backgroundColor: "#eef2ff",
                color: "#4338ca",
              },
            ]}
          >
            {monitoringStatus(overall)}
          </Text>
        </View>

        <View style={styles.heroCard} wrap={false}>
          <View style={styles.infoGrid} wrap={false}>
            <View
              style={[styles.summaryInfoCard, styles.summaryInfoCardNeutral]}
            >
              <Text style={styles.infoCardTitleNeutral}>
                Enfoque sugerido del ciclo
              </Text>
              <Text style={styles.infoCardHeadlineNeutral}>
                {softenActionTitle(actionCard.title)}
              </Text>
              <Text style={styles.infoCardBodyNeutral}>
                {softenActionDescription(actionCard.description)}
              </Text>
            </View>

            <View
              style={[styles.summaryInfoCard, styles.summaryInfoCardNeutral]}
            >
              <Text style={styles.infoCardTitleNeutral}>
                Próxima revisión sugerida
              </Text>
              <Text style={styles.infoCardHeadlineNeutral}>
                {nextReviewInfo.suggestedDateLabel}
              </Text>
              <Text style={styles.infoCardBodyNeutral}>
                {nextReviewInfo.statusLabel}
              </Text>
              <Text style={styles.infoCardBodyNeutral}>
                {nextReviewInfo.helperText}
              </Text>
            </View>
          </View>
          <View style={styles.heroGrid}>
            <View style={styles.heroLeft}>
              <Text style={styles.heroLabel}>Score general</Text>
              <Text style={styles.heroScore}>
                {formatScore(data.overallScore)}
              </Text>
              <Text style={styles.heroCategory}>
                {scoreState(data.overallScore)}
              </Text>
              <Text style={styles.heroDelta}>
                Variación vs. ciclo anterior: {formatDelta(data.deltas.overall)}
              </Text>

              <View style={styles.progressWrap}>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.max(0, Math.min(100, overall))}%` },
                    ]}
                  />
                </View>
              </View>
            </View>

            <View style={styles.heroRight}>
              <View style={styles.heroSummaryBox}>
                <Text style={styles.sectionTitle}>Lectura ejecutiva</Text>
                <Text style={styles.bodyText}>{executiveHeadline(data)}</Text>
              </View>

              <View style={styles.kpiRow}>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Seguimiento</Text>
                  <Text style={styles.kpiValue}>
                    {monitoringStatusShort(overall)}
                  </Text>
                </View>
                <View style={styles.kpiSpacer} />
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Próxima revisión</Text>
                  <Text style={styles.kpiValue}>
                    {nextReviewInfo.suggestedDateLabel}
                  </Text>
                  <Text style={styles.smallText}>
                    {nextReviewInfo.statusLabel}
                  </Text>
                </View>
                <View style={styles.kpiSpacer} />
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Perfil general</Text>
                  <Text style={styles.kpiValue}>
                    {scoreState(data.overallScore)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen ejecutivo</Text>
          <Text style={styles.bodyText}>
            {data.reportData.executiveSummary}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Puntos destacados del ciclo</Text>
          <BulletList
            items={highlights}
            emptyText="No hay observaciones destacadas disponibles para este ciclo."
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.smallText}>
            Este documento sintetiza el estado actual de la contraparte bajo la
            metodología E-Score™ y debe leerse como una herramienta de monitoreo
            continuo, no como una due diligence integral.
          </Text>
        </View>
      </Page>

      {/* PAGE 2 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageHeaderTitle}>
            Vista por pilar y mapa de exposición
          </Text>
          <Text style={styles.pageHeaderSub}>
            Empresa evaluada: {data.companyName} · Categoría:{" "}
            {data.executiveCategory}
          </Text>
        </View>

        <View style={styles.page2HeroCard} wrap={false}>
          <Text style={styles.sectionTitle}>Radar de pilares</Text>
          <RadarChart data={data.pillars} />
        </View>

        <MapReadingCard data={data} />
      </Page>

      {/* PAGE 3 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageHeaderTitle}>Detalle por pilar</Text>
          <Text style={styles.pageHeaderSub}>
            Empresa evaluada: {data.companyName} · Categoría:{" "}
            {data.executiveCategory}
          </Text>
        </View>

        <View style={styles.pillarDetailGrid}>
          <View style={styles.pillarDetailItem}>
            <PillarDetailCard
              pillarKey="financial"
              title="Financiero"
              score={safeScore(data.pillars.financial)}
              delta={data.deltas.financial}
            />
          </View>

          <View style={styles.pillarDetailItem}>
            <PillarDetailCard
              pillarKey="commercial"
              title="Comercial"
              score={safeScore(data.pillars.commercial)}
              delta={data.deltas.commercial}
            />
          </View>

          <View style={styles.pillarDetailItem}>
            <PillarDetailCard
              pillarKey="operational"
              title="Operativo"
              score={safeScore(data.pillars.operational)}
              delta={data.deltas.operational}
            />
          </View>

          <View style={styles.pillarDetailItem}>
            <PillarDetailCard
              pillarKey="legal"
              title="Legal"
              score={safeScore(data.pillars.legal)}
              delta={data.deltas.legal}
            />
          </View>

          <View style={styles.pillarDetailItemFull}>
            <PillarDetailCard
              pillarKey="strategic"
              title="Estratégico"
              score={safeScore(data.pillars.strategic)}
              delta={data.deltas.strategic}
            />
          </View>
        </View>
      </Page>

      {/* PAGE 4 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageHeaderTitle}>
            Hallazgos y recomendaciones
          </Text>
          <Text style={styles.pageHeaderSub}>
            Empresa evaluada: {data.companyName} · Categoría:{" "}
            {data.executiveCategory}
          </Text>
        </View>

        <View style={styles.page4TwoCol}>
          <View style={styles.page4Col}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hallazgos priorizados</Text>

              {priorityFindings.length ? (
                <View>
                  {priorityFindings.map((finding) => {
                    const actionText = actionRecommendationLabel(
                      finding.actionRecommendation,
                    );

                    return (
                      <FindingCard
                        key={`${finding.pillar}-${finding.fieldKey}`}
                        title={finding.fieldLabel}
                        severity={finding.severity}
                        impact={finding.pillarLabel}
                        issue={
                          finding.primaryIssue ?? finding.rationale ?? null
                        }
                        action={actionText}
                      />
                    );
                  })}
                </View>
              ) : (
                <Text style={styles.bodyText}>
                  No se registraron hallazgos priorizados relevantes en este
                  ciclo.
                </Text>
              )}
            </View>
          </View>

          <View style={styles.page4Col}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recomendaciones</Text>
              <BulletList
                items={recommendations.slice(0, 4)}
                emptyText="No se definieron recomendaciones específicas para este ciclo."
              />
            </View>
          </View>
        </View>

        <View style={styles.closingInfoGrid} wrap={false}>
          <View style={styles.closingInfoCard}>
            <Text style={styles.closingInfoLabel}>Enfoque sugerido</Text>
            <Text style={styles.closingInfoValue}>
              {softenActionTitle(actionCard.title)}
            </Text>
            <Text style={styles.smallText}>
              {softenActionDescription(actionCard.description)}
            </Text>
          </View>

          <View style={styles.closingInfoCard}>
            <Text style={styles.closingInfoLabel}>
              Próxima revisión sugerida
            </Text>
            <Text style={styles.closingInfoValue}>
              {nextReviewInfo.suggestedDateLabel}
            </Text>
            <Text style={styles.smallText}>{nextReviewInfo.statusLabel}</Text>
            <Text style={styles.smallText}>{nextReviewInfo.helperText}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.smallText}>
            Informe orientativo basado en información estructurada cargada en la
            plataforma. No constituye asesoramiento legal, contable ni
            financiero. El PDF es una exportación del sistema de monitoreo
            continuo y no reemplaza un proceso de due diligence formal.
          </Text>
        </View>
      </Page>
    </Document>
  );

  return await renderToBuffer(doc);
}
