"use client";

import { Printer } from "lucide-react";

export default function CardButtons({ label }: { label?: string }) {
  return (
    <div className="no-print mt-6 flex flex-wrap justify-center gap-3">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#172554]"
      >
        <Printer className="size-4" /> {label ?? "Imprimer la carte"}
      </button>
      <p className="w-full text-center text-xs text-slate-400">
        Démo marketing — les informations sont fictives.
      </p>
    </div>
  );
}
