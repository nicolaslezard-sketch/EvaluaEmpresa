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
    <div className="space-y-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Plan & Facturación
        </h1>

        <div className="rounded-2xl border bg-white px-5 py-4 shadow-sm">
          <div className="text-sm text-zinc-600">Uso actual</div>
          <div className="mt-1 text-2xl font-semibold text-zinc-900">
            {activeCompanyCount}/{ent.maxCompanies}
          </div>
          <div className="mt-1 text-sm text-zinc-500">Empresas activas</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <PlanCard
          title="FREE"
          price="$0"
          current={currentPlan === "FREE"}
          usage={currentPlan === "FREE" ? `${activeCompanyCount}/1` : undefined}
          features={["1 empresa activa", "1 evaluación total", "Score general"]}
        />

        <PlanCard
          title="PRO"
          price="ARS 95.000 / mes"
          current={currentPlan === "PRO"}
          usage={currentPlan === "PRO" ? `${activeCompanyCount}/3` : undefined}
          features={[
            "Hasta 3 empresas",
            "Evaluaciones ilimitadas",
            "Histórico completo",
            "PDF en todas las evaluaciones",
          ]}
          upgrade
        />

        <PlanCard
          title="BUSINESS"
          price="ARS 210.000 / mes"
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
    </div>
  );
}

function PlanCard({
  title,
  price,
  features,
  current,
  upgrade,
  usage,
}: {
  title: "FREE" | "PRO" | "BUSINESS";
  price: string;
  features: string[];
  current?: boolean;
  upgrade?: boolean;
  usage?: string;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-8 shadow-sm ${
        current ? "border-zinc-900" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>

        {current && usage ? (
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
            {usage}
          </span>
        ) : null}
      </div>

      <div className="mt-4 text-2xl font-semibold text-zinc-900">{price}</div>

      <ul className="mt-6 space-y-2 text-sm text-zinc-600">
        {features.map((f) => (
          <li key={f}>• {f}</li>
        ))}
      </ul>

      <div className="mt-8">
        {current ? (
          <div className="text-sm font-medium text-zinc-600">Plan actual</div>
        ) : upgrade && title !== "FREE" ? (
          <UpgradeButton plan={title} />
        ) : null}
      </div>
    </div>
  );
}
