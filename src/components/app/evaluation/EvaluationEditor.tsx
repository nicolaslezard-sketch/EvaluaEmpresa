"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  EvaluationFormData,
  FieldAssessment,
} from "@/lib/types/evaluationForm";
/* ===============================
   Helpers
=================================*/

function isFiniteNum(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function getAssessmentValue(
  field: FieldAssessment | undefined,
): number | undefined {
  return field?.value;
}

const FINANCIAL_FIELDS = [
  "liquidity",
  "debtLevel",
  "revenueStability",
  "externalDependency",
] as const;

const COMMERCIAL_FIELDS = [
  "clientConcentration",
  "competitivePosition",
  "sectorDependency",
  "contractGeneration",
] as const;

const OPERATIONAL_FIELDS = [
  "keyPersonDependency",
  "structureFormalization",
  "operationalRisk",
  "adaptability",
] as const;

const LEGAL_FIELDS = [
  "compliance",
  "litigation",
  "contractFormalization",
  "regulatoryRisk",
] as const;

const STRATEGIC_FIELDS = [
  "strategicClarity",
  "macroDependency",
  "innovationLevel",
  "resilience",
] as const;

function sectionStatusByKeys<
  T extends Record<string, FieldAssessment | undefined>,
>(obj: T | undefined, requiredKeys: readonly string[]) {
  if (!obj) return "empty" as const;

  const filled = requiredKeys.filter((key) =>
    isFiniteNum(getAssessmentValue(obj[key])),
  ).length;

  if (filled === 0) return "empty" as const;
  if (filled < requiredKeys.length) return "partial" as const;
  return "complete" as const;
}

function allComplete(fd: EvaluationFormData) {
  return (
    sectionStatusByKeys(fd.financial, FINANCIAL_FIELDS) === "complete" &&
    sectionStatusByKeys(fd.commercial, COMMERCIAL_FIELDS) === "complete" &&
    sectionStatusByKeys(fd.operational, OPERATIONAL_FIELDS) === "complete" &&
    sectionStatusByKeys(fd.legal, LEGAL_FIELDS) === "complete" &&
    sectionStatusByKeys(fd.strategic, STRATEGIC_FIELDS) === "complete"
  );
}

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
  if (delta === null) return "text-zinc-600";
  if (delta > 0) return "text-emerald-600";
  if (delta < 0) return "text-red-600";
  return "text-zinc-600";
}

type EvaluationAccessResponse = {
  hasAccess: boolean;
  canViewFullReport: boolean;
  canDownloadPdf: boolean;
  reason: "subscription" | "one_time" | "pending" | "none";
};

type ReportData = {
  executiveSummary: string;
  keyFindings: string[];
  priorityRisks: string[];
  recommendations: string[];
  nextReviewSuggestedDays: number | null;
};

/* ===============================
   Component
=================================*/

export default function EvaluationEditor(props: {
  companyId: string;
  evaluationId: string;
  companyName: string;
  companyCriticality: string;
  status: "DRAFT" | "FINALIZED" | "EXPIRED";
  formData: EvaluationFormData;
  overallScore: number | null;
  executiveCategory: string | null;
  deltas: {
    overall: number | null;
    financial: number | null;
    commercial: number | null;
    operational: number | null;
    legal: number | null;
    strategic: number | null;
  };
  reportData?: ReportData | null;
}) {
  const router = useRouter();

  const [data, setData] = useState<EvaluationFormData>(() => ({
    financial: props.formData.financial ?? {},
    commercial: props.formData.commercial ?? {},
    operational: props.formData.operational ?? {},
    legal: props.formData.legal ?? {},
    strategic: props.formData.strategic ?? {},
    context: props.formData.context ?? {},
  }));

  const [isSaving, setIsSaving] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [access, setAccess] = useState<EvaluationAccessResponse | null>(null);

  const financialStatus = useMemo(
    () => sectionStatusByKeys(data.financial, FINANCIAL_FIELDS),
    [data.financial],
  );
  const commercialStatus = useMemo(
    () => sectionStatusByKeys(data.commercial, COMMERCIAL_FIELDS),
    [data.commercial],
  );
  const operationalStatus = useMemo(
    () => sectionStatusByKeys(data.operational, OPERATIONAL_FIELDS),
    [data.operational],
  );
  const legalStatus = useMemo(
    () => sectionStatusByKeys(data.legal, LEGAL_FIELDS),
    [data.legal],
  );
  const strategicStatus = useMemo(
    () => sectionStatusByKeys(data.strategic, STRATEGIC_FIELDS),
    [data.strategic],
  );

  const canFinalize = useMemo(() => allComplete(data), [data]);

  const sectionStatuses = [
    financialStatus,
    commercialStatus,
    operationalStatus,
    legalStatus,
    strategicStatus,
  ];

  const completedCount = sectionStatuses.filter((s) => s === "complete").length;
  const progressPct = (completedCount / 5) * 100;

  const dirtyRef = useRef(false);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);
  const generateButtonRef = useRef<HTMLButtonElement | null>(null);

  /* ===============================
     Load access for FINALIZED
  =================================*/

  useEffect(() => {
    if (props.status === "DRAFT") return;

    let cancelled = false;

    async function loadAccess() {
      const res = await fetch(
        `/api/companies/${props.companyId}/evaluations/${props.evaluationId}/access`,
        {
          cache: "no-store",
        },
      );

      if (!res.ok) return;

      const json = (await res.json()) as EvaluationAccessResponse;
      if (!cancelled) setAccess(json);
    }

    loadAccess();

    return () => {
      cancelled = true;
    };
  }, [props.companyId, props.evaluationId, props.status]);

  /* ===============================
     Autosave
  =================================*/

  useEffect(() => {
    if (props.status !== "DRAFT") return;

    if (!dirtyRef.current) {
      dirtyRef.current = true;
      return;
    }

    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(async () => {
      try {
        setIsSaving(true);

        await fetch(`/api/evaluations/${props.evaluationId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
          body: JSON.stringify(data),
        });
      } finally {
        setIsSaving(false);
      }
    }, 800);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, props.evaluationId, props.status]);

  async function finalize() {
    try {
      setFinalizing(true);

      const res = await fetch(
        `/api/evaluations/${props.evaluationId}/finalize`,
        {
          method: "POST",
          cache: "no-store",
        },
      );

      if (!res.ok) {
        alert(
          "No se pudo finalizar. Revisá que estén completos los 5 pilares.",
        );
        return;
      }

      router.refresh();
    } finally {
      setFinalizing(false);
    }
  }

  async function discardDraft() {
    const confirmed = window.confirm(
      "¿Seguro que quieres descartar este borrador? Se perderán los cambios no finalizados.",
    );

    if (!confirmed) return;

    try {
      setDiscarding(true);

      const res = await fetch(`/api/evaluations/${props.evaluationId}`, {
        method: "DELETE",
        cache: "no-store",
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        alert(json?.error || "No se pudo descartar el borrador.");
        return;
      }

      window.location.href = `/companies/${props.companyId}`;
    } finally {
      setDiscarding(false);
    }
  }

  async function startOneTimeCheckout() {
    try {
      setCheckoutLoading(true);

      const res = await fetch(
        `/api/companies/${props.companyId}/evaluations/${props.evaluationId}/checkout`,
        {
          method: "POST",
          cache: "no-store",
        },
      );

      const json = await res.json();

      if (!res.ok) {
        alert(json?.error || "No se pudo iniciar el checkout.");
        return;
      }

      if (json?.url) {
        window.location.href = json.url;
      }
    } finally {
      setCheckoutLoading(false);
    }
  }

  function scrollToGenerateButton() {
    generateButtonRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    generateButtonRef.current?.focus();
  }

  /* ===============================
     FINALIZED VIEW
  =================================*/

  if (props.status !== "DRAFT") {
    const accessLoading = access === null;
    const canViewFullReport = access?.canViewFullReport ?? false;
    const canDownloadPdf = access?.canDownloadPdf ?? false;
    const isPending = access?.reason === "pending";

    return (
      <div className="mx-auto max-w-5xl space-y-8 py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Evaluación — {props.companyName}
            </h1>
            <div className="mt-1 text-sm text-zinc-600">
              Criticidad de la relación:{" "}
              <span className="font-medium text-zinc-800">
                {props.companyCriticality}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${categoryStyles(
                props.executiveCategory,
              )}`}
            >
              {props.executiveCategory ?? "Sin categoría"}
            </span>

            <a
              href={`/companies/${props.companyId}`}
              className="inline-flex items-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
            >
              Volver a empresa
            </a>

            <a
              href={`/companies/${props.companyId}/evaluations/new`}
              className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Nueva evaluación
            </a>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="text-sm text-zinc-700">Score general</div>
              <div className="mt-2 text-5xl font-semibold text-zinc-900">
                {props.overallScore?.toFixed(1) ?? "—"}
              </div>
              <div
                className={`mt-3 text-sm font-medium ${deltaStyles(
                  props.deltas.overall,
                )}`}
              >
                {props.deltas.overall !== null
                  ? `Δ ${props.deltas.overall.toFixed(1)}`
                  : "Sin variación disponible"}
              </div>
            </div>

            <MetricCard
              title="Financiero"
              value={props.deltas.financial}
              prefix="Δ "
            />
            <MetricCard
              title="Comercial"
              value={props.deltas.commercial}
              prefix="Δ "
            />
            <MetricCard
              title="Operativo"
              value={props.deltas.operational}
              prefix="Δ "
            />
            <MetricCard title="Legal" value={props.deltas.legal} prefix="Δ " />
            <MetricCard
              title="Estratégico"
              value={props.deltas.strategic}
              prefix="Δ "
            />
          </div>

          <div className="mt-6 h-2 w-full rounded-full bg-zinc-100">
            <div
              className="h-2 rounded-full bg-zinc-900 transition-all"
              style={{
                width: `${
                  props.overallScore !== null
                    ? Math.min(Math.max(props.overallScore, 0), 100)
                    : 0
                }%`,
              }}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {accessLoading ? (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600">
                Verificando acceso...
              </div>
            ) : canDownloadPdf ? (
              <a
                className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                href={`/api/companies/${props.companyId}/evaluations/${props.evaluationId}/pdf`}
              >
                Descargar PDF
              </a>
            ) : isPending ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
                Pago registrado. El acceso puede demorar unos instantes.
              </div>
            ) : (
              <button
                onClick={startOneTimeCheckout}
                disabled={checkoutLoading}
                className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkoutLoading
                  ? "Iniciando checkout..."
                  : "Desbloquear evaluación completa"}
              </button>
            )}
          </div>
        </div>

        {accessLoading ? (
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <h2 className="text-lg font-medium text-zinc-900">
              Cargando acceso a la evaluación
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Estamos verificando si esta evaluación tiene acceso completo.
            </p>
          </div>
        ) : canViewFullReport ? (
          props.reportData ? (
            <div className="grid gap-6">
              <SectionCard title="Resumen ejecutivo">
                <p className="text-sm leading-6 text-zinc-700">
                  {props.reportData.executiveSummary}
                </p>
              </SectionCard>

              <SectionCard title="Hallazgos clave">
                <BulletList items={props.reportData.keyFindings} />
              </SectionCard>

              <SectionCard title="Riesgos prioritarios">
                <BulletList items={props.reportData.priorityRisks} />
              </SectionCard>

              <SectionCard title="Recomendaciones">
                <BulletList items={props.reportData.recommendations} />
              </SectionCard>

              <SectionCard title="Próxima revisión sugerida">
                <p className="text-sm leading-6 text-zinc-700">
                  {props.reportData.nextReviewSuggestedDays !== null
                    ? `Se recomienda una nueva revisión en aproximadamente ${props.reportData.nextReviewSuggestedDays} días.`
                    : "No hay una sugerencia de revisión disponible para este ciclo."}
                </p>
              </SectionCard>
            </div>
          ) : (
            <SectionCard title="Reporte">
              <p className="text-sm text-zinc-600">
                Esta evaluación fue finalizada, pero todavía no hay datos de
                reporte disponibles.
              </p>
            </SectionCard>
          )
        ) : (
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <h2 className="text-lg font-medium text-zinc-900">
              Reporte completo bloqueado
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              Puedes ver el score general de esta evaluación, pero el resumen
              ejecutivo, los riesgos prioritarios, las recomendaciones y el PDF
              completo están disponibles con acceso por suscripción o mediante
              evaluación única.
            </p>

            {!isPending && (
              <div className="mt-5">
                <button
                  onClick={startOneTimeCheckout}
                  disabled={checkoutLoading}
                  className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {checkoutLoading
                    ? "Iniciando checkout..."
                    : "Comprar evaluación única"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  /* ===============================
     DRAFT VIEW
  =================================*/

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Nueva evaluación — {props.companyName}
          </h1>

          <div className="mt-1 text-sm text-zinc-600">
            Criticidad de la relación:{" "}
            <span className="font-medium text-zinc-800">
              {props.companyCriticality}
            </span>
          </div>

          <div className="mt-3 text-sm text-zinc-600">
            {completedCount} / 5 pilares completos
            {isSaving ? " · Guardando..." : " · Guardado automático activo"}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`/companies/${props.companyId}`}
            className="inline-flex items-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Volver a empresa
          </a>

          <button
            onClick={discardDraft}
            disabled={discarding || finalizing}
            className="inline-flex items-center rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {discarding ? "Descartando..." : "Descartar borrador"}
          </button>

          <button
            ref={generateButtonRef}
            onClick={finalize}
            disabled={!canFinalize || finalizing || discarding}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              canFinalize && !finalizing && !discarding
                ? "bg-zinc-900 text-white hover:bg-zinc-800"
                : "cursor-not-allowed bg-zinc-100 text-zinc-500"
            }`}
          >
            {finalizing ? "Generando..." : "Generar evaluación"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between text-sm text-zinc-700">
          <span>Progreso general</span>
          <span>{Math.round(progressPct)}%</span>
        </div>

        <div className="mt-3 h-2 w-full rounded-full bg-zinc-100">
          <div
            className="h-2 rounded-full bg-zinc-900 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4">
        <Card title="Financiero" status={financialStatus}>
          <PillarFields
            fields={[
              ["liquidity", "Liquidez actual"],
              ["debtLevel", "Nivel de endeudamiento"],
              ["revenueStability", "Estabilidad de ingresos"],
              ["externalDependency", "Dependencia financiera de terceros"],
            ]}
            value={data.financial ?? {}}
            onChange={(patch) =>
              setData((d) => ({
                ...d,
                financial: { ...(d.financial ?? {}), ...patch },
              }))
            }
          />
        </Card>

        <Card title="Comercial" status={commercialStatus}>
          <PillarFields
            fields={[
              ["clientConcentration", "Concentración de clientes"],
              ["competitivePosition", "Posicionamiento competitivo"],
              ["sectorDependency", "Dependencia sectorial"],
              ["contractGeneration", "Generación de nuevos contratos"],
            ]}
            value={data.commercial ?? {}}
            onChange={(patch) =>
              setData((d) => ({
                ...d,
                commercial: { ...(d.commercial ?? {}), ...patch },
              }))
            }
          />
        </Card>

        <Card title="Operativo" status={operationalStatus}>
          <PillarFields
            fields={[
              ["keyPersonDependency", "Dependencia de persona clave"],
              [
                "structureFormalization",
                "Estructura organizacional formalizada",
              ],
              ["operationalRisk", "Riesgo operativo identificado"],
              ["adaptability", "Capacidad de adaptación"],
            ]}
            value={data.operational ?? {}}
            onChange={(patch) =>
              setData((d) => ({
                ...d,
                operational: { ...(d.operational ?? {}), ...patch },
              }))
            }
          />
        </Card>

        <Card title="Legal" status={legalStatus}>
          <PillarFields
            fields={[
              ["compliance", "Cumplimiento regulatorio"],
              ["litigation", "Litigios activos"],
              ["contractFormalization", "Formalización contractual"],
              ["regulatoryRisk", "Riesgo regulatorio futuro"],
            ]}
            value={data.legal ?? {}}
            onChange={(patch) =>
              setData((d) => ({
                ...d,
                legal: { ...(d.legal ?? {}), ...patch },
              }))
            }
          />
        </Card>

        <Card title="Estratégico" status={strategicStatus}>
          <PillarFields
            fields={[
              ["strategicClarity", "Claridad estratégica"],
              ["macroDependency", "Dependencia macroeconómica"],
              ["innovationLevel", "Inversión en mejora / innovación"],
              ["resilience", "Resiliencia ante shocks"],
            ]}
            value={data.strategic ?? {}}
            onChange={(patch) =>
              setData((d) => ({
                ...d,
                strategic: { ...(d.strategic ?? {}), ...patch },
              }))
            }
          />
        </Card>
      </div>
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-medium text-zinc-900">
              ¿Terminaste de completar todos los pilares?
            </div>
            <div className="mt-1 text-sm text-zinc-600">
              Subí al encabezado para revisar y generar la evaluación final.
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToGenerateButton}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Ir a generar evaluación
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   Subcomponents
=================================*/

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-medium text-zinc-900">{title}</h2>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm text-zinc-700">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-2">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function MetricCard({
  title,
  value,
  prefix = "",
}: {
  title: string;
  value: number | null;
  prefix?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
      <div className="text-sm text-zinc-700">{title}</div>
      <div className={`mt-2 text-base font-medium ${deltaStyles(value)}`}>
        {value !== null ? `${prefix}${value.toFixed(1)}` : "—"}
      </div>
    </div>
  );
}

function Card({
  title,
  status,
  children,
}: {
  title: string;
  status: "empty" | "partial" | "complete";
  children: React.ReactNode;
}) {
  const color =
    status === "complete"
      ? "text-emerald-600"
      : status === "partial"
        ? "text-amber-600"
        : "text-zinc-600";

  const label =
    status === "complete"
      ? "Completo"
      : status === "partial"
        ? "Parcial"
        : "Incompleto";

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-medium text-zinc-900">{title}</div>
        <div className={`text-sm font-medium ${color}`}>{label}</div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function PillarFields({
  fields,
  value,
  onChange,
}: {
  fields: [string, string][];
  value: Record<string, FieldAssessment | undefined>;
  onChange: (patch: Record<string, FieldAssessment>) => void;
}) {
  const OPTIONS = [
    { label: "Robusto", value: 90 },
    { label: "Adecuado", value: 75 },
    { label: "Aceptable con observaciones", value: 60 },
    { label: "Débil", value: 40 },
    { label: "Crítico", value: 20 },
  ] as const;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {fields.map(([key, label]) => (
        <label key={key} className="space-y-1.5">
          <div className="text-sm font-medium text-zinc-700">{label}</div>
          <select
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-zinc-900"
            value={value[key]?.value ?? ""}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!Number.isFinite(v)) return;

              onChange({
                [key]: {
                  ...(value[key] ?? {}),
                  value: v as 20 | 40 | 60 | 75 | 90,
                },
              });
            }}
          >
            <option value="" disabled className="text-zinc-500">
              Seleccionar…
            </option>
            {OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      ))}
    </div>
  );
}
