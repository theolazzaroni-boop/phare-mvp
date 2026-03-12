"use client";

import { useState } from "react";

const THEMES = [
  { id: "posts",    emoji: "✍️", label: "Une question sur mes posts" },
  { id: "revision", emoji: "🔄", label: "Suivre une demande de révision" },
  { id: "plan",     emoji: "📦", label: "Mon abonnement ou mon offre" },
  { id: "bug",      emoji: "🐛", label: "Un problème technique" },
  { id: "other",    emoji: "💬", label: "Autre chose" },
];

const EMAIL = "hello@phare.io";

export default function ContactModal({ onClose }: { onClose: () => void }) {
  const [theme, setTheme] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSend() {
    if (!message.trim()) return;
    setLoading(true);
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme, message }),
    });
    setLoading(false);
    setSent(true);
  }

  function copyEmail() {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-t1">Contacter l'équipe</h2>
            <p className="text-xs text-t3 mt-0.5">On vous répond sous 24h.</p>
          </div>
          <button onClick={onClose} className="text-t3 hover:text-t1 transition text-lg leading-none">✕</button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Success */}
          {sent ? (
            <div className="text-center py-4 space-y-2">
              <div className="text-3xl">✅</div>
              <p className="text-sm font-semibold text-t1">Message envoyé !</p>
              <p className="text-xs text-t3">On revient vers vous sous 24h.</p>
              <button
                onClick={onClose}
                className="mt-2 text-xs text-accent font-semibold hover:underline"
              >
                Fermer
              </button>
            </div>
          ) : (
            <>
              {/* Themes */}
              <div>
                <p className="text-xs font-semibold text-t2 uppercase tracking-wide mb-2.5">C'est à propos de…</p>
                <div className="space-y-1.5">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(theme === t.id ? null : t.id)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-sm font-medium text-left transition
                        ${theme === t.id
                          ? "bg-accent text-white border-accent"
                          : "bg-white text-t1 border-border hover:border-accent/40 hover:bg-accent-xl"
                        }`}
                    >
                      <span>{t.emoji}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message field — shown once a theme is selected */}
              {theme && (
                <div>
                  <p className="text-xs font-semibold text-t2 uppercase tracking-wide mb-2.5">Votre message</p>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Décrivez votre demande en quelques mots…"
                    rows={4}
                    autoFocus
                    className="w-full text-sm px-3.5 py-2.5 border border-border rounded-xl bg-bg-base resize-none outline-none focus:border-accent focus:ring-2 focus:ring-accent-xl transition"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!message.trim() || loading}
                    className="mt-3 w-full bg-accent text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-accent/90 transition disabled:opacity-40"
                  >
                    {loading ? "Envoi…" : "Envoyer le message →"}
                  </button>
                </div>
              )}

              {/* Fallback email */}
              {!theme && (
                <div className="text-center space-y-2 pt-1">
                  <p className="text-xs text-t3">Ou écrivez-nous directement à</p>
                  <div className="inline-flex items-center gap-2 bg-bg-2 rounded-xl px-4 py-2.5">
                    <span className="text-sm font-medium text-t1">{EMAIL}</span>
                    <button
                      onClick={copyEmail}
                      className={`text-xs font-semibold transition ${copied ? "text-green" : "text-t3 hover:text-t1"}`}
                    >
                      {copied ? "✓ Copié" : "Copier"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
