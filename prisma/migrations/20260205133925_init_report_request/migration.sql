-- CreateTable
CREATE TABLE "ReportRequest" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "formData" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reportText" TEXT,
    "pdfPath" TEXT,
    "paymentId" TEXT,
    "mpPaymentId" TEXT,
    "mpStatus" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReportRequest_status_idx" ON "ReportRequest"("status");

-- CreateIndex
CREATE INDEX "ReportRequest_email_idx" ON "ReportRequest"("email");
