import Link from "next/link";
import type { ReactNode } from "react";
import { MainHeader } from "@/components/site/MainHeader";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <MainHeader mode="marketing" />

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
