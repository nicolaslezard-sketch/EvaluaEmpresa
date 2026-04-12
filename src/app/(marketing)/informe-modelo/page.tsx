import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Informe modelo de evaluación de terceros",
  description:
    "Mirá un ejemplo de informe ejecutivo generado con EvaluaEmpresa para presentar resultados, hallazgos y evolución entre ciclos.",
  alternates: {
    canonical: "/informe-modelo",
  },
};

const pillars = [
  {
    name: "Financiero",
    score: 72,
    note: "Estable, con señales a monitorear.",
  },
  {
    name: "Comercial",
    score: 61,
    note: "Mayor dependencia y concentración en clientes clave.",
  },
  {
    name: "Operativo",
    score: 58,
    note: "Desvíos recientes que requieren seguimiento prioritario.",
  },
  {
    name: "Legal",
    score: 74,
    note: "Situación general ordenada.",
  },
  {
    name: "Estratégico",
    score: 66,
    note: "Exposición moderada frente a cambios del entorno.",
  },
];

const findings = [
  "Desvíos en consistencia operativa que aumentan la exposición actual.",
  "Mayor dependencia comercial que vuelve más sensible la continuidad del vínculo.",
  "Deterioro frente al ciclo anterior por señales acumuladas en dimensiones clave.",
];

const recommendations = [
  "Reforzar revisión operativa en el próximo ciclo.",
  "Monitorear concentración comercial y dependencia de relaciones críticas.",
  "Validar si el deterioro reciente se estabiliza o si requiere escalamiento.",
];

const sections = [
  {
    title: "Score general y categoría ejecutiva",
    description:
      "Una lectura rápida para ubicar el nivel de exposición actual y su prioridad.",
  },
  {
    title: "Comparativa entre ciclos",
    description:
      "Cambios frente a evaluaciones anteriores para detectar deterioros o mejoras.",
  },
  {
    title: "Radar por 5 pilares",
    description:
      "Visibilidad por dimensión para entender dónde se concentra la fragilidad.",
  },
  {
    title: "Hallazgos priorizados",
    description:
      "Señales ordenadas por impacto para enfocar seguimiento donde más importa.",
  },
  {
    title: "Acción sugerida",
    description:
      "Una recomendación clara para reforzar revisión, sostener seguimiento o escalar.",
  },
  {
    title: "PDF ejecutivo",
    description:
      "Una salida lista para compartir internamente con mejor respaldo y trazabilidad.",
  },
];

export default function InformeModeloPage() {
  return (
    <div className="bg-white">
      <section className="border-b border-zinc-200 bg-linear-to-b from-white via-sky-50/60 to-white">
        <div className="container-page py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-sky-800 sm:text-xs">
              Informe modelo
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              Así se ve el resultado ejecutivo de una evaluación en
              EvaluaEmpresa
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
              Este ejemplo muestra el tipo de salida que obtenés al finalizar
              una evaluación: score general, lectura por pilares, comparativa
              entre ciclos, hallazgos priorizados y una síntesis ejecutiva más
              clara para decidir.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-page">
          <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 px-6 py-6 sm:px-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
                    Empresa evaluada
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
                    Industrial Delta S.A.
                  </h2>
                  <p className="mt-2 text-sm text-zinc-500">
                    Ejemplo ilustrativo de informe ejecutivo
                  </p>
                </div>

                <div className="rounded-2xl bg-sky-900 px-5 py-4 text-white">
                  <p className="text-xs uppercase tracking-wide text-zinc-300">
                    Score general
                  </p>
                  <p className="mt-1 text-3xl font-semibold">66.2</p>
                </div>
              </div>
            </div>

            <div className="grid gap-8 px-6 py-6 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-5">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">
                      Categoría ejecutiva
                    </p>
                    <p className="mt-2 text-lg font-semibold text-zinc-900">
                      Monitoreo reforzado
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      El caso mantiene continuidad posible, pero presenta
                      señales que justifican mayor seguimiento y atención sobre
                      dimensiones específicas.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">
                      Variación vs ciclo anterior
                    </p>
                    <p className="mt-2 text-lg font-semibold text-zinc-900">
                      -4.8 puntos
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">
                      El deterioro reciente se explica principalmente por
                      señales operativas y mayor sensibilidad comercial.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 p-5">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Hallazgos priorizados
                  </p>

                  <div className="mt-4 space-y-3">
                    {findings.map((item) => (
                      <div key={item} className="rounded-2xl bg-zinc-50 p-4">
                        <p className="text-sm leading-6 text-zinc-700">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
                  <p className="text-xs uppercase tracking-wide text-emerald-700">
                    Acción sugerida
                  </p>
                  <p className="mt-2 text-base font-semibold text-zinc-900">
                    Continuar con monitoreo reforzado
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    No se observa necesidad de escalar el caso de inmediato,
                    pero conviene sostener seguimiento más cercano y validar
                    evolución en próximos ciclos.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200 p-5">
                  <p className="text-xs uppercase tracking-wide text-zinc-500">
                    Recomendaciones concretas
                  </p>

                  <div className="mt-4 space-y-3">
                    {recommendations.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-zinc-200 bg-white p-4"
                      >
                        <p className="text-sm text-zinc-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <p className="text-sm font-semibold text-zinc-900">
                    Radar por 5 pilares
                  </p>

                  <div className="mt-5 space-y-4">
                    {pillars.map((pillar) => (
                      <div key={pillar.name}>
                        <div className="mb-2 flex items-center justify-between gap-4">
                          <p className="text-sm font-medium text-zinc-900">
                            {pillar.name}
                          </p>
                          <p className="text-sm font-semibold text-zinc-700">
                            {pillar.score}/100
                          </p>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                          <div
                            className="h-full rounded-full bg-sky-800"
                            style={{ width: `${pillar.score}%` }}
                          />
                        </div>

                        <p className="mt-2 text-xs leading-5 text-zinc-500">
                          {pillar.note}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <p className="text-sm font-semibold text-zinc-900">
                    Qué entrega la evaluación
                  </p>

                  <div className="mt-4 grid gap-3">
                    {sections.map((section) => (
                      <div
                        key={section.title}
                        className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4"
                      >
                        <p className="text-sm font-medium text-zinc-900">
                          {section.title}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-zinc-600">
                          {section.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-sky-100 bg-sky-50/50 p-6">
                  <p className="text-sm font-semibold text-zinc-900">
                    Importante
                  </p>
                  <p className="mt-3 text-sm leading-7 text-zinc-600">
                    Esta es una vista de referencia para entender la estructura
                    del resultado. El contenido real se genera según la
                    información cargada en cada evaluación y su comparación con
                    ciclos previos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-sky-100 bg-sky-50/40 py-20">
        <div className="container-page">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Qué aporta esta salida
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              No es solo un informe: es una forma más clara de respaldar
              decisiones
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-600">
              La salida ejecutiva te permite resumir estado actual, variaciones,
              focos de atención y criterio de seguimiento en un formato más
              claro para compras, riesgo, finanzas o dirección.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
              <p className="text-base font-medium text-zinc-900">
                Lectura rápida
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Resume el estado actual del tercero sin obligarte a recorrer
                toda la evaluación para entender la foto general.
              </p>
            </div>

            <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
              <p className="text-base font-medium text-zinc-900">
                Comparativa útil
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Muestra qué cambió entre ciclos para que el seguimiento tenga
                más contexto y menos interpretación aislada.
              </p>
            </div>

            <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
              <p className="text-base font-medium text-zinc-900">
                Mejor soporte interno
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Facilita compartir resultados y respaldar decisiones con más
                claridad y trazabilidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-6">
        <div className="container-page">
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
            <p className="text-sm font-semibold text-zinc-900">
              Seguí explorando
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/evaluacion-de-proveedores"
                className="text-sm font-medium text-sky-800 hover:text-sky-900"
              >
                Ver solución de evaluación de proveedores →
              </Link>
              <Link
                href="/monitoreo-de-terceros"
                className="text-sm font-medium text-sky-800 hover:text-sky-900"
              >
                Ver solución de monitoreo de terceros →
              </Link>
              <Link
                href="/metodologia"
                className="text-sm font-medium text-sky-800 hover:text-sky-900"
              >
                Ver metodología →
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-sky-800 hover:text-sky-900"
              >
                Ver planes →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Probá EvaluaEmpresa y generá evaluaciones con una salida más clara
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            Conocé el flujo, cargá empresas y entendé cómo se ve una evaluación
            estructurada antes de pasar a un plan pago.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/login" className="btn btn-primary w-full sm:w-auto">
              Comenzar prueba gratis
            </Link>
            <Link
              href="/pricing"
              className="btn btn-secondary w-full sm:w-auto"
            >
              Ver planes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
