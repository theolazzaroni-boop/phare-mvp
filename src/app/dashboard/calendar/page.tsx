import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const STATUS_COLORS: Record<string, string> = {
  DRAFT:              "border-border bg-bg-2 text-t3",
  READY:              "border-green/30 bg-green/5 text-green",
  PUBLISHED:          "border-accent/30 bg-accent-xl text-accent",
  REVISION_REQUESTED: "border-orange-200 bg-orange-50 text-orange-500",
};

function getThisWeekStart() {
  const now = new Date();
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export default async function CalendarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const weekStart = getThisWeekStart();
  const posts = await prisma.post.findMany({
    where: { profileId: user.id, weekStart },
    orderBy: { dayOfWeek: "asc" },
  });

  const byDay = Object.fromEntries(
    [1, 2, 3, 4, 5].map(d => [d, posts.filter(p => p.dayOfWeek === d)])
  );

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 4);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-t1 tracking-tight mb-1">Calendrier de publication</h1>
        <p className="text-sm text-t2">
          Semaine du {weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} au{" "}
          {weekEnd.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map(d => {
          const date = new Date(weekStart);
          date.setDate(weekStart.getDate() + d - 1);
          const dayPosts = byDay[d];
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div key={d} className={`flex flex-col gap-2`}>
              {/* Day header */}
              <div className={`text-center py-2 rounded-lg ${isToday ? "bg-accent text-white" : "bg-bg-2 text-t2"}`}>
                <div className="text-xs font-semibold uppercase tracking-wider">{DAYS[d - 1]}</div>
                <div className="text-sm font-bold">{date.getDate()}</div>
              </div>

              {/* Posts */}
              {dayPosts.length > 0 ? (
                dayPosts.map(post => (
                  <div
                    key={post.id}
                    className={`border rounded-xl p-3 text-xs leading-relaxed line-clamp-4 ${STATUS_COLORS[post.status] ?? STATUS_COLORS.DRAFT}`}
                  >
                    <div className="font-semibold mb-1">{post.publishTime}</div>
                    {post.content.slice(0, 80)}…
                  </div>
                ))
              ) : (
                <div className="border border-dashed border-border rounded-xl p-3 text-xs text-t3 text-center">
                  —
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
