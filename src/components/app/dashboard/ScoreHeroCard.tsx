"use client";

import Link from "next/link";

type Props = {
  score: number;
  previousScore?: number;
  riskLevel?: string | null;
  createdAt: string;
  reportId: string;
};

function formatDelta(delta: number) {
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}`;
}

export function ScoreHeroCard({
  score,
  previousScore,
  riskLevel,
  createdAt,
  reportId,
}: Props) {
  const hasPrev = typeof previousScore === "number";
  const delta = hasPrev ? score - previousScore! : 0;

  const deltaTone =
    !hasPrev || delta === 0
      ? "text-zinc-600 bg-zinc-100 border-zinc-200"
      : delta > 0
        ? "text-emerald-700 bg-emerald-50 border-emerald-200"
        : "text-red-700 bg-red-50 border-red-200";

  return (
    <div className="card p-6 md:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            E-Score™ actual
          </p>
          <div className="mt-2 flex items-end gap-3">
            <div className="text-5xl font-semibold tracking-tight text-zinc-900">
              {score.toFixed(1)}
            </div>
            <div className="pb-2 text-sm text-zinc-500">/ 100</div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${deltaTone}`}
              title={
                hasPrev
                  ? "Comparación con evaluación anterior"
                  : "Necesitás al menos 2 evaluaciones"
              }
            >
              {hasPrev ? (
                <>
                  {formatDelta(delta)}{" "}
                  <span className="text-zinc-400">&nbsp;•&nbsp;</span>
                  vs evaluación anterior
                </>
              ) : (
                "Sin delta (primera evaluación)"
              )}
            </span>

            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
              Riesgo: {riskLevel ?? "—"}
            </span>

            <span className="text-xs text-zinc-500">
              {new Date(createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/app/new" className="btn btn-primary">
            Nueva evaluación
          </Link>
          <Link
            href={`/app/analysis/${reportId}`}
            className="btn btn-secondary"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </div>
  );
}
