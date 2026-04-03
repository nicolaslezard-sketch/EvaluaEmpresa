import type {
  ActionRecommendation,
  EvaluationFieldValue,
  FieldKey,
  PillarKey,
} from "@/lib/types/evaluationForm";

export type FieldOption = {
  value: EvaluationFieldValue;
  label: string;
  criterion: string;
};

export type FieldMetadata = {
  key: FieldKey;
  pillar: PillarKey;
  label: string;
  summary: string;
  helpText: string;
  isCore: boolean;
  requiresRationaleAtOrBelow: EvaluationFieldValue;
  requiresConditionalAtOrBelow: EvaluationFieldValue;
  requiresEvidenceAtOrBelow: EvaluationFieldValue;
  requiresActionAtOrBelow: EvaluationFieldValue;
  suggestedActions: ActionRecommendation[];
  options: FieldOption[];
  conditionalIssueOptions: string[];
};

export type FieldGuidance = {
  whatToLookFor: string[];
  whatNotToUse: string[];
};

export const DEFAULT_FIELD_OPTIONS: FieldOption[] = [
  {
    value: 90,
    label: "Robusto",
    criterion: "Situación sólida y sin señales relevantes de riesgo.",
  },
  {
    value: 75,
    label: "Adecuado",
    criterion: "Situación razonable, con nivel de riesgo controlado.",
  },
  {
    value: 60,
    label: "Aceptable con observaciones",
    criterion:
      "Situación funcional, pero con aspectos que conviene seguir de cerca.",
  },
  {
    value: 40,
    label: "Débil",
    criterion:
      "Se observan debilidades relevantes que requieren contexto adicional.",
  },
  {
    value: 20,
    label: "Crítico",
    criterion:
      "Se observa una señal de riesgo material que requiere atención prioritaria.",
  },
];

export const PILLAR_ORDER: PillarKey[] = [
  "financial",
  "commercial",
  "operational",
  "legal",
  "strategic",
];

export const PILLAR_LABELS: Record<PillarKey, string> = {
  financial: "Solidez financiera",
  commercial: "Riesgo comercial y de relación",
  operational: "Continuidad operativa",
  legal: "Cumplimiento y formalidad",
  strategic: "Gobierno y seguimiento",
};

export const PILLAR_OBJECTIVES: Record<PillarKey, string> = {
  financial:
    "Evalúa la capacidad del tercero para sostener sus compromisos financieros, mantener estabilidad económica y operar sin señales relevantes de tensión.",
  commercial:
    "Evalúa la solidez de la relación comercial, la exposición por concentración y la confiabilidad general de la contraparte.",
  operational:
    "Mide la capacidad de ejecución, continuidad operativa y respuesta ante incidentes o dependencias críticas.",
  legal:
    "Evalúa nivel de formalidad, respaldo documental, cumplimiento básico y contingencias legales o regulatorias relevantes.",
  strategic:
    "Mide la calidad del seguimiento interno, la actualización de información y la capacidad de gestionar desvíos con criterio y continuidad.",
};

export const FIELD_METADATA: Record<FieldKey, FieldMetadata> = {
  liquidity: {
    key: "liquidity",
    pillar: "financial",
    label: "Liquidez actual",
    summary:
      "Capacidad del tercero para afrontar compromisos de corto plazo sin tensión evidente.",
    helpText:
      "Evaluá si el tercero muestra holgura razonable para sostener pagos y operación inmediata.",
    isCore: true,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: [
      "MONITOR",
      "REQUEST_INFO",
      "LIMIT_EXPOSURE",
      "REASSESS_EARLY",
    ],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Liquidez suficiente y sin tensión observable.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Liquidez razonable, con estabilidad.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion:
          "Liquidez ajustada o parcialmente visible, sin alarma inmediata.",
      },
      {
        value: 40,
        label: "Débil",
        criterion:
          "Señales de tensión de caja o dificultad recurrente para cubrir compromisos.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion:
          "Restricción severa de liquidez o incapacidad aparente de sostener obligaciones básicas.",
      },
    ],
    conditionalIssueOptions: [
      "Tensión transitoria",
      "Tensión estructural",
      "Atrasos en pagos",
      "Dependencia de financiamiento",
      "Falta de visibilidad",
      "Otro",
    ],
  },

  debtLevel: {
    key: "debtLevel",
    pillar: "financial",
    label: "Nivel de endeudamiento",
    summary:
      "Carga financiera y presión que la deuda ejerce sobre la sostenibilidad del tercero.",
    helpText:
      "No evalúes si tiene deuda sí o no, sino si esa deuda parece razonable o riesgosa para su escala.",
    isCore: false,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: ["MONITOR", "REQUEST_INFO", "ESCALATE", "REASSESS_EARLY"],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Endeudamiento bajo o claramente manejable.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Endeudamiento razonable y sin presión excesiva.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Deuda relevante pero todavía controlable.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Endeudamiento que limita flexibilidad o eleva riesgo.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion:
          "Presión financiera severa o apalancamiento materialmente riesgoso.",
      },
    ],
    conditionalIssueOptions: [
      "Monto elevado",
      "Costo financiero alto",
      "Vencimientos exigentes",
      "Refinanciación necesaria",
      "Mora o retrasos",
      "Otro",
    ],
  },

  revenueStability: {
    key: "revenueStability",
    pillar: "financial",
    label: "Estabilidad de ingresos",
    summary:
      "Nivel de previsibilidad y consistencia en la generación de ingresos.",
    helpText:
      "Considerá volatilidad, caídas recientes y dependencia de ciclos.",
    isCore: true,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: [
      "MONITOR",
      "REQUEST_INFO",
      "REASSESS_EARLY",
      "LIMIT_EXPOSURE",
    ],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Ingresos estables y previsibles.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Variación razonable y manejable.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Volatilidad parcial sin deterioro severo.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Alta inestabilidad o señales preocupantes.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion:
          "Deterioro claro o volatilidad incompatible con continuidad razonable.",
      },
    ],
    conditionalIssueOptions: [
      "Estacionalidad marcada",
      "Caída reciente",
      "Pérdida de negocio",
      "Mercado inestable",
      "Información insuficiente",
      "Otro",
    ],
  },

  externalDependency: {
    key: "externalDependency",
    pillar: "financial",
    label: "Dependencia financiera de terceros",
    summary:
      "Dependencia de soporte externo para sostener operación o liquidez.",
    helpText:
      "Evaluá si el tercero necesita apoyo financiero de actores externos para funcionar normalmente.",
    isCore: false,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: [
      "MONITOR",
      "REQUEST_INFO",
      "LIMIT_EXPOSURE",
      "REASSESS_EARLY",
    ],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Baja dependencia de soporte externo.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Dependencia limitada y manejable.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Dependencia moderada o puntual.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Dependencia significativa de soporte externo.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion: "Dependencia crítica e inestable de terceros.",
      },
    ],
    conditionalIssueOptions: [
      "Financista externo",
      "Grupo económico",
      "Socio aportante",
      "Cliente ancla",
      "Crédito operativo",
      "Otro",
    ],
  },

  clientConcentration: {
    key: "clientConcentration",
    pillar: "commercial",
    label: "Concentración de clientes",
    summary: "Dependencia de pocos clientes o cuentas clave.",
    helpText:
      "Evaluá si la pérdida de uno o pocos clientes podría deteriorar significativamente al tercero.",
    isCore: true,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: [
      "MONITOR",
      "REQUEST_INFO",
      "LIMIT_EXPOSURE",
      "REASSESS_EARLY",
    ],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Cartera distribuida, sin concentración material.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Concentración moderada y bajo control.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Concentración relevante, pero no crítica.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Alta dependencia de pocos clientes.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion:
          "Concentración extrema con riesgo serio ante pérdida de una cuenta.",
      },
    ],
    conditionalIssueOptions: [
      "Pocos clientes dominantes",
      "Cliente ancla",
      "Renovaciones críticas",
      "Concentración reciente",
      "Baja diversificación",
      "Otro",
    ],
  },

  competitivePosition: {
    key: "competitivePosition",
    pillar: "commercial",
    label: "Posicionamiento competitivo",
    summary:
      "Fortaleza relativa frente al mercado y capacidad de sostener su propuesta.",
    helpText:
      "Pensá si su propuesta sigue siendo defendible o si está perdiendo tracción.",
    isCore: false,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: ["MONITOR", "REQUEST_INFO", "REASSESS_EARLY"],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Posición clara y sostenible.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Posición razonable con diferenciación suficiente.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Presión competitiva visible pero manejable.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Ventaja poco clara o erosión competitiva relevante.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion: "Posición muy frágil o deteriorada.",
      },
    ],
    conditionalIssueOptions: [
      "Competencia por precio",
      "Diferenciación débil",
      "Pérdida de mercado",
      "Baja calidad percibida",
      "Servicio insuficiente",
      "Otro",
    ],
  },

  sectorDependency: {
    key: "sectorDependency",
    pillar: "commercial",
    label: "Dependencia sectorial",
    summary:
      "Exposición comercial a un sector, industria o nicho especialmente sensible.",
    helpText:
      "No evalúa si el sector es bueno o malo, sino cuánto depende el tercero de uno solo.",
    isCore: false,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: ["MONITOR", "REQUEST_INFO", "REASSESS_EARLY"],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Exposición diversificada o sector estable.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Exposición razonable y manejable.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Sensibilidad moderada.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Fuerte dependencia de un sector vulnerable.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion: "Concentración sectorial extrema con alta fragilidad.",
      },
    ],
    conditionalIssueOptions: [
      "Sector en contracción",
      "Exposición cíclica",
      "Nicho estrecho",
      "Sensibilidad regulatoria",
      "Baja diversificación",
      "Otro",
    ],
  },

  contractGeneration: {
    key: "contractGeneration",
    pillar: "commercial",
    label: "Generación de nuevos contratos",
    summary: "Capacidad de sostener pipeline y renovación de negocio.",
    helpText:
      "Evaluá si el tercero puede seguir originando contratos o depende de inercia o pocas renovaciones.",
    isCore: false,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: ["MONITOR", "REQUEST_INFO", "REASSESS_EARLY"],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Pipeline saludable y originación consistente.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Generación comercial razonable.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Originación irregular pero funcional.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Dificultad marcada para generar nuevos contratos.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion: "Pipeline muy deteriorado o casi inexistente.",
      },
    ],
    conditionalIssueOptions: [
      "Baja demanda",
      "Fallas comerciales",
      "Dependencia de renovaciones",
      "Pocos originadores",
      "Caída reciente",
      "Otro",
    ],
  },

  keyPersonDependency: {
    key: "keyPersonDependency",
    pillar: "operational",
    label: "Dependencia de persona clave",
    summary: "Concentración de conocimiento o ejecución en pocas personas.",
    helpText:
      "Evaluá si una salida o indisponibilidad puntual comprometería el funcionamiento.",
    isCore: false,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: [
      "MONITOR",
      "REQUEST_INFO",
      "LIMIT_EXPOSURE",
      "REASSESS_EARLY",
    ],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Baja dependencia de individuos críticos.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Dependencia limitada y con cobertura.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Dependencia moderada o cobertura incompleta.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Dependencia fuerte de una o pocas personas.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion:
          "Continuidad comprometida ante salida o indisponibilidad de persona clave.",
      },
    ],
    conditionalIssueOptions: [
      "Dependencia técnica",
      "Dependencia operativa",
      "Dependencia comercial",
      "Dependencia administrativa",
      "Falta de backup",
      "Otro",
    ],
  },

  structureFormalization: {
    key: "structureFormalization",
    pillar: "operational",
    label: "Estructura organizacional formalizada",
    summary:
      "Orden mínimo de roles, responsabilidades y puntos de escalamiento.",
    helpText:
      "No hace falta una corporación perfecta; sí una estructura suficiente para operar con claridad.",
    isCore: false,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: ["MONITOR", "REQUEST_INFO", "ESCALATE"],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Estructura clara y funcionamiento ordenado.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Organización razonable con vacíos menores.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Estructura parcialmente formalizada.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Informalidad relevante que afecta control o ejecución.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion: "Falta de estructura mínima o desorden severo.",
      },
    ],
    conditionalIssueOptions: [
      "Roles difusos",
      "Falta de responsables",
      "Escalamiento confuso",
      "Procesos informales",
      "Desorden operativo",
      "Otro",
    ],
  },

  operationalRisk: {
    key: "operationalRisk",
    pillar: "operational",
    label: "Riesgo operativo identificado",
    summary:
      "Exposición a fallas de proceso, ejecución, logística, tecnología o continuidad.",
    helpText:
      "Este campo debe capturar el principal riesgo operativo actual, no una percepción general vaga.",
    isCore: true,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: [
      "MONITOR",
      "REQUEST_INFO",
      "ESCALATE",
      "LIMIT_EXPOSURE",
      "REASSESS_EARLY",
    ],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Riesgo operativo bajo o bien gestionado.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Riesgo controlado dentro de parámetros razonables.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Riesgos detectados con mitigación parcial.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Riesgos relevantes sin mitigación suficiente.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion:
          "Riesgos operativos severos con probabilidad e impacto altos.",
      },
    ],
    conditionalIssueOptions: [
      "Personas",
      "Proceso",
      "Tecnología",
      "Logística",
      "Dependencia externa",
      "Continuidad",
      "Otro",
    ],
  },

  adaptability: {
    key: "adaptability",
    pillar: "operational",
    label: "Capacidad de adaptación",
    summary:
      "Capacidad del tercero para ajustarse a cambios de contexto, demanda o requerimientos.",
    helpText: "Evaluá flexibilidad real, no discurso.",
    isCore: false,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: ["MONITOR", "REQUEST_INFO", "REASSESS_EARLY"],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Responde bien y rápido a cambios relevantes.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Adaptación razonable.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Adaptación lenta o parcial.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Dificultad marcada para ajustarse.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion: "Incapacidad práctica para adaptarse.",
      },
    ],
    conditionalIssueOptions: [
      "Rigidez de procesos",
      "Falta de recursos",
      "Liderazgo débil",
      "Limitación tecnológica",
      "Cambio reciente fallido",
      "Otro",
    ],
  },

  compliance: {
    key: "compliance",
    pillar: "legal",
    label: "Cumplimiento regulatorio",
    summary:
      "Cumplimiento básico aplicable a su actividad y a la relación evaluada.",
    helpText:
      "Acá importa si cumple con lo mínimo exigible para operar razonablemente.",
    isCore: true,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: [
      "REQUEST_INFO",
      "ESCALATE",
      "LIMIT_EXPOSURE",
      "REASSESS_EARLY",
    ],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Cumplimiento claro y consistente.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Cumplimiento general correcto con observaciones menores.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Vacíos menores o documentación parcial.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Incumplimientos o vacíos relevantes.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion: "Incumplimiento material o ausencia de condiciones mínimas.",
      },
    ],
    conditionalIssueOptions: [
      "Falta de licencia",
      "Certificación incompleta",
      "Documento vencido",
      "Incumplimiento detectado",
      "Información insuficiente",
      "Otro",
    ],
  },

  litigation: {
    key: "litigation",
    pillar: "legal",
    label: "Litigios activos",
    summary:
      "Exposición a litigios, reclamos o contingencias legales relevantes.",
    helpText:
      "No evalúa cualquier disputa menor, sino si existe una señal jurídicamente relevante.",
    isCore: false,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: ["MONITOR", "ESCALATE", "REASSESS_EARLY"],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Sin litigios relevantes detectados.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Antecedentes menores o aislados sin impacto material.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Asuntos que requieren seguimiento.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Litigios relevantes o recurrentes.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion: "Contingencias con impacto serio probable o actual.",
      },
    ],
    conditionalIssueOptions: [
      "Litigio aislado",
      "Litigios recurrentes",
      "Reclamo administrativo",
      "Sanción",
      "Riesgo reputacional asociado",
      "Otro",
    ],
  },

  contractFormalization: {
    key: "contractFormalization",
    pillar: "legal",
    label: "Formalización contractual",
    summary:
      "Grado de claridad y completitud contractual del vínculo o del marco relevante.",
    helpText:
      "Evaluá si hay contrato suficiente, vigente y claro para sostener la relación.",
    isCore: false,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: ["REQUEST_INFO", "ESCALATE", "LIMIT_EXPOSURE"],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Contratos claros, actualizados y consistentes.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Formalización razonable con ajustes menores pendientes.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Documentación parcial.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Vacíos contractuales relevantes.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion:
          "Ausencia de formalización mínima o riesgo alto por ambigüedad.",
      },
    ],
    conditionalIssueOptions: [
      "Falta contrato",
      "Faltan anexos",
      "Faltan cláusulas clave",
      "Documento desactualizado",
      "Ambigüedad relevante",
      "Otro",
    ],
  },

  regulatoryRisk: {
    key: "regulatoryRisk",
    pillar: "legal",
    label: "Riesgo regulatorio futuro",
    summary: "Sensibilidad del tercero a cambios regulatorios previsibles.",
    helpText: "Mide exposición futura razonable, no especulación abstracta.",
    isCore: false,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: ["MONITOR", "REQUEST_INFO", "REASSESS_EARLY"],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Baja exposición a cambios regulatorios disruptivos.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Exposición manejable.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Sensibilidad moderada.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Exposición significativa con preparación insuficiente.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion:
          "Alta probabilidad de impacto material sin preparación visible.",
      },
    ],
    conditionalIssueOptions: [
      "Cambio sectorial esperado",
      "Dependencia de licencia",
      "Exigencia regulatoria creciente",
      "Baja preparación",
      "Incertidumbre normativa",
      "Otro",
    ],
  },

  strategicClarity: {
    key: "strategicClarity",
    pillar: "strategic",
    label: "Claridad estratégica",
    summary: "Nivel de foco y dirección observable del tercero.",
    helpText:
      "No hace falta un plan corporativo perfecto, sí coherencia mínima en dirección y prioridades.",
    isCore: false,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: ["MONITOR", "REQUEST_INFO", "REASSESS_EARLY"],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Dirección clara y consistente.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Foco razonable y estable.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Dirección entendible con vacíos.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Falta de foco o señales de improvisación.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion:
          "Ausencia de dirección clara o cambios erráticos con impacto real.",
      },
    ],
    conditionalIssueOptions: [
      "Prioridades difusas",
      "Liderazgo inconsistente",
      "Cambios frecuentes de rumbo",
      "Ejecución errática",
      "Falta de visibilidad",
      "Otro",
    ],
  },

  macroDependency: {
    key: "macroDependency",
    pillar: "strategic",
    label: "Dependencia macroeconómica",
    summary:
      "Sensibilidad a shocks externos como inflación, tasas, tipo de cambio, consumo o importaciones.",
    helpText:
      "Particularmente importante en LATAM, pero no debería usarse como excusa automática para todo.",
    isCore: false,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: ["MONITOR", "REQUEST_INFO", "REASSESS_EARLY"],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Baja sensibilidad o buena capacidad de absorción.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Exposición manejable.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Sensibilidad moderada.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Alta exposición a factores macro.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion: "Dependencia extrema del entorno con fragilidad elevada.",
      },
    ],
    conditionalIssueOptions: [
      "Tipo de cambio",
      "Inflación",
      "Tasas",
      "Consumo",
      "Importaciones",
      "Regulación macro",
      "Otro",
    ],
  },

  innovationLevel: {
    key: "innovationLevel",
    pillar: "strategic",
    label: "Inversión en mejora / innovación",
    summary:
      "Capacidad de evolucionar y no quedar estático frente al mercado o al cliente.",
    helpText:
      "No hace falta I+D formal; sí evidencia de mejora continua o adaptación evolutiva.",
    isCore: false,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: ["MONITOR", "REASSESS_EARLY"],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Mejora continua o inversión sostenida en evolución.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Mejora razonable.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Mejora parcial o reactiva.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Bajo nivel de inversión o estancamiento.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion: "Ausencia de evolución con deterioro previsible.",
      },
    ],
    conditionalIssueOptions: [
      "Falta de inversión",
      "Estancamiento",
      "Atraso tecnológico",
      "Mejora reactiva",
      "Falta de capacidad",
      "Otro",
    ],
  },

  resilience: {
    key: "resilience",
    pillar: "strategic",
    label: "Resiliencia ante shocks",
    summary:
      "Capacidad general del tercero para sostenerse y recuperarse ante eventos adversos.",
    helpText:
      "Este campo resume la fortaleza de fondo ante disrupciones relevantes.",
    isCore: true,
    requiresRationaleAtOrBelow: 40,
    requiresConditionalAtOrBelow: 40,
    requiresEvidenceAtOrBelow: 40,
    requiresActionAtOrBelow: 20,
    suggestedActions: [
      "MONITOR",
      "ESCALATE",
      "LIMIT_EXPOSURE",
      "REASSESS_EARLY",
    ],
    options: [
      {
        value: 90,
        label: "Robusto",
        criterion: "Buena capacidad de absorber shocks y recuperarse.",
      },
      {
        value: 75,
        label: "Adecuado",
        criterion: "Resiliencia razonable.",
      },
      {
        value: 60,
        label: "Aceptable con observaciones",
        criterion: "Resiliencia parcial o poco demostrada.",
      },
      {
        value: 40,
        label: "Débil",
        criterion: "Fragilidad alta ante eventos adversos.",
      },
      {
        value: 20,
        label: "Crítico",
        criterion: "Muy baja capacidad de absorción o recuperación.",
      },
    ],
    conditionalIssueOptions: [
      "Fragilidad financiera",
      "Fragilidad operativa",
      "Fragilidad comercial",
      "Alta dependencia externa",
      "Historial de recuperación débil",
      "Otro",
    ],
  },
};

export const FIELD_GUIDANCE: Record<FieldKey, FieldGuidance> = {
  liquidity: {
    whatToLookFor: [
      "Atrasos recientes en pagos",
      "Tensión de caja visible",
      "Necesidad de adelantos o refinanciación",
      "Cumplimiento de obligaciones corrientes",
      "Capacidad de sostener operación inmediata",
    ],
    whatNotToUse: [
      "Tamaño aparente de la empresa",
      "Buena reputación general como único criterio",
      "Optimismo sin evidencia concreta",
    ],
  },
  debtLevel: {
    whatToLookFor: [
      "Peso de la deuda sobre la operación",
      "Vencimientos exigentes",
      "Costo financiero",
      "Necesidad de refinanciación",
      "Flexibilidad financiera remanente",
    ],
    whatNotToUse: [
      "Asumir que tener deuda siempre es malo",
      "Mirar solo el monto nominal sin contexto",
      "Comparar con empresas no equivalentes",
    ],
  },
  revenueStability: {
    whatToLookFor: [
      "Volatilidad reciente",
      "Caída de ingresos",
      "Previsibilidad",
      "Dependencia de meses o eventos puntuales",
      "Concentración temporal de facturación",
    ],
    whatNotToUse: [
      "Promesas comerciales futuras",
      "Una buena racha aislada",
      "Suponer estabilidad solo porque sigue operando",
    ],
  },
  externalDependency: {
    whatToLookFor: [
      "Necesidad de apoyo financiero externo",
      "Soporte del grupo económico",
      "Cliente ancla que sostiene caja",
      "Crédito operativo imprescindible",
      "Aportes extraordinarios recurrentes",
    ],
    whatNotToUse: [
      "Considerar malo cualquier vínculo financiero externo",
      "Asumir respaldo sin evidencia",
      "Confundir crédito normal con dependencia crítica",
    ],
  },

  clientConcentration: {
    whatToLookFor: [
      "Peso de 1 a 3 clientes principales",
      "Riesgo de pérdida de una cuenta clave",
      "Diversificación real",
      "Dependencia de renovaciones específicas",
    ],
    whatNotToUse: [
      "Cantidad de clientes sola",
      "Prestigio del cliente dominante como argumento suficiente",
      "“Siempre fue así” como justificación",
    ],
  },
  competitivePosition: {
    whatToLookFor: [
      "Diferenciación",
      "Presión por precio",
      "Pérdida de mercado",
      "Calidad percibida",
      "Solidez de la propuesta",
    ],
    whatNotToUse: [
      "Marca conocida como prueba automática de solidez",
      "Opiniones personales sobre el producto",
      "Intuición sin señal comercial concreta",
    ],
  },
  sectorDependency: {
    whatToLookFor: [
      "Exposición a una sola industria",
      "Sensibilidad del sector",
      "Concentración por nicho",
      "Falta de diversificación",
    ],
    whatNotToUse: [
      "Creer que un sector difícil es automáticamente crítico",
      "Analizar macro general sin conexión con el tercero",
    ],
  },
  contractGeneration: {
    whatToLookFor: [
      "Pipeline visible",
      "Capacidad de originación",
      "Dependencia de renovaciones",
      "Tracción comercial reciente",
      "Continuidad del flujo de negocio",
    ],
    whatNotToUse: [
      "Promesas futuras sin evidencia",
      "Actividad comercial intensa sin resultados",
      "Reputación histórica sola",
    ],
  },

  keyPersonDependency: {
    whatToLookFor: [
      "Concentración de conocimiento",
      "Ausencia de reemplazos",
      "Personas críticas en ventas, operación o técnica",
      "Continuidad ante ausencia puntual",
    ],
    whatNotToUse: [
      "Asumir que fundador involucrado es riesgo por sí solo",
      "Asumir backup sin evidencia real",
    ],
  },
  structureFormalization: {
    whatToLookFor: [
      "Roles definidos",
      "Responsables claros",
      "Escalamiento",
      "Orden mínimo de operación",
      "Procesos básicos consistentes",
    ],
    whatNotToUse: [
      "Exigir estructura corporativa grande",
      "Castigar automáticamente empresas chicas",
      "Confundir informalidad liviana con caos",
    ],
  },
  operationalRisk: {
    whatToLookFor: [
      "Fallas de proceso",
      "Incidentes operativos",
      "Dependencia tecnológica",
      "Riesgo logístico",
      "Continuidad real",
    ],
    whatNotToUse: [
      "Percepción general vaga",
      "Riesgos hipotéticos sin prioridad",
      "“Me da mala espina”",
    ],
  },
  adaptability: {
    whatToLookFor: [
      "Reacción ante cambios",
      "Velocidad de ajuste",
      "Flexibilidad operativa",
      "Respuesta a requerimientos nuevos",
      "Aprendizaje frente a errores",
    ],
    whatNotToUse: [
      "Discurso de innovación",
      "Voluntad declarada sin ejecución",
      "Una mejora aislada como evidencia total",
    ],
  },

  compliance: {
    whatToLookFor: [
      "Documentación mínima exigible",
      "Licencias o habilitaciones",
      "Vigencia documental",
      "Cumplimiento básico aplicable",
    ],
    whatNotToUse: [
      "Exigir sobrecumplimiento enterprise",
      "Castigar documentación no relevante",
      "Asumir cumplimiento por confianza histórica",
    ],
  },
  litigation: {
    whatToLookFor: [
      "Litigios relevantes",
      "Reclamos recurrentes",
      "Sanciones",
      "Contingencias con impacto",
      "Recurrencia y gravedad",
    ],
    whatNotToUse: [
      "Tomar cualquier reclamo menor como crítico",
      "Rumores",
      "Un antecedente viejo resuelto sin impacto actual",
    ],
  },
  contractFormalization: {
    whatToLookFor: [
      "Contrato existente",
      "Vigencia",
      "Anexos",
      "Cláusulas clave",
      "Claridad del vínculo",
    ],
    whatNotToUse: [
      "“Nos conocemos hace años” como reemplazo contractual",
      "Relación histórica sin formalización",
      "Mails sueltos como contrato suficiente",
    ],
  },
  regulatoryRisk: {
    whatToLookFor: [
      "Cambios regulatorios previsibles",
      "Dependencia de licencias",
      "Preparación visible",
      "Exposición a exigencias crecientes",
    ],
    whatNotToUse: [
      "Especulación abstracta",
      "Miedo general al contexto",
      "Noticias del sector sin impacto probable",
    ],
  },

  strategicClarity: {
    whatToLookFor: [
      "Foco",
      "Prioridades",
      "Coherencia del rumbo",
      "Consistencia entre discurso y ejecución",
      "Cambios de dirección",
    ],
    whatNotToUse: [
      "Pedir plan estratégico formal enterprise",
      "Premiar discurso prolijo sin evidencia",
      "Confundir ambición con claridad",
    ],
  },
  macroDependency: {
    whatToLookFor: [
      "Sensibilidad a inflación, tasas, tipo de cambio o consumo",
      "Capacidad de absorción",
      "Exposición real al entorno",
    ],
    whatNotToUse: [
      "“Argentina está difícil” como excusa genérica",
      "Contexto macro general sin vínculo directo",
    ],
  },
  innovationLevel: {
    whatToLookFor: [
      "Mejora continua",
      "Actualización de procesos",
      "Adaptación evolutiva",
      "Inversión en capacidades",
      "Prevención del estancamiento",
    ],
    whatNotToUse: [
      "Exigir I+D formal",
      "Pensar que una herramienta nueva es innovación real",
      "Valorar discurso innovador sin evidencia",
    ],
  },
  resilience: {
    whatToLookFor: [
      "Capacidad de sostenerse ante eventos adversos",
      "Velocidad de recuperación",
      "Tolerancia a desvíos",
      "Fortaleza general de fondo",
    ],
    whatNotToUse: [
      "Optimismo del evaluador",
      "Mezclar reputación con resiliencia",
      "Extrapolar un solo evento aislado",
    ],
  },
};

export const FIELDS_BY_PILLAR: Record<PillarKey, FieldKey[]> = {
  financial: [
    "liquidity",
    "debtLevel",
    "revenueStability",
    "externalDependency",
  ],
  commercial: [
    "clientConcentration",
    "competitivePosition",
    "sectorDependency",
    "contractGeneration",
  ],
  operational: [
    "keyPersonDependency",
    "structureFormalization",
    "operationalRisk",
    "adaptability",
  ],
  legal: [
    "compliance",
    "litigation",
    "contractFormalization",
    "regulatoryRisk",
  ],
  strategic: [
    "strategicClarity",
    "macroDependency",
    "innovationLevel",
    "resilience",
  ],
};
