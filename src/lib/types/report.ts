export type RiskLevel = "BAJO" | "MEDIO" | "ALTO" | "CRITICO";

export type PillarName =
  | "Riesgo Financiero"
  | "Riesgo Comercial"
  | "Riesgo Operativo"
  | "Riesgo Legal Estructural"
  | "Riesgo Estratégico";

export type ReportPillar = {
  nombre: PillarName;
  score: number; // 1..5
  nivel: string; // lo dejamos flexible porque viene del modelo, pero lo normalizamos igual
  indicadores_clave: string[];
  justificacion: string;
};

export type ReportJson = {
  portada: {
    nombre_empresa: string;
    fecha: string;
    objetivo_analisis: string;
    e_score_general: {
      score_total: number; // 1..5
      nivel_general: string;
    };
  };

  resumen_ejecutivo: string;

  pilares: ReportPillar[];

  grafico_radar: {
    financiero: number;
    comercial: number;
    operativo: number;
    legal_estructural: number;
    estrategico: number;
    descripcion_visual: string;
  };

  factores_criticos: {
    factor: string;
    impacto: "Bajo" | "Medio" | "Alto";
    descripcion: string;
  }[];

  escenarios_potenciales: {
    conservador: string;
    intermedio: string;
    adverso: string;
  };

  recomendaciones_estrategicas: string[];

  conclusion_ejecutiva: string;

  alcance_y_limitaciones: string;
};
