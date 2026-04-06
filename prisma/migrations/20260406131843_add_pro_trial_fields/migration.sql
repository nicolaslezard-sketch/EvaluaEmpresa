-- CreateEnum
CREATE TYPE "SubscriptionSource" AS ENUM ('TRIAL', 'MP', 'LEMON', 'MANUAL');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "isTrial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "source" "SubscriptionSource" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN     "trialEndsAt" TIMESTAMP(3),
ADD COLUMN     "trialStartedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "proTrialUsedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Subscription_source_idx" ON "Subscription"("source");

-- CreateIndex
CREATE INDEX "Subscription_isTrial_idx" ON "Subscription"("isTrial");
