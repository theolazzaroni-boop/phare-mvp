"use client";

import { useState } from "react";

export default function NewsForm({
  weekStart,
  existing,
}: {
  weekStart: string;
  existing: string | null;
}) {
  const [content, setContent] = useState(existing ?? "");
  const [saved, setSaved] = useState(!!existing);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, weekStart }),
    });

    setSaved(true);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={e => { setContent(e.target.value); setSaved(false); }}
        placeholder="Contrat signé, chantier livré, nouveau recrutement, machine acquise… Tout ce qui s'est passé cette semaine."
        rows={5}
        className="w-full text-sm px-4 py-3 border border-border rounded-xl bg-bg-base resize-none outline-none focus:border-accent focus:ring-2 focus:ring-accent-xl transition leading-relaxed"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-t3">On intègre vos actus dans vos posts de la semaine prochaine.</p>
        <button
          type="submit"
          disabled={loading || !content.trim() || saved}
          className="text-sm font-semibold bg-accent text-white px-4 py-2 rounded-lg disabled:opacity-50 transition hover:bg-accent/90"
        >
          {saved ? "✓ Enregistré" : loading ? "Envoi…" : "Envoyer"}
        </button>
      </div>
    </form>
  );
}
