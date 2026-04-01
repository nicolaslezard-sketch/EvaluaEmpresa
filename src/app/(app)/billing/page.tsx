import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UpgradeButton } from "@/components/billing/UpgradeButton";
import { getUserEntitlements } from "@/lib/access/getEntitlements";
import { prisma } from "@/lib/prisma";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const ent = await getUserEntitlements(session.user.id);
  const currentPlan = ent.plan;

  const activeCompanyCount = await prisma.company.count({
    where: {
      ownerId: session.user.id,
      status: "ACTIVE",
    },
  });

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-800">
            Plan y facturación
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            Elegí cómo querés seguir usando EvaluaEmpresa
          </h1>

          <p className="mt-4 text-base leading-7 text-zinc-600">
            Free sirve para explorar el flujo inicial. Pro y Business destraban
            más capacidad, más evaluaciones y mejor seguimiento para trabajar
            terceros de forma recurrente.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-white px-5 py-4 shadow-sm">
          <div className="text-sm text-zinc-600">Uso actual</div>
          <div className="mt-1 text-2xl font-semibold text-zinc-900">
            {activeCompanyCount}/{ent.maxCompanies}
          </div>
          <div className="mt-1 text-sm text-zinc-500">
            Empresas activas · {currentPlan}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-medium text-zinc-900">
            Free para explorar
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Ideal para conocer el flujo, cargar una empresa y completar una
            primera evaluación.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-5 shadow-sm">
          <div className="text-sm font-medium text-zinc-900">
            Pro para usarlo de verdad
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Desbloquea más empresas, evaluaciones recurrentes, histórico y PDF
            completo.
          </p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-5 shadow-sm">
          <div className="text-sm font-medium text-zinc-900">
            Business para monitoreo continuo
          </div>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            Pensado para más volumen, tendencia extendida y alertas para
            seguimiento más operativo.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <PlanCard
          title="FREE"
          price="$0"
          headline="Para probar el flujo y hacer una primera evaluación"
          current={currentPlan === "FREE"}
          usage={currentPlan === "FREE" ? `${activeCompanyCount}/1` : undefined}
          features={["1 empresa activa", "1 evaluación total", "Score general"]}
        />

        <PlanCard
          title="PRO"
          price="ARS 95.000 / mes"
          headline="Para trabajar evaluaciones completas con seguimiento recurrente"
          current={currentPlan === "PRO"}
          usage={currentPlan === "PRO" ? `${activeCompanyCount}/3` : undefined}
          features={[
            "Hasta 3 empresas",
            "Evaluaciones ilimitadas",
            "Histórico completo",
            "PDF en todas las evaluaciones",
          ]}
          upgrade
          highlighted
        />

        <PlanCard
          title="BUSINESS"
          price="ARS 210.000 / mes"
          headline="Para equipos con mayor volumen y monitoreo continuo"
          current={currentPlan === "BUSINESS"}
          usage={
            currentPlan === "BUSINESS" ? `${activeCompanyCount}/15` : undefined
          }
          features={[
            "Hasta 15 empresas",
            "Tendencia extendida (6 ciclos)",
            "Alertas automáticas",
            "Todo lo de PRO",
          ]}
          upgrade
        />
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">
          ¿Cuándo conviene actualizar?
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-sm font-medium text-zinc-900">Pasá a Pro</div>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Cuando una sola evaluación ya no te alcanza y necesitás comparar
              ciclos, trabajar más empresas o descargar PDFs completos.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-sm font-medium text-zinc-900">
              Pasá a Business
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Cuando el seguimiento deja de ser puntual y pasa a ser una
              práctica más continua con más volumen y más alertas.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-sm font-medium text-zinc-900">
              Mantené Free
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Si solo querés conocer el flujo y validar cómo se estructura una
              evaluación dentro del producto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanCard({
  title,
  price,
  headline,
  features,
  current,
  upgrade,
  usage,
  highlighted,
}: {
  title: "FREE" | "PRO" | "BUSINESS";
  price: string;
  headline: string;
  features: string[];
  current?: boolean;
  upgrade?: boolean;
  usage?: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-3xl border bg-white p-8 shadow-sm",
        current ? "border-zinc-900" : "border-zinc-200",
        highlighted
          ? "border-sky-900 shadow-[0_10px_30px_rgba(2,132,199,0.08)]"
          : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
          <p className="mt-3 text-base leading-7 text-zinc-600">{headline}</p>
        </div>

        {current && usage ? (
          <span className="rounded-full border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
            {usage}
          </span>
        ) : null}
      </div>

      <div className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900">
        {price}
      </div>

      <ul className="mt-6 space-y-3 text-sm text-zinc-600">
        {features.map((f) => (
          <li key={f}>• {f}</li>
        ))}
      </ul>

      <div className="mt-8">
        {current ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            Plan actual
          </div>
        ) : upgrade && title !== "FREE" ? (
          <UpgradeButton plan={title} />
        ) : null}
      </div>
    </div>
  );
}
