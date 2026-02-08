import { Resend } from "resend";

export async function sendReportEmail({
  to,
  pdfUrl,
}: {
  to: string;
  pdfUrl: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "EvaluaEmpresa <informes@evaluaempresa.com>",
    to,
    subject: "Tu informe de riesgo empresarial",
    html: `
      <p>Tu informe ya está listo.</p>
      <p><a href="${pdfUrl}">Descargar PDF</a></p>
      <p>Este informe es orientativo.</p>
    `,
  });
}
