import Link from "next/link";

const pillars = [
  {
    name: "Financiero",
    score: 72,
    note: "Estable, con señales a monitorear.",
  },
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
  {
    name: "Legal",
    score: 74,
    note: "Situación general ordenada.",
  },
  {
    name: "Estratégico",
    score: 66,
    note: "Exposición moderada frente a cambios del entorno.",
  },
];

const findings = [
  {
    title: "Desvíos en consistencia operativa",
    description:
      "Se observan señales que aumentan la exposición y justifican revisión prioritaria.",
  },
  {
    title: "Mayor dependencia comercial",
    description:
      "La concentración actual vuelve más sensible la continuidad ante cambios del tercero.",
  },
  {
    title: "Deterioro respecto del ciclo anterior",
    description:
      "La caída general no se explica por un único factor, sino por señales acumuladas en dimensiones clave.",
  },
];

const recommendations = [
  "Reforzar revisión operativa en el próximo ciclo.",
  "Monitorear concentración comercial y dependencia de relaciones críticas.",
  "Validar si el deterioro reciente se estabiliza o si requiere escalamiento.",
];

const deliverables = [
  {
    title: "Score general y categoría ejecutiva",
    description:
      "Una lectura rápida para ubicar el nivel de exposición actual y su prioridad.",
  },
  {
    title: "Comparativa entre ciclos",
    description:
      "Cambios frente a evaluaciones anteriores para detectar deterioros o mejoras.",
  },
  {
    title: "Radar por 5 pilares",
    description:
      "Visibilidad por dimensión para entender dónde se concentra la fragilidad.",
  },
  {
    title: "Hallazgos priorizados",
    description:
      "Señales ordenadas por impacto para enfocar seguimiento donde más importa.",
  },
  {
    title: "Acción sugerida",
    description:
      "Una recomendación clara para reforzar revisión, sostener seguimiento o escalar.",
  },
  {
    title: "PDF ejecutivo",
    description:
      "Una salida lista para compartir internamente con mejor respaldo y trazabilidad.",
  },
];

const benefits = [
  {
    title: "Más claridad",
    description:
      "El resultado sintetiza situación actual, señales relevantes y prioridad de seguimiento.",
  },
  {
    title: "Más comparabilidad",
    description:
      "La comparativa entre ciclos permite detectar deterioros o mejoras sin depender de memoria o criterio disperso.",
  },
  {
    title: "Más respaldo interno",
    description:
      "La salida ejecutiva ayuda a compartir y justificar mejor cada revisión dentro del equipo.",
  },
];

function ScoreBar({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-zinc-900">{label}</p>
        <p className="text-sm font-semibold text-zinc-700">{value}/100</p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-sky-800"
          style={{ width: `${value}%` }}
        />
      </div>

      <p className="mt-2 text-xs leading-5 text-zinc-500">{note}</p>
    </div>
  );
}

export default function InformeModeloPage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="border-b border-zinc-200 bg-linear-to-b from-white via-sky-50/60 to-white">
        <div className="container-page py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-sky-800 sm:text-xs">
              Informe modelo
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              Así se ve el resultado ejecutivo de una evaluación en
              EvaluaEmpresa.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
              Esta vista de referencia muestra cómo se presenta una evaluación:
              score general, categoría ejecutiva, comparativa entre ciclos,
              pilares, hallazgos priorizados y acción sugerida.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="btn btn-primary w-full sm:w-auto">
                Empezar evaluación
              </Link>
              <Link
                href="/pricing"
                className="btn btn-secondary w-full sm:w-auto"
              >
                Ver planes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* RESUMEN SUPERIOR */}
      <section className="py-10 sm:py-12">
        <div className="container-page">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm md:col-span-2">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Qué estás viendo
              </p>
              <p className="mt-3 text-lg font-semibold text-zinc-900">
                Un ejemplo de salida ejecutiva lista para compartir
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-600">
                No es una captura aislada ni un score suelto. Es una estructura
                completa pensada para ordenar la evaluación, comparar contra el
                ciclo anterior y comunicar mejor qué cambió y qué requiere
                atención.
              </p>
            </div>

            <div className="rounded-3xl border border-sky-100 bg-sky-50/70 p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Incluye
              </p>
              <div className="mt-4 space-y-2 text-sm text-zinc-700">
                <p>• Score y categoría</p>
                <p>• Variación entre ciclos</p>
                <p>• Lectura por 5 pilares</p>
                <p>• Hallazgos priorizados</p>
                <p>• Acción sugerida</p>
                <p>• PDF ejecutivo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOCK PRINCIPAL */}
      <section className="pb-14 sm:pb-16 lg:pb-20">
        <div className="container-page">
          <div className="rounded-[28px] border border-sky-100 bg-white p-4 shadow-[0_10px_40px_rgba(2,132,199,0.08)] sm:p-6 lg:p-8">
            {/* CABECERA DEL MOCK */}
            <div className="flex flex-col gap-5 border-b border-zinc-100 pb-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Evaluación de referencia
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                  Proveedor Industrial Delta S.A.
                </h2>
                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  Ejemplo de una evaluación estructurada con comparativa frente
                  al ciclo anterior y una salida ejecutiva clara para decidir
                  con más criterio.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[430px]">
                <div className="rounded-2xl bg-sky-900 px-5 py-4 text-white">
                  <p className="text-[11px] uppercase tracking-wide text-sky-100">
                    Score
                  </p>
                  <p className="mt-1 text-3xl font-semibold">68/100</p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-wide text-zinc-500">
                    Categoría
                  </p>
                  <p className="mt-1 text-xl font-semibold text-zinc-900">
                    Vulnerable
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
                  <p className="text-[11px] uppercase tracking-wide text-amber-700">
                    Variación
                  </p>
                  <p className="mt-1 text-xl font-semibold text-amber-900">
                    -8 puntos
                  </p>
                </div>
              </div>
            </div>

            {/* CUERPO DEL MOCK */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
              {/* IZQUIERDA */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-sky-100 bg-sky-50/50 p-5 sm:p-6">
                  <p className="text-sm font-semibold text-zinc-900">
                    Resumen ejecutivo
                  </p>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">
                    El tercero presenta un nivel de exposición que requiere
                    seguimiento reforzado. El deterioro frente al ciclo anterior
                    se concentra principalmente en dimensiones operativas y
                    comerciales, con impacto sobre la estabilidad general del
                    caso.
                  </p>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-zinc-900">
                      Comparativa entre ciclos
                    </p>
                    <span className="inline-flex w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800">
                      Deterioro reciente
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

                  <p className="mt-4 text-sm leading-6 text-zinc-600">
                    La caída se explica principalmente por mayor fragilidad
                    operativa y concentración comercial.
                  </p>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6">
                  <p className="text-sm font-semibold text-zinc-900">
                    Hallazgos priorizados
                  </p>

                  <div className="mt-4 space-y-3">
                    {findings.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                      >
                        <p className="text-sm font-semibold text-zinc-900">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6">
                  <p className="text-sm font-semibold text-zinc-900">
                    Acción sugerida
                  </p>

                  <div className="mt-4 space-y-3">
                    {recommendations.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-zinc-200 bg-white p-4"
                      >
                        <p className="text-sm leading-6 text-zinc-700">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* DERECHA */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-semibold text-zinc-900">
                      Lectura por 5 pilares
                    </p>
                    <span className="text-xs text-zinc-500">
                      Vista resumida
                    </span>
                  </div>

                  <div className="mt-5 space-y-5">
                    {pillars.map((pillar) => (
                      <ScoreBar
                        key={pillar.name}
                        label={pillar.name}
                        value={pillar.score}
                        note={pillar.note}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-5 sm:p-6">
                  <p className="text-sm font-semibold text-zinc-900">
                    Qué entrega la evaluación
                  </p>

                  <div className="mt-4 grid gap-3">
                    {deliverables.map((item) => (
                      <div
                        key={item.title}
                        className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                      >
                        <p className="text-sm font-medium text-zinc-900">
                          {item.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-sky-100 bg-sky-50/50 p-5 sm:p-6">
                  <p className="text-sm font-semibold text-zinc-900">
                    Importante
                  </p>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">
                    Esta es una vista de referencia para entender la estructura
                    del resultado. El contenido real cambia según la información
                    cargada, la categoría obtenida y la comparación con ciclos
                    previos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALOR */}
      <section className="border-y border-sky-100 bg-sky-50/40 py-14 sm:py-16 lg:py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Qué aporta esta salida
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              No es solo un informe. Es una forma más clara de respaldar
              decisiones.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              EvaluaEmpresa organiza la evaluación, la vuelve comparable entre
              ciclos y la transforma en una salida ejecutiva que facilita
              seguimiento, revisión y comunicación interna.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {benefits.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm"
              >
                <p className="text-base font-medium text-zinc-900">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-linear-to-b from-white to-sky-50/40 py-14 sm:py-16 lg:py-20">
        <div className="container-page text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Empezá con una evaluación y mirá el resultado dentro de tu propio
            flujo.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            Pasá de revisiones aisladas a una evaluación más clara, comparable y
            lista para respaldar decisiones.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/login" className="btn btn-primary w-full sm:w-auto">
              Empezar evaluación
            </Link>
            <Link
              href="/pricing"
              className="btn btn-secondary w-full sm:w-auto"
            >
              Ver planes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
