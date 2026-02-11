"use client";

import { signIn } from "next-auth/react";
import GoogleIcon from "@/components/icons/GoogleIcon";

export default function LoginCard() {
  return (
    <div className="card p-8">
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900">
        Continuar con tu cuenta
      </h2>

      <p className="mt-2 text-sm text-zinc-600">
        Guardá borradores, pagá y descargá tus informes desde el dashboard.
      </p>

      <button
        onClick={() => signIn("google")}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
      >
        <GoogleIcon className="h-5 w-5" />
        Continuar con Google
      </button>
    </div>
  );
}
