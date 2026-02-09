import { Resend } from "resend";

let resend: Resend | null = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY no configurada");
  }

  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }

  return resend;
}

export async function sendReportEmail(params: {
  to: string;
  reportId: string;
  pdfBuffer: Uint8Array | Buffer;
}) {
  const { to, reportId, pdfBuffer } = params;

  const client = getResend();

  await client.emails.send({
    from: "EvaluaEmpresa <informes@evaluaempresa.com>",
    to,
    subject: "Tu informe de riesgo empresarial",
    text: `Tu informe ya está listo.

ID de reporte: ${reportId}
`,
    attachments: [
      {
        filename: `informe-${reportId}.pdf`,
        content: Buffer.from(pdfBuffer),
      },
    ],
  });
}
