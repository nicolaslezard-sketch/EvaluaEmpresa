export type ScoreOption = number;

export type FinancialForm = {
  liquidity?: ScoreOption;
  debtLevel?: ScoreOption;
  revenueStability?: ScoreOption;
  externalDependency?: ScoreOption;
};

export type CommercialForm = {
  clientConcentration?: ScoreOption;
  competitivePosition?: ScoreOption;
  sectorDependency?: ScoreOption;
  contractGeneration?: ScoreOption;
};

export type OperationalForm = {
  keyPersonDependency?: ScoreOption;
  structureFormalization?: ScoreOption;
  operationalRisk?: ScoreOption;
  adaptability?: ScoreOption;
};

export type LegalForm = {
  compliance?: ScoreOption;
  litigation?: ScoreOption;
  contractFormalization?: ScoreOption;
  regulatoryRisk?: ScoreOption;
};

export type StrategicForm = {
  strategicClarity?: ScoreOption;
  macroDependency?: ScoreOption;
  innovationLevel?: ScoreOption;
  resilience?: ScoreOption;
};

export type EvaluationContext = {
  financialNotes?: string;
  commercialNotes?: string;
  operationalNotes?: string;
  legalNotes?: string;
  strategicNotes?: string;
  generalNotes?: string;
};

export type EvaluationFormData = {
  financial?: FinancialForm;
  commercial?: CommercialForm;
  operational?: OperationalForm;
  legal?: LegalForm;
  strategic?: StrategicForm;
  context?: EvaluationContext;
};
