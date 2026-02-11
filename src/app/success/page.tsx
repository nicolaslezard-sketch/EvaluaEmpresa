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
    router.replace(`/app/analysis/${reportId}`);
  }, [reportId, router]);

  return (
    <main className="container-page py-20">
      <div className="card p-6">
        <p className="text-sm text-zinc-700">Redirigiendo a tu evaluación…</p>
      </div>
    </main>
  );
}
