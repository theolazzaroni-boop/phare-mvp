"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PostCard from "./PostCard";

const TYPE_CONFIG: Record<string, { emoji: string; color: string }> = {
  "Avant / Après":  { emoji: "🔄", color: "text-violet-600" },
  "Opinion":        { emoji: "💬", color: "text-rose-600"   },
  "Coulisses":      { emoji: "🎬", color: "text-amber-600"  },
  "Témoignage":     { emoji: "🤝", color: "text-green-600"  },
  "Éducatif":       { emoji: "💡", color: "text-blue-600"   },
  "Storytelling":   { emoji: "📖", color: "text-orange-600" },
  "Général":        { emoji: "✍️", color: "text-t2"         },
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  DRAFT:              { label: "En préparation", color: "text-t3"        },
  READY:              { label: "Prêt à publier", color: "text-green"     },
  PUBLISHED:          { label: "Publié",          color: "text-accent"    },
  REVISION_REQUESTED: { label: "Révision",        color: "text-amber-500" },
};

interface Post {
  id: string;
  title?: string;
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

function isMorning(time: string) {
  const [h] = time.split(":").map(Number);
  return h < 12;
}


export default function CalendarView({ posts, days, weekLabel, weekOffset = 0, linkedinConnected = false }: {
  posts: Post[];
  days: DayInfo[];
  weekLabel: string;
  weekOffset?: number;
  linkedinConnected?: boolean;
}) {
  const [selected, setSelected] = useState<Post | null>(null);
  const [reminders, setReminders] = useState<Set<string>>(new Set());
  const router = useRouter();

  function toggleReminder(e: React.MouseEvent, postId: string) {
    e.stopPropagation();
    setReminders(prev => {
      const next = new Set(prev);
      next.has(postId) ? next.delete(postId) : next.add(postId);
      return next;
    });
  }

  const byDay = Object.fromEntries(
    [1, 2, 3, 4, 5].map(d => [d, posts.filter(p => p.dayOfWeek === d)])
  );

  function renderPost(post: Post) {
    const type = TYPE_CONFIG[post.postType] ?? TYPE_CONFIG["Général"];
    const reminded = reminders.has(post.id);
    return (
      <div key={post.id}>
        <button
          onClick={() => setSelected(post)}
          className="w-full text-left rounded-xl border border-border bg-white p-3 transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          {/* Time + status */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-t1">{post.publishTime}</span>
            <span className={`text-xs font-semibold ${(STATUS_LABEL[post.status] ?? STATUS_LABEL.DRAFT).color}`}>
              {(STATUS_LABEL[post.status] ?? STATUS_LABEL.DRAFT).label}
            </span>
          </div>
          {/* Type */}
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${type.color}`}>
            <span>{type.emoji}</span>
            <span>{post.postType}</span>
          </div>
          {/* Title */}
          <div className="mt-1.5 text-xs text-t1 font-medium leading-snug line-clamp-2">
            {post.title ?? "Cliquer pour voir →"}
          </div>
        </button>
        {/* Reminder */}
        <button
          onClick={e => toggleReminder(e, post.id)}
          className={`mt-1 w-full flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-lg border transition
            ${reminded
              ? "bg-accent-xl border-accent/30 text-accent"
              : "bg-white border-border text-t3 hover:border-accent/40 hover:text-accent"
            }`}
        >
          🔔 {reminded ? "Rappel activé ✓" : "Me le rappeler"}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-t1 tracking-tight mb-1">Calendrier de publication</h1>
          <p className="text-sm text-t2">{weekLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/dashboard/calendar?week=${weekOffset - 1}`)}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-t2 hover:border-accent hover:text-accent transition"
          >
            ←
          </button>
          {weekOffset !== 0 && (
            <button
              onClick={() => router.push("/dashboard/calendar")}
              className="text-xs font-semibold text-accent hover:underline px-1"
            >
              Aujourd'hui
            </button>
          )}
          <button
            onClick={() => router.push(`/dashboard/calendar?week=${weekOffset + 1}`)}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-t2 hover:border-accent hover:text-accent transition"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar grid: day headers + 2 time rows */}
      <div className="grid grid-cols-[56px_1fr_1fr_1fr_1fr_1fr] gap-3">

        {/* Corner */}
        <div />
        {/* Day headers */}
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`rounded-xl px-3 py-2.5 text-center transition-colors ${day.isToday ? "bg-accent text-white" : "bg-white border border-border text-t2"}`}
          >
            <div className="text-xs font-bold uppercase tracking-wider">{day.label}</div>
            <div className={`text-lg font-bold leading-tight ${day.isToday ? "text-white" : "text-t1"}`}>
              {day.date.getUTCDate()}
            </div>
          </div>
        ))}

        {/* Morning row label */}
        <div className="flex items-start justify-center pt-3">
          <span className="text-xs font-semibold text-t3 [writing-mode:vertical-rl] rotate-180 select-none">🌅 Matin</span>
        </div>
        {[1, 2, 3, 4, 5].map(d => {
          const morning = (byDay[d] ?? []).filter(p => isMorning(p.publishTime));
          return (
            <div key={`m${d}`} className="flex flex-col gap-1.5">
              {morning.length === 0 ? (
                <div className="border border-dashed border-border rounded-xl p-4 flex items-center justify-center min-h-[60px]">
                  <span className="text-xs text-t3">—</span>
                </div>
              ) : (
                morning.map(post => renderPost(post))
              )}
            </div>
          );
        })}

        {/* Separator */}
        <div className="col-span-6 border-t border-border my-1" />

        {/* Afternoon row label */}
        <div className="flex items-start justify-center pt-3">
          <span className="text-xs font-semibold text-t3 [writing-mode:vertical-rl] rotate-180 select-none">🌇 Après-midi</span>
        </div>
        {[1, 2, 3, 4, 5].map(d => {
          const afternoon = (byDay[d] ?? []).filter(p => !isMorning(p.publishTime));
          return (
            <div key={`a${d}`} className="flex flex-col gap-1.5">
              {afternoon.length === 0 ? (
                <div className="border border-dashed border-border rounded-xl p-4 flex items-center justify-center min-h-[60px]">
                  <span className="text-xs text-t3">—</span>
                </div>
              ) : (
                afternoon.map(post => renderPost(post))
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
            <PostCard post={selected} defaultExpanded linkedinConnected={linkedinConnected} />
          </div>
        </div>
      )}
    </>
  );
}
