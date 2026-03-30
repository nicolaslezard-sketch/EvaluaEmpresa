import Link from "next/link";

const plans = [
  {
    name: "Free",
    headline: "Para conocer el flujo y probar una primera evaluación",
    description:
      "Ideal para entender cómo funciona la plataforma antes de desbloquear resultados completos.",
    features: [
      "Carga de empresa y evaluación",
      "Acceso inicial al producto",
      "Vista parcial del resultado",
      "Score general y categoría ejecutiva",
    ],
    ctaLabel: "Comenzar gratis",
    ctaHref: "/login",
    highlighted: false,
  },
  {
    name: "Evaluación única",
    headline: "Para obtener un resultado completo sin suscripción",
    description:
      "La mejor opción si necesitás una evaluación puntual con salida ejecutiva y sin compromiso mensual.",
    features: [
      "Resultado completo",
      "Hallazgos y recomendaciones",
      "Comparativa del ciclo evaluado",
      "PDF ejecutivo",
      "Pago único",
    ],
    ctaLabel: "Empezar evaluación",
    ctaHref: "/login",
    highlighted: true,
  },
  {
    name: "Pro",
    headline: "Para trabajar evaluaciones completas con seguimiento recurrente",
    description:
      "Pensado para quienes necesitan usar EvaluaEmpresa de forma continua y con más profundidad operativa.",
    features: [
      "Acceso completo al resultado",
      "Comparativa entre ciclos",
      "Histórico de evaluaciones",
      "PDF ejecutivo",
      "Uso recurrente",
    ],
    ctaLabel: "Ver plan Pro",
    ctaHref: "/billing",
    highlighted: false,
  },
  {
    name: "Business",
    headline: "Para equipos con mayor volumen y necesidad de escala",
    description:
      "La opción para organizaciones que necesitan más capacidad operativa y seguimiento continuo de terceros.",
    features: [
      "Mayor capacidad operativa",
      "Más empresas y evaluaciones",
      "Seguimiento más escalable",
      "Pensado para uso de equipo",
      "Operación continua",
    ],
    ctaLabel: "Ver plan Business",
    ctaHref: "/billing",
    highlighted: false,
  },
];

const faqs = [
  {
    question: "¿Puedo probar EvaluaEmpresa antes de pagar?",
    answer:
      "Sí. El plan Free te permite conocer el flujo de carga y ver una parte del resultado antes de avanzar a una evaluación completa o a un plan recurrente.",
  },
  {
    question: "¿Cuándo conviene elegir una evaluación única?",
    answer:
      "Cuando necesitás una revisión puntual con resultado completo, hallazgos, recomendaciones y PDF ejecutivo, pero no querés asumir una suscripción mensual.",
  },
  {
    question: "¿Cuándo conviene pasar a Pro o Business?",
    answer:
      "Cuando la evaluación de terceros deja de ser algo aislado y pasa a formar parte de un seguimiento más frecuente, con comparativa entre ciclos e histórico.",
  },
  {
    question: "¿EvaluaEmpresa sirve solo para proveedores?",
    answer:
      "No. Puede usarse para proveedores, clientes, contrapartes u otros terceros que necesiten una evaluación estructurada y comparable en el tiempo.",
  },
];

export default function PricingPage() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-zinc-200 bg-gradient-to-b from-white via-sky-50/60 to-white">
        {" "}
        <div className="container-page py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
              Planes y acceso
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
              Elegí cómo querés usar EvaluaEmpresa
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-600">
              Desde una prueba inicial hasta un uso recurrente para seguimiento
              de terceros. Podés empezar gratis, desbloquear una evaluación
              puntual o trabajar con planes pensados para operación continua.
            </p>
          </div>
        </div>
      </section>

      {/* POSICIONAMIENTO */}
      <section className="bg-white py-16">
        <div className="container-page grid gap-6 md:grid-cols-3">
          <div className="card p-6">
            <p className="text-base font-medium text-zinc-900">
              Probá el flujo sin fricción
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Empezá con una empresa, conocé la metodología y entendé cómo se
              organiza la evaluación.
            </p>
          </div>

          <div className="card p-6">
            <p className="text-base font-medium text-zinc-900">
              Pagá una sola vez si lo necesitás puntual
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              La evaluación única sirve cuando querés un resultado completo sin
              pasar a una suscripción.
            </p>
          </div>

          <div className="card p-6">
            <p className="text-base font-medium text-zinc-900">
              Escalá a seguimiento continuo
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Pro y Business están pensados para equipos que necesitan comparar
              ciclos y sostener una práctica recurrente.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING GRID */}
      <section className="border-y border-zinc-200 bg-zinc-50 py-20">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={[
                  "card flex h-full flex-col p-8",
                  plan.highlighted ? "border-2 border-zinc-900 bg-white" : "",
                ].join(" ")}
              >
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {plan.name}
                  </p>

                  <p className="mt-4 text-xl font-semibold leading-8 text-zinc-900">
                    {plan.headline}
                  </p>

                  <p className="mt-4 text-sm leading-6 text-zinc-600">
                    {plan.description}
                  </p>

                  <ul className="mt-6 space-y-2 text-sm text-zinc-600">
                    {plan.features.map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href={plan.ctaHref}
                    className={
                      plan.highlighted
                        ? "btn btn-primary w-full"
                        : "btn btn-secondary w-full"
                    }
                  >
                    {plan.ctaLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-6 text-zinc-500">
            Free sirve para explorar el flujo. Evaluación única resuelve una
            necesidad puntual sin suscripción. Pro y Business están pensados
            para seguimiento continuo, comparativa entre ciclos y operación más
            recurrente.
          </p>
        </div>
      </section>

      {/* COMPARACIÓN DE ESCENARIOS */}
      <section className="bg-white py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Cómo elegir
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Elegí según la madurez de uso que necesitás hoy
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="card p-6">
              <p className="text-base font-medium text-zinc-900">Free</p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Para explorar el producto y entender cómo se estructura una
                evaluación.
              </p>
            </div>

            <div className="card p-6">
              <p className="text-base font-medium text-zinc-900">
                Evaluación única
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Para resolver un caso puntual con resultado completo y PDF
                ejecutivo, sin pagar un plan mensual.
              </p>
            </div>

            <div className="card p-6">
              <p className="text-base font-medium text-zinc-900">Pro</p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Para trabajar evaluaciones completas con histórico y comparativa
                entre ciclos.
              </p>
            </div>

            <div className="card p-6">
              <p className="text-base font-medium text-zinc-900">Business</p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Para equipos con más volumen, más seguimiento y mayor necesidad
                de escala operativa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-zinc-200 bg-zinc-50 py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Preguntas frecuentes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Lo importante antes de elegir un plan
            </h2>
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
      <section className="bg-white py-20">
        <div className="container-page text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Empezá gratis, resolvé una evaluación puntual o escalá a seguimiento
            continuo.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            Elegí la modalidad que mejor encaje con tu forma de evaluar terceros
            hoy, sin complicar más de la cuenta el proceso.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/login" className="btn btn-primary">
              Comenzar gratis
            </Link>
            <Link href="/" className="btn btn-secondary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
