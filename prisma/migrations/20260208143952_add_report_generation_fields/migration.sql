/*
  Warnings:

  - You are about to drop the column `mpPaymentId` on the `ReportRequest` table. All the data in the column will be lost.
  - You are about to drop the column `mpStatus` on the `ReportRequest` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `ReportRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mercadopagoPaymentId]` on the table `ReportRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ReportRequest" DROP COLUMN "mpPaymentId",
DROP COLUMN "mpStatus",
DROP COLUMN "paymentId",
ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "mercadopagoPaymentId" TEXT,
ADD COLUMN     "mercadopagoStatus" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ReportRequest_mercadopagoPaymentId_key" ON "ReportRequest"("mercadopagoPaymentId");
