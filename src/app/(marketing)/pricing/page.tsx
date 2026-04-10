"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PRICING, type Region } from "@/lib/pricing/config";

function formatArs(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function detectInitialRegion(): Region {
  if (typeof window === "undefined") return "AR";

  const saved = window.localStorage.getItem("ee_pricing_region");
  if (saved === "AR" || saved === "INTL") return saved;

  const language = navigator.language || "";
  const timezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone?.toLowerCase() || "";

  const isArgentinaLanguage = language.toLowerCase() === "es-ar";
  const isArgentinaTimezone =
    timezone.includes("argentina") || timezone.includes("buenos_aires");

  return isArgentinaLanguage || isArgentinaTimezone ? "AR" : "INTL";
}

const plans = [
  {
    name: "Free",
    eyebrow: "Para probar",
    headline: "Conocé el flujo antes de pagar",
    description:
      "Ideal para entender cómo funciona la plataforma antes de pasar a un resultado completo o a un seguimiento recurrente.",
    features: [
      "1 empresa",
      "Vista parcial del resultado",
      "Score general y categoría ejecutiva",
      "Ideal para conocer el sistema",
    ],
    priceByRegion: {
      AR: "Gratis",
      INTL: "Free",
    },
    billingNoteByRegion: {
      AR: "Sin cargo",
      INTL: "Free",
    },
    ctaLabel: "Comenzar gratis",
    ctaHref: "/login",
    tone: "default",
    checkout: null,
  },
  {
    name: "Evaluación única",
    eyebrow: "Caso puntual",
    headline: "Resolvé una evaluación completa sin suscripción",
    description:
      "La mejor opción si necesitás resolver una evaluación puntual con salida ejecutiva y PDF, sin compromiso mensual.",
    features: [
      "Resultado completo",
      "Hallazgos y recomendaciones",
      "Cambios del ciclo evaluado",
      "PDF ejecutivo",
      "Pago único",
    ],
    priceByRegion: {
      AR: formatArs(PRICING.AR.oneTime.EVALUACION_UNICA.amount),
      INTL: formatUsd(PRICING.INTL.oneTime.EVALUACION_UNICA.amount),
    },
    billingNoteByRegion: {
      AR: "Pago único",
      INTL: "One-time",
    },
    ctaLabel: "Empezar evaluación",
    ctaHref: null,
    tone: "single",
    checkout: {
      kind: "one_time" as const,
      plan: "EVALUACION_UNICA" as const,
    },
  },
  {
    name: "Pro",
    eyebrow: "Recomendado",
    headline: "Seguimiento completo para cartera chica",
    description:
      "Pensado para quienes necesitan evaluar, comparar ciclos y sostener seguimiento recurrente sobre pocos terceros estratégicos.",
    features: [
      "Hasta 3 empresas",
      "Acceso completo al resultado",
      "Comparativa entre ciclos",
      "Histórico de evaluaciones",
      "PDF ejecutivo",
      "Tendencia histórica de hasta 3 ciclos",
    ],
    priceByRegion: {
      AR: formatArs(PRICING.AR.subscription.PRO.monthly.amount),
      INTL: formatUsd(PRICING.INTL.subscription.PRO.monthly.amount),
    },
    billingNoteByRegion: {
      AR: "por mes",
      INTL: "per month",
    },
    ctaLabel: "Elegir Pro",
    ctaHref: null,
    tone: "pro",
    checkout: {
      kind: "subscription" as const,
      plan: "PRO" as const,
      period: "monthly" as const,
    },
  },
  {
    name: "Business",
    eyebrow: "Mayor capacidad",
    headline: "Monitoreo continuo con más profundidad",
    description:
      "La opción para quienes necesitan más capacidad, más profundidad histórica y alertas persistidas para seguir riesgos no resueltos entre ciclos.",
    features: [
      "Hasta 15 empresas",
      "Todo lo incluido en Pro",
      "Tendencia histórica extendida de hasta 6 ciclos",
      "Alertas persistidas activas",
      "Monitoreo más profundo de deterioros y riesgos no resueltos",
    ],
    priceByRegion: {
      AR: formatArs(PRICING.AR.subscription.BUSINESS.monthly.amount),
      INTL: formatUsd(PRICING.INTL.subscription.BUSINESS.monthly.amount),
    },
    billingNoteByRegion: {
      AR: "por mes",
      INTL: "per month",
    },
    ctaLabel: "Elegir Business",
    ctaHref: null,
    tone: "business",
    checkout: {
      kind: "subscription" as const,
      plan: "BUSINESS" as const,
      period: "monthly" as const,
    },
  },
] as const;

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
      "Cuando la evaluación de terceros deja de ser algo aislado y pasa a formar parte de un seguimiento más frecuente, con comparativa entre ciclos, histórico y mayor capacidad de monitoreo.",
  },
  {
    question: "¿Qué diferencia hay entre Pro y Business?",
    answer:
      "Pro está pensado para seguimiento completo de una cartera chica. Business suma más capacidad, más profundidad histórica y alertas persistidas para un monitoreo más activo de terceros.",
  },
  {
    question: "¿EvaluaEmpresa sirve solo para proveedores?",
    answer:
      "No. Puede usarse para proveedores, clientes, contrapartes u otros terceros que necesiten una evaluación estructurada y comparable en el tiempo.",
  },
  {
    question: "¿Business es un plan para múltiples usuarios?",
    answer:
      "Hoy Business está orientado a quienes necesitan seguir una cartera más amplia con mayor profundidad histórica y alertas persistidas. La colaboración entre múltiples usuarios puede sumarse más adelante.",
  },
];

const decisionCards = [
  {
    title: "Solo quiero probar",
    answer: "Empezá con Free.",
  },
  {
    title: "Necesito resolver un caso puntual",
    answer: "Elegí Evaluación única.",
  },
  {
    title: "Quiero seguimiento recurrente de pocos terceros",
    answer: "El plan correcto es Pro.",
  },
  {
    title: "Necesito más capacidad e histórico",
    answer: "Ahí conviene Business.",
  },
];

export default function PricingPage() {
  const [region, setRegion] = useState<Region>(() => detectInitialRegion());

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ee_pricing_region", region);
    }
  }, [region]);

  const regionLabel =
    region === "AR" ? "Argentina (ARS)" : "Internacional (USD)";

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function handleCheckout(plan: (typeof plans)[number]) {
    if (!plan.checkout) return;

    try {
      setLoadingPlan(plan.name);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan.checkout),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Checkout failed");
      }

      if (!data?.checkoutUrl) {
        throw new Error("Checkout URL missing");
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      alert(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="bg-white">
      <section className="border-b border-zinc-200 bg-linear-to-b from-white via-sky-50/60 to-white">
        <div className="container-page py-12 sm:py-16 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500 sm:text-xs">
                Planes y acceso
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                Elegí cómo querés usar EvaluaEmpresa
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
                Podés empezar gratis, resolver una evaluación puntual o trabajar
                con un plan pensado para seguimiento continuo y comparativa
                entre ciclos.
              </p>
            </div>

            <div className="w-full max-w-full rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm lg:w-auto">
              <div className="text-sm font-medium text-zinc-900">
                Mostrando precios para {regionLabel}
              </div>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:rounded-xl sm:border sm:border-zinc-200 sm:bg-zinc-50 sm:p-1">
                <button
                  type="button"
                  onClick={() => setRegion("AR")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    region === "AR"
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  Argentina (ARS)
                </button>

                <button
                  type="button"
                  onClick={() => setRegion("INTL")}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    region === "INTL"
                      ? "bg-white text-zinc-900 shadow-sm"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  Internacional (USD)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 py-14 sm:py-16 lg:py-20">
        <div className="container-page">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Planes disponibles
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Elegí la modalidad que mejor encaje con tu forma de evaluar hoy
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              Free sirve para probar. Evaluación única resuelve un caso puntual.
              Pro es la opción principal para seguimiento recurrente. Business
              amplía capacidad y profundidad.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-4">
            {plans.map((plan) => {
              const isFree = plan.tone === "default";
              const isSingle = plan.tone === "single";
              const isPro = plan.tone === "pro";

              const cardClass = isFree
                ? "rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
                : isSingle
                  ? "rounded-3xl border border-amber-200 bg-white p-6 shadow-[0_12px_32px_rgba(245,158,11,0.08)]"
                  : isPro
                    ? "rounded-3xl border border-sky-200 bg-white p-6 shadow-[0_12px_32px_rgba(2,132,199,0.10)]"
                    : "rounded-3xl border border-emerald-200 bg-white p-6 shadow-[0_12px_32px_rgba(16,185,129,0.08)]";

              const eyebrowClass = isFree
                ? "text-xs font-medium uppercase tracking-[0.18em] text-zinc-500"
                : isSingle
                  ? "text-xs font-semibold uppercase tracking-[0.18em] text-amber-700"
                  : isPro
                    ? "text-xs font-semibold uppercase tracking-[0.18em] text-sky-900"
                    : "text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800";

              const buttonClass = isPro
                ? "btn btn-primary w-full"
                : "btn btn-secondary w-full";

              return (
                <div
                  key={plan.name}
                  className={`${cardClass} flex h-full flex-col`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className={eyebrowClass}>{plan.eyebrow}</p>
                        <p className="mt-2 text-lg font-semibold text-zinc-900">
                          {plan.name}
                        </p>
                      </div>

                      {isPro ? (
                        <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-900">
                          Más elegido
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-5">
                      <div className="text-3xl font-semibold tracking-tight text-zinc-900">
                        {plan.priceByRegion[region]}
                      </div>
                      <div className="mt-1 text-sm text-zinc-500">
                        {region === "AR"
                          ? `Argentina · ${plan.billingNoteByRegion.AR}`
                          : `Internacional · ${plan.billingNoteByRegion.INTL}`}
                      </div>
                    </div>

                    <p className="mt-6 text-2xl font-semibold leading-[1.35] tracking-tight text-zinc-900">
                      {plan.headline}
                    </p>

                    <p className="mt-4 text-base leading-7 text-zinc-600">
                      {plan.description}
                    </p>

                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-3 text-sm leading-6 text-zinc-700"
                        >
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-zinc-900" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-2">
                    {plan.checkout ? (
                      <button
                        type="button"
                        onClick={() => handleCheckout(plan)}
                        disabled={loadingPlan === plan.name}
                        className={buttonClass}
                      >
                        {loadingPlan === plan.name
                          ? "Redirigiendo..."
                          : plan.ctaLabel}
                      </button>
                    ) : (
                      <Link
                        href={plan.ctaHref ?? "/login"}
                        className={buttonClass}
                      >
                        {plan.ctaLabel}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Cómo elegir
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
              Elegí según el tipo de uso que necesitás hoy
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {decisionCards.map((item) => (
              <div key={item.title} className="card p-6">
                <p className="text-base font-medium text-zinc-900">
                  {item.title}
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 py-14 sm:py-16 lg:py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Preguntas frecuentes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
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

      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="container-page text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Empezá gratis, resolvé un caso puntual o pasá a seguimiento
            continuo.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            Elegí la modalidad que mejor encaje con tu forma de evaluar terceros
            hoy y escalá cuando realmente lo necesites.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/login" className="btn btn-primary w-full sm:w-auto">
              Comenzar gratis
            </Link>
            <Link href="/" className="btn btn-secondary w-full sm:w-auto">
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
