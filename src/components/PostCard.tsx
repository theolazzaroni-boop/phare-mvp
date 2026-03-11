"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TYPE_CONFIG: Record<string, { emoji: string; color: string; bg: string; border: string }> = {
  "Avant / Après":  { emoji: "🔄", color: "text-violet-600",  bg: "bg-violet-50",  border: "border-l-violet-400" },
  "Opinion":        { emoji: "💬", color: "text-rose-600",    bg: "bg-rose-50",    border: "border-l-rose-400" },
  "Coulisses":      { emoji: "🎬", color: "text-amber-600",   bg: "bg-amber-50",   border: "border-l-amber-400" },
  "Témoignage":     { emoji: "🤝", color: "text-green-600",   bg: "bg-green-50",   border: "border-l-green-400" },
  "Éducatif":       { emoji: "💡", color: "text-blue-600",    bg: "bg-blue-50",    border: "border-l-blue-400" },
  "Storytelling":   { emoji: "📖", color: "text-orange-600",  bg: "bg-orange-50",  border: "border-l-orange-400" },
  "Général":        { emoji: "✍️", color: "text-t2",          bg: "bg-bg-2",       border: "border-l-border" },
};

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string }> = {
  DRAFT:              { label: "En préparation", dot: "bg-t3",         text: "text-t3" },
  READY:              { label: "Prêt à publier", dot: "bg-green",      text: "text-green" },
  PUBLISHED:          { label: "Publié",          dot: "bg-accent",     text: "text-accent" },
  REVISION_REQUESTED: { label: "Révision en cours", dot: "bg-amber-400", text: "text-amber-600" },
};

const DAYS = ["", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

interface Post {
  id: string;
  content: string;
  dayOfWeek: number;
  publishTime: string;
  postType: string;
  status: string;
}

export default function PostCard({ post }: { post: Post }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRevision, setShowRevision] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(post.status);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const type = TYPE_CONFIG[post.postType] ?? TYPE_CONFIG["Général"];
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;
  const preview = post.content.slice(0, 160);
  const isLong = post.content.length > 160;

  async function handleCopy() {
    await navigator.clipboard.writeText(post.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handlePublish() {
    setLoading("publish");
    await fetch(`/api/posts/${post.id}/publish`, { method: "POST" });
    setStatus("PUBLISHED");
    setLoading(null);
    router.refresh();
  }

  async function submitRevision() {
    if (!message.trim()) return;
    setLoading("revision");
    await fetch(`/api/posts/${post.id}/revision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    setStatus("REVISION_REQUESTED");
    setShowRevision(false);
    setLoading(null);
    router.refresh();
  }

  return (
    <div className={`bg-white rounded-2xl border border-border border-l-4 ${type.border} overflow-hidden flex flex-col`}>

      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Type badge */}
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${type.bg} ${type.color}`}>
            <span>{type.emoji}</span>
            {post.postType}
          </span>
          {/* Day + time */}
          <span className="text-xs text-t3 font-medium">{DAYS[post.dayOfWeek]} · {post.publishTime}</span>
        </div>
        {/* Status */}
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold shrink-0 ${statusCfg.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}></span>
          {statusCfg.label}
        </span>
      </div>

      {/* Content */}
      <div className="px-5 pb-4 flex-1">
        <p className="text-sm text-t1 leading-relaxed whitespace-pre-wrap">
          {expanded ? post.content : preview}
          {!expanded && isLong && "…"}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(e => !e)}
            className="mt-2 text-xs text-accent font-medium hover:underline"
          >
            {expanded ? "Voir moins" : "Lire la suite"}
          </button>
        )}
      </div>

      {/* Revision form */}
      {showRevision && (
        <div className="px-5 pb-4 space-y-2 border-t border-border pt-3">
          <p className="text-xs font-semibold text-t2">Qu'est-ce qui doit changer ?</p>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Ton trop formel, ajouter notre nouveau délai de livraison, reformuler l'accroche…"
            rows={3}
            className="w-full text-sm px-3 py-2 border border-border rounded-lg bg-bg-base resize-none outline-none focus:border-accent transition"
          />
          <div className="flex gap-2">
            <button
              onClick={submitRevision}
              disabled={!message.trim() || loading === "revision"}
              className="text-xs font-semibold bg-accent text-white px-3 py-1.5 rounded-lg disabled:opacity-50 transition hover:bg-accent/90"
            >
              {loading === "revision" ? "Envoi…" : "Envoyer"}
            </button>
            <button onClick={() => setShowRevision(false)} className="text-xs text-t2 hover:text-t1 transition">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="px-5 py-3 border-t border-border bg-bg-base flex items-center justify-between gap-2">
        {/* Copy */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition
            ${copied
              ? "border-green/40 bg-green/10 text-green"
              : "border-border text-t2 hover:border-accent/40 hover:text-accent hover:bg-accent-xl"
            }`}
        >
          {copied ? "✓ Copié !" : "📋 Copier le post"}
        </button>

        <div className="flex items-center gap-2">
          {status === "READY" && !showRevision && (
            <button
              onClick={() => setShowRevision(true)}
              className="text-xs text-t3 hover:text-t2 transition underline underline-offset-2"
            >
              Demander une révision
            </button>
          )}
          {status === "READY" && (
            <button
              onClick={handlePublish}
              disabled={loading === "publish"}
              className="flex items-center gap-1.5 text-xs font-semibold bg-green/10 text-green border border-green/30 px-3 py-1.5 rounded-lg hover:bg-green/20 transition disabled:opacity-50"
            >
              {loading === "publish" ? "…" : "✓ Publié"}
            </button>
          )}
          {status === "PUBLISHED" && (
            <span className="text-xs font-semibold text-accent bg-accent-xl px-3 py-1.5 rounded-lg">
              ✦ En ligne
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
