"use client";

import { useState } from "react";
import LegalCheckoutNotice from "@/components/legal/LegalCheckoutNotice";

export function UpgradeButton({ plan }: { plan: "PRO" | "BUSINESS" }) {
  const [loading, setLoading] = useState(false);

  return (
    <div>
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
        className="btn btn-primary w-full"
      >
        {loading ? "Redirigiendo..." : "Elegir plan"}
      </button>

      <LegalCheckoutNotice />
    </div>
  );
}
