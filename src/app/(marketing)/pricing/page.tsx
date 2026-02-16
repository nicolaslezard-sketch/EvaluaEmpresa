import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="container-page py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
        Planes
      </h1>
      <p className="mt-6 max-w-2xl text-zinc-600">
        EvaluaEmpresa ofrece evaluaciones estructuradas bajo metodología
        E-Score™. Elegí el nivel de profundidad que necesitás.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {/* INFORME INDIVIDUAL */}
        <div className="card p-8 border">
          <p className="text-lg font-semibold text-zinc-900">
            Informe individual
          </p>
          <p className="mt-4 text-3xl font-semibold text-zinc-900">
            USD 15{" "}
            <span className="text-base text-zinc-500">/ ARS equivalente</span>
          </p>

          <ul className="mt-6 space-y-3 text-sm text-zinc-700">
            <li>• Informe completo (1 evaluación)</li>
            <li>• PDF premium</li>
            <li>• Sin histórico</li>
            <li>• Sin evolución</li>
          </ul>

          <div className="mt-8">
            <Link href="/app/new/pyme" className="btn btn-primary w-full">
              Generar informe
            </Link>
          </div>
        </div>

        {/* PYME */}
        <div className="card p-8 border border-zinc-900 relative">
          <div className="absolute -top-3 right-4 bg-zinc-900 text-white text-xs px-3 py-1 rounded-full">
            Más usado
          </div>

          <p className="text-lg font-semibold text-zinc-900">Plan PYME</p>

          <p className="mt-4 text-3xl font-semibold text-zinc-900">
            USD 29{" "}
            <span className="text-base text-zinc-500">/ ARS equivalente</span>
          </p>

          <ul className="mt-6 space-y-3 text-sm text-zinc-700">
            <li>• Informe + PDF</li>
            <li>• Histórico de evaluaciones</li>
            <li>• Evolución básica</li>
            <li>• Ideal para seguimiento mensual</li>
          </ul>

          <div className="mt-8">
            <Link href="/app/new/pyme" className="btn btn-primary w-full">
              Comenzar PYME
            </Link>
          </div>
        </div>

        {/* EMPRESA */}
        <div className="card p-8 border">
          <p className="text-lg font-semibold text-zinc-900">Plan Empresa</p>

          <p className="mt-4 text-3xl font-semibold text-zinc-900">
            USD 79{" "}
            <span className="text-base text-zinc-500">/ ARS equivalente</span>
          </p>

          <ul className="mt-6 space-y-3 text-sm text-zinc-700">
            <li>• Profundidad máxima</li>
            <li>• Dashboard + evolución avanzada</li>
            <li>• Priorización crítica extendida</li>
            <li>• Alertas estratégicas</li>
          </ul>

          <div className="mt-8">
            <Link href="/app/new/empresa" className="btn btn-secondary w-full">
              Comenzar Empresa
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-12 text-xs text-zinc-500">
        El informe es orientativo y se basa en información declarada por el
        solicitante. No constituye auditoría ni asesoramiento legal o contable.
      </p>
    </div>
  );
}
