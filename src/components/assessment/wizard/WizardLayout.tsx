"use client";

import * as React from "react";
import type { FieldErrors } from "./ui";
import { cn, Pill } from "./ui";

export default function WizardLayout({
  steps,
  step,
  title,
  subtitle,
  children,
  submitting,
  canBack,
  onBack,
  onNext,
  nextLabel = "Continuar",
  backLabel = "Volver",
  errors,
}: {
  steps: Array<{ n: number; title: string }>;
  step: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  submitting?: boolean;
  canBack?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  errors?: FieldErrors;
}) {
  const errorCount = errors ? Object.keys(errors).length : 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Pill>Paso {step} de 5</Pill>
          <Pill>Evaluación v2</Pill>
          {errorCount > 0 ? (
            <Pill>
              <span className="text-red-600">{errorCount} errores</span>
            </Pill>
          ) : null}
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
          {title}
        </h1>
        {subtitle ? <p className="text-sm text-zinc-700">{subtitle}</p> : null}

        <div className="mt-4 grid gap-2 md:grid-cols-5">
          {steps.map((s) => (
            <div
              key={s.n}
              className={cn(
                "rounded-xl border px-3 py-2 text-xs",
                s.n === step
                  ? "border-zinc-400 bg-white text-zinc-950"
                  : "border-zinc-200 bg-zinc-50 text-zinc-700",
              )}
            >
              <div className="font-medium">{s.title}</div>
            </div>
          ))}
        </div>

        {errorCount > 0 ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="text-sm font-medium text-red-700">
              Revisá estos campos antes de continuar:
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
              {Object.entries(errors!)
                .slice(0, 8)
                .map(([k, msg]) => (
                  <li key={k}>
                    <button
                      type="button"
                      className="underline decoration-red-300 underline-offset-2"
                      onClick={() => {
                        const el = document.querySelector(
                          `[data-field="${k}"]`,
                        );
                        if (el)
                          (el as HTMLElement).scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                      }}
                    >
                      {msg}
                    </button>
                  </li>
                ))}
            </ul>
            {Object.keys(errors!).length > 8 ? (
              <div className="mt-2 text-xs text-red-700">
                (Mostrando los primeros 8)
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
        {children}

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={!canBack || submitting}
            className={cn(
              "rounded-xl border px-4 py-2 text-sm font-medium",
              !canBack || submitting
                ? "border-zinc-200 bg-zinc-100 text-zinc-500"
                : "border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
            )}
          >
            {backLabel}
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={submitting}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold text-white",
              submitting ? "bg-zinc-400" : "bg-zinc-900 hover:bg-zinc-800",
            )}
          >
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
