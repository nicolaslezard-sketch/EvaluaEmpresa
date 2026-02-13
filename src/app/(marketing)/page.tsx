import Link from "next/link";
import { RadarPreview } from "@/components/visual/RadarPreview";

export default function HomePage() {
  return (
    <div className="bg-zinc-50">
      <section className="container-page py-20">
        <div className="grid items-center gap-16 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
              Diagnóstico empresarial estructurado para reducir riesgo en
              decisiones comerciales.
            </h1>

            <p className="mt-6 text-lg text-zinc-600">
              E-Score™ evalúa 5 pilares críticos, genera un score ejecutivo y
              permite seguimiento en el tiempo. No es un PDF: es un sistema.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/app/new"
                className="btn btn-primary px-6 py-3 text-base"
              >
                Iniciar evaluación
              </Link>

              <Link
                href="/demo"
                className="btn btn-secondary px-6 py-3 text-base"
              >
                Ver demo del sistema
              </Link>

              <Link
                href="/informe-modelo"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 self-center"
              >
                Ver informe modelo →
              </Link>
            </div>

            <div className="mt-10 grid gap-3 text-sm text-zinc-600">
              <div className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-zinc-400" />
                <p>
                  Score global + scores por pilar (financiero, comercial,
                  operativo, legal, estratégico).
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-zinc-400" />
                <p>Fortalezas, debilidades y recomendaciones accionables.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-zinc-400" />
                <p>Historial y evolución para decisiones recurrentes.</p>
              </div>
            </div>
          </div>

          <div className="card p-8">
            <RadarPreview />
          </div>
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              t: "1) Completás el formulario",
              d: "Recopilamos información clave por pilar y consistencia de respuestas.",
            },
            {
              t: "2) Recibís tu score",
              d: "Obtenés un diagnóstico estructurado y un nivel de riesgo claro.",
            },
            {
              t: "3) Hacés seguimiento",
              d: "Comparás evaluaciones y medís evolución en el tiempo.",
            },
          ].map((x) => (
            <div key={x.t} className="card p-6">
              <p className="text-sm font-semibold text-zinc-900">{x.t}</p>
              <p className="mt-2 text-sm text-zinc-600">{x.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/como-funciona" className="btn btn-secondary">
            Ver cómo funciona
          </Link>
        </div>
      </section>
    </div>
  );
}
