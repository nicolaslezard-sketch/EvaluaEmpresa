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

type UpdateFn = (path: [keyof AssessmentV2, string], value: unknown) => void;

export default function Step2Finanzas({
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
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Field fieldKey="finanzas.moneda" label="Moneda" errors={errors}>
          <Select
            value={data.finanzas.moneda}
            invalid={!!errors["finanzas.moneda"]}
            onChange={(e) => update(["finanzas", "moneda"], e.target.value)}
          >
            <option value="ARS">ARS</option>
            <option value="USD">USD</option>
          </Select>
        </Field>

        <Field
          fieldKey="finanzas.facturacion12m"
          label="Facturación últimos 12 meses"
          errors={errors}
        >
          <Input
            type="number"
            value={data.finanzas.facturacion12m}
            invalid={!!errors["finanzas.facturacion12m"]}
            onChange={(e) =>
              update(["finanzas", "facturacion12m"], Number(e.target.value))
            }
          />
        </Field>

        <Field
          fieldKey="finanzas.facturacionProm3m"
          label="Facturación promedio últimos 3 meses"
          errors={errors}
        >
          <Input
            type="number"
            value={data.finanzas.facturacionProm3m}
            invalid={!!errors["finanzas.facturacionProm3m"]}
            onChange={(e) =>
              update(["finanzas", "facturacionProm3m"], Number(e.target.value))
            }
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          fieldKey="finanzas.margenBrutoPct"
          label="Margen bruto (%)"
          errors={errors}
        >
          <Input
            type="number"
            value={data.finanzas.margenBrutoPct}
            invalid={!!errors["finanzas.margenBrutoPct"]}
            onChange={(e) =>
              update(["finanzas", "margenBrutoPct"], Number(e.target.value))
            }
          />
        </Field>

        <Field
          fieldKey="finanzas.margenNetoPct"
          label="Margen neto (%)"
          errors={errors}
        >
          <Input
            type="number"
            value={data.finanzas.margenNetoPct}
            invalid={!!errors["finanzas.margenNetoPct"]}
            onChange={(e) =>
              update(["finanzas", "margenNetoPct"], Number(e.target.value))
            }
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field
          fieldKey="finanzas.costosFijosMensuales"
          label="Costos fijos mensuales"
          errors={errors}
        >
          <Input
            type="number"
            value={data.finanzas.costosFijosMensuales}
            invalid={!!errors["finanzas.costosFijosMensuales"]}
            onChange={(e) =>
              update(
                ["finanzas", "costosFijosMensuales"],
                Number(e.target.value),
              )
            }
          />
        </Field>

        <Field
          fieldKey="finanzas.cajaDisponible"
          label="Caja disponible"
          errors={errors}
        >
          <Input
            type="number"
            value={data.finanzas.cajaDisponible}
            invalid={!!errors["finanzas.cajaDisponible"]}
            onChange={(e) =>
              update(["finanzas", "cajaDisponible"], Number(e.target.value))
            }
          />
        </Field>

        <Field
          fieldKey="finanzas.deudaTotal"
          label="Deuda total"
          errors={errors}
        >
          <Input
            type="number"
            value={data.finanzas.deudaTotal}
            invalid={!!errors["finanzas.deudaTotal"]}
            onChange={(e) =>
              update(["finanzas", "deudaTotal"], Number(e.target.value))
            }
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field
          fieldKey="finanzas.deudaVencida"
          label="Deuda vencida"
          errors={errors}
        >
          <Input
            type="number"
            value={data.finanzas.deudaVencida}
            invalid={!!errors["finanzas.deudaVencida"]}
            onChange={(e) =>
              update(["finanzas", "deudaVencida"], Number(e.target.value))
            }
          />
        </Field>

        <Field
          fieldKey="finanzas.impuestosAlDia"
          label="Impuestos al día"
          errors={errors}
        >
          <Select
            value={data.finanzas.impuestosAlDia}
            invalid={!!errors["finanzas.impuestosAlDia"]}
            onChange={(e) =>
              update(["finanzas", "impuestosAlDia"], e.target.value)
            }
          >
            <option value="SI">Sí</option>
            <option value="PARCIAL">Parcial</option>
            <option value="NO">No</option>
          </Select>
        </Field>

        <Field
          fieldKey="finanzas.clientesActivos90d"
          label="Clientes activos (últimos 90 días)"
          errors={errors}
        >
          <Input
            type="number"
            value={data.finanzas.clientesActivos90d}
            invalid={!!errors["finanzas.clientesActivos90d"]}
            onChange={(e) =>
              update(["finanzas", "clientesActivos90d"], Number(e.target.value))
            }
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          fieldKey="finanzas.pagoProveedores"
          label="Pago a proveedores"
          errors={errors}
        >
          <Select
            value={data.finanzas.pagoProveedores}
            invalid={!!errors["finanzas.pagoProveedores"]}
            onChange={(e) =>
              update(["finanzas", "pagoProveedores"], e.target.value)
            }
          >
            <option value="0_15">0–15 días</option>
            <option value="16_30">16–30 días</option>
            <option value="31_60">31–60 días</option>
            <option value="60_PLUS">+60 días</option>
          </Select>
        </Field>

        <Field
          fieldKey="finanzas.cobroClientes"
          label="Cobro a clientes"
          errors={errors}
        >
          <Select
            value={data.finanzas.cobroClientes}
            invalid={!!errors["finanzas.cobroClientes"]}
            onChange={(e) =>
              update(["finanzas", "cobroClientes"], e.target.value)
            }
          >
            <option value="0_15">0–15 días</option>
            <option value="16_30">16–30 días</option>
            <option value="31_60">31–60 días</option>
            <option value="60_PLUS">+60 días</option>
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          fieldKey="finanzas.concentracionTopClientePct"
          label="Concentración top cliente (%)"
          errors={errors}
        >
          <Input
            type="number"
            value={data.finanzas.concentracionTopClientePct}
            invalid={!!errors["finanzas.concentracionTopClientePct"]}
            onChange={(e) =>
              update(
                ["finanzas", "concentracionTopClientePct"],
                Number(e.target.value),
              )
            }
          />
        </Field>

        <Field
          fieldKey="finanzas.emiteFactura"
          label="Emite factura"
          errors={errors}
        >
          <Select
            value={data.finanzas.emiteFactura}
            invalid={!!errors["finanzas.emiteFactura"]}
            onChange={(e) =>
              update(["finanzas", "emiteFactura"], e.target.value)
            }
          >
            <option value="SIEMPRE">Siempre</option>
            <option value="A_VECES">A veces</option>
            <option value="NO">No</option>
          </Select>
        </Field>
      </div>

      <TextareaField
        fieldKey="finanzas.evidenciaNumeros"
        label="Evidencia de números"
        hint="Contá de dónde salen estos números (sistema, contador, balances, extractos) y qué tan confiables son."
        value={data.finanzas.evidenciaNumeros}
        onChange={(v) => update(["finanzas", "evidenciaNumeros"], v)}
        min={limits.finanzas.evidenciaNumeros.min}
        max={limits.finanzas.evidenciaNumeros.max}
        errors={errors}
      />
    </div>
  );
}
