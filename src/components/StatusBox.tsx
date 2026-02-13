"use client";

import { useEffect, useState } from "react";

type PreScore = {
  overallScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | string;
  pillarScores: {
    financial: number;
    commercial: number;
    operational: number;
    legal: number;
    strategic: number;
  };
  oneStrength: string;
  oneWeakness: string;
};

type Props = {
  status: string;
  reportId: string;
  lastError?: string | null;
  attempts: number;
  preScore?: PreScore | null;
};

function riskBadge(risk: string) {
  if (risk === "LOW")
    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (risk === "HIGH") return "bg-rose-50 text-rose-700 border-rose-100";
  return "bg-amber-50 text-amber-700 border-amber-100";
}

export default function StatusBox({
  status,
  reportId,
  lastError,
  attempts,
  preScore: preScoreFromServer,
}: Props) {
  const [preScore, setPreScore] = useState<PreScore | null>(
    preScoreFromServer ?? null,
  );
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    if (status !== "PENDING_PAYMENT") return;
    if (preScore) return;

    let mounted = true;

    const load = async () => {
      setLoadingPreview(true);
      try {
        const r = await fetch(`/api/report/${reportId}/preview`, {
          method: "POST",
        });
        const d = await r.json();
        if (mounted && d?.preScore) {
          setPreScore(d.preScore);
        }
      } finally {
        if (mounted) setLoadingPreview(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [status, reportId, preScore]);

  if (status === "PENDING_PAYMENT") {
    return (
      <div className="card p-6">
        <p className="text-sm font-medium text-zinc-900">
          Vista previa (antes de desbloquear el análisis completo)
        </p>
        <p className="mt-2 text-sm text-zinc-600">
          Te mostramos un resumen ejecutivo. Para ver el análisis completo,
          recomendaciones y PDF, necesitás completar el pago.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Score global
            </p>
            <p className="mt-2 text-3xl font-semibold text-zinc-900">
              {preScore ? preScore.overallScore : loadingPreview ? "…" : "—"}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Nivel de riesgo
            </p>
            <div className="mt-2">
              {preScore ? (
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${riskBadge(
                    preScore.riskLevel,
                  )}`}
                >
                  {preScore.riskLevel}
                </span>
              ) : loadingPreview ? (
                <span className="text-zinc-500">Cargando…</span>
              ) : (
                "—"
              )}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Incluye
            </p>
            <p className="mt-2 text-sm text-zinc-700">
              Recomendaciones + análisis por pilar + PDF premium + historial
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Fortaleza destacada
            </p>
            <p className="mt-2 text-sm text-zinc-700">
              {preScore
                ? preScore.oneStrength
                : loadingPreview
                  ? "Cargando…"
                  : "—"}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Debilidad destacada
            </p>
            <p className="mt-2 text-sm text-zinc-700">
              {preScore
                ? preScore.oneWeakness
                : loadingPreview
                  ? "Cargando…"
                  : "—"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            className="btn btn-primary"
            onClick={async () => {
              try {
                const res = await fetch("/api/mercadopago/preference", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ reportId }),
                });

                const data = await res.json();

                if (data.init_point) window.location.href = data.init_point;
                else alert("No se pudo iniciar el pago.");
              } catch (error) {
                console.error("Error iniciando pago:", error);
                alert("Error iniciando el pago.");
              }
            }}
          >
            Desbloquear análisis completo
          </button>

          <a className="btn btn-secondary" href="/demo">
            Ver demo del sistema
          </a>
        </div>
      </div>
    );
  }

  if (status === "PAID" || status === "GENERATING") {
    const messages = [
      "Analizando consistencia financiera…",
      "Evaluando exposición comercial…",
      "Revisando riesgo operativo…",
      "Sintetizando estructura legal…",
      "Construyendo score ejecutivo…",
    ];

    return (
      <div className="card p-6">
        <p className="text-sm font-medium text-zinc-900">
          Generando evaluación
        </p>
        <p className="mt-2 text-sm text-zinc-600">
          El informe se está construyendo. Podés dejar esta pantalla abierta.
        </p>

        <div className="mt-6 space-y-2">
          {messages.map((m) => (
            <div
              key={m}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
            >
              {m}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <form action={`/api/report/${reportId}/generate`} method="post">
            <button className="btn btn-secondary" type="submit">
              Reintentar generación (si queda trabado)
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (status === "FAILED") {
    return (
      <div className="card p-6">
        <p className="text-sm font-medium text-zinc-900">No se pudo generar</p>
        <p className="mt-2 text-sm text-zinc-600">
          Ocurrió un error al generar el informe.
        </p>

        {lastError && <p className="mt-3 text-xs text-zinc-500">{lastError}</p>}

        <div className="mt-6">
          {attempts < 3 ? (
            <form action={`/api/report/${reportId}/generate`} method="post">
              <button className="btn btn-primary" type="submit">
                Reintentar
              </button>
            </form>
          ) : (
            <p className="text-sm text-zinc-600">
              Se alcanzó el máximo de intentos. Contactanos para asistencia.
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
}
