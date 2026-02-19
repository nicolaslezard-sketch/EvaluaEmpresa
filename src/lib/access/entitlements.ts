import type { SubscriptionPlan } from "@prisma/client";
import type { Entitlements } from "./types";

/**
 * Matriz congelada de planes
 */
export function resolveEntitlements(plan: SubscriptionPlan): Entitlements {
  switch (plan) {
    case "PRO":
      return {
        plan,
        maxActiveCompanies: 3,
        canCreateEvaluation: true,
        canSeeAlerts: false,
        trendDepth: 3,
        canDownloadPdf: true,
      };

    case "BUSINESS":
      return {
        plan,
        maxActiveCompanies: 15,
        canCreateEvaluation: true,
        canSeeAlerts: true,
        trendDepth: 6,
        canDownloadPdf: true,
      };

    case "FREE":
    default:
      return {
        plan: "FREE",
        maxActiveCompanies: 1,
        canCreateEvaluation: false, // FREE solo 1 evaluación inicial
        canSeeAlerts: false,
        trendDepth: 0,
        canDownloadPdf: false,
      };
  }
}
