import type {
  GeneratedAlert,
  AlertSeverity,
  AlertType,
  CriticalityLevel,
  PillarKey,
  ScoreResult,
} from "./types";
import type { DeltaResult } from "./types";

function sev(s: AlertSeverity): AlertSeverity {
  return s;
}

function msg(type: AlertType, text: string): string {
  // Mensaje determinístico (IA puede reescribirlo luego en report)
  return text;
}

export function generateAlerts(params: {
  companyCriticality: CriticalityLevel;
  current: ScoreResult;
  previous: ScoreResult | null;
  deltas: DeltaResult;
  // Para regla consecutive_drop necesitamos last-2:
  // se lo pasás desde service si tenés prevPrev; si no, null.
  prevPrev?: ScoreResult | null;
}): GeneratedAlert[] {
  const { companyCriticality, current, previous, deltas, prevPrev } = params;
  const out: GeneratedAlert[] = [];

  // Si no hay previous finalized, no hay reglas que dependan de delta
  const deltaOverall = deltas.overall;

  // 1) SCORE_DROP
  if (deltaOverall !== null && deltaOverall <= -8) {
    const severity = deltaOverall < -15 ? sev("CRITICAL") : sev("WARNING");
    out.push({
      type: "SCORE_DROP",
      severity,
      message: msg(
        "SCORE_DROP",
        `Caída relevante del score general (Δ ${deltaOverall}).`,
      ),
    });
  }

  // 2) VOLATILITY (|delta| >= 15)
  if (deltaOverall !== null && Math.abs(deltaOverall) >= 15) {
    out.push({
      type: "VOLATILITY",
      severity: sev("WARNING"),
      message: msg(
        "VOLATILITY",
        `Variación inusual del score general (Δ ${deltaOverall}).`,
      ),
    });
  }

  // 3) LOW_SCORE_HIGH_CRITICALITY (overall < 50 && criticality HIGH)
  if (current.overallScore < 50 && companyCriticality === "HIGH") {
    out.push({
      type: "LOW_SCORE_HIGH_CRITICALITY",
      severity: sev("CRITICAL"),
      message: msg(
        "LOW_SCORE_HIGH_CRITICALITY",
        `Score general bajo en empresa de alta criticidad (${current.overallScore}).`,
      ),
    });
  }

  // 4) PILLAR_DROP (cualquiera <= -10)
  const pillarKeys: PillarKey[] = [
    "financial",
    "commercial",
    "operational",
    "legal",
    "strategic",
  ];

  for (const p of pillarKeys) {
    const d = deltas.pillars[p];
    if (d !== null && d <= -10) {
      out.push({
        type: "PILLAR_DROP",
        severity: sev("WARNING"),
        message: msg(
          "PILLAR_DROP",
          `Deterioro relevante en pilar ${p} (Δ ${d}).`,
        ),
      });
    }
  }

  // 5) CONSECUTIVE_DROP (2 caídas consecutivas mismo pilar)
  // Necesita prevPrev para ser correcto.
  if (previous && prevPrev) {
    for (const p of pillarKeys) {
      const d1 = current.pillars[p] - previous.pillars[p];
      const d0 = previous.pillars[p] - prevPrev.pillars[p];

      if (d1 < 0 && d0 < 0) {
        const accum = d1 + d0; // negativo
        const severity = accum <= -15 ? sev("CRITICAL") : sev("WARNING");
        out.push({
          type: "CONSECUTIVE_DROP",
          severity,
          message: msg(
            "CONSECUTIVE_DROP",
            `Caídas consecutivas en pilar ${p} (acumulado Δ ${Math.round(accum * 10) / 10}).`,
          ),
        });
      }
    }
  }

  return out;
}
