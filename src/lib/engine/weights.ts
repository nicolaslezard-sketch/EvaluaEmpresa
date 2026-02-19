import type { PillarKey, EvaluationInput } from "./types";

/**
 * Pesos globales (congelados)
 */
export const PILLAR_WEIGHTS: Record<PillarKey, number> = {
  financial: 0.25,
  commercial: 0.2,
  operational: 0.2,
  legal: 0.15,
  strategic: 0.2,
} as const;

/**
 * Pesos internos por variable (congelados)
 */
export const FINANCIAL_WEIGHTS: Record<
  keyof EvaluationInput["financial"],
  number
> = {
  liquidity: 0.3,
  debtLevel: 0.25,
  revenueStability: 0.25,
  externalDependency: 0.2,
} as const;

export const COMMERCIAL_WEIGHTS: Record<
  keyof EvaluationInput["commercial"],
  number
> = {
  clientConcentration: 0.3,
  competitivePosition: 0.25,
  sectorDependency: 0.2,
  contractGeneration: 0.25,
} as const;

export const OPERATIONAL_WEIGHTS: Record<
  keyof EvaluationInput["operational"],
  number
> = {
  keyPersonDependency: 0.25,
  structureFormalization: 0.25,
  operationalRisk: 0.25,
  adaptability: 0.25,
} as const;

export const LEGAL_WEIGHTS: Record<keyof EvaluationInput["legal"], number> = {
  compliance: 0.35,
  litigation: 0.25,
  contractFormalization: 0.2,
  regulatoryRisk: 0.2,
} as const;

export const STRATEGIC_WEIGHTS: Record<
  keyof EvaluationInput["strategic"],
  number
> = {
  strategicClarity: 0.25,
  macroDependency: 0.2,
  innovationLevel: 0.2,
  resilience: 0.35,
} as const;

/**
 * Guard rails básicos para valores:
 * el motor espera números 0..100
 */
export function clamp01_100(n: number): number {
  if (Number.isNaN(n) || !Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 100) return 100;
  return n;
}

export function weightedSum<T extends Record<string, number>>(
  values: T,
  weights: Record<keyof T, number>,
): number {
  let sum = 0;
  for (const k of Object.keys(weights) as Array<keyof T>) {
    const w = weights[k] ?? 0;
    const v = clamp01_100(values[k] ?? 0);
    sum += v * w;
  }
  return sum;
}
