import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <p className="text-sm font-semibold tracking-tight text-zinc-900">
              EvaluaEmpresa
            </p>

            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Evaluación y monitoreo estructurado de terceros para detectar
              deterioros, comparar ciclos y respaldar decisiones con una salida
              más clara.
            </p>

            <p className="mt-4 text-xs leading-5 text-zinc-500">
              Alcance orientativo y basado en información declarada por el
              solicitante. No constituye asesoramiento legal, contable ni
              financiero.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="grid gap-3">
              <p className="font-medium text-zinc-900">Producto</p>

              <Link
                href="/metodologia"
                className="text-zinc-600 transition hover:text-zinc-900"
              >
                Cómo funciona
              </Link>

              <Link
                href="/informe-modelo"
                className="text-zinc-600 transition hover:text-zinc-900"
              >
                Informe modelo
              </Link>

              <Link
                href="/pricing"
                className="text-zinc-600 transition hover:text-zinc-900"
              >
                Pricing
              </Link>

              <Link
                href="/faq"
                className="text-zinc-600 transition hover:text-zinc-900"
              >
                FAQ
              </Link>
            </div>

            <div className="grid gap-3">
              <p className="font-medium text-zinc-900">Contacto</p>

              <a
                href="mailto:contacto@evaluaempresa.com"
                className="text-zinc-600 transition hover:text-zinc-900"
              >
                contacto@evaluaempresa.com
              </a>

              <p className="text-zinc-500">
                Términos y privacidad próximamente
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-zinc-200 pt-6 text-xs text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} EvaluaEmpresa. Todos los derechos
            reservados.
          </p>
          <p>Hecho para seguimiento y decisiones mejor respaldadas.</p>
        </div>
      </div>
    </footer>
  );
}
