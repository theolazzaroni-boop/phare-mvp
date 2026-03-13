"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RevisionModal from "./RevisionModal";

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
  DRAFT:              { label: "En préparation",   dot: "bg-t3",         text: "text-t3" },
  READY:              { label: "Prêt à publier",   dot: "bg-green",      text: "text-green" },
  PUBLISHED:          { label: "Publié",            dot: "bg-accent",     text: "text-accent" },
  REVISION_REQUESTED: { label: "Révision en cours", dot: "bg-amber-400", text: "text-amber-600" },
};

const DAYS = ["", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

interface Post {
  id: string;
  title?: string;
  content: string;
  dayOfWeek: number;
  publishTime: string;
  postType: string;
  status: string;
}

export default function PostCard({
  post,
  defaultExpanded = false,
  linkedinConnected = false,
}: {
  post: Post;
  defaultExpanded?: boolean;
  linkedinConnected?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);
  const [showRevision, setShowRevision] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [manualStep, setManualStep] = useState(false);
  const [status, setStatus] = useState(post.status);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const type = TYPE_CONFIG[post.postType] ?? TYPE_CONFIG["Général"];
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT;
  const content = post.content.trim();
  const preview = content.slice(0, 160);
  const isLong = content.length > 160;

  async function handleCopy() {
    await navigator.clipboard.writeText(post.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handlePublish(auto: boolean) {
    setLoading("publish");
    setError(null);
    const res = await fetch(`/api/posts/${post.id}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auto }),
    });
    if (res.ok) {
      setStatus("PUBLISHED");
      setShowPublishModal(false);
      setManualStep(false);
    } else {
      const data = await res.json();
      setError(data.error ?? "Une erreur est survenue.");
    }
    setLoading(null);
  }

  async function handleManualChoice() {
    await navigator.clipboard.writeText(post.content);
    setManualStep(true);
  }

  async function handleUnpublish() {
    setLoading("unpublish");
    await fetch(`/api/posts/${post.id}/unpublish`, { method: "POST" });
    setStatus("READY");
    setLoading(null);
  }

  async function submitRevision(message: string) {
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
    <div className={`rounded-2xl border border-border border-l-4 ${type.border} overflow-hidden flex flex-col bg-white`}>

      {/* Published banner */}
      {status === "PUBLISHED" && (
        <div className="px-5 py-2 bg-green flex items-center gap-2">
          <span className="text-white text-xs font-bold">✓ Publié sur LinkedIn</span>
        </div>
      )}

      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-t1">{DAYS[post.dayOfWeek]}</span>
            <span className="text-sm text-t3 font-medium">{post.publishTime}</span>
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${type.bg} ${type.color}`}>
            <span>{type.emoji}</span>
            {post.postType}
          </span>
        </div>
        {status !== "PUBLISHED" && (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold shrink-0 ${statusCfg.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}></span>
            {statusCfg.label}
          </span>
        )}
      </div>

      {/* Title */}
      {post.title && (
        <div className="px-5 pb-2">
          <h3 className="text-sm font-bold text-t1 leading-snug">{post.title}</h3>
        </div>
      )}

      {/* Content */}
      <div className="px-5 pb-4 flex-1">
        <p className="text-sm text-t1 leading-relaxed whitespace-pre-wrap">
          {expanded ? content : preview}
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

      {/* Revision modal */}
      {showRevision && (
        <RevisionModal
          onClose={() => setShowRevision(false)}
          onSubmit={submitRevision}
          loading={loading === "revision"}
        />
      )}

      {/* Actions */}
      <div className="px-5 py-3 border-t border-border bg-bg-base flex items-center justify-between gap-2">
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
              onClick={() => setShowPublishModal(true)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-green/10 text-green border border-green/30 px-3 py-1.5 rounded-lg hover:bg-green/20 transition"
            >
              ✓ Publier
            </button>
          )}
          {status === "PUBLISHED" && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-green-600">✦ En ligne</span>
              <button
                onClick={handleUnpublish}
                disabled={loading === "unpublish"}
                className="text-xs text-t3 hover:text-red-500 transition underline underline-offset-2 disabled:opacity-50"
              >
                {loading === "unpublish" ? "…" : "Mon post n'est pas encore publié"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Publish modal */}
      {showPublishModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => { if (!loading) { setShowPublishModal(false); setManualStep(false); } }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            onClick={e => e.stopPropagation()}
          >
            {!manualStep ? (
              <>
                <h3 className="text-base font-bold text-t1 mb-1">Publier ce post</h3>
                <p className="text-sm text-t2 mb-5">Comment souhaitez-vous publier ce post sur LinkedIn ?</p>

                {error && (
                  <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  {linkedinConnected && (
                    <button
                      onClick={() => handlePublish(true)}
                      disabled={!!loading}
                      className="w-full flex items-start gap-3 p-4 rounded-xl border-2 border-accent/30 bg-accent-xl hover:border-accent transition disabled:opacity-50 text-left"
                    >
                      <span className="text-xl mt-0.5">🚀</span>
                      <div>
                        <div className="text-sm font-semibold text-t1">Publier via Phare</div>
                        <div className="text-xs text-t2 mt-0.5">On s'en occupe directement sur votre LinkedIn</div>
                      </div>
                      {loading === "publish" && <span className="ml-auto text-xs text-t3 self-center">…</span>}
                    </button>
                  )}

                  <button
                    onClick={handleManualChoice}
                    disabled={!!loading}
                    className="w-full flex items-start gap-3 p-4 rounded-xl border-2 border-border hover:border-t2 transition disabled:opacity-50 text-left"
                  >
                    <span className="text-xl mt-0.5">📋</span>
                    <div>
                      <div className="text-sm font-semibold text-t1">Je publie le post moi-même</div>
                      <div className="text-xs text-t2 mt-0.5">Copiez le post et publiez-le sur votre profil</div>
                    </div>
                  </button>

                  {!linkedinConnected && (
                    <a
                      href="/api/linkedin/connect"
                      className="w-full flex items-center justify-center gap-2 text-xs font-medium text-accent hover:underline py-1"
                    >
                      Connecter mon LinkedIn pour publier automatiquement →
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setShowPublishModal(false)}
                  disabled={!!loading}
                  className="mt-4 w-full text-xs text-t3 hover:text-t1 transition"
                >
                  Annuler
                </button>
              </>
            ) : (
              <>
                <div className="text-center mb-5">
                  <div className="text-3xl mb-3">📋</div>
                  <h3 className="text-base font-bold text-t1 mb-1">Post copié !</h3>
                  <p className="text-sm text-t2">Vous pouvez directement aller le poster sur LinkedIn.</p>
                </div>

                <a
                  href="https://www.linkedin.com/feed/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-accent border border-accent/30 bg-accent-xl rounded-xl py-3 hover:bg-accent hover:text-white transition mb-3"
                >
                  Ouvrir LinkedIn →
                </a>

                <button
                  onClick={() => handlePublish(false)}
                  disabled={loading === "publish"}
                  className="w-full py-3 rounded-xl bg-green text-white text-sm font-semibold hover:bg-green/90 transition disabled:opacity-50"
                >
                  {loading === "publish" ? "…" : "J'ai bien publié mon post ✓"}
                </button>

                <button
                  onClick={() => setManualStep(false)}
                  className="mt-3 w-full text-xs text-t3 hover:text-t1 transition"
                >
                  Retour
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
