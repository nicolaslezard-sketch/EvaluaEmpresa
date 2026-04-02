"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type FilterKey = "all" | "worsened" | "overdue" | "alerts";
type ReviewTone = "ok" | "soon" | "overdue" | string;
type ExecutiveCategory =
  | "SOLIDO"
  | "ESTABLE"
  | "VULNERABLE"
  | "CRITICO"
  | string
  | null;

type CriticalityLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL"
  | "BAJA"
  | "MEDIA"
  | "ALTA"
  | "CRITICA"
  | string
  | null;

type WorsenedChange = {
  fieldKey?: string;
  fieldLabel?: string;
  kind?: string;
  pillarLabel?: string;
};

export type DashboardCompanyCard = {
  id: string;
  name: string;

  // Links posibles según cómo armes dashboardCards
  href: string;
  evaluationHref?: string | null;
  newEvaluationHref?: string | null;

  // Estado general
  reviewLabel: string;
  reviewTone: ReviewTone;
  overallScore?: number | null;
  scoreDelta?: number | null;
  executiveCategory?: ExecutiveCategory;

  // Contexto
  criticality?: CriticalityLevel;
  relationshipImportanceLabel?: string | null;

  // Señales
  activeAlertsCount?: number;
  worsenedChangesCount?: number;
  worsenedChanges?: WorsenedChange[];
};

type Props = {
  companies: DashboardCompanyCard[];
  canSeeAlerts?: boolean;
};

const FILTERS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "Todas" },
  { key: "worsened", label: "Empeoraron" },
  { key: "overdue", label: "Vencidas" },
  { key: "alerts", label: "Con alertas" },
];

const emptyMessages: Record<FilterKey, { title: string; description: string }> =
  {
    all: {
      title: "No hay empresas cargadas",
      description:
        "Todavía no se encontraron empresas para mostrar en esta vista.",
    },
    worsened: {
      title: "No hay empresas que hayan empeorado",
      description:
        "No se detectaron deterioros en el último ciclo dentro de tu cartera actual.",
    },
    overdue: {
      title: "No hay empresas vencidas",
      description:
        "No hay empresas fuera de la frecuencia esperada en este momento.",
    },
    alerts: {
      title: "No hay empresas con alertas activas",
      description: "No se encontraron alertas activas en la selección actual.",
    },
  };

function categoryStyles(category: ExecutiveCategory) {
  switch (category) {
    case "SOLIDO":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "ESTABLE":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "VULNERABLE":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "CRITICO":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-700";
  }
}

function reviewStyles(tone: ReviewTone) {
  if (tone === "ok") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (tone === "soon") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (tone === "overdue") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-zinc-200 bg-zinc-50 text-zinc-700";
}

function criticalityStyles(level?: CriticalityLevel) {
  switch (level) {
    case "LOW":
    case "BAJA":
      return "border-zinc-200 bg-zinc-50 text-zinc-700";
    case "MEDIUM":
    case "MEDIA":
      return "border-sky-200 bg-sky-50 text-sky-700";
    case "HIGH":
    case "ALTA":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "CRITICAL":
    case "CRITICA":
      return "border-red-200 bg-red-50 text-red-700";
    default:
      return "border-zinc-200 bg-zinc-50 text-zinc-700";
  }
}

function criticalityLabel(level?: CriticalityLevel) {
  if (!level) return null;

  switch (level) {
    case "LOW":
      return "Baja";
    case "MEDIUM":
      return "Media";
    case "HIGH":
      return "Alta";
    case "CRITICAL":
      return "Crítica";
    default:
      return String(level);
  }
}

function deltaStyles(delta?: number | null) {
  if (delta === null || delta === undefined || delta === 0) {
    return "text-zinc-500";
  }

  if (delta > 0) {
    return "text-emerald-700";
  }

  return "text-red-700";
}

function formatDelta(delta?: number | null) {
  if (delta === null || delta === undefined) return "Sin comparación";
  if (delta === 0) return "0";
  return `${delta > 0 ? "+" : ""}${delta.toFixed(1)}`;
}

function getAttentionReason(company: DashboardCompanyCard) {
  const worsenedCount = company.worsenedChangesCount ?? 0;
  const alertsCount = company.activeAlertsCount ?? 0;
  const score = company.overallScore ?? null;

  if (score === null) {
    return "Todavía no tiene una evaluación base.";
  }

  if (company.reviewTone === "overdue") {
    return "La revisión quedó fuera de la frecuencia esperada.";
  }

  if (worsenedCount > 0) {
    return "Mostró deterioro en el último ciclo.";
  }

  if (alertsCount > 0) {
    return "Tiene alertas activas que conviene revisar.";
  }

  return "Sin señales activas relevantes en este momento.";
}

function getPrimaryAction(
  company: DashboardCompanyCard,
  activeFilter: FilterKey,
) {
  const worsenedCount = company.worsenedChangesCount ?? 0;
  const alertsCount = company.activeAlertsCount ?? 0;
  const score = company.overallScore ?? null;

  if (score === null) {
    return {
      href: company.newEvaluationHref ?? company.href,
      label: "Primera evaluación",
    };
  }

  if (company.reviewTone === "overdue") {
    return {
      href: company.newEvaluationHref ?? company.href,
      label: "Nueva revisión",
    };
  }

  if (activeFilter === "worsened" || worsenedCount > 0) {
    return {
      href: company.evaluationHref ?? company.href,
      label: "Ver evaluación",
    };
  }

  if (activeFilter === "alerts" || alertsCount > 0) {
    return {
      href: company.href,
      label: "Ver empresa",
    };
  }

  return {
    href: company.href,
    label: "Ver empresa",
  };
}

function getSecondaryAction(
  company: DashboardCompanyCard,
  primaryLabel: string,
) {
  const score = company.overallScore ?? null;

  if (score === null) {
    return null;
  }

  if (primaryLabel === "Ver empresa") {
    return company.evaluationHref
      ? {
          href: company.evaluationHref,
          label: "Ver evaluación",
        }
      : null;
  }

  return {
    href: company.href,
    label: "Ver empresa",
  };
}

function CompanyCard({
  company,
  activeFilter,
  canSeeAlerts,
}: {
  company: DashboardCompanyCard;
  activeFilter: FilterKey;
  canSeeAlerts: boolean;
}) {
  const primaryAction = getPrimaryAction(company, activeFilter);
  const secondaryAction = getSecondaryAction(company, primaryAction.label);

  const worsenedCount = company.worsenedChangesCount ?? 0;
  const alertsCount = company.activeAlertsCount ?? 0;
  const score = company.overallScore ?? null;
  const criticalityText = company.criticality
    ? criticalityLabel(company.criticality)
    : null;
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-semibold tracking-tight text-zinc-900">
              {company.name}
            </h3>

            {criticalityText ? (
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${criticalityStyles(
                  company.criticality ?? null,
                )}`}
              >
                Criticidad: {criticalityText}
              </span>
            ) : null}

            {company.relationshipImportanceLabel ? (
              <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">
                Relación estratégica: {company.relationshipImportanceLabel}
              </span>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-medium ${reviewStyles(
                company.reviewTone,
              )}`}
            >
              {company.reviewLabel}
            </span>

            {company.executiveCategory ? (
              <span
                className={`rounded-full border px-3 py-1 text-xs font-medium ${categoryStyles(
                  company.executiveCategory,
                )}`}
              >
                {company.executiveCategory}
              </span>
            ) : null}
          </div>

          <p className="mt-4 text-sm leading-6 text-zinc-600">
            {getAttentionReason(company)}
          </p>
        </div>

        <div className="grid min-w-45 gap-3 sm:grid-cols-2 md:grid-cols-1">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-xs uppercase tracking-wide text-zinc-500">
              Score actual
            </div>
            <div className="mt-2 text-2xl font-semibold text-zinc-900">
              {score !== null ? score.toFixed(1) : "—"}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-xs uppercase tracking-wide text-zinc-500">
              Variación
            </div>
            <div
              className={`mt-2 text-2xl font-semibold ${deltaStyles(
                company.scoreDelta,
              )}`}
            >
              {formatDelta(company.scoreDelta)}
            </div>
          </div>
        </div>
      </div>

      {worsenedCount > 0 ? (
        <div className="mt-5">
          <div className="mb-2 text-xs uppercase tracking-wide text-zinc-500">
            Cambios negativos
          </div>

          <div className="flex flex-wrap gap-2">
            {(company.worsenedChanges ?? [])
              .slice(0, 3)
              .map((change, index) => (
                <span
                  key={`${company.id}-${change.fieldKey ?? "field"}-${change.kind ?? index}`}
                  className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
                >
                  {change.fieldLabel ?? "Cambio detectado"}
                </span>
              ))}

            {worsenedCount > 3 ? (
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                +{worsenedCount - 3} más
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      <div
        className={`mt-5 grid gap-4 ${
          canSeeAlerts ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"
        }`}
      >
        {canSeeAlerts ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-xs uppercase tracking-wide text-zinc-500">
              Alertas activas
            </div>
            <div className="mt-2 text-xl font-semibold text-zinc-900">
              {alertsCount}
            </div>
            <div className="mt-1 text-xs text-zinc-500">
              señales persistidas del ciclo actual
            </div>
          </div>
        ) : null}

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-xs uppercase tracking-wide text-zinc-500">
            Cambios empeorados
          </div>
          <div className="mt-2 text-xl font-semibold text-zinc-900">
            {worsenedCount}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            campos que empeoraron
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-xs uppercase tracking-wide text-zinc-500">
            Estado de revisión
          </div>
          <div className="mt-2 text-sm font-semibold text-zinc-900">
            {company.reviewLabel}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            frecuencia esperada del monitoreo
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href={primaryAction.href} className="btn btn-primary">
          {primaryAction.label}
        </Link>

        {secondaryAction ? (
          <Link href={secondaryAction.href} className="btn btn-secondary">
            {secondaryAction.label}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function DashboardFilters({ companies, canSeeAlerts = true }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const counts = useMemo(
    () => ({
      all: companies.length,
      worsened: companies.filter((c) => (c.worsenedChangesCount ?? 0) > 0)
        .length,
      overdue: companies.filter((c) => c.reviewTone === "overdue").length,
      alerts: companies.filter((c) => (c.activeAlertsCount ?? 0) > 0).length,
    }),
    [companies],
  );

  const filteredCompanies = useMemo(() => {
    switch (activeFilter) {
      case "worsened":
        return companies.filter((c) => (c.worsenedChangesCount ?? 0) > 0);
      case "overdue":
        return companies.filter((c) => c.reviewTone === "overdue");
      case "alerts":
        return companies.filter((c) => (c.activeAlertsCount ?? 0) > 0);
      case "all":
      default:
        return companies;
    }
  }, [activeFilter, companies]);

  const emptyState = emptyMessages[activeFilter];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {FILTERS.filter((filter) => {
          if (filter.key === "alerts" && !canSeeAlerts) return false;
          return true;
        }).map((filter) => {
          const isActive = activeFilter === filter.key;
          const count = counts[filter.key];

          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setActiveFilter(filter.key)}
              className={
                isActive
                  ? "rounded-full border border-zinc-900 bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
                  : "rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
              }
            >
              {filter.label}{" "}
              <span className={isActive ? "text-zinc-300" : "text-zinc-500"}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      {filteredCompanies.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-900">
            {emptyState.title}
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
            {emptyState.description}
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              activeFilter={activeFilter}
              canSeeAlerts={canSeeAlerts}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardFilters;
