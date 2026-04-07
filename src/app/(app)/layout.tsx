import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { MainHeader } from "@/components/site/MainHeader";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/login");

  return (
    <div className="min-h-screen bg-zinc-50">
      <MainHeader mode="app" />
      <div className="container-page py-10">{children}</div>
    </div>
  );
}
