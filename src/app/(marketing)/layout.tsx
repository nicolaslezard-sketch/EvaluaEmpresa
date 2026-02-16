import Link from "next/link";

export default function MarketingLayout({
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

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              className="text-sm text-zinc-600 hover:text-zinc-900"
              href="/metodologia"
            >
              Metodología
            </Link>
            <Link
              className="text-sm text-zinc-600 hover:text-zinc-900"
              href="/informe-modelo"
            >
              Informe modelo
            </Link>
            <Link
              className="text-sm text-zinc-600 hover:text-zinc-900"
              href="/pricing"
            >
              Pricing
            </Link>
            <Link
              className="text-sm text-zinc-600 hover:text-zinc-900"
              href="/faq"
            >
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="btn btn-secondary">
              Ingresar
            </Link>
            <Link href="/app/new/pyme" className="btn btn-primary">
              Iniciar evaluación
            </Link>
          </div>
        </div>
      </header>

      {children}

      <footer className="mt-24 border-t border-zinc-200 bg-white">
        <div className="container-page py-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-zinc-600">
              EvaluaEmpresa • Evaluación estructurada de riesgo empresarial
              (Argentina).
            </p>
            <div className="flex gap-4">
              <Link
                className="text-sm text-zinc-600 hover:text-zinc-900"
                href="/legal"
              >
                Legal
              </Link>
              <Link
                className="text-sm text-zinc-600 hover:text-zinc-900"
                href="/faq"
              >
                Ayuda
              </Link>
            </div>
          </div>

          <p className="mt-4 text-xs text-zinc-500">
            Informe orientativo basado en información provista por el
            solicitante. No constituye asesoramiento legal, contable ni
            financiero.
          </p>
        </div>
      </footer>
    </div>
  );
}
