import Link from "next/link";

const pillars = [
  {
    name: "Financiero",
    score: "74/100",
    note: "Solvencia aceptable, con señales a seguir.",
  },
  {
    name: "Comercial",
    score: "68/100",
    note: "Mayor sensibilidad por dependencia comercial.",
  },
  {
    name: "Operativo",
    score: "63/100",
    note: "Desvíos recientes que justifican seguimiento.",
  },
  {
    name: "Legal",
    score: "79/100",
    note: "Sin alertas mayores en este ciclo.",
  },
  {
    name: "Estratégico",
    score: "71/100",
    note: "Base razonable, con margen de adaptación.",
  },
];

const findings = [
  "Se detecta deterioro operativo respecto del ciclo anterior.",
  "La exposición comercial aumentó por mayor dependencia.",
  "El caso requiere monitoreo reforzado, no escalamiento inmediato.",
];

const outputs = [
  "Score general",
  "Categoría ejecutiva",
  "Radar por 5 pilares",
  "Cambios entre ciclos",
  "Hallazgos priorizados",
  "Acción sugerida",
  "PDF ejecutivo",
];

export default function DemoPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-zinc-200 bg-linear-to-b from-white via-sky-50/50 to-white">
        <div className="container-page max-w-4xl py-20">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
            Demo
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
            Así se ve una evaluación estructurada en EvaluaEmpresa
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
            Esta demo muestra el tipo de salida que obtenés al finalizar una
            evaluación: score general, lectura por pilares, cambios entre ciclos
            y una síntesis ejecutiva más clara para decidir.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-100 pb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                    Empresa evaluada
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-zinc-900">
                    Industrial Delta S.A.
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    Ejemplo ilustrativo de salida ejecutiva
                  </p>
                </div>

                <div className="rounded-2xl bg-sky-900 px-5 py-4 text-white">
                  <p className="text-xs uppercase tracking-wide text-zinc-300">
                    Score general
                  </p>
                  <p className="mt-1 text-3xl font-semibold">72.4</p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Categoría ejecutiva
                  </p>
                  <p className="mt-2 text-lg font-semibold text-zinc-900">
                    Estable
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    El caso muestra una base aceptable, pero con señales que
                    justifican seguimiento en algunos pilares.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Variación vs ciclo anterior
                  </p>
                  <p className="mt-2 text-lg font-semibold text-zinc-900">
                    -5.6 puntos
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    El cambio se explica principalmente por deterioro operativo
                    y mayor fragilidad comercial.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-zinc-200 p-5">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Hallazgos priorizados
                </p>

                <div className="mt-4 space-y-3">
                  {findings.map((item) => (
                    <div key={item} className="rounded-2xl bg-zinc-50 p-4">
                      <p className="text-sm leading-6 text-zinc-700">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
                <p className="text-xs uppercase tracking-wide text-emerald-700">
                  Acción sugerida
                </p>
                <p className="mt-2 text-base font-semibold text-zinc-900">
                  Continuar con monitoreo reforzado
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  No se observa necesidad de escalar el caso de inmediato, pero
                  sí conviene sostener seguimiento más cercano en próximos
                  ciclos.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
                  Lectura por pilares
                </p>

                <div className="mt-5 space-y-4">
                  {pillars.map((pillar) => (
                    <div
                      key={pillar.name}
                      className="rounded-2xl border border-zinc-200 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-medium text-zinc-900">
                          {pillar.name}
                        </p>
                        <p className="text-sm font-semibold text-zinc-900">
                          {pillar.score}
                        </p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-zinc-600">
                        {pillar.note}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-sky-100 bg-sky-50/50 p-8">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
                  Qué incluye una evaluación
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {outputs.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl bg-white p-4 shadow-sm"
                    >
                      <p className="text-sm font-medium text-zinc-900">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-3xl border border-zinc-200 bg-zinc-50 p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Esta demo es una muestra simplificada
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
              En el producto real, cada evaluación se integra con histórico,
              comparativa entre ciclos, alertas y salida ejecutiva descargable
              para seguimiento más consistente de terceros.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/login" className="btn btn-primary">
                Generar evaluación real
              </Link>

              <Link href="/informe-modelo" className="btn btn-secondary">
                Ver informe modelo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
