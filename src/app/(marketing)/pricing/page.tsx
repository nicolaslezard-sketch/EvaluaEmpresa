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
  },
  {
    name: "Evaluación única",
    headline: "Para obtener un resultado completo sin suscripción",
    description:
      "La mejor opción si necesitás una evaluación puntual con salida ejecutiva y sin compromiso mensual.",
    features: [
      "Resultado completo",
      "Hallazgos y recomendaciones",
      "Cambios del ciclo evaluado",
      "PDF ejecutivo",
      "Pago único",
    ],
    ctaLabel: "Empezar evaluación",
    ctaHref: "/login",
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
  },
  {
    name: "Business",
    headline: "Para mayor volumen y monitoreo más activo",
    description:
      "La opción para quienes necesitan más capacidad, más histórico y una operación más continua sobre terceros.",
    features: [
      "Mayor capacidad operativa",
      "Más empresas y evaluaciones",
      "Tendencia histórica extendida",
      "Alertas y seguimiento más activo",
      "Operación continua",
    ],
    ctaLabel: "Ver plan Business",
    ctaHref: "/billing",
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
      "Cuando la evaluación de terceros deja de ser algo aislado y pasa a formar parte de un seguimiento más frecuente, con comparativa entre ciclos, histórico y mayor capacidad operativa.",
  },
  {
    question: "¿EvaluaEmpresa sirve solo para proveedores?",
    answer:
      "No. Puede usarse para proveedores, clientes, contrapartes u otros terceros que necesiten una evaluación estructurada y comparable en el tiempo.",
  },
  {
    question: "¿Business es un plan para múltiples usuarios?",
    answer:
      "Hoy Business está orientado a quienes necesitan más capacidad, más histórico y monitoreo más activo. No está planteado todavía como un plan colaborativo con roles o multiusuario avanzado.",
  },
];

export default function PricingPage() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b border-zinc-200 bg-linear-to-b from-white via-sky-50/60 to-white">
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
              puntual o trabajar con planes pensados para una práctica más
              continua y comparable.
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
              organiza una evaluación antes de pagar.
            </p>
          </div>

          <div className="card p-6">
            <p className="text-base font-medium text-zinc-900">
              Pagá una sola vez si lo necesitás puntual
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              La evaluación única sirve cuando querés un resultado completo sin
              pasar a una suscripción mensual.
            </p>
          </div>

          <div className="card p-6">
            <p className="text-base font-medium text-zinc-900">
              Escalá a seguimiento recurrente
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Pro y Business están pensados para sostener una práctica más
              continua, con comparativa entre ciclos, histórico y mayor
              capacidad.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING GRID */}
      <section className="border-y border-zinc-200 bg-zinc-50 py-20">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => {
              const isFree = plan.name === "Free";
              const isSingle = plan.name === "Evaluación única";
              const isPro = plan.name === "Pro";
              const isBusiness = plan.name === "Business";

              const cardClass = isFree
                ? "rounded-3xl border border-zinc-200 bg-white p-8 shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
                : isSingle
                  ? "rounded-3xl border border-amber-200 bg-white p-8 shadow-[0_12px_32px_rgba(245,158,11,0.08)]"
                  : isPro
                    ? "rounded-3xl border border-sky-200 bg-white p-8 shadow-[0_12px_32px_rgba(2,132,199,0.10)]"
                    : "rounded-3xl border border-emerald-200 bg-white p-8 shadow-[0_12px_32px_rgba(16,185,129,0.08)]";

              const nameClass = isFree
                ? "text-sm font-medium text-zinc-900"
                : isSingle
                  ? "text-sm font-semibold text-amber-700"
                  : isPro
                    ? "text-sm font-semibold text-sky-900"
                    : "text-sm font-semibold text-emerald-800";

              return (
                <div
                  key={plan.name}
                  className={`${cardClass} flex h-full flex-col`}
                >
                  <div>
                    <p className={nameClass}>{plan.name}</p>

                    <p className="mt-4 text-2xl font-semibold leading-[1.35] tracking-tight text-zinc-900">
                      {isFree
                        ? "Para explorar el producto"
                        : isSingle
                          ? "Para resolver una necesidad puntual"
                          : isPro
                            ? "Para usarlo de verdad"
                            : "Para mayor volumen y monitoreo activo"}
                    </p>

                    <p className="mt-4 text-base leading-7 text-zinc-600">
                      {isFree
                        ? "Conocé el flujo y completá una primera evaluación."
                        : isSingle
                          ? "Resultado completo sin compromiso mensual."
                          : isPro
                            ? "Más empresas, más evaluaciones y comparativa entre ciclos."
                            : "Más capacidad, tendencia extendida y alertas para una operación más activa."}
                    </p>

                    <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                      {plan.features.map((feature) => {
                        const highlight =
                          (isFree &&
                            (feature.includes("Carga de empresa") ||
                              feature.includes("Vista parcial"))) ||
                          (isSingle &&
                            (feature.includes("Resultado completo") ||
                              feature.includes("PDF ejecutivo"))) ||
                          (isPro &&
                            (feature.includes("Acceso completo") ||
                              feature.includes("Comparativa") ||
                              feature.includes("Histórico"))) ||
                          (isBusiness &&
                            (feature.includes("Mayor capacidad") ||
                              feature.includes("Más empresas") ||
                              feature.includes("Alertas") ||
                              feature.includes("Tendencia")));

                        return (
                          <li key={feature}>
                            •{" "}
                            <span
                              className={
                                highlight
                                  ? "font-semibold text-zinc-900"
                                  : "text-zinc-600"
                              }
                            >
                              {feature}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <Link
                      href={plan.ctaHref}
                      className={
                        isPro || isSingle
                          ? "btn btn-primary w-full"
                          : "btn btn-secondary w-full"
                      }
                    >
                      {plan.ctaLabel}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 max-w-4xl text-base leading-8 text-zinc-600">
            <span className="font-semibold text-zinc-900">Free</span> sirve para
            explorar el flujo.{" "}
            <span className="font-semibold text-amber-700">
              Evaluación única
            </span>{" "}
            resuelve una necesidad puntual sin suscripción.{" "}
            <span className="font-semibold text-sky-900">Pro</span> y{" "}
            <span className="font-semibold text-emerald-800">Business</span>{" "}
            están pensados para seguimiento continuo, comparativa entre ciclos y
            una operación más recurrente sobre terceros.
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
              <p className="text-base font-semibold text-amber-700">
                Evaluación única
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Para resolver un caso puntual con resultado completo y PDF
                ejecutivo, sin pagar un plan mensual.
              </p>
            </div>

            <div className="card p-6">
              <p className="text-base font-semibold text-sky-900">Pro</p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Para trabajar evaluaciones completas con histórico y comparativa
                entre ciclos.
              </p>
            </div>

            <div className="card p-6">
              <p className="text-base font-semibold text-emerald-800">
                Business
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Para quienes necesitan más capacidad, más histórico y monitoreo
                más activo sin cambiar el modelo de trabajo del producto.
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
