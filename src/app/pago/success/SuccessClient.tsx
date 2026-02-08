"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Status =
  | "PENDING_PAYMENT"
  | "PAID"
  | "GENERATING"
  | "DELIVERED"
  | "FAILED";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get("rid");

  const [status, setStatus] = useState<Status | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/report/${reportId}/status`);
      if (!res.ok) return;

      const data = await res.json();
      setStatus(data.status);
      setDownloadUrl(data.downloadUrl);
      setError(data.error);

      if (data.status === "DELIVERED" || data.status === "FAILED") {
        clearInterval(interval);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [reportId]);

  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      {!status && <p>Verificando pago…</p>}

      {(status === "PAID" || status === "GENERATING") && (
        <p>Estamos generando tu informe…</p>
      )}

      {status === "DELIVERED" && downloadUrl && (
        <>
          <h1 className="text-2xl font-semibold mb-4">¡Listo!</h1>
          <a
            href={downloadUrl}
            className="inline-block rounded bg-black px-6 py-3 text-white"
          >
            Descargar PDF
          </a>
          <p className="mt-4 text-sm text-gray-600">
            También te lo enviamos por email.
          </p>
        </>
      )}

      {status === "FAILED" && (
        <div>
          <p className="text-red-600">Hubo un problema generando el informe.</p>
          {error && <p className="text-sm mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}
