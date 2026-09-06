import { redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Pencil, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PLANS, type PortfolioRow } from "@/types/portfolio";
import { signOut } from "./actions";
import CreatePortfolio from "./CreatePortfolio";
import UpgradeButton from "./UpgradeButton";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: portfolios } = await supabase
    .from("portfolios")
    .select("id, slug, plan, is_public, updated_at, content")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "guifolio.com";

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">
            Mes <span className="text-emerald-400">portfolios</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">{user.email}</p>
        </div>
        <form action={signOut}>
          <button className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500">
            Déconnexion
          </button>
        </form>
      </header>

      <CreatePortfolio />

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        {(portfolios ?? []).map((p) => {
          const row = p as unknown as PortfolioRow;
          const plan = PLANS[row.plan];
          return (
            <article
              key={row.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold">
                    {row.content?.profile?.full_name || row.slug}
                  </h2>
                  <a
                    href={`https://${row.slug}.${rootDomain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-0.5 inline-flex items-center gap-1 text-sm text-emerald-400 hover:underline"
                  >
                    {row.slug}.{rootDomain} <ExternalLink className="size-3" />
                  </a>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                    row.plan === "FREE"
                      ? "bg-slate-800 text-slate-300"
                      : "bg-amber-500/15 text-amber-300"
                  }`}
                >
                  {row.plan !== "FREE" && <Crown className="size-3" />}
                  {plan.name}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <Link
                  href={`/editor/${row.id}`}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
                >
                  <Pencil className="size-3.5" /> Éditer
                </Link>
                <Link
                  href={`/p/${row.slug}`}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-500"
                >
                  Aperçu public
                </Link>
                {row.plan === "FREE" && <UpgradeButton portfolioId={row.id} />}
              </div>
            </article>
          );
        })}
        {(!portfolios || portfolios.length === 0) && (
          <p className="col-span-full rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-500">
            Aucun portfolio pour l&apos;instant — créez le vôtre ci-dessus 👆
          </p>
        )}
      </section>
    </main>
  );
}
