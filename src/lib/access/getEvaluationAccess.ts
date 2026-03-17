import { prisma } from "@/lib/prisma";
import { getUserEntitlements } from "./getEntitlements";
import { hasOneTimeEvaluationAccess } from "./oneTimeAccess";

export type EvaluationAccessReason = "subscription" | "one_time" | "none";

export type EvaluationAccess = {
  exists: boolean;
  isOwner: boolean;
  hasAccess: boolean;
  canViewFullReport: boolean;
  canDownloadPdf: boolean;
  reason: EvaluationAccessReason;
};

export async function getEvaluationAccess({
  userId,
  evaluationId,
}: {
  userId: string;
  evaluationId: string;
}): Promise<EvaluationAccess> {
  const evaluation = await prisma.evaluation.findUnique({
    where: { id: evaluationId },
    select: {
      id: true,
      company: {
        select: {
          ownerId: true,
        },
      },
    },
  });

  if (!evaluation) {
    return {
      exists: false,
      isOwner: false,
      hasAccess: false,
      canViewFullReport: false,
      canDownloadPdf: false,
      reason: "none",
    };
  }

  const isOwner = evaluation.company.ownerId === userId;

  if (!isOwner) {
    return {
      exists: true,
      isOwner: false,
      hasAccess: false,
      canViewFullReport: false,
      canDownloadPdf: false,
      reason: "none",
    };
  }

  const entitlements = await getUserEntitlements(userId);

  if (entitlements.canDownloadPdfBySubscription) {
    return {
      exists: true,
      isOwner: true,
      hasAccess: true,
      canViewFullReport: true,
      canDownloadPdf: true,
      reason: "subscription",
    };
  }

  const hasOneTimeAccess = await hasOneTimeEvaluationAccess({
    userId,
    evaluationId,
  });

  if (hasOneTimeAccess) {
    return {
      exists: true,
      isOwner: true,
      hasAccess: true,
      canViewFullReport: true,
      canDownloadPdf: true,
      reason: "one_time",
    };
  }

  return {
    exists: true,
    isOwner: true,
    hasAccess: true,
    canViewFullReport: false,
    canDownloadPdf: false,
    reason: "none",
  };
}
