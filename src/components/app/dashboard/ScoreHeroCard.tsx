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
            {hasPrev ? (
              <div
                className={`rounded-full border px-3 py-1 text-xs font-medium ${deltaTone}`}
              >
                {formatDelta(delta)}
              </div>
            ) : null}
          </div>

          <p className="mt-2 text-sm text-zinc-600">
            {riskLevel ?? "—"} • {new Date(createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex gap-2">
          <Link href="/app/evaluations/new" className="btn btn-secondary">
            Nueva evaluación
          </Link>
          <Link
            href={`/app/evaluations/${reportId}/report`}
            className="btn btn-primary"
          >
            Ver informe
          </Link>
        </div>
      </div>
    </div>
  );
}
