import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ReportJson } from "@/lib/types/report";
import { safeJsonParse } from "@/lib/analysis/parseReport";
import { validateAndNormalizeReport } from "@/lib/analysis/validateReport";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
      {children}
    </span>
  );
}

function StatusBox({ status, reportId, lastError, attempts }: any) {
  if (status === "PENDING_PAYMENT") {
    return (
      <div className="card p-6">
        <p className="text-sm font-medium text-zinc-900">Pendiente de pago</p>
        <p className="mt-2 text-sm text-zinc-600">
          Para generar el informe, completá el pago.
        </p>
        <div className="mt-6">
          <form action={`/api/mp/preference`} method="post">
            <input type="hidden" name="reportId" value={reportId} />
            <button className="btn btn-primary" type="submit">
              Ir a pagar
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (status === "PAID" || status === "GENERATING") {
    const messages = [
      "Analizando consistencia financiera…",
      "Evaluando exposición comercial…",
      "Revisando riesgo operativo…",
      "Sintetizando estructura legal…",
      "Construyendo score ejecutivo…",
    ];

    return (
      <div className="card p-6">
        <p className="text-sm font-medium text-zinc-900">
          Generando evaluación
        </p>
        <p className="mt-2 text-sm text-zinc-600">
          El informe se está construyendo. Podés dejar esta pantalla abierta.
        </p>

        <div className="mt-6 space-y-2">
          {messages.map((m) => (
            <div
              key={m}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
            >
              {m}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <form action={`/api/report/${reportId}/generate`} method="post">
            <button className="btn btn-secondary" type="submit">
              Reintentar generación (si queda trabado)
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (status === "FAILED") {
    return (
      <div className="card p-6">
        <p className="text-sm font-medium text-zinc-900">No se pudo generar</p>
        <p className="mt-2 text-sm text-zinc-600">
          Ocurrió un error al generar el informe.
        </p>
        {lastError && <p className="mt-3 text-xs text-zinc-500">{lastError}</p>}
        <div className="mt-6">
          {attempts < 3 ? (
            <form action={`/api/report/${reportId}/generate`} method="post">
              <button className="btn btn-primary" type="submit">
                Reintentar
              </button>
            </form>
          ) : (
            <p className="text-sm text-zinc-600">
              Se alcanzó el máximo de intentos. Contactanos para asistencia.
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export default async function AnalysisPage({
  params,
}: {
  params: { id: string };
}) {
  const report = await prisma.reportRequest.findUnique({
    where: { id: params.id },
  });

  if (!report) notFound();

  // si no está DELIVERED, mostramos pantalla de estado premium
  if (report.status !== "DELIVERED") {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Evaluación
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Estado de la evaluación y generación del informe.
            </p>
          </div>
          <div className="flex gap-2">
            <Link className="btn btn-secondary" href="/app/dashboard">
              Volver al dashboard
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <StatusBox
            status={report.status}
            reportId={report.id}
            lastError={report.lastError}
            attempts={report.attempts}
          />
        </div>
      </div>
    );
  }

  // DELIVERED: render premium con reportData
  let data: ReportJson | null = null;

  if (report.reportData) {
    data = report.reportData as any;
  } else if (report.reportText) {
    try {
      const raw = safeJsonParse(report.reportText);
      data = validateAndNormalizeReport(raw).report;
    } catch {
      data = null;
    }
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="card p-6">
          <p className="text-sm font-medium text-zinc-900">
            No se pudo leer el informe
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            El informe está entregado, pero el formato no es válido. Reintentá
            la generación.
          </p>
          <div className="mt-6">
            <form action={`/api/report/${report.id}/generate`} method="post">
              <button className="btn btn-primary" type="submit">
                Reintentar generación
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const overall = data.portada.e_score_general.score_total;
  const risk = data.portada.e_score_general.nivel_general;
  const company = data.portada.nombre_empresa;

  return (
    <div className="mx-auto max-w-5xl">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Informe E-Score™
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
            {company}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            {data.portada.objetivo_analisis}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill>{data.portada.fecha}</Pill>
            <Pill>Argentina</Pill>
          </div>
        </div>

        <div className="flex gap-3">
          <Link className="btn btn-secondary" href="/app/dashboard">
            Dashboard
          </Link>
          {report.pdfKey && (
            <a
              className="btn btn-primary"
              href={`/api/report/download/${report.id}`}
            >
              Descargar PDF
            </a>
          )}
        </div>
      </div>

      {/* SCORE */}
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="card p-6 md:col-span-1">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            E-Score™ General
          </p>
          <p className="mt-2 text-5xl font-semibold text-zinc-900">
            {overall.toFixed(1)}
          </p>
          <p className="mt-2 text-sm font-medium text-zinc-800">{risk}</p>

          <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs text-zinc-500">Resumen ejecutivo</p>
            <p className="mt-2 text-sm text-zinc-700">
              {data.resumen_ejecutivo}
            </p>
          </div>
        </div>

        <div className="card p-6 md:col-span-2">
          <p className="text-sm font-semibold text-zinc-900">
            Radar por pilares
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            {data.grafico_radar.descripcion_visual}
          </p>

          {/* radar SVG simple (premium sin libs) */}
          <div className="mt-6">
            <RadarChart
              values={[
                data.grafico_radar.financiero,
                data.grafico_radar.comercial,
                data.grafico_radar.operativo,
                data.grafico_radar.legal_estructural,
                data.grafico_radar.estrategico,
              ]}
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-10 card p-6">
        <p className="text-sm font-semibold text-zinc-900">Scores por pilar</p>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-500">
                <th className="pb-3">Pilar</th>
                <th className="pb-3">Score</th>
                <th className="pb-3">Nivel</th>
                <th className="pb-3">Indicadores</th>
              </tr>
            </thead>
            <tbody>
              {data.pilares.map((p) => (
                <tr key={p.nombre} className="border-t border-zinc-200">
                  <td className="py-4 font-medium text-zinc-900">{p.nombre}</td>
                  <td className="py-4 text-zinc-900">
                    {Number(p.score).toFixed(1)}
                  </td>
                  <td className="py-4 text-zinc-700">{p.nivel}</td>
                  <td className="py-4 text-zinc-700">
                    {p.indicadores_clave?.slice(0, 3).join(" • ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRITICAL FACTORS + SCENARIOS */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <p className="text-sm font-semibold text-zinc-900">
            Factores críticos
          </p>
          <div className="mt-5 space-y-4">
            {data.factores_criticos?.slice(0, 6).map((f, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-zinc-200 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-900">
                    {f.factor}
                  </p>
                  <Pill>Impacto {f.impacto}</Pill>
                </div>
                <p className="mt-2 text-sm text-zinc-600">{f.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <p className="text-sm font-semibold text-zinc-900">
            Escenarios potenciales
          </p>
          <div className="mt-5 space-y-4">
            <Scenario
              title="Conservador"
              text={data.escenarios_potenciales.conservador}
            />
            <Scenario
              title="Intermedio"
              text={data.escenarios_potenciales.intermedio}
            />
            <Scenario
              title="Adverso"
              text={data.escenarios_potenciales.adverso}
            />
          </div>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <div className="mt-10 card p-6">
        <p className="text-sm font-semibold text-zinc-900">
          Recomendaciones accionables
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {data.recomendaciones_estrategicas?.slice(0, 12).map((r, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-zinc-200 bg-white p-4"
            >
              <p className="text-sm text-zinc-700">{r}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CONCLUSION + LEGAL */}
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="card p-6">
          <p className="text-sm font-semibold text-zinc-900">
            Conclusión ejecutiva
          </p>
          <p className="mt-3 text-sm text-zinc-700">
            {data.conclusion_ejecutiva}
          </p>
        </div>

        <div className="card p-6">
          <p className="text-sm font-semibold text-zinc-900">
            Alcance y limitaciones
          </p>
          <p className="mt-3 text-sm text-zinc-700">
            {data.alcance_y_limitaciones}
          </p>
          <p className="mt-4 text-xs text-zinc-500">
            Informe orientativo. No constituye asesoramiento legal, contable ni
            financiero.
          </p>
        </div>
      </div>
    </div>
  );
}

function Scenario({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{title}</p>
      <p className="mt-2 text-sm text-zinc-700">{text}</p>
    </div>
  );
}

function RadarChart({ values }: { values: number[] }) {
  const max = 5;
  const cx = 160;
  const cy = 140;
  const radius = 96;

  const toPoint = (i: number, v: number) => {
    const angle = -Math.PI / 2 + (i * (2 * Math.PI)) / 5;
    const r = (v / max) * radius;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  };

  const polygon = values
    .map((v, i) => {
      const p = toPoint(i, v);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");

  const ring = (k: number) => {
    const r = (k / max) * radius;
    return new Array(5)
      .fill(0)
      .map((_, i) => {
        const angle = -Math.PI / 2 + (i * (2 * Math.PI)) / 5;
        return `${(cx + Math.cos(angle) * r).toFixed(1)},${(cy + Math.sin(angle) * r).toFixed(1)}`;
      })
      .join(" ");
  };

  return (
    <svg viewBox="0 0 320 280" className="w-full">
      <polygon
        points={ring(1)}
        fill="none"
        stroke="rgb(228 228 231)"
        strokeWidth="1"
      />
      <polygon
        points={ring(2)}
        fill="none"
        stroke="rgb(228 228 231)"
        strokeWidth="1"
      />
      <polygon
        points={ring(3)}
        fill="none"
        stroke="rgb(228 228 231)"
        strokeWidth="1"
      />
      <polygon
        points={ring(4)}
        fill="none"
        stroke="rgb(228 228 231)"
        strokeWidth="1"
      />

      <polygon
        points={polygon}
        fill="rgba(24,24,27,0.10)"
        stroke="rgb(24 24 27)"
        strokeWidth="2"
      />
      {values.map((v, i) => {
        const p = toPoint(i, v);
        return (
          <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="rgb(24 24 27)" />
        );
      })}
    </svg>
  );
}
