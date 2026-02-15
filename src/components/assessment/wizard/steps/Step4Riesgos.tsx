"use client";

import { z } from "zod";
import {
  AssessmentV2Schema,
  type EvaluationTier,
} from "@/lib/assessment/v2/schema";
import { getTextLimits } from "@/lib/assessment/v2/limits";
import type { FieldErrors } from "../ui";
import { CheckboxGroup, Field, Select, TextareaField } from "../ui";

type AssessmentV2 = z.infer<typeof AssessmentV2Schema>;

export default function Step4Riesgos({
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
      <div className="grid gap-4 md:grid-cols-3">
        <Field
          fieldKey="riesgos.procesosDocumentados"
          label="Procesos documentados"
          hint="¿El negocio tiene procesos escritos y replicables?"
          errors={errors}
        >
          <Select
            value={data.riesgos.procesosDocumentados}
            invalid={!!errors["riesgos.procesosDocumentados"]}
            onChange={(e) =>
              update(["riesgos", "procesosDocumentados"], e.target.value)
            }
          >
            <option value="SI">Sí</option>
            <option value="PARCIAL">Parcial</option>
            <option value="NO">No</option>
          </Select>
        </Field>

        <Field
          fieldKey="riesgos.depProveedorCritico"
          label="Dependencia proveedor crítico"
          hint="Impacto si ese proveedor falla."
          errors={errors}
        >
          <Select
            value={data.riesgos.depProveedorCritico}
            invalid={!!errors["riesgos.depProveedorCritico"]}
            onChange={(e) =>
              update(["riesgos", "depProveedorCritico"], e.target.value)
            }
          >
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
          </Select>
        </Field>

        <Field
          fieldKey="riesgos.depEmpleadoClave"
          label="Dependencia empleado clave"
          hint="Impacto si esa persona se va o falla."
          errors={errors}
        >
          <Select
            value={data.riesgos.depEmpleadoClave}
            invalid={!!errors["riesgos.depEmpleadoClave"]}
            onChange={(e) =>
              update(["riesgos", "depEmpleadoClave"], e.target.value)
            }
          >
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
          </Select>
        </Field>
      </div>

      <CheckboxGroup
        fieldKey="riesgos.herramientasGestion"
        label="Herramientas de gestión"
        hint="Seleccioná lo que usan hoy para operar y controlar el negocio."
        value={data.riesgos.herramientasGestion}
        options={[
          { value: "ERP", label: "ERP" },
          { value: "CRM", label: "CRM" },
          { value: "SHEETS", label: "Sheets/Excel" },
          { value: "NINGUNA", label: "Ninguna" },
          { value: "OTRO", label: "Otro" },
        ]}
        onChange={(v) => update(["riesgos", "herramientasGestion"], v)}
        errors={errors}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <CheckboxGroup
          fieldKey="riesgos.incidentes12m"
          label="Incidentes últimos 12 meses"
          hint="Seleccioná incidentes relevantes (si aplica)."
          value={data.riesgos.incidentes12m}
          options={[
            { value: "CORTE_OPERATIVO", label: "Corte operativo" },
            { value: "RECLAMOS_LEGALES", label: "Reclamos legales" },
            { value: "INSPECCIONES", label: "Inspecciones" },
            { value: "MULTAS", label: "Multas" },
            { value: "SEGURIDAD", label: "Seguridad" },
            { value: "FRAUDE", label: "Fraude" },
            { value: "NINGUNO", label: "Ninguno" },
          ]}
          onChange={(v) => update(["riesgos", "incidentes12m"], v)}
          errors={errors}
        />

        <CheckboxGroup
          fieldKey="riesgos.seguros"
          label="Seguros"
          hint="Seleccioná los seguros vigentes."
          value={data.riesgos.seguros}
          options={[
            { value: "RC", label: "Responsabilidad civil" },
            { value: "ART", label: "ART" },
            { value: "CAUCION", label: "Caución" },
            { value: "INCENDIO", label: "Incendio" },
            { value: "TRANSPORTE", label: "Transporte" },
            { value: "NINGUNO", label: "Ninguno" },
          ]}
          onChange={(v) => update(["riesgos", "seguros"], v)}
          errors={errors}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          fieldKey="riesgos.contratosClientes"
          label="Contratos con clientes"
          errors={errors}
        >
          <Select
            value={data.riesgos.contratosClientes}
            invalid={!!errors["riesgos.contratosClientes"]}
            onChange={(e) =>
              update(["riesgos", "contratosClientes"], e.target.value)
            }
          >
            <option value="SIEMPRE">Siempre</option>
            <option value="A_VECES">A veces</option>
            <option value="NUNCA">Nunca</option>
          </Select>
        </Field>

        <Field
          fieldKey="riesgos.contratosProveedores"
          label="Contratos con proveedores"
          errors={errors}
        >
          <Select
            value={data.riesgos.contratosProveedores}
            invalid={!!errors["riesgos.contratosProveedores"]}
            onChange={(e) =>
              update(["riesgos", "contratosProveedores"], e.target.value)
            }
          >
            <option value="SIEMPRE">Siempre</option>
            <option value="A_VECES">A veces</option>
            <option value="NUNCA">Nunca</option>
          </Select>
        </Field>
      </div>

      <Field
        fieldKey="riesgos.cumplimientoFiscalLaboral"
        label="Cumplimiento fiscal/laboral"
        errors={errors}
      >
        <Select
          value={data.riesgos.cumplimientoFiscalLaboral}
          invalid={!!errors["riesgos.cumplimientoFiscalLaboral"]}
          onChange={(e) =>
            update(["riesgos", "cumplimientoFiscalLaboral"], e.target.value)
          }
        >
          <option value="ALTO">Alto</option>
          <option value="MEDIO">Medio</option>
          <option value="BAJO">Bajo</option>
        </Select>
      </Field>

      <TextareaField
        fieldKey="riesgos.notaCumplimiento"
        label="Nota de cumplimiento"
        hint="Describe estado fiscal/laboral, riesgos, controles, y documentación."
        value={data.riesgos.notaCumplimiento}
        onChange={(v) => update(["riesgos", "notaCumplimiento"], v)}
        min={limits.riesgos.notaCumplimiento.min}
        max={limits.riesgos.notaCumplimiento.max}
        errors={errors}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Field fieldKey="riesgos.marca" label="Marca" errors={errors}>
          <Select
            value={data.riesgos.marca}
            invalid={!!errors["riesgos.marca"]}
            onChange={(e) => update(["riesgos", "marca"], e.target.value)}
          >
            <option value="REGISTRADA">Registrada</option>
            <option value="EN_TRAMITE">En trámite</option>
            <option value="NO">No</option>
          </Select>
        </Field>

        <Field fieldKey="riesgos.litigios" label="Litigios" errors={errors}>
          <Select
            value={data.riesgos.litigios}
            invalid={!!errors["riesgos.litigios"]}
            onChange={(e) => update(["riesgos", "litigios"], e.target.value)}
          >
            <option value="NO">No</option>
            <option value="SI">Sí</option>
          </Select>
        </Field>
      </div>

      {data.riesgos.litigios === "SI" ? (
        <TextareaField
          fieldKey="riesgos.detalleLitigios"
          label="Detalle de litigios"
          hint="Tipo, monto estimado, estado, probabilidad, impacto."
          value={data.riesgos.detalleLitigios ?? ""}
          onChange={(v) => update(["riesgos", "detalleLitigios"], v)}
          min={limits.riesgos.detalleLitigios.min}
          max={limits.riesgos.detalleLitigios.max}
          errors={errors}
        />
      ) : null}

      <Field
        fieldKey="riesgos.riesgoRegulatorio"
        label="Riesgo regulatorio"
        errors={errors}
      >
        <Select
          value={data.riesgos.riesgoRegulatorio}
          invalid={!!errors["riesgos.riesgoRegulatorio"]}
          onChange={(e) =>
            update(["riesgos", "riesgoRegulatorio"], e.target.value)
          }
        >
          <option value="ALTO">Alto</option>
          <option value="MEDIO">Medio</option>
          <option value="BAJO">Bajo</option>
        </Select>
      </Field>

      <TextareaField
        fieldKey="riesgos.notaRegulatorio"
        label="Nota regulatoria"
        hint="Normativas relevantes, habilitaciones, riesgos y situación actual."
        value={data.riesgos.notaRegulatorio}
        onChange={(v) => update(["riesgos", "notaRegulatorio"], v)}
        min={limits.riesgos.notaRegulatorio.min}
        max={limits.riesgos.notaRegulatorio.max}
        errors={errors}
      />
    </div>
  );
}
