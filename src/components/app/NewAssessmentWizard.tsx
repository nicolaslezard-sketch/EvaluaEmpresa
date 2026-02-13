"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { AssessmentV2Schema } from "@/lib/assessment/v2/schema";
import { useEffect } from "react";

const STORAGE_KEY = "ee_v2_draft";

type AssessmentV2 = z.infer<typeof AssessmentV2Schema>;

const initialData: AssessmentV2 = {
  version: "v2",
  email: "",

  perfil: {
    razonSocial: "",
    nombreComercial: "",
    cuit: "",
    pais: "AR",
    provincia: "",
    ciudad: "",
    industria: "SERVICIOS",
    subRubro: "",
    formaLegal: "SAS",
    anioInicio: new Date().getFullYear(),
    empleados: 0,
    socios: 1,
    liderazgo: "DUENO_OPERADOR",
    dependenciaFundador: "ALTA",
    descripcionNegocio: "",
    topClientes: "",
    proveedoresCriticos: "",
    sitioWeb: "",
    linkedin: "",
    instagram: "",
    cuentaBancariaEmpresa: "SI",
    contabilidadFormal: "SI",
    notaContable: "",
  },

  finanzas: {
    moneda: "ARS",
    facturacion12m: 0,
    facturacionProm3m: 0,
    margenBrutoPct: 0,
    margenNetoPct: 0,
    costosFijosMensuales: 0,
    cajaDisponible: 0,
    deudaTotal: 0,
    deudaVencida: 0,
    impuestosAlDia: "SI",
    pagoProveedores: "16_30",
    cobroClientes: "16_30",
    concentracionTopClientePct: 0,
    clientesActivos90d: 0,
    emiteFactura: "SIEMPRE",
    evidenciaNumeros: "",
  },

  comercial: {
    tipoNegocio: "B2B",
    ofertaPrincipal: "",
    propuestaValor: "",
    modeloIngresos: "PROYECTO",
    ticketPromedio: 0,
    frecuenciaCompra: "MENSUAL",
    repeticionPct: 0,
    cicloVenta: "D8_30",
    canalesTop3: ["REFERIDOS"],
    dependenciaCanal: "MEDIA",
    leads30d: 0,
    reuniones30d: 0,
    ventas30d: 0,
    competidores: "",
    diferenciacion: "",
  },

  riesgos: {
    procesosDocumentados: "PARCIAL",
    herramientasGestion: ["SHEETS"],
    depProveedorCritico: "MEDIA",
    depEmpleadoClave: "MEDIA",
    incidentes12m: ["NINGUNO"],
    seguros: ["NINGUNO"],
    contratosClientes: "A_VECES",
    contratosProveedores: "A_VECES",
    cumplimientoFiscalLaboral: "MEDIO",
    notaCumplimiento: "",
    marca: "NO",
    litigios: "NO",
    detalleLitigios: "",
    riesgoRegulatorio: "MEDIO",
    notaRegulatorio: "",
  },

  estrategia: {
    objetivo12m: "",
    planAccion: "",
    presupuestoCrecimientoMensual: 0,
    inversiones6m: "",
    riesgosDueno: "",
    mitigaciones: "",
    kpis: ["VENTAS"],
    frecuenciaSeguimiento: "MENSUAL",
    disponibilidadInfo: "MEDIA",
  },

  confirmaciones: {
    datosCorrectos: false,
    informeOrientativo: false,
  },
};

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-medium text-zinc-800">{children}</div>;
}

function Help({ children }: { children: React.ReactNode }) {
  return <div className="mt-1 text-xs text-zinc-500">{children}</div>;
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-400"
      }
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={
        "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-400"
      }
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm outline-none focus:border-zinc-400"
    />
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
      {children}
    </span>
  );
}

export default function NewAssessmentWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AssessmentV2>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      setData(parsed);
    } catch {
      // si hay basura, limpiamos
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const steps = useMemo(
    () => [
      { n: 1, title: "Perfil empresarial" },
      { n: 2, title: "Finanzas y solvencia" },
      { n: 3, title: "Modelo comercial" },
      { n: 4, title: "Riesgos operativos y legales" },
      { n: 5, title: "Estrategia y confirmación" },
    ],
    [],
  );

  function update(
    path: [keyof AssessmentV2] | [keyof AssessmentV2, string],
    value: unknown,
  ) {
    setData((prev) => {
      const copy = structuredClone(prev);

      if (path.length === 1) {
        const [k1] = path;
        return {
          ...copy,
          [k1]: value,
        } as AssessmentV2;
      }

      const [k1, k2] = path;

      return {
        ...copy,
        [k1]: {
          ...(copy[k1] as Record<string, unknown>),
          [k2]: value,
        },
      } as AssessmentV2;
    });
  }

  function next() {
    setStep((s) => Math.min(s + 1, 5));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }
  const DESC_MIN = 150;
  const DESC_MAX = 1000;

  function validateCurrentStep(): { ok: boolean; message?: string } {
    // Validación parcial por step (simple): usamos el schema global,
    // pero para UX, verificamos mínimos del step actual.
    try {
      if (step === 1) {
        if (data.perfil.descripcionNegocio.trim().length < DESC_MIN)
          return {
            ok: false,
            message: `Descripción del negocio es obligatoria (mín. ${DESC_MIN} caracteres).`,
          };

        if (data.perfil.topClientes.trim().length < 120)
          return {
            ok: false,
            message: "Top clientes es obligatorio (mín. 120 caracteres).",
          };
        if (data.perfil.proveedoresCriticos.trim().length < 120)
          return {
            ok: false,
            message:
              "Proveedores críticos es obligatorio (mín. 120 caracteres).",
          };
        if (data.perfil.notaContable.trim().length < 80)
          return {
            ok: false,
            message: "Nota contable es obligatoria (mín. 80 caracteres).",
          };
      }
      if (step === 2) {
        if (data.finanzas.evidenciaNumeros.trim().length < 200)
          return {
            ok: false,
            message:
              "Evidencia de números es obligatoria (mín. 200 caracteres).",
          };
      }
      if (step === 3) {
        if (data.comercial.ofertaPrincipal.trim().length < 200)
          return {
            ok: false,
            message: "Oferta principal es obligatoria (mín. 200 caracteres).",
          };
        if (data.comercial.diferenciacion.trim().length < 180)
          return {
            ok: false,
            message: "Diferenciación es obligatoria (mín. 180 caracteres).",
          };
      }
      if (step === 4) {
        if (data.riesgos.notaCumplimiento.trim().length < 160)
          return {
            ok: false,
            message:
              "Nota de cumplimiento es obligatoria (mín. 160 caracteres).",
          };
        if (data.riesgos.notaRegulatorio.trim().length < 120)
          return {
            ok: false,
            message: "Nota regulatoria es obligatoria (mín. 120 caracteres).",
          };
        if (
          data.riesgos.litigios === "SI" &&
          (data.riesgos.detalleLitigios || "").trim().length < 200
        ) {
          return {
            ok: false,
            message:
              "Detalle de litigios es obligatorio (mín. 200 caracteres).",
          };
        }
      }
      if (step === 5) {
        if (data.estrategia.objetivo12m.trim().length < 180)
          return {
            ok: false,
            message: "Objetivo 12m es obligatorio (mín. 180 caracteres).",
          };
        if (data.estrategia.planAccion.trim().length < 220)
          return {
            ok: false,
            message: "Plan de acción es obligatorio (mín. 220 caracteres).",
          };
        if (data.estrategia.riesgosDueno.trim().length < 200)
          return {
            ok: false,
            message:
              "Riesgos identificados es obligatorio (mín. 200 caracteres).",
          };
        if (data.estrategia.mitigaciones.trim().length < 180)
          return {
            ok: false,
            message: "Mitigaciones es obligatorio (mín. 180 caracteres).",
          };
      }
      return { ok: true };
    } catch {
      return { ok: false, message: "Revisá los campos del paso actual." };
    }
  }

  async function submit() {
    setSubmitting(true);
    setError(null);

    try {
      // Validación final (server también valida)
      const parsed = AssessmentV2Schema.safeParse({
        ...data,
        version: "v2",
      });
      if (!parsed.success) {
        setError(
          "Faltan datos o hay inconsistencias. Revisá los campos marcados.",
        );
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Error creando evaluación");

      localStorage.removeItem(STORAGE_KEY);

      router.push(`/app/analysis/${json.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  const progress = Math.round((step / 5) * 100);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Nueva evaluación (v2)
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Completar datos consistentes mejora la precisión del E-Score™ y reduce
          incertidumbre.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {steps.map((s) => (
            <Pill key={s.n}>
              {s.n === step ? "● " : ""}
              {s.n}. {s.title}
            </Pill>
          ))}
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
          <div className="h-2 bg-zinc-900" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <Label>Email de entrega</Label>
                <Input
                  value={data.email}
                  onChange={(e) => update(["email"], e.target.value)}
                  placeholder="tu@email.com"
                />
              </Field>

              <Field>
                <Label>CUIT (opcional)</Label>
                <Input
                  value={data.perfil.cuit ?? ""}
                  onChange={(e) => update(["perfil", "cuit"], e.target.value)}
                  placeholder="11 dígitos"
                />
              </Field>

              <Field>
                <Label>Razón social</Label>
                <Input
                  value={data.perfil.razonSocial}
                  onChange={(e) =>
                    update(["perfil", "razonSocial"], e.target.value)
                  }
                />
              </Field>

              <Field>
                <Label>Nombre comercial</Label>
                <Input
                  value={data.perfil.nombreComercial}
                  onChange={(e) =>
                    update(["perfil", "nombreComercial"], e.target.value)
                  }
                />
              </Field>

              <Field>
                <Label>País</Label>
                <Select
                  value={data.perfil.pais}
                  onChange={(e) => update(["perfil", "pais"], e.target.value)}
                >
                  {["AR", "UY", "CL", "PY", "BO", "PE", "CO", "MX", "OTRO"].map(
                    (c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ),
                  )}
                </Select>
              </Field>

              <Field>
                <Label>Provincia / Estado</Label>
                <Input
                  value={data.perfil.provincia}
                  onChange={(e) =>
                    update(["perfil", "provincia"], e.target.value)
                  }
                />
              </Field>

              <Field>
                <Label>Ciudad</Label>
                <Input
                  value={data.perfil.ciudad}
                  onChange={(e) => update(["perfil", "ciudad"], e.target.value)}
                />
              </Field>

              <Field>
                <Label>Industria</Label>
                <Select
                  value={data.perfil.industria}
                  onChange={(e) =>
                    update(["perfil", "industria"], e.target.value)
                  }
                >
                  {[
                    ["COMERCIO", "Comercio"],
                    ["SERVICIOS", "Servicios"],
                    ["CONSTRUCCION", "Construcción"],
                    ["LOGISTICA", "Logística"],
                    ["SALUD", "Salud"],
                    ["GASTRONOMIA", "Gastronomía"],
                    ["AGRO", "Agro"],
                    ["TECNOLOGIA", "Tecnología"],
                    ["MANUFACTURA", "Manufactura"],
                    ["OTRO", "Otro"],
                  ].map(([v, label]) => (
                    <option key={v} value={v}>
                      {label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                <Label>Sub-rubro</Label>
                <Input
                  value={data.perfil.subRubro}
                  onChange={(e) =>
                    update(["perfil", "subRubro"], e.target.value)
                  }
                  placeholder="Ej: distribución mayorista, obra civil, etc."
                />
              </Field>

              <Field>
                <Label>Forma legal</Label>
                <Select
                  value={data.perfil.formaLegal}
                  onChange={(e) =>
                    update(["perfil", "formaLegal"], e.target.value)
                  }
                >
                  {[
                    "SA",
                    "SRL",
                    "SAS",
                    "UNIPERSONAL",
                    "COOPERATIVA",
                    "OTRO",
                  ].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field>
                <Label>Año inicio</Label>
                <Input
                  type="number"
                  value={data.perfil.anioInicio}
                  onChange={(e) =>
                    update(["perfil", "anioInicio"], Number(e.target.value))
                  }
                />
              </Field>

              <Field>
                <Label>Empleados</Label>
                <Input
                  type="number"
                  value={data.perfil.empleados}
                  onChange={(e) =>
                    update(["perfil", "empleados"], Number(e.target.value))
                  }
                />
              </Field>

              <Field>
                <Label>Socios / accionistas</Label>
                <Input
                  type="number"
                  value={data.perfil.socios}
                  onChange={(e) =>
                    update(["perfil", "socios"], Number(e.target.value))
                  }
                />
              </Field>

              <Field>
                <Label>Liderazgo</Label>
                <Select
                  value={data.perfil.liderazgo}
                  onChange={(e) =>
                    update(["perfil", "liderazgo"], e.target.value)
                  }
                >
                  <option value="DUENO_OPERADOR">Dueño-operador</option>
                  <option value="GERENCIA_PROFESIONAL">
                    Gerencia profesional
                  </option>
                  <option value="MIXTO">Mixto</option>
                </Select>
              </Field>

              <Field>
                <Label>Dependencia del fundador</Label>
                <Select
                  value={data.perfil.dependenciaFundador}
                  onChange={(e) =>
                    update(["perfil", "dependenciaFundador"], e.target.value)
                  }
                >
                  <option value="ALTA">Alta</option>
                  <option value="MEDIA">Media</option>
                  <option value="BAJA">Baja</option>
                </Select>
              </Field>

              <Field>
                <Label>Cuenta bancaria empresaria</Label>
                <Select
                  value={data.perfil.cuentaBancariaEmpresa}
                  onChange={(e) =>
                    update(["perfil", "cuentaBancariaEmpresa"], e.target.value)
                  }
                >
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </Select>
              </Field>

              <Field>
                <Label>Contabilidad formal</Label>
                <Select
                  value={data.perfil.contabilidadFormal}
                  onChange={(e) =>
                    update(["perfil", "contabilidadFormal"], e.target.value)
                  }
                >
                  <option value="SI">Sí</option>
                  <option value="PARCIAL">Parcial</option>
                  <option value="NO">No</option>
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Field>
                <Label>Sitio web (opcional)</Label>
                <Input
                  value={data.perfil.sitioWeb ?? ""}
                  onChange={(e) =>
                    update(["perfil", "sitioWeb"], e.target.value)
                  }
                  placeholder="https://..."
                />
              </Field>
              <Field>
                <Label>LinkedIn (opcional)</Label>
                <Input
                  value={data.perfil.linkedin ?? ""}
                  onChange={(e) =>
                    update(["perfil", "linkedin"], e.target.value)
                  }
                  placeholder="https://..."
                />
              </Field>
              <Field>
                <Label>Instagram (opcional)</Label>
                <Input
                  value={data.perfil.instagram ?? ""}
                  onChange={(e) =>
                    update(["perfil", "instagram"], e.target.value)
                  }
                  placeholder="https://..."
                />
              </Field>
            </div>

            <Field>
              <Label>Descripción del negocio (obligatorio)</Label>
              <Textarea
                rows={6}
                value={data.perfil.descripcionNegocio}
                maxLength={DESC_MAX}
                onChange={(e) => {
                  const v = e.target.value.slice(0, DESC_MAX);
                  update(["perfil", "descripcionNegocio"], v);
                }}
                placeholder="Qué hace la empresa, a quién vende, cómo entrega valor, qué la hace funcionar."
              />
              <div className="flex items-center justify-between">
                <Help>
                  Mínimo {DESC_MIN} y máximo {DESC_MAX}. Escribí en forma
                  concreta (operación, clientes, cómo entrega, equipo).
                </Help>
                <div className="ml-4 whitespace-nowrap text-xs text-zinc-500">
                  {data.perfil.descripcionNegocio.length}/{DESC_MAX}
                </div>
              </div>
            </Field>

            <Field>
              <Label>Top 3 clientes o tipos de cliente (obligatorio)</Label>
              <Textarea
                rows={4}
                value={data.perfil.topClientes}
                onChange={(e) =>
                  update(["perfil", "topClientes"], e.target.value)
                }
              />
              <Help>Mínimo 120 caracteres. Evitá “público general”.</Help>
            </Field>

            <Field>
              <Label>Proveedores críticos (obligatorio)</Label>
              <Textarea
                rows={4}
                value={data.perfil.proveedoresCriticos}
                onChange={(e) =>
                  update(["perfil", "proveedoresCriticos"], e.target.value)
                }
              />
              <Help>
                Mínimo 120 caracteres. Indicá si hay sustitutos y plazos.
              </Help>
            </Field>

            <Field>
              <Label>
                Nota contable (cómo se llevan registros) (obligatorio)
              </Label>
              <Textarea
                rows={4}
                value={data.perfil.notaContable}
                onChange={(e) =>
                  update(["perfil", "notaContable"], e.target.value)
                }
              />
              <Help>
                Mínimo 80 caracteres. Ej: estudio contable, ERP, cierre mensual,
                etc.
              </Help>
            </Field>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Field>
                <Label>Moneda</Label>
                <Select
                  value={data.finanzas.moneda}
                  onChange={(e) =>
                    update(["finanzas", "moneda"], e.target.value)
                  }
                >
                  <option value="ARS">ARS</option>
                  <option value="USD">USD</option>
                </Select>
              </Field>

              <Field>
                <Label>Facturación 12m</Label>
                <Input
                  type="number"
                  value={data.finanzas.facturacion12m}
                  onChange={(e) =>
                    update(
                      ["finanzas", "facturacion12m"],
                      Number(e.target.value),
                    )
                  }
                />
              </Field>

              <Field>
                <Label>Promedio mensual (últimos 3m)</Label>
                <Input
                  type="number"
                  value={data.finanzas.facturacionProm3m}
                  onChange={(e) =>
                    update(
                      ["finanzas", "facturacionProm3m"],
                      Number(e.target.value),
                    )
                  }
                />
              </Field>

              <Field>
                <Label>Margen bruto (%)</Label>
                <Input
                  type="number"
                  value={data.finanzas.margenBrutoPct}
                  onChange={(e) =>
                    update(
                      ["finanzas", "margenBrutoPct"],
                      Number(e.target.value),
                    )
                  }
                />
              </Field>

              <Field>
                <Label>Margen neto (%)</Label>
                <Input
                  type="number"
                  value={data.finanzas.margenNetoPct}
                  onChange={(e) =>
                    update(
                      ["finanzas", "margenNetoPct"],
                      Number(e.target.value),
                    )
                  }
                />
              </Field>

              <Field>
                <Label>Costos fijos mensuales</Label>
                <Input
                  type="number"
                  value={data.finanzas.costosFijosMensuales}
                  onChange={(e) =>
                    update(
                      ["finanzas", "costosFijosMensuales"],
                      Number(e.target.value),
                    )
                  }
                />
              </Field>

              <Field>
                <Label>Caja disponible (cash/banco)</Label>
                <Input
                  type="number"
                  value={data.finanzas.cajaDisponible}
                  onChange={(e) =>
                    update(
                      ["finanzas", "cajaDisponible"],
                      Number(e.target.value),
                    )
                  }
                />
              </Field>

              <Field>
                <Label>Deuda total</Label>
                <Input
                  type="number"
                  value={data.finanzas.deudaTotal}
                  onChange={(e) =>
                    update(["finanzas", "deudaTotal"], Number(e.target.value))
                  }
                />
              </Field>

              <Field>
                <Label>Deuda vencida</Label>
                <Input
                  type="number"
                  value={data.finanzas.deudaVencida}
                  onChange={(e) =>
                    update(["finanzas", "deudaVencida"], Number(e.target.value))
                  }
                />
              </Field>

              <Field>
                <Label>Impuestos al día</Label>
                <Select
                  value={data.finanzas.impuestosAlDia}
                  onChange={(e) =>
                    update(["finanzas", "impuestosAlDia"], e.target.value)
                  }
                >
                  <option value="SI">Sí</option>
                  <option value="PARCIAL">Parcial</option>
                  <option value="NO">No</option>
                </Select>
              </Field>

              <Field>
                <Label>Pago a proveedores</Label>
                <Select
                  value={data.finanzas.pagoProveedores}
                  onChange={(e) =>
                    update(["finanzas", "pagoProveedores"], e.target.value)
                  }
                >
                  <option value="0_15">0–15</option>
                  <option value="16_30">16–30</option>
                  <option value="31_60">31–60</option>
                  <option value="60_PLUS">+60</option>
                </Select>
              </Field>

              <Field>
                <Label>Cobro a clientes</Label>
                <Select
                  value={data.finanzas.cobroClientes}
                  onChange={(e) =>
                    update(["finanzas", "cobroClientes"], e.target.value)
                  }
                >
                  <option value="0_15">0–15</option>
                  <option value="16_30">16–30</option>
                  <option value="31_60">31–60</option>
                  <option value="60_PLUS">+60</option>
                </Select>
              </Field>

              <Field>
                <Label>Concentración top cliente (%)</Label>
                <Input
                  type="number"
                  value={data.finanzas.concentracionTopClientePct}
                  onChange={(e) =>
                    update(
                      ["finanzas", "concentracionTopClientePct"],
                      Number(e.target.value),
                    )
                  }
                />
              </Field>

              <Field>
                <Label>Clientes activos (90 días)</Label>
                <Input
                  type="number"
                  value={data.finanzas.clientesActivos90d}
                  onChange={(e) =>
                    update(
                      ["finanzas", "clientesActivos90d"],
                      Number(e.target.value),
                    )
                  }
                />
              </Field>

              <Field>
                <Label>Emite factura</Label>
                <Select
                  value={data.finanzas.emiteFactura}
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

            <Field>
              <Label>
                Evidencia / confiabilidad de los números (obligatorio)
              </Label>
              <Textarea
                rows={6}
                value={data.finanzas.evidenciaNumeros}
                onChange={(e) =>
                  update(["finanzas", "evidenciaNumeros"], e.target.value)
                }
                placeholder="Cómo estimaste estos números (sistema contable, planillas, cierre mensual, facturación, etc.)."
              />
              <Help>Mínimo 200 caracteres.</Help>
            </Field>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Field>
                <Label>Tipo de negocio</Label>
                <Select
                  value={data.comercial.tipoNegocio}
                  onChange={(e) =>
                    update(["comercial", "tipoNegocio"], e.target.value)
                  }
                >
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                  <option value="MIXTO">Mixto</option>
                </Select>
              </Field>

              <Field>
                <Label>Modelo de ingresos</Label>
                <Select
                  value={data.comercial.modeloIngresos}
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

              <Field>
                <Label>Ticket promedio</Label>
                <Input
                  type="number"
                  value={data.comercial.ticketPromedio}
                  onChange={(e) =>
                    update(
                      ["comercial", "ticketPromedio"],
                      Number(e.target.value),
                    )
                  }
                />
              </Field>

              <Field>
                <Label>Frecuencia de compra</Label>
                <Select
                  value={data.comercial.frecuenciaCompra}
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

              <Field>
                <Label>Repetición (%)</Label>
                <Input
                  type="number"
                  value={data.comercial.repeticionPct}
                  onChange={(e) =>
                    update(
                      ["comercial", "repeticionPct"],
                      Number(e.target.value),
                    )
                  }
                />
              </Field>

              <Field>
                <Label>Ciclo de venta</Label>
                <Select
                  value={data.comercial.cicloVenta}
                  onChange={(e) =>
                    update(["comercial", "cicloVenta"], e.target.value)
                  }
                >
                  <option value="INMEDIATO">Inmediato</option>
                  <option value="LT7">&lt; 7 días</option>
                  <option value="D8_30">8–30</option>
                  <option value="D31_90">31–90</option>
                  <option value="GT90">&gt; 90</option>
                </Select>
              </Field>

              <Field>
                <Label>Dependencia de un canal</Label>
                <Select
                  value={data.comercial.dependenciaCanal}
                  onChange={(e) =>
                    update(["comercial", "dependenciaCanal"], e.target.value)
                  }
                >
                  <option value="ALTA">Alta</option>
                  <option value="MEDIA">Media</option>
                  <option value="BAJA">Baja</option>
                </Select>
              </Field>

              <Field>
                <Label>Leads (30 días)</Label>
                <Input
                  type="number"
                  value={data.comercial.leads30d}
                  onChange={(e) =>
                    update(["comercial", "leads30d"], Number(e.target.value))
                  }
                />
              </Field>

              <Field>
                <Label>Reuniones / consultas (30 días)</Label>
                <Input
                  type="number"
                  value={data.comercial.reuniones30d}
                  onChange={(e) =>
                    update(
                      ["comercial", "reuniones30d"],
                      Number(e.target.value),
                    )
                  }
                />
              </Field>

              <Field>
                <Label>Ventas cerradas (30 días)</Label>
                <Input
                  type="number"
                  value={data.comercial.ventas30d}
                  onChange={(e) =>
                    update(["comercial", "ventas30d"], Number(e.target.value))
                  }
                />
              </Field>
            </div>

            <Field>
              <Label>Canales (top 1 a 3)</Label>
              <div className="grid gap-2 md:grid-cols-3">
                {[
                  ["REFERIDOS", "Referidos"],
                  ["ADS", "Ads"],
                  ["ORGANICO", "Orgánico"],
                  ["MARKETPLACE", "Marketplace"],
                  ["FUERZA_VENTAS", "Fuerza de ventas"],
                  ["ALIANZAS", "Alianzas"],
                  ["LOCAL_FISICO", "Local físico"],
                  ["LICITACIONES", "Licitaciones"],
                  ["OTRO", "Otro"],
                ].map(([v, label]) => {
                  const checked = data.comercial.canalesTop3.includes(
                    v as AssessmentV2["comercial"]["canalesTop3"][number],
                  );
                  return (
                    <label
                      key={v}
                      className="flex items-center gap-2 rounded-xl border border-zinc-200 p-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const curr = data.comercial.canalesTop3;
                          const value =
                            v as AssessmentV2["comercial"]["canalesTop3"][number];

                          const next = e.target.checked
                            ? Array.from(new Set([...curr, value])).slice(0, 3)
                            : curr.filter((x) => x !== value);

                          update(
                            ["comercial", "canalesTop3"],
                            next.length ? next : ["REFERIDOS"],
                          );
                        }}
                      />
                      {label}
                    </label>
                  );
                })}
              </div>
              <Help>Elegí 1 a 3. Esto afecta resiliencia comercial.</Help>
            </Field>

            <Field>
              <Label>Oferta principal (obligatorio)</Label>
              <Textarea
                rows={5}
                value={data.comercial.ofertaPrincipal}
                onChange={(e) =>
                  update(["comercial", "ofertaPrincipal"], e.target.value)
                }
              />
              <Help>
                Mínimo 200 caracteres. Qué venden, cómo se entrega y cómo se
                cobra.
              </Help>
            </Field>

            <Field>
              <Label>Propuesta de valor (obligatorio)</Label>
              <Textarea
                rows={4}
                value={data.comercial.propuestaValor}
                onChange={(e) =>
                  update(["comercial", "propuestaValor"], e.target.value)
                }
              />
              <Help>Mínimo 160 caracteres. Evitá slogans.</Help>
            </Field>

            <Field>
              <Label>Competidores directos (obligatorio)</Label>
              <Textarea
                rows={4}
                value={data.comercial.competidores}
                onChange={(e) =>
                  update(["comercial", "competidores"], e.target.value)
                }
              />
              <Help>Mínimo 120 caracteres.</Help>
            </Field>

            <Field>
              <Label>Diferenciación real (obligatorio)</Label>
              <Textarea
                rows={5}
                value={data.comercial.diferenciacion}
                onChange={(e) =>
                  update(["comercial", "diferenciacion"], e.target.value)
                }
              />
              <Help>
                Mínimo 180 caracteres. Si no hay, decilo (eso baja el score,
                pero es coherente).
              </Help>
            </Field>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Field>
                <Label>Procesos documentados</Label>
                <Select
                  value={data.riesgos.procesosDocumentados}
                  onChange={(e) =>
                    update(["riesgos", "procesosDocumentados"], e.target.value)
                  }
                >
                  <option value="SI">Sí</option>
                  <option value="PARCIAL">Parcial</option>
                  <option value="NO">No</option>
                </Select>
              </Field>

              <Field>
                <Label>Dependencia proveedor crítico</Label>
                <Select
                  value={data.riesgos.depProveedorCritico}
                  onChange={(e) =>
                    update(["riesgos", "depProveedorCritico"], e.target.value)
                  }
                >
                  <option value="ALTA">Alta</option>
                  <option value="MEDIA">Media</option>
                  <option value="BAJA">Baja</option>
                </Select>
              </Field>

              <Field>
                <Label>Dependencia empleado clave</Label>
                <Select
                  value={data.riesgos.depEmpleadoClave}
                  onChange={(e) =>
                    update(["riesgos", "depEmpleadoClave"], e.target.value)
                  }
                >
                  <option value="ALTA">Alta</option>
                  <option value="MEDIA">Media</option>
                  <option value="BAJA">Baja</option>
                </Select>
              </Field>

              <Field>
                <Label>Contratos con clientes</Label>
                <Select
                  value={data.riesgos.contratosClientes}
                  onChange={(e) =>
                    update(["riesgos", "contratosClientes"], e.target.value)
                  }
                >
                  <option value="SIEMPRE">Siempre</option>
                  <option value="A_VECES">A veces</option>
                  <option value="NUNCA">Nunca</option>
                </Select>
              </Field>

              <Field>
                <Label>Contratos con proveedores</Label>
                <Select
                  value={data.riesgos.contratosProveedores}
                  onChange={(e) =>
                    update(["riesgos", "contratosProveedores"], e.target.value)
                  }
                >
                  <option value="SIEMPRE">Siempre</option>
                  <option value="A_VECES">A veces</option>
                  <option value="NUNCA">Nunca</option>
                </Select>
              </Field>

              <Field>
                <Label>Cumplimiento fiscal/laboral</Label>
                <Select
                  value={data.riesgos.cumplimientoFiscalLaboral}
                  onChange={(e) =>
                    update(
                      ["riesgos", "cumplimientoFiscalLaboral"],
                      e.target.value,
                    )
                  }
                >
                  <option value="ALTO">Alto</option>
                  <option value="MEDIO">Medio</option>
                  <option value="BAJO">Bajo</option>
                </Select>
              </Field>

              <Field>
                <Label>Marca</Label>
                <Select
                  value={data.riesgos.marca}
                  onChange={(e) => update(["riesgos", "marca"], e.target.value)}
                >
                  <option value="REGISTRADA">Registrada</option>
                  <option value="EN_TRAMITE">En trámite</option>
                  <option value="NO">No</option>
                </Select>
              </Field>

              <Field>
                <Label>Litigios / contingencias</Label>
                <Select
                  value={data.riesgos.litigios}
                  onChange={(e) =>
                    update(["riesgos", "litigios"], e.target.value)
                  }
                >
                  <option value="NO">No</option>
                  <option value="SI">Sí</option>
                </Select>
              </Field>

              <Field>
                <Label>Riesgo regulatorio</Label>
                <Select
                  value={data.riesgos.riesgoRegulatorio}
                  onChange={(e) =>
                    update(["riesgos", "riesgoRegulatorio"], e.target.value)
                  }
                >
                  <option value="ALTO">Alto</option>
                  <option value="MEDIO">Medio</option>
                  <option value="BAJO">Bajo</option>
                </Select>
              </Field>
            </div>

            <Field>
              <Label>Herramientas de gestión</Label>
              <div className="grid gap-2 md:grid-cols-5">
                {[
                  ["ERP", "ERP"],
                  ["CRM", "CRM"],
                  ["SHEETS", "Sheets"],
                  ["NINGUNA", "Ninguna"],
                  ["OTRO", "Otro"],
                ].map(([v, label]) => {
                  const value =
                    v as AssessmentV2["riesgos"]["herramientasGestion"][number];

                  const checked =
                    data.riesgos.herramientasGestion.includes(value);

                  return (
                    <label
                      key={v}
                      className="flex items-center gap-2 rounded-xl border border-zinc-200 p-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const curr = data.riesgos.herramientasGestion;
                          const value =
                            v as AssessmentV2["riesgos"]["herramientasGestion"][number];

                          let next = e.target.checked
                            ? Array.from(new Set([...curr, value]))
                            : curr.filter((x) => x !== value);

                          if (!next.length) next = ["SHEETS"];

                          if (next.includes("NINGUNA") && next.length > 1)
                            next = ["NINGUNA"];

                          update(["riesgos", "herramientasGestion"], next);
                        }}
                      />
                      {label}
                    </label>
                  );
                })}
              </div>
            </Field>

            <Field>
              <Label>Incidentes últimos 12 meses</Label>
              <div className="grid gap-2 md:grid-cols-4">
                {[
                  ["CORTE_OPERATIVO", "Corte operativo"],
                  ["RECLAMOS_LEGALES", "Reclamos legales"],
                  ["INSPECCIONES", "Inspecciones"],
                  ["MULTAS", "Multas"],
                  ["SEGURIDAD", "Seguridad"],
                  ["FRAUDE", "Fraude"],
                  ["NINGUNO", "Ninguno"],
                ].map(([v, label]) => {
                  const value =
                    v as AssessmentV2["riesgos"]["incidentes12m"][number];

                  const checked = data.riesgos.incidentes12m.includes(value);
                  return (
                    <label
                      key={v}
                      className="flex items-center gap-2 rounded-xl border border-zinc-200 p-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const curr = data.riesgos.incidentes12m;
                          const value =
                            v as AssessmentV2["riesgos"]["incidentes12m"][number];

                          let next = e.target.checked
                            ? Array.from(new Set([...curr, value]))
                            : curr.filter((x) => x !== value);

                          if (!next.length) next = ["NINGUNO"];
                          if (next.includes("NINGUNO") && next.length > 1)
                            next = ["NINGUNO"];
                          update(["riesgos", "incidentes12m"], next);
                        }}
                      />
                      {label}
                    </label>
                  );
                })}
              </div>
            </Field>

            <Field>
              <Label>Seguros</Label>
              <div className="grid gap-2 md:grid-cols-6">
                {[
                  ["RC", "RC"],
                  ["ART", "ART"],
                  ["CAUCION", "Caución"],
                  ["INCENDIO", "Incendio"],
                  ["TRANSPORTE", "Transporte"],
                  ["NINGUNO", "Ninguno"],
                ].map(([v, label]) => {
                  const value = v as AssessmentV2["riesgos"]["seguros"][number];

                  const checked = data.riesgos.seguros.includes(value);
                  return (
                    <label
                      key={v}
                      className="flex items-center gap-2 rounded-xl border border-zinc-200 p-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const curr = data.riesgos.seguros;
                          const value =
                            v as AssessmentV2["riesgos"]["seguros"][number];

                          let next = e.target.checked
                            ? Array.from(new Set([...curr, value]))
                            : curr.filter((x) => x !== value);

                          if (!next.length) next = ["NINGUNO"];
                          if (next.includes("NINGUNO") && next.length > 1)
                            next = ["NINGUNO"];
                          update(["riesgos", "seguros"], next);
                        }}
                      />
                      {label}
                    </label>
                  );
                })}
              </div>
              <Help>
                Si hay empleados y elegís “ninguno”, el motor marcará red flag.
              </Help>
            </Field>

            <Field>
              <Label>Nota de cumplimiento (obligatorio)</Label>
              <Textarea
                rows={5}
                value={data.riesgos.notaCumplimiento}
                onChange={(e) =>
                  update(["riesgos", "notaCumplimiento"], e.target.value)
                }
              />
              <Help>Mínimo 160 caracteres.</Help>
            </Field>

            {data.riesgos.litigios === "SI" && (
              <Field>
                <Label>Detalle de litigios/contingencias (obligatorio)</Label>
                <Textarea
                  rows={5}
                  value={data.riesgos.detalleLitigios ?? ""}
                  onChange={(e) =>
                    update(["riesgos", "detalleLitigios"], e.target.value)
                  }
                />
                <Help>
                  Mínimo 200 caracteres: tipo, estado, monto, impacto.
                </Help>
              </Field>
            )}

            <Field>
              <Label>Nota regulatoria (obligatorio)</Label>
              <Textarea
                rows={4}
                value={data.riesgos.notaRegulatorio}
                onChange={(e) =>
                  update(["riesgos", "notaRegulatorio"], e.target.value)
                }
              />
              <Help>Mínimo 120 caracteres.</Help>
            </Field>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="space-y-6">
            <Field>
              <Label>Objetivo 12 meses (obligatorio)</Label>
              <Textarea
                rows={4}
                value={data.estrategia.objetivo12m}
                onChange={(e) =>
                  update(["estrategia", "objetivo12m"], e.target.value)
                }
              />
              <Help>Mínimo 180 caracteres. Debe incluir métricas.</Help>
            </Field>

            <Field>
              <Label>
                Plan de acción (3 iniciativas concretas) (obligatorio)
              </Label>
              <Textarea
                rows={5}
                value={data.estrategia.planAccion}
                onChange={(e) =>
                  update(["estrategia", "planAccion"], e.target.value)
                }
              />
              <Help>Mínimo 220 caracteres.</Help>
            </Field>

            <div className="grid gap-4 md:grid-cols-3">
              <Field>
                <Label>Presupuesto mensual crecimiento</Label>
                <Input
                  type="number"
                  value={data.estrategia.presupuestoCrecimientoMensual}
                  onChange={(e) =>
                    update(
                      ["estrategia", "presupuestoCrecimientoMensual"],
                      Number(e.target.value),
                    )
                  }
                />
              </Field>

              <Field>
                <Label>Frecuencia de seguimiento</Label>
                <Select
                  value={data.estrategia.frecuenciaSeguimiento}
                  onChange={(e) =>
                    update(
                      ["estrategia", "frecuenciaSeguimiento"],
                      e.target.value,
                    )
                  }
                >
                  <option value="SEMANAL">Semanal</option>
                  <option value="MENSUAL">Mensual</option>
                  <option value="TRIMESTRAL">Trimestral</option>
                  <option value="NUNCA">Nunca</option>
                </Select>
              </Field>

              <Field>
                <Label>Disponibilidad de info</Label>
                <Select
                  value={data.estrategia.disponibilidadInfo}
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

            <Field>
              <Label>
                Inversiones previstas próximos 6 meses (obligatorio)
              </Label>
              <Textarea
                rows={4}
                value={data.estrategia.inversiones6m}
                onChange={(e) =>
                  update(["estrategia", "inversiones6m"], e.target.value)
                }
              />
              <Help>Mínimo 160 caracteres.</Help>
            </Field>

            <Field>
              <Label>Riesgos principales (según el dueño) (obligatorio)</Label>
              <Textarea
                rows={4}
                value={data.estrategia.riesgosDueno}
                onChange={(e) =>
                  update(["estrategia", "riesgosDueno"], e.target.value)
                }
              />
              <Help>Mínimo 200 caracteres.</Help>
            </Field>

            <Field>
              <Label>Mitigaciones actuales (obligatorio)</Label>
              <Textarea
                rows={4}
                value={data.estrategia.mitigaciones}
                onChange={(e) =>
                  update(["estrategia", "mitigaciones"], e.target.value)
                }
              />
              <Help>Mínimo 180 caracteres.</Help>
            </Field>

            <Field>
              <Label>KPIs que mide</Label>
              <div className="grid gap-2 md:grid-cols-4">
                {[
                  ["VENTAS", "Ventas"],
                  ["MARGEN", "Margen"],
                  ["CAJA", "Caja"],
                  ["CAC", "CAC"],
                  ["CHURN", "Churn"],
                  ["NPS", "NPS"],
                  ["RECLAMOS", "Reclamos"],
                  ["ROTACION", "Rotación"],
                  ["OTRO", "Otro"],
                ].map(([v, label]) => {
                  const value = v as AssessmentV2["estrategia"]["kpis"][number];

                  const checked = data.estrategia.kpis.includes(value);
                  return (
                    <label
                      key={v}
                      className="flex items-center gap-2 rounded-xl border border-zinc-200 p-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const curr = data.estrategia.kpis;
                          const value =
                            v as AssessmentV2["estrategia"]["kpis"][number];

                          const next = e.target.checked
                            ? Array.from(new Set([...curr, value]))
                            : curr.filter((x) => x !== value);

                          update(
                            ["estrategia", "kpis"],
                            next.length ? next : ["VENTAS"],
                          );
                        }}
                      />
                      {label}
                    </label>
                  );
                })}
              </div>
            </Field>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="text-sm font-semibold text-zinc-900">
                Confirmaciones
              </div>
              <div className="mt-3 space-y-3 text-sm text-zinc-700">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={data.confirmaciones.datosCorrectos}
                    onChange={(e) =>
                      update(
                        ["confirmaciones", "datosCorrectos"],
                        e.target.checked,
                      )
                    }
                    className="mt-1"
                  />
                  <span>
                    Confirmo que los datos ingresados son correctos a mi leal
                    saber y entender.
                  </span>
                </label>

                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={data.confirmaciones.informeOrientativo}
                    onChange={(e) =>
                      update(
                        ["confirmaciones", "informeOrientativo"],
                        e.target.checked,
                      )
                    }
                    className="mt-1"
                  />
                  <span>
                    Entiendo que el informe es orientativo, no constituye
                    asesoramiento legal/contable y debe complementarse con
                    validaciones profesionales.
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={back}
          disabled={step === 1 || submitting}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm disabled:opacity-50"
        >
          Volver
        </button>

        <div className="flex items-center gap-3">
          {step < 5 ? (
            <button
              onClick={() => {
                const v = validateCurrentStep();
                if (!v.ok) return setError(v.message || "Revisá los campos.");
                setError(null);
                next();
              }}
              disabled={submitting}
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-50"
            >
              Continuar
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={submitting}
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-50"
            >
              {submitting ? "Creando..." : "Crear evaluación"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
