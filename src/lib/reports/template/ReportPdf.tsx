import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40 },
  title: { fontSize: 18, marginBottom: 20 },
  body: { fontSize: 12 },
});

export default function ReportPdf({
  reportText,
  email,
}: {
  reportText: string;
  email: string;
}) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.title}>Informe de Riesgo Empresarial</Text>
        <Text style={styles.body}>{reportText}</Text>
        <Text style={{ marginTop: 20, fontSize: 10 }}>Email: {email}</Text>
      </Page>
    </Document>
  );
}
