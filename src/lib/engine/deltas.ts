import type { DeltaResult, PillarKey } from "./types";
import type { ScoreResult } from "./types";
import { round2 } from "./score";

export function computeDeltas(
  current: ScoreResult,
  previous: ScoreResult | null,
): DeltaResult {
  const keys: PillarKey[] = [
    "financial",
    "commercial",
    "operational",
    "legal",
    "strategic",
  ];

  if (!previous) {
    return {
      overall: null,
      pillars: {
        financial: null,
        commercial: null,
        operational: null,
        legal: null,
        strategic: null,
      },
      engineVersionChanged: false,
    };
  }

  const pillars = {} as Record<PillarKey, number>;
  for (const k of keys) {
    pillars[k] = round2(current.pillars[k] - previous.pillars[k]);
  }

  return {
    overall: round2(current.overallScore - previous.overallScore),
    pillars,
    engineVersionChanged: current.engineVersion !== previous.engineVersion,
  };
}
