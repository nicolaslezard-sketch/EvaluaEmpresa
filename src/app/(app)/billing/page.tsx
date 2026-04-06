import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserEntitlements } from "@/lib/access/getEntitlements";
import { StartTrialButton } from "@/components/billing/StartTrialButton";
import { UpgradeButton } from "@/components/billing/UpgradeButton";
import LegalCheckoutNotice from "@/components/legal/LegalCheckoutNotice";

const recurringPlans = [
  {
    name: "Free",
    tone: "zinc",
    title: "Para explorar el flujo",
    description:
      "Ideal para conocer cómo funciona la plataforma y completar una primera evaluación antes de pagar.",
    highlights: [
      "1 empresa",
      "Vista parcial del resultado",
      "Score general y categoría ejecutiva",
    ],
  },
  {
    name: "Pro",
    tone: "sky",
    title: "Para seguimiento completo de cartera chica",
    description:
      "Pensado para quienes necesitan evaluar, comparar ciclos y sostener seguimiento recurrente sobre pocos terceros estratégicos.",
    highlights: [
      "Hasta 3 empresas",
      "Acceso completo al resultado",
      "Comparativa entre ciclos",
      "Histórico de evaluaciones",
      "PDF ejecutivo",
      "Tendencia histórica de hasta 3 ciclos",
    ],
  },
  {
    name: "Business",
    tone: "emerald",
    title: "Para monitoreo continuo de cartera más amplia",
    description:
      "La opción para quienes necesitan más capacidad, más profundidad histórica y alertas persistidas para seguir riesgos no resueltos entre ciclos.",
    highlights: [
      "Hasta 15 empresas",
      "Todo lo incluido en Pro",
      "Tendencia histórica extendida de hasta 6 ciclos",
      "Alertas persistidas activas",
      "Monitoreo más profundo de deterioros y riesgos no resueltos",
    ],
  },
] as const;

const oneTimeAccess = {
  name: "Evaluación única",
  title: "Para resolver un caso puntual sin suscripción",
  description:
    "Desbloqueá una evaluación completa cuando necesites resultado final, hallazgos, recomendaciones y PDF ejecutivo, sin pasar a un plan mensual.",
  highlights: [
    "Resultado completo",
    "Hallazgos y recomendaciones",
    "Cambios del ciclo evaluado",
    "PDF ejecutivo",
    "Pago único",
  ],
  ctaLabel: "Desbloquear evaluación",
  ctaHref: "/dashboard",
};

const upgradeSignals = [
  {
    title: "Te quedaste corto con una sola empresa",
    description:
      "Si ya necesitás seguir más de un tercero, Free deja de ser suficiente muy rápido.",
  },
  {
    title: "Querés comparar un ciclo contra otro",
    description:
      "El valor fuerte de EE aparece cuando podés ver deterioros, mejoras y persistencias entre evaluaciones.",
  },
  {
    title: "Necesitás una salida más defendible",
    description:
      "Si el resultado ya se comparte o se usa para respaldar decisiones, conviene tener acceso completo y PDF ejecutivo.",
  },
  {
    title: "Querés pasar de análisis aislados a seguimiento",
    description:
      "Cuando el uso deja de ser puntual, tiene más sentido un plan recurrente que pagar caso por caso.",
  },
];

const faqs = [
  {
    question: "¿Cuándo conviene una evaluación única?",
    answer:
      "Cuando necesitás resolver un caso puntual sin asumir una suscripción mensual. Es la mejor opción si querés el resultado completo, con PDF, para una sola evaluación.",
  },
  {
    question: "¿Cuándo conviene pasar a Pro?",
    answer:
      "Cuando necesitás seguir más de una empresa, comparar evaluaciones entre ciclos y trabajar de forma recurrente con acceso completo.",
  },
  {
    question: "¿Cuándo conviene Business?",
    answer:
      "Cuando necesitás seguir una cartera más amplia con más profundidad histórica y alertas persistidas para monitoreo continuo.",
  },
  {
    question: "¿Puedo empezar gratis y después subir?",
    answer:
      "Sí. El flujo está pensado para que puedas conocer la herramienta primero y después decidir si te conviene una evaluación puntual o un plan recurrente.",
  },
];

function getCardClass(tone: "zinc" | "sky" | "emerald" | "amber") {
  if (tone === "sky") {
    return "rounded-3xl border border-sky-200 bg-white p-8 shadow-[0_12px_32px_rgba(2,132,199,0.10)]";
  }

  if (tone === "emerald") {
    return "rounded-3xl border border-emerald-200 bg-white p-8 shadow-[0_12px_32px_rgba(16,185,129,0.08)]";
  }

  if (tone === "amber") {
    return "rounded-3xl border border-amber-200 bg-white p-8 shadow-[0_12px_32px_rgba(245,158,11,0.08)]";
  }

  return "rounded-3xl border border-zinc-200 bg-white p-8 shadow-[0_8px_24px_rgba(15,23,42,0.05)]";
}

function getNameClass(tone: "zinc" | "sky" | "emerald" | "amber") {
  if (tone === "sky") return "text-sm font-semibold text-sky-900";
  if (tone === "emerald") return "text-sm font-semibold text-emerald-800";
  if (tone === "amber") return "text-sm font-semibold text-amber-700";
  return "text-sm font-medium text-zinc-900";
}

export default async function BillingPage() {
  const session = await getServerSession(authOptions);

  const currentPlan = session?.user?.id
    ? (await getUserEntitlements(session.user.id)).plan
    : "FREE";

  const billingState = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          proTrialUsedAt: true,
          subscription: {
            select: {
              status: true,
              source: true,
              isTrial: true,
              trialEndsAt: true,
              currentPeriodEnd: true,
            },
          },
        },
      })
    : null;

  const hasUsedProTrial = Boolean(billingState?.proTrialUsedAt);

  const activeTrialEndsAt =
    billingState?.subscription?.status === "ACTIVE" &&
    billingState?.subscription?.isTrial &&
    billingState?.subscription?.trialEndsAt
      ? new Intl.DateTimeFormat("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(billingState.subscription.trialEndsAt)
      : null;

  return (
    <div className="space-y-0">
      <section className="border-b border-zinc-200 bg-linear-to-b from-white via-zinc-50 to-white">
        <div className="container-page py-16">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
              Planes y acceso
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900">
              Elegí el nivel de profundidad que necesitás hoy
            </h1>

            <p className="mt-6 text-lg leading-8 text-zinc-600">
              Podés empezar gratis, desbloquear una evaluación puntual o pasar a
              un plan recurrente si necesitás trabajar con más empresas, más
              histórico y mejor comparativa entre ciclos.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Cuándo tiene sentido subir
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              El upgrade conviene cuando el seguimiento deja de ser algo aislado
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Si solo querés resolver un caso puntual, la evaluación única
              alcanza. Si necesitás comparar, monitorear y sostener criterio en
              el tiempo, conviene pasar a un plan recurrente.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {upgradeSignals.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
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

      <section className="border-y border-zinc-200 bg-amber-50/40 py-16">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-amber-700">
                Acceso puntual
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
                {oneTimeAccess.title}
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-600">
                {oneTimeAccess.description}
              </p>
            </div>

            <div className={getCardClass("amber")}>
              <p className={getNameClass("amber")}>{oneTimeAccess.name}</p>
              <p className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">
                Resultado completo sin pasar a un plan mensual
              </p>

              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                {oneTimeAccess.highlights.map((feature) => (
                  <li key={feature}>
                    •{" "}
                    <span className="font-semibold text-zinc-900">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={oneTimeAccess.ctaHref}
                className="btn btn-primary mt-8 w-full"
              >
                {oneTimeAccess.ctaLabel}
              </Link>
            </div>
          </div>
        </div>

        <div className="container-page">
          <LegalCheckoutNotice className="mt-6 max-w-3xl text-sm leading-6 text-zinc-500" />
        </div>
      </section>

      <section className="bg-zinc-50 py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Planes recurrentes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Para pasar de una evaluación puntual a una práctica sostenida
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Free sirve para explorar. Pro está pensado para seguimiento
              completo de una cartera chica. Business suma más capacidad, más
              profundidad histórica y alertas persistidas para un monitoreo más
              activo.
            </p>
          </div>

          {currentPlan === "PRO" && activeTrialEndsAt ? (
            <div className="mb-8 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-900">
              Tu acceso Pro de prueba está activo hasta el {activeTrialEndsAt}.
              Cuando termine el trial, la cuenta volverá a Free si no activás
              una suscripción.
            </div>
          ) : null}

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            {recurringPlans.map((plan) => {
              const tone = plan.tone;
              const normalizedPlan = plan.name.toUpperCase() as
                | "FREE"
                | "PRO"
                | "BUSINESS";
              const isCurrentPlan = currentPlan === normalizedPlan;

              return (
                <div
                  key={plan.name}
                  className={`${getCardClass(tone)} flex h-full flex-col`}
                >
                  <div>
                    <p className={getNameClass(tone)}>{plan.name}</p>
                    <p className="mt-4 text-2xl font-semibold leading-[1.35] tracking-tight text-zinc-900">
                      {plan.title}
                    </p>
                    <p className="mt-4 text-base leading-7 text-zinc-600">
                      {plan.description}
                    </p>

                    <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                      {plan.highlights.map((feature) => (
                        <li key={feature}>
                          •{" "}
                          <span className="font-semibold text-zinc-900">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    {normalizedPlan === "FREE" ? (
                      <button
                        type="button"
                        disabled
                        className="btn btn-secondary w-full cursor-not-allowed opacity-70"
                      >
                        {currentPlan === "FREE" ? "Plan actual" : "Plan base"}
                      </button>
                    ) : normalizedPlan === "PRO" ? (
                      currentPlan === "PRO" ? (
                        <button
                          type="button"
                          disabled
                          className="btn btn-secondary w-full cursor-not-allowed opacity-70"
                        >
                          Plan actual
                        </button>
                      ) : currentPlan === "BUSINESS" ? (
                        <button
                          type="button"
                          disabled
                          className="btn btn-secondary w-full cursor-not-allowed opacity-70"
                        >
                          Ya tenés Business
                        </button>
                      ) : !hasUsedProTrial ? (
                        <StartTrialButton />
                      ) : (
                        <UpgradeButton plan="PRO" />
                      )
                    ) : currentPlan === "BUSINESS" ? (
                      <button
                        type="button"
                        disabled
                        className="btn btn-secondary w-full cursor-not-allowed opacity-70"
                      >
                        Plan actual
                      </button>
                    ) : (
                      <UpgradeButton plan="BUSINESS" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-8 max-w-4xl text-base leading-8 text-zinc-600">
            <span className="font-semibold text-zinc-900">Free</span> sirve para
            explorar el flujo.{" "}
            <span className="font-semibold text-sky-900">Pro</span> permite
            trabajar evaluaciones completas con comparativa entre ciclos e
            histórico.{" "}
            <span className="font-semibold text-emerald-800">Business</span>{" "}
            suma más capacidad, más histórico y monitoreo más activo.
          </p>

          <LegalCheckoutNotice className="mt-6 max-w-3xl text-sm leading-6 text-zinc-500" />
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Cómo elegir mejor
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Qué conviene según tu forma de uso
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              <p className="text-base font-medium text-zinc-900">Free</p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Para probar el flujo y entender cómo se estructura una
                evaluación.
              </p>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-white p-6 shadow-sm">
              <p className="text-base font-semibold text-amber-700">
                Evaluación única
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Para resolver un caso puntual con resultado completo y PDF, sin
                suscripción.
              </p>
            </div>

            <div className="rounded-3xl border border-sky-200 bg-white p-6 shadow-sm">
              <p className="text-base font-semibold text-sky-900">Pro</p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Para seguimiento recurrente con comparativa entre ciclos e
                histórico completo.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
              <p className="text-base font-semibold text-emerald-800">
                Business
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Para mayor volumen, más profundidad temporal y monitoreo más
                activo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Preguntas frecuentes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Lo importante antes de cambiar de plan
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
              >
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

      <section className="bg-white py-20">
        <div className="container-page text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Empezá gratis, resolvé un caso puntual o pasá a seguimiento
            recurrente
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            Elegí la modalidad que mejor encaje con tu forma actual de evaluar
            terceros, sin sobredimensionar el uso ni pagar de más.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/dashboard" className="btn btn-primary">
              Ir al dashboard
            </Link>
            <Link href="/pricing" className="btn btn-secondary">
              Ver pricing público
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
