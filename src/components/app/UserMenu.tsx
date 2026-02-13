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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-2 py-1.5 text-sm text-zinc-800 shadow-sm hover:border-zinc-300"
      >
        {image ? (
          <Image
            src={image}
            alt={name ?? email ?? "Usuario"}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full"
          />
        ) : (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-zinc-900 text-[11px] font-semibold text-white">
            {initials(name ?? email)}
          </span>
        )}
        <span className="hidden sm:block max-w-[180px] truncate">
          {name ?? email ?? "Cuenta"}
        </span>
        <span className="text-zinc-400">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg">
          <div className="px-4 py-3">
            <p className="truncate text-sm font-semibold text-zinc-900">
              {name ?? "Cuenta"}
            </p>
            <p className="truncate text-xs text-zinc-500">{email ?? ""}</p>
          </div>
          <div className="h-px bg-zinc-100" />
          <div className="p-2">
            <Link
              href="/app/dashboard"
              className="block rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/app/new"
              className="block rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
              onClick={() => setOpen(false)}
            >
              Nueva evaluación
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-1 w-full rounded-xl px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-50"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
