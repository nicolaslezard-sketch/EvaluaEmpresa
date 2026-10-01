-- CreateEnum
CREATE TYPE "IncidentType" AS ENUM ('DELAY', 'QUALITY', 'DELIVERY', 'DOCUMENTATION', 'SAFETY', 'COMMUNICATION', 'CONTRACTUAL', 'OTHER');

-- CreateEnum
CREATE TYPE "IncidentSeverity" AS ENUM ('MINOR', 'RELEVANT', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'FOLLOW_UP', 'RESOLVED');

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "IncidentType" NOT NULL,
    "severity" "IncidentSeverity" NOT NULL DEFAULT 'RELEVANT',
    "status" "IncidentStatus" NOT NULL DEFAULT 'OPEN',
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "ownerId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "workSiteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Incident_ownerId_status_idx" ON "Incident"("ownerId", "status");

-- CreateIndex
CREATE INDEX "Incident_companyId_status_idx" ON "Incident"("companyId", "status");

-- CreateIndex
CREATE INDEX "Incident_workSiteId_status_idx" ON "Incident"("workSiteId", "status");

-- CreateIndex
CREATE INDEX "Incident_occurredAt_idx" ON "Incident"("occurredAt");

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_workSiteId_fkey" FOREIGN KEY ("workSiteId") REFERENCES "WorkSite"("id") ON DELETE SET NULL ON UPDATE CASCADE;
