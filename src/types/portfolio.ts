import { z } from "zod";

export const cardThemes = [
  "emeraude",
  "nuit",
  "guinee",
  "sahel",
  "ocean",
  "royal",
] as const;
export type CardTheme = (typeof cardThemes)[number];

export const portfolioDataSchema = z.object({
  profile: z.object({
    full_name: z.string().default(""),
    headline: z.string().default(""),
    bio: z.string().default(""),
    avatar_url: z.string().optional(),
  }),
  contacts: z.object({
    phone_raw: z.string().default(""),
    phone_formatted: z.string().default(""), // +224620000000
    whatsapp_number: z.string().default(""), // 224620000000 (wa.me ready)
    email: z.string().default(""),
    location_text: z.string().default(""), // "Dixinn, Conakry"
  }),
  skills: z.array(z.string()).default([]),
  experiences: z
    .array(
      z.object({
        role: z.string().default(""),
        company: z.string().default(""),
        period: z.string().default(""),
        description: z.string().default(""),
      })
    )
    .default([]),
  social_links: z
    .object({
      linkedin: z.string().optional(),
      facebook: z.string().optional(),
      github: z.string().optional(),
      website: z.string().optional(),
    })
    .default({}),
  card: z
    .object({
      theme: z.enum(cardThemes).default("emeraude"),
      show_portfolio: z.boolean().default(true),
    })
    .default({ theme: "emeraude", show_portfolio: true }),
});

export type PortfolioData = z.infer<typeof portfolioDataSchema>;

export const emptyPortfolioData: PortfolioData = {
  profile: { full_name: "", headline: "", bio: "" },
  contacts: {
    phone_raw: "",
    phone_formatted: "",
    whatsapp_number: "",
    email: "",
    location_text: "",
  },
  skills: [],
  experiences: [],
  social_links: {},
  card: { theme: "emeraude", show_portfolio: true },
};

export type Plan = "FREE" | "PRO" | "VIP";

/** Nombre max de portfolios par utilisateur selon son meilleur plan */
export const PLAN_LIMITS: Record<Plan, number> = {
  FREE: 1,
  PRO: 3,
  VIP: 10,
};

export function bestPlan(plans: Plan[]): Plan {
  if (plans.includes("VIP")) return "VIP";
  if (plans.includes("PRO")) return "PRO";
  return "FREE";
}

export type PortfolioRow = {
  id: string;
  user_id: string;
  slug: string;
  plan: Plan;
  content: PortfolioData;
  is_public: boolean;
  created_at: string;
  updated_at: string;
};

export const PLANS: Record<
  Plan,
  { name: string; priceGNF: number; features: string[] }
> = {
  FREE: {
    name: "Gratuit",
    priceGNF: 0,
    features: [
      "1 portfolio en ligne",
      "Sous-domaine pseudo.guifolio.com",
      "Bouton WhatsApp",
      "Badge Guifolio",
    ],
  },
  PRO: {
    name: "Pro",
    priceGNF: 50_000,
    features: [
      "Tout Gratuit",
      "Sans badge Guifolio",
      "Import CV PDF illimité, rempli automatiquement",
      "Statistiques de visites",
      "QR code carte de visite",
    ],
  },
  VIP: {
    name: "VIP",
    priceGNF: 120_000,
    features: [
      "Tout Pro",
      "Domaine personnalisé",
      "Thèmes premium",
      "Support prioritaire WhatsApp",
    ],
  },
};
