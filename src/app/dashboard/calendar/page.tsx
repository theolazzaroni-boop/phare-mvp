import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import CalendarView from "@/components/CalendarView";

function getWeekStart(offsetWeeks = 0) {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const base = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diff));
  base.setUTCDate(base.getUTCDate() + offsetWeeks * 7);
  return base;
}

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ week?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { week } = await searchParams;
  const offset = parseInt(week ?? "0", 10) || 0;
  const weekStart = getWeekStart(offset);

  const [posts, profile] = await Promise.all([
    prisma.post.findMany({ where: { profileId: user.id, weekStart }, orderBy: { dayOfWeek: "asc" } }),
    prisma.profile.findUnique({ where: { id: user.id } }),
  ]);

  const linkedinConnected = !!profile?.linkedinAccessToken;

  const DAY_LABELS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
  const today = new Date().toDateString();

  const days = [1, 2, 3, 4, 5].map((d, i) => {
    const date = new Date(Date.UTC(weekStart.getUTCFullYear(), weekStart.getUTCMonth(), weekStart.getUTCDate() + i));
    return {
      label: DAY_LABELS[i],
      date,
      isToday: new Date(date).toDateString() === today,
    };
  });

  const weekEnd = days[4].date;
  const weekLabel = `Semaine du ${days[0].date.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} au ${weekEnd.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;

  return (
    <CalendarView
      posts={posts.map(p => ({
        id: p.id,
        title: p.title || undefined,
        content: p.content,
        dayOfWeek: p.dayOfWeek,
        publishTime: p.publishTime,
        postType: p.postType,
        status: p.status,
      }))}
      days={days}
      weekLabel={weekLabel}
      weekOffset={offset}
      linkedinConnected={linkedinConnected}
    />
  );
}
