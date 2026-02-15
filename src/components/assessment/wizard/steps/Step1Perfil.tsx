"use client";

import { z } from "zod";
import {
  AssessmentV2Schema,
  type EvaluationTier,
} from "@/lib/assessment/v2/schema";
import { getTextLimits } from "@/lib/assessment/v2/limits";
import type { FieldErrors } from "../ui";
import { Field, Input, Select, TextareaField } from "../ui";

type AssessmentV2 = z.infer<typeof AssessmentV2Schema>;

type UpdateFn = (
  path: [keyof AssessmentV2] | [keyof AssessmentV2, string],
  value: unknown,
) => void;

export default function Step1Perfil({
  tier,
  data,
  update,
  errors,
}: {
  tier: EvaluationTier;
  data: AssessmentV2;
  update: UpdateFn;
  errors: FieldErrors;
}) {
  const limits = getTextLimits(tier);

  return (
    <div className="space-y-8">
      <Field fieldKey="email" label="Email" errors={errors}>
        <Input
          value={data.email}
          invalid={!!errors["email"]}
          onChange={(e) => update(["email"], e.target.value)}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
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
          />
        </Field>

        <Field fieldKey="perfil.formaLegal" label="Forma legal" errors={errors}>
          <Select
            value={data.perfil.formaLegal}
            invalid={!!errors["perfil.formaLegal"]}
            onChange={(e) => update(["perfil", "formaLegal"], e.target.value)}
          >
            <option value="SA">SA</option>
            <option value="SRL">SRL</option>
            <option value="SAS">SAS</option>
            <option value="UNIPERSONAL">Unipersonal</option>
            <option value="COOPERATIVA">Cooperativa</option>
            <option value="OTRO">Otro</option>
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field fieldKey="perfil.pais" label="País" errors={errors}>
          <Select
            value={data.perfil.pais}
            invalid={!!errors["perfil.pais"]}
            onChange={(e) => update(["perfil", "pais"], e.target.value)}
          >
            <option value="AR">Argentina</option>
            <option value="UY">Uruguay</option>
            <option value="CL">Chile</option>
            <option value="PY">Paraguay</option>
            <option value="BO">Bolivia</option>
            <option value="PE">Perú</option>
            <option value="CO">Colombia</option>
            <option value="MX">México</option>
            <option value="OTRO">Otro</option>
          </Select>
        </Field>

        <Field fieldKey="perfil.provincia" label="Provincia" errors={errors}>
          <Input
            value={data.perfil.provincia}
            invalid={!!errors["perfil.provincia"]}
            onChange={(e) => update(["perfil", "provincia"], e.target.value)}
          />
        </Field>

        <Field fieldKey="perfil.ciudad" label="Ciudad" errors={errors}>
          <Input
            value={data.perfil.ciudad}
            invalid={!!errors["perfil.ciudad"]}
            onChange={(e) => update(["perfil", "ciudad"], e.target.value)}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field fieldKey="perfil.industria" label="Industria" errors={errors}>
          <Select
            value={data.perfil.industria}
            invalid={!!errors["perfil.industria"]}
            onChange={(e) => update(["perfil", "industria"], e.target.value)}
          >
            <option value="COMERCIO">Comercio</option>
            <option value="SERVICIOS">Servicios</option>
            <option value="CONSTRUCCION">Construcción</option>
            <option value="LOGISTICA">Logística</option>
            <option value="SALUD">Salud</option>
            <option value="GASTRONOMIA">Gastronomía</option>
            <option value="AGRO">Agro</option>
            <option value="TECNOLOGIA">Tecnología</option>
            <option value="MANUFACTURA">Manufactura</option>
            <option value="OTRO">Otro</option>
          </Select>
        </Field>

        <Field fieldKey="perfil.subRubro" label="Sub rubro" errors={errors}>
          <Input
            value={data.perfil.subRubro}
            invalid={!!errors["perfil.subRubro"]}
            onChange={(e) => update(["perfil", "subRubro"], e.target.value)}
          />
        </Field>

        <Field fieldKey="perfil.anioInicio" label="Año inicio" errors={errors}>
          <Input
            type="number"
            value={data.perfil.anioInicio}
            invalid={!!errors["perfil.anioInicio"]}
            onChange={(e) =>
              update(["perfil", "anioInicio"], Number(e.target.value))
            }
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field fieldKey="perfil.empleados" label="Empleados" errors={errors}>
          <Input
            type="number"
            value={data.perfil.empleados}
            invalid={!!errors["perfil.empleados"]}
            onChange={(e) =>
              update(["perfil", "empleados"], Number(e.target.value))
            }
          />
        </Field>

        <Field fieldKey="perfil.socios" label="Socios" errors={errors}>
          <Input
            type="number"
            value={data.perfil.socios}
            invalid={!!errors["perfil.socios"]}
            onChange={(e) =>
              update(["perfil", "socios"], Number(e.target.value))
            }
          />
        </Field>

        <Field fieldKey="perfil.liderazgo" label="Liderazgo" errors={errors}>
          <Select
            value={data.perfil.liderazgo}
            invalid={!!errors["perfil.liderazgo"]}
            onChange={(e) => update(["perfil", "liderazgo"], e.target.value)}
          >
            <option value="DUENO_OPERADOR">Dueño operador</option>
            <option value="GERENCIA_PROFESIONAL">Gerencia profesional</option>
            <option value="MIXTO">Mixto</option>
          </Select>
        </Field>
      </div>

      <Field
        fieldKey="perfil.dependenciaFundador"
        label="Dependencia del fundador"
        errors={errors}
      >
        <Select
          value={data.perfil.dependenciaFundador}
          invalid={!!errors["perfil.dependenciaFundador"]}
          onChange={(e) =>
            update(["perfil", "dependenciaFundador"], e.target.value)
          }
        >
          <option value="ALTA">Alta</option>
          <option value="MEDIA">Media</option>
          <option value="BAJA">Baja</option>
        </Select>
      </Field>

      <TextareaField
        fieldKey="perfil.descripcionNegocio"
        label="Descripción del negocio"
        value={data.perfil.descripcionNegocio}
        onChange={(v) => update(["perfil", "descripcionNegocio"], v)}
        min={limits.perfil.descripcionNegocio.min}
        max={limits.perfil.descripcionNegocio.max}
        errors={errors}
      />

      <TextareaField
        fieldKey="perfil.topClientes"
        label="Top clientes"
        value={data.perfil.topClientes}
        onChange={(v) => update(["perfil", "topClientes"], v)}
        min={limits.perfil.topClientes.min}
        max={limits.perfil.topClientes.max}
        errors={errors}
      />

      <TextareaField
        fieldKey="perfil.proveedoresCriticos"
        label="Proveedores críticos"
        value={data.perfil.proveedoresCriticos}
        onChange={(v) => update(["perfil", "proveedoresCriticos"], v)}
        min={limits.perfil.proveedoresCriticos.min}
        max={limits.perfil.proveedoresCriticos.max}
        errors={errors}
      />

      <TextareaField
        fieldKey="perfil.notaContable"
        label="Nota contable"
        value={data.perfil.notaContable}
        onChange={(v) => update(["perfil", "notaContable"], v)}
        min={limits.perfil.notaContable.min}
        max={limits.perfil.notaContable.max}
        errors={errors}
      />
    </div>
  );
}
