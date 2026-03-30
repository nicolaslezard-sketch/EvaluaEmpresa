import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200/80 bg-white/90 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-zinc-900 text-sm font-semibold text-white">
              EE
            </div>
            <div>
              <p className="text-sm font-semibold leading-none text-zinc-900">
                EvaluaEmpresa
              </p>
              <p className="mt-1 text-[11px] leading-none text-zinc-500">
                Evaluación estructurada de terceros
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/pricing" className="btn btn-secondary">
              Ver planes
            </Link>
            <Link href="/login" className="btn btn-primary">
              Probar ahora
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-20 border-t border-zinc-200 bg-white">
        <div className="container-page py-10">
          <p className="text-sm leading-6 text-zinc-600">
            EvaluaEmpresa ayuda a evaluar proveedores, clientes o contrapartes
            con una metodología estructurada, comparativa entre ciclos y salida
            ejecutiva clara.
          </p>
        </div>
      </footer>
    </div>
  );
}
