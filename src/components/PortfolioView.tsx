import {
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Globe,
  Briefcase,
  CreditCard,
} from "lucide-react";
import type { PortfolioData, Plan } from "@/types/portfolio";

// Icônes de marques (lucide-react ne les exporte plus)
function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45z" />
    </svg>
  );
}
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.93c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.2.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}

export default function PortfolioView({
  data,
  slug,
  plan,
}: {
  data: PortfolioData;
  slug: string;
  plan: Plan;
}) {
  const { profile, contacts, skills, experiences, social_links } = data;
  const wa = contacts.whatsapp_number.replace(/\D/g, "");
  const socials = [
    { url: social_links.linkedin, Icon: LinkedinIcon, label: "LinkedIn" },
    { url: social_links.facebook, Icon: FacebookIcon, label: "Facebook" },
    { url: social_links.github, Icon: GithubIcon, label: "GitHub" },
    { url: social_links.website, Icon: Globe, label: "Site web" },
  ].filter((s) => s.url);

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-5 pb-20 pt-14">
      {/* Header */}
      <header className="text-center">
        <div className="mx-auto flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-amber-300 font-display text-3xl font-bold text-slate-950">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="size-24 rounded-full object-cover"
            />
          ) : (
            initials(profile.full_name)
          )}
        </div>
        <h1 className="mt-5 font-display text-3xl font-bold tracking-tight">
          {profile.full_name || slug}
        </h1>
        {profile.headline && (
          <p className="mt-2 font-medium text-emerald-300">{profile.headline}</p>
        )}
        {contacts.location_text && (
          <p className="mt-1.5 inline-flex items-center gap-1 text-sm text-slate-400">
            <MapPin className="size-3.5" /> {contacts.location_text}
          </p>
        )}
        <div className="mt-4">
          <a
            href={`/c/${slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/20"
          >
            <CreditCard className="size-3.5" /> Ma carte de visite
          </a>
        </div>
      </header>

      {/* CTA contact */}
      <div className="mt-7 grid grid-cols-2 gap-3">
        {wa && (
          <a
            href={`https://wa.me/${wa}?text=${encodeURIComponent(
              `Bonjour ${profile.full_name}, j'ai vu votre portfolio Guifolio.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3.5 font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            <MessageCircle className="size-4" /> WhatsApp
          </a>
        )}
        {contacts.phone_formatted && (
          <a
            href={`tel:${contacts.phone_formatted}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 py-3.5 font-semibold text-slate-200 transition hover:border-slate-500"
          >
            <Phone className="size-4" /> Appeler
          </a>
        )}
        {contacts.email && (
          <a
            href={`mailto:${contacts.email}`}
            className="col-span-2 flex items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 text-sm text-slate-300 transition hover:border-slate-500"
          >
            <Mail className="size-4" /> {contacts.email}
          </a>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <section className="mt-10">
          <p className="leading-relaxed text-slate-300">{profile.bio}</p>
        </section>
      )}

      {/* Compétences */}
      {skills.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-slate-500">
            Compétences
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-sm text-emerald-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Expériences */}
      {experiences.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-slate-500">
            Expériences
          </h2>
          <div className="mt-4 space-y-4">
            {experiences.map((exp, i) => (
              <article
                key={`${exp.company}-${i}`}
                className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5"
              >
                <div className="flex items-start gap-3">
                  <Briefcase className="mt-1 size-4 shrink-0 text-emerald-400" />
                  <div>
                    <h3 className="font-semibold">{exp.role}</h3>
                    <p className="text-sm text-slate-400">
                      {exp.company}
                      {exp.period && ` · ${exp.period}`}
                    </p>
                    {exp.description && (
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Réseaux */}
      {socials.length > 0 && (
        <section className="mt-10 flex justify-center gap-3">
          {socials.map(({ url, Icon, label }) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="flex size-11 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:border-emerald-500/60 hover:text-emerald-300"
            >
              <Icon className="size-5" />
            </a>
          ))}
        </section>
      )}

      {/* Badge Guifolio (plan FREE) */}
      {plan === "FREE" && (
        <footer className="mt-16 text-center">
          <a
            href={`https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "guifolio.com"}`}
            className="text-xs text-slate-600 transition hover:text-emerald-400"
          >
            ⚡ Créé avec Guifolio — votre carte de visite digitale
          </a>
        </footer>
      )}
    </main>
  );
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join("") || "?"
  );
}
