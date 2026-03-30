import Link from "next/link";

const pillars = [
  { name: "Financiero", score: 72, note: "Estable, con señales a monitorear." },
  {
    name: "Comercial",
    score: 61,
    note: "Mayor dependencia y concentración en clientes clave.",
  },
  {
    name: "Operativo",
    score: 58,
    note: "Desvíos recientes que requieren seguimiento prioritario.",
  },
  { name: "Legal", score: 74, note: "Situación general ordenada." },
  {
    name: "Estratégico",
    score: 66,
    note: "Exposición moderada frente a cambios del entorno.",
  },
];

const findings = [
  "Deterioro operativo frente al ciclo anterior.",
  "Aumento de dependencia comercial en pocos vínculos clave.",
  "Señales que justifican seguimiento más cercano en el corto plazo.",
];

const recommendations = [
  "Reforzar revisión operativa en el próximo ciclo.",
  "Monitorear concentración comercial y dependencia de relaciones críticas.",
  "Mantener seguimiento periódico para validar si el deterioro se estabiliza o escala.",
];

const sections = [
  {
    title: "Score general y categoría ejecutiva",
    description:
      "Una lectura rápida del estado general del tercero para ubicar nivel de exposición y prioridad.",
  },
  {
    title: "Radar por 5 pilares",
    description:
      "Visibilidad por dimensión para detectar dónde se concentra la exposición actual.",
  },
  {
    title: "Hallazgos priorizados",
    description:
      "Señales relevantes ordenadas por impacto para que no todo pese lo mismo.",
  },
  {
    title: "Recomendaciones",
    description:
      "Acciones sugeridas para revisar, reforzar o seguir de cerca según el resultado.",
  },
  {
    title: "Comparativa entre ciclos",
    description:
      "Cambios respecto de evaluaciones anteriores para detectar mejoras o deterioros.",
  },
  {
    title: "Salida ejecutiva",
    description:
      "Una síntesis clara para compartir internamente y respaldar decisiones.",
  },
];

export default function InformeModeloPage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="border-b border-zinc-200 bg-gradient-to-b from-white via-sky-50/60 to-white">
        <div className="container-page py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-800">
              Informe modelo
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
              Así se ve una evaluación ejecutiva dentro de EvaluaEmpresa.
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-600">
              Esta vista de referencia muestra el tipo de resultado que recibe
              el usuario: score general, categoría ejecutiva, radar por pilares,
              hallazgos priorizados, recomendaciones y comparativa entre ciclos.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/login" className="btn btn-primary">
                Empezar evaluación
              </Link>
              <Link href="/pricing" className="btn btn-secondary">
                Ver planes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MOCK PRINCIPAL */}
      <section className="py-20">
        <div className="container-page">
          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-[0_10px_40px_rgba(2,132,199,0.08)] md:p-8">
            <div className="flex flex-col gap-6 border-b border-zinc-100 pb-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Evaluación de referencia
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
                  Proveedor Industrial Delta S.A.
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                  Ejemplo de una evaluación estructurada con comparativa frente
                  al ciclo anterior y salida ejecutiva lista para compartir.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-2xl bg-sky-900 px-5 py-4 text-white">
                  <p className="text-xs uppercase tracking-wide text-sky-100">
                    Score general
                  </p>
                  <p className="mt-1 text-3xl font-semibold">68/100</p>
                </div>

                <div className="rounded-2xl border border-sky-200 bg-sky-50 px-5 py-4 text-sky-900">
                  <p className="text-xs uppercase tracking-wide text-sky-700">
                    Categoría ejecutiva
                  </p>
                  <p className="mt-1 text-xl font-semibold">Vulnerable</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              {/* COLUMNA IZQUIERDA */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-sky-100 bg-sky-50/50 p-6">
                  <p className="text-sm font-semibold text-zinc-900">
                    Resumen ejecutivo
                  </p>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">
                    El tercero presenta un nivel de exposición que requiere
                    seguimiento más cercano. El deterioro frente al ciclo
                    anterior se concentra principalmente en pilares operativos y
                    comerciales, con impacto sobre la estabilidad general del
                    caso.
                  </p>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-zinc-900">
                      Comparativa entre ciclos
                    </p>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                      -8 puntos vs ciclo anterior
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        Ciclo anterior
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-zinc-900">
                        76/100
                      </p>
                      <p className="mt-2 text-sm text-zinc-600">Estable</p>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        Ciclo actual
                      </p>
                      <p className="mt-2 text-2xl font-semibold text-zinc-900">
                        68/100
                      </p>
                      <p className="mt-2 text-sm text-zinc-600">Vulnerable</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <p className="text-sm font-semibold text-zinc-900">
                    Hallazgos priorizados
                  </p>

                  <div className="mt-4 space-y-3">
                    {findings.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                      >
                        <p className="text-sm text-zinc-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <p className="text-sm font-semibold text-zinc-900">
                    Recomendaciones
                  </p>

                  <div className="mt-4 space-y-3">
                    {recommendations.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-zinc-200 bg-white p-4"
                      >
                        <p className="text-sm text-zinc-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* COLUMNA DERECHA */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <p className="text-sm font-semibold text-zinc-900">
                    Radar por 5 pilares
                  </p>

                  <div className="mt-5 space-y-4">
                    {pillars.map((pillar) => (
                      <div key={pillar.name}>
                        <div className="mb-2 flex items-center justify-between gap-4">
                          <p className="text-sm font-medium text-zinc-900">
                            {pillar.name}
                          </p>
                          <p className="text-sm font-semibold text-zinc-700">
                            {pillar.score}/100
                          </p>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                          <div
                            className="h-full rounded-full bg-sky-800"
                            style={{ width: `${pillar.score}%` }}
                          />
                        </div>

                        <p className="mt-2 text-xs leading-5 text-zinc-500">
                          {pillar.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <p className="text-sm font-semibold text-zinc-900">
                    Qué entrega la evaluación
                  </p>

                  <div className="mt-4 grid gap-3">
                    {sections.map((section) => (
                      <div
                        key={section.title}
                        className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                      >
                        <p className="text-sm font-medium text-zinc-900">
                          {section.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                          {section.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-sky-100 bg-sky-50/50 p-6">
                  <p className="text-sm font-semibold text-zinc-900">
                    Importante
                  </p>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">
                    Esta es una vista de referencia para entender la estructura
                    del resultado. El contenido real se genera según la
                    información cargada en cada evaluación y su comparación con
                    ciclos previos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POR QUÉ IMPORTA */}
      <section className="border-y border-sky-100 bg-sky-50/40 py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Qué aporta esta salida
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              No es solo un informe: es una forma más clara de respaldar
              decisiones.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              EvaluaEmpresa organiza la evaluación, la vuelve comparable entre
              ciclos y la transforma en una salida ejecutiva que facilita
              seguimiento, revisión y comunicación interna.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
              <p className="text-base font-medium text-zinc-900">
                Más claridad
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                El resultado sintetiza situación actual, señales relevantes y
                prioridad de seguimiento.
              </p>
            </div>

            <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
              <p className="text-base font-medium text-zinc-900">
                Más comparabilidad
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                La comparativa entre ciclos permite detectar deterioros o
                mejoras sin depender de memoria o criterio disperso.
              </p>
            </div>

            <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
              <p className="text-base font-medium text-zinc-900">
                Más respaldo interno
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                La salida ejecutiva ayuda a compartir y justificar mejor cada
                revisión dentro del equipo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gradient-to-b from-white to-sky-50/40 py-20">
        <div className="container-page text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Empezá con una evaluación y mirá el resultado dentro de tu propio
            flujo.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            Pasá de revisiones aisladas a una evaluación más clara, comparable y
            lista para respaldar decisiones.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/login" className="btn btn-primary">
              Empezar evaluación
            </Link>
            <Link href="/pricing" className="btn btn-secondary">
              Ver planes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
