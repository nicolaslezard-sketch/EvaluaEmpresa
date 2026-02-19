"use client";

import { useState } from "react";

export function UpgradeButton({ plan }: { plan: "PRO" | "BUSINESS" }) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={async () => {
        try {
          setLoading(true);
          const res = await fetch("/api/checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              kind: "subscription",
              plan,
              period: "monthly",
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data?.error || "Checkout failed");
          window.location.href = data.checkoutUrl;
        } catch (e) {
          alert(e instanceof Error ? e.message : "Checkout failed");
        } finally {
          setLoading(false);
        }
      }}
      className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60"
    >
      {loading ? "Redirigiendo..." : "Actualizar"}
    </button>
  );
}
