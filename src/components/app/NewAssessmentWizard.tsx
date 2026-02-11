"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type FormData = {
  email: string;

  empresa: {
    nombre: string;
    cuit?: string;
    rubro: string;
    ubicacion: string;
    tamaño: string;
    antiguedad: string;
  };
  operacion: {
    tipo: string;
    monto: string;
    frecuencia: string;
    urgencia: string;
  };
  experiencia: {
    conoce: string;
    operoAntes: string;
    resultadoPrevio?: string;
    problemas?: string[];
  };
  contexto: {
    formaPago: string;
    plazo: string;
    adelantos: string;
    observaciones?: string;
  };
  confirmaciones: {
    datosCorrectos: boolean;
    informeOrientativo: boolean;
  };
};

const initialData: FormData = {
  email: "",
  empresa: {
    nombre: "",
    cuit: "",
    rubro: "",
    ubicacion: "",
    tamaño: "",
    antiguedad: "",
  },
  operacion: { tipo: "", monto: "", frecuencia: "", urgencia: "" },
  experiencia: {
    conoce: "",
    operoAntes: "",
    resultadoPrevio: "",
    problemas: [],
  },
  contexto: { formaPago: "", plazo: "", adelantos: "", observaciones: "" },
  confirmaciones: { datosCorrectos: false, informeOrientativo: false },
};

export default function NewAssessmentWizard() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function next() {
    setStep((s) => Math.min(s + 1, 5));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function update(path: string[], value: unknown) {
    setData((prev) => {
      const copy = structuredClone(prev) as any;
      let obj = copy;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = value;
      return copy;
    });
  }

  async function submit() {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Error creando evaluación");

      router.push(`/app/analysis/${json.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Nueva evaluación
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Completá información estructurada. El informe es orientativo y está
          diseñado para decisiones comerciales.
        </p>
      </div>

      <div className="card p-8">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Paso {step} de 5
          </p>
          <div className="h-2 w-40 rounded-full bg-zinc-100">
            <div
              className="h-2 rounded-full bg-zinc-900"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="label">Email</label>
              <input
                className="input mt-2"
                value={data.email}
                onChange={(e) => update(["email"], e.target.value)}
                placeholder="tu@email.com"
              />
              <p className="hint mt-2">
                Se usa para identificar la evaluación.
              </p>
            </div>

            <div>
              <label className="label">Empresa a evaluar</label>
              <input
                className="input mt-2"
                value={data.empresa.nombre}
                onChange={(e) => update(["empresa", "nombre"], e.target.value)}
                placeholder="Nombre legal o comercial"
              />
            </div>

            <div>
              <label className="label">CUIT (opcional)</label>
              <input
                className="input mt-2"
                value={data.empresa.cuit || ""}
                onChange={(e) => update(["empresa", "cuit"], e.target.value)}
                placeholder="30-XXXXXXXX-X"
              />
            </div>

            <div>
              <label className="label">Rubro</label>
              <input
                className="input mt-2"
                value={data.empresa.rubro}
                onChange={(e) => update(["empresa", "rubro"], e.target.value)}
                placeholder="Ej: Construcción, Logística, Servicios"
              />
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="label">Ubicación</label>
              <input
                className="input mt-2"
                value={data.empresa.ubicacion}
                onChange={(e) =>
                  update(["empresa", "ubicacion"], e.target.value)
                }
                placeholder="CABA / PBA / Interior"
              />
            </div>
            <div>
              <label className="label">Tamaño</label>
              <input
                className="input mt-2"
                value={data.empresa.tamaño}
                onChange={(e) => update(["empresa", "tamaño"], e.target.value)}
                placeholder="Micro / Pyme / Mediana"
              />
            </div>
            <div>
              <label className="label">Antigüedad</label>
              <input
                className="input mt-2"
                value={data.empresa.antiguedad}
                onChange={(e) =>
                  update(["empresa", "antiguedad"], e.target.value)
                }
                placeholder="Ej: 3 años"
              />
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="label">Tipo de operación</label>
              <input
                className="input mt-2"
                value={data.operacion.tipo}
                onChange={(e) => update(["operacion", "tipo"], e.target.value)}
                placeholder="Proveedor / Socio / Inversión"
              />
            </div>
            <div>
              <label className="label">Monto estimado</label>
              <input
                className="input mt-2"
                value={data.operacion.monto}
                onChange={(e) => update(["operacion", "monto"], e.target.value)}
                placeholder="Ej: ARS 5.000.000"
              />
            </div>
            <div>
              <label className="label">Frecuencia</label>
              <input
                className="input mt-2"
                value={data.operacion.frecuencia}
                onChange={(e) =>
                  update(["operacion", "frecuencia"], e.target.value)
                }
                placeholder="Única / mensual / trimestral"
              />
            </div>
            <div>
              <label className="label">Urgencia</label>
              <input
                className="input mt-2"
                value={data.operacion.urgencia}
                onChange={(e) =>
                  update(["operacion", "urgencia"], e.target.value)
                }
                placeholder="Baja / Media / Alta"
              />
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="label">¿Conocés a la empresa?</label>
              <input
                className="input mt-2"
                value={data.experiencia.conoce}
                onChange={(e) =>
                  update(["experiencia", "conoce"], e.target.value)
                }
                placeholder="Sí / No / Parcial"
              />
            </div>
            <div>
              <label className="label">¿Operaste antes?</label>
              <input
                className="input mt-2"
                value={data.experiencia.operoAntes}
                onChange={(e) =>
                  update(["experiencia", "operoAntes"], e.target.value)
                }
                placeholder="Sí / No"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Observaciones</label>
              <textarea
                className="input mt-2 min-h-[120px]"
                value={data.contexto.observaciones || ""}
                onChange={(e) =>
                  update(["contexto", "observaciones"], e.target.value)
                }
                placeholder="Información relevante para contextualizar la evaluación"
              />
            </div>
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <p className="text-sm font-medium text-zinc-900">Declaraciones</p>
              <p className="mt-2 text-sm text-zinc-600">
                Para emitir un informe serio, necesitamos aceptación explícita.
              </p>

              <div className="mt-4 space-y-3">
                <label className="flex items-start gap-3 text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={data.confirmaciones.datosCorrectos}
                    onChange={(e) =>
                      update(
                        ["confirmaciones", "datosCorrectos"],
                        e.target.checked,
                      )
                    }
                  />
                  Declaro que la información ingresada es veraz a mi leal saber
                  y entender.
                </label>

                <label className="flex items-start gap-3 text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={data.confirmaciones.informeOrientativo}
                    onChange={(e) =>
                      update(
                        ["confirmaciones", "informeOrientativo"],
                        e.target.checked,
                      )
                    }
                  />
                  Comprendo que el informe es orientativo y no constituye
                  asesoramiento profesional.
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 1 || submitting}
            className="btn btn-secondary"
          >
            Volver
          </button>

          {step < 5 ? (
            <button
              onClick={next}
              disabled={submitting}
              className="btn btn-primary"
            >
              Continuar
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={
                submitting ||
                !data.confirmaciones.datosCorrectos ||
                !data.confirmaciones.informeOrientativo
              }
              className="btn btn-primary"
            >
              {submitting ? "Creando…" : "Crear evaluación"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
