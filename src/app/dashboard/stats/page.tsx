import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

function getThisWeekStart() {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diff));
}

export default async function StatsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const stats = await prisma.weeklyStats.findMany({
    where: { profileId: user.id },
    orderBy: { weekStart: "desc" },
    take: 8,
  });

  const latest = stats[0];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-t1 tracking-tight mb-1">Mes statistiques</h1>
        <p className="text-sm text-t2">Suivi de votre présence LinkedIn semaine après semaine.</p>
      </div>

      {!latest ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center max-w-md mx-auto">
          <div className="text-3xl mb-4">📈</div>
          <div className="text-base font-semibold text-t1 mb-2">Disponible dès votre 2ème semaine</div>
          <div className="text-sm text-t2 leading-relaxed">
            On remplit vos statistiques après votre première semaine complète — impressions, engagements, nouveaux abonnés et leads déclarés.
          </div>
          <div className="mt-6 flex flex-col gap-2 text-left max-w-xs mx-auto">
            {[
              "👁️ Impressions hebdomadaires",
              "💬 Engagements",
              "👥 Nouveaux abonnés",
              "🎯 Leads déclarés",
            ].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-t3">
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Impressions", value: latest.impressions.toLocaleString("fr-FR"), icon: "👁️" },
              { label: "Engagements", value: latest.engagements.toLocaleString("fr-FR"), icon: "💬" },
              { label: "Nouveaux abonnés", value: `+${latest.followers}`, icon: "👥" },
              { label: "Leads déclarés", value: `+${latest.leads}`, icon: "🎯" },
            ].map(kpi => (
              <div key={kpi.label} className="bg-white border border-border rounded-2xl p-5">
                <div className="text-xl mb-2">{kpi.icon}</div>
                <div className="text-2xl font-bold text-t1 tracking-tight">{kpi.value}</div>
                <div className="text-xs text-t2 mt-0.5">{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Weekly history */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-sm font-semibold text-t1">Historique</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-2 text-xs font-semibold text-t3 uppercase tracking-wider">
                  <th className="px-5 py-3 text-left">Semaine</th>
                  <th className="px-5 py-3 text-right">Impressions</th>
                  <th className="px-5 py-3 text-right">Engagements</th>
                  <th className="px-5 py-3 text-right">Abonnés</th>
                  <th className="px-5 py-3 text-right">Leads</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s, i) => (
                  <tr key={s.id} className={`border-b border-border ${i === 0 ? "font-semibold" : ""}`}>
                    <td className="px-5 py-3 text-t2">
                      {s.weekStart.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-5 py-3 text-right">{s.impressions.toLocaleString("fr-FR")}</td>
                    <td className="px-5 py-3 text-right">{s.engagements.toLocaleString("fr-FR")}</td>
                    <td className="px-5 py-3 text-right text-green">+{s.followers}</td>
                    <td className="px-5 py-3 text-right text-accent">+{s.leads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
