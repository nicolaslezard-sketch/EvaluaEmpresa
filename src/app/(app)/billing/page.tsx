import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UpgradeButton } from "@/components/billing/UpgradeButton";
import { getUserEntitlements } from "@/lib/access/getEntitlements";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const ent = await getUserEntitlements(session.user.id);
  const currentPlan = ent.plan;

  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-semibold text-zinc-900">
        Plan & Facturación
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <PlanCard
          title="FREE"
          price="$0"
          current={currentPlan === "FREE"}
          features={["1 empresa activa", "1 evaluación total", "Score general"]}
        />

        <PlanCard
          title="PRO"
          price="ARS 95.000 / mes"
          current={currentPlan === "PRO"}
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
}: {
  title: "FREE" | "PRO" | "BUSINESS";
  price: string;
  features: string[];
  current?: boolean;
  upgrade?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-8 shadow-sm ${
        current ? "border-zinc-900" : ""
      }`}
    >
      <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>

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
