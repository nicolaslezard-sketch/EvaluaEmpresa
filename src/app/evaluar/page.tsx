// src/app/evaluar/page.tsx

import NewAssessmentWizard from "@/components/app/NewAssessmentWizard";

type Tier = "PYME" | "EMPRESA";

function parseTier(param?: string): Tier {
  if (param?.toLowerCase() === "empresa") return "EMPRESA";
  return "PYME"; // default seguro
}

export default function EvaluarPage({
  searchParams,
}: {
  searchParams?: { tier?: string };
}) {
  const tier = parseTier(searchParams?.tier);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <TierHeader tier={tier} />
        <NewAssessmentWizard tier={tier} />
      </div>
    </div>
  );
}

function TierHeader({ tier }: { tier: Tier }) {
  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {tier === "EMPRESA" ? "Evaluación Empresa" : "Evaluación PYME"}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {tier === "EMPRESA"
              ? "Validación estricta y profundidad ampliada del diagnóstico."
              : "Podés avanzar con menos datos. Más información mejora la precisión del análisis."}
          </p>
        </div>

        <span
          className={`rounded-full px-4 py-2 text-xs font-semibold ${
            tier === "EMPRESA"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-900 border border-slate-200"
          }`}
        >
          {tier}
        </span>
      </div>
    </div>
  );
}
