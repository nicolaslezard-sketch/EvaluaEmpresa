"use client";

import { z } from "zod";
import { AssessmentV2Schema } from "@/lib/assessment/v2/schema";
import type { FieldErrors } from "../ui";
import { Field, Input, TextareaField } from "../ui";

type AssessmentV2 = z.infer<typeof AssessmentV2Schema>;

type UpdateFn = (
  path: [keyof AssessmentV2] | [keyof AssessmentV2, string],
  value: unknown,
) => void;

export default function Step1Perfil({
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
        <Field fieldKey="email" label="Email" errors={errors}>
          <Input
            value={data.email}
            invalid={!!errors["email"]}
            onChange={(e) => update(["email"], e.target.value)}
            placeholder="tu@email.com"
          />
        </Field>

        <Field
          fieldKey="perfil.razonSocial"
          label="Razón social"
          errors={errors}
        >
          <Input
            value={data.perfil.razonSocial}
            invalid={!!errors["perfil.razonSocial"]}
            onChange={(e) => update(["perfil", "razonSocial"], e.target.value)}
          />
        </Field>

        <Field
          fieldKey="perfil.nombreComercial"
          label="Nombre comercial"
          errors={errors}
        >
          <Input
            value={data.perfil.nombreComercial}
            invalid={!!errors["perfil.nombreComercial"]}
            onChange={(e) =>
              update(["perfil", "nombreComercial"], e.target.value)
            }
          />
        </Field>

        <Field fieldKey="perfil.cuit" label="CUIT (opcional)" errors={errors}>
          <Input
            value={data.perfil.cuit ?? ""}
            invalid={!!errors["perfil.cuit"]}
            onChange={(e) => update(["perfil", "cuit"], e.target.value)}
            placeholder="11 dígitos"
          />
        </Field>
      </div>

      <TextareaField
        fieldKey="perfil.descripcionNegocio"
        label="Descripción del negocio"
        hint="Qué vendés, a quién, cómo cobrás, por qué te eligen. Evitá humo."
        value={data.perfil.descripcionNegocio}
        onChange={(v) => update(["perfil", "descripcionNegocio"], v)}
        min={150}
        max={1000}
        errors={errors}
      />

      <TextareaField
        fieldKey="perfil.topClientes"
        label="Top clientes"
        hint="Nombrá sectores/empresas (si podés), % estimado, concentración."
        value={data.perfil.topClientes}
        onChange={(v) => update(["perfil", "topClientes"], v)}
        min={120}
        max={2000}
        errors={errors}
      />

      <TextareaField
        fieldKey="perfil.proveedoresCriticos"
        label="Proveedores críticos"
        hint="Dependencias, reemplazo, lead times, riesgo de corte."
        value={data.perfil.proveedoresCriticos}
        onChange={(v) => update(["perfil", "proveedoresCriticos"], v)}
        min={120}
        max={1000}
        errors={errors}
      />

      <TextareaField
        fieldKey="perfil.notaContable"
        label="Nota contable"
        hint="Qué tan ordenada está la contabilidad, quién la lleva, cierres, documentación."
        value={data.perfil.notaContable}
        onChange={(v) => update(["perfil", "notaContable"], v)}
        min={80}
        max={3000}
        errors={errors}
      />
    </div>
  );
}
