import { renderToBuffer } from "@react-pdf/renderer";
import ReportPdf from "./template/ReportPdf";

export async function renderPdf({
  reportText,
  email,
}: {
  reportText: string;
  email: string;
}) {
  return renderToBuffer(<ReportPdf reportText={reportText} email={email} />);
}
