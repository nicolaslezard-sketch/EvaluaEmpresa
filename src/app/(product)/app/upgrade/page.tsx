"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UpgradePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onUpgrade() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/mercadopago/subscription/create", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data?.error || "No se pudo iniciar la suscripción");

      if (data?.alreadyPro) {
        router.push("/app/dashboard?upgrade=alreadyPro");
        return;
      }

      if (!data?.init_point)
        throw new Error("Respuesta inválida: falta init_point");

      window.location.href = data.init_point;
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Error iniciando suscripción");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-10 py-12">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Plan PRO
        </h1>
        <p className="mt-3 text-sm text-zinc-600">
          Seguimiento continuo, evolución histórica y herramientas avanzadas
          para gestión empresarial.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Incluye</h2>

        <ul className="mt-6 space-y-3 text-sm text-zinc-700">
          <li>✔ Evolución histórica completa</li>
          <li>✔ Comparación avanzada entre evaluaciones</li>
          <li>✔ Seguimiento mensual</li>
          <li>✔ Dashboard extendido</li>
        </ul>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={onUpgrade}
            disabled={loading}
            className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {loading ? "Iniciando…" : "Activar Plan PRO"}
          </button>
        </div>

        <p className="mt-4 text-xs text-zinc-500">
          Se te va a redirigir a MercadoPago para completar la suscripción.
        </p>
      </div>
    </div>
  );
}
