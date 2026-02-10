"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Report = {
  id: string;
  status: string;
  createdAt: string;
};

export default function HistoryPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => {
        if (!r.ok) throw new Error("Error cargando historial");
        return r.json();
      })
      .then((d) => setReports(d.reports))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center text-zinc-400">Cargando historial…</div>
    );
  }

  if (error) {
    return <div className="py-24 text-center text-red-400">{error}</div>;
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-20 text-white">
      <h1 className="text-3xl font-semibold">Mis informes</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Accedé a todos tus informes generados.
      </p>

      <div className="mt-8 space-y-4">
        {reports.length === 0 && (
          <p className="text-sm text-zinc-500">
            Todavía no generaste ningún informe.
          </p>
        )}

        {reports.map((r) => (
          <Link
            key={r.id}
            href={`/report/${r.id}`}
            className="
              block rounded-2xl border border-white/10 bg-black/40 p-4
              hover:border-indigo-400/40 hover:bg-black/50 transition
            "
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Informe de Riesgo Empresarial</p>
                <p className="mt-1 text-xs text-zinc-400">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>

              <span
                className={`text-xs font-medium ${
                  r.status === "DELIVERED"
                    ? "text-green-400"
                    : r.status === "GENERATING"
                      ? "text-yellow-400"
                      : r.status === "FAILED"
                        ? "text-red-400"
                        : "text-zinc-400"
                }`}
              >
                {r.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
