"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ReviewTone = "ok" | "warning" | "overdue" | "none";

type DashboardCompanyCard = {
  id: string;
  name: string;
  criticality: string;
  href: string;
  evaluationHref: string | null;
  newEvaluationHref: string;
  reviewLabel: string;
  reviewClassName: string;
  reviewTone: ReviewTone;
  executiveCategory: string | null;
  overallScore: number | null;
  deltaOverall: number | null;
  updatedAtLabel: string | null;
  relevantCycleChangesCount: number;
  worsenedChangesCount: number;
  activeAlertsCount: number;
  nextReviewDateLabel: string;
  nextReviewStatusLabel: string;
  nextReviewToneClassName: string;
};

function categoryStyles(category: string | null) {
  switch (category) {
    case "SOLIDO":
      return "bg-emerald-100 text-emerald-700";
    case "ESTABLE":
      return "bg-blue-100 text-blue-700";
    case "VULNERABLE":
      return "bg-amber-100 text-amber-700";
    case "CRITICO":
      return "bg-red-100 text-red-700";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
}

function deltaStyles(delta: number | null) {
  if (delta === null || delta === 0) return "text-zinc-500";
  return delta > 0 ? "text-emerald-600" : "text-red-600";
}

type FilterKey = "all" | "worsened" | "overdue" | "alerts";

function getPrimaryAction(
  company: DashboardCompanyCard,
  activeFilter: FilterKey,
): { href: string; label: string } {
  if (company.overallScore === null) {
    return {
      href: company.newEvaluationHref,
      label: "Primera evaluación",
    };
  }

  if (activeFilter === "overdue" || company.reviewTone === "overdue") {
    return {
      href: company.newEvaluationHref,
      label: "Nueva revisión",
    };
  }

  if (activeFilter === "worsened" || company.worsenedChangesCount > 0) {
    return {
      href: company.evaluationHref ?? company.href,
      label: "Ver evaluación",
    };
  }

  if (activeFilter === "alerts" || company.activeAlertsCount > 0) {
    return {
      href: company.href,
      label: "Abrir empresa",
    };
  }

  return {
    href: company.href,
    label: "Ver empresa",
  };
}

function getSecondaryAction(
  company: DashboardCompanyCard,
  activeFilter: FilterKey,
): { href: string; label: string } | null {
  const primary = getPrimaryAction(company, activeFilter);

  const candidates = [
    company.href ? { href: company.href, label: "Ver empresa" } : null,
    company.evaluationHref
      ? { href: company.evaluationHref, label: "Última evaluación" }
      : null,
    { href: company.newEvaluationHref, label: "Nueva revisión" },
  ].filter(Boolean) as Array<{ href: string; label: string }>;

  return (
    candidates.find(
      (candidate) =>
        candidate.href !== primary.href || candidate.label !== primary.label,
    ) ?? null
  );
}

export function DashboardFilters({
  companies,
  canSeeAlerts,
}: {
  companies: DashboardCompanyCard[];
  canSeeAlerts: boolean;
}) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const counts = useMemo(
    () => ({
      all: companies.length,
      worsened: companies.filter((c) => c.worsenedChangesCount > 0).length,
      overdue: companies.filter((c) => c.reviewTone === "overdue").length,
      alerts: companies.filter((c) => c.activeAlertsCount > 0).length,
    }),
    [companies],
  );

  const filteredCompanies = useMemo(() => {
    switch (activeFilter) {
      case "worsened":
        return companies.filter((c) => c.worsenedChangesCount > 0);
      case "overdue":
        return companies.filter((c) => c.reviewTone === "overdue");
      case "alerts":
        return companies.filter((c) => c.activeAlertsCount > 0);
      case "all":
      default:
        return companies;
    }
  }, [activeFilter, companies]);

  const filters: Array<{ key: FilterKey; label: string; count: number }> = [
    { key: "all", label: "Todas", count: counts.all },
    { key: "worsened", label: "Empeoraron", count: counts.worsened },
    { key: "overdue", label: "Vencidas", count: counts.overdue },
    { key: "alerts", label: "Con alertas", count: counts.alerts },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const active = activeFilter === filter.key;

          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                active
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <span>{filter.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  active
                    ? "bg-white/15 text-white"
                    : "bg-zinc-100 text-zinc-700"
                }`}
              >
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="text-lg font-medium text-zinc-900">
            No hay empresas para este filtro
          </div>
          <div className="mt-2 text-sm text-zinc-600">
            No se encontraron empresas que coincidan con la selección actual.
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredCompanies.map((company) => {
            const primaryAction = getPrimaryAction(company, activeFilter);
            const secondaryAction = getSecondaryAction(company, activeFilter);

            return (
              <div
                key={company.id}
                className="rounded-3xl border bg-white p-10 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-zinc-900">
                      {company.name}
                    </h2>
                    <div className="mt-2 text-sm text-zinc-500">
                      Criticidad: {company.criticality}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={`rounded-full px-6 py-2 text-sm font-medium ${company.reviewClassName}`}
                    >
                      {company.reviewLabel}
                    </span>

                    {company.executiveCategory ? (
                      <span
                        className={`rounded-full px-6 py-2 text-sm font-medium ${categoryStyles(
                          company.executiveCategory,
                        )}`}
                      >
                        {company.executiveCategory}
                      </span>
                    ) : null}
                  </div>
                </div>

                {company.overallScore !== null ? (
                  <>
                    <div className="mt-10 flex items-end gap-4">
                      <div className="text-6xl font-semibold leading-none text-zinc-900">
                        {company.overallScore.toFixed(1)}
                      </div>

                      {company.deltaOverall !== null ? (
                        <div
                          className={`pb-1 text-2xl font-medium ${deltaStyles(
                            company.deltaOverall,
                          )}`}
                        >
                          Δ {company.deltaOverall > 0 ? "+" : ""}
                          {company.deltaOverall.toFixed(1)}
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-8 h-4 w-full rounded-full bg-zinc-100">
                      <div
                        className="h-4 rounded-full bg-zinc-900 transition-all"
                        style={{
                          width: `${Math.min(Math.max(company.overallScore, 0), 100)}%`,
                        }}
                      />
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2 text-sm">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-700">
                        {company.relevantCycleChangesCount} cambios relevantes
                      </span>

                      <span className="rounded-full bg-red-100 px-3 py-1 font-medium text-red-700">
                        {company.worsenedChangesCount} empeoraron
                      </span>

                      {canSeeAlerts ? (
                        <span className="rounded-full bg-amber-100 px-3 py-1 font-medium text-amber-700">
                          {company.activeAlertsCount} alerta
                          {company.activeAlertsCount === 1 ? "" : "s"}
                        </span>
                      ) : null}
                    </div>

                    <div
                      className={`mt-6 rounded-xl border px-4 py-3 ${company.nextReviewToneClassName}`}
                    >
                      <div className="text-xs uppercase tracking-wide text-zinc-600">
                        Próxima revisión sugerida
                      </div>
                      <div className="mt-1 text-base font-semibold text-zinc-900">
                        {company.nextReviewDateLabel}
                      </div>
                      <div className="mt-1 text-sm text-zinc-700">
                        {company.nextReviewStatusLabel}
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-zinc-500">
                      Última evaluación: {company.updatedAtLabel ?? "—"}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mt-10 text-lg font-medium text-zinc-900">
                      Sin evaluaciones finalizadas
                    </div>
                    <div className="mt-2 text-sm text-zinc-500">
                      Esta empresa todavía no tiene un score oficial generado.
                    </div>

                    <div
                      className={`mt-6 rounded-xl border px-4 py-3 ${company.nextReviewToneClassName}`}
                    >
                      <div className="text-xs uppercase tracking-wide text-zinc-600">
                        Próxima revisión sugerida
                      </div>
                      <div className="mt-1 text-base font-semibold text-zinc-900">
                        {company.nextReviewDateLabel}
                      </div>
                      <div className="mt-1 text-sm text-zinc-700">
                        {company.nextReviewStatusLabel}
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-10 flex flex-wrap gap-3">
                  <Link
                    href={primaryAction.href}
                    className="inline-flex rounded-2xl bg-zinc-900 px-8 py-4 text-xl font-medium text-white hover:bg-zinc-800"
                  >
                    {primaryAction.label}
                  </Link>

                  {secondaryAction ? (
                    <Link
                      href={secondaryAction.href}
                      className="inline-flex rounded-2xl border border-zinc-300 px-8 py-4 text-xl font-medium text-zinc-900 hover:bg-zinc-50"
                    >
                      {secondaryAction.label}
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
