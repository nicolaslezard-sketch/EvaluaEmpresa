import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section className="container-page py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Informe Ejecutivo de Riesgo Empresarial
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
            Decisiones comerciales con estructura.
          </h1>

          <p className="mt-6 text-lg text-zinc-600">
            EvaluaEmpresa organiza información empresarial en un marco
            metodológico estructurado (E-Score™) para reducir incertidumbre
            antes de invertir, asociarse o otorgar crédito comercial.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link href="/new" className="btn btn-primary">
              Iniciar evaluación
            </Link>

            <Link href="/demo" className="btn btn-secondary">
              Ver demo del informe
            </Link>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="bg-white py-20 border-t border-zinc-200">
        <div className="container-page grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              El problema
            </h2>
            <p className="mt-4 text-zinc-600">
              Muchas decisiones empresariales se toman por intuición,
              información incompleta o análisis informal.
            </p>
            <p className="mt-4 text-zinc-600">
              EvaluaEmpresa estructura el análisis en cinco pilares clave,
              prioriza riesgos críticos y genera un informe ejecutivo claro.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="card p-6">
              <p className="text-sm font-medium text-zinc-900">
                Perfil Empresarial
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                Identidad, estructura y posicionamiento.
              </p>
            </div>

            <div className="card p-6">
              <p className="text-sm font-medium text-zinc-900">
                Finanzas y Solvencia
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                Indicadores clave de estabilidad.
              </p>
            </div>

            <div className="card p-6">
              <p className="text-sm font-medium text-zinc-900">
                Riesgos Operativos y Legales
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                Identificación estructurada de vulnerabilidades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIACIÓN */}
      <section className="container-page py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
          No es un generador de PDF.
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="card p-6">
            <p className="font-medium text-zinc-900">
              Metodología estructurada
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Evaluación en múltiples dimensiones con scoring comparativo.
            </p>
          </div>

          <div className="card p-6">
            <p className="font-medium text-zinc-900">Síntesis ejecutiva</p>
            <p className="mt-2 text-sm text-zinc-600">
              Factores críticos priorizados y recomendaciones accionables.
            </p>
          </div>

          <div className="card p-6">
            <p className="font-medium text-zinc-900">Evolución histórica</p>
            <p className="mt-2 text-sm text-zinc-600">
              Comparación entre evaluaciones (según plan).
            </p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-white border-t border-zinc-200 py-20">
        <div className="container-page text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Reducí incertidumbre antes de decidir.
          </h2>

          <div className="mt-8 flex justify-center gap-4">
            <Link href="/new" className="btn btn-primary">
              Iniciar evaluación
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
