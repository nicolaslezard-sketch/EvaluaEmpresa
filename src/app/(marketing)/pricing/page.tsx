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
    name: "Prueba gratuita",
    eyebrow: "21 días gratis",
    headline: "Probá EvaluaEmpresa antes de elegir un plan",
    description:
      "Ideal para conocer el flujo, cargar empresas y entender cómo se ve el monitoreo antes de pasar a un plan pago.",
    features: [
      "Acceso de prueba por 21 días",
      "Ideal para validar el flujo",
      "Carga de empresas y evaluaciones",
      "Perfecto para conocer el sistema antes de pagar",
    ],
    priceByRegion: {
      AR: "Gratis",
      INTL: "Free",
    },
    billingNoteByRegion: {
      AR: "Sin cargo",
      INTL: "Free",
    },
    ctaLabel: "Comenzar prueba",
    ctaHref: "/login",
    tone: "default",
    checkout: null,
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
      "Sí. La prueba gratuita de 21 días te permite conocer el flujo, cargar empresas y entender cómo funciona el monitoreo antes de pasar a un plan pago.",
  },
  {
    question: "¿Cuándo conviene pasar a Pro?",
    answer:
      "Cuando la evaluación de terceros deja de ser algo aislado y pasa a formar parte de un seguimiento más frecuente, con comparativa entre ciclos, histórico y resultado completo.",
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
  {
    question: "¿Puedo cambiar de plan más adelante?",
    answer:
      "Sí. Podés empezar probando el producto y pasar a Pro o Business cuando realmente necesites más capacidad y seguimiento continuo.",
  },
];

const decisionCards = [
  {
    title: "Quiero probar antes de pagar",
    answer: "Empezá con la prueba gratuita de 21 días.",
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
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("ee_pricing_region", region);
    }
  }, [region]);

  async function handleCheckout(plan: (typeof plans)[number]) {
    if (!plan.checkout) return;

    try {
      setLoadingPlan(plan.name);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...plan.checkout,
          region,
        }),
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
          <div className="max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-500 sm:text-xs">
              Planes y acceso
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              Elegí cómo querés usar EvaluaEmpresa
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
              Podés empezar con una prueba gratuita de 21 días y pasar a un plan
              pago cuando realmente necesites seguimiento continuo y comparativa
              entre ciclos.
            </p>
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
              Empezá con una prueba gratuita de 21 días. Pro es la opción
              principal para seguimiento recurrente. Business amplía capacidad,
              histórico y profundidad de monitoreo.
            </p>
          </div>

          <div className="mb-8 rounded-3xl border-2 border-sky-100 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                  Moneda y checkout
                </p>
                <p className="mt-2 text-base font-semibold text-zinc-900">
                  Elegí cómo querés ver los precios y pagar
                </p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">
                  {region === "AR"
                    ? "Ahora estás viendo precios en ARS con checkout por Mercado Pago."
                    : "Ahora estás viendo precios en USD con checkout por Lemon Squeezy."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[430px]">
                <button
                  type="button"
                  onClick={() => setRegion("AR")}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    region === "AR"
                      ? "border-sky-300 bg-sky-50 shadow-sm"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <p className="text-sm font-semibold text-zinc-900">
                    ARS · Argentina
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Checkout con Mercado Pago
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRegion("INTL")}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    region === "INTL"
                      ? "border-sky-300 bg-sky-50 shadow-sm"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <p className="text-sm font-semibold text-zinc-900">
                    USD · Internacional
                  </p>
                  <p className="mt-1 text-sm text-zinc-600">
                    Checkout con Lemon Squeezy
                  </p>
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const isFree = plan.tone === "default";
              const isPro = plan.tone === "pro";
              const isBusiness = plan.tone === "business";

              const cardClass = isFree
                ? "relative rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
                : isPro
                  ? "relative rounded-3xl border-2 border-sky-300 bg-white p-6 shadow-[0_14px_36px_rgba(2,132,199,0.12)]"
                  : "relative rounded-3xl border-2 border-emerald-300 bg-white p-6 shadow-[0_14px_36px_rgba(16,185,129,0.10)]";

              const topAccentClass = isFree
                ? "bg-zinc-100"
                : isPro
                  ? "bg-sky-100"
                  : "bg-emerald-100";

              const eyebrowClass = isFree
                ? "text-xs font-medium uppercase tracking-[0.18em] text-zinc-500"
                : isPro
                  ? "text-xs font-semibold uppercase tracking-[0.18em] text-sky-900"
                  : "text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800";

              const priceWrapClass = isFree
                ? ""
                : isPro
                  ? "rounded-2xl border border-sky-100 bg-sky-50/70 p-4"
                  : "rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4";

              const buttonClass = isFree
                ? "btn btn-secondary w-full"
                : isPro
                  ? "btn btn-primary w-full"
                  : "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-emerald-300 bg-white px-4 py-2.5 text-sm font-medium text-emerald-800 transition hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100";

              return (
                <div
                  key={plan.name}
                  className={`${cardClass} flex h-full flex-col`}
                >
                  <div
                    className={`absolute inset-x-6 top-0 h-1 rounded-b-full ${topAccentClass}`}
                  />

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
                      ) : isBusiness ? (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-800">
                          Escala
                        </span>
                      ) : null}
                    </div>

                    <div className={`mt-5 ${priceWrapClass}`}>
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

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
            Empezá con una prueba gratuita y pasá a seguimiento continuo cuando
            lo necesites.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            Probá el producto, entendé el flujo y elegí el plan que mejor encaje
            con tu nivel de seguimiento cuando realmente lo necesites.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/login" className="btn btn-primary w-full sm:w-auto">
              Comenzar prueba
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
