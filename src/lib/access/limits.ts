export type Plan = "FREE" | "UNLOCK" | "PRO" | "BUSINESS";

export type Entitlements = {
  plan: Plan;
  maxCompanies: number;
  maxFinalizedEvaluationsTotal: number | null; // null = ilimitado
  trendDepth: number;
  canSeeAlerts: boolean;
  canCreateEvaluation: boolean;
  canDownloadPdf: boolean;
};

export function entitlementsFrom(plan: Plan): Entitlements {
  switch (plan) {
    case "FREE":
      return {
        plan,
        maxCompanies: 1,
        maxFinalizedEvaluationsTotal: 1,
        trendDepth: 0,
        canSeeAlerts: false,
        canCreateEvaluation: true, // pero limitado a 1 total FINALIZED
        canDownloadPdf: false,
      };
    case "UNLOCK":
      return {
        plan,
        maxCompanies: 1,
        maxFinalizedEvaluationsTotal: null,
        trendDepth: 0,
        canSeeAlerts: false,
        canCreateEvaluation: true,
        canDownloadPdf: true, // solo para evaluaciones unlockeadas
      };
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
  }
}
