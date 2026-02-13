const demoData = {
  companyName: "Distribuidora Andina",
  evaluatedAt: "Abril 2026",
  overallScore: 62,
  riskLevel: "MEDIUM" as const,
  deltaScore: 8,
  pillarScores: {
    financial: 48,
    commercial: 71,
    operational: 59,
    legal: 80,
    strategic: 50,
  },
  strengths: [
    "Buena posición comercial en su mercado regional.",
    "Estructura legal formalizada y actualizada.",
  ],
  weaknesses: [
    "Dependencia alta de pocos clientes.",
    "Flujo de caja ajustado en meses de baja estacional.",
  ],
  recommendations: [
    "Diversificar cartera de clientes y reducir concentración.",
    "Implementar proyección financiera trimestral y control de caja.",
    "Formalizar un ciclo anual de planificación estratégica.",
  ],
};

function badge(score: number) {
  if (score >= 75) return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (score >= 50) return "bg-amber-50 text-amber-700 border-amber-100";
  return "bg-rose-50 text-rose-700 border-rose-100";
}

function bar(score: number) {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-rose-500";
}

export default function DemoDashboard() {
  const d = demoData;

  return (
    <div className="space-y-8">
      <div className="card p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              {d.companyName}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Evaluación: {d.evaluatedAt}
            </p>
          </div>

          <span
            className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium ${badge(
              d.overallScore,
            )}`}
          >
            Riesgo {d.riskLevel}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="card p-8 md:col-span-1">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Overall Score
          </p>
          <div className="mt-3 flex items-end gap-2">
            <p className="text-5xl font-semibold tracking-tight text-zinc-900">
              {d.overallScore}
            </p>
            <p className="pb-1 text-sm text-zinc-500">/ 100</p>
          </div>

          <p className="mt-3 text-sm font-medium text-emerald-700">
            +{d.deltaScore} puntos vs evaluación anterior
          </p>

          <p className="mt-5 text-sm text-zinc-600">
            Vista ejecutiva del perfil de riesgo, comparable en el tiempo.
          </p>
        </div>

        <div className="md:col-span-2 grid gap-6 md:grid-cols-5">
          {Object.entries(d.pillarScores).map(([key, value]) => (
            <div key={key} className="card p-6">
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                {key}
              </p>
              <p className="mt-2 text-2xl font-semibold text-zinc-900">
                {value}
              </p>
              <div className="mt-4 h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className={`h-full ${bar(value)}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card p-8">
          <p className="text-sm font-semibold text-zinc-900">Fortalezas</p>
          <ul className="mt-4 space-y-3 text-sm text-zinc-600">
            {d.strengths.map((x, i) => (
              <li key={i}>• {x}</li>
            ))}
          </ul>
        </div>

        <div className="card p-8">
          <p className="text-sm font-semibold text-zinc-900">Debilidades</p>
          <ul className="mt-4 space-y-3 text-sm text-zinc-600">
            {d.weaknesses.map((x, i) => (
              <li key={i}>• {x}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card p-8">
        <p className="text-sm font-semibold text-zinc-900">
          Recomendaciones accionables
        </p>
        <ul className="mt-5 space-y-3 text-sm text-zinc-600">
          {d.recommendations.map((x, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 font-semibold text-zinc-900">✓</span>
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
