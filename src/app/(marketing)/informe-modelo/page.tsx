import Link from "next/link";

export default function InformeModeloPage() {
  return (
    <div className="container-page py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
        Informe modelo
      </h1>
      <p className="mt-6 max-w-3xl text-zinc-600">
        Vista de referencia para entender el formato: score general, radar por
        pilares y síntesis ejecutiva. El contenido real se genera según la
        información provista.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <div className="card p-6 md:col-span-1">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            E-Score™ General
          </p>
          <p className="mt-2 text-5xl font-semibold text-zinc-900">3.3</p>
          <p className="mt-2 text-sm text-zinc-600">Riesgo Medio</p>

          <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs text-zinc-500">Síntesis</p>
            <p className="mt-2 text-sm text-zinc-700">
              Riesgo moderado con foco en concentración comercial y orden legal
              estructural.
            </p>
          </div>
        </div>

        <div className="card p-6 md:col-span-2">
          <p className="text-sm font-semibold text-zinc-900">
            Estructura del informe
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              "Score por pilar + radar",
              "Factores críticos priorizados",
              "Escenarios potenciales",
              "Recomendaciones accionables",
              "Conclusión ejecutiva",
              "Alcance y limitaciones",
            ].map((t) => (
              <div
                key={t}
                className="rounded-2xl border border-zinc-200 bg-white p-4"
              >
                <p className="text-sm text-zinc-700">{t}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Preview
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              El informe completo se ve dentro de la plataforma y también se
              entrega en PDF.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex gap-3">
        <Link href="/pricing" className="btn btn-secondary">
          Ver pricing
        </Link>
        <Link href="/app/new/pyme" className="btn btn-primary">
          Iniciar evaluación
        </Link>
      </div>
    </div>
  );
}
