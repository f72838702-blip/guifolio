import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { portfolioDataSchema, type PortfolioRow } from "@/types/portfolio";
import EditorClient from "./EditorClient";

export const metadata = { title: "Éditeur" };

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("portfolios")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!data) notFound();

  const row = data as unknown as PortfolioRow;
  const parsed = portfolioDataSchema.safeParse(row.content);

  return (
    <EditorClient
      id={row.id}
      userId={user.id}
      slug={row.slug}
      plan={row.plan}
      isPublic={row.is_public}
      initialData={parsed.success ? parsed.data : portfolioDataSchema.parse({})}
    />
  );
}
