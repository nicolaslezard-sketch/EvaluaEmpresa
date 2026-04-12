import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Monitoreo de terceros",
  description:
    "Monitoreá proveedores, clientes y contrapartes con comparativa entre ciclos, hallazgos priorizados y una salida ejecutiva clara con EvaluaEmpresa.",
  alternates: {
    canonical: "/monitoreo-de-terceros",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Qué significa monitorear terceros?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Significa revisar de forma periódica la evolución de proveedores, clientes o contrapartes para detectar cambios relevantes antes de que se transformen en un problema mayor.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuál es la diferencia entre evaluar y monitorear?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Evaluar es obtener una lectura estructurada de un ciclo puntual. Monitorear implica sostener revisiones en el tiempo para comparar ciclos y detectar deterioros, estabilidad o mejoras.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cada cuánto conviene monitorear un tercero?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende de la criticidad del caso. Cuanto más relevante es el tercero para la operación, más sentido tiene una frecuencia de revisión consistente y comparable.",
      },
    },
    {
      "@type": "Question",
      name: "¿Para qué sirve comparar ciclos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sirve para entender qué cambió realmente entre una revisión y otra, detectar deterioros antes y decidir con mejor criterio dónde poner atención.",
      },
    },
  ],
};

export default function MonitoreoDeTercerosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="min-h-screen bg-white text-zinc-900">
        <section className="border-b border-zinc-200 bg-linear-to-b from-white via-zinc-50 to-white">
          <div className="container-page py-14 sm:py-16 lg:py-20">
            <div className="max-w-4xl">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-sky-800 sm:text-xs">
                Seguimiento recurrente de proveedores, clientes y contrapartes
              </p>

              <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                Monitoreo de terceros con comparativa entre ciclos y foco en lo
                que cambió
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
                EvaluaEmpresa te ayuda a sostener un monitoreo más claro de
                terceros relevantes, comparar su evolución entre ciclos y
                detectar señales que justifican atención antes de que el
                problema escale.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/pricing"
                  className="btn btn-primary w-full sm:w-auto"
                >
                  Ver planes
                </Link>
                <Link
                  href="/informe-modelo"
                  className="btn btn-secondary w-full sm:w-auto"
                >
                  Ver informe modelo
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-900">
                  Comparativa entre ciclos
                </span>
                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-900">
                  Hallazgos priorizados
                </span>
                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-900">
                  Seguimiento más consistente
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container-page">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
                El problema
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
                Hacer una evaluación aislada no alcanza cuando el riesgo cambia
                con el tiempo
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-600">
                El valor real aparece cuando podés comparar revisiones, entender
                qué empeoró, qué se mantuvo y qué requiere seguimiento
                reforzado. Sin esa continuidad, el análisis pierde contexto y
                las decisiones llegan tarde.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="card p-6">
                <p className="text-base font-medium text-zinc-900">
                  Sin monitoreo claro
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
                  <li>• Revisiones aisladas y poco comparables</li>
                  <li>• Cambios relevantes detectados tarde</li>
                  <li>• Menos trazabilidad entre un ciclo y otro</li>
                  <li>• Más dependencia de memoria o criterio informal</li>
                </ul>
              </div>

              <div className="card p-6">
                <p className="text-base font-medium text-zinc-900">
                  Con EvaluaEmpresa
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
                  <li>• Lectura estructurada en cada ciclo</li>
                  <li>• Comparación clara de evolución</li>
                  <li>• Hallazgos priorizados y foco de atención</li>
                  <li>• Salida ejecutiva más fácil de compartir</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-sky-100 bg-sky-50/40 py-20">
          <div className="container-page">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
                Qué te permite hacer
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
                Seguir la evolución real de cada tercero sin perder contexto
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
                <p className="text-base font-medium text-zinc-900">
                  Comparar ciclos
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Entendé qué cambió entre revisiones y evitá analizar cada
                  evaluación como si fuera un caso aislado.
                </p>
              </div>

              <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
                <p className="text-base font-medium text-zinc-900">
                  Detectar deterioros
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Identificá señales de empeoramiento antes de que generen
                  impacto operativo, comercial o de control.
                </p>
              </div>

              <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
                <p className="text-base font-medium text-zinc-900">
                  Sostener criterio
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Aplicá una misma estructura de seguimiento para que la
                  evolución sea más clara y defendible.
                </p>
              </div>
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
                Un monitoreo más útil cuando lo repetís en el tiempo
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="card p-6">
                <p className="text-sm font-medium text-sky-800">Paso 1</p>
                <p className="mt-3 text-lg font-semibold text-zinc-900">
                  Registrás el tercero
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Centralizás la empresa o contraparte que querés seguir.
                </p>
              </div>

              <div className="card p-6">
                <p className="text-sm font-medium text-sky-800">Paso 2</p>
                <p className="mt-3 text-lg font-semibold text-zinc-900">
                  Hacés evaluaciones periódicas
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Cada revisión queda estructurada para que sea comparable con
                  las anteriores.
                </p>
              </div>

              <div className="card p-6">
                <p className="text-sm font-medium text-sky-800">Paso 3</p>
                <p className="mt-3 text-lg font-semibold text-zinc-900">
                  Detectás cambios y priorizás atención
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Obtenés una lectura más clara de estabilidad, mejora o
                  deterioro.
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
                Lo importante sobre monitoreo de terceros
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="card p-6">
                <p className="text-base font-medium text-zinc-900">
                  ¿Qué significa monitorear terceros?
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Significa revisar de forma periódica la evolución de
                  proveedores, clientes o contrapartes para detectar cambios
                  relevantes antes de que se transformen en un problema mayor.
                </p>
              </div>

              <div className="card p-6">
                <p className="text-base font-medium text-zinc-900">
                  ¿Cuál es la diferencia entre evaluar y monitorear?
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Evaluar es obtener una lectura estructurada de un ciclo
                  puntual. Monitorear implica sostener revisiones en el tiempo
                  para comparar ciclos y detectar deterioros, estabilidad o
                  mejoras.
                </p>
              </div>

              <div className="card p-6">
                <p className="text-base font-medium text-zinc-900">
                  ¿Cada cuánto conviene monitorear un tercero?
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Depende de la criticidad del caso. Cuanto más relevante es el
                  tercero para la operación, más sentido tiene una frecuencia de
                  revisión consistente y comparable.
                </p>
              </div>

              <div className="card p-6">
                <p className="text-base font-medium text-zinc-900">
                  ¿Para qué sirve comparar ciclos?
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Sirve para entender qué cambió realmente entre una revisión y
                  otra, detectar deterioros antes y decidir con mejor criterio
                  dónde poner atención.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-linear-to-b from-white to-sky-50/40 py-20">
          <div className="container-page text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Seguí la evolución de tus terceros con más claridad y menos ruido
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              Compará ciclos, detectá deterioros y respaldá mejor cada decisión
              con una salida ejecutiva clara.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/pricing"
                className="btn btn-primary w-full sm:w-auto"
              >
                Ver planes
              </Link>
              <Link
                href="/informe-modelo"
                className="btn btn-secondary w-full sm:w-auto"
              >
                Ver informe modelo
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
