import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";


function getThisWeekStart() {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diff));
}

export default async function PostsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const weekStart = getThisWeekStart();

  const posts = await prisma.post.findMany({
    where: { profileId: user.id, weekStart },
    orderBy: { dayOfWeek: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-t1 tracking-tight mb-1">Mes posts de la semaine</h1>
        <p className="text-sm text-t2">
          Semaine du{" "}
          {weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <div className="text-3xl mb-3">✍️</div>
          <div className="text-base font-semibold text-t1 mb-1">Vos posts arrivent lundi matin.</div>
          <div className="text-sm text-t2">Partagez vos actus de la semaine pour qu&apos;on puisse les intégrer.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
