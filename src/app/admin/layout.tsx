import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile || profile.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex min-h-screen bg-bg-base">
      <Sidebar
        userName={profile.name ?? profile.email}
        company={profile.company ?? undefined}
        isAdmin
      />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
