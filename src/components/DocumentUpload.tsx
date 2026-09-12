"use client";

import { useRef, useState } from "react";
import { Camera, ImageUp, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/image";

const BUCKET = "documents";
/** Diplômes/scans : plus grand que l'avatar pour rester lisible, mais compressé */
const MAX_SIZE = 1200;

export default function DocumentUpload({
  userId,
  currentUrl,
  onUploaded,
  onRemoved,
}: {
  userId: string;
  currentUrl?: string;
  onUploaded: (url: string) => void;
  onRemoved: () => void;
}) {
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setError("Une image ou un PDF, svp");
      return;
    }
    setBusy(true);
    setError("");
    try {
      // Les PDF passent tels quels, les images sont compressées
      const payload =
        file.type === "application/pdf"
          ? file
          : await compressImage(file, MAX_SIZE);
      const ext = file.type === "application/pdf" ? "pdf" : "webp";

      const supabase = createClient();
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, payload, {
          contentType: ext === "pdf" ? "application/pdf" : "image/webp",
          upsert: true,
        });
      if (upErr) throw new Error(upErr.message);

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onUploaded(publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'envoi");
    } finally {
      setBusy(false);
      if (galleryRef.current) galleryRef.current.value = "";
      if (cameraRef.current) cameraRef.current.value = "";
    }
  }

  const btnCls =
    "inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs text-slate-300 transition hover:border-emerald-500/60 disabled:opacity-60";

  return (
    <div className="flex flex-wrap items-center gap-2">
      {currentUrl && (
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener"
          className="shrink-0"
          title="Voir le document"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentUrl}
            alt="Document"
            className="size-14 rounded-lg border border-slate-700 object-cover"
          />
        </a>
      )}
      <button
        type="button"
        disabled={busy}
        onClick={() => galleryRef.current?.click()}
        className={btnCls}
      >
        {busy ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <ImageUp className="size-3.5" />
        )}
        {currentUrl ? "Remplacer" : "Importer"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={() => cameraRef.current?.click()}
        className={btnCls}
      >
        <Camera className="size-3.5" /> Photographier
      </button>
      {currentUrl && (
        <button type="button" onClick={onRemoved} className={btnCls}>
          <Trash2 className="size-3.5" /> Retirer
        </button>
      )}

      <input
        ref={galleryRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <p className="w-full text-xs text-red-400">{error}</p>}
    </div>
  );
}
