import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";

function getThisWeekStart() {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diff));
}

export default async function AdminClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const weekStart = getThisWeekStart();

  const client = await prisma.profile.findUnique({ where: { id } });
  if (!client) notFound();

  const [posts, news] = await Promise.all([
    prisma.post.findMany({
      where: { profileId: id, weekStart },
      orderBy: { dayOfWeek: "asc" },
    }),
    prisma.weeklyNews.findFirst({
      where: { profileId: id, weekStart },
    }),
  ]);

  const weekLabel = weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/clients" className="text-t3 hover:text-t1 transition text-sm">← Clients</Link>
        <div>
          <h1 className="text-2xl font-bold text-t1 tracking-tight">{client.company ?? client.name ?? client.email}</h1>
          <p className="text-sm text-t2">Semaine du {weekLabel}</p>
        </div>
        <Link
          href={`/admin/deliver?clientId=${id}`}
          className="ml-auto text-xs font-semibold bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition"
        >
          Livrer des posts →
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Posts */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-t1">Posts de la semaine</h2>
          {posts.length === 0 ? (
            <div className="bg-white border border-border rounded-2xl p-8 text-center">
              <p className="text-sm text-t3">Aucun post livré pour cette semaine.</p>
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post.id}
                post={{ ...post, title: post.title || undefined }}
              />
            ))
          )}
        </div>

        {/* Actus */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-t1">Actus partagées</h2>
          <div className="bg-white border border-border rounded-2xl p-5">
            {news ? (
              <p className="text-sm text-t2 leading-relaxed whitespace-pre-wrap">{news.content}</p>
            ) : (
              <p className="text-sm text-t3">Aucune actu partagée cette semaine.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
