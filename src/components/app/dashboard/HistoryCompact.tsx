"use client";

import Link from "next/link";

type Report = {
  id: string;
  createdAt: string;
  title: string | null;
  overallScore: number | null;
  executiveCategory: string | null;
};

export function HistoryCompact({ reports }: { reports: Report[] }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-zinc-900">Historial</p>
        <Link
          href="/dashboard"
          className="text-sm text-zinc-600 hover:text-zinc-900"
        >
          Ver todo
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {reports.length === 0 ? (
          <p className="text-sm text-zinc-600">Todavía no hay evaluaciones.</p>
        ) : (
          reports.slice(0, 5).map((r) => (
            <Link
              key={r.id}
              href={`/app/evaluations/${r.id}/report`}
              className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-4 py-3 hover:border-zinc-300"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-zinc-900">
                  {r.title ?? "Evaluación"}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="ml-4 text-right">
                <p className="text-sm font-semibold text-zinc-900">
                  {typeof r.overallScore === "number"
                    ? r.overallScore.toFixed(1)
                    : "—"}
                </p>
                <p className="text-xs text-zinc-500">
                  {r.executiveCategory ?? "—"}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="mt-6">
        <Link href="/companies/new" className="btn btn-secondary w-full">
          Nueva evaluación
        </Link>
      </div>
    </div>
  );
}
