"use client";

import { useState } from "react";
import PostCard from "./PostCard";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

const TYPE_CONFIG: Record<string, { emoji: string; color: string; bg: string; border: string }> = {
  "Avant / Après":  { emoji: "🔄", color: "text-violet-600",  bg: "bg-violet-100",  border: "border-violet-200" },
  "Opinion":        { emoji: "💬", color: "text-rose-600",    bg: "bg-rose-100",    border: "border-rose-200" },
  "Coulisses":      { emoji: "🎬", color: "text-amber-600",   bg: "bg-amber-100",   border: "border-amber-200" },
  "Témoignage":     { emoji: "🤝", color: "text-green-600",   bg: "bg-green-100",   border: "border-green-200" },
  "Éducatif":       { emoji: "💡", color: "text-blue-600",    bg: "bg-blue-100",    border: "border-blue-200" },
  "Storytelling":   { emoji: "📖", color: "text-orange-600",  bg: "bg-orange-100",  border: "border-orange-200" },
  "Général":        { emoji: "✍️", color: "text-t2",          bg: "bg-bg-2",        border: "border-border" },
};

const STATUS_DOT: Record<string, string> = {
  DRAFT:              "bg-t3",
  READY:              "bg-green",
  PUBLISHED:          "bg-accent",
  REVISION_REQUESTED: "bg-amber-400",
};

interface Post {
  id: string;
  content: string;
  dayOfWeek: number;
  publishTime: string;
  postType: string;
  status: string;
}

interface DayInfo {
  label: string;
  date: Date;
  isToday: boolean;
}

export default function CalendarView({ posts, days, weekLabel }: {
  posts: Post[];
  days: DayInfo[];
  weekLabel: string;
}) {
  const [selected, setSelected] = useState<Post | null>(null);

  const byDay = Object.fromEntries(
    [1, 2, 3, 4, 5].map(d => [d, posts.filter(p => p.dayOfWeek === d)])
  );

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-t1 tracking-tight mb-1">Calendrier de publication</h1>
        <p className="text-sm text-t2">{weekLabel}</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(TYPE_CONFIG).filter(([k]) => k !== "Général").map(([type, cfg]) => (
          <span key={type} className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
            {cfg.emoji} {type}
          </span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-5 gap-3">
        {days.map((day, idx) => {
          const d = idx + 1;
          const dayPosts = byDay[d] ?? [];

          return (
            <div key={d} className="flex flex-col gap-2">
              {/* Day header */}
              <div className={`rounded-xl px-3 py-2.5 text-center transition-colors ${day.isToday ? "bg-accent text-white" : "bg-white border border-border text-t2"}`}>
                <div className="text-xs font-bold uppercase tracking-wider">{day.label}</div>
                <div className={`text-lg font-bold leading-tight ${day.isToday ? "text-white" : "text-t1"}`}>
                  {day.date.getUTCDate()}
                </div>
              </div>

              {/* Posts */}
              {dayPosts.length > 0 ? (
                dayPosts.map(post => {
                  const type = TYPE_CONFIG[post.postType] ?? TYPE_CONFIG["Général"];
                  return (
                    <button
                      key={post.id}
                      onClick={() => setSelected(post)}
                      className={`w-full text-left rounded-xl border p-3 transition-all hover:shadow-md hover:-translate-y-0.5 ${type.bg} ${type.border}`}
                    >
                      {/* Time + status */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-t3">{post.publishTime}</span>
                        <span className={`w-2 h-2 rounded-full ${STATUS_DOT[post.status] ?? "bg-t3"}`}></span>
                      </div>
                      {/* Type */}
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${type.color}`}>
                        <span>{type.emoji}</span>
                        <span>{post.postType}</span>
                      </div>
                      {/* Hint */}
                      <div className="mt-2 text-xs text-t3 italic">Cliquer pour voir →</div>
                    </button>
                  );
                })
              ) : (
                <div className="border border-dashed border-border rounded-xl p-4 flex items-center justify-center">
                  <span className="text-xs text-t3">—</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setSelected(null)}
                className="text-white/80 hover:text-white text-sm font-medium bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
              >
                ✕ Fermer
              </button>
            </div>
            <PostCard post={selected} />
          </div>
        </div>
      )}
    </>
  );
}
