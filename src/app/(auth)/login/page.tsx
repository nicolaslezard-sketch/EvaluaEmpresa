import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginCard from "@/components/LoginCard";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) redirect("/dashboard");

  return (
    <div className="bg-linear-to-b from-white via-sky-50/50 to-white">
      <div className="container-page py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-sky-800">
            Acceso a EvaluaEmpresa
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            Entrá para empezar o continuar tus evaluaciones.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-600">
            Accedé con Google para crear empresas, cargar evaluaciones y seguir
            terceros con una metodología estructurada y comparativa entre
            ciclos.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-md">
          <LoginCard />
        </div>

        <p className="mx-auto mt-6 max-w-md text-center text-xs leading-5 text-zinc-500">
          No almacenamos contraseñas. El acceso se realiza con Google para que
          puedas entrar más rápido y continuar tu flujo sin fricción.
        </p>
      </div>
    </div>
  );
}
