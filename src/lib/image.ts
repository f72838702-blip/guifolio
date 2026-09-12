"use client";

/**
 * Compression d'image côté navigateur (zéro serveur, zéro upload de l'original).
 * Redimensionne (côté le plus long borné) + convertit en WebP.
 */
export async function compressImage(
  file: File,
  maxSize = 1000,
  quality = 0.82
): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null);

  let w: number, h: number;
  let source: CanvasImageSource;
  if (bitmap) {
    w = bitmap.width;
    h = bitmap.height;
    source = bitmap;
  } else {
    // Fallback : image classique
    source = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = URL.createObjectURL(file);
    });
    w = (source as HTMLImageElement).width;
    h = (source as HTMLImageElement).height;
  }

  const scale = Math.min(1, maxSize / Math.max(w, h));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Compression échouée")),
      "image/webp",
      quality
    );
  });
}
