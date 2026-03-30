import Link from "next/link";

const outputs = [
  {
    title: "Score general",
    description:
      "Un puntaje consolidado para entender rápidamente el nivel de exposición de cada tercero.",
  },
  {
    title: "Categoría ejecutiva",
    description:
      "Una síntesis clara del estado general para comunicar situación y prioridad.",
  },
  {
    title: "Radar por 5 pilares",
    description:
      "Visibilidad por dimensión para detectar dónde se concentra la exposición.",
  },
  {
    title: "Hallazgos priorizados",
    description:
      "Señales relevantes ordenadas por impacto para no perder foco.",
  },
  {
    title: "Recomendaciones",
    description:
      "Sugerencias concretas para revisar, reforzar o seguir de cerca.",
  },
  {
    title: "Comparativa entre ciclos",
    description:
      "Cambios frente a evaluaciones anteriores para detectar mejoras o deterioros.",
  },
  {
    title: "PDF ejecutivo",
    description:
      "Una salida clara para compartir internamente y respaldar decisiones.",
  },
];

const faqs = [
  {
    question: "¿EvaluaEmpresa reemplaza el criterio del equipo?",
    answer:
      "No. Lo ordena en una evaluación estructurada, comparable entre ciclos y más fácil de comunicar internamente.",
  },
  {
    question: "¿Qué obtengo al finalizar una evaluación?",
    answer:
      "Score general, categoría ejecutiva, radar por 5 pilares, hallazgos priorizados, recomendaciones, comparativa entre ciclos y PDF ejecutivo.",
  },
  {
    question: "¿Sirve para una revisión puntual o para seguimiento continuo?",
    answer:
      "Ambas. Podés usarlo para una evaluación concreta o para seguir cómo evoluciona un tercero en el tiempo.",
  },
  {
    question: "¿Para qué tipo de terceros aplica?",
    answer:
      "Puede usarse para proveedores, clientes, contrapartes u otros terceros que necesiten una revisión estructurada.",
  },
  {
    question: "¿Qué diferencia hay entre Free, Pro y Business?",
    answer:
      "Free sirve para conocer el flujo. Pro desbloquea el resultado completo y la salida ejecutiva. Business está pensado para una operación de seguimiento más continua.",
  },
  {
    question: "¿La evaluación única sigue existiendo?",
    answer:
      "Sí. Es una opción útil para resolver una necesidad puntual con resultado completo y PDF ejecutivo, sin pasar a una suscripción.",
  },
];

const useCases = [
  {
    title: "Revisión de proveedores críticos",
    description:
      "Detectá señales relevantes y dejá una base más clara para continuidad, revisión o escalamiento.",
  },
  {
    title: "Seguimiento periódico de clientes o contrapartes",
    description:
      "Compará ciclos y registrá cómo evoluciona cada caso sin depender de memoria o criterio informal.",
  },
  {
    title: "Soporte para decisiones internas",
    description:
      "Compartí una salida ejecutiva clara con score, categoría, hallazgos y recomendaciones.",
  },
  {
    title: "Orden de cartera o universo evaluado",
    description:
      "Centralizá revisiones y evitá que cada análisis quede perdido en archivos sueltos o documentos aislados.",
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
              {" "}
              Evaluación estructurada de terceros
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
              Ordená cómo evaluás proveedores, clientes o contrapartes.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              Centralizá cada revisión con una metodología estructurada, compará
              resultados entre ciclos y obtené una salida ejecutiva clara para
              decidir con más criterio.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-zinc-600">
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-900">
                {" "}
                Score general y categoría ejecutiva
              </span>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-900">
                {" "}
                Radar por 5 pilares y hallazgos priorizados
              </span>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-900">
                {" "}
                Comparativa entre ciclos y PDF ejecutivo
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
              Probalo con una empresa y entendé rápidamente qué cambió, qué
              preocupa y qué conviene revisar.
            </p>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-[0_10px_40px_rgba(2,132,199,0.08)]">
            {" "}
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  Resumen ejecutivo
                </p>
                <p className="mt-2 text-lg font-semibold text-zinc-900">
                  Proveedor Industrial Delta S.A.
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Evaluación del ciclo actual vs. ciclo anterior
                </p>
              </div>

              <div className="rounded-2xl bg-sky-900 px-4 py-3 text-white">
                {" "}
                <p className="text-xs uppercase tracking-wide text-zinc-300">
                  Score
                </p>
                <p className="mt-1 text-2xl font-semibold">68/100</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4">
                {" "}
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  Categoría ejecutiva
                </p>
                <p className="mt-2 text-base font-semibold text-zinc-900">
                  Vulnerable
                </p>
                <p className="mt-2 text-sm text-zinc-600">
                  Se detectan señales que requieren seguimiento y revisión
                  prioritaria.
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
                  Deterioro concentrado en pilares operativos y comerciales.
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
                    Caída en consistencia operativa
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Se observan desvíos que aumentan la exposición del tercero.
                  </p>
                </div>

                <div className="rounded-2xl bg-zinc-50 p-3">
                  <p className="text-sm font-medium text-zinc-900">
                    Mayor dependencia comercial
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    La concentración actual vuelve más sensible la continuidad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section id="metodologia" className="bg-white py-20">
        {" "}
        <div className="container-page grid gap-12 md:grid-cols-[1fr_1fr] md:items-start">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              El problema
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Evaluar terceros sin una estructura común suele terminar en
              revisiones poco comparables y decisiones difíciles de respaldar.
            </h2>

            <p className="mt-5 text-base leading-7 text-zinc-600">
              Cuando cada evaluación depende de planillas, documentos sueltos o
              criterios cambiantes, se vuelve más difícil detectar deterioros,
              priorizar hallazgos y justificar por qué continuar, revisar o
              escalar un caso.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="card p-6">
              <p className="text-sm font-medium text-zinc-900">
                Evaluaciones dispersas y poco comparables
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Cada revisión queda armada distinto y cuesta sostener un
                criterio común.
              </p>
            </div>

            <div className="card p-6">
              <p className="text-sm font-medium text-zinc-900">
                Poco seguimiento entre un ciclo y otro
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                No siempre queda claro qué empeoró, qué mejoró y dónde conviene
                intervenir.
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

      {/* QUÉ RECIBÍS */}
      <section className="border-y border-sky-100 bg-sky-50/40 py-20">
        {" "}
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Qué recibís
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Todo lo que recibís en cada evaluación
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Una lectura clara del estado actual de cada tercero, sus
              principales señales y su evolución frente a revisiones anteriores.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {outputs.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm"
              >
                {" "}
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
      <section id="metodologia" className="bg-white py-20">
        {" "}
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Cómo funciona
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Un proceso simple para ordenar evaluaciones recurrentes
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="card p-6">
              <p className="text-sm font-medium text-sky-800">Paso 1</p>{" "}
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
                Cargá la evaluación
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Completá la revisión estructurada por pilares y reflejá la
                situación actual de forma consistente.
              </p>
            </div>

            <div className="card p-6">
              <p className="text-sm font-medium text-sky-800">Paso 3</p>
              <p className="mt-3 text-lg font-semibold text-zinc-900">
                Obtené claridad para decidir
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Recibí score, categoría ejecutiva, hallazgos, comparativa entre
                ciclos y una salida ejecutiva lista para compartir.
              </p>
            </div>
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-6 text-zinc-500">
            No reemplaza tu criterio: lo ordena, lo vuelve comparable y deja
            mejor soporte para decidir.
          </p>
        </div>
      </section>

      {/* CASOS DE USO */}
      <section className="border-y border-sky-100 bg-sky-50/40 py-20">
        {" "}
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Casos de uso
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Casos donde una evaluación estructurada hace diferencia
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {useCases.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm"
              >
                {" "}
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
      <section id="metodologia" className="bg-white py-20">
        {" "}
        <div className="container-page grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Para quién sirve
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Pensado para equipos que necesitan evaluar terceros con más orden
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              EvaluaEmpresa ayuda a aplicar una estructura común en cada
              revisión, comparar resultados entre ciclos y dejar trazabilidad
              sobre lo que cambió.
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
        {" "}
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Planes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Elegí cómo querés usar EvaluaEmpresa
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Desde una prueba inicial hasta un uso recurrente para seguimiento
              de terceros.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="card p-6">
              <p className="text-sm font-medium text-zinc-900">Free</p>
              <p className="mt-3 text-lg font-semibold text-zinc-900">
                Para conocer el flujo y probar una primera evaluación
              </p>

              <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                <li>• Carga de empresa y evaluación</li>
                <li>• Acceso inicial al producto</li>
                <li>• Vista limitada del resultado</li>
              </ul>

              <Link href="/pricing" className="btn btn-secondary mt-6 w-full">
                Probar ahora
              </Link>
            </div>

            <div className="rounded-3xl border-2 border-sky-900 bg-white p-6 shadow-[0_10px_30px_rgba(2,132,199,0.08)]">
              {" "}
              <p className="text-sm font-medium text-zinc-900">Pro</p>
              <p className="mt-3 text-lg font-semibold text-zinc-900">
                Para trabajar con evaluaciones completas y salida ejecutiva
              </p>
              <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                <li>• Resultado completo</li>
                <li>• Hallazgos y recomendaciones</li>
                <li>• Comparativa entre ciclos</li>
                <li>• PDF ejecutivo</li>
              </ul>
              <Link href="/pricing" className="btn btn-primary mt-6 w-full">
                Ver plan Pro
              </Link>
            </div>

            <div className="card p-6">
              <p className="text-sm font-medium text-zinc-900">Business</p>
              <p className="mt-3 text-lg font-semibold text-zinc-900">
                Para equipos con mayor volumen y seguimiento continuo
              </p>

              <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                <li>• Mayor capacidad operativa</li>
                <li>• Más empresas y evaluaciones</li>
                <li>• Seguimiento más escalable</li>
              </ul>

              <Link href="/pricing" className="btn btn-secondary mt-6 w-full">
                Ver planes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
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
      <section id="faq" className="bg-white py-20">
        <div className="container-page text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Ordená cómo evaluás terceros y seguí su evolución con más claridad.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            Pasá de revisiones aisladas a un proceso más consistente, comparable
            y fácil de respaldar internamente.
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
