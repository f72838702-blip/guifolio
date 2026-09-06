import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAdmin } from "@/lib/supabase/server";
import { portfolioDataSchema, type PortfolioRow } from "@/types/portfolio";
import PortfolioView from "@/components/PortfolioView";

export const revalidate = 60; // ISR : régénère au max toutes les 60s

type Params = { params: Promise<{ slug: string }> };

async function getPortfolio(slug: string) {
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
  if (!portfolio) return { title: "Portfolio introuvable" };
  const parsed = portfolioDataSchema.safeParse(portfolio.content);
  const name = parsed.success ? parsed.data.profile.full_name : slug;
  const headline = parsed.success ? parsed.data.profile.headline : "";
  return {
    title: name,
    description: headline || `Portfolio de ${name}`,
  };
}

export default async function PublicPortfolioPage({ params }: Params) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);
  if (!portfolio) notFound();

  const parsed = portfolioDataSchema.safeParse(portfolio.content);
  if (!parsed.success) notFound();

  return (
    <PortfolioView data={parsed.data} slug={slug} plan={portfolio.plan} />
  );
}
