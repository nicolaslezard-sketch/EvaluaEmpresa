"use client";

import * as React from "react";

export default function LockedOverlay({
  locked,
  title = "Desbloqueá el informe completo",
  bullets = [
    "Detalle por pilar (finanzas, comercial, operativo/legal, estrategia)",
    "Red flags e inconsistencias detectadas",
    "Acciones estratégicas priorizadas",
    "Descarga PDF ejecutivo",
  ],
  ctaLabel = "Comprar informe",
  onCta,
  children,
}: {
  locked: boolean;
  title?: string;
  bullets?: string[];
  ctaLabel?: string;
  onCta: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className={locked ? "blur-sm select-none pointer-events-none" : ""}>
        {children}
      </div>

      {locked ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-lg backdrop-blur">
            <div className="text-lg font-semibold text-zinc-950">{title}</div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700">
              {bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <button
              type="button"
              onClick={onCta}
              className="mt-5 w-full rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800"
            >
              {ctaLabel}
            </button>
            <div className="mt-2 text-center text-xs text-zinc-600">
              Pago único. Sin suscripción.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
