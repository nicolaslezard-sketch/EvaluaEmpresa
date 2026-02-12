"use client";

type Props = {
  status: string;
  reportId: string;
  lastError?: string | null;
  attempts: number;
};

export default function StatusBox({
  status,
  reportId,
  lastError,
  attempts,
}: Props) {
  if (status === "PENDING_PAYMENT") {
    return (
      <div className="card p-6">
        <p className="text-sm font-medium text-zinc-900">Pendiente de pago</p>
        <p className="mt-2 text-sm text-zinc-600">
          Para generar el informe, completá el pago.
        </p>

        <div className="mt-6">
          <button
            className="btn btn-primary"
            onClick={async () => {
              try {
                const res = await fetch("/api/mp/preference", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ reportId }),
                });

                const data = await res.json();

                if (data.init_point) {
                  window.location.href = data.init_point;
                } else {
                  alert("No se pudo iniciar el pago.");
                }
              } catch (error) {
                console.error("Error iniciando pago:", error);
                alert("Error iniciando el pago.");
              }
            }}
          >
            Ir a pagar
          </button>
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
