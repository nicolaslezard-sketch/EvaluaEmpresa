import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReportText } from "@/lib/reports/generateReportText";
import { renderPdf } from "@/lib/reports/renderPdf";
import { uploadPdf } from "@/lib/reports/storage";
import { sendReportEmail } from "@/lib/reports/email";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: reportId } = await params;

  const report = await prisma.reportRequest.findUnique({
    where: { id: reportId },
  });

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  // 🧱 Idempotencia dura
  if (report.status === "DELIVERED" && report.pdfPath) {
    return NextResponse.json({ ok: true });
  }

  if (report.status !== "PAID" && report.status !== "FAILED") {
    return NextResponse.json({ ok: true });
  }

  try {
    await prisma.reportRequest.update({
      where: { id: reportId },
      data: {
        status: "GENERATING",
        attempts: { increment: 1 },
        lastError: null,
      },
    });

    // 1️⃣ IA
    const reportText =
      report.reportText ?? (await generateReportText(report.formData));

    // 2️⃣ PDF
    const pdfBuffer = await renderPdf({
      reportText,
      email: report.email,
    });

    // 3️⃣ Storage (R2)
    const pdfPath = await uploadPdf(reportId, pdfBuffer);

    // 4️⃣ Email
    await sendReportEmail({
      to: report.email,
      pdfUrl: pdfPath,
    });

    // 5️⃣ Persistencia final
    await prisma.reportRequest.update({
      where: { id: reportId },
      data: {
        reportText,
        pdfPath,
        status: "DELIVERED",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("GENERATE REPORT ERROR", error);

    await prisma.reportRequest.update({
      where: { id: reportId },
      data: {
        status: "FAILED",
        lastError: error?.message ?? "Unknown error",
      },
    });

    return NextResponse.json({ ok: false });
  }
}
