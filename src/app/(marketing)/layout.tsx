import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/#metodologia", label: "Metodología" },
  { href: "/informe-modelo", label: "Informe modelo" },
  { href: "/pricing", label: "Planes" },
  { href: "/#faq", label: "FAQ" },
];

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
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

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-zinc-600 transition hover:text-zinc-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-zinc-600 transition hover:text-zinc-900 sm:inline-flex"
            >
              Ingresar
            </Link>

            <Link href="/login" className="btn btn-primary">
              Probar ahora
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-zinc-200 bg-zinc-50">
        <div className="container-page flex flex-col gap-8 py-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-zinc-900">EvaluaEmpresa</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Plataforma para evaluar proveedores, clientes o contrapartes con
              una metodología estructurada, comparativa entre ciclos y salida
              ejecutiva clara.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm text-zinc-600 sm:grid-cols-4">
            <Link
              href="/#metodologia"
              className="transition hover:text-zinc-900"
            >
              Metodología
            </Link>
            <Link
              href="/informe-modelo"
              className="transition hover:text-zinc-900"
            >
              Informe modelo
            </Link>
            <Link href="/pricing" className="transition hover:text-zinc-900">
              Planes
            </Link>
            <Link href="/#faq" className="transition hover:text-zinc-900">
              FAQ
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
