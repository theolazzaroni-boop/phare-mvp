"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Org {
  id: string;
  name: string;
}

export default function LinkedinAuthorPicker({
  personUrn,
  personName,
  orgs,
  currentAuthorUrn,
}: {
  personUrn: string;
  personName: string;
  orgs: Org[];
  currentAuthorUrn: string;
}) {
  const [selected, setSelected] = useState(currentAuthorUrn);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const options = [
    { urn: personUrn, name: personName, subtitle: "Profil personnel", icon: "👤" },
    ...orgs.map(org => ({ urn: org.id, name: org.name, subtitle: "Page entreprise", icon: "🏢" })),
  ];

  async function handleSave() {
    setLoading(true);
    await fetch("/api/linkedin/author", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorUrn: selected }),
    });
    setSaved(true);
    setLoading(false);
    setTimeout(() => router.push("/dashboard?linkedin=connected"), 1000);
  }

  return (
    <div className="flex flex-col gap-3">
      {options.map(opt => (
        <button
          key={opt.urn}
          onClick={() => setSelected(opt.urn)}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition
            ${selected === opt.urn
              ? "border-accent bg-accent-xl"
              : "border-border bg-white hover:border-accent/40"
            }`}
        >
          <span className="text-2xl">{opt.icon}</span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-t1">{opt.name}</div>
            <div className="text-xs text-t2">{opt.subtitle}</div>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
            ${selected === opt.urn ? "border-accent" : "border-border"}`}
          >
            {selected === opt.urn && <div className="w-2 h-2 rounded-full bg-accent" />}
          </div>
        </button>
      ))}

      <button
        onClick={handleSave}
        disabled={loading || saved}
        className="mt-2 w-full py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent2 transition disabled:opacity-60"
      >
        {saved ? "✓ Sauvegardé !" : loading ? "…" : "Confirmer"}
      </button>
    </div>
  );
}
