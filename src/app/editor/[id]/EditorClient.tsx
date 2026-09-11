"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Check,
  Loader2,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  CreditCard,
} from "lucide-react";
import { useEditorStore } from "@/stores/editor";
import type { Plan, PortfolioData } from "@/types/portfolio";
import { cardThemes } from "@/types/portfolio";
import { cardThemeStyles } from "@/lib/cardThemes";
import AvatarUpload from "@/components/AvatarUpload";
import { updatePortfolioContent, togglePublic } from "@/app/dashboard/actions";

const inputCls =
  "w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500";
const labelCls = "mb-1 block text-xs font-medium text-slate-400";

export default function EditorClient({
  id,
  userId,
  slug,
  plan,
  isPublic,
  initialData,
}: {
  id: string;
  userId: string;
  slug: string;
  plan: Plan;
  isPublic: boolean;
  initialData: PortfolioData;
}) {
  const { data, saveState, setData, patchProfile, patchContacts, patchCard, patch, setSaveState } =
    useEditorStore();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [pub, setPub] = useState(isPublic);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    setData(initialData);
    // Bannière d'accueil après création (?welcome=1) — lecture côté client
    // pour éviter le bailout Suspense de useSearchParams
    if (new URLSearchParams(window.location.search).get("welcome") === "1") {
      setShowWelcome(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save debounced (1.2s après dernière frappe)
  useEffect(() => {
    if (saveState !== "dirty" || !data) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setSaveState("saving");
      const res = await updatePortfolioContent(id, data);
      setSaveState(res.ok ? "saved" : "error");
    }, 1200);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [data, saveState, id, setSaveState]);

  if (!data) return null;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "guifolio.com";

  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="size-4" /> Dashboard
        </Link>
        <div className="flex items-center gap-3">
          <SaveBadge state={saveState} />
          <button
            onClick={async () => {
              setPub(!pub);
              await togglePublic(id, !pub);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-500"
          >
            {pub ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
            {pub ? "Public" : "Privé"}
          </button>
          <Link
            href={`/p/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-emerald-950 hover:bg-emerald-400"
          >
            Voir <ExternalLink className="size-3" />
          </Link>
        </div>
      </header>

      <p className="mt-3 text-sm text-slate-500">
        {slug}.{rootDomain} · Plan {plan}
      </p>

      {showWelcome && (
        <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm">
          <p className="font-semibold text-emerald-300">
            🎉 Portfolio créé ! Une dernière étape : présentez-vous
          </p>
          <p className="mt-1 text-emerald-100/80">
            Remplissez ci-dessous votre <strong>nom complet</strong> et votre{" "}
            <strong>téléphone / WhatsApp</strong> — c&apos;est tout ce
            qu&apos;il faut pour un portfolio qui convertit. La sauvegarde est
            automatique à chaque frappe.
          </p>
          <button
            onClick={() => setShowWelcome(false)}
            className="mt-2 text-xs font-medium text-emerald-300 underline hover:text-emerald-200"
          >
            Compris, c&apos;est parti →
          </button>
        </div>
      )}

      {/* Profil */}
      <section className="mt-8 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="font-display font-semibold">Profil</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelCls}>Nom complet</span>
            <input
              className={inputCls}
              value={data.profile.full_name}
              onChange={(e) => patchProfile({ full_name: e.target.value })}
            />
          </label>
          <label className="block">
            <span className={labelCls}>Titre / Headline</span>
            <input
              className={inputCls}
              value={data.profile.headline}
              onChange={(e) => patchProfile({ headline: e.target.value })}
              placeholder="Développeur Full-Stack | Conakry"
            />
          </label>
        </div>
        <label className="block">
          <span className={labelCls}>Bio</span>
          <textarea
            className={`${inputCls} min-h-24`}
            value={data.profile.bio}
            onChange={(e) => patchProfile({ bio: e.target.value })}
          />
        </label>
        <div>
          <span className={labelCls}>Photo de profil</span>
          <AvatarUpload
            userId={userId}
            currentUrl={data.profile.avatar_url}
            onUploaded={(url) => patchProfile({ avatar_url: url })}
            onRemoved={() => patchProfile({ avatar_url: undefined })}
          />
        </div>
      </section>

      {/* Contacts */}
      <section className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="font-display font-semibold">Contacts</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelCls}>Téléphone (format intl.)</span>
            <input
              className={inputCls}
              value={data.contacts.phone_formatted}
              onChange={(e) =>
                patchContacts({ phone_formatted: e.target.value })
              }
              placeholder="+224620000000"
            />
          </label>
          <label className="block">
            <span className={labelCls}>WhatsApp (chiffres seuls)</span>
            <input
              className={inputCls}
              value={data.contacts.whatsapp_number}
              onChange={(e) =>
                patchContacts({ whatsapp_number: e.target.value })
              }
              placeholder="224620000000"
            />
          </label>
          <label className="block">
            <span className={labelCls}>Email</span>
            <input
              className={inputCls}
              type="email"
              value={data.contacts.email}
              onChange={(e) => patchContacts({ email: e.target.value })}
            />
          </label>
          <label className="block">
            <span className={labelCls}>Localisation</span>
            <input
              className={inputCls}
              value={data.contacts.location_text}
              onChange={(e) =>
                patchContacts({ location_text: e.target.value })
              }
              placeholder="Dixinn, Conakry"
            />
          </label>
        </div>
      </section>

      {/* Carte de visite */}
      <section className="mt-6 space-y-4 rounded-2xl border border-emerald-500/30 bg-slate-900/50 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 font-display font-semibold">
            <CreditCard className="size-5 text-emerald-400" />
            Carte de visite digitale
          </h2>
          <Link
            href={`/c/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20"
          >
            Aperçu <ExternalLink className="size-3" />
          </Link>
        </div>
        <p className="text-xs text-slate-500">
          Votre carte reprend automatiquement vos infos Profil & Contacts ci-dessus
          — avec QR code, boutons WhatsApp/Appel et ajout aux contacts.
          Choisissez un design :
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {cardThemes.map((theme) => {
            const t = cardThemeStyles[theme];
            const active = data.card.theme === theme;
            return (
              <button
                key={theme}
                type="button"
                onClick={() => patchCard({ theme })}
                className={`group rounded-xl border p-2 text-left transition ${
                  active
                    ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500"
                    : "border-slate-700 hover:border-slate-500"
                }`}
              >
                <div className={`h-14 w-full rounded-lg ${t.swatch}`} />
                <p className="mt-1.5 flex items-center justify-between text-xs font-medium">
                  {t.label}
                  {active && <Check className="size-3.5 text-emerald-400" />}
                </p>
                <p className="text-[10px] text-slate-500">{t.description}</p>
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2.5 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={data.card.show_portfolio}
            onChange={(e) => patchCard({ show_portfolio: e.target.checked })}
            className="size-4 accent-emerald-500"
          />
          Afficher le lien « Voir le portfolio complet » sur la carte
        </label>
      </section>

      {/* Compétences */}
      <section className="mt-6 space-y-3 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="font-display font-semibold">Compétences</h2>
        <input
          className={inputCls}
          value={data.skills.join(", ")}
          onChange={(e) =>
            patch({
              skills: e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          placeholder="React, Gestion de projet, Excel… (séparées par des virgules)"
        />
      </section>

      {/* Expériences */}
      <section className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold">Expériences</h2>
          <button
            onClick={() =>
              patch({
                experiences: [
                  ...data.experiences,
                  { role: "", company: "", period: "", description: "" },
                ],
              })
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:border-emerald-500/60"
          >
            <Plus className="size-3.5" /> Ajouter
          </button>
        </div>
        {data.experiences.map((exp, i) => (
          <div
            key={i}
            className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4"
          >
            <div className="flex justify-end">
              <button
                onClick={() =>
                  patch({
                    experiences: data.experiences.filter((_, j) => j !== i),
                  })
                }
                aria-label="Supprimer"
                className="text-slate-500 hover:text-red-400"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                className={inputCls}
                placeholder="Poste"
                value={exp.role}
                onChange={(e) =>
                  updateExp(data, patch, i, { role: e.target.value })
                }
              />
              <input
                className={inputCls}
                placeholder="Entreprise"
                value={exp.company}
                onChange={(e) =>
                  updateExp(data, patch, i, { company: e.target.value })
                }
              />
              <input
                className={inputCls}
                placeholder="Période (2022 – présent)"
                value={exp.period}
                onChange={(e) =>
                  updateExp(data, patch, i, { period: e.target.value })
                }
              />
            </div>
            <textarea
              className={`${inputCls} min-h-20`}
              placeholder="Description des missions"
              value={exp.description}
              onChange={(e) =>
                updateExp(data, patch, i, { description: e.target.value })
              }
            />
          </div>
        ))}
        {data.experiences.length === 0 && (
          <p className="text-sm text-slate-500">
            Aucune expérience — cliquez « Ajouter ».
          </p>
        )}
      </section>

      {/* Réseaux sociaux */}
      <section className="mt-6 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
        <h2 className="font-display font-semibold">Réseaux sociaux</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["linkedin", "LinkedIn"],
              ["facebook", "Facebook"],
              ["github", "GitHub"],
              ["website", "Site web"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block">
              <span className={labelCls}>{label}</span>
              <input
                className={inputCls}
                value={data.social_links[key] ?? ""}
                onChange={(e) =>
                  patch({
                    social_links: {
                      ...data.social_links,
                      [key]: e.target.value || undefined,
                    },
                  })
                }
                placeholder="https://…"
              />
            </label>
          ))}
        </div>
      </section>
    </main>
  );
}

function updateExp(
  data: PortfolioData,
  patch: (p: Partial<PortfolioData>) => void,
  i: number,
  partial: Partial<PortfolioData["experiences"][number]>
) {
  patch({
    experiences: data.experiences.map((e, j) =>
      j === i ? { ...e, ...partial } : e
    ),
  });
}

function SaveBadge({ state }: { state: string }) {
  if (state === "saving")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
        <Loader2 className="size-3.5 animate-spin" /> Sauvegarde…
      </span>
    );
  if (state === "saved")
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
        <Check className="size-3.5" /> Sauvegardé
      </span>
    );
  if (state === "error")
    return <span className="text-xs text-red-400">Erreur de sauvegarde</span>;
  if (state === "dirty")
    return <span className="text-xs text-slate-500">Modifications…</span>;
  return null;
}
