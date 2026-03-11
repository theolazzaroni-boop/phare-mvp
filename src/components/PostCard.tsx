"use client";

import { useState } from "react";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT:              { label: "En préparation", color: "bg-bg-2 text-t3" },
  READY:              { label: "Prêt à publier", color: "bg-green/10 text-green" },
  PUBLISHED:          { label: "Publié",          color: "bg-accent-xl text-accent" },
  REVISION_REQUESTED: { label: "Révision demandée", color: "bg-orange-50 text-orange-500" },
};

interface Post {
  id: string;
  content: string;
  dayOfWeek: number;
  publishTime: string;
  status: string;
}

export default function PostCard({ post, dayLabel }: { post: Post; dayLabel: string }) {
  const [showRevision, setShowRevision] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const status = STATUS_LABELS[post.status] ?? STATUS_LABELS.DRAFT;

  async function submitRevision() {
    if (!message.trim()) return;
    setLoading(true);
    await fetch(`/api/posts/${post.id}/revision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="bg-white border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-t1">{dayLabel}</span>
          <span className="text-xs text-t3">· {post.publishTime}</span>
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <p className="text-sm text-t1 leading-relaxed whitespace-pre-wrap line-clamp-6">{post.content}</p>
      </div>

      {/* Actions */}
      {post.status === "READY" && !sent && (
        <div className="px-5 pb-4">
          {!showRevision ? (
            <button
              onClick={() => setShowRevision(true)}
              className="text-xs font-medium text-t2 hover:text-accent transition-colors underline underline-offset-2"
            >
              Demander une révision
            </button>
          ) : (
            <div className="space-y-2 mt-1">
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Qu'est-ce qui doit changer ?"
                rows={3}
                className="w-full text-sm px-3 py-2 border border-border rounded-lg bg-bg-base resize-none outline-none focus:border-accent transition"
              />
              <div className="flex gap-2">
                <button
                  onClick={submitRevision}
                  disabled={loading || !message.trim()}
                  className="text-xs font-semibold bg-accent text-white px-3 py-1.5 rounded-lg disabled:opacity-50 transition"
                >
                  {loading ? "Envoi…" : "Envoyer"}
                </button>
                <button
                  onClick={() => setShowRevision(false)}
                  className="text-xs text-t2 hover:text-t1 transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {sent && (
        <div className="px-5 pb-4 text-xs text-green font-medium">✓ Demande envoyée — on s&apos;en occupe.</div>
      )}
    </div>
  );
}
