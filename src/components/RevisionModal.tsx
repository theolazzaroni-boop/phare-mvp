"use client";

import { useState } from "react";

const ISSUES = [
  { id: "accroche",   label: "L'accroche",      emoji: "🎯", desc: "Les premières lignes ne donnent pas envie de lire" },
  { id: "ton",        label: "Le ton",           emoji: "🎭", desc: "Le registre ne me ressemble pas" },
  { id: "contenu",    label: "Le contenu",       emoji: "📝", desc: "Une info est incorrecte ou manquante" },
  { id: "longueur",   label: "La longueur",      emoji: "📏", desc: "Le post est trop long ou trop court" },
  { id: "conclusion", label: "La conclusion",    emoji: "🔚", desc: "La fin ou le call-to-action à revoir" },
  { id: "angle",      label: "L'angle",          emoji: "💡", desc: "Je veux changer la perspective du post" },
];

const FOLLOW_UPS: Record<string, { id: string; label: string }[]> = {
  accroche: [
    { id: "reformuler",  label: "Reformuler complètement" },
    { id: "question",    label: "Commencer par une question" },
    { id: "chiffre",     label: "Commencer par un chiffre fort" },
    { id: "histoire",    label: "Commencer par une anecdote" },
  ],
  ton: [
    { id: "personnel",   label: "Plus personnel / authentique" },
    { id: "pro",         label: "Plus professionnel" },
    { id: "direct",      label: "Plus direct" },
    { id: "decontracte", label: "Plus décontracté" },
  ],
  contenu: [
    { id: "incorrect",   label: "Une information est incorrecte" },
    { id: "ajouter",     label: "Ajouter une information" },
    { id: "retirer",     label: "Retirer une information" },
    { id: "chiffre",     label: "Mettre à jour un chiffre / fait" },
  ],
  longueur: [
    { id: "raccourcir",  label: "Raccourcir" },
    { id: "allonger",    label: "Allonger" },
  ],
  conclusion: [
    { id: "cta",         label: "Reformuler le call-to-action" },
    { id: "question",    label: "Finir sur une question" },
    { id: "supprimer",   label: "Supprimer la conclusion" },
  ],
  angle: [
    { id: "benefice",    label: "Mettre en avant un autre bénéfice" },
    { id: "perspective", label: "Changer de point de vue" },
    { id: "cible",       label: "Parler à une autre cible" },
  ],
};

interface Props {
  onClose: () => void;
  onSubmit: (message: string) => void;
  loading: boolean;
}

export default function RevisionModal({ onClose, onSubmit, loading }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [issue, setIssue] = useState<string | null>(null);
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [details, setDetails] = useState("");

  function selectIssue(id: string) {
    setIssue(id);
    setFollowUp(null);
    setStep(2);
  }

  function handleSubmit() {
    const parts: string[] = [];
    const issueLabel = ISSUES.find(i => i.id === issue)?.label;
    if (issueLabel) parts.push(`Problème : ${issueLabel}`);
    if (followUp) {
      const fuLabel = FOLLOW_UPS[issue!]?.find(f => f.id === followUp)?.label;
      if (fuLabel) parts.push(`Direction : ${fuLabel}`);
    }
    if (details.trim()) parts.push(`Précisions : ${details.trim()}`);
    onSubmit(parts.join(" · "));
  }

  const selectedIssue = ISSUES.find(i => i.id === issue);
  const followUps = issue ? FOLLOW_UPS[issue] : [];
  const canSubmit = issue && (followUp || details.trim());

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-t3 hover:text-t1 transition text-sm"
              >
                ←
              </button>
            )}
            <div>
              <h2 className="text-base font-bold text-t1">
                {step === 1 ? "Qu'est-ce qui pose problème ?" : `${selectedIssue?.emoji} ${selectedIssue?.label}`}
              </h2>
              <p className="text-xs text-t3 mt-0.5">
                {step === 1 ? "Étape 1 sur 2" : "Étape 2 sur 2"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-t3 hover:text-t1 transition text-lg leading-none">✕</button>
        </div>

        <div className="px-6 py-5">

          {/* Step 1 — pick issue */}
          {step === 1 && (
            <div className="space-y-2">
              {ISSUES.map(item => (
                <button
                  key={item.id}
                  onClick={() => selectIssue(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-accent/50 hover:bg-accent-xl text-left transition group"
                >
                  <span className="text-xl">{item.emoji}</span>
                  <div>
                    <div className="text-sm font-semibold text-t1 group-hover:text-accent transition">{item.label}</div>
                    <div className="text-xs text-t3">{item.desc}</div>
                  </div>
                  <span className="ml-auto text-t3 group-hover:text-accent transition">→</span>
                </button>
              ))}
            </div>
          )}

          {/* Step 2 — follow-up options + details */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold text-t2 uppercase tracking-wide mb-2.5">Dans quel sens ?</p>
                <div className="flex flex-wrap gap-2">
                  {followUps.map(item => {
                    const active = followUp === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setFollowUp(active ? null : item.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition
                          ${active
                            ? "bg-accent text-white border-accent"
                            : "bg-white text-t2 border-border hover:border-accent/50 hover:text-accent"
                          }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-t2 uppercase tracking-wide mb-2.5">
                  Précisions <span className="text-t3 normal-case font-normal">(optionnel)</span>
                </p>
                <textarea
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  placeholder="Ex : mentionner notre nouveau délai de 48h, reformuler avec notre chantier à Lyon…"
                  rows={3}
                  className="w-full text-sm px-3.5 py-2.5 border border-border rounded-xl bg-bg-base resize-none outline-none focus:border-accent focus:ring-2 focus:ring-accent-xl transition"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={!canSubmit || loading}
                className="w-full bg-green text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-green/90 transition disabled:opacity-40"
              >
                {loading ? "Envoi…" : "Envoyer la demande →"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
