import { renderToBuffer } from "@react-pdf/renderer";
import ReportPdf from "./ReportPdf";
import { ReportJson } from "@/lib/types/report";

export async function generateReportPdf(data: ReportJson) {
  return renderToBuffer(<ReportPdf data={data} />);
}
