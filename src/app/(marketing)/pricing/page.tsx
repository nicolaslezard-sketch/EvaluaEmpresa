import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="container-page py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
        Pricing
      </h1>
      <p className="mt-6 max-w-2xl text-zinc-600">
        Un solo plan. Orientado a decisiones comerciales relevantes. Sin
        fricción, sin configuraciones.
      </p>

      <div className="mt-12 max-w-xl card p-8">
        <div className="flex items-baseline justify-between">
          <p className="text-lg font-semibold text-zinc-900">Plan E-Score™</p>
          <p className="text-3xl font-semibold text-zinc-900">
            ARS <span className="tracking-tight">XX.XXX</span>
          </p>
        </div>

        <p className="mt-3 text-sm text-zinc-600">
          Ideal para evaluar proveedores estratégicos, socios comerciales e
          inversiones.
        </p>

        <ul className="mt-6 space-y-3 text-sm text-zinc-700">
          <li>• E-Score™ general + score por pilar (5)</li>
          <li>• Radar chart + tabla ejecutiva</li>
          <li>• Factores críticos priorizados</li>
          <li>• Escenarios potenciales</li>
          <li>• Recomendaciones accionables</li>
          <li>• Informe en plataforma + PDF</li>
        </ul>

        <div className="mt-8 flex gap-3">
          <Link href="/app/new" className="btn btn-primary w-full">
            Iniciar evaluación
          </Link>
        </div>

        <p className="mt-4 text-xs text-zinc-500">
          El informe es orientativo y se basa en información declarada por el
          solicitante.
        </p>
      </div>
    </div>
  );
}
