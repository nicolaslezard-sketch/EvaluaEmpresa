import Link from "next/link";

export default function ComoFuncionaPage() {
  return (
    <div className="container-page py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
        Cómo funciona EvaluaEmpresa
      </h1>
      <p className="mt-6 max-w-3xl text-zinc-600">
        EvaluaEmpresa es un sistema de evaluación y seguimiento empresarial.
        Genera un diagnóstico estructurado y comparable en el tiempo. El informe
        es un output exportable: el valor está en el sistema.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="card p-6">
          <p className="text-sm font-semibold text-zinc-900">
            1) Evaluación estructurada
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            Completás un formulario por pilares. Detectamos inconsistencias y
            capturamos métricas relevantes.
          </p>
        </div>

        <div className="card p-6">
          <p className="text-sm font-semibold text-zinc-900">
            2) Score + diagnóstico
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            Obtenés score global y por pilar, nivel de riesgo, fortalezas,
            debilidades y recomendaciones accionables.
          </p>
        </div>

        <div className="card p-6">
          <p className="text-sm font-semibold text-zinc-900">
            3) Seguimiento y evolución
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            Guardamos snapshots para comparar evaluaciones y medir evolución en
            el tiempo.
          </p>
        </div>
      </div>

      <div className="mt-12 card p-8">
        <p className="text-sm font-semibold text-zinc-900">Importante</p>
        <p className="mt-2 text-sm text-zinc-600">
          El sistema no reemplaza asesoramiento legal, contable o financiero. No
          valida datos externos. El análisis se basa en información declarada
          por el usuario y es orientativo.
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-3 sm:flex-row">
        <Link href="/demo" className="btn btn-secondary">
          Ver demo del sistema
        </Link>
        <Link href="/app/new/pyme" className="btn btn-primary">
          Iniciar evaluación
        </Link>
      </div>
    </div>
  );
}
