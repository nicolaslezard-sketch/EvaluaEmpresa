"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage({
  searchParams,
}: {
  searchParams?: { reportId?: string };
}) {
  const router = useRouter();
  const reportId = searchParams?.reportId;

  useEffect(() => {
    if (!reportId) return;
    router.replace(`/app/evaluations/${reportId}/report`);
  }, [reportId, router]);

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Pago recibido
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Estamos redirigiéndote al informe…
        </p>
      </div>
    </div>
  );
}
