import Link from "next/link";

const problems = [
  {
    title: "Evaluaciones dispersas",
    description:
      "Cuando cada revisión queda en planillas, mails o documentos sueltos, sostener criterio común se vuelve difícil.",
  },
  {
    title: "Poca comparabilidad entre ciclos",
    description:
      "Sin una estructura estable, cuesta ver con claridad qué empeoró, qué mejoró y qué sigue igual.",
  },
  {
    title: "Decisiones menos defendibles",
    description:
      "Si el resultado no termina en una salida ejecutiva consistente, justificar continuidad, revisión o escalamiento cuesta más.",
  },
];

const outputs = [
  {
    title: "Score general",
    description:
      "Una lectura rápida del nivel de exposición actual del tercero.",
  },
  {
    title: "Categoría ejecutiva",
    description:
      "Una síntesis clara para comunicar prioridad y nivel de atención requerido.",
  },
  {
    title: "Radar por 5 pilares",
    description:
      "Visibilidad por dimensión para detectar dónde se concentra la fragilidad.",
  },
  {
    title: "Comparativa entre ciclos",
    description:
      "Cambios frente a evaluaciones anteriores para detectar deterioros o mejoras.",
  },
  {
    title: "Hallazgos priorizados",
    description:
      "Señales ordenadas por impacto para enfocar seguimiento en lo que más importa.",
  },
  {
    title: "Acción sugerida y PDF ejecutivo",
    description:
      "Una salida concreta para compartir internamente y respaldar mejor cada decisión.",
  },
];

const useCases = [
  {
    title: "Revisión de proveedores críticos",
    description:
      "Ordená continuidad, revisión o escalamiento con una metodología consistente.",
  },
  {
    title: "Seguimiento de clientes o contrapartes",
    description:
      "Detectá cambios entre ciclos sin depender de memoria, criterio informal o archivos dispersos.",
  },
  {
    title: "Soporte para decisiones internas",
    description:
      "Compartí una salida ejecutiva clara con score, hallazgos y señales de cambio.",
  },
  {
    title: "Monitoreo de cartera evaluada",
    description:
      "Centralizá evaluaciones y mantené trazabilidad sobre qué cambió en cada caso.",
  },
];

const audience = [
  "Compras y abastecimiento",
  "Administración y finanzas",
  "Riesgos y control interno",
  "Dirección y seguimiento ejecutivo",
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
      "Score general, categoría ejecutiva, radar por 5 pilares, comparativa entre ciclos, hallazgos priorizados, acción sugerida y PDF ejecutivo.",
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
      "Free sirve para conocer el flujo. Pro permite trabajar de forma recurrente con más profundidad. Business suma más capacidad, más histórico y alertas persistidas.",
  },
  {
    question: "¿Existe una opción sin suscripción?",
    answer:
      "Sí. La evaluación única sirve para resolver una necesidad puntual con resultado completo y PDF ejecutivo, sin pasar a un plan mensual.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white">
      <section className="border-b border-zinc-200 bg-linear-to-b from-white via-zinc-50 to-white">
        <div className="container-page py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-sky-800 sm:text-xs">
              Monitoreo y evaluación de terceros
            </p>

            <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-7xl">
              Detectá deterioros antes de que un tercero te genere un problema
              real.
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
              EvaluaEmpresa ordena la revisión de proveedores, clientes y
              contrapartes con una metodología estructurada, comparativa entre
              ciclos y una salida ejecutiva clara para decidir con más criterio.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-900">
                Score general, categoría y radar por 5 pilares
              </span>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-900">
                Cambios entre ciclos y hallazgos priorizados
              </span>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-900">
                Acción sugerida y PDF ejecutivo
              </span>
            </div>

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

            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
              Probalo con una empresa y entendé rápido qué cambió, qué requiere
              atención y qué conviene revisar ahora.
            </p>
          </div>
        </div>
      </section>

      <section id="metodologia" className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              El problema
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
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

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {problems.map((item) => (
              <div key={item.title} className="card p-6">
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

      <section className="border-y border-sky-100 bg-sky-50/40 py-14 sm:py-16 lg:py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Qué obtenés en cada evaluación
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
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

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Cómo funciona
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
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
                Registrá el tercero que querés evaluar y centralizá su
                seguimiento en un solo lugar.
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
                Recibí score, categoría, comparativa entre ciclos, hallazgos
                priorizados y un PDF ejecutivo listo para compartir.
              </p>
            </div>
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-6 text-zinc-500">
            No reemplaza tu criterio: lo ordena, lo vuelve comparable y deja más
            trazabilidad sobre lo que cambió.
          </p>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 py-14 sm:py-16 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Informe modelo
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              El resultado completo merece su propia página, no el hero.
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Por eso el home explica el valor del producto y el informe modelo
              muestra cómo se ve la salida final: score, categoría ejecutiva,
              radar por pilares, hallazgos, recomendaciones y comparativa entre
              ciclos.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/informe-modelo"
                className="btn btn-primary w-full sm:w-auto"
              >
                Ver informe modelo
              </Link>
              <Link
                href="/login"
                className="btn btn-secondary w-full sm:w-auto"
              >
                Empezar evaluación
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Lectura general
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-900">
                  Score + categoría ejecutiva
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Ubicás rápido el nivel de exposición y la prioridad del caso.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Evolución
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-900">
                  Comparativa entre ciclos
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Entendés qué cambió y si el riesgo se está deteriorando o
                  estabilizando.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Profundidad
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-900">
                  Radar por 5 pilares
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Detectás en qué dimensiones se concentra la fragilidad.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Acción
                </p>
                <p className="mt-2 text-sm font-semibold text-zinc-900">
                  Hallazgos + recomendación
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-600">
                  Pasás de datos sueltos a una decisión más clara y comunicable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Casos de uso
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
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

      <section className="border-y border-sky-100 bg-sky-50/40 py-14 sm:py-16 lg:py-20">
        <div className="container-page grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Para quién sirve
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Pensado para equipos que necesitan evaluar terceros con más orden
              y menos criterio informal
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

      <section id="planes" className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Planes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Elegí el nivel de seguimiento que necesitás para tu cartera
            </h2>
            <p className="mt-4 text-base leading-8 text-zinc-600">
              <span className="font-semibold text-zinc-900">Free</span> sirve
              para conocer el flujo.{" "}
              <span className="font-semibold text-sky-900">Pro</span> está
              pensado para seguimiento recurrente con comparativa entre ciclos.{" "}
              <span className="font-semibold text-emerald-800">Business</span>{" "}
              suma más capacidad, más histórico y alertas persistidas para un
              monitoreo más activo.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-medium text-zinc-900">Free</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
                Para conocer cómo funciona
              </p>
              <p className="mt-3 text-base leading-7 text-zinc-600">
                Ideal para entender la metodología y probar el flujo con una
                primera empresa.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                <li>• 1 empresa</li>
                <li>• Vista parcial del resultado</li>
                <li>• Ideal para conocer el sistema</li>
              </ul>

              <Link href="/pricing" className="btn btn-secondary mt-8 w-full">
                Ver planes
              </Link>
            </div>

            <div className="rounded-3xl border border-sky-200 bg-white p-7 shadow-[0_12px_32px_rgba(2,132,199,0.10)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-sky-900">Pro</p>
                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-900">
                  Más elegido
                </span>
              </div>

              <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
                Para seguimiento completo de cartera chica
              </p>
              <p className="mt-3 text-base leading-7 text-zinc-600">
                Evaluá, compará ciclos y compartí resultados con una salida
                ejecutiva clara.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                <li>• Hasta 3 empresas</li>
                <li>• Reporte completo y PDF ejecutivo</li>
                <li>• Comparativa entre ciclos</li>
                <li>• Tendencia histórica de hasta 3 ciclos</li>
              </ul>

              <Link href="/pricing" className="btn btn-primary mt-8 w-full">
                Ver planes
              </Link>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-white p-7 shadow-[0_12px_32px_rgba(16,185,129,0.08)]">
              <p className="text-sm font-semibold text-emerald-800">Business</p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
                Para monitoreo continuo de cartera más amplia
              </p>
              <p className="mt-3 text-base leading-7 text-zinc-600">
                Sumá más capacidad, más memoria histórica y alertas persistidas
                para seguir riesgos que no se resolvieron entre ciclos.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                <li>• Hasta 15 empresas</li>
                <li>• Todo lo incluido en Pro</li>
                <li>• Tendencia histórica extendida de hasta 6 ciclos</li>
                <li>• Alertas persistidas activas</li>
              </ul>

              <Link href="/pricing" className="btn btn-secondary mt-8 w-full">
                Ver planes
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="border-y border-zinc-200 bg-zinc-50 py-14 sm:py-16 lg:py-20"
      >
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Preguntas frecuentes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
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

      <section id="cta-final" className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-page text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Pasá de revisiones aisladas a un seguimiento más claro y comparable.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            Ordená cómo evaluás terceros, detectá deterioros entre ciclos y
            respaldá mejor cada decisión con una salida ejecutiva consistente.
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
