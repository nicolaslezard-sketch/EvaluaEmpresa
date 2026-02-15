// src/app/(marketing)/page.tsx
import Link from "next/link";

export default function MarketingHomePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 h-130 w-130 -translate-x-1/2 rounded-full bg-slate-100 blur-3xl" />
          <div className="absolute -bottom-40 -right-30 h-130 w-130 rounded-full bg-slate-100 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-12 pt-14 md:pb-16 md:pt-20">
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Sistema E-Score™ · Diagnóstico estructurado de riesgo
              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
                Evaluá el riesgo empresarial antes de tomar decisiones
                estratégicas.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                Diagnóstico ejecutivo de riesgo financiero, comercial, operativo
                y estratégico para dueños, socios e inversores. Un informe
                estructurado, comparable y guardado como snapshot histórico.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/app/new?tier=pyme"
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                >
                  Comenzar evaluación
                </Link>

                <a
                  href="#como-funciona"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-50"
                >
                  Cómo funciona
                </a>

                <a
                  href="#precios"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Ver precios →
                </a>
              </div>

              <p className="mt-6 max-w-2xl text-xs leading-relaxed text-slate-500">
                EvaluaEmpresa entrega un informe orientativo basado en la
                información declarada. No constituye auditoría, certificación ni
                asesoramiento legal/contable.
              </p>
            </div>

            {/* Right-side "Credibility" card */}
            <div className="md:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Informe ejecutivo (snapshot)
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      Scores por pilar · riesgos · acciones priorizadas
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
                    PDF premium
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  <MiniStat
                    label="Overall Score"
                    value="0–100"
                    hint="Comparabilidad histórica"
                  />
                  <MiniStat
                    label="Pilares"
                    value="5"
                    hint="Finanzas, Comercial, Operativo, Legal, Estrategia"
                  />
                  <MiniStat
                    label="Salida"
                    value="Informe + PDF"
                    hint="Estructura ejecutiva"
                  />
                </div>

                <div className="mt-6 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-slate-900">
                    Uso típico
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-600">
                    <li>• Evaluar proveedor o socio</li>
                    <li>• Pre-filtro antes de inversión</li>
                    <li>• Diagnóstico interno de riesgos</li>
                  </ul>
                </div>

                <div className="mt-6 flex gap-2">
                  <Link
                    href="/app/new?tier=pyme"
                    className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-slate-800"
                  >
                    PYME
                  </Link>
                  <Link
                    href="/app/new?tier=empresa"
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-xs font-medium text-slate-900 hover:bg-slate-50"
                  >
                    Empresa
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIER CARDS */}
      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="grid gap-6 md:grid-cols-2">
          <TierCard
            title="Evaluación PYME"
            subtitle="Más accesible. Ideal para dueños y equipos chicos."
            items={[
              "Campos opcionales (impactan precisión)",
              "Informe ejecutivo estructurado",
              "Desbloqueo por informe o suscripción PYME",
            ]}
            badge="Recomendada para empezar"
            href="/app/new?tier=pyme"
            cta="Comenzar PYME"
          />

          <TierCard
            title="Evaluación Empresa"
            subtitle="Más estricta. Ideal para socios, inversores y compras."
            items={[
              "Validación estricta y profundidad mayor",
              "Inconsistencias / coherencias más fuertes",
              "Roadmap 30/60/90 días (más detallado)",
            ]}
            badge="Mayor profundidad"
            href="/app/new?tier=empresa"
            cta="Comenzar Empresa"
            variant="outline"
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="como-funciona"
        className="border-t border-slate-100 bg-white"
      >
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Cómo funciona
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Un flujo claro y serio. Menos fricción, más claridad ejecutiva.
              </p>
            </div>
            <a
              href="#precios"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Ver planes →
            </a>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <HowStep
              step="01"
              title="Completá el wizard"
              text="Perfil, finanzas, comercial, riesgos y estrategia en pasos simples."
            />
            <HowStep
              step="02"
              title="Generación del informe"
              text="Se produce un diagnóstico estructurado con scores por pilar."
            />
            <HowStep
              step="03"
              title="Revisión ejecutiva"
              text="Fortalezas, red flags, inconsistencias y acciones priorizadas."
            />
            <HowStep
              step="04"
              title="PDF y snapshot"
              text="Guardado histórico inmutable. Descarga segura del PDF."
            />
          </div>

          <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-medium text-slate-900">
              Nota de metodología
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Los resultados son orientativos y dependen de la calidad de la
              información declarada. En PYME, podés avanzar con menos datos;
              mientras menos información, menor precisión del análisis.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="precios" className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Planes y acceso
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Empezá gratis. Desbloqueá por informe o con suscripción según tu
                necesidad.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600 shadow-sm">
              Argentina: ARS (MercadoPago) · Internacional: USD (Lemon Squeezy)
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-5 bg-slate-50 text-xs font-medium text-slate-700">
              <div className="col-span-1 px-4 py-3">Feature</div>
              <div className="col-span-1 border-l border-slate-200 px-4 py-3">
                Free
              </div>
              <div className="col-span-1 border-l border-slate-200 px-4 py-3">
                Informe
              </div>
              <div className="col-span-1 border-l border-slate-200 px-4 py-3">
                PYME
              </div>
              <div className="col-span-1 border-l border-slate-200 px-4 py-3">
                Empresa
              </div>
            </div>

            <PricingRow
              feature="Score general"
              free
              okReport
              okPyme
              okEmpresa
            />
            <PricingRow
              feature="Informe completo"
              free={false}
              okReport
              okPyme
              okEmpresa
            />
            <PricingRow feature="PDF" free={false} okReport okPyme okEmpresa />
            <PricingRow
              feature="Histórico"
              free={false}
              report={false}
              okPyme
              okEmpresa
            />
            <PricingRow
              feature="Evolución"
              free={false}
              report={false}
              okPyme
              okEmpresa
              note="PYME: básica · Empresa: avanzada"
            />
            <PricingRow
              feature="Alertas"
              free={false}
              report={false}
              pyme={false}
              okEmpresa
            />
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <PlanCard
              name="Free"
              price="Gratis"
              desc="Generá el análisis y obtené una vista ejecutiva parcial."
              items={[
                "Score general + categoría ejecutiva",
                "1 fortaleza + 1 riesgo",
                "Sin PDF ni informe completo",
              ]}
              ctaHref="/app/new?tier=empresa"
              ctaText="Empezar gratis"
            />
            <PlanCard
              name="Informe"
              price="USD 15 / ARS equivalente"
              desc="Desbloqueá un informe específico (incluye PDF)."
              items={[
                "Informe completo (1 reporte)",
                "Descarga PDF premium",
                "Sin histórico ni dashboard",
              ]}
              ctaHref="/app/new?tier=pyme"
              ctaText="Generar y desbloquear"
              highlight
            />
            <PlanCard
              name="PYME"
              price="USD 29 / ARS equivalente"
              desc="Acceso completo para evaluaciones PYME."
              items={[
                "Informe + PDF",
                "Histórico + evolución básica",
                "Ideal para seguimiento mensual",
              ]}
              ctaHref="/app/new?tier=pyme"
              ctaText="Comenzar PYME"
            />
            <PlanCard
              name="Empresa"
              price="USD 79 / ARS equivalente"
              desc="Profundidad máxima y funciones avanzadas."
              items={[
                "Informe + PDF",
                "Dashboard + evolución avanzada",
                "Alertas (fase posterior)",
              ]}
              ctaHref="/app/new?tier=empresa"
              ctaText="Comenzar Empresa"
            />
          </div>

          <p className="mt-8 text-xs text-slate-500">
            Los precios son orientativos. Podés ajustar valores finales en tu
            panel y en el checkout.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ----------------------------- Components ----------------------------- */

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white">
            EE
          </span>
          <span className="text-sm font-semibold tracking-tight">
            EvaluaEmpresa
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#como-funciona"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Cómo funciona
          </a>
          <a
            href="#precios"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Planes
          </a>
          <Link
            href="/login"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Ingresar
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/app/new?tier=pyme"
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-slate-800"
          >
            Comenzar
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold text-white">
                EE
              </span>
              <span className="text-sm font-semibold tracking-tight">
                EvaluaEmpresa
              </span>
            </div>
            <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-500">
              Plataforma orientativa de evaluación estructurada de riesgo
              empresarial. No reemplaza asesoramiento profesional.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-xs text-slate-600 md:items-end">
            <div className="flex gap-4">
              <a href="#como-funciona" className="hover:text-slate-900">
                Cómo funciona
              </a>
              <a href="#precios" className="hover:text-slate-900">
                Planes
              </a>
              <Link href="/terms" className="hover:text-slate-900">
                Términos
              </Link>
              <Link href="/privacy" className="hover:text-slate-900">
                Privacidad
              </Link>
            </div>
            <span className="text-slate-400">
              © {new Date().getFullYear()} EvaluaEmpresa
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function MiniStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div>
        <p className="text-xs font-medium text-slate-900">{label}</p>
        <p className="mt-1 text-xs text-slate-600">{hint}</p>
      </div>
      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function TierCard(props: {
  title: string;
  subtitle: string;
  items: string[];
  badge: string;
  href: string;
  cta: string;
  variant?: "solid" | "outline";
}) {
  const solid = props.variant !== "outline";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold tracking-tight">{props.title}</p>
          <p className="mt-1 text-sm text-slate-600">{props.subtitle}</p>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
          {props.badge}
        </span>
      </div>

      <ul className="mt-5 space-y-2 text-sm text-slate-700">
        {props.items.map((it) => (
          <li key={it} className="flex gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-slate-900" />
            <span>{it}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Link
          href={props.href}
          className={
            solid
              ? "inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
              : "inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
          }
        >
          {props.cta}
        </Link>
      </div>
    </div>
  );
}

function HowStep({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500">{step}</span>
        <span className="h-8 w-8 rounded-xl bg-slate-50" />
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm text-slate-600">{text}</p>
    </div>
  );
}

function PricingRow(props: {
  feature: string;
  note?: string;
  free?: boolean;
  report?: boolean;
  pyme?: boolean;
  empresa?: boolean;
  okReport?: boolean;
  okPyme?: boolean;
  okEmpresa?: boolean;
}) {
  const free = props.free ?? true;
  const report = props.report ?? props.okReport ?? false;
  const pyme = props.pyme ?? props.okPyme ?? false;
  const empresa = props.empresa ?? props.okEmpresa ?? false;

  return (
    <div className="grid grid-cols-5 border-t border-slate-200 text-sm">
      <div className="col-span-1 px-4 py-3 text-slate-700">
        <div className="font-medium text-slate-900">{props.feature}</div>
        {props.note ? (
          <div className="mt-1 text-xs text-slate-500">{props.note}</div>
        ) : null}
      </div>

      <Cell ok={free} />
      <Cell ok={report} />
      <Cell ok={pyme} />
      <Cell ok={empresa} />
    </div>
  );
}

function Cell({ ok }: { ok: boolean }) {
  return (
    <div className="col-span-1 flex items-center justify-center border-l border-slate-200 px-4 py-3">
      <span
        className={
          ok
            ? "inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"
            : "inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-slate-400"
        }
        aria-label={ok ? "Incluido" : "No incluido"}
      >
        {ok ? "✓" : "—"}
      </span>
    </div>
  );
}

function PlanCard(props: {
  name: string;
  price: string;
  desc: string;
  items: string[];
  ctaHref: string;
  ctaText: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        props.highlight
          ? "rounded-2xl border border-slate-900 bg-white p-6 shadow-sm"
          : "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{props.name}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {props.price}
          </p>
        </div>
        {props.highlight ? (
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
            Más usado
          </span>
        ) : null}
      </div>

      <p className="mt-3 text-sm text-slate-600">{props.desc}</p>

      <ul className="mt-5 space-y-2 text-sm text-slate-700">
        {props.items.map((it) => (
          <li key={it} className="flex gap-2">
            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-slate-900" />
            <span>{it}</span>
          </li>
        ))}
      </ul>

      <Link
        href={props.ctaHref}
        className={
          props.highlight
            ? "mt-6 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
            : "mt-6 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
        }
      >
        {props.ctaText}
      </Link>
    </div>
  );
}
