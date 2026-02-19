import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginCard from "@/components/LoginCard";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) redirect("/dashboard");

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-semibold tracking-tight">Ingresar</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Accedé a tu dashboard y a tus evaluaciones.
        </p>

        <div className="mt-8">
          <LoginCard />
        </div>

        <p className="mt-6 text-xs text-zinc-500">
          No almacenamos contraseñas. El ingreso se realiza con Google.
        </p>
      </div>
    </div>
  );
}
