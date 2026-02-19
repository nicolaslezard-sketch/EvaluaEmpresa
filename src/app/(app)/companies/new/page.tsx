import Link from "next/link";

export default function NewCompanyPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="card p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Nueva empresa
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Placeholder (Fase 1). El formulario real de Company (setup) se
          implementa en Fase 3/4 junto con Prisma 2.0.
        </p>

        <div className="mt-6 flex gap-2">
          <Link href="/dashboard" className="btn btn-secondary">
            Volver al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
