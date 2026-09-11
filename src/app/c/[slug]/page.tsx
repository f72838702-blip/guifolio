import { notFound } from "next/navigation";
import type { Metadata } from "next";
import QRCode from "qrcode";
import { createAdmin } from "@/lib/supabase/server";
import { portfolioDataSchema, type PortfolioRow } from "@/types/portfolio";
import CardView from "@/components/CardView";

export const revalidate = 60; // ISR : régénère au max toutes les 60s

type Params = { params: Promise<{ slug: string }> };

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
  const portfolio = await getPortfolio(slug);
  if (!portfolio) return { title: "Carte introuvable" };
  const parsed = portfolioDataSchema.safeParse(portfolio.content);
  const name = parsed.success ? parsed.data.profile.full_name : slug;
  return {
    title: `Carte de visite — ${name}`,
    description: `Carte de visite digitale de ${name}. Contact direct par WhatsApp, appel ou email.`,
  };
}

export default async function PublicCardPage({ params }: Params) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);
  if (!portfolio) notFound();

  const parsed = portfolioDataSchema.safeParse(portfolio.content);
  if (!parsed.success) notFound();

  const origin = process.env.NEXT_PUBLIC_ROOT_DOMAIN
    ? `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
    : "";
  const cardUrl = `${origin}/c/${slug}`;

  let qrDataUrl: string | null = null;
  try {
    qrDataUrl = await QRCode.toDataURL(cardUrl, {
      margin: 1,
      width: 280,
      color: { dark: "#0f172a", light: "#ffffff" },
    });
  } catch {
    qrDataUrl = null; // QR non bloquant
  }

  return (
    <CardView
      data={parsed.data}
      slug={slug}
      plan={portfolio.plan}
      cardUrl={cardUrl}
      qrDataUrl={qrDataUrl}
    />
  );
}
