import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="p-24 text-center">Cargando…</div>}>
      <SuccessClient />
    </Suspense>
  );
}
