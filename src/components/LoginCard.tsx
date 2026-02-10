"use client";

import { signIn } from "next-auth/react";
import GoogleIcon from "@/components/icons/GoogleIcon";

export default function LoginCard() {
  return (
    <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-black/60 p-8 backdrop-blur-xl">
      <h2 className="text-center text-2xl font-semibold text-white">
        Ingresar
      </h2>

      <p className="mt-2 text-center text-sm text-zinc-400">
        Accedé a tus informes y descargas
      </p>

      <button
        onClick={() => signIn("google")}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-zinc-200"
      >
        <GoogleIcon className="h-5 w-5" />
        Continuar con Google
      </button>
    </div>
  );
}
