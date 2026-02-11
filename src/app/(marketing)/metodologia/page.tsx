import Link from "next/link";

export default function MetodologiaPage() {
  return (
    <div className="container-page py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
        Metodología E-Score™
      </h1>
      <p className="mt-6 max-w-3xl text-zinc-600">
        EvaluaEmpresa aplica una evaluación estructurada de riesgo empresarial
        diseñada para decisiones comerciales relevantes: proveedores
        estratégicos, socios e inversiones. No es un informe crediticio oficial.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {[
          {
            t: "Riesgo Financiero",
            d: "Solidez, liquidez, consistencia y exposición a tensión de caja.",
          },
          {
            t: "Riesgo Comercial",
            d: "Dependencias, concentración, recurrencia y vulnerabilidad de ingresos.",
          },
          {
            t: "Riesgo Operativo",
            d: "Procesos, capacidad de entrega, continuidad y control interno.",
          },
          {
            t: "Riesgo Legal Estructural",
            d: "Orden societario básico, contratos críticos y exposición estructural.",
          },
          {
            t: "Riesgo Estratégico",
            d: "Dirección, foco, ejecución y resiliencia ante escenarios.",
          },
        ].map((x) => (
          <div key={x.t} className="card p-6">
            <p className="text-sm font-semibold text-zinc-900">{x.t}</p>
            <p className="mt-2 text-sm text-zinc-600">{x.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 card p-8">
        <p className="text-sm font-semibold text-zinc-900">Escala 1–5</p>
        <p className="mt-2 text-sm text-zinc-600">
          Cada pilar se califica de 1 a 5. Un E-Score™ más alto indica mejor
          perfil de riesgo relativo. El resultado incluye score por pilar, score
          general, factores críticos, escenarios y recomendaciones.
        </p>
      </div>

      <div className="mt-10 flex gap-3">
        <Link href="/informe-modelo" className="btn btn-secondary">
          Ver informe modelo
        </Link>
        <Link href="/app/new" className="btn btn-primary">
          Iniciar evaluación
        </Link>
      </div>
    </div>
  );
}
