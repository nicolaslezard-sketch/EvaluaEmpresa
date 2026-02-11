"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Report = {
  id: string;
  status: string;
  createdAt: string;
  title: string | null;
  overallScore: number | null;
  riskLevel: string | null;
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING_PAYMENT: "Pendiente de pago",
    PAID: "Pago recibido",
    GENERATING: "Generando",
    DELIVERED: "Entregado",
    FAILED: "Falló",
  };

  return (
    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
      {map[status] ?? status}
    </span>
  );
}

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => {
        if (!r.ok) throw new Error("Error cargando dashboard");
        return r.json();
      })
      .then((d) => setReports(d.reports))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <div className="py-16 text-center text-zinc-500">Cargando…</div>;
  if (error)
    return <div className="py-16 text-center text-red-600">{error}</div>;

  return (
    <div>
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Evaluaciones estructuradas para proveedores estratégicos, socios e
            inversiones.
          </p>
        </div>

        <Link href="/app/new" className="btn btn-primary">
          Nueva evaluación
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {reports.length === 0 && (
          <div className="card p-6">
            <p className="text-sm text-zinc-600">
              Todavía no generaste evaluaciones.
            </p>
          </div>
        )}

        {reports.map((r) => (
          <Link
            key={r.id}
            href={`/app/analysis/${r.id}`}
            className="card block p-6 hover:border-zinc-300 transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  {r.title || "Evaluación"}{" "}
                  <span className="text-zinc-400">•</span>{" "}
                  <span className="text-zinc-600">#{r.id.slice(0, 6)}</span>
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>

              <StatusBadge status={r.status} />
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  E-Score™
                </p>
                <p className="mt-1 text-2xl font-semibold text-zinc-900">
                  {r.overallScore ? r.overallScore.toFixed(1) : "—"}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Riesgo
                </p>
                <p className="mt-1 text-sm font-medium text-zinc-800">
                  {r.riskLevel ?? "—"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
