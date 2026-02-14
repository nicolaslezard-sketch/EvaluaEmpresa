"use client";

import { z } from "zod";
import { AssessmentV2Schema } from "@/lib/assessment/v2/schema";
import type { FieldErrors } from "../ui";
import { CheckboxGroup, Field, Input, Select, TextareaField } from "../ui";

type AssessmentV2 = z.infer<typeof AssessmentV2Schema>;
type UpdateFn = (path: [keyof AssessmentV2, string], value: unknown) => void;

type Canal = AssessmentV2["comercial"]["canalesTop3"][number];

export default function Step3Comercial({
  data,
  update,
  errors,
}: {
  data: AssessmentV2;
  update: UpdateFn;
  errors: FieldErrors;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          fieldKey="comercial.tipoNegocio"
          label="Tipo de negocio"
          errors={errors}
        >
          <Select
            value={data.comercial.tipoNegocio}
            invalid={!!errors["comercial.tipoNegocio"]}
            onChange={(e) =>
              update(["comercial", "tipoNegocio"], e.target.value)
            }
          >
            <option value="B2B">B2B</option>
            <option value="B2C">B2C</option>
            <option value="MIXTO">Mixto</option>
          </Select>
        </Field>

        <Field
          fieldKey="comercial.modeloIngresos"
          label="Modelo de ingresos"
          errors={errors}
        >
          <Select
            value={data.comercial.modeloIngresos}
            invalid={!!errors["comercial.modeloIngresos"]}
            onChange={(e) =>
              update(["comercial", "modeloIngresos"], e.target.value)
            }
          >
            <option value="SUSCRIPCION">Suscripción</option>
            <option value="PROYECTO">Proyecto</option>
            <option value="COMISION">Comisión</option>
            <option value="RETAIL">Retail</option>
            <option value="LICENCIAS">Licencias</option>
            <option value="OTRO">Otro</option>
          </Select>
        </Field>
      </div>

      <TextareaField
        fieldKey="comercial.ofertaPrincipal"
        label="Oferta principal"
        hint="Qué vendés (productos/servicios), para quién y con qué resultados."
        value={data.comercial.ofertaPrincipal}
        onChange={(v) => update(["comercial", "ofertaPrincipal"], v)}
        min={200}
        max={4000}
        errors={errors}
      />

      <TextareaField
        fieldKey="comercial.propuestaValor"
        label="Propuesta de valor"
        hint="Por qué te eligen a vos y no a otro. Diferencial real."
        value={data.comercial.propuestaValor}
        onChange={(v) => update(["comercial", "propuestaValor"], v)}
        min={160}
        max={2000}
        errors={errors}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Field
          fieldKey="comercial.ticketPromedio"
          label="Ticket promedio"
          errors={errors}
        >
          <Input
            type="number"
            value={data.comercial.ticketPromedio}
            invalid={!!errors["comercial.ticketPromedio"]}
            onChange={(e) =>
              update(["comercial", "ticketPromedio"], Number(e.target.value))
            }
          />
        </Field>

        <Field
          fieldKey="comercial.frecuenciaCompra"
          label="Frecuencia de compra"
          errors={errors}
        >
          <Select
            value={data.comercial.frecuenciaCompra}
            invalid={!!errors["comercial.frecuenciaCompra"]}
            onChange={(e) =>
              update(["comercial", "frecuenciaCompra"], e.target.value)
            }
          >
            <option value="SEMANAL">Semanal</option>
            <option value="MENSUAL">Mensual</option>
            <option value="TRIMESTRAL">Trimestral</option>
            <option value="ANUAL">Anual</option>
            <option value="ESPORADICO">Esporádico</option>
          </Select>
        </Field>

        <Field
          fieldKey="comercial.repeticionPct"
          label="Repetición (%)"
          errors={errors}
        >
          <Input
            type="number"
            value={data.comercial.repeticionPct}
            invalid={!!errors["comercial.repeticionPct"]}
            onChange={(e) =>
              update(["comercial", "repeticionPct"], Number(e.target.value))
            }
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          fieldKey="comercial.cicloVenta"
          label="Ciclo de venta"
          errors={errors}
        >
          <Select
            value={data.comercial.cicloVenta}
            invalid={!!errors["comercial.cicloVenta"]}
            onChange={(e) =>
              update(["comercial", "cicloVenta"], e.target.value)
            }
          >
            <option value="INMEDIATO">Inmediato</option>
            <option value="LT7">&lt; 7 días</option>
            <option value="D8_30">8–30 días</option>
            <option value="D31_90">31–90 días</option>
            <option value="GT90">+90 días</option>
          </Select>
        </Field>

        <Field
          fieldKey="comercial.dependenciaCanal"
          label="Dependencia del canal principal"
          errors={errors}
        >
          <Select
            value={data.comercial.dependenciaCanal}
            invalid={!!errors["comercial.dependenciaCanal"]}
            onChange={(e) =>
              update(["comercial", "dependenciaCanal"], e.target.value)
            }
          >
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </Select>
        </Field>
      </div>

      {/* canalesTop3 es array con min 1 max 3, lo manejamos con CheckboxGroup */}
      <CheckboxGroup<Canal>
        fieldKey="comercial.canalesTop3"
        label="Canales top (1 a 3)"
        hint="Elegí los 3 más importantes."
        value={data.comercial.canalesTop3}
        errors={errors}
        options={[
          { value: "REFERIDOS", label: "Referidos" },
          { value: "ADS", label: "Ads" },
          { value: "ORGANICO", label: "Orgánico" },
          { value: "MARKETPLACE", label: "Marketplace" },
          { value: "FUERZA_VENTAS", label: "Fuerza de ventas" },
          { value: "ALIANZAS", label: "Alianzas" },
          { value: "LOCAL_FISICO", label: "Local físico" },
          { value: "LICITACIONES", label: "Licitaciones" },
          { value: "OTRO", label: "Otro" },
        ]}
        onChange={(next) => {
          // enforce max 3 sin romper UX
          const clipped = next.slice(0, 3);
          update(["comercial", "canalesTop3"], clipped);
        }}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Field
          fieldKey="comercial.leads30d"
          label="Leads (30 días)"
          errors={errors}
        >
          <Input
            type="number"
            value={data.comercial.leads30d}
            invalid={!!errors["comercial.leads30d"]}
            onChange={(e) =>
              update(["comercial", "leads30d"], Number(e.target.value))
            }
          />
        </Field>

        <Field
          fieldKey="comercial.reuniones30d"
          label="Reuniones (30 días)"
          errors={errors}
        >
          <Input
            type="number"
            value={data.comercial.reuniones30d}
            invalid={!!errors["comercial.reuniones30d"]}
            onChange={(e) =>
              update(["comercial", "reuniones30d"], Number(e.target.value))
            }
          />
        </Field>

        <Field
          fieldKey="comercial.ventas30d"
          label="Ventas (30 días)"
          errors={errors}
        >
          <Input
            type="number"
            value={data.comercial.ventas30d}
            invalid={!!errors["comercial.ventas30d"]}
            onChange={(e) =>
              update(["comercial", "ventas30d"], Number(e.target.value))
            }
          />
        </Field>
      </div>

      <TextareaField
        fieldKey="comercial.competidores"
        label="Competidores"
        hint="Quién compite, cómo compiten (precio, calidad, marca, distribución)."
        value={data.comercial.competidores}
        onChange={(v) => update(["comercial", "competidores"], v)}
        min={120}
        max={2000}
        errors={errors}
      />

      <TextareaField
        fieldKey="comercial.diferenciacion"
        label="Diferenciación"
        hint="Por qué ganás cuando ganás. Pruebas, casos, ventajas reales."
        value={data.comercial.diferenciacion}
        onChange={(v) => update(["comercial", "diferenciacion"], v)}
        min={180}
        max={2500}
        errors={errors}
      />
    </div>
  );
}
