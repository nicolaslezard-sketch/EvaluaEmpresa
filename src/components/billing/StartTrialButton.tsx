"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function StartTrialButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleStartTrial() {
    try {
      setLoading(true);

      const res = await fetch("/api/billing/trial", {
        method: "POST",
      });

      const raw = await res.text();
      let data: { error?: string; message?: string } = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error("La respuesta del trial no fue válida.");
      }

      if (!res.ok) {
        throw new Error(
          data.message || data.error || "No se pudo activar el trial.",
        );
      }

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "No se pudo activar el trial.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleStartTrial}
      disabled={loading}
      className="btn btn-primary w-full"
    >
      {loading ? "Activando trial..." : "Activar 21 días gratis"}
    </button>
  );
}
