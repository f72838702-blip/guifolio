import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createAdmin } from "@/lib/supabase/server";
import { portfolioDataSchema, type PortfolioRow } from "@/types/portfolio";
import PortfolioView from "@/components/PortfolioView";

export const revalidate = 60; // ISR : régénère au max toutes les 60s

type Params = { params: Promise<{ slug: string }> };

const DEMO = {
  slug: "demo",
  plan: "FREE" as const,
  content: portfolioDataSchema.parse({
    profile: {
      full_name: "Aissatou Diallo",
      headline: "Développeuse Full-Stack | Conakry",
      bio: "Développeuse passionnée avec 4 ans d'expérience dans la création d'applications web modernes. Je transforme des idées en produits digitaux performants, accessibles même en connexion limitée.",
    },
    contacts: {
      phone_formatted: "+224620000000",
      whatsapp_number: "224620000000",
      email: "aissatou@exemple.com",
      location_text: "Dixinn, Conakry",
    },
    skills: ["React", "Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Node.js"],
    experiences: [
      {
        role: "Développeuse Full-Stack",
        company: "Tech Guinée",
        period: "2023 – présent",
        description:
          "Conception et déploiement d'applications SaaS pour des PME locales. Mise en place de paiements Mobile Money.",
      },
      {
        role: "Développeuse Front-End",
        company: "Studio Numérique Conakry",
        period: "2021 – 2023",
        description: "Sites vitrines et e-commerce pour commerçants guinéens.",
      },
    ],
    social_links: {
      linkedin: "https://linkedin.com/in/demo",
      github: "https://github.com/demo",
    },
  }),
};

async function getPortfolio(slug: string) {
  // Mode aperçu sans Supabase : /p/demo affiche des données de démonstration
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return slug === "demo" ? DEMO : null;
  }
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
