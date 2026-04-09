import type { ReactNode } from "react";
import { MainHeader } from "@/components/site/MainHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <MainHeader mode="marketing" />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
