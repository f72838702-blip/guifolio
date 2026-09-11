"use client";

import { useState } from "react";
import { UserPlus, Share2, Check } from "lucide-react";
import type { PortfolioData } from "@/types/portfolio";

function buildVCard(data: PortfolioData): string {
  const { profile, contacts } = data;
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${profile.full_name}`,
    profile.headline ? `TITLE:${profile.headline}` : "",
    contacts.phone_formatted ? `TEL;TYPE=CELL:${contacts.phone_formatted}` : "",
    contacts.email ? `EMAIL:${contacts.email}` : "",
    profile.avatar_url ? `PHOTO;VALUE=URI:${profile.avatar_url}` : "",
    "END:VCARD",
  ].filter(Boolean);
  return lines.join("\r\n");
}

export default function CardActions({
  data,
  cardUrl,
  btnClass,
}: {
  data: PortfolioData;
  cardUrl: string;
  btnClass: string;
}) {
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  function downloadVCard() {
    const blob = new Blob([buildVCard(data)], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.profile.full_name || "contact"}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function share() {
    const payload = {
      title: data.profile.full_name,
      text: `Carte de visite de ${data.profile.full_name}`,
      url: cardUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch {
        /* annulé par l'utilisateur */
      }
    }
    await navigator.clipboard.writeText(cardUrl);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  }

  const cls = `inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${btnClass}`;
  return (
    <>
      <button onClick={downloadVCard} className={cls}>
        {saved ? <Check className="size-4" /> : <UserPlus className="size-4" />}
        {saved ? "Enregistré !" : "Ajouter aux contacts"}
      </button>
      <button onClick={share} className={cls}>
        {shared ? <Check className="size-4" /> : <Share2 className="size-4" />}
        {shared ? "Lien copié !" : "Partager"}
      </button>
    </>
  );
}
