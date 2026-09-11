import Link from "next/link";
import {
  ArrowRight,
  FileText,
  QrCode,
  Smartphone,
  Sparkles,
  MessageCircle,
  Globe,
  Check,
} from "lucide-react";
import { PLANS } from "@/types/portfolio";

const formatGNF = (n: number) =>
  n === 0 ? "0 GNF" : `${n.toLocaleString("fr-GN")} GNF`;

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-clip">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-display text-xl font-bold tracking-tight">
          Gui<span className="text-emerald-400">folio</span>
        </span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm text-slate-300 hover:text-white"
          >
            Connexion
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            Créer mon portfolio
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-150 w-250 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl"
        />
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300">
          <Sparkles className="size-3.5" /> Simple et rapide — fait pour la
          Guinée 🇬🇳
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
          Votre CV devient une{" "}
          <span className="bg-gradient-to-r from-emerald-300 to-amber-300 bg-clip-text text-transparent">
            carte de visite digitale
          </span>{" "}
          en 2 minutes
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-slate-400">
          Envoyez votre CV PDF, on s&apos;occupe de tout : votre portfolio
          moderne est généré automatiquement sur{" "}
          <span className="text-emerald-300">vous.guifolio.com</span> — avec
          bouton WhatsApp direct.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            Commencer gratuitement
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </Link>
          <span className="text-sm text-slate-500">
            Sans carte bancaire · Paiement Orange Money / MTN
          </span>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid max-w-6xl gap-5 px-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: FileText,
            title: "Import CV automatique",
            desc: "PDF ou texte brut — votre nom, vos compétences, vos expériences et vos contacts sont détectés et remplis automatiquement.",
          },
          {
            icon: Globe,
            title: "Votre sous-domaine",
            desc: "vous.guifolio.com, prêt à partager partout : recruteurs, clients, réseaux sociaux.",
          },
          {
            icon: MessageCircle,
            title: "WhatsApp en 1 clic",
            desc: "Vos prospects vous contactent directement via wa.me, numéro formaté automatiquement (+224).",
          },
          {
            icon: Smartphone,
            title: "Pensé mobile d'abord",
            desc: "Ultra-rapide même en 3G, optimisé pour les écrans de smartphones.",
          },
          {
            icon: QrCode,
            title: "QR code carte de visite",
            desc: "Imprimez-le sur vos cartes papier, il mène directement à votre portfolio.",
          },
          {
            icon: Sparkles,
            title: "Paiement Mobile Money",
            desc: "Passez Pro avec Orange Money ou MTN MoMo, en francs guinéens.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition hover:border-emerald-500/40"
          >
            <Icon className="size-6 text-emerald-400" />
            <h3 className="mt-4 font-display font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <h2 className="text-center font-display text-3xl font-bold">
          Tarifs simples, en GNF
        </h2>
        <p className="mt-3 text-center text-slate-400">
          Payez par Orange Money ou MTN Mobile Money.
        </p>
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-3">
          {(Object.keys(PLANS) as Array<keyof typeof PLANS>).map((key) => {
            const plan = PLANS[key];
            const featured = key === "PRO";
            return (
              <div
                key={key}
                className={`rounded-2xl border p-7 ${
                  featured
                    ? "border-emerald-500/60 bg-emerald-500/10"
                    : "border-slate-800 bg-slate-900/50"
                }`}
              >
                {featured && (
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-emerald-950">
                    POPULAIRE
                  </span>
                )}
                <h3 className="mt-4 font-display text-lg font-semibold">
                  {plan.name}
                </h3>
                <p className="mt-2 font-display text-3xl font-bold">
                  {formatGNF(plan.priceGNF)}
                  {plan.priceGNF > 0 && (
                    <span className="text-sm font-normal text-slate-400">
                      {" "}
                      / an
                    </span>
                  )}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-emerald-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login"
                  className={`mt-7 block rounded-lg py-2.5 text-center text-sm font-semibold transition ${
                    featured
                      ? "bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
                      : "border border-slate-700 text-slate-200 hover:border-slate-500"
                  }`}
                >
                  Choisir {plan.name}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8 text-center text-sm text-slate-500">
        © 2026 Guifolio.com — Conakry, Guinée · Paiements Orange Money & MTN
        MoMo
      </footer>
    </main>
  );
}
