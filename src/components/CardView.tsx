import Link from "next/link";
import { Phone, Mail, MapPin, Sparkles } from "lucide-react";
import type { Plan, PortfolioData } from "@/types/portfolio";
import { cardThemeStyles } from "@/lib/cardThemes";
import CardActions from "./CardActions";

export default function CardView({
  data,
  slug,
  plan,
  cardUrl,
  qrDataUrl,
}: {
  data: PortfolioData;
  slug: string;
  plan: Plan;
  cardUrl: string;
  qrDataUrl: string | null;
}) {
  const t = cardThemeStyles[data.card.theme];
  const { profile, contacts } = data;
  const whatsapp = contacts.whatsapp_number.replace(/\D/g, "");
  const phone = contacts.phone_formatted.replace(/[\s.]/g, "");
  const mapsQuery = encodeURIComponent(contacts.location_text);

  return (
    <main
      className={`flex min-h-dvh flex-col items-center justify-center px-4 py-10 ${t.page}`}
    >
      <div
        className={`w-full max-w-sm rounded-3xl p-7 shadow-2xl ${t.card}`}
      >
        {/* Identité */}
        <div className="flex flex-col items-center text-center">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className={`size-24 rounded-full border-2 object-cover ${t.divider}`}
            />
          ) : (
            <div
              className={`flex size-24 items-center justify-center rounded-full border-2 text-3xl font-bold ${t.divider} ${t.headline}`}
            >
              {profile.full_name
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join("") || "?"}
            </div>
          )}
          <h1 className={`mt-4 font-display text-2xl font-bold ${t.name}`}>
            {profile.full_name || "Sans nom"}
          </h1>
          {profile.headline && (
            <p className={`mt-1 text-sm ${t.headline}`}>{profile.headline}</p>
          )}
          {contacts.location_text && (
            <p className={`mt-1 flex items-center gap-1 text-xs ${t.text}`}>
              <MapPin className="size-3" />
              {contacts.location_text}
            </p>
          )}
        </div>

        {/* Actions principales */}
        <div className={`mt-6 grid gap-2.5 border-t pt-6 ${t.divider}`}>
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener"
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold transition ${t.btnPrimary}`}
            >
              <Phone className="size-4" />
              WhatsApp / Appeler
            </a>
          )}
          {!whatsapp && phone && (
            <a
              href={`tel:${phone}`}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold transition ${t.btnPrimary}`}
            >
              <Phone className="size-4" />
              Appeler
            </a>
          )}
          <div className="grid grid-cols-2 gap-2.5">
            {phone && whatsapp && (
              <a
                href={`tel:${phone}`}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${t.btn}`}
              >
                <Phone className="size-4" /> Appel
              </a>
            )}
            {contacts.email && (
              <a
                href={`mailto:${contacts.email}`}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${t.btn}`}
              >
                <Mail className="size-4" /> Email
              </a>
            )}
          </div>
          <CardActions data={data} cardUrl={cardUrl} btnClass={t.btn} />
        </div>

        {/* QR + lien portfolio */}
        {(qrDataUrl || data.card.show_portfolio) && (
          <div
            className={`mt-6 flex flex-col items-center gap-3 border-t pt-6 ${t.divider}`}
          >
            {qrDataUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt={`QR code vers ${cardUrl}`}
                width={140}
                height={140}
                className={`rounded-xl border p-2 ${t.qrFrame}`}
              />
            )}
            {data.card.show_portfolio && (
              <Link
                href={`/p/${slug}`}
                className={`inline-flex items-center gap-1.5 text-xs underline underline-offset-4 ${t.headline}`}
              >
                <Sparkles className="size-3" />
                Voir le portfolio complet
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Branding (retiré en PRO/VIP) */}
      {plan === "FREE" && (
        <Link
          href="/"
          className={`mt-6 text-xs tracking-wide ${t.footer} hover:opacity-80`}
        >
          Carte créée avec <strong>Guifolio</strong> ✨ — guifolio.com
        </Link>
      )}
    </main>
  );
}
