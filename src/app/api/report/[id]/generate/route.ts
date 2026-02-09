import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildEvaluaEmpresaPrompt } from "@/lib/prompts/evaluaEmpresa";
import { openai } from "@/lib/openai";
import { generateReportPdf } from "@/lib/pdf/generateReportPdf";
import { sendReportEmail } from "@/lib/mail/sendReportEmail";

export async function POST(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const report = await prisma.reportRequest.findUnique({
    where: { id },
  });

  if (!report) {
    return NextResponse.json(
      { error: "Reporte no encontrado" },
      { status: 404 },
    );
  }

  if (report.status === "DELIVERED") {
    return NextResponse.json({ ok: true });
  }

  if (report.status !== "PAID") {
    return NextResponse.json({ error: "Reporte no pagado" }, { status: 400 });
  }

  if (
    !report.formData ||
    typeof report.formData !== "object" ||
    Array.isArray(report.formData)
  ) {
    await prisma.reportRequest.update({
      where: { id },
      data: {
        status: "FAILED",
        lastError: "formData inválido",
      },
    });

    return NextResponse.json(
      { error: "Datos de formulario inválidos" },
      { status: 400 },
    );
  }

  const formData = report.formData as Record<string, unknown>;

  await prisma.reportRequest.update({
    where: { id },
    data: { status: "GENERATING" },
  });

  try {
    const prompt = buildEvaluaEmpresaPrompt(formData);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const text = completion.choices[0].message.content;
    if (!text) throw new Error("Respuesta vacía de OpenAI");

    const parsed = JSON.parse(text);
    const pdfBuffer = await generateReportPdf(parsed);

    await prisma.reportRequest.update({
      where: { id },
      data: {
        reportText: text,
        status: "DELIVERED",
      },
    });

    await sendReportEmail({
      to: report.email,
      reportId: id,
      pdfBuffer,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    await prisma.reportRequest.update({
      where: { id },
      data: {
        status: "FAILED",
        lastError: err instanceof Error ? err.message : String(err),
      },
    });

    return NextResponse.json(
      { error: "Error generando informe" },
      { status: 500 },
    );
  }
}
