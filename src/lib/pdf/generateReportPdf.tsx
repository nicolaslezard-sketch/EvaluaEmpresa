import { renderToBuffer } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ReportJson } from "@/lib/types/report";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#555",
  },
  scoreBox: {
    marginTop: 16,
    padding: 12,
    border: "1 solid #ddd",
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 6,
    lineHeight: 1.4,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  tableCol1: { width: "40%" },
  tableCol2: { width: "20%" },
  tableCol3: { width: "40%" },
  small: {
    fontSize: 9,
    color: "#666",
    marginTop: 20,
  },
});

export async function generateReportPdf(data: ReportJson): Promise<Buffer> {
  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Informe E-Score™ – {data.portada.nombre_empresa}
          </Text>
          <Text style={styles.subtitle}>{data.portada.fecha}</Text>
        </View>

        {/* SCORE GENERAL */}
        <View style={styles.scoreBox}>
          <Text>
            E-Score™ General:{" "}
            {data.portada.e_score_general.score_total.toFixed(1)}
          </Text>
          <Text>Nivel: {data.portada.e_score_general.nivel_general}</Text>
        </View>

        {/* RESUMEN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen Ejecutivo</Text>
          <Text style={styles.paragraph}>{data.resumen_ejecutivo}</Text>
        </View>

        {/* TABLA PILARES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evaluación por Pilar</Text>
          {data.pilares.map((p, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={styles.tableCol1}>
                <Text>{p.nombre}</Text>
              </View>
              <View style={styles.tableCol2}>
                <Text>{Number(p.score).toFixed(1)}</Text>
              </View>
              <View style={styles.tableCol3}>
                <Text>{p.nivel}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* FACTORES CRÍTICOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Factores Críticos</Text>
          {data.factores_criticos.map((f, i) => (
            <Text key={i} style={styles.paragraph}>
              • {f.factor} ({f.impacto}) – {f.descripcion}
            </Text>
          ))}
        </View>

        {/* ESCENARIOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Escenarios Potenciales</Text>
          <Text style={styles.paragraph}>
            Conservador: {data.escenarios_potenciales.conservador}
          </Text>
          <Text style={styles.paragraph}>
            Intermedio: {data.escenarios_potenciales.intermedio}
          </Text>
          <Text style={styles.paragraph}>
            Adverso: {data.escenarios_potenciales.adverso}
          </Text>
        </View>

        {/* RECOMENDACIONES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recomendaciones Estratégicas</Text>
          {data.recomendaciones_estrategicas.map((r, i) => (
            <Text key={i} style={styles.paragraph}>
              • {r}
            </Text>
          ))}
        </View>

        {/* CONCLUSIÓN */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conclusión Ejecutiva</Text>
          <Text style={styles.paragraph}>{data.conclusion_ejecutiva}</Text>
        </View>

        {/* LEGAL */}
        <Text style={styles.small}>
          Informe orientativo basado en información declarada por el
          solicitante. No constituye asesoramiento legal, contable ni
          financiero.
        </Text>
      </Page>
    </Document>
  );

  // 👇 ESTA ES LA CLAVE
  return await renderToBuffer(doc);
}
