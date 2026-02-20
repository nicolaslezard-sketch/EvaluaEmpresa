"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";

type Props = {
  email?: string | null;
  name?: string | null;
  image?: string | null;
};

function initials(nameOrEmail?: string | null) {
  const base = (nameOrEmail ?? "U").trim();
  if (!base) return "U";
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

export function UserMenu({ email, name, image }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm hover:bg-zinc-50"
      >
        {image ? (
          <Image
            alt={name ?? email ?? "Usuario"}
            src={image}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full"
          />
        ) : (
          <div className="grid h-7 w-7 place-items-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
            {initials(name ?? email)}
          </div>
        )}

        <span className="hidden text-zinc-700 md:inline">
          {name ?? email ?? "Cuenta"}
        </span>
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
          <div className="border-b border-zinc-100 px-4 py-3">
            <p className="text-xs font-medium text-zinc-900">
              {name ?? "Usuario"}
            </p>
            <p className="mt-1 text-xs text-zinc-500">{email ?? ""}</p>
          </div>

          <div className="p-2">
            <Link
              href="/dashboard"
              className="block rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>

            <Link
              href="/companies/new"
              className="block rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              onClick={() => setOpen(false)}
            >
              Nueva evaluación
            </Link>

            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
