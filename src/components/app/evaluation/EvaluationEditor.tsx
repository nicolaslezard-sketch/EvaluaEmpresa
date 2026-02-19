"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { EvaluationFormData } from "@/lib/types/evaluationForm";

/* ===============================
   Helpers
=================================*/

function isFiniteNum(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

function sectionStatus(obj?: Record<string, number | undefined>) {
  if (!obj) return "empty";

  const values = Object.values(obj);
  if (values.length === 0) return "empty";

  const filled = values.filter(isFiniteNum).length;

  if (filled === 0) return "empty";
  if (filled < values.length) return "partial";
  return "complete";
}

function allComplete(fd: EvaluationFormData) {
  return (
    sectionStatus(fd.financial) === "complete" &&
    sectionStatus(fd.commercial) === "complete" &&
    sectionStatus(fd.operational) === "complete" &&
    sectionStatus(fd.legal) === "complete" &&
    sectionStatus(fd.strategic) === "complete"
  );
}

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

  const canFinalize = useMemo(() => allComplete(data), [data]);
  const completedCount = [
    sectionStatus(data.financial),
    sectionStatus(data.commercial),
    sectionStatus(data.operational),
    sectionStatus(data.legal),
    sectionStatus(data.strategic),
  ].filter((s) => s === "complete").length;

  const dirtyRef = useRef(false);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

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
      await fetch(`/api/evaluations/${props.evaluationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(data),
      });
    }, 800);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, props.evaluationId, props.status]);

  async function finalize() {
    const res = await fetch(`/api/evaluations/${props.evaluationId}/finalize`, {
      method: "POST",
      cache: "no-store",
    });

    if (!res.ok) {
      alert("No se pudo finalizar. Revisá que estén completos los 5 pilares.");
      return;
    }

    router.refresh();
  }

  /* ===============================
     FINALIZED VIEW
  =================================*/

  if (props.status !== "DRAFT") {
    return (
      <div className="max-w-4xl mx-auto py-10 space-y-6">
        <h1 className="text-2xl font-semibold">
          Evaluación — {props.companyName}
        </h1>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="text-sm text-zinc-500">Score general</div>
          <div className="text-5xl font-semibold text-zinc-900">
            {props.overallScore?.toFixed(1) ?? "—"}
          </div>

          <div className="mt-2 text-sm text-zinc-500">
            Categoría: {props.executiveCategory ?? "—"}
            {props.deltas.overall !== null &&
              ` · Δ ${props.deltas.overall.toFixed(1)}`}
          </div>

          <div className="mt-6">
            <a
              className="inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
              href={`/api/companies/${props.companyId}/evaluations/${props.evaluationId}/pdf`}
            >
              Descargar PDF
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ===============================
     DRAFT VIEW
  =================================*/

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Nueva evaluación — {props.companyName}
          </h1>

          <div className="mt-1 text-sm text-zinc-500">
            Criticidad:{" "}
            <span className="font-medium">{props.companyCriticality}</span>
          </div>

          <div className="mt-2 text-xs text-zinc-500">
            {completedCount} / 5 pilares completos
          </div>
        </div>

        <button
          onClick={finalize}
          disabled={!canFinalize}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            canFinalize
              ? "bg-zinc-900 text-white"
              : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
          }`}
        >
          Generar evaluación
        </button>
      </div>

      <div className="grid gap-4">
        <Card title="Financiero" status={sectionStatus(data.financial)}>
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

        <Card title="Comercial" status={sectionStatus(data.commercial)}>
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

        <Card title="Operativo" status={sectionStatus(data.operational)}>
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

        <Card title="Legal" status={sectionStatus(data.legal)}>
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

        <Card title="Estratégico" status={sectionStatus(data.strategic)}>
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
    </div>
  );
}

/* ===============================
   Subcomponents
=================================*/

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
        ? "text-amber-500"
        : "text-zinc-400";

  const label =
    status === "complete"
      ? "Completo"
      : status === "partial"
        ? "Parcial"
        : "Incompleto";

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium text-zinc-900">{title}</div>
        <div className={`text-xs ${color}`}>{label}</div>
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
  value: Record<string, number | undefined>;
  onChange: (patch: Record<string, number>) => void;
}) {
  const OPTIONS = [
    { label: "Muy favorable", value: 90 },
    { label: "Favorable", value: 75 },
    { label: "Intermedia", value: 60 },
    { label: "Débil", value: 40 },
    { label: "Crítica", value: 20 },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {fields.map(([key, label]) => (
        <label key={key} className="space-y-1">
          <div className="text-xs font-medium text-zinc-700">{label}</div>
          <select
            className="w-full rounded-lg border bg-white px-3 py-2 text-sm"
            value={value[key] ?? ""}
            onChange={(e) => {
              const v = Number(e.target.value);
              if (!Number.isFinite(v)) return;
              onChange({ [key]: v });
            }}
          >
            <option value="" disabled>
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
