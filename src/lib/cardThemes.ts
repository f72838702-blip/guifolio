import type { CardTheme } from "@/types/portfolio";

/**
 * Thèmes de la carte de visite digitale.
 * Réutilisés par la page publique /c/[slug] et le sélecteur de l'éditeur.
 */
export type CardThemeStyle = {
  label: string;
  description: string;
  /** fond de page */
  page: string;
  /** corps de la carte */
  card: string;
  name: string;
  headline: string;
  text: string;
  divider: string;
  /** bouton principal (WhatsApp) */
  btnPrimary: string;
  /** boutons secondaires */
  btn: string;
  qrFrame: string;
  footer: string;
  /** petit aperçu dégradé pour le sélecteur de l'éditeur */
  swatch: string;
  /** liseré extérieur premium (bordure 2px de la carte) */
  frame: string;
  /** bandeau d'en-tête dégradé + son texte */
  band: string;
  bandText: string;
  /** anneau coloré autour de la photo */
  ring: string;
};

export const cardThemeStyles: Record<CardTheme, CardThemeStyle> = {
  emeraude: {
    label: "Émeraude",
    description: "Le style signature Guifolio",
    page: "bg-slate-950",
    card: "border border-emerald-500/30 bg-gradient-to-b from-slate-900 to-emerald-950/40",
    name: "text-white",
    headline: "text-emerald-300",
    text: "text-slate-400",
    divider: "border-emerald-500/20",
    btnPrimary: "bg-emerald-500 text-emerald-950 hover:bg-emerald-400",
    btn: "border border-slate-700 bg-slate-900/80 text-slate-200 hover:border-emerald-500/50",
    qrFrame: "border-emerald-500/30 bg-white",
    footer: "text-slate-600",
    swatch: "bg-gradient-to-br from-slate-900 via-emerald-900 to-emerald-500",
    frame: "border-emerald-400/60",
    band: "bg-gradient-to-r from-emerald-700 via-emerald-500 to-teal-400",
    bandText: "text-emerald-50",
    ring: "ring-emerald-400",
  },
  nuit: {
    label: "Nuit de verre",
    description: "Sombre premium, effet glass",
    page: "bg-neutral-950",
    card: "border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950 backdrop-blur",
    name: "text-white",
    headline: "text-neutral-300",
    text: "text-neutral-500",
    divider: "border-white/10",
    btnPrimary: "bg-white text-neutral-950 hover:bg-neutral-200",
    btn: "border border-white/15 bg-white/5 text-neutral-200 hover:border-white/40",
    qrFrame: "border-white/15 bg-white",
    footer: "text-neutral-600",
    swatch: "bg-gradient-to-br from-neutral-950 via-neutral-700 to-white",
    frame: "border-white/25",
    band: "bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-800",
    bandText: "text-white",
    ring: "ring-white/70",
  },
  guinee: {
    label: "Guinée 🇬🇳",
    description: "Fier et tricolore",
    page: "bg-red-950",
    card: "border-2 border-yellow-400/60 bg-gradient-to-b from-red-900 via-red-950 to-green-950",
    name: "text-yellow-300",
    headline: "text-yellow-100",
    text: "text-red-100/80",
    divider: "border-yellow-400/30",
    btnPrimary: "bg-yellow-400 text-red-950 hover:bg-yellow-300",
    btn: "border border-yellow-400/40 bg-red-900/50 text-yellow-100 hover:border-yellow-300",
    qrFrame: "border-yellow-400/40 bg-white",
    footer: "text-red-200/60",
    swatch: "bg-gradient-to-br from-red-600 via-yellow-400 to-green-600",
    frame: "border-yellow-400/70",
    band: "bg-gradient-to-r from-red-600 via-yellow-500 to-green-600",
    bandText: "text-white",
    ring: "ring-yellow-400",
  },
  sahel: {
    label: "Sahel",
    description: "Chaleur terracotta & sable",
    page: "bg-[#f5ede1]",
    card: "border border-[#e0cba8] bg-gradient-to-b from-[#fffaf2] to-[#f7ead6] shadow-xl shadow-orange-900/10",
    name: "text-[#5b3a1e]",
    headline: "text-[#b3541e]",
    text: "text-[#8a6d50]",
    divider: "border-[#e0cba8]",
    btnPrimary: "bg-[#b3541e] text-[#fffaf2] hover:bg-[#96431a]",
    btn: "border border-[#d9bd93] bg-white/70 text-[#5b3a1e] hover:border-[#b3541e]",
    qrFrame: "border-[#e0cba8] bg-white",
    footer: "text-[#b39a7d]",
    swatch: "bg-gradient-to-br from-[#b3541e] via-[#e8c79a] to-[#f5ede1]",
    frame: "border-[#b3541e]/60",
    band: "bg-gradient-to-r from-[#96431a] via-[#c96a2e] to-[#e8a05c]",
    bandText: "text-[#fffaf2]",
    ring: "ring-[#b3541e]",
  },
  ocean: {
    label: "Océan",
    description: "Corporate, bleu confiance",
    page: "bg-sky-950",
    card: "border border-sky-400/30 bg-gradient-to-b from-sky-900/80 to-slate-950",
    name: "text-white",
    headline: "text-sky-300",
    text: "text-sky-100/60",
    divider: "border-sky-400/20",
    btnPrimary: "bg-sky-400 text-sky-950 hover:bg-sky-300",
    btn: "border border-sky-400/30 bg-sky-900/40 text-sky-100 hover:border-sky-300",
    qrFrame: "border-sky-400/30 bg-white",
    footer: "text-sky-100/40",
    swatch: "bg-gradient-to-br from-sky-950 via-sky-600 to-cyan-300",
    frame: "border-sky-400/60",
    band: "bg-gradient-to-r from-sky-800 via-sky-500 to-cyan-400",
    bandText: "text-white",
    ring: "ring-sky-400",
  },
  royal: {
    label: "Royal",
    description: "Violet profond & or",
    page: "bg-violet-950",
    card: "border border-amber-400/40 bg-gradient-to-b from-violet-900/90 to-[#2a0a4a]",
    name: "text-amber-300",
    headline: "text-violet-200",
    text: "text-violet-200/60",
    divider: "border-amber-400/25",
    btnPrimary: "bg-amber-400 text-violet-950 hover:bg-amber-300",
    btn: "border border-amber-400/40 bg-violet-900/50 text-amber-100 hover:border-amber-300",
    qrFrame: "border-amber-400/40 bg-white",
    footer: "text-violet-200/40",
    swatch: "bg-gradient-to-br from-[#2a0a4a] via-violet-700 to-amber-400",
    frame: "border-amber-400/60",
    band: "bg-gradient-to-r from-violet-900 via-violet-600 to-amber-500",
    bandText: "text-amber-50",
    ring: "ring-amber-400",
  },
};
