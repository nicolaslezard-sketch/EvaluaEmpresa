import {
  renderToBuffer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { getNextReviewInfo } from "@/lib/reviews/getNextReviewInfo";
import { getReviewStatus } from "@/lib/reviews/getReviewStatus";
import { getCompanyActionCard } from "@/lib/companies/getCompanyActionCard";

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
    marginTop: 10,
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

  findingCard: {
    border: `1 solid ${COLORS.line}`,
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#ffffff",
    marginBottom: 10,
  },
  findingHeader: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 8,
  },
  findingTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.dark,
    marginRight: 8,
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

  page2Block: {
    marginTop: 10,
    marginBottom: 14,
  },
  page2Card: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    padding: 12,
  },
  page2CardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: COLORS.dark,
    marginBottom: 8,
  },

  exposureTable: {
    marginTop: 2,
  },
  exposureRow: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f7",
  },
  exposureRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  exposureRowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  exposureLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "62%",
  },
  exposureDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    marginRight: 6,
  },
  exposureLabel: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  exposureMeta: {
    fontSize: 8.6,
    color: COLORS.muted,
    marginTop: 2,
  },
  exposureValue: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: COLORS.slate,
  },
  exposureTrack: {
    height: 5,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
  },
  exposureFill: {
    height: 5,
    borderRadius: 999,
  },

  risksCompactCard: {
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    padding: 12,
  },
  riskCompactRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  riskCompactDot: {
    width: 10,
    fontSize: 12,
    color: COLORS.dark,
  },
  riskCompactText: {
    flex: 1,
    fontSize: 9,
    lineHeight: 1.2,
    color: COLORS.slate,
  },

  exposureCardPage2: {
    minHeight: 252,
    paddingBottom: 10,
  },

  exposureSummaryList: {
    marginTop: 4,
  },

  exposureSummaryLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "72%",
  },
  exposureSummaryDot: {
    width: 7,
    height: 7,
    borderRadius: 999,
    marginRight: 6,
  },
  exposureSummaryRow: {
    marginBottom: 7,
  },
  exposureSummaryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  exposureSummaryLabel: {
    fontSize: 8.8,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  exposureSummaryValue: {
    fontSize: 8.8,
    fontWeight: "bold",
    color: COLORS.slate,
  },
  exposureSummaryTrack: {
    height: 5,
    borderRadius: 999,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
  },
  exposureSummaryFill: {
    height: 5,
    borderRadius: 999,
  },

  bulletRowCompact: {
    flexDirection: "row",
    marginBottom: 3,
  },
  bulletTextCompact: {
    flex: 1,
    fontSize: 8.2,
    lineHeight: 1.12,
    color: COLORS.slate,
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

function formatDelta(value: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value))
    return "Sin variación";
  if (value > 0) return `+${value.toFixed(1)}`;
  if (value < 0) return value.toFixed(1);
  return "0.0";
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

function cycleChangeKindLabel(
  kind: "WORSENED" | "PERSISTING_RISK" | "IMPROVED",
) {
  switch (kind) {
    case "WORSENED":
      return "Empeoró";
    case "PERSISTING_RISK":
      return "Sigue débil";
    case "IMPROVED":
      return "Mejoró";
  }
}

function fieldLevelLabel(value: number | null | undefined) {
  switch (value) {
    case 20:
      return "Crítico";
    case 40:
      return "Débil";
    case 60:
      return "Observación";
    case 75:
      return "Estable";
    case 90:
      return "Muy favorable";
    default:
      return "—";
  }
}

function PillarCard({
  pillarKey,
  title,
  score,
  delta,
  odd,
}: {
  pillarKey: keyof DeterministicPdfData["pillars"];
  title: string;
  score: number | null;
  delta: number | null;
  odd?: boolean;
}) {
  const width = `${Math.max(0, Math.min(100, safeScore(score)))}%`;
  const accent = pillarColor(pillarKey);

  return (
    <View
      wrap={false}
      style={
        odd ? [styles.pillarCard, styles.pillarCardOdd] : styles.pillarCard
      }
    >
      <Text style={[styles.pillarTitleAccent, { color: accent }]}>{title}</Text>

      <View style={styles.pillarScoreRow}>
        <Text style={styles.pillarScore}>{formatScore(score)}</Text>
        <Text style={styles.pillarDelta}>{formatDelta(delta)}</Text>
      </View>

      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width, backgroundColor: accent }]} />
      </View>

      <Text style={styles.pillarState}>{scoreState(score)}</Text>
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

function PriorityRisksCompact({ items }: { items: string[] }) {
  if (!items.length) {
    return (
      <Text style={styles.bodyText}>
        No hay riesgos prioritarios identificados para este ciclo.
      </Text>
    );
  }

  return (
    <View>
      {items.slice(0, 2).map((item, index) => (
        <View key={`${item}-${index}`} style={styles.riskCompactRow}>
          <Text style={styles.riskCompactDot}>•</Text>
          <Text style={styles.riskCompactText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function BulletListCompact({
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
        <View key={`${item}-${index}`} style={styles.bulletRowCompact}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletTextCompact}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function trimPriorityRisk(text: string, max = 140) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1).trimEnd()}…`;
}

function PillarExposureSummary({
  data,
}: {
  data: DeterministicPdfData["pillars"];
}) {
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

  return (
    <View style={styles.exposureSummaryList} wrap={false}>
      {entries.map((entry) => (
        <View key={entry.key} style={styles.exposureSummaryRow}>
          <View style={styles.exposureSummaryTop}>
            <View style={styles.exposureSummaryLabelWrap}>
              <View
                style={[
                  styles.exposureSummaryDot,
                  { backgroundColor: entry.color },
                ]}
              />
              <Text style={styles.exposureSummaryLabel}>{entry.label}</Text>
            </View>

            <Text style={styles.exposureSummaryValue}>
              {entry.value.toFixed(1)}
            </Text>
          </View>

          <View style={styles.exposureSummaryTrack}>
            <View
              style={[
                styles.exposureSummaryFill,
                {
                  width: `${Math.max(0, Math.min(100, entry.value))}%`,
                  backgroundColor: entry.color,
                },
              ]}
            />
          </View>
        </View>
      ))}
    </View>
  );
}

function limitOverviewRisks(items: string[]) {
  return items.slice(0, 2);
}

function limitCycleChanges(
  items: DeterministicPdfData["reportData"]["relevantCycleChanges"],
) {
  return items.slice(0, 4);
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

function findingSeverityPalette(severity: "OBSERVACION" | "DEBIL" | "CRITICO") {
  switch (severity) {
    case "CRITICO":
      return {
        bg: COLORS.redBg,
        text: COLORS.redText,
      };
    case "DEBIL":
      return {
        bg: COLORS.amberBg,
        text: COLORS.amberText,
      };
    default:
      return {
        bg: COLORS.blueBg,
        text: COLORS.blueText,
      };
  }
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
  const cycleChanges = limitCycleChanges(
    data.reportData.relevantCycleChanges ?? [],
  );
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
            Criticidad de la relación: {data.companyCriticality}
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

        <View style={styles.page2Block} wrap={false}>
          <View style={styles.page2Card}>
            <Text style={styles.page2CardTitle}>Mapa de exposición</Text>
            <PillarExposureSummary data={data.pillars} />
          </View>
        </View>

        <View style={styles.page2Block} wrap={false}>
          <View style={styles.risksCompactCard}>
            <Text style={styles.page2CardTitle}>Riesgos prioritarios</Text>
            <PriorityRisksCompact
              items={limitOverviewRisks(data.reportData.priorityRisks ?? [])}
            />
          </View>
        </View>

        <View style={styles.pillarGridWrap} wrap={false}>
          <Text style={styles.pillarGridTitle}>Vista por pilar</Text>

          <View style={styles.pillarGrid}>
            <View style={styles.pillarGridItem}>
              <PillarCard
                pillarKey="financial"
                title="Financiero"
                score={data.pillars.financial}
                delta={data.deltas.financial}
              />
            </View>

            <View style={styles.pillarGridItem}>
              <PillarCard
                pillarKey="commercial"
                title="Comercial"
                score={data.pillars.commercial}
                delta={data.deltas.commercial}
                odd
              />
            </View>

            <View style={styles.pillarGridItem}>
              <PillarCard
                pillarKey="operational"
                title="Operativo"
                score={data.pillars.operational}
                delta={data.deltas.operational}
              />
            </View>

            <View style={styles.pillarGridItem}>
              <PillarCard
                pillarKey="legal"
                title="Legal"
                score={data.pillars.legal}
                delta={data.deltas.legal}
                odd
              />
            </View>

            <View style={styles.pillarGridItem}>
              <PillarCard
                pillarKey="strategic"
                title="Estratégico"
                score={data.pillars.strategic}
                delta={data.deltas.strategic}
              />
            </View>
          </View>
        </View>
      </Page>

      {/* PAGE 3 */}
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cambios relevantes del ciclo</Text>

          {cycleChanges.length ? (
            <View>
              {cycleChanges.map((change, index) => {
                const badgePalette =
                  change.kind === "IMPROVED"
                    ? { bg: COLORS.greenBg, text: COLORS.greenText }
                    : change.kind === "PERSISTING_RISK"
                      ? { bg: COLORS.amberBg, text: COLORS.amberText }
                      : { bg: COLORS.redBg, text: COLORS.redText };

                return (
                  <View
                    key={`${change.kind}-${change.fieldKey}-${index}`}
                    style={styles.cycleChangeCard}
                  >
                    <View style={styles.cycleChangeTop}>
                      <Text style={styles.cycleChangeTitle}>
                        {change.fieldLabel}
                      </Text>

                      <Text
                        style={[
                          styles.cycleChangeBadge,
                          {
                            backgroundColor: badgePalette.bg,
                            color: badgePalette.text,
                          },
                        ]}
                      >
                        {cycleChangeKindLabel(change.kind)}
                      </Text>
                    </View>

                    <Text style={styles.cycleChangeMeta}>
                      {change.pillarLabel}
                    </Text>

                    <Text style={styles.cycleChangeBody}>
                      {change.kind === "PERSISTING_RISK"
                        ? `Se mantiene en nivel ${fieldLevelLabel(change.currentValue)}.`
                        : `Pasó de ${fieldLevelLabel(change.previousValue)} a ${fieldLevelLabel(
                            change.currentValue,
                          )}.`}
                    </Text>

                    {change.rationale ? (
                      <Text style={[styles.cycleChangeBody, { marginTop: 4 }]}>
                        Contexto: {change.rationale}
                      </Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.bodyText}>
              No se registraron cambios relevantes del ciclo para esta
              evaluación.
            </Text>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Hallazgos priorizados del ciclo
          </Text>

          {priorityFindings.length ? (
            <View>
              {priorityFindings.map((finding) => {
                const palette = findingSeverityPalette(finding.severity);
                const actionText = actionRecommendationLabel(
                  finding.actionRecommendation,
                );

                return (
                  <View
                    key={`${finding.pillar}-${finding.fieldKey}`}
                    style={styles.findingCard}
                  >
                    <View style={styles.findingHeader}>
                      <Text style={styles.findingTitle}>
                        {finding.fieldLabel}
                      </Text>

                      <Text
                        style={[
                          styles.findingBadge,
                          {
                            backgroundColor: palette.bg,
                            color: palette.text,
                          },
                        ]}
                      >
                        {finding.severity}
                      </Text>

                      <Text style={styles.findingPillarBadge}>
                        {finding.pillarLabel}
                      </Text>
                    </View>

                    {finding.rationale ? (
                      <View style={styles.findingRow}>
                        <Text style={styles.findingLabel}>Situación:</Text>
                        <Text style={styles.findingValue}>
                          {finding.rationale}
                        </Text>
                      </View>
                    ) : null}

                    {finding.evidenceNote ? (
                      <View style={styles.findingRow}>
                        <Text style={styles.findingLabel}>Evidencia:</Text>
                        <Text style={styles.findingValue}>
                          {finding.evidenceNote}
                        </Text>
                      </View>
                    ) : null}

                    {finding.primaryIssue ? (
                      <View style={styles.findingRow}>
                        <Text style={styles.findingLabel}>Problema:</Text>
                        <Text style={styles.findingValue}>
                          {finding.primaryIssue}
                        </Text>
                      </View>
                    ) : null}

                    {actionText ? (
                      <View style={styles.findingRow}>
                        <Text style={styles.findingLabel}>Acción:</Text>
                        <Text style={styles.findingValue}>{actionText}</Text>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.bodyText}>
              No se registraron hallazgos priorizados relevantes en este ciclo.
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recomendaciones</Text>
          <BulletList
            items={recommendations}
            emptyText="No se definieron recomendaciones específicas para este ciclo."
          />
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
