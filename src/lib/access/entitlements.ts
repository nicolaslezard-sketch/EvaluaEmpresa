import type { SubscriptionPlan } from "@prisma/client";

export type Entitlements = {
  plan: SubscriptionPlan;
  maxCompanies: number;
  maxFinalizedEvaluationsTotal: number | null;
  trendDepth: number;
  canSeeAlerts: boolean;
  canCreateEvaluation: boolean;
  canDownloadPdf: boolean;
};

export function resolveEntitlements(plan: SubscriptionPlan): Entitlements {
  switch (plan) {
    case "PRO":
      return {
        plan,
        maxCompanies: 3,
        maxFinalizedEvaluationsTotal: null,
        trendDepth: 3,
        canSeeAlerts: false,
        canCreateEvaluation: true,
        canDownloadPdf: true,
      };

    case "BUSINESS":
      return {
        plan,
        maxCompanies: 15,
        maxFinalizedEvaluationsTotal: null,
        trendDepth: 6,
        canSeeAlerts: true,
        canCreateEvaluation: true,
        canDownloadPdf: true,
      };

    case "FREE":
    default:
      return {
        plan: "FREE",
        maxCompanies: 1,
        maxFinalizedEvaluationsTotal: 1,
        trendDepth: 0,
        canSeeAlerts: false,
        canCreateEvaluation: true, // puede crear 1 evaluación
        canDownloadPdf: false,
      };
  }
}
