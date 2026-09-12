"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Mail, Loader2, ArrowLeft, KeyRound } from "lucide-react";
import Link from "next/link";

type Mode = "password" | "magic";
type State = "idle" | "loading" | "magic-sent" | "error";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setMessage("");
    try {
      const supabase = createClient();

      // 1. Tentative de connexion
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!signInError) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      // 2. Identifiants inconnus → création automatique du compte
      if (signInError.message.toLowerCase().includes("invalid login")) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) {
          setMessage(signUpError.message);
          setState("error");
          return;
        }
        if (data.session) {
          // Confirmation email désactivée : accès immédiat
          router.push("/dashboard?welcome=1");
          router.refresh();
          return;
        }
        // Confirmation email encore activée côté Supabase
        setMessage(
          "Compte créé ! Vérifiez votre email pour activer le compte, puis reconnectez-vous."
        );
        setState("magic-sent");
        return;
      }

      setMessage(
        signInError.message.toLowerCase().includes("invalid")
          ? "Mot de passe incorrect ou email inconnu."
          : signInError.message
      );
      setState("error");
    } catch {
      setMessage("Supabase non configuré (mode aperçu).");
      setState("error");
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
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
        setMessage(error.message);
        setState("error");
      } else {
        setState("magic-sent");
      }
    } catch {
      setMessage("Supabase non configuré (mode aperçu).");
      setState("error");
    }
  }

  const inputCls =
    "w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none transition focus:border-emerald-500";

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

          {/* Sélecteur de mode */}
          <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1 text-sm">
            <button
              type="button"
              onClick={() => {
                setMode("password");
                setState("idle");
                setMessage("");
              }}
              className={`rounded-lg py-2 font-medium transition ${
                mode === "password"
                  ? "bg-emerald-500 text-emerald-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Mot de passe
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("magic");
                setState("idle");
                setMessage("");
              }}
              className={`rounded-lg py-2 font-medium transition ${
                mode === "magic"
                  ? "bg-emerald-500 text-emerald-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Lien par email
            </button>
          </div>

          {mode === "password" ? (
            <>
              <p className="mt-4 text-sm text-slate-400">
                Accès immédiat. Pas encore de compte ? Il sera créé
                automatiquement à la première connexion.
              </p>
              <form onSubmit={handlePassword} className="mt-5 space-y-4">
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
                    className={inputCls}
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-300">
                    Mot de passe
                  </span>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6 caractères minimum"
                    className={inputCls}
                  />
                </label>
                {state === "error" && (
                  <p className="text-sm text-red-400">{message}</p>
                )}
                {state === "magic-sent" && message && (
                  <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                    {message}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 py-3 font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:opacity-60"
                >
                  {state === "loading" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <KeyRound className="size-4" />
                  )}
                  Entrer dans mon compte
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="mt-4 text-sm text-slate-400">
                Recevez un lien de connexion par email (⚠️ ouvrez-le dans le
                même navigateur).
              </p>
              {state === "magic-sent" && !message ? (
                <div className="mt-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-sm text-emerald-200">
                  ✉️ Lien envoyé à <strong>{email}</strong>. Ouvrez votre boîte
                  mail et cliquez sur le lien <strong>dans ce navigateur</strong>.
                </div>
              ) : (
                <form onSubmit={handleMagicLink} className="mt-5 space-y-4">
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
                      className={inputCls}
                    />
                  </label>
                  {state === "error" && (
                    <p className="text-sm text-red-400">{message}</p>
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
            </>
          )}
        </div>
      </div>
    </main>
  );
}
