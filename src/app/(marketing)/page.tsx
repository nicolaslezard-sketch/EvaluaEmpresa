import Link from "next/link";

const outputs = [
  {
    title: "Score general",
    description:
      "Un puntaje consolidado para entender rápidamente el nivel de exposición actual de cada tercero.",
  },
  {
    title: "Categoría ejecutiva",
    description:
      "Una síntesis clara del estado general para comunicar prioridad y nivel de atención requerido.",
  },
  {
    title: "Radar por 5 pilares",
    description:
      "Visibilidad por dimensión para detectar con rapidez dónde se concentra el deterioro o la fragilidad.",
  },
  {
    title: "Cambios entre ciclos",
    description:
      "Comparativa contra evaluaciones anteriores para ver qué empeoró, qué mejoró y qué sigue igual.",
  },
  {
    title: "Hallazgos priorizados",
    description:
      "Señales relevantes ordenadas por impacto para no perder foco en lo que realmente requiere seguimiento.",
  },
  {
    title: "Acción sugerida",
    description:
      "Orientación concreta para continuar, revisar, reforzar monitoreo o escalar internamente el caso.",
  },
  {
    title: "PDF ejecutivo",
    description:
      "Una salida clara para compartir internamente y respaldar decisiones con mejor trazabilidad.",
  },
];

const faqs = [
  {
    question: "¿EvaluaEmpresa reemplaza el criterio del equipo?",
    answer:
      "No. Lo ordena en una evaluación estructurada, comparable entre ciclos y más fácil de respaldar internamente.",
  },
  {
    question: "¿Qué obtengo al finalizar una evaluación?",
    answer:
      "Score general, categoría ejecutiva, radar por 5 pilares, cambios entre ciclos, hallazgos priorizados, acción sugerida y PDF ejecutivo.",
  },
  {
    question: "¿Sirve para una revisión puntual o para seguimiento continuo?",
    answer:
      "Ambas. Podés usarlo para resolver un caso puntual o para sostener seguimiento recurrente sobre proveedores, clientes o contrapartes.",
  },
  {
    question: "¿Qué tipo de terceros puedo evaluar?",
    answer:
      "Proveedores, clientes, contrapartes u otras relaciones que necesiten una revisión estructurada y comparable en el tiempo.",
  },
  {
    question: "¿Qué diferencia hay entre Free, Pro y Business?",
    answer:
      "Free sirve para conocer el flujo. Pro permite trabajar de forma recurrente con más profundidad. Business suma más capacidad, más histórico y monitoreo más activo.",
  },
  {
    question: "¿Existe una opción sin suscripción?",
    answer:
      "Sí. La evaluación única sirve para resolver una necesidad puntual con resultado completo y PDF ejecutivo, sin pasar a un plan mensual.",
  },
];

const useCases = [
  {
    title: "Revisión de proveedores críticos",
    description:
      "Detectá señales de deterioro y dejá una base más clara para continuidad, revisión o escalamiento.",
  },
  {
    title: "Seguimiento recurrente de clientes o contrapartes",
    description:
      "Compará ciclos y registrá cómo evoluciona cada caso sin depender de memoria, planillas sueltas o criterio informal.",
  },
  {
    title: "Soporte para decisiones internas",
    description:
      "Compartí una salida ejecutiva con score, categoría, hallazgos y señales de cambio para respaldar mejor cada decisión.",
  },
  {
    title: "Orden de cartera evaluada",
    description:
      "Centralizá revisiones y evitá que cada análisis quede perdido en documentos aislados o archivos dispersos.",
  },
];

const audience = [
  "Compras y abastecimiento",
  "Administración y finanzas",
  "Riesgos y control interno",
  "Dirección y seguimiento ejecutivo",
];

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-zinc-200 bg-linear-to-b from-white via-zinc-50 to-white">
        <div className="container-page grid gap-12 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-800">
              Monitoreo y evaluación de terceros
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
              Detectá deterioros antes de que un tercero te genere un problema
              real.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              EvaluaEmpresa ordena la revisión de proveedores, clientes y
              contrapartes con una metodología estructurada, comparativa entre
              ciclos y una salida ejecutiva clara para decidir con más criterio.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-600">
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-900">
                Score general, categoría y radar por 5 pilares
              </span>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-900">
                Cambios entre ciclos y hallazgos priorizados
              </span>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-900">
                Acción sugerida y PDF ejecutivo para compartir
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/login" className="btn btn-primary">
                Empezar evaluación
              </Link>

              <Link href="/informe-modelo" className="btn btn-secondary">
                Ver informe modelo
              </Link>
            </div>

            <p className="mt-4 text-sm text-zinc-500">
              Probalo con una empresa y entendé rápido qué cambió, qué requiere
              atención y qué conviene revisar ahora.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-[0_10px_40px_rgba(2,132,199,0.08)]">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Resumen ejecutivo
                </p>
                <p className="mt-2 text-lg font-semibold text-zinc-900">
                  Proveedor Industrial Delta S.A.
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Evaluación actual comparada contra el ciclo anterior
                </p>
              </div>

              <div className="rounded-2xl bg-sky-900 px-4 py-3 text-white">
                <p className="text-xs uppercase tracking-wide text-zinc-300">
                  Score
                </p>
                <p className="mt-1 text-2xl font-semibold">68/100</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Categoría ejecutiva
                </p>
                <p className="mt-2 text-base font-semibold text-zinc-900">
                  Vulnerable
                </p>
                <p className="mt-2 text-sm text-zinc-600">
                  El caso requiere seguimiento reforzado por deterioro reciente
                  y señales concentradas en dimensiones clave.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Variación vs ciclo anterior
                </p>
                <p className="mt-2 text-base font-semibold text-zinc-900">
                  -8 puntos
                </p>
                <p className="mt-2 text-sm text-zinc-600">
                  La caída se explica principalmente por deterioro operativo y
                  mayor fragilidad comercial.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-zinc-200 p-4">
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Hallazgos priorizados
              </p>

              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-zinc-50 p-3">
                  <p className="text-sm font-medium text-zinc-900">
                    Desvíos en consistencia operativa
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Se observan señales que aumentan la exposición y justifican
                    revisión prioritaria.
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-3">
                  <p className="text-sm font-medium text-zinc-900">
                    Mayor dependencia comercial
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    La concentración actual vuelve más sensible la continuidad
                    ante cambios del tercero.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section id="metodologia" className="bg-white py-20">
        <div className="container-page grid gap-12 md:grid-cols-[1fr_1fr] md:items-start">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              El problema
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Evaluar terceros sin una estructura común suele terminar en
              revisiones difíciles de comparar y decisiones poco defendibles.
            </h2>

            <p className="mt-5 text-base leading-7 text-zinc-600">
              Cuando cada evaluación depende de planillas, documentos sueltos o
              criterios cambiantes, se vuelve más difícil detectar deterioros,
              priorizar señales relevantes y justificar por qué continuar,
              revisar o escalar un caso.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="card p-6">
              <p className="text-sm font-medium text-zinc-900">
                Evaluaciones dispersas y poco comparables
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Cada revisión queda armada distinto y cuesta sostener un
                criterio común entre casos y entre ciclos.
              </p>
            </div>

            <div className="card p-6">
              <p className="text-sm font-medium text-zinc-900">
                Poco seguimiento entre un ciclo y otro
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                No siempre queda claro qué empeoró, qué mejoró y dónde conviene
                intervenir antes de que el problema crezca.
              </p>
            </div>

            <div className="card p-6">
              <p className="text-sm font-medium text-zinc-900">
                Menos claridad al momento de decidir
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Sin una salida ejecutiva consistente, respaldar internamente una
                decisión se vuelve más difícil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUÉ PODÉS DETECTAR */}
      <section className="border-y border-sky-100 bg-sky-50/40 py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Qué podés detectar
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Cada evaluación te deja una lectura clara del estado actual y de
              su evolución.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              No es solo un score. Es una forma más ordenada de ver exposición,
              detectar cambios, priorizar señales y dejar mejor soporte para
              decidir.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {outputs.map((item) => (
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

      {/* CÓMO FUNCIONA */}
      <section className="bg-white py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Cómo funciona
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Un proceso simple para ordenar evaluaciones y seguir su evolución
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Desde la carga inicial hasta la salida ejecutiva, todo queda más
              comparable y fácil de revisar.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="card p-6">
              <p className="text-sm font-medium text-sky-800">Paso 1</p>
              <p className="mt-3 text-lg font-semibold text-zinc-900">
                Creá la empresa
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Registrá el tercero que querés seguir y centralizá su evaluación
                en un solo lugar.
              </p>
            </div>

            <div className="card p-6">
              <p className="text-sm font-medium text-sky-800">Paso 2</p>
              <p className="mt-3 text-lg font-semibold text-zinc-900">
                Completá la evaluación
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Cargá la revisión por pilares con una estructura consistente
                para reflejar la situación actual con más criterio.
              </p>
            </div>

            <div className="card p-6">
              <p className="text-sm font-medium text-sky-800">Paso 3</p>
              <p className="mt-3 text-lg font-semibold text-zinc-900">
                Detectá cambios y decidí mejor
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Recibí score, categoría, cambios entre ciclos, hallazgos
                priorizados y una salida ejecutiva lista para compartir.
              </p>
            </div>
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-6 text-zinc-500">
            No reemplaza tu criterio: lo ordena, lo vuelve comparable y deja más
            trazabilidad sobre lo que cambió.
          </p>
        </div>
      </section>

      {/* CASOS DE USO */}
      <section className="border-y border-sky-100 bg-sky-50/40 py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Casos de uso
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Casos donde una evaluación estructurada realmente hace diferencia
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {useCases.map((item) => (
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

      {/* PARA QUIÉN */}
      <section className="bg-white py-20">
        <div className="container-page grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Para quién sirve
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Pensado para quienes necesitan evaluar terceros con más orden y
              menos criterio informal
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              EvaluaEmpresa ayuda a aplicar una estructura común en cada
              revisión, comparar resultados entre ciclos y dejar trazabilidad
              sobre qué cambió y por qué un caso requiere atención.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {audience.map((item) => (
              <div key={item} className="card p-6">
                <p className="text-sm font-medium text-zinc-900">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING RESUMIDO */}
      <section className="border-y border-zinc-200 bg-slate-50 py-20">
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Planes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Elegí si querés resolver un caso puntual o sostener seguimiento
              recurrente
            </h2>
            <p className="mt-4 text-base leading-8 text-zinc-600">
              <span className="font-semibold text-zinc-900">Free</span> sirve
              para conocer el flujo.{" "}
              <span className="font-semibold text-sky-900">Pro</span> permite
              trabajar de forma recurrente con más profundidad.{" "}
              <span className="font-semibold text-emerald-800">Business</span>{" "}
              suma más capacidad, más histórico y monitoreo más activo.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-medium text-zinc-900">Free</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
                Para conocer cómo funciona
              </p>
              <p className="mt-3 text-base leading-7 text-zinc-600">
                Probá la metodología y completá una primera evaluación.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                <li>
                  •{" "}
                  <span className="font-semibold text-zinc-900">
                    1 empresa activa
                  </span>
                </li>
                <li>
                  •{" "}
                  <span className="font-semibold text-zinc-900">
                    1 evaluación total
                  </span>
                </li>
                <li>• Vista limitada del resultado</li>
              </ul>

              <Link href="/pricing" className="btn btn-secondary mt-8 w-full">
                Ver planes
              </Link>
            </div>

            <div className="rounded-3xl border border-sky-200 bg-white p-7 shadow-[0_12px_32px_rgba(2,132,199,0.10)]">
              <p className="text-sm font-semibold text-sky-900">Pro</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
                Para seguimiento recurrente
              </p>
              <p className="mt-3 text-base leading-7 text-zinc-600">
                Más empresas, más evaluaciones y comparativa entre ciclos para
                usarlo de verdad.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                <li>
                  •{" "}
                  <span className="font-semibold text-zinc-900">
                    Evaluaciones ilimitadas
                  </span>
                </li>
                <li>
                  •{" "}
                  <span className="font-semibold text-zinc-900">
                    Histórico completo
                  </span>
                </li>
                <li>
                  •{" "}
                  <span className="font-semibold text-zinc-900">
                    PDF ejecutivo
                  </span>
                </li>
              </ul>

              <Link href="/pricing" className="btn btn-primary mt-8 w-full">
                Ver planes
              </Link>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-white p-7 shadow-[0_12px_32px_rgba(16,185,129,0.08)]">
              <p className="text-sm font-semibold text-emerald-800">Business</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
                Para mayor volumen y monitoreo activo
              </p>
              <p className="mt-3 text-base leading-7 text-zinc-600">
                Más capacidad, más tendencia histórica y alertas para una
                operación más continua.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                <li>
                  •{" "}
                  <span className="font-semibold text-zinc-900">
                    Hasta 15 empresas
                  </span>
                </li>
                <li>
                  •{" "}
                  <span className="font-semibold text-zinc-900">
                    Tendencia extendida
                  </span>
                </li>
                <li>
                  •{" "}
                  <span className="font-semibold text-zinc-900">
                    Alertas automáticas
                  </span>
                </li>
              </ul>

              <Link href="/pricing" className="btn btn-secondary mt-8 w-full">
                Ver planes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Preguntas frecuentes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Lo importante antes de empezar
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Respuestas rápidas para entender cómo encaja EvaluaEmpresa en una
              evaluación puntual o en un seguimiento más continuo de terceros.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.question} className="card p-6">
                <p className="text-base font-medium text-zinc-900">
                  {faq.question}
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section id="cta-final" className="bg-white py-20">
        <div className="container-page text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Pasá de revisiones aisladas a un seguimiento más claro y comparable.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            Ordená cómo evaluás terceros, detectá deterioros entre ciclos y
            respaldá mejor cada decisión con una salida ejecutiva consistente.
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
