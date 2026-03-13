"use client";

import { useState, useRef } from "react";
import PostCard from "./PostCard";

interface Post {
  id: string;
  title?: string;
  content: string;
  dayOfWeek: number;
  publishTime: string;
  postType: string;
  status: string;
}

export default function PostsCarousel({ posts, linkedinConnected = false }: { posts: Post[]; linkedinConnected?: boolean }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  function prev() { setIndex(i => Math.max(0, i - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function next() { setIndex(i => Math.min(posts.length - 1, i + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    else if (diff < -50) prev();
    touchStartX.current = null;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const post = posts[index];

  return (
    <div className="flex flex-col items-center gap-6">

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={prev}
          disabled={index === 0}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-t2 hover:border-accent hover:text-accent transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ←
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all ${i === index ? "w-5 h-2 bg-accent" : "w-2 h-2 bg-border hover:bg-t3"}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={index === posts.length - 1}
          className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-t2 hover:border-accent hover:text-accent transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-xl"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <PostCard key={post.id} post={post} defaultExpanded linkedinConnected={linkedinConnected} />
      </div>

    </div>
  );
}
