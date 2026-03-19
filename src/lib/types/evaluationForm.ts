export type EvaluationFieldValue = 20 | 40 | 60 | 75 | 90;

export type EvidenceType =
  | "INTERNAL"
  | "DOCUMENT"
  | "PUBLIC_SOURCE"
  | "THIRD_PARTY_STATEMENT"
  | "OTHER";

export type ActionRecommendation =
  | "NONE"
  | "MONITOR"
  | "REQUEST_INFO"
  | "ESCALATE"
  | "LIMIT_EXPOSURE"
  | "REASSESS_EARLY";

export type ImpactLevel = "LOW" | "MEDIUM" | "HIGH";
export type MitigationStatus = "NONE" | "PARTIAL" | "DEFINED";

export type FieldConditionalAnswers = {
  issueNature?: string;
  impactLevel?: ImpactLevel;
  mitigationStatus?: MitigationStatus;
};

export type FieldAssessment = {
  value?: EvaluationFieldValue;
  rationale?: string;
  evidenceType?: EvidenceType;
  evidenceNote?: string;
  evidenceDate?: string;
  actionRecommendation?: ActionRecommendation;
  conditionalAnswers?: FieldConditionalAnswers;
};

export type FinancialForm = {
  liquidity?: FieldAssessment;
  debtLevel?: FieldAssessment;
  revenueStability?: FieldAssessment;
  externalDependency?: FieldAssessment;
};

export type CommercialForm = {
  clientConcentration?: FieldAssessment;
  competitivePosition?: FieldAssessment;
  sectorDependency?: FieldAssessment;
  contractGeneration?: FieldAssessment;
};

export type OperationalForm = {
  keyPersonDependency?: FieldAssessment;
  structureFormalization?: FieldAssessment;
  operationalRisk?: FieldAssessment;
  adaptability?: FieldAssessment;
};

export type LegalForm = {
  compliance?: FieldAssessment;
  litigation?: FieldAssessment;
  contractFormalization?: FieldAssessment;
  regulatoryRisk?: FieldAssessment;
};

export type StrategicForm = {
  strategicClarity?: FieldAssessment;
  macroDependency?: FieldAssessment;
  innovationLevel?: FieldAssessment;
  resilience?: FieldAssessment;
};

export type EvaluationContextNotes = {
  financialNotes?: string;
  commercialNotes?: string;
  operationalNotes?: string;
  legalNotes?: string;
  strategicNotes?: string;
};

export type EvaluationFormData = {
  financial: FinancialForm;
  commercial: CommercialForm;
  operational: OperationalForm;
  legal: LegalForm;
  strategic: StrategicForm;
  context?: EvaluationContextNotes;
};

export type PillarKey =
  | "financial"
  | "commercial"
  | "operational"
  | "legal"
  | "strategic";

export type FinancialFieldKey = keyof FinancialForm;
export type CommercialFieldKey = keyof CommercialForm;
export type OperationalFieldKey = keyof OperationalForm;
export type LegalFieldKey = keyof LegalForm;
export type StrategicFieldKey = keyof StrategicForm;

export type FieldKey =
  | FinancialFieldKey
  | CommercialFieldKey
  | OperationalFieldKey
  | LegalFieldKey
  | StrategicFieldKey;
