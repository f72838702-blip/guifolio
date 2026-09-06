"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, FileUp } from "lucide-react";
import { createPortfolio, updatePortfolioContent } from "./actions";

export default function CreatePortfolio() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    setStatus("Création du portfolio…");
    const created = await createPortfolio(slug);
    if (!created.ok) {
      setError(created.error);
      setBusy(false);
      setStatus("");
      return;
    }

    const file = fileRef.current?.files?.[0];
    if (file) {
      setStatus("Extraction IA du CV (quelques secondes)…");
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/parse-cv", { method: "POST", body: form });
      if (res.ok) {
        const { data } = await res.json();
        setStatus("Enregistrement des données…");
        await updatePortfolioContent(created.id, data);
      }
      // En cas d'échec d'extraction, on ouvre quand même l'éditeur vide
    }

    router.push(`/editor/${created.id}?welcome=1`);
  }

  return (
    <form
      onSubmit={handleCreate}
      className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6"
    >
      <h2 className="flex items-center gap-2 font-display font-semibold">
        <Sparkles className="size-5 text-emerald-400" />
        Nouveau portfolio — importez votre CV, l&apos;IA fait le reste
      </h2>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center rounded-lg border border-slate-700 bg-slate-950 px-4 focus-within:border-emerald-500">
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            pattern="[a-z0-9][a-z0-9-]{2,49}"
            placeholder="mamadou-diallo"
            className="w-full bg-transparent py-3 text-sm outline-none"
          />
          <span className="whitespace-nowrap text-sm text-slate-500">
            .guifolio.com
          </span>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-3 text-sm text-slate-300 transition hover:border-emerald-500/60"
        >
          <FileUp className="size-4" />
          {fileRef.current?.files?.[0]?.name ?? "CV en PDF (optionnel)"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={() => setSlug((s) => s)} // force re-render pour afficher le nom
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {busy && <Loader2 className="size-4 animate-spin" />}
          Créer
        </button>
      </div>
      {status && <p className="mt-3 text-sm text-emerald-300">{status}</p>}
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </form>
  );
}
