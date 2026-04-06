"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";

type Props = {
  email?: string | null;
  name?: string | null;
  image?: string | null;
  planLabel?: string;
  planStatusLabel?: string;
};

function initials(nameOrEmail?: string | null) {
  const base = (nameOrEmail ?? "U").trim();
  if (!base) return "U";
  const parts = base.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return base.slice(0, 2).toUpperCase();
}

export function UserMenu({
  email,
  name,
  image,
  planLabel,
  planStatusLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }

    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-3 rounded-2xl border border-sky-600 bg-white px-3 py-2 text-sm shadow-sm transition hover:border-sky-700 hover:bg-sky-50/40"
      >
        {image ? (
          <Image
            alt={name ?? email ?? "Usuario"}
            src={image}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="grid h-8 w-8 place-items-center rounded-full bg-zinc-900 text-xs font-semibold text-white">
            {initials(name ?? email)}
          </div>
        )}

        <div className="hidden min-w-0 text-left md:block">
          <div className="max-w-35 truncate font-medium text-zinc-900">
            {name ?? "Cuenta"}
          </div>
        </div>

        <svg
          className={`h-4 w-4 text-zinc-500 transition ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0l-4.25-4.51a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open ? (
        <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
          <div className="border-b border-zinc-100 px-5 py-4">
            <div className="flex items-center gap-3">
              {image ? (
                <Image
                  alt={name ?? email ?? "Usuario"}
                  src={image}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="grid h-10 w-10 place-items-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
                  {initials(name ?? email)}
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900">
                  {name ?? "Usuario"}
                </p>
                <p className="mt-0.5 truncate text-sm text-zinc-500">
                  {email ?? ""}
                </p>

                {planLabel ? (
                  <div className="mt-3 rounded-2xl border border-sky-100 bg-sky-50 px-3 py-2">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-sky-800">
                      Plan actual
                    </p>
                    <p className="mt-1 text-sm font-semibold text-zinc-900">
                      {planLabel}
                    </p>
                    {planStatusLabel ? (
                      <p className="mt-1 text-xs leading-5 text-zinc-600">
                        {planStatusLabel}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="p-2">
            <Link
              href="/dashboard"
              className="block rounded-2xl bg-zinc-50 px-4 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100"
              onClick={() => setOpen(false)}
            >
              Monitoreo
            </Link>

            <Link
              href="/companies/new"
              className="mt-1 block rounded-2xl px-4 py-3 text-sm text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-900"
              onClick={() => setOpen(false)}
            >
              Nueva empresa
            </Link>

            <div className="mt-2 border-t border-zinc-100 pt-2">
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full rounded-2xl px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
