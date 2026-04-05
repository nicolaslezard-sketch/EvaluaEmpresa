"use client";

import { useState } from "react";

export function UpgradeButton({ plan }: { plan: "PRO" | "BUSINESS" }) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    try {
      setLoading(true);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "subscription",
          plan,
          period: "monthly",
        }),
      });

      const raw = await res.text();
      let data: { checkoutUrl?: string; error?: string } = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error("El checkout devolvió una respuesta inválida.");
      }

      if (!res.ok) {
        throw new Error(data?.error || "No se pudo iniciar el checkout.");
      }

      if (!data.checkoutUrl) {
        throw new Error("El checkout no devolvió una URL válida.");
      }

      window.location.href = data.checkoutUrl;
    } catch (e) {
      alert(e instanceof Error ? e.message : "No se pudo iniciar el checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleCheckout}
      className="btn btn-primary w-full"
    >
      {loading ? "Redirigiendo..." : "Elegir plan"}
    </button>
  );
}
