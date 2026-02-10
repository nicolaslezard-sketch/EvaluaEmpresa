/*
  Warnings:

  - You are about to drop the column `pdfPath` on the `ReportRequest` table. All the data in the column will be lost.
  - The `status` column on the `ReportRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ReportRequest" DROP COLUMN "pdfPath",
ADD COLUMN     "pdfKey" TEXT,
ADD COLUMN     "pdfMime" TEXT,
ADD COLUMN     "pdfSize" INTEGER,
ADD COLUMN     "title" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "ReportStatus" NOT NULL DEFAULT 'PENDING_PAYMENT';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt";

-- CreateIndex
CREATE INDEX "ReportRequest_status_idx" ON "ReportRequest"("status");
