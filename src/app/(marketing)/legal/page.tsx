export default function LegalPage() {
  return (
    <div className="container-page py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
        Legal
      </h1>

      <div className="mt-10 space-y-6 max-w-3xl">
        <div className="card p-6">
          <p className="text-sm font-semibold text-zinc-900">Alcance</p>
          <p className="mt-2 text-sm text-zinc-600">
            EvaluaEmpresa entrega una evaluación estructurada orientativa basada
            en información provista por el solicitante. No constituye
            asesoramiento legal, contable ni financiero.
          </p>
        </div>

        <div className="card p-6">
          <p className="text-sm font-semibold text-zinc-900">Limitaciones</p>
          <p className="mt-2 text-sm text-zinc-600">
            La evaluación no reemplaza procesos formales de due diligence,
            auditoría o verificación documental. Para decisiones de alto
            impacto, se recomienda validación profesional.
          </p>
        </div>

        <div className="card p-6">
          <p className="text-sm font-semibold text-zinc-900">Responsabilidad</p>
          <p className="mt-2 text-sm text-zinc-600">
            El usuario declara que la información brindada es veraz a su leal
            saber y entender. EvaluaEmpresa no se responsabiliza por decisiones
            tomadas únicamente en base al informe.
          </p>
        </div>
      </div>
    </div>
  );
}
