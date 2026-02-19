import type { EvaluationInput, PillarKey } from "./types";

export type ValidationError = {
  code: "INCOMPLETE_SECTIONS";
  missing: PillarKey[];
};

function isNum(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function sectionComplete(section: Record<string, number>): boolean {
  return Object.values(section).every(isNum);
}

export function validateRequiredStructured(
  input: EvaluationInput,
): ValidationError | null {
  const missing: PillarKey[] = [];

  if (!sectionComplete(input.financial)) {
    missing.push("financial");
  }

  if (!sectionComplete(input.commercial)) {
    missing.push("commercial");
  }

  if (!sectionComplete(input.operational)) {
    missing.push("operational");
  }

  if (!sectionComplete(input.legal)) {
    missing.push("legal");
  }

  if (!sectionComplete(input.strategic)) {
    missing.push("strategic");
  }

  return missing.length ? { code: "INCOMPLETE_SECTIONS", missing } : null;
}
