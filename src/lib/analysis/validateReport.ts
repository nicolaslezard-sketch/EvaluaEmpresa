import { ReportJson } from "@/lib/types/report";
import { clampScore, normalizeRiskLevel, scoreToRiskLevel } from "./score";

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

function isStr(v: unknown): v is string {
  return typeof v === "string";
}

function isNum(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

export type NormalizedReport = {
  report: ReportJson;
  extracted: {
    overallScore: number;
    riskLevel: "BAJO" | "MEDIO" | "ALTO" | "CRITICO";
    financialScore: number;
    commercialScore: number;
    operationalScore: number;
    legalScore: number;
    strategicScore: number;
  };
};

export function validateAndNormalizeReport(raw: unknown): NormalizedReport {
  if (!isObj(raw)) throw new Error("Informe inválido (no es objeto JSON).");

  const portada = raw.portada;
  const pilares = raw.pilares;

  if (!isObj(portada)) throw new Error("Informe inválido: falta 'portada'.");
  if (!Array.isArray(pilares) || pilares.length !== 5) {
    throw new Error("Informe inválido: 'pilares' debe contener 5 items.");
  }

  const nombreEmpresa = portada.nombre_empresa;
  const fecha = portada.fecha;
  const objetivo = portada.objetivo_analisis;
  const escore = portada.e_score_general;

  if (!isStr(nombreEmpresa) || nombreEmpresa.trim().length < 2) {
    throw new Error("Informe inválido: 'portada.nombre_empresa' inválido.");
  }
  if (!isStr(fecha) || fecha.trim().length < 6) {
    throw new Error("Informe inválido: 'portada.fecha' inválido.");
  }
  if (!isStr(objetivo) || objetivo.trim().length < 6) {
    throw new Error("Informe inválido: 'portada.objetivo_analisis' inválido.");
  }
  if (!isObj(escore) || !isNum(escore.score_total)) {
    throw new Error("Informe inválido: falta 'e_score_general.score_total'.");
  }

  const grafico = raw.grafico_radar;
  if (!isObj(grafico))
    throw new Error("Informe inválido: falta 'grafico_radar'.");

  const fin = clampScore(Number(grafico.financiero));
  const com = clampScore(Number(grafico.comercial));
  const ope = clampScore(Number(grafico.operativo));
  const leg = clampScore(Number(grafico.legal_estructural));
  const est = clampScore(Number(grafico.estrategico));

  const overallScore = clampScore(Number(escore.score_total));
  const riskLevel =
    normalizeRiskLevel(String(escore.nivel_general || "")) ||
    scoreToRiskLevel(overallScore);

  // devolvemos el mismo JSON pero con scores “clamped” en radar
  const normalized = raw as unknown as ReportJson;
  normalized.portada.e_score_general.score_total = overallScore;
  normalized.grafico_radar.financiero = fin;
  normalized.grafico_radar.comercial = com;
  normalized.grafico_radar.operativo = ope;
  normalized.grafico_radar.legal_estructural = leg;
  normalized.grafico_radar.estrategico = est;

  return {
    report: normalized,
    extracted: {
      overallScore,
      riskLevel,
      financialScore: fin,
      commercialScore: com,
      operationalScore: ope,
      legalScore: leg,
      strategicScore: est,
    },
  };
}
