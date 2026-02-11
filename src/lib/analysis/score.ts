export type NormalizedRisk = "BAJO" | "MEDIO" | "ALTO" | "CRITICO";

export function clampScore(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(1, Math.min(5, Math.round(n * 10) / 10));
}

export function normalizeRiskLevel(label: string): NormalizedRisk {
  const v = (label || "").toLowerCase();

  if (v.includes("criti")) return "CRITICO";
  if (v.includes("elev") || v.includes("alto")) return "ALTO";
  if (v.includes("medio")) return "MEDIO";
  return "BAJO";
}

export function scoreToRiskLevel(score: number): NormalizedRisk {
  // 5 = mejor perfil (menor riesgo). Ajustamos a tu escala:
  // score alto => riesgo más bajo.
  if (score >= 4.3) return "BAJO";
  if (score >= 3.4) return "MEDIO";
  if (score >= 2.5) return "ALTO";
  return "CRITICO";
}
