"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateClientModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function update(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }

    setOpen(false);
    setForm({ name: "", company: "", email: "", password: "" });
    setLoading(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-accent text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-accent/90 transition"
      >
        + Nouveau client
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <h2 className="text-base font-semibold text-t1">Nouveau client</h2>
              <button onClick={() => setOpen(false)} className="text-t3 hover:text-t1 text-xl leading-none">×</button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-t1 mb-1.5">Prénom / Nom *</label>
                  <input
                    type="text" required value={form.name}
                    onChange={e => update("name", e.target.value)}
                    placeholder="Thomas Dupont"
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-bg-base outline-none focus:border-accent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-t1 mb-1.5">Entreprise *</label>
                  <input
                    type="text" required value={form.company}
                    onChange={e => update("company", e.target.value)}
                    placeholder="Rennov"
                    className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-bg-base outline-none focus:border-accent transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-t1 mb-1.5">Email *</label>
                <input
                  type="email" required value={form.email}
                  onChange={e => update("email", e.target.value)}
                  placeholder="thomas@rennov.fr"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-bg-base outline-none focus:border-accent transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-t1 mb-1.5">Mot de passe provisoire *</label>
                <input
                  type="text" required value={form.password}
                  onChange={e => update("password", e.target.value)}
                  placeholder="min. 6 caractères"
                  className="w-full px-3 py-2.5 text-sm border border-border rounded-lg bg-bg-base outline-none focus:border-accent transition"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit" disabled={loading}
                  className="flex-1 bg-accent text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-accent/90 disabled:opacity-50 transition"
                >
                  {loading ? "Création…" : "Créer le client"}
                </button>
                <button
                  type="button" onClick={() => setOpen(false)}
                  className="px-4 text-sm text-t2 border border-border rounded-lg hover:bg-bg-2 transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
