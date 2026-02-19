"use client";

import { useState } from "react";

type Props = {
  companyId: string;
  evaluationId: string;
};

export default function UnlockButton({ companyId, evaluationId }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleUnlock() {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/companies/${companyId}/evaluations/${evaluationId}/checkout`,
        {
          method: "POST",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error iniciando checkout");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleUnlock}
      disabled={loading}
      className="inline-flex items-center px-5 py-2 bg-blue-600 text-white rounded-md disabled:opacity-60"
    >
      {loading ? "Redirigiendo..." : "Desbloquear informe"}
    </button>
  );
}
