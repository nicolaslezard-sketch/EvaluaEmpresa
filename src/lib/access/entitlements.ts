import type { SubscriptionPlan } from "@prisma/client";

export type Entitlements = {
  plan: SubscriptionPlan;
  maxCompanies: number;
  maxFinalizedEvaluationsTotal: number | null;
  trendDepth: number;
  canSeeAlerts: boolean;
  canDownloadPdf: boolean;
};

export function resolveEntitlements(plan: SubscriptionPlan): Entitlements {
  switch (plan) {
    case "PROFESSIONAL":
      return {
        plan,
        maxCompanies: 3,
        maxFinalizedEvaluationsTotal: null,
        trendDepth: 3,
        canSeeAlerts: false,
        canDownloadPdf: true,
      };

    case "ENTERPRISE":
      return {
        plan,
        maxCompanies: 15,
        maxFinalizedEvaluationsTotal: null,
        trendDepth: 6,
        canSeeAlerts: true,
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
        canDownloadPdf: false,
      };
  }
}
