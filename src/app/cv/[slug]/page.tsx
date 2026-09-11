import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAdmin } from "@/lib/supabase/server";
import { portfolioDataSchema, type PortfolioRow } from "@/types/portfolio";
import CVView from "@/components/CVView";
import PrintButton from "@/components/PrintButton";

export const revalidate = 60;

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
  const parsed = portfolio
    ? portfolioDataSchema.safeParse(portfolio.content)
    : null;
  const name = parsed?.success ? parsed.data.profile.full_name : slug;
  return {
    title: `CV — ${name}`,
    description: `Curriculum Vitae de ${name}, généré par Guifolio.`,
  };
}

export default async function PublicCVPage({ params }: Params) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);
  if (!portfolio) notFound();

  const parsed = portfolioDataSchema.safeParse(portfolio.content);
  if (!parsed.success) notFound();

  return (
    <>
      <CVView data={parsed.data} slug={slug} />
      <PrintButton />
    </>
  );
}
