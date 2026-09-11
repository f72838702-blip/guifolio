import { Phone, Mail, MapPin, Globe } from "lucide-react";
import type { PortfolioData } from "@/types/portfolio";

/**
 * CV professionnel A4 (imprimable / enregistrable en PDF).
 * Design sobre : blanc, accents marine — passe bien à l'impression
 * et chez les recruteurs.
 */
export default function CVView({ data, slug }: { data: PortfolioData; slug: string }) {
  const { profile, contacts, skills, experiences, social_links } = data;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "guifolio.com";
  const hasSocials = Object.values(social_links).some(Boolean);

  return (
    <div className="min-h-dvh bg-slate-200 py-6 print:bg-white print:py-0">
      <article className="mx-auto w-full max-w-[210mm] bg-white px-8 py-10 text-slate-800 shadow-xl print:max-w-none print:px-0 print:py-0 print:shadow-none sm:px-12">
        {/* En-tête */}
        <header className="flex items-center gap-6 border-b-2 border-emerald-700 pb-6">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="size-24 shrink-0 rounded-full border-2 border-emerald-700/20 object-cover"
            />
          ) : null}
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900">
              {profile.full_name || "Votre nom"}
            </h1>
            {profile.headline && (
              <p className="mt-1 font-medium text-emerald-700">{profile.headline}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
              {contacts.phone_formatted && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="size-3" /> {contacts.phone_formatted}
                </span>
              )}
              {contacts.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="size-3" /> {contacts.email}
                </span>
              )}
              {contacts.location_text && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" /> {contacts.location_text}
                </span>
              )}
              {contacts.whatsapp_number && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="size-3" /> WhatsApp : +{contacts.whatsapp_number}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Profil */}
        {profile.bio && (
          <section className="mt-6">
            <SectionTitle>Profil</SectionTitle>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{profile.bio}</p>
          </section>
        )}

        {/* Expériences */}
        {experiences.length > 0 && (
          <section className="mt-6">
            <SectionTitle>Expérience professionnelle</SectionTitle>
            <div className="mt-3 space-y-4">
              {experiences.map((exp, i) => (
                <div key={i} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                    <h3 className="font-semibold text-slate-900">
                      {exp.role}
                      {exp.company && (
                        <span className="font-normal text-slate-600"> — {exp.company}</span>
                      )}
                    </h3>
                    {exp.period && (
                      <span className="text-xs font-medium text-slate-500">{exp.period}</span>
                    )}
                  </div>
                  {exp.description && (
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Compétences */}
        {skills.length > 0 && (
          <section className="mt-6 break-inside-avoid">
            <SectionTitle>Compétences</SectionTitle>
            <ul className="mt-2 flex flex-wrap gap-x-2 gap-y-1.5">
              {skills.map((s) => (
                <li
                  key={s}
                  className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 print:border print:border-emerald-200 print:bg-white"
                >
                  {s}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Réseaux */}
        {hasSocials && (
          <section className="mt-6 break-inside-avoid">
            <SectionTitle>En ligne</SectionTitle>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {Object.entries(social_links)
                .filter(([, url]) => Boolean(url))
                .map(([key, url]) => (
                  <li key={key} className="inline-flex items-center gap-1.5">
                    <Globe className="size-3.5 text-slate-400" />
                    <span className="break-all">{url}</span>
                  </li>
                ))}
            </ul>
          </section>
        )}

        {/* Pied de page discret */}
        <footer className="mt-10 border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400">
          CV généré avec Guifolio · {slug}.{rootDomain}
        </footer>
      </article>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-b border-slate-200 pb-1 font-display text-sm font-bold uppercase tracking-widest text-emerald-800">
      {children}
    </h2>
  );
}
