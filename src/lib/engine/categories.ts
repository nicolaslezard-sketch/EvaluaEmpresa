import type { ExecutiveCategory } from "./types";

/**
 * Umbrales congelados
 */
export function categoryFromScore(score: number): ExecutiveCategory {
  if (score >= 80) return "SOLIDO";
  if (score >= 65) return "ESTABLE";
  if (score >= 50) return "VULNERABLE";
  return "CRITICO";
}

export function categoryMicrocopy(category: ExecutiveCategory): string {
  switch (category) {
    case "SOLIDO":
      return "Riesgo bajo. Estructura estable.";
    case "ESTABLE":
      return "Riesgo moderado. Monitoreo recomendado.";
    case "VULNERABLE":
      return "Exposición relevante. Requiere mitigación.";
    case "CRITICO":
      return "Riesgo alto. Acción inmediata sugerida.";
  }
}
