import { notFound } from "next/navigation";
import type { Metadata } from "next";
import QRCode from "qrcode";
import { createAdmin } from "@/lib/supabase/server";
import { portfolioDataSchema, type PortfolioRow } from "@/types/portfolio";
import { cardThemeStyles } from "@/lib/cardThemes";
import PrintButton from "@/components/PrintButton";

export const revalidate = 300; // ISR 5 min : les cartes ne changent pas souvent

type Params = { params: Promise<{ slug: string }> };

/** Nombre de cartes par feuille A4 : 2 colonnes × 5 lignes (85 × 55 mm) */
const CARDS = 10;

async function getPortfolio(slug: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const supabase = createAdmin();
  const { data } = await supabase
    .from("portfolios")
    .select("slug, plan, content")
    .eq("slug", slug)
    .eq("is_public", true)
    .single();
  return data as Pick<PortfolioRow, "slug" | "plan" | "content"> | null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Cartes à imprimer — ${slug}` };
}

export default async function CardPrintPage({ params }: Params) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);
  if (!portfolio) notFound();

  const parsed = portfolioDataSchema.safeParse(portfolio.content);
  if (!parsed.success) notFound();
  const data = parsed.data;

  const t = cardThemeStyles[data.card?.theme ?? "emeraude"];
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "guifolio.com";
  const cardUrl = `https://${slug}.${root}/carte`;

  // QR haute résolution pour impression (600px, marge fine)
  const qrDataUrl = await QRCode.toDataURL(cardUrl, {
    width: 600,
    margin: 1,
    errorCorrectionLevel: "M",
  });

  const { profile, contacts } = data;
  const wa = contacts.whatsapp_number.replace(/\D/g, "");
  const initials =
    profile.full_name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join("") || "GF";

  const cells = Array.from({ length: CARDS });

  return (
    <>
      {/* Marges à zéro pour tenir les 10 cartes pile sur l'A4 */}
      <style>{`
        @page { size: A4; margin: 0; }
        .pcolor { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      `}</style>

      <div className="bg-slate-200 print:bg-white">
        {/* Instructions écran uniquement */}
        <div className="no-print mx-auto max-w-[210mm] px-4 pt-6">
          <div className="rounded-xl border border-slate-300 bg-white p-5 text-sm text-slate-700 shadow">
            <h1 className="text-lg font-bold text-slate-900">
              🖨️ Vos 10 cartes de visite — prêtes à imprimer
            </h1>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>
                Cliquez sur le bouton <strong>Imprimer</strong> (ou Ctrl+P) →
                destination <strong>« Enregistrer au format PDF »</strong> ou
                votre imprimante.
              </li>
              <li>
                Papier : <strong>A4</strong> · Échelle : <strong>100 %</strong>{" "}
                (pas « Ajuster à la page »)
              </li>
              <li>
                ⚠️ Activez <strong>« Graphiques d'arrière-plan »</strong> dans
                les options d'impression (sinon les couleurs seront blanches)
              </li>
              <li>
                Impression <strong>recto-verso</strong>, retournement sur le
                <strong> bord long</strong> : page 1 = recto (cartes), page 2 =
                verso (QR codes)
              </li>
              <li>Découpez en suivant les pointillés ✂️</li>
            </ol>
          </div>
        </div>

        {/* ============ PAGE 1 : RECTO (10 cartes) ============ */}
        <section
          className="mx-auto my-6 grid w-[210mm] grid-cols-2 bg-white py-5 shadow-xl print:my-0 print:shadow-none"
          style={{ height: "297mm", padding: "11mm 20mm" }}
        >
          {cells.map((_, i) => (
            <div
              key={i}
              className="h-[55mm] w-[85mm] border border-dashed border-slate-300"
            >
              <div
                className={`pcolor flex h-full w-full flex-col justify-between overflow-hidden p-[3.5mm] ${t.card}`}
              >
                {/* Haut : identité */}
                <div className="flex items-center gap-[3mm]">
                  {profile.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profile.avatar_url}
                      alt=""
                      className="size-[11mm] shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className={`flex size-[11mm] shrink-0 items-center justify-center rounded-full text-[8pt] font-bold ${t.btnPrimary}`}
                    >
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p
                      className={`truncate text-[10pt] font-bold leading-tight ${t.name}`}
                    >
                      {profile.full_name}
                    </p>
                    {profile.headline && (
                      <p
                        className={`text-[6.5pt] leading-snug ${t.headline}`}
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {profile.headline}
                      </p>
                    )}
                  </div>
                </div>

                {/* Bas : contacts */}
                <div
                  className={`space-y-[1mm] border-t pt-[2mm] text-[6.5pt] leading-tight ${t.divider} ${t.text}`}
                >
                  {contacts.phone_formatted && (
                    <p className="truncate">📞 {contacts.phone_formatted}</p>
                  )}
                  {wa && <p className="truncate">💬 WhatsApp : +{wa}</p>}
                  {contacts.email && (
                    <p className="truncate">✉️ {contacts.email}</p>
                  )}
                  {contacts.location_text && (
                    <p className="truncate">📍 {contacts.location_text}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* ============ PAGE 2 : VERSO (10 QR codes, mêmes positions) ============ */}
        <section
          className="mx-auto my-6 grid w-[210mm] grid-cols-2 bg-white py-5 shadow-xl print:my-0 print:break-before-page print:shadow-none"
          style={{ height: "297mm", padding: "11mm 20mm" }}
        >
          {cells.map((_, i) => (
            <div
              key={i}
              className="h-[55mm] w-[85mm] border border-dashed border-slate-300"
            >
              <div className="flex h-full w-full flex-col items-center justify-center gap-[1.5mm] bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt={`QR code vers ${cardUrl}`}
                  className="size-[30mm]"
                />
                <p className="text-center text-[6pt] font-medium text-slate-500">
                  Scannez pour voir ma carte digitale
                </p>
                <p className="text-center text-[6pt] font-bold text-slate-700">
                  {slug}.{root}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>

      <PrintButton />
    </>
  );
}
