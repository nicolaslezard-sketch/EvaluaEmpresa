"use client";

import { z } from "zod";
import {
  AssessmentV2Schema,
  type EvaluationTier,
} from "@/lib/assessment/v2/schema";
import { getTextLimits } from "@/lib/assessment/v2/limits";
import type { FieldErrors } from "../ui";
import { CheckboxGroup, Field, Input, Select, TextareaField } from "../ui";

type AssessmentV2 = z.infer<typeof AssessmentV2Schema>;

export default function Step5Estrategia({
  tier,
  data,
  update,
  errors,
}: {
  tier: EvaluationTier;
  data: AssessmentV2;
  update: (path: [keyof AssessmentV2, string], value: unknown) => void;
  errors: FieldErrors;
}) {
  const limits = getTextLimits(tier);

  return (
    <div className="space-y-6">
      <TextareaField
        fieldKey="estrategia.objetivo12m"
        label="Objetivo 12 meses"
        hint="Concreto, medible y realista."
        value={data.estrategia.objetivo12m}
        onChange={(v) => update(["estrategia", "objetivo12m"], v)}
        min={limits.estrategia.objetivo12m.min}
        max={limits.estrategia.objetivo12m.max}
        errors={errors}
      />

      <TextareaField
        fieldKey="estrategia.planAccion"
        label="Plan de acción"
        hint="Pasos, responsables, plazos, recursos."
        value={data.estrategia.planAccion}
        onChange={(v) => update(["estrategia", "planAccion"], v)}
        min={limits.estrategia.planAccion.min}
        max={limits.estrategia.planAccion.max}
        errors={errors}
      />

      <Field
        fieldKey="estrategia.presupuestoCrecimientoMensual"
        label="Presupuesto mensual para crecimiento"
        errors={errors}
      >
        <Input
          type="number"
          value={data.estrategia.presupuestoCrecimientoMensual}
          invalid={!!errors["estrategia.presupuestoCrecimientoMensual"]}
          onChange={(e) =>
            update(
              ["estrategia", "presupuestoCrecimientoMensual"],
              Number(e.target.value),
            )
          }
        />
      </Field>

      <TextareaField
        fieldKey="estrategia.inversiones6m"
        label="Inversiones próximas (6 meses)"
        hint="Capex, tecnología, personal, marketing, expansión. Monto aproximado y timing."
        value={data.estrategia.inversiones6m}
        onChange={(v) => update(["estrategia", "inversiones6m"], v)}
        min={limits.estrategia.inversiones6m.min}
        max={limits.estrategia.inversiones6m.max}
        errors={errors}
      />

      <TextareaField
        fieldKey="estrategia.riesgosDueno"
        label="Riesgos clave (visión del dueño)"
        hint="Riesgos que más te preocupan y por qué."
        value={data.estrategia.riesgosDueno}
        onChange={(v) => update(["estrategia", "riesgosDueno"], v)}
        min={limits.estrategia.riesgosDueno.min}
        max={limits.estrategia.riesgosDueno.max}
        errors={errors}
      />

      <TextareaField
        fieldKey="estrategia.mitigaciones"
        label="Mitigaciones"
        hint="Acciones concretas para reducir los riesgos anteriores."
        value={data.estrategia.mitigaciones}
        onChange={(v) => update(["estrategia", "mitigaciones"], v)}
        min={limits.estrategia.mitigaciones.min}
        max={limits.estrategia.mitigaciones.max}
        errors={errors}
      />

      <CheckboxGroup
        fieldKey="estrategia.kpis"
        label="KPIs (1 o más)"
        hint="Indicadores que seguís de forma recurrente."
        value={data.estrategia.kpis}
        options={[
          { value: "VENTAS", label: "Ventas" },
          { value: "MARGEN", label: "Margen" },
          { value: "CAJA", label: "Caja" },
          { value: "CAC", label: "CAC" },
          { value: "CHURN", label: "Churn" },
          { value: "NPS", label: "NPS" },
          { value: "RECLAMOS", label: "Reclamos" },
          { value: "ROTACION", label: "Rotación" },
          { value: "OTRO", label: "Otro" },
        ]}
        onChange={(v) => update(["estrategia", "kpis"], v)}
        errors={errors}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          fieldKey="estrategia.frecuenciaSeguimiento"
          label="Frecuencia de seguimiento"
          errors={errors}
        >
          <Select
            value={data.estrategia.frecuenciaSeguimiento}
            invalid={!!errors["estrategia.frecuenciaSeguimiento"]}
            onChange={(e) =>
              update(["estrategia", "frecuenciaSeguimiento"], e.target.value)
            }
          >
            <option value="SEMANAL">Semanal</option>
            <option value="MENSUAL">Mensual</option>
            <option value="TRIMESTRAL">Trimestral</option>
            <option value="NUNCA">Nunca</option>
          </Select>
        </Field>

        <Field
          fieldKey="estrategia.disponibilidadInfo"
          label="Disponibilidad de información"
          errors={errors}
        >
          <Select
            value={data.estrategia.disponibilidadInfo}
            invalid={!!errors["estrategia.disponibilidadInfo"]}
            onChange={(e) =>
              update(["estrategia", "disponibilidadInfo"], e.target.value)
            }
          >
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </Select>
        </Field>
      </div>

      <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
        <div className="text-sm font-medium text-zinc-900">Confirmaciones</div>

        <div data-field="confirmaciones.datosCorrectos">
          <label className="flex items-start gap-3 text-sm text-zinc-800">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4"
              checked={data.confirmaciones.datosCorrectos}
              onChange={(e) =>
                update(["confirmaciones", "datosCorrectos"], e.target.checked)
              }
            />
            <span>
              Confirmo que la información ingresada es correcta según mi leal
              saber y entender.
            </span>
          </label>
          {errors["confirmaciones.datosCorrectos"] ? (
            <div className="mt-1 text-xs text-red-600">
              {errors["confirmaciones.datosCorrectos"]}
            </div>
          ) : null}
        </div>

        <div data-field="confirmaciones.informeOrientativo">
          <label className="flex items-start gap-3 text-sm text-zinc-800">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4"
              checked={data.confirmaciones.informeOrientativo}
              onChange={(e) =>
                update(
                  ["confirmaciones", "informeOrientativo"],
                  e.target.checked,
                )
              }
            />
            <span>
              Entiendo que el informe es orientativo, basado en información
              declarada, y no reemplaza asesoramiento profesional.
            </span>
          </label>
          {errors["confirmaciones.informeOrientativo"] ? (
            <div className="mt-1 text-xs text-red-600">
              {errors["confirmaciones.informeOrientativo"]}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
