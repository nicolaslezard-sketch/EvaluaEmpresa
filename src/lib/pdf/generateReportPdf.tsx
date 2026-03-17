import {
  renderToBuffer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

export type DeterministicPdfData = {
  companyName: string;
  generatedAt: string;
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
  };
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#111827",
  },
  header: {
    marginBottom: 18,
    paddingBottom: 12,
    borderBottom: "1 solid #e5e7eb",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#4b5563",
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    border: "1 solid #d1d5db",
    fontSize: 9,
  },
  scoreBox: {
    marginTop: 16,
    padding: 12,
    border: "1 solid #d1d5db",
    backgroundColor: "#f9fafb",
  },
  scoreLabel: {
    fontSize: 10,
    color: "#4b5563",
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 4,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 6,
    lineHeight: 1.45,
  },
  grid: {
    marginTop: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1 solid #e5e7eb",
    paddingVertical: 6,
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f9fafb",
  },
  tableCol1: {
    width: "38%",
  },
  tableCol2: {
    width: "18%",
  },
  tableCol3: {
    width: "18%",
  },
  tableCol4: {
    width: "26%",
  },
  bullet: {
    marginBottom: 6,
    lineHeight: 1.4,
  },
  small: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 22,
    lineHeight: 1.4,
  },
});

function formatScore(value: number | null) {
  return typeof value === "number" && Number.isFinite(value)
    ? value.toFixed(1)
    : "—";
}

function formatDelta(value: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
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

export async function generateReportPdf(
  data: DeterministicPdfData,
): Promise<Buffer> {
  const pillarRows: Array<keyof DeterministicPdfData["pillars"]> = [
    "financial",
    "commercial",
    "operational",
    "legal",
    "strategic",
  ];

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Informe E-Score™ — {data.companyName}
          </Text>
          <Text style={styles.subtitle}>
            Fecha de generación: {data.generatedAt}
          </Text>

          <View style={styles.badgeRow}>
            <Text style={styles.badge}>
              Criticidad: {data.companyCriticality}
            </Text>
            <Text style={styles.badge}>
              Categoría: {data.executiveCategory}
            </Text>
          </View>
        </View>

        {/* SCORE GENERAL */}
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Score general</Text>
          <Text style={styles.scoreValue}>
            {formatScore(data.overallScore)}
          </Text>
          <Text style={styles.paragraph}>
            Variación vs. ciclo anterior: {formatDelta(data.deltas.overall)}
          </Text>
        </View>

        {/* RESUMEN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen ejecutivo</Text>
          <Text style={styles.paragraph}>
            {data.reportData.executiveSummary}
          </Text>
        </View>

        {/* PILARES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalle por pilar</Text>

          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCol1}>
              <Text>Pilar</Text>
            </View>
            <View style={styles.tableCol2}>
              <Text>Score</Text>
            </View>
            <View style={styles.tableCol3}>
              <Text>Delta</Text>
            </View>
            <View style={styles.tableCol4}>
              <Text>Lectura</Text>
            </View>
          </View>

          {pillarRows.map((key) => {
            const score = data.pillars[key];
            const delta = data.deltas[key];

            return (
              <View key={key} style={styles.tableRow}>
                <View style={styles.tableCol1}>
                  <Text>{pillarLabel(key)}</Text>
                </View>
                <View style={styles.tableCol2}>
                  <Text>{formatScore(score)}</Text>
                </View>
                <View style={styles.tableCol3}>
                  <Text>{formatDelta(delta)}</Text>
                </View>
                <View style={styles.tableCol4}>
                  <Text>
                    {typeof score === "number" && score >= 80
                      ? "Fuerte"
                      : typeof score === "number" && score >= 65
                        ? "Estable"
                        : typeof score === "number" && score >= 50
                          ? "Vulnerable"
                          : "Crítico"}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* HALLAZGOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hallazgos clave</Text>
          {data.reportData.keyFindings.map((item, i) => (
            <Text key={i} style={styles.bullet}>
              • {item}
            </Text>
          ))}
        </View>

        {/* RIESGOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Riesgos prioritarios</Text>
          {data.reportData.priorityRisks.map((item, i) => (
            <Text key={i} style={styles.bullet}>
              • {item}
            </Text>
          ))}
        </View>

        {/* RECOMENDACIONES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recomendaciones</Text>
          {data.reportData.recommendations.map((item, i) => (
            <Text key={i} style={styles.bullet}>
              • {item}
            </Text>
          ))}
        </View>

        {/* PRÓXIMA REVISIÓN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próxima revisión sugerida</Text>
          <Text style={styles.paragraph}>
            {data.reportData.nextReviewSuggestedDays !== null
              ? `Se recomienda una nueva revisión en aproximadamente ${data.reportData.nextReviewSuggestedDays} días.`
              : "No hay una sugerencia de revisión disponible para este ciclo."}
          </Text>
        </View>

        {/* DISCLAIMER */}
        <Text style={styles.small}>
          Informe orientativo basado en información estructurada cargada en la
          plataforma. No constituye asesoramiento legal, contable ni financiero.
          El PDF es una exportación del sistema de monitoreo continuo y no
          reemplaza un proceso de due diligence formal.
        </Text>
      </Page>
    </Document>
  );

  return await renderToBuffer(doc);
}
