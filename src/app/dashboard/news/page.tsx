import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import NewsForm from "@/components/NewsForm";

function getThisWeekStart() {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diff));
}

export default async function NewsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const weekStart = getThisWeekStart();

  const existing = await prisma.weeklyNews.findFirst({
    where: { profileId: user.id, weekStart },
  });

  const past = await prisma.weeklyNews.findMany({
    where: { profileId: user.id, weekStart: { lt: weekStart } },
    orderBy: { weekStart: "desc" },
    take: 4,
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-t1 tracking-tight mb-1">Mes actus de la semaine</h1>
        <p className="text-sm text-t2">
          Partagez vos nouveautés — on les intègre dans vos posts de la semaine prochaine.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Current week form */}
        <div className="bg-white border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold text-t1">Cette semaine</span>
            {existing && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green/10 text-green">✓ Envoyé</span>
            )}
          </div>
          <NewsForm
            weekStart={weekStart.toISOString()}
            existing={existing?.content ?? null}
          />
        </div>

        {/* Past entries */}
        {past.length > 0 && (
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-t1">Semaines précédentes</h2>
            </div>
            <div className="divide-y divide-border">
              {past.map(entry => (
                <div key={entry.id} className="px-5 py-4">
                  <div className="text-xs font-semibold text-t3 mb-1.5">
                    Semaine du {entry.weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                  </div>
                  <p className="text-sm text-t2 leading-relaxed">{entry.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
