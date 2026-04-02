import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function SiteHeader() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-semibold tracking-tight text-zinc-900">
            EvaluaEmpresa<span className="text-zinc-400">™</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-zinc-600 md:flex">
            <Link
              href="/metodologia"
              className="transition hover:text-zinc-900"
            >
              Cómo funciona
            </Link>
            <Link
              href="/informe-modelo"
              className="transition hover:text-zinc-900"
            >
              Informe modelo
            </Link>
            <Link href="/pricing" className="transition hover:text-zinc-900">
              Pricing
            </Link>
            <Link href="/faq" className="transition hover:text-zinc-900">
              FAQ
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {session?.user?.id ? (
            <>
              <Link href="/dashboard" className="btn btn-secondary">
                Monitoreo
              </Link>

              <Link href="/companies/new" className="btn btn-primary">
                Nueva empresa
              </Link>
            </>
          ) : (
            <>
              <Link href="/informe-modelo" className="btn btn-secondary">
                Ver informe
              </Link>
              <Link href="/login" className="btn btn-primary">
                Ingresar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
