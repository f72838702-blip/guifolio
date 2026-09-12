import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Printer,
  MessageCircle,
} from "lucide-react";
import type { Plan, PortfolioData } from "@/types/portfolio";
import { cardThemeStyles } from "@/lib/cardThemes";
import CardActions from "./CardActions";

/**
 * Carte de visite digitale — badge d'accréditation premium vertical
 * (bandeau dégradé + photo à double bordure + tuiles contact + QR encadré),
 * décliné dans les 6 thèmes de cardThemes.
 */
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
  const initials =
    profile.full_name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "GF";

  // Tuiles de contact façon badge (style grille stats)
  const tiles = [
    whatsapp
      ? {
          href: `https://wa.me/${whatsapp}`,
          icon: MessageCircle,
          label: "WhatsApp",
          value: `+${whatsapp}`,
          external: true,
        }
      : null,
    phone
      ? {
          href: `tel:${phone}`,
          icon: Phone,
          label: "Téléphone",
          value: contacts.phone_formatted,
          external: false,
        }
      : null,
    contacts.email
      ? {
          href: `mailto:${contacts.email}`,
          icon: Mail,
          label: "Email",
          value: contacts.email,
          external: false,
        }
      : null,
    contacts.location_text
      ? {
          href: `https://maps.google.com/?q=${mapsQuery}`,
          icon: MapPin,
          label: "Adresse",
          value: contacts.location_text,
          external: true,
        }
      : null,
  ].filter(Boolean) as {
    href: string;
    icon: typeof Phone;
    label: string;
    value: string;
    external: boolean;
  }[];

  return (
    <main
      className={`flex min-h-dvh flex-col items-center justify-center px-4 py-10 ${t.page}`}
    >
      {/* ===== Badge premium ===== */}
      <div
        className={`w-full max-w-sm overflow-hidden rounded-[1.75rem] border-2 shadow-2xl ${t.frame} ${t.card}`}
      >
        {/* Bandeau dégradé */}
        <div
          className={`relative flex h-24 flex-col items-center justify-center overflow-hidden ${t.band}`}
        >
          {/* Filigrane initiales géantes */}
          <span
            className={`pointer-events-none absolute inset-0 flex items-center justify-center font-display text-7xl font-black opacity-10 ${t.bandText}`}
            aria-hidden
          >
            {initials}
          </span>
          {/* Entreprise (facultatif) ou marque Guifolio */}
          {data.card.company_logo_url || data.card.company_name ? (
            <div className="relative flex items-center gap-2.5 px-6">
              {data.card.company_logo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.card.company_logo_url}
                  alt={data.card.company_name || "Logo entreprise"}
                  className="size-9 rounded-lg bg-white/95 object-contain p-1 shadow"
                />
              )}
              {data.card.company_name && (
                <p
                  className={`text-sm font-bold uppercase tracking-widest drop-shadow ${t.bandText}`}
                >
                  {data.card.company_name}
                </p>
              )}
            </div>
          ) : (
            <>
              <p
                className={`text-[10px] font-bold uppercase tracking-[0.35em] ${t.bandText}`}
              >
                Guifolio
              </p>
              <p className={`text-xs font-medium opacity-90 ${t.bandText}`}>
                Carte professionnelle digitale
              </p>
            </>
          )}
        </div>

        {/* Photo : chevauche le bandeau, double bordure blanche + accent */}
        <div className="relative -mt-12 flex justify-center">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className={`size-24 rounded-full border-4 border-white object-cover shadow-lg ring-2 ${t.ring}`}
            />
          ) : (
            <div
              className={`flex size-24 items-center justify-center rounded-full border-4 border-white font-display text-2xl font-bold shadow-lg ring-2 ${t.ring} ${t.card} ${t.headline}`}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Identité */}
        <div className="px-7 pb-7 pt-4 text-center">
          <h1
            className={`font-display text-xl font-extrabold uppercase tracking-wide ${t.name}`}
          >
            {profile.full_name || "Sans nom"}
          </h1>
          {profile.headline && (
            <p className={`mt-1 text-sm font-semibold ${t.headline}`}>
              {profile.headline}
            </p>
          )}
          {contacts.location_text && (
            <p
              className={`mt-1.5 flex items-center justify-center gap-1 text-xs ${t.text}`}
            >
              <MapPin className="size-3" />
              {contacts.location_text}
            </p>
          )}

          {/* Tuiles contact (grille stats façon badge) */}
          {tiles.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              {tiles.map(({ href, icon: Icon, label, value, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener" } : {})}
                  className={`group flex flex-col items-center gap-1.5 overflow-hidden rounded-xl p-3 transition ${t.btn}`}
                >
                  <span
                    className={`flex size-8 items-center justify-center rounded-lg ${t.btnPrimary}`}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                    {label}
                  </span>
                  <span className="w-full truncate text-center text-[11px] font-medium">
                    {value}
                  </span>
                </a>
              ))}
            </div>
          )}

          {/* Bouton WhatsApp principal si dispo */}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                `Bonjour ${profile.full_name}, j'ai scanné votre carte Guifolio.`
              )}`}
              target="_blank"
              rel="noopener"
              className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold transition ${t.btnPrimary}`}
            >
              <MessageCircle className="size-4" />
              Discuter sur WhatsApp
            </a>
          )}

          <div className="mt-3">
            <CardActions data={data} cardUrl={cardUrl} btnClass={t.btn} />
            <Link
              href={`/c/${slug}/print`}
              className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition ${t.btn}`}
            >
              <Printer className="size-3.5" />
              Imprimer mes cartes (10 par page A4, recto-verso)
            </Link>
          </div>

          {/* QR encadré + portfolio */}
          {(qrDataUrl || data.card.show_portfolio) && (
            <div
              className={`mt-6 flex flex-col items-center gap-3 border-t border-dashed pt-6 ${t.divider}`}
            >
              {qrDataUrl && (
                <>
                  <div
                    className={`rounded-2xl border-2 p-1.5 shadow-inner ${t.frame} bg-white`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrDataUrl}
                      alt={`QR code vers ${cardUrl}`}
                      width={128}
                      height={128}
                      className="rounded-xl"
                    />
                  </div>
                  <p className={`text-[11px] font-medium ${t.text}`}>
                    📱 Scannez pour garder mon contact
                  </p>
                </>
              )}
              {data.card.show_portfolio && (
                <Link
                  href={`/p/${slug}`}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold underline underline-offset-4 ${t.headline}`}
                >
                  <Sparkles className="size-3" />
                  Voir le portfolio complet
                </Link>
              )}
            </div>
          )}

          {/* Pied de badge */}
          <div
            className={`mt-6 border-t pt-4 text-center text-[10px] tracking-wide ${t.divider} ${t.text}`}
          >
            Carte digitale officielle · valide tant que le lien est actif
          </div>
        </div>
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
