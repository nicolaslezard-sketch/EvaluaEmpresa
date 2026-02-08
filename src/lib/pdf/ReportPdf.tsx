import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  meta: {
    fontSize: 10,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
  },
  box: {
    backgroundColor: "#f3f3f3",
    padding: 12,
    borderLeft: "4 solid #333",
    marginBottom: 30,
    fontSize: 10,
  },
  sectionTitle: {
    fontSize: 14,
    marginTop: 20,
    marginBottom: 6,
    textDecoration: "underline",
  },
  text: {
    marginBottom: 10,
  },
  footer: {
    marginTop: 40,
    fontSize: 9,
    textAlign: "center",
    color: "#777",
  },
});

export function ReportPdf({
  reportId,
  content,
}: {
  reportId: string;
  content: string;
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Informe Orientativo de Riesgo Empresarial
        </Text>

        <Text style={styles.meta}>
          Código: {reportId}
          {"\n"}
          Fecha: {new Date().toLocaleDateString("es-AR")}
        </Text>

        <View style={styles.box}>
          <Text>
            Este informe es orientativo y no constituye asesoramiento legal,
            contable ni financiero.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Informe</Text>

        {content.split("\n").map((line, i) => (
          <Text key={i} style={styles.text}>
            {line}
          </Text>
        ))}

        <Text style={styles.footer}>
          Documento confidencial – Uso exclusivo del solicitante
        </Text>
      </Page>
    </Document>
  );
}
