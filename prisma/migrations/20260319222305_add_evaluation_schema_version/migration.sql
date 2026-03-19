-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "schemaVersion" INTEGER NOT NULL DEFAULT 2;

-- CreateIndex
CREATE INDEX "Evaluation_schemaVersion_idx" ON "Evaluation"("schemaVersion");
