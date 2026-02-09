import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ReportJson } from "@/lib/types/report";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11 },
  section: { marginBottom: 12 },
  title: { fontSize: 16, marginBottom: 20 },
  heading: { fontSize: 12, marginBottom: 4 },
});

export default function ReportPdf({ data }: { data: ReportJson }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Informe de Riesgo Empresarial</Text>

        <View style={styles.section}>
          <Text style={styles.heading}>Resumen ejecutivo</Text>
          <Text>{data.resumen_ejecutivo}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Perfil empresa</Text>
          <Text>{data.perfil_empresa}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Conclusión</Text>
          <Text>{data.conclusion}</Text>
        </View>
      </Page>
    </Document>
  );
}
