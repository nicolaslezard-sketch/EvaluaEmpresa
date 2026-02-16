import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="container-page py-20">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Planes
        </h1>
        <p className="mt-4 text-zinc-600">
          Modelo híbrido: acceso gratuito con vista parcial, pago por informe
          individual o suscripción para uso recurrente.
        </p>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        {/* FREE */}
        <div className="card p-8">
          <p className="text-sm font-medium text-zinc-900">Free</p>
          <p className="mt-4 text-2xl font-semibold text-zinc-900">ARS 0</p>

          <ul className="mt-6 space-y-2 text-sm text-zinc-600">
            <li>• Score general</li>
            <li>• Categoría ejecutiva</li>
            <li>• Vista parcial</li>
          </ul>

          <Link
            href="/app/evaluations/new"
            className="btn btn-secondary mt-8 w-full"
          >
            Comenzar gratis
          </Link>
        </div>

        {/* INFORME */}
        <div className="card p-8 border-2 border-zinc-900">
          <p className="text-sm font-medium text-zinc-900">
            Informe individual
          </p>
          <p className="mt-4 text-2xl font-semibold text-zinc-900">
            Pago único
          </p>

          <ul className="mt-6 space-y-2 text-sm text-zinc-600">
            <li>• Informe completo</li>
            <li>• PDF premium</li>
            <li>• Sin suscripción</li>
          </ul>

          <Link
            href="/app/evaluations/new"
            className="btn btn-primary mt-8 w-full"
          >
            Generar informe
          </Link>
        </div>

        {/* PYME */}
        <div className="card p-8">
          <p className="text-sm font-medium text-zinc-900">Plan PyME</p>
          <p className="mt-4 text-2xl font-semibold text-zinc-900">
            Suscripción
          </p>

          <ul className="mt-6 space-y-2 text-sm text-zinc-600">
            <li>• Informes ilimitados</li>
            <li>• Histórico</li>
            <li>• Comparación evolutiva</li>
          </ul>

          <Link href="/app/billing" className="btn btn-secondary mt-8 w-full">
            Ver suscripción
          </Link>
        </div>
      </div>
    </div>
  );
}
