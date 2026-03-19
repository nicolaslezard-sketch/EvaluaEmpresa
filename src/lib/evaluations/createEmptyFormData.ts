import type { EvaluationFormData } from "@/lib/types/evaluationForm";

export function createEmptyEvaluationFormData(): EvaluationFormData {
  return {
    financial: {
      liquidity: {},
      debtLevel: {},
      revenueStability: {},
      externalDependency: {},
    },
    commercial: {
      clientConcentration: {},
      competitivePosition: {},
      sectorDependency: {},
      contractGeneration: {},
    },
    operational: {
      keyPersonDependency: {},
      structureFormalization: {},
      operationalRisk: {},
      adaptability: {},
    },
    legal: {
      compliance: {},
      litigation: {},
      contractFormalization: {},
      regulatoryRisk: {},
    },
    strategic: {
      strategicClarity: {},
      macroDependency: {},
      innovationLevel: {},
      resilience: {},
    },
    context: {
      financialNotes: "",
      commercialNotes: "",
      operationalNotes: "",
      legalNotes: "",
      strategicNotes: "",
    },
  };
}
