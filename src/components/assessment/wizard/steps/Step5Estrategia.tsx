"use client";

import { z } from "zod";
import { AssessmentV2Schema } from "@/lib/assessment/v2/schema";
import type { FieldErrors } from "../ui";
import { Field, Select, TextareaField } from "../ui";

type AssessmentV2 = z.infer<typeof AssessmentV2Schema>;

export default function Step5Estrategia({
  data,
  update,
  errors,
}: {
  data: AssessmentV2;
  update: (path: [keyof AssessmentV2, string], value: unknown) => void;
  errors: FieldErrors;
}) {
  return (
    <div className="space-y-6">
      <TextareaField
        fieldKey="estrategia.objetivo12m"
        label="Objetivo 12 meses"
        hint="Concreto, medible y realista."
        value={data.estrategia.objetivo12m}
        onChange={(v) => update(["estrategia", "objetivo12m"], v)}
        min={180}
        max={2500}
        errors={errors}
      />

      <TextareaField
        fieldKey="estrategia.planAccion"
        label="Plan de acción"
        hint="Pasos, responsables, plazos, recursos."
        value={data.estrategia.planAccion}
        onChange={(v) => update(["estrategia", "planAccion"], v)}
        min={220}
        max={3500}
        errors={errors}
      />

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
  );
}
