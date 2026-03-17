/*
  Warnings:

  - You are about to drop the `EvaluationUnlock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EvaluationUnlock" DROP CONSTRAINT "EvaluationUnlock_evaluationId_fkey";

-- DropForeignKey
ALTER TABLE "EvaluationUnlock" DROP CONSTRAINT "EvaluationUnlock_userId_fkey";

-- DropTable
DROP TABLE "EvaluationUnlock";

-- CreateTable
CREATE TABLE "OneTimeEvaluationAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OneTimeEvaluationAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OneTimeEvaluationAccess_evaluationId_idx" ON "OneTimeEvaluationAccess"("evaluationId");

-- CreateIndex
CREATE UNIQUE INDEX "OneTimeEvaluationAccess_userId_evaluationId_key" ON "OneTimeEvaluationAccess"("userId", "evaluationId");

-- AddForeignKey
ALTER TABLE "OneTimeEvaluationAccess" ADD CONSTRAINT "OneTimeEvaluationAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OneTimeEvaluationAccess" ADD CONSTRAINT "OneTimeEvaluationAccess_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
