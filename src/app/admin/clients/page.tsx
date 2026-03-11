import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminClientsPage() {
  const clients = await prisma.profile.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { posts: true, weeklyNews: true } },
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-t1 tracking-tight mb-1">Clients</h1>
        <p className="text-sm text-t2">{clients.length} client{clients.length > 1 ? "s" : ""} actif{clients.length > 1 ? "s" : ""}</p>
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-2 text-xs font-semibold text-t3 uppercase tracking-wider">
              <th className="px-5 py-3 text-left">Client</th>
              <th className="px-5 py-3 text-left">Entreprise</th>
              <th className="px-5 py-3 text-right">Posts</th>
              <th className="px-5 py-3 text-right">Actus</th>
              <th className="px-5 py-3 text-right">Inscrit le</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} className="border-b border-border last:border-0 hover:bg-bg-2 transition-colors">
                <td className="px-5 py-3">
                  <div className="font-medium text-t1">{client.name ?? "—"}</div>
                  <div className="text-xs text-t3">{client.email}</div>
                </td>
                <td className="px-5 py-3 text-t2">{client.company ?? "—"}</td>
                <td className="px-5 py-3 text-right font-semibold">{client._count.posts}</td>
                <td className="px-5 py-3 text-right">{client._count.weeklyNews}</td>
                <td className="px-5 py-3 text-right text-t3 text-xs">
                  {client.createdAt.toLocaleDateString("fr-FR")}
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/deliver?clientId=${client.id}`}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    Livrer →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
