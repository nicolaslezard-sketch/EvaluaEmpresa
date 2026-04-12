import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Evaluación de proveedores",
  description:
    "Evaluá proveedores con una metodología estructurada, detectá deterioros entre ciclos y presentá resultados claros con EvaluaEmpresa.",
  alternates: {
    canonical: "/evaluacion-de-proveedores",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Para qué sirve una evaluación de proveedores?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sirve para ordenar criterios, detectar señales de deterioro y tomar decisiones con más consistencia sobre terceros relevantes.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cada cuánto conviene reevaluar un proveedor?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende del nivel de criticidad, pero lo importante no es solo evaluar, sino poder comparar ciclos para detectar cambios relevantes.",
      },
    },
    {
      "@type": "Question",
      name: "¿EvaluaEmpresa reemplaza el criterio del analista?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Lo ordena y lo vuelve más consistente. La herramienta ayuda a estructurar la evaluación y a visualizar mejor resultados y variaciones.",
      },
    },
    {
      "@type": "Question",
      name: "¿Se puede usar para proveedores críticos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí. Cuanto más crítico es el proveedor, más valor tiene una evaluación estructurada y una comparativa clara entre ciclos.",
      },
    },
  ],
};

export default function EvaluacionDeProveedoresPage() {
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
                Solución para evaluación y seguimiento de terceros
              </p>

              <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                Evaluación de proveedores con criterio claro y comparativa entre
                ciclos
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
                EvaluaEmpresa te permite ordenar la evaluación de proveedores
                con una metodología estructurada, detectar deterioros relevantes
                y presentar resultados ejecutivos sin depender de planillas
                dispersas.
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
                  Metodología estructurada
                </span>
                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-900">
                  Comparativa entre ciclos
                </span>
                <span className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-sky-900">
                  Salida ejecutiva clara
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
                Muchas empresas evalúan proveedores con criterios poco
                homogéneos y poca trazabilidad entre un ciclo y otro
              </h2>
              <p className="mt-4 text-base leading-7 text-zinc-600">
                Eso genera ruido, decisiones tardías y reportes difíciles de
                defender. Cuando no hay una estructura común, se vuelve más
                difícil entender si un proveedor realmente mejoró, se mantuvo o
                empezó a deteriorarse.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="card p-6">
                <p className="text-base font-medium text-zinc-900">Antes</p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
                  <li>• Evaluaciones armadas de forma distinta en cada caso</li>
                  <li>• Poco contexto entre revisiones previas y actuales</li>
                  <li>• Dificultad para detectar deterioros relevantes</li>
                  <li>• Reportes poco claros para decisión interna</li>
                </ul>
              </div>

              <div className="card p-6">
                <p className="text-base font-medium text-zinc-900">
                  Con EvaluaEmpresa
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-600">
                  <li>• Metodología consistente y repetible</li>
                  <li>• Comparación entre ciclos evaluados</li>
                  <li>• Hallazgos priorizados y foco de atención</li>
                  <li>• Salida ejecutiva más clara y defendible</li>
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
                Una forma más ordenada de evaluar proveedores y seguir su
                evolución
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
                <p className="text-base font-medium text-zinc-900">
                  Estandarizar criterios
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Usá una estructura común para que cada evaluación tenga más
                  consistencia y sea más comparable.
                </p>
              </div>

              <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
                <p className="text-base font-medium text-zinc-900">
                  Detectar deterioros antes
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Compará contra ciclos previos para ver señales de
                  empeoramiento antes de que el problema escale.
                </p>
              </div>

              <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
                <p className="text-base font-medium text-zinc-900">
                  Respaldar decisiones
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Presentá resultados claros con score, categoría, hallazgos y
                  foco de atención.
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
                Tres pasos para ordenar la evaluación de proveedores
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <div className="card p-6">
                <p className="text-sm font-medium text-sky-800">Paso 1</p>
                <p className="mt-3 text-lg font-semibold text-zinc-900">
                  Creás la empresa
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Registrás el proveedor y centralizás su seguimiento en un
                  único lugar.
                </p>
              </div>

              <div className="card p-6">
                <p className="text-sm font-medium text-sky-800">Paso 2</p>
                <p className="mt-3 text-lg font-semibold text-zinc-900">
                  Cargás la evaluación
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Completás la revisión con una estructura guiada para reflejar
                  la situación actual con más criterio.
                </p>
              </div>

              <div className="card p-6">
                <p className="text-sm font-medium text-sky-800">Paso 3</p>
                <p className="mt-3 text-lg font-semibold text-zinc-900">
                  Comparás y decidís mejor
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Obtenés score, categoría, variaciones entre ciclos y salida
                  ejecutiva lista para compartir.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-200 bg-zinc-50 py-20">
          <div className="container-page">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
                Casos donde más valor aporta
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
                Especialmente útil cuando el proveedor es relevante o crítico
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="card p-6">
                <p className="text-base font-medium text-zinc-900">
                  Proveedores críticos
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Cuanto más importante es el tercero para la operación, más
                  valor tiene seguirlo con una evaluación estructurada.
                </p>
              </div>

              <div className="card p-6">
                <p className="text-base font-medium text-zinc-900">
                  Carteras pequeñas o medianas
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Ideal para ordenar seguimiento sin armar un sistema complejo o
                  depender de planillas difíciles de sostener.
                </p>
              </div>

              <div className="card p-6">
                <p className="text-base font-medium text-zinc-900">
                  Seguimiento periódico
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Su valor crece cuando comparás revisiones en el tiempo y no
                  solo una foto aislada.
                </p>
              </div>

              <div className="card p-6">
                <p className="text-base font-medium text-zinc-900">
                  Comunicación interna
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Sirve para dejar una salida más clara para compras, riesgo,
                  finanzas o dirección.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container-page">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
                Preguntas frecuentes
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
                Lo importante sobre evaluación de proveedores
              </h2>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="card p-6">
                <p className="text-base font-medium text-zinc-900">
                  ¿Para qué sirve una evaluación de proveedores?
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Sirve para ordenar criterios, detectar señales de deterioro y
                  tomar decisiones con más consistencia sobre terceros
                  relevantes.
                </p>
              </div>

              <div className="card p-6">
                <p className="text-base font-medium text-zinc-900">
                  ¿Cada cuánto conviene reevaluar un proveedor?
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Depende del nivel de criticidad, pero lo importante no es solo
                  evaluar, sino poder comparar ciclos para detectar cambios
                  relevantes.
                </p>
              </div>

              <div className="card p-6">
                <p className="text-base font-medium text-zinc-900">
                  ¿EvaluaEmpresa reemplaza el criterio del analista?
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  No. Lo ordena y lo vuelve más consistente. La herramienta
                  ayuda a estructurar la evaluación y a visualizar mejor
                  resultados y variaciones.
                </p>
              </div>

              <div className="card p-6">
                <p className="text-base font-medium text-zinc-900">
                  ¿Se puede usar para proveedores críticos?
                </p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Sí. Cuanto más crítico es el proveedor, más valor tiene una
                  evaluación estructurada y una comparativa clara entre ciclos.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-linear-to-b from-white to-sky-50/40 py-20">
          <div className="container-page text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Ordená la evaluación de proveedores con una metodología más clara
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
              Centralizá evaluaciones, compará ciclos y obtené una salida más
              clara para seguimiento y decisión.
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
