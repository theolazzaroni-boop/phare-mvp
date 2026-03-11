"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img src="/logo.svg" alt="Phare" height={40} className="h-10" />
        </div>

        <div className="bg-white border border-border rounded-2xl p-8 shadow-sm">
          <h1 className="text-xl font-bold text-t1 mb-1">Connexion</h1>
          <p className="text-sm text-t2 mb-6">Accédez à votre espace Phare.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-t1 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@entreprise.fr"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-bg-base text-sm text-t1 outline-none focus:border-accent focus:ring-2 focus:ring-accent-xl transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-t1 mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-bg-base text-sm text-t1 outline-none focus:border-accent focus:ring-2 focus:ring-accent-xl transition"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-white font-semibold text-sm py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Connexion…" : "Se connecter →"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-t3 mt-6">
          Pas encore client ?{" "}
          <a href="/landing.html" className="text-accent hover:underline">Découvrir Phare</a>
        </p>
      </div>
    </div>
  );
}
