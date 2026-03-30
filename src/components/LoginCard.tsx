"use client";

import { signIn } from "next-auth/react";
import GoogleIcon from "@/components/icons/GoogleIcon";

export default function LoginCard() {
  return (
    <div className="rounded-3xl border border-sky-100 bg-white p-8 shadow-[0_10px_30px_rgba(2,132,199,0.08)]">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
        Continuá con tu cuenta
      </h2>

      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Ingresá para crear empresas, cargar evaluaciones y seguir la evolución
        de terceros en un solo lugar.
      </p>

      <button
        onClick={() => signIn("google")}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-900"
      >
        <GoogleIcon className="h-5 w-5" />
        Continuar con Google
      </button>

      <p className="mt-4 text-xs leading-5 text-zinc-500">
        Acceso simple y sin contraseña. Vas a poder continuar tu evaluación
        desde el dashboard una vez que ingreses.
      </p>
    </div>
  );
}
