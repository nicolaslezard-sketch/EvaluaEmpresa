-- CreateEnum
CREATE TYPE "ThirdPartyType" AS ENUM ('SUPPLIER', 'CONTRACTOR', 'SUBCONTRACTOR', 'OTHER');

-- CreateEnum
CREATE TYPE "WorkSiteStatus" AS ENUM ('PLANNED', 'ACTIVE', 'PAUSED', 'FINISHED');

-- AlterTable
ALTER TABLE "Company"
ADD COLUMN "thirdPartyType" "ThirdPartyType",
ADD COLUMN "trade" TEXT,
ADD COLUMN "taxId" TEXT;

-- CreateTable
CREATE TABLE "WorkSite" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "responsibleName" TEXT,
    "status" "WorkSiteStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3),
    "expectedEndDate" TIMESTAMP(3),
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkSite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkSiteCompany" (
    "id" TEXT NOT NULL,
    "workSiteId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" TEXT,
    "trade" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "startedAt" TIMESTAMP(3),
    "endedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkSiteCompany_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Company_thirdPartyType_idx" ON "Company"("thirdPartyType");

-- CreateIndex
CREATE INDEX "WorkSite_ownerId_idx" ON "WorkSite"("ownerId");

-- CreateIndex
CREATE INDEX "WorkSite_status_idx" ON "WorkSite"("status");

-- CreateIndex
CREATE INDEX "WorkSiteCompany_companyId_idx" ON "WorkSiteCompany"("companyId");

-- CreateIndex
CREATE INDEX "WorkSiteCompany_workSiteId_active_idx" ON "WorkSiteCompany"("workSiteId", "active");

-- CreateIndex
CREATE UNIQUE INDEX "WorkSiteCompany_workSiteId_companyId_key" ON "WorkSiteCompany"("workSiteId", "companyId");

-- AddForeignKey
ALTER TABLE "WorkSite" ADD CONSTRAINT "WorkSite_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSiteCompany" ADD CONSTRAINT "WorkSiteCompany_workSiteId_fkey" FOREIGN KEY ("workSiteId") REFERENCES "WorkSite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkSiteCompany" ADD CONSTRAINT "WorkSiteCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
