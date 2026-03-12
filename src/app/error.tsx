"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-t2 mb-4">Une erreur est survenue.</p>
        <button onClick={reset} className="text-sm text-accent underline">
          Réessayer
        </button>
      </div>
    </div>
  );
}
