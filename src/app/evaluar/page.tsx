"use client";

import { useState } from "react";

type FormData = {
  email: string; // 👈 OBLIGATORIO

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
  operacion: {
    tipo: "",
    monto: "",
    frecuencia: "",
    urgencia: "",
  },
  experiencia: {
    conoce: "",
    operoAntes: "",
    resultadoPrevio: "",
    problemas: [],
  },
  contexto: {
    formaPago: "",
    plazo: "",
    adelantos: "",
    observaciones: "",
  },
  confirmaciones: {
    datosCorrectos: false,
    informeOrientativo: false,
  },
};

export default function EvaluarPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialData);

  function next() {
    setStep((s) => Math.min(s + 1, 5));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function update(path: string[], value: unknown) {
    setData((prev) => {
      const copy = structuredClone(prev);

      let obj: Record<string, unknown> = copy as Record<string, unknown>;

      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]] as Record<string, unknown>;
      }

      obj[path[path.length - 1]] = value;

      return copy;
    });
  }
  const [loading, setLoading] = useState(false);

  return (
    <main className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-semibold">
        Generar informe de riesgo empresarial
      </h1>

      <p className="mt-2 text-sm text-zinc-600">Paso {step} de 5</p>

      <div className="mt-10 rounded-xl border p-6">
        {step === 1 && (
          <>
            <h2 className="text-xl font-medium">Datos de la empresa</h2>

            <div className="mt-6 grid gap-4">
              <input
                placeholder="Nombre de la empresa"
                className="input"
                value={data.empresa.nombre}
                onChange={(e) => update(["empresa", "nombre"], e.target.value)}
              />
              <input
                type="email"
                placeholder="Email de contacto"
                className="input"
                value={data.email}
                onChange={(e) => update(["email"], e.target.value)}
              />

              <input
                placeholder="CUIT (opcional)"
                className="input"
                value={data.empresa.cuit}
                onChange={(e) => update(["empresa", "cuit"], e.target.value)}
              />

              <input
                placeholder="Rubro / actividad"
                className="input"
                value={data.empresa.rubro}
                onChange={(e) => update(["empresa", "rubro"], e.target.value)}
              />

              <input
                placeholder="Provincia / país"
                className="input"
                value={data.empresa.ubicacion}
                onChange={(e) =>
                  update(["empresa", "ubicacion"], e.target.value)
                }
              />

              <select
                className="input"
                value={data.empresa.tamaño}
                onChange={(e) => update(["empresa", "tamaño"], e.target.value)}
              >
                <option value="">Tamaño de la empresa</option>
                <option>Micro</option>
                <option>Pyme</option>
                <option>Mediana</option>
                <option>Grande</option>
              </select>

              <select
                className="input"
                value={data.empresa.antiguedad}
                onChange={(e) =>
                  update(["empresa", "antiguedad"], e.target.value)
                }
              >
                <option value="">Antigüedad</option>
                <option>Menos de 1 año</option>
                <option>1 a 3 años</option>
                <option>Más de 3 años</option>
              </select>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-medium">Operación</h2>

            <div className="mt-6 grid gap-4">
              <select
                className="input"
                value={data.operacion.tipo}
                onChange={(e) => update(["operacion", "tipo"], e.target.value)}
              >
                <option value="">Tipo de operación</option>
                <option>Contratar</option>
                <option>Vender</option>
                <option>Asociarse</option>
                <option>Invertir</option>
                <option>Alquilar</option>
              </select>

              <input
                placeholder="Monto estimado"
                className="input"
                value={data.operacion.monto}
                onChange={(e) => update(["operacion", "monto"], e.target.value)}
              />

              <select
                className="input"
                value={data.operacion.frecuencia}
                onChange={(e) =>
                  update(["operacion", "frecuencia"], e.target.value)
                }
              >
                <option value="">Frecuencia</option>
                <option>Única</option>
                <option>Mensual</option>
                <option>Continua</option>
              </select>

              <select
                className="input"
                value={data.operacion.urgencia}
                onChange={(e) =>
                  update(["operacion", "urgencia"], e.target.value)
                }
              >
                <option value="">Urgencia</option>
                <option>Baja</option>
                <option>Media</option>
                <option>Alta</option>
              </select>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-medium">Experiencia previa</h2>

            <div className="mt-6 grid gap-4">
              <select
                className="input"
                value={data.experiencia.conoce}
                onChange={(e) =>
                  update(["experiencia", "conoce"], e.target.value)
                }
              >
                <option value="">¿La conocés?</option>
                <option>Sí</option>
                <option>No</option>
              </select>

              <select
                className="input"
                value={data.experiencia.operoAntes}
                onChange={(e) =>
                  update(["experiencia", "operoAntes"], e.target.value)
                }
              >
                <option value="">¿Operaste antes?</option>
                <option>Sí</option>
                <option>No</option>
              </select>

              <select
                className="input"
                value={data.experiencia.resultadoPrevio}
                onChange={(e) =>
                  update(["experiencia", "resultadoPrevio"], e.target.value)
                }
              >
                <option value="">Resultado previo</option>
                <option>Buena</option>
                <option>Regular</option>
                <option>Mala</option>
              </select>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-xl font-medium">Pago y contexto</h2>

            <div className="mt-6 grid gap-4">
              <input
                placeholder="Forma de pago"
                className="input"
                value={data.contexto.formaPago}
                onChange={(e) =>
                  update(["contexto", "formaPago"], e.target.value)
                }
              />

              <input
                placeholder="Plazo"
                className="input"
                value={data.contexto.plazo}
                onChange={(e) => update(["contexto", "plazo"], e.target.value)}
              />

              <input
                placeholder="Adelantos"
                className="input"
                value={data.contexto.adelantos}
                onChange={(e) =>
                  update(["contexto", "adelantos"], e.target.value)
                }
              />

              <textarea
                placeholder="Observaciones (opcional)"
                className="input h-24"
                value={data.contexto.observaciones}
                onChange={(e) =>
                  update(["contexto", "observaciones"], e.target.value)
                }
              />
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="text-xl font-medium">Confirmación</h2>

            <div className="mt-6 space-y-4 text-sm">
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={data.confirmaciones.datosCorrectos}
                  onChange={(e) =>
                    update(
                      ["confirmaciones", "datosCorrectos"],
                      e.target.checked,
                    )
                  }
                />
                Los datos ingresados son correctos según mi conocimiento.
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={data.confirmaciones.informeOrientativo}
                  onChange={(e) =>
                    update(
                      ["confirmaciones", "informeOrientativo"],
                      e.target.checked,
                    )
                  }
                />
                Entiendo que este informe es orientativo y no constituye
                asesoramiento profesional.
              </label>
            </div>
          </>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        {step > 1 && (
          <button onClick={back} className="rounded-lg border px-4 py-2">
            Volver
          </button>
        )}

        {step < 5 ? (
          <button
            onClick={next}
            className="rounded-lg bg-black px-6 py-2 text-white"
          >
            Continuar
          </button>
        ) : (
          <button
            disabled={
              loading ||
              !data.confirmaciones.datosCorrectos ||
              !data.confirmaciones.informeOrientativo
            }
            onClick={async () => {
              setLoading(true);

              const res = await fetch("/api/report", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              });

              setLoading(false);

              if (!res.ok) {
                alert("Error al guardar el formulario");
                return;
              }

              const json = await res.json();

              // Próximo paso: pago
              const pref = await fetch("/api/mercadopago/preference", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ reportId: json.id }),
              });

              if (!pref.ok) {
                alert("Error al iniciar el pago");
                return;
              }

              const { init_point } = await pref.json();

              window.location.href = init_point;
            }}
            className="rounded-lg bg-black px-6 py-2 text-white disabled:opacity-40"
          >
            {loading ? "Guardando..." : "Continuar al pago"}
          </button>
        )}
      </div>
    </main>
  );
}
