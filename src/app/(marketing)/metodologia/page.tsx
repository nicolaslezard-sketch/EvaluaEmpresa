import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metodología de evaluación de terceros",
  description:
    "Conocé la metodología de EvaluaEmpresa para evaluar terceros con pilares, criterios estructurados, comparativa entre ciclos y hallazgos priorizados.",
  alternates: {
    canonical: "/metodologia",
  },
};

export default function MetodologiaPage() {
  const pillars = [
    {
      title: "1. Pilar Financiero",
      description:
        "Evalúa solvencia, estabilidad y señales que puedan afectar la continuidad o la capacidad de respuesta del tercero.",
    },
    {
      title: "2. Pilar Comercial",
      description:
        "Analiza concentración, dependencia, diversificación y fortaleza del modelo comercial para detectar fragilidad o exposición excesiva.",
    },
    {
      title: "3. Pilar Operativo",
      description:
        "Observa consistencia operativa, capacidad de ejecución y vulnerabilidades que puedan impactar en el funcionamiento real del tercero.",
    },
    {
      title: "4. Pilar Legal",
      description:
        "Revisa señales que puedan comprometer continuidad, cumplimiento o estabilidad desde el punto de vista legal y documental.",
    },
    {
      title: "5. Pilar Estratégico",
      description:
        "Considera dirección, sostenibilidad, capacidad de adaptación y perspectiva general para entender si el tercero tiene una base sólida hacia adelante.",
    },
  ];

  const outcomes = [
    "Score general",
    "Categoría ejecutiva",
    "Radar por 5 pilares",
    "Cambios entre ciclos",
    "Hallazgos priorizados",
    "Acción sugerida",
    "PDF ejecutivo",
  ];

  return (
    <div className="bg-white">
      <section className="border-b border-zinc-200 bg-linear-to-b from-white via-sky-50/50 to-white">
        <div className="container-page max-w-4xl py-20">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
            Metodología
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
            Una estructura común para evaluar terceros con más criterio y mejor
            comparativa entre ciclos
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-600">
            EvaluaEmpresa organiza cada revisión en cinco pilares consistentes
            para que el análisis no dependa de memoria, documentos sueltos o
            criterios cambiantes. La metodología no reemplaza el juicio del
            evaluador: lo ordena, lo vuelve comparable y deja más trazabilidad
            sobre lo que cambió.
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page max-w-4xl">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Qué busca resolver
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              El problema no suele ser solo evaluar, sino sostener un criterio
              común en el tiempo
            </h2>

            <p className="mt-4 text-base leading-7 text-zinc-600">
              Cuando cada revisión se hace distinto, después cuesta comparar
              empresas, justificar decisiones y detectar deterioros entre un
              ciclo y otro. Por eso la metodología pone una estructura fija
              sobre cinco dimensiones clave del tercero evaluado.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="card p-6">
              <p className="text-base font-medium text-zinc-900">
                Más consistencia
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Cada evaluación parte de una misma estructura y evita que el
                criterio cambie demasiado entre casos.
              </p>
            </div>

            <div className="card p-6">
              <p className="text-base font-medium text-zinc-900">
                Mejor comparativa
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Permite ver con más claridad qué empeoró, qué mejoró y qué se
                mantuvo entre evaluaciones.
              </p>
            </div>

            <div className="card p-6">
              <p className="text-base font-medium text-zinc-900">
                Más respaldo interno
              </p>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Deja una lectura más defendible para continuidad, revisión o
                escalamiento de un caso.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-sky-100 bg-sky-50/40 py-20">
        <div className="container-page max-w-4xl">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Los 5 pilares
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              La evaluación se organiza sobre cinco dimensiones reales del
              tercero
            </h2>

            <p className="mt-4 text-base leading-7 text-zinc-600">
              Cada pilar ayuda a detectar señales distintas. La combinación de
              los cinco permite construir una lectura más completa del estado
              actual y de su evolución en el tiempo.
            </p>
          </div>

          <div className="mt-10 space-y-6">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm"
              >
                <h2 className="text-lg font-medium text-zinc-900">
                  {pillar.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page max-w-4xl">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Qué produce la metodología
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              La estructura no termina en un score: deja una salida útil para
              decidir
            </h2>

            <p className="mt-4 text-base leading-7 text-zinc-600">
              Al finalizar una evaluación, la información se traduce en una
              salida clara para leer estado actual, comparar contra ciclos
              anteriores y compartir una síntesis más ejecutiva.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((item) => (
              <div key={item} className="card p-5">
                <p className="text-sm font-medium text-zinc-900">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 py-20">
        <div className="container-page max-w-4xl">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              En la práctica
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
              Una metodología útil no solo ordena: ayuda a detectar deterioros y
              sostener decisiones
            </h2>

            <p className="mt-4 text-base leading-7 text-zinc-600">
              El objetivo no es llenar una ficha. Es tener una forma más clara
              de revisar terceros, detectar señales relevantes, comparar ciclos
              y respaldar por qué un caso puede continuar, requerir monitoreo
              reforzado o escalar internamente.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
