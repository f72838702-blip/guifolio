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
import { cardThemeStyles, type CardThemeStyle } from "@/lib/cardThemes";
import CardActions from "./CardActions";

type Shared = {
  data: PortfolioData;
  slug: string;
  cardUrl: string;
  qrDataUrl: string | null;
  t: CardThemeStyle;
  whatsapp: string;
  phone: string;
  initials: string;
};

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
  const initials =
    profile.full_name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "GF";

  const shared: Shared = {
    data,
    slug,
    cardUrl,
    qrDataUrl,
    t,
    whatsapp,
    phone,
    initials,
  };

  const Layout =
    data.card.layout === "classique"
      ? ClassicLayout
      : data.card.layout === "signature"
        ? SignatureLayout
        : BadgeLayout;

  return (
    <main
      className={`flex min-h-dvh flex-col items-center justify-center px-4 py-10 ${t.page}`}
    >
      <Layout {...shared} />

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

/** Filigrane : logo entreprise (ou initiales) en fond, très léger */
function Watermark({ data, initials }: { data: PortfolioData; initials: string }) {
  if (data.card.company_logo_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={data.card.company_logo_url}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 w-56 -translate-x-1/2 -translate-y-1/2 opacity-[0.05]"
      />
    );
  }
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 font-display text-[10rem] font-black opacity-[0.04] text-current"
    >
      {initials}
    </span>
  );
}

/** Bloc actions commun : enregistrer/partager + impression */
function CardFooterActions({ data, slug, cardUrl, t }: Shared) {
  return (
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
  );
}

/** QR encadré + lien portfolio */
function QrBlock({ data, slug, cardUrl, qrDataUrl, t }: Shared) {
  if (!qrDataUrl && !data.card.show_portfolio) return null;
  return (
    <div
      className={`mt-6 flex flex-col items-center gap-3 border-t border-dashed pt-6 ${t.divider}`}
    >
      {qrDataUrl && (
        <>
          <div
            className={`rounded-2xl border-2 bg-white p-1.5 shadow-inner ${t.frame}`}
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
  );
}

/* ================================================================
   MODÈLE 1 — Badge Premium (bandeau dégradé, photo chevauchante)
   ================================================================ */
function BadgeLayout(shared: Shared) {
  const { data, t, whatsapp, phone, initials } = shared;
  const { profile, contacts } = data;
  const mapsQuery = encodeURIComponent(contacts.location_text);

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
    <div
      className={`w-full max-w-sm overflow-hidden rounded-[1.75rem] border-2 shadow-2xl ${t.frame} ${t.card}`}
    >
      {/* Bandeau dégradé */}
      <div
        className={`relative flex h-24 flex-col items-center justify-center overflow-hidden ${t.band}`}
      >
        <span
          className={`pointer-events-none absolute inset-0 flex items-center justify-center font-display text-7xl font-black opacity-10 ${t.bandText}`}
          aria-hidden
        >
          {initials}
        </span>
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

      {/* Photo chevauchante double bordure */}
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

        {tiles.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-2.5">
            {tiles.map(({ href, icon: Icon, label, value, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener" } : {})}
                className={`flex flex-col items-center gap-1.5 overflow-hidden rounded-xl p-3 transition ${t.btn}`}
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

        <CardFooterActions {...shared} />
        <QrBlock {...shared} />

        <div
          className={`mt-6 border-t pt-4 text-center text-[10px] tracking-wide ${t.divider} ${t.text}`}
        >
          Carte digitale officielle · valide tant que le lien est actif
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MODÈLE 2 — Classique Pro (épuré, une CTA forte, filigrane logo)
   ================================================================ */
function ClassicLayout(shared: Shared) {
  const { data, t, whatsapp, phone, initials } = shared;
  const { profile, contacts } = data;
  const mapsQuery = encodeURIComponent(contacts.location_text);

  const links = [
    whatsapp
      ? { href: `https://wa.me/${whatsapp}`, icon: MessageCircle, label: "WhatsApp", external: true }
      : null,
    phone
      ? { href: `tel:${phone}`, icon: Phone, label: contacts.phone_formatted, external: false }
      : null,
    contacts.email
      ? { href: `mailto:${contacts.email}`, icon: Mail, label: "Email", external: false }
      : null,
    contacts.location_text
      ? {
          href: `https://maps.google.com/?q=${mapsQuery}`,
          icon: MapPin,
          label: contacts.location_text,
          external: true,
        }
      : null,
  ].filter(Boolean) as {
    href: string;
    icon: typeof Phone;
    label: string;
    external: boolean;
  }[];

  return (
    <div
      className={`relative w-full max-w-sm overflow-hidden rounded-[1.75rem] border-2 shadow-2xl ${t.frame} ${t.card}`}
    >
      <Watermark data={data} initials={initials} />

      <div className="relative px-7 py-10 text-center">
        {/* Logo entreprise discret en haut */}
        {data.card.company_logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.card.company_logo_url}
            alt={data.card.company_name || "Logo"}
            className="mx-auto mb-5 h-10 w-auto rounded-lg bg-white/95 object-contain p-1 shadow"
          />
        )}

        {/* Photo pro */}
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className={`mx-auto size-28 rounded-2xl object-cover shadow-lg ring-2 ${t.ring}`}
          />
        ) : (
          <div
            className={`mx-auto flex size-28 items-center justify-center rounded-2xl font-display text-3xl font-bold shadow-lg ring-2 ${t.ring} ${t.card} ${t.headline}`}
          >
            {initials}
          </div>
        )}

        <h1 className={`mt-5 font-display text-2xl font-bold ${t.name}`}>
          {profile.full_name || "Sans nom"}
        </h1>
        {profile.headline && (
          <p className={`mt-1 text-sm font-semibold ${t.headline}`}>
            {profile.headline}
          </p>
        )}
        {data.card.company_name && (
          <p className={`mt-1 text-xs font-bold uppercase tracking-[0.25em] ${t.text}`}>
            {data.card.company_name}
          </p>
        )}

        {/* UNE action forte */}
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
              `Bonjour ${profile.full_name}, j'ai vu votre carte Guifolio.`
            )}`}
            target="_blank"
            rel="noopener"
            className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-bold transition ${t.btnPrimary}`}
          >
            <MessageCircle className="size-5" />
            Écrivez-moi sur WhatsApp
          </a>
        )}
        {!whatsapp && phone && (
          <a
            href={`tel:${phone}`}
            className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-sm font-bold transition ${t.btnPrimary}`}
          >
            <Phone className="size-5" />
            Appelez-moi
          </a>
        )}

        {/* Liens secondaires sobres */}
        {links.length > 0 && (
          <div
            className={`mt-6 space-y-2.5 border-t border-dashed pt-5 text-left ${t.divider}`}
          >
            {links.map(({ href, icon: Icon, label, external }) => (
              <a
                key={href}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener" } : {})}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${t.btn}`}
              >
                <Icon className={`size-4 shrink-0 ${t.headline}`} />
                <span className="truncate">{label}</span>
              </a>
            ))}
          </div>
        )}

        <CardFooterActions {...shared} />
        <QrBlock {...shared} />
      </div>
    </div>
  );
}

/* ================================================================
   MODÈLE 3 — Signature (éditorial minimal, logo en filigrane)
   ================================================================ */
function SignatureLayout(shared: Shared) {
  const { data, t, whatsapp, phone, initials } = shared;
  const { profile, contacts } = data;

  return (
    <div
      className={`relative w-full max-w-sm overflow-hidden rounded-[1.75rem] border-2 px-8 py-12 text-center shadow-2xl ${t.frame} ${t.card}`}
    >
      <Watermark data={data} initials={initials} />

      <div className="relative">
        {/* Ornement haut */}
        <div className={`mx-auto h-px w-16 ${t.band}`} />
        <p className={`mt-4 text-[10px] font-bold uppercase tracking-[0.4em] ${t.text}`}>
          {data.card.company_name || "Carte professionnelle"}
        </p>

        {/* Avatar petit et discret */}
        {profile.avatar_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className={`mx-auto mt-6 size-16 rounded-full object-cover ring-1 ${t.ring}`}
          />
        )}

        {/* Typographie élégante */}
        <h1
          className={`mt-6 font-display text-3xl font-light tracking-wide ${t.name}`}
        >
          {profile.full_name || "Sans nom"}
        </h1>
        {profile.headline && (
          <p className={`mt-2 text-sm italic ${t.headline}`}>
            {profile.headline}
          </p>
        )}

        <div className={`mx-auto mt-6 h-px w-16 ${t.band}`} />

        {/* Coordonnées en texte pur */}
        <div className="mt-6 space-y-1.5 text-sm">
          {contacts.phone_formatted && (
            <p>
              <a href={`tel:${phone}`} className={`${t.text} hover:${t.name}`}>
                {contacts.phone_formatted}
              </a>
            </p>
          )}
          {contacts.email && (
            <p>
              <a
                href={`mailto:${contacts.email}`}
                className={`${t.text} break-all`}
              >
                {contacts.email}
              </a>
            </p>
          )}
          {contacts.location_text && (
            <p className={t.text}>{contacts.location_text}</p>
          )}
        </div>

        {/* CTA discrète */}
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener"
            className={`mt-7 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition ${t.btnPrimary}`}
          >
            <MessageCircle className="size-3.5" />
            WhatsApp
          </a>
        )}

        <div className="mt-6">
          <CardFooterActions {...shared} />
        </div>
        <QrBlock {...shared} />
      </div>
    </div>
  );
}
