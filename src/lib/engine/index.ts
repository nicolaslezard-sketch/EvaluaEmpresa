export { ENGINE_VERSION } from "./version";
export { calculateScore } from "./score";
export { computeDeltas } from "./deltas";
export { generateAlerts } from "./alerts";
export { categoryFromScore, categoryMicrocopy } from "./categories";
export { validateRequiredStructured } from "./validate";
export type {
  EvaluationInput,
  ScoreResult,
  DeltaResult,
  GeneratedAlert,
  PillarKey,
  ExecutiveCategory,
  CriticalityLevel,
  AlertSeverity,
  AlertType,
} from "./types";
