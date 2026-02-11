import Link from "next/link";
import { RadarPreview } from "@/components/visual/RadarPreview";

export default function HomePage() {
  return (
    <div className="bg-zinc-50">
      <section className="container-page py-20">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
              Evaluación estructurada de riesgo antes de incorporar un proveedor
              o socio estratégico.
            </h1>

            <p className="mt-6 text-lg text-zinc-600">
              E-Score™ analiza 5 pilares críticos y sintetiza el perfil de
              riesgo en un score ejecutivo claro, comparable y accionable.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/app/new"
                className="btn btn-primary px-6 py-3 text-base"
              >
                Iniciar evaluación
              </Link>

              <Link
                href="/informe-modelo"
                className="btn btn-secondary px-6 py-3 text-base"
              >
                Ver informe modelo
              </Link>
            </div>

            <p className="mt-6 text-sm text-zinc-500">
              Diseñado para decisiones comerciales relevantes: proveedores
              críticos, socios, acuerdos estratégicos e inversiones.
            </p>
          </div>

          <div className="card p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">
                  E-Score™ General
                </p>
                <p className="text-3xl font-semibold text-zinc-900">3.6 / 5</p>
              </div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                Riesgo Medio
              </span>
            </div>

            <RadarPreview />
            <p className="mt-4 text-xs text-zinc-500">
              Ejemplo ilustrativo. El score real se calcula según la información
              provista.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-white py-20">
        <div className="container-page">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Reducí incertidumbre antes de firmar, pagar o delegar.
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="card p-6">
              <p className="text-sm font-medium text-zinc-900">Estructura</p>
              <p className="mt-2 text-sm text-zinc-600">
                Un marco único de evaluación para comparar empresas bajo el
                mismo estándar.
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm font-medium text-zinc-900">
                Síntesis ejecutiva
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                Señales críticas, escenarios y recomendaciones accionables, sin
                ruido.
              </p>
            </div>
            <div className="card p-6">
              <p className="text-sm font-medium text-zinc-900">Decisión</p>
              <p className="mt-2 text-sm text-zinc-600">
                Un score claro para decidir si avanzar, mitigar o frenar.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <Link href="/metodologia" className="btn btn-secondary">
              Conocer la metodología
            </Link>
            <Link href="/pricing" className="btn btn-primary">
              Ver pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
