import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

/* =========================
   TYPES
========================= */

type DashboardEvaluation = {
  overallScore: number;
  executiveCategory: string;
  deltaOverall: number | null;
  createdAt: string;
};

type DashboardCompany = {
  id: string;
  name: string;
  evaluations: DashboardEvaluation[];
};

type DashboardResponse = {
  plan: string;
  trendDepth: number;
  canCreateEvaluation: boolean;
  canSeeAlerts: boolean;
  companies: DashboardCompany[];
};

/* =========================
   HELPERS
========================= */

function categoryStyles(category: string) {
  switch (category) {
    case "SOLIDO":
      return "bg-emerald-100 text-emerald-700";
    case "ESTABLE":
      return "bg-blue-100 text-blue-700";
    case "VULNERABLE":
      return "bg-amber-100 text-amber-700";
    case "CRITICO":
      return "bg-red-100 text-red-700";
    default:
      return "bg-zinc-100 text-zinc-600";
  }
}

function deltaStyles(delta: number) {
  if (delta > 0) return "text-emerald-600";
  if (delta < 0) return "text-red-600";
  return "text-zinc-500";
}

/* =========================
   DATA
========================= */

async function getDashboardData(): Promise<DashboardResponse | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

/* =========================
   PAGE
========================= */

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const data = await getDashboardData();
  if (!data) {
    return <div>Error loading dashboard</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Dashboard</h1>

        <div className="text-sm text-zinc-500">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
            {data.plan}
          </span>
        </div>
      </div>
      {!data.canCreateEvaluation && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          Tu plan actual no permite crear nuevas evaluaciones.
          <a href="/app/billing" className="ml-2 font-medium underline">
            Actualizar plan
          </a>
        </div>
      )}

      {data.companies.length === 0 && (
        <div className="rounded-xl border bg-white p-10 text-center text-sm text-zinc-500">
          <div className="rounded-xl border bg-white p-10 text-center">
            <div className="text-sm text-zinc-500">
              Aún no tienes empresas monitoreadas.
            </div>
            <a
              href="/app/companies/new"
              className="mt-4 inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
            >
              Agregar empresa
            </a>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.companies.map((company) => {
          const latest = company.evaluations[0];

          return (
            <div
              key={company.id}
              className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-medium text-zinc-900">{company.name}</h2>

                {latest && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${categoryStyles(
                      latest.executiveCategory,
                    )}`}
                  >
                    {latest.executiveCategory}
                  </span>
                )}
              </div>

              {latest ? (
                <>
                  <div className="mt-6 flex items-end gap-3">
                    <div className="text-4xl font-semibold text-zinc-900">
                      {latest.overallScore.toFixed(1)}
                    </div>

                    {latest.deltaOverall !== null && (
                      <div
                        className={`text-sm font-medium ${deltaStyles(
                          latest.deltaOverall,
                        )}`}
                      >
                        Δ {latest.deltaOverall.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Barra visual */}
                  <div className="mt-4 h-2 w-full rounded-full bg-zinc-100">
                    <div
                      className="h-2 rounded-full bg-zinc-900 transition-all"
                      style={{
                        width: `${Math.min(
                          Math.max(latest.overallScore, 0),
                          100,
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 text-xs text-zinc-500">
                    Última actualización:{" "}
                    {new Date(latest.createdAt).toLocaleDateString()}
                  </div>
                </>
              ) : (
                <div className="mt-6 text-sm text-zinc-500">
                  Sin evaluaciones finalizadas
                </div>
              )}
              <div className="mt-6">
                {data.canCreateEvaluation ? (
                  <a
                    href={`/app/companies/${company.id}`}
                    className="inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                  >
                    Ver empresa
                  </a>
                ) : (
                  <div className="text-xs text-zinc-500">
                    Plan requerido para nuevas evaluaciones
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
