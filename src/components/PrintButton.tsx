"use client";

import { Download } from "lucide-react";

/** Bouton d'impression → "Enregistrer en PDF" natif du navigateur (mobile & desktop) */
export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print fixed bottom-6 right-6 z-10 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-900/30 transition hover:bg-emerald-500"
    >
      <Download className="size-4" />
      Télécharger en PDF
    </button>
  );
}
