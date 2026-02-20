import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight text-zinc-900">
            EvaluaEmpresa <span className="text-zinc-400">•</span>{" "}
            <span className="text-zinc-700">E-Score™</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/pricing" className="btn btn-secondary">
              Ver planes
            </Link>
            <Link href="/login" className="btn btn-primary">
              Iniciar evaluación
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-24 border-t border-zinc-200 bg-white">
        <div className="container-page py-10">
          <p className="text-sm text-zinc-600">
            EvaluaEmpresa • Evaluación estructurada de riesgo empresarial
            (Argentina).
          </p>
        </div>
      </footer>
    </div>
  );
}
