"use client";

import { useRef, useState } from "react";
import { Camera, ImageUp, Loader2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/image";

const BUCKET = "avatars";
const MAX_SIZE = 640; // px — côté le plus long après compression

export default function AvatarUpload({
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
  const [info, setInfo] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choisissez une image (JPG, PNG…)");
      return;
    }
    setBusy(true);
    setError("");
    setInfo("");
    try {
      const compressed = await compressImage(file, MAX_SIZE);
      const from = Math.round(file.size / 1024);
      const to = Math.round(compressed.size / 1024);
      setInfo(`Optimisée : ${from} Ko → ${to} Ko ✅`);

      const supabase = createClient();
      const path = `${userId}/${Date.now()}.webp`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, compressed, { contentType: "image/webp", upsert: true });
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
    "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-4 py-2.5 text-sm text-slate-300 transition hover:border-emerald-500/60 disabled:opacity-60";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        {/* Aperçu */}
        <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-950">
          {currentUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={currentUrl}
              alt="Photo de profil"
              className="size-full object-cover"
            />
          ) : (
            <Camera className="size-6 text-slate-600" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => galleryRef.current?.click()}
            className={btnCls}
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ImageUp className="size-4" />
            )}
            Importer une photo
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => cameraRef.current?.click()}
            className={btnCls}
          >
            <Camera className="size-4" /> Prendre une photo
          </button>
          {currentUrl && (
            <button type="button" onClick={onRemoved} className={btnCls}>
              <Trash2 className="size-4" /> Retirer
            </button>
          )}
        </div>
      </div>

      {/* Inputs cachés : galerie vs caméra (mobile) */}
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <p className="text-xs text-slate-500">
        Compression automatique (max 640px, WebP) — une photo de téléphone
        ~4 Mo devient ~50 Ko, votre page reste ultra rapide même en 2G.
      </p>
      {info && <p className="text-xs text-emerald-400">{info}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
