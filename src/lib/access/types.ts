import type { SubscriptionPlan } from "@prisma/client";

export type Entitlements = {
  plan: SubscriptionPlan;
  maxActiveCompanies: number;
  canCreateEvaluation: boolean;
  canSeeAlerts: boolean;
  trendDepth: 0 | 3 | 6;
  canDownloadPdf: boolean;
};
