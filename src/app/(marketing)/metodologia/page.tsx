export default function MetodologiaPage() {
  return (
    <div className="container-page py-20 max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Metodología E-Score™
      </h1>

      <p className="mt-6 text-zinc-600">
        E-Score™ es un marco metodológico estructurado que organiza la
        información empresarial en cinco pilares clave.
      </p>

      <div className="mt-10 space-y-6">
        <div className="card p-6">
          <h2 className="font-medium text-zinc-900">1. Perfil Empresarial</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Identidad, estructura societaria y posicionamiento.
          </p>
        </div>

        <div className="card p-6">
          <h2 className="font-medium text-zinc-900">2. Finanzas y Solvencia</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Indicadores financieros y estabilidad.
          </p>
        </div>

        <div className="card p-6">
          <h2 className="font-medium text-zinc-900">3. Modelo Comercial</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Diversificación, dependencia y escalabilidad.
          </p>
        </div>

        <div className="card p-6">
          <h2 className="font-medium text-zinc-900">
            4. Riesgos Operativos y Legales
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Vulnerabilidades estructurales.
          </p>
        </div>

        <div className="card p-6">
          <h2 className="font-medium text-zinc-900">5. Estrategia</h2>
          <p className="mt-2 text-sm text-zinc-600">
            Proyección, sostenibilidad y capacidad de adaptación.
          </p>
        </div>
      </div>
    </div>
  );
}
