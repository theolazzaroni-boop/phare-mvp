"use client";

import { useState } from "react";

const ACTU_TYPES = [
  { id: "chantier_lance",   emoji: "🏗️",  label: "Chantier lancé",          placeholder: "Quel chantier ? Où ? Pour qui ?" },
  { id: "chantier_livre",   emoji: "✅",  label: "Chantier livré",           placeholder: "Quel projet ? Une anecdote marquante ?" },
  { id: "contrat_signe",    emoji: "📝",  label: "Contrat signé",            placeholder: "Quel type de projet ? Quelle taille ?" },
  { id: "recrutement",      emoji: "👷",  label: "Recrutement",              placeholder: "Quel poste ? Pourquoi ce recrutement ?" },
  { id: "equipement",       emoji: "🔧",  label: "Nouvelle machine / outil", placeholder: "Quoi ? Pourquoi cet investissement ?" },
  { id: "partenariat",      emoji: "🤝",  label: "Nouveau partenariat",      placeholder: "Avec qui ? Pour faire quoi ?" },
  { id: "temoignage",       emoji: "💬",  label: "Retour client",            placeholder: "Ce que le client a dit ou vécu ?" },
  { id: "recompense",       emoji: "🏆",  label: "Récompense / label",       placeholder: "Lequel ? Qu'est-ce que ça représente ?" },
  { id: "secteur",          emoji: "📍",  label: "Nouveau secteur / ville",  placeholder: "Quelle zone ? Première fois ?" },
  { id: "eco",              emoji: "🌱",  label: "Démarche éco / label",     placeholder: "Quelle initiative ? Quel impact ?" },
  { id: "autre",            emoji: "✨",  label: "Autre",                    placeholder: "Racontez-nous…" },
];

interface SelectedActu {
  id: string;
  detail: string;
}

export default function NewsForm({
  weekStart,
  existing,
}: {
  weekStart: string;
  existing: string | null;
}) {
  const [selected, setSelected] = useState<SelectedActu[]>([]);
  const [saved, setSaved] = useState(!!existing);
  const [loading, setLoading] = useState(false);

  function toggle(id: string) {
    setSaved(false);
    setSelected(prev => {
      if (prev.find(s => s.id === id)) return prev.filter(s => s.id !== id);
      return [...prev, { id, detail: "" }];
    });
  }

  function setDetail(id: string, detail: string) {
    setSaved(false);
    setSelected(prev => prev.map(s => s.id === id ? { ...s, detail } : s));
  }

  function isSelected(id: string) {
    return !!selected.find(s => s.id === id);
  }

  function getDetail(id: string) {
    return selected.find(s => s.id === id)?.detail ?? "";
  }

  async function handleSubmit() {
    if (selected.length === 0) return;
    setLoading(true);

    const content = selected.map(s => {
      const type = ACTU_TYPES.find(a => a.id === s.id);
      return `${type?.emoji} ${type?.label}${s.detail.trim() ? ` : ${s.detail.trim()}` : ""}`;
    }).join("\n");

    await fetch("/api/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, weekStart }),
    });

    setSaved(true);
    setLoading(false);
  }

  return (
    <div className="space-y-4">

      {/* Existing content display */}
      {existing && saved && (
        <div className="bg-bg-2 rounded-xl px-4 py-3 text-sm text-t2 leading-relaxed whitespace-pre-wrap">
          {existing}
        </div>
      )}

      {!saved && (
        <>
          {/* Grid of actu types */}
          <div className="grid grid-cols-2 gap-2">
            {ACTU_TYPES.map(type => {
              const active = isSelected(type.id);
              return (
                <div key={type.id} className="flex flex-col gap-2">
                  <button
                    onClick={() => toggle(type.id)}
                    className={`flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-sm font-medium text-left transition
                      ${active
                        ? "bg-accent text-white border-accent"
                        : "bg-white text-t1 border-border hover:border-accent/40 hover:bg-accent-xl"
                      }`}
                  >
                    <span className="text-lg">{type.emoji}</span>
                    <span className="leading-tight">{type.label}</span>
                  </button>

                  {active && (
                    <input
                      autoFocus
                      type="text"
                      value={getDetail(type.id)}
                      onChange={e => setDetail(type.id, e.target.value)}
                      placeholder={type.placeholder}
                      className="w-full text-xs px-3 py-2 border border-accent/30 rounded-lg bg-accent-xl outline-none focus:border-accent transition placeholder:text-t3"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-t3">
              {selected.length === 0 ? "Sélectionnez ce qui s'est passé cette semaine." : `${selected.length} actu${selected.length > 1 ? "s" : ""} sélectionnée${selected.length > 1 ? "s" : ""}`}
            </p>
            <button
              onClick={handleSubmit}
              disabled={loading || selected.length === 0}
              className="text-sm font-semibold bg-green text-white px-4 py-2 rounded-lg disabled:opacity-40 transition hover:bg-green/90"
            >
              {loading ? "Envoi…" : "Envoyer →"}
            </button>
          </div>
        </>
      )}

      {saved && (
        <button
          onClick={() => { setSaved(false); setSelected([]); }}
          className="text-xs text-accent font-semibold hover:underline"
        >
          Modifier
        </button>
      )}

    </div>
  );
}
