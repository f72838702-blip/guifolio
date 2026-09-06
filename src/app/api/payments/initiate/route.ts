import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient, createAdmin } from "@/lib/supabase/server";
import { PLANS, type Plan } from "@/types/portfolio";

const bodySchema = z.object({
  portfolioId: z.string().uuid(),
  plan: z.enum(["PRO", "VIP"]),
  method: z.enum(["ORANGE_MONEY", "MTN_MOMOPAY"]),
  phone: z.string().min(8).max(20),
});

/**
 * Initie un paiement Mobile Money (Chariow comme agrégateur OM/MTN).
 * Sans clé CHARIOW : mode démo — crée la transaction PENDING et la valide
 * immédiatement pour tester le flow end-to-end.
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }
  const { portfolioId, plan, method, phone } = parsed.data;

  // Vérifie la propriété du portfolio
  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("id, slug")
    .eq("id", portfolioId)
    .eq("user_id", user.id)
    .single();
  if (!portfolio) {
    return NextResponse.json({ error: "Portfolio introuvable" }, { status: 404 });
  }

  const admin = createAdmin();
  const amount = PLANS[plan as Plan].priceGNF;
  const providerTxId = `GF-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const { error: txError } = await admin.from("transactions").insert({
    user_id: user.id,
    portfolio_id: portfolioId,
    provider_tx_id: providerTxId,
    provider:
      process.env.CHARIOW_API_KEY ? "CHARIOW" : `${method}_DEMO`,
    amount,
    currency: "GNF",
    status: "PENDING",
  });
  if (txError) {
    return NextResponse.json({ error: txError.message }, { status: 500 });
  }

  if (!process.env.CHARIOW_API_KEY) {
    // MODE DÉMO : succès immédiat + upgrade plan
    await admin
      .from("transactions")
      .update({ status: "SUCCESS" })
      .eq("provider_tx_id", providerTxId);
    await admin.from("portfolios").update({ plan }).eq("id", portfolioId);

    return NextResponse.json({
      mode: "demo",
      providerTxId,
      message:
        "Paiement simulé avec succès (configurez CHARIOW_API_KEY pour la production)",
    });
  }

  // PRODUCTION : appel Chariow — l'utilisateur confirme via USSD push sur son téléphone
  const chariowRes = await fetch(
    `${process.env.CHARIOW_BASE_URL}/payments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CHARIOW_API_KEY}`,
      },
      body: JSON.stringify({
        amount,
        currency: "GNF",
        provider: method,
        phone,
        reference: providerTxId,
        callback_url: `${req.nextUrl.origin}/api/payments/webhook`,
      }),
    }
  );

  if (!chariowRes.ok) {
    await admin
      .from("transactions")
      .update({ status: "FAILED" })
      .eq("provider_tx_id", providerTxId);
    return NextResponse.json(
      { error: "Échec d'initiation du paiement" },
      { status: 502 }
    );
  }

  return NextResponse.json({
    mode: "live",
    providerTxId,
    message: "Confirmez le paiement sur votre téléphone (USSD push)",
  });
}
