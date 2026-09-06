"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(error.message);
        setState("error");
      } else {
        setState("sent");
      }
    } catch {
      setError(
        "Supabase non configuré (mode aperçu). Ajoutez les variables d'environnement sur Vercel."
      );
      setState("error");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="size-4" /> Retour
        </Link>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <h1 className="font-display text-2xl font-bold">
            Connexion à <span className="text-emerald-400">Guifolio</span>
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Pas de mot de passe — recevez un lien magique par email.
          </p>

          {state === "sent" ? (
            <div className="mt-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-sm text-emerald-200">
              ✉️ Lien envoyé à <strong>{email}</strong>. Ouvrez votre boîte
              mail et cliquez sur le lien pour vous connecter.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-300">
                  Adresse email
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
                />
              </label>
              {state === "error" && (
                <p className="text-sm text-red-400">{error}</p>
              )}
              <button
                type="submit"
                disabled={state === "loading"}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:opacity-60"
              >
                {state === "loading" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Mail className="size-4" />
                )}
                Recevoir mon lien magique
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
