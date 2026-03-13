import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import LinkedinAuthorPicker from "./LinkedinAuthorPicker";

export default async function LinkedinSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile?.linkedinAccessToken) redirect("/dashboard?linkedin=error");

  const orgs = (profile.linkedinOrgs as { id: string; name: string }[]) ?? [];

  return (
    <div className="max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-t1 tracking-tight mb-1">Publier en tant que</h1>
        <p className="text-sm text-t2">Choisissez depuis quel profil vos posts LinkedIn seront publiés.</p>
      </div>

      <LinkedinAuthorPicker
        personUrn={profile.linkedinPersonUrn!}
        personName={profile.name ?? profile.email}
        orgs={orgs}
        currentAuthorUrn={profile.linkedinAuthorUrn ?? profile.linkedinPersonUrn!}
      />
    </div>
  );
}
