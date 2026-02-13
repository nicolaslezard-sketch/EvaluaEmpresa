"use client";

import Link from "next/link";

type ReportRow = {
  id: string;
  createdAt: string;
  title: string | null;
  overallScore: number | null;
  riskLevel: string | null;
  status: string;
};

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING_PAYMENT: "Pendiente",
    PAID: "Pago recibido",
    GENERATING: "Generando",
    DELIVERED: "Entregado",
    FAILED: "Falló",
  };

  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-700">
      {map[status] ?? status}
    </span>
  );
}

export function HistoryCompact({ reports }: { reports: ReportRow[] }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-900">Historial</p>
        <p className="text-xs text-zinc-500">
          Últimas {Math.min(6, reports.length)}
        </p>
      </div>

      {reports.length === 0 ? (
        <p className="mt-3 text-sm text-zinc-600">
          Todavía no generaste evaluaciones.
        </p>
      ) : (
        <div className="mt-3 divide-y divide-zinc-100">
          {reports.slice(0, 6).map((r) => (
            <Link
              key={r.id}
              href={`/app/analysis/${r.id}`}
              className="flex items-center justify-between gap-4 py-3 hover:opacity-90"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900">
                  {r.title || "Evaluación"}
                  <span className="text-zinc-400">&nbsp;•&nbsp;</span>
                  <span className="font-normal text-zinc-600">
                    #{r.id.slice(0, 6)}
                  </span>
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-zinc-500">E-Score</p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {typeof r.overallScore === "number"
                      ? r.overallScore.toFixed(1)
                      : "—"}
                  </p>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-xs text-zinc-500">Riesgo</p>
                  <p className="text-sm font-medium text-zinc-800">
                    {r.riskLevel ?? "—"}
                  </p>
                </div>
                <StatusPill status={r.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
