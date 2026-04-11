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
      "Sirve para ambas cosas, pero su mayor valor aparece cuando lo usás de forma recurrente para comparar ciclos y detectar deterioros antes.",
  },
  {
    question: "¿Qué tipo de terceros puedo evaluar?",
    answer:
      "Proveedores, clientes, contrapartes u otras relaciones que necesiten una evaluación estructurada y comparable en el tiempo.",
  },
  {
    question: "¿Cómo funciona la prueba gratuita?",
    answer:
      "Podés probar EvaluaEmpresa durante 21 días para conocer el flujo, cargar empresas y entender cómo funciona el monitoreo antes de pasar a un plan pago.",
  },
  {
    question: "¿Qué diferencia hay entre Pro y Business?",
    answer:
      "Pro está pensado para seguimiento completo de una cartera chica. Business suma más capacidad, más profundidad histórica y monitoreo más activo.",
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
                Comenzar prueba gratis
              </Link>

              <Link
                href="/pricing"
                className="btn btn-secondary w-full sm:w-auto"
              >
                Ver planes
              </Link>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500">
              Probalo durante 21 días y entendé rápido qué cambió, qué requiere
              atención y qué conviene revisar ahora.
            </p>
          </div>
        </div>
      </section>

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

      <section
        id="planes"
        className="border-y border-zinc-200 bg-slate-50 py-20"
      >
        <div className="container-page">
          <div className="max-w-4xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Planes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Elegí el nivel de seguimiento que necesitás para tu cartera
            </h2>
            <p className="mt-4 text-base leading-8 text-zinc-600">
              <span className="font-semibold text-zinc-900">
                Prueba gratuita
              </span>{" "}
              te permite conocer el flujo durante 21 días.{" "}
              <span className="font-semibold text-sky-900">Pro</span> está
              pensado para seguimiento completo de una cartera chica.{" "}
              <span className="font-semibold text-emerald-800">Business</span>{" "}
              suma más capacidad, más profundidad histórica y alertas
              persistidas para un monitoreo más activo.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-[0_8px_24px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-medium text-zinc-900">
                Prueba gratuita
              </p>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
                21 días para conocer cómo funciona
              </p>
              <p className="mt-3 text-base leading-7 text-zinc-600">
                Probá el flujo, cargá empresas y entendé cómo se ordena el
                seguimiento de terceros antes de elegir un plan.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                <li>• Acceso de prueba por 21 días</li>
                <li>• Ideal para validar el flujo</li>
                <li>• Conocer el producto antes de pagar</li>
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
                <li>
                  •{" "}
                  <span className="font-semibold text-zinc-900">
                    Hasta 3 empresas
                  </span>
                </li>
                <li>
                  •{" "}
                  <span className="font-semibold text-zinc-900">
                    Reporte completo y PDF ejecutivo
                  </span>
                </li>
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
                Para monitoreo continuo con más profundidad
              </p>
              <p className="mt-3 text-base leading-7 text-zinc-600">
                Sumá más capacidad, más memoria histórica y alertas persistidas
                para seguir riesgos no resueltos entre ciclos.
              </p>

              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                <li>
                  •{" "}
                  <span className="font-semibold text-zinc-900">
                    Hasta 15 empresas
                  </span>
                </li>
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

      <section id="faq" className="bg-white py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Preguntas frecuentes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Lo importante antes de empezar
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Respuestas rápidas para entender cómo encaja EvaluaEmpresa en un
              seguimiento más claro y comparable de terceros.
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

      <section className="border-t border-zinc-200 bg-linear-to-b from-white to-sky-50/40 py-20">
        <div className="container-page text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Empezá con una prueba gratuita y pasá a seguimiento continuo cuando
            lo necesites.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            Probá el producto, entendé el flujo y elegí el plan que mejor encaje
            con tu nivel de seguimiento cuando realmente lo necesites.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/login" className="btn btn-primary w-full sm:w-auto">
              Comenzar prueba gratis
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
