import { ENGINE_VERSION } from "./version";
import type { EvaluationInput, ScoreResult } from "./types";
import {
  PILLAR_WEIGHTS,
  FINANCIAL_WEIGHTS,
  COMMERCIAL_WEIGHTS,
  OPERATIONAL_WEIGHTS,
  LEGAL_WEIGHTS,
  STRATEGIC_WEIGHTS,
  weightedSum,
  clamp01_100,
} from "./weights";
import { categoryFromScore } from "./categories";

/**
 * Redondeo:
 * - Guardar con 2 decimales (backend)
 * - UI mostrará 1 decimal
 */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateScore(input: EvaluationInput): ScoreResult {
  const financial = weightedSum(input.financial, FINANCIAL_WEIGHTS);
  const commercial = weightedSum(input.commercial, COMMERCIAL_WEIGHTS);
  const operational = weightedSum(input.operational, OPERATIONAL_WEIGHTS);
  const legal = weightedSum(input.legal, LEGAL_WEIGHTS);
  const strategic = weightedSum(input.strategic, STRATEGIC_WEIGHTS);

  const overall =
    clamp01_100(financial) * PILLAR_WEIGHTS.financial +
    clamp01_100(commercial) * PILLAR_WEIGHTS.commercial +
    clamp01_100(operational) * PILLAR_WEIGHTS.operational +
    clamp01_100(legal) * PILLAR_WEIGHTS.legal +
    clamp01_100(strategic) * PILLAR_WEIGHTS.strategic;

  const overall2 = round2(overall);

  return {
    engineVersion: ENGINE_VERSION,
    overallScore: overall2,
    executiveCategory: categoryFromScore(overall2),
    pillars: {
      financial: round2(financial),
      commercial: round2(commercial),
      operational: round2(operational),
      legal: round2(legal),
      strategic: round2(strategic),
    },
  };
}
