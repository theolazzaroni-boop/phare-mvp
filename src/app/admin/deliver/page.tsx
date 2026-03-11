import { prisma } from "@/lib/prisma";
import DeliverForm from "@/components/DeliverForm";

export default async function DeliverPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const { clientId } = await searchParams;

  const clients = await prisma.profile.findMany({
    where: { role: "CLIENT" },
    orderBy: { company: "asc" },
  });

  const selectedClient = clientId
    ? clients.find(c => c.id === clientId) ?? null
    : null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-t1 tracking-tight mb-1">Livrer des posts</h1>
        <p className="text-sm text-t2">Déposez les 4 posts de la semaine pour un client.</p>
      </div>

      <DeliverForm clients={clients} selectedClientId={clientId ?? null} />
    </div>
  );
}
