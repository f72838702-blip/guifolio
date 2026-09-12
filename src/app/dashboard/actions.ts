"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  portfolioDataSchema,
  emptyPortfolioData,
  PLAN_LIMITS,
  bestPlan,
  type PortfolioData,
  type Plan,
} from "@/types/portfolio";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{2,49}$/;

export async function createPortfolio(slug: string): Promise<
  { ok: true; id: string } | { ok: false; error: string }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const cleanSlug = slug.trim().toLowerCase();
  if (!SLUG_RE.test(cleanSlug)) {
    return {
      ok: false,
      error: "Slug invalide : 3-50 caractères, lettres minuscules, chiffres et tirets",
    };
  }

  // Quota par plan : meilleur plan de l'utilisateur vs nombre de portfolios
  const { data: existing } = await supabase
    .from("portfolios")
    .select("plan")
    .eq("user_id", user.id);
  const count = existing?.length ?? 0;
  const plan: Plan = bestPlan(((existing ?? []).map((r) => r.plan) as Plan[]) ?? []);
  const limit = PLAN_LIMITS[plan];
  if (count >= limit) {
    return {
      ok: false,
      error: `Plan ${plan} : ${limit} portfolio${limit > 1 ? "s" : ""} maximum. Passez au plan supérieur pour en créer davantage.`,
    };
  }

  const { data, error } = await supabase
    .from("portfolios")
    .insert({
      user_id: user.id,
      slug: cleanSlug,
      plan,
      content: emptyPortfolioData,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") return { ok: false, error: "Ce nom est déjà pris" };
    return { ok: false, error: error.message };
  }
  revalidatePath("/dashboard");
  return { ok: true, id: data.id };
}

export async function updatePortfolioContent(
  id: string,
  content: PortfolioData
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Non authentifié" };

  const parsed = portfolioDataSchema.safeParse(content);
  if (!parsed.success) return { ok: false, error: "Données invalides" };

  const { error } = await supabase
    .from("portfolios")
    .update({ content: parsed.data })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/p");
  return { ok: true };
}

export async function togglePublic(
  id: string,
  isPublic: boolean
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase
    .from("portfolios")
    .update({ is_public: isPublic })
    .eq("id", id)
    .eq("user_id", user.id);
  revalidatePath("/dashboard");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
