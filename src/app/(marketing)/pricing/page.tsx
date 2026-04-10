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
  if (saved === "AR" || saved === "INTL") {
    return saved;
  }

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
  },
  {
    name: "Evaluación única",
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
    ctaHref: "/login",
  },
  {
    name: "Pro",
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
    ctaLabel: "Ver plan Pro",
    ctaHref: "/billing",
  },
  {
    name: "Business",
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
    ctaLabel: "Ver plan Business",
    ctaHref: "/billing",
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

export default function PricingPage() {
  const [region, setRegion] = useState<Region>(() => detectInitialRegion());

  useEffect(() => {
    window.localStorage.setItem("ee_pricing_region", region);
  }, [region]);

  const regionLabel =
    region === "AR" ? "Argentina (ARS)" : "Internacional (USD)";

  return (
    <div>
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
              Resolvé un caso puntual sin suscripción
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              La evaluación única sirve cuando necesitás un resultado completo
              con hallazgos, recomendaciones y PDF ejecutivo, sin pasar a un
              plan mensual.
            </p>
          </div>

          <div className="card p-6">
            <p className="text-base font-medium text-zinc-900">
              Pasá a seguimiento recurrente cuando lo necesites
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Pro y Business están pensados para sostener una práctica más
              continua, con comparativa entre ciclos, histórico y distintos
              niveles de profundidad de monitoreo.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="container-page">
          <div className="inline-flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-medium text-zinc-900">
              Mostrando precios para {regionLabel}
            </div>

            <div className="inline-flex rounded-xl border border-zinc-200 bg-zinc-50 p-1">
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
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 py-20">
        <div className="container-page">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Planes disponibles
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Elegí la modalidad que mejor encaje con tu forma de evaluar hoy
            </h2>
          </div>

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
                    : isBusiness
                      ? "rounded-3xl border border-emerald-200 bg-white p-8 shadow-[0_12px_32px_rgba(16,185,129,0.08)]"
                      : "rounded-3xl border border-zinc-200 bg-white p-8 shadow-[0_8px_24px_rgba(15,23,42,0.05)]";

              const nameClass = isFree
                ? "text-sm font-medium text-zinc-900"
                : isSingle
                  ? "text-sm font-semibold text-amber-700"
                  : isPro
                    ? "text-sm font-semibold text-sky-900"
                    : isBusiness
                      ? "text-sm font-semibold text-emerald-800"
                      : "text-sm font-medium text-zinc-900";

              return (
                <div
                  key={plan.name}
                  className={`${cardClass} flex h-full flex-col`}
                >
                  <div>
                    <p className={nameClass}>{plan.name}</p>

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
                      {isFree
                        ? "Para explorar el producto"
                        : isSingle
                          ? "Para resolver una necesidad puntual"
                          : isPro
                            ? "Para seguimiento completo de cartera chica"
                            : "Para monitoreo continuo de cartera más amplia"}
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
                          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-zinc-900" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-2">
                    <Link
                      href={plan.ctaHref}
                      className="btn btn-primary w-full"
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
