"use client";

type Pillars = {
  financialScore?: number | null;
  commercialScore?: number | null;
  operationalScore?: number | null;
  legalScore?: number | null;
  strategicScore?: number | null;
};

function tone(score?: number | null) {
  if (typeof score !== "number")
    return "bg-zinc-100 text-zinc-700 border-zinc-200";
  if (score >= 70) return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (score >= 50) return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-red-50 text-red-700 border-red-200";
}

function label(score?: number | null) {
  if (typeof score !== "number") return "—";
  if (score >= 70) return "Fuerte";
  if (score >= 50) return "Atención";
  return "Crítico";
}

function PillarCard({ name, score }: { name: string; score?: number | null }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-900">{name}</p>
          <p className="mt-1 text-xs text-zinc-500">Score por pilar</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tone(score)}`}
        >
          {label(score)}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div className="text-2xl font-semibold text-zinc-900">
          {typeof score === "number" ? score.toFixed(1) : "—"}
        </div>
        <div className="text-sm text-zinc-500">/ 100</div>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-2 bg-zinc-900"
          style={{
            width: `${Math.max(
              0,
              Math.min(100, typeof score === "number" ? score : 0),
            )}%`,
          }}
        />
      </div>
    </div>
  );
}

export function PillarSemaphores(p: Pillars) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Pilares
        </h2>
        <p className="text-xs text-zinc-500">Semáforo rápido</p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <PillarCard name="Financiero" score={p.financialScore} />
        <PillarCard name="Comercial" score={p.commercialScore} />
        <PillarCard name="Operativo" score={p.operationalScore} />
        <PillarCard name="Legal" score={p.legalScore} />
        <PillarCard name="Estratégico" score={p.strategicScore} />
      </div>
    </div>
  );
}
