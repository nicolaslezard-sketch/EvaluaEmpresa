export type PillarKey =
  | "financial"
  | "commercial"
  | "operational"
  | "legal"
  | "strategic";

export type ExecutiveCategory = "SOLIDO" | "ESTABLE" | "VULNERABLE" | "CRITICO";

export type CriticalityLevel = "LOW" | "MEDIUM" | "HIGH";

export type AlertSeverity = "INFO" | "WARNING" | "CRITICAL";

export type AlertType =
  | "SCORE_DROP"
  | "PILLAR_DROP"
  | "CONSECUTIVE_DROP"
  | "VOLATILITY"
  | "LOW_SCORE_HIGH_CRITICALITY"
  | "STALE_HIGH_CRITICALITY";

export type EvaluationInput = {
  financial: {
    liquidity: number;
    debtLevel: number;
    revenueStability: number;
    externalDependency: number;
  };
  commercial: {
    clientConcentration: number;
    competitivePosition: number;
    sectorDependency: number;
    contractGeneration: number;
  };
  operational: {
    keyPersonDependency: number;
    structureFormalization: number;
    operationalRisk: number;
    adaptability: number;
  };
  legal: {
    compliance: number;
    litigation: number;
    contractFormalization: number;
    regulatoryRisk: number;
  };
  strategic: {
    strategicClarity: number;
    macroDependency: number;
    innovationLevel: number;
    resilience: number;
  };
};

export type ScoreResult = {
  engineVersion: string;
  overallScore: number;
  executiveCategory: ExecutiveCategory;
  pillars: Record<PillarKey, number>;
};

export type DeltaResult = {
  overall: number | null;
  pillars: Record<PillarKey, number | null>;
  // Si cambia engineVersion entre current/previous, avisamos a UI
  engineVersionChanged: boolean;
};

export type GeneratedAlert = {
  type: AlertType;
  severity: AlertSeverity;
  message: string;
};
