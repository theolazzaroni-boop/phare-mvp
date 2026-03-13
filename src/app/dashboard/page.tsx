import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

function getThisWeekStart() {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diff));
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  DRAFT:              { label: "En préparation", color: "text-t3",         bg: "bg-bg-2" },
  READY:              { label: "Prêt à publier", color: "text-green",      bg: "bg-green/10" },
  PUBLISHED:          { label: "Publié",          color: "text-green",      bg: "bg-green/10" },
  REVISION_REQUESTED: { label: "Révision",        color: "text-amber-600",  bg: "bg-amber-50" },
};

const TYPE_EMOJI: Record<string, string> = {
  "Avant / Après": "🔄",
  "Opinion":       "💬",
  "Coulisses":     "🎬",
  "Témoignage":    "🤝",
  "Éducatif":      "💡",
  "Storytelling":  "📖",
  "Général":       "✍️",
};

const DAYS = ["", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const weekStart = getThisWeekStart();

  const [profile, posts, news, stats] = await Promise.all([
    prisma.profile.findUnique({ where: { id: user.id } }),
    prisma.post.findMany({ where: { profileId: user.id, weekStart }, orderBy: { dayOfWeek: "asc" } }),
    prisma.weeklyNews.findFirst({ where: { profileId: user.id, weekStart } }),
    prisma.weeklyStats.findFirst({ where: { profileId: user.id }, orderBy: { weekStart: "desc" } }),
  ]);

  if (!profile) redirect("/login");

  const firstName = profile.name?.split(" ")[0] ?? profile.email;
  const published = posts.filter(p => p.status === "PUBLISHED").length;
  const ready = posts.filter(p => p.status === "READY").length;
  const weekLabel = weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

  const linkedinConnected = !!profile.linkedinAccessToken;

  return (
    <div className="max-w-3xl space-y-6">

      {/* LinkedIn connect banner */}
      {!linkedinConnected && (
        <a
          href="/api/linkedin/connect"
          className="flex items-center justify-between gap-4 bg-white border border-border rounded-2xl px-5 py-4 hover:border-accent/40 transition group"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🔗</span>
            <div>
              <div className="text-sm font-semibold text-t1">Connectez votre LinkedIn</div>
              <div className="text-xs text-t2">Pour publier vos posts directement depuis Phare</div>
            </div>
          </div>
          <span className="text-xs font-semibold text-accent group-hover:underline shrink-0">Connecter →</span>
        </a>
      )}

      {linkedinConnected && (
        <div className="flex items-center gap-3 bg-green/10 border border-green/20 rounded-2xl px-5 py-3">
          <span className="text-base">✓</span>
          <span className="text-sm font-medium text-green">LinkedIn connecté — vos posts peuvent être publiés automatiquement</span>
        </div>
      )}

      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-t1 tracking-tight">Bonjour {firstName} 👋</h1>
        <p className="text-sm text-t2 mt-1">Semaine du {weekLabel} — voici où vous en êtes.</p>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="text-2xl font-bold text-t1">{posts.length}</div>
          <div className="text-xs text-t2 mt-1">Posts livrés cette semaine</div>
        </div>
        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="text-2xl font-bold text-green">{published}</div>
          <div className="text-xs text-t2 mt-1">Publiés sur LinkedIn</div>
        </div>
        <div className={`border rounded-2xl p-5 ${news ? "bg-green/10 border-green/20" : "bg-white border-border"}`}>
          <div className={`text-2xl font-bold ${news ? "text-green" : "text-t3"}`}>
            {news ? "✓" : "—"}
          </div>
          <div className="text-xs text-t2 mt-1">Actus partagées</div>
        </div>
      </div>

      {/* Posts de la semaine */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-t1">Posts de la semaine</h2>
          <Link href="/dashboard/posts" className="text-xs text-accent font-semibold hover:underline">
            Voir tout →
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-t3">Vos posts arrivent lundi matin.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {posts.map(post => {
              const s = STATUS_CONFIG[post.status] ?? STATUS_CONFIG.DRAFT;
              return (
                <div key={post.id} className="px-5 py-3 flex items-center gap-3">
                  <span className="text-base">{TYPE_EMOJI[post.postType] ?? "✍️"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-t1 truncate">{post.title || post.content.slice(0, 50) + "…"}</div>
                    <div className="text-xs text-t3">{DAYS[post.dayOfWeek]} · {post.publishTime}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${s.bg} ${s.color}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actus + Stats côte à côte */}
      <div className="grid grid-cols-2 gap-4">

        {/* Actus */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-t1">Actus cette semaine</h2>
            <Link href="/dashboard/news" className="text-xs text-accent font-semibold hover:underline">
              {news ? "Modifier" : "Partager →"}
            </Link>
          </div>
          <div className="px-5 py-4">
            {news ? (
              <p className="text-sm text-t2 leading-relaxed whitespace-pre-wrap line-clamp-4">{news.content}</p>
            ) : (
              <p className="text-sm text-t3">Rien de partagé pour cette semaine.</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-t1">Statistiques</h2>
            <Link href="/dashboard/stats" className="text-xs text-accent font-semibold hover:underline">
              Voir tout →
            </Link>
          </div>
          <div className="px-5 py-4">
            {stats ? (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Impressions", value: stats.impressions.toLocaleString("fr-FR") },
                  { label: "Engagements", value: stats.engagements.toLocaleString("fr-FR") },
                  { label: "Abonnés", value: `+${stats.followers}` },
                  { label: "Leads", value: `+${stats.leads}` },
                ].map(k => (
                  <div key={k.label}>
                    <div className="text-base font-bold text-t1">{k.value}</div>
                    <div className="text-xs text-t3">{k.label}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-t3">Disponible dès votre 2ème semaine.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
