import fs from "fs";
import path from "path";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReportPdf } from "./ReportPdf";

export async function generateReportPdf(params: {
  reportId: string;
  content: string;
}) {
  const isProd = process.env.NODE_ENV === "production";

  const outputDir = isProd ? "/tmp" : path.join(process.cwd(), "storage");

  fs.mkdirSync(outputDir, { recursive: true });

  const filePath = path.join(outputDir, `informe-${params.reportId}.pdf`);

  // ✅ Buffer REAL, bien tipado
  const buffer = await renderToBuffer(
    <ReportPdf reportId={params.reportId} content={params.content} />,
  );

  fs.writeFileSync(filePath, buffer);

  return filePath;
}
