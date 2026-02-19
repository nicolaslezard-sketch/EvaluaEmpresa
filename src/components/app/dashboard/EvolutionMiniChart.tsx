"use client";

import Link from "next/link";

type Point = {
  id: string;
  createdAt: string;
  overallScore: number;
};

export function EvolutionMiniChart({
  points,
  isPro,
}: {
  points: Point[];
  isPro: boolean;
}) {
  const visiblePoints = isPro ? points : points.slice(-2);

  if (!points || points.length < 2) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-zinc-900">Evolución</p>
        <p className="mt-1 text-xs text-zinc-500">
          Generá al menos 2 evaluaciones para ver tendencia.
        </p>
      </div>
    );
  }

  const min = Math.min(...points.map((p) => p.overallScore));
  const max = Math.max(...points.map((p) => p.overallScore));
  const range = Math.max(1, max - min);

  return (
    <div className="relative rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-900">Evolución</p>
          <p className="mt-1 text-xs text-zinc-500">
            Últimas {points.length} evaluaciones
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-end gap-2">
        {visiblePoints.map((p) => {
          const norm = (p.overallScore - min) / range;
          const height = 16 + norm * 72;

          return (
            <div key={p.id} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-lg bg-zinc-900/90"
                style={{ height: `${Math.max(12, height)}px` }}
              />
              <div className="text-[11px] text-zinc-500">
                {new Date(p.createdAt).toLocaleDateString(undefined, {
                  month: "2-digit",
                  day: "2-digit",
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!isPro && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-sm font-semibold text-zinc-900">
              Evolución histórica completa disponible en Plan PRO
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              Seguimiento extendido, tendencia y análisis continuo.
            </p>
            <div className="mt-4">
              <Link
                href="/upgrade"
                className="inline-flex items-center rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800"
              >
                Ver Plan PRO
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
