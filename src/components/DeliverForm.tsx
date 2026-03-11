"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DAYS = [
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
];

interface Client {
  id: string;
  name: string | null;
  company: string | null;
  email: string;
}

const emptyPost = () => ({ dayOfWeek: 1, publishTime: "08:00", content: "" });

export default function DeliverForm({
  clients,
  selectedClientId,
}: {
  clients: Client[];
  selectedClientId: string | null;
}) {
  const router = useRouter();
  const [clientId, setClientId] = useState(selectedClientId ?? "");
  const [weekStart, setWeekStart] = useState(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diff);
    return monday.toISOString().split("T")[0];
  });
  const [posts, setPosts] = useState([emptyPost(), emptyPost(), emptyPost(), emptyPost()]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function updatePost(i: number, field: string, value: string | number) {
    setPosts(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin/deliver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientId, weekStart, posts }),
    });
    setDone(true);
    setLoading(false);
    router.refresh();
  }

  if (done) {
    return (
      <div className="bg-white border border-border rounded-2xl p-12 text-center max-w-md">
        <div className="text-3xl mb-3">✅</div>
        <div className="text-base font-semibold text-t1 mb-1">Posts livrés avec succès !</div>
        <div className="text-sm text-t2 mb-4">Le client peut les consulter dans son espace.</div>
        <button
          onClick={() => { setDone(false); setPosts([emptyPost(), emptyPost(), emptyPost(), emptyPost()]); }}
          className="text-sm font-semibold text-accent hover:underline"
        >
          Livrer pour un autre client
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {/* Client + week */}
      <div className="bg-white border border-border rounded-2xl p-5 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-t1 mb-1.5">Client *</label>
          <select
            value={clientId}
            onChange={e => setClientId(e.target.value)}
            required
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-bg-base outline-none focus:border-accent transition"
          >
            <option value="">Sélectionner un client</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.company ?? c.name ?? c.email}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-t1 mb-1.5">Semaine (lundi) *</label>
          <input
            type="date"
            value={weekStart}
            onChange={e => setWeekStart(e.target.value)}
            required
            className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-bg-base outline-none focus:border-accent transition"
          />
        </div>
      </div>

      {/* Posts */}
      {posts.map((post, i) => (
        <div key={i} className="bg-white border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-bold text-t3 uppercase tracking-wider">Post {i + 1}</span>
            <select
              value={post.dayOfWeek}
              onChange={e => updatePost(i, "dayOfWeek", Number(e.target.value))}
              className="text-sm px-2.5 py-1.5 border border-border rounded-lg bg-bg-base outline-none focus:border-accent transition"
            >
              {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
            <input
              type="time"
              value={post.publishTime}
              onChange={e => updatePost(i, "publishTime", e.target.value)}
              className="text-sm px-2.5 py-1.5 border border-border rounded-lg bg-bg-base outline-none focus:border-accent transition"
            />
          </div>
          <textarea
            value={post.content}
            onChange={e => updatePost(i, "content", e.target.value)}
            placeholder={`Contenu du post ${i + 1}…`}
            rows={6}
            required
            className="w-full text-sm px-3 py-2.5 border border-border rounded-xl bg-bg-base resize-none outline-none focus:border-accent transition leading-relaxed"
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="bg-accent text-white font-semibold text-sm px-6 py-2.5 rounded-xl disabled:opacity-50 hover:bg-accent/90 transition"
      >
        {loading ? "Livraison…" : "Livrer les 4 posts →"}
      </button>
    </form>
  );
}
