import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createAdmin } from "@/lib/supabase/server";

/**
 * Webhook Chariow : reçoit le statut final d'un paiement.
 * Body attendu : { reference, status: "SUCCESS"|"FAILED" }
 * Sécurisé par signature HMAC-SHA256 (X-Chariow-Signature).
 */
export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const secret = process.env.CHARIOW_WEBHOOK_SECRET;
  if (secret) {
    const signature = req.headers.get("x-chariow-signature") ?? "";
    const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
    const valid =
      signature.length === expected.length &&
      timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    if (!valid) {
      return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
    }
  }

  const payload = JSON.parse(rawBody) as {
    reference?: string;
    status?: string;
  };
  if (!payload.reference || !payload.status) {
    return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
  }

  const admin = createAdmin();
  const { data: tx } = await admin
    .from("transactions")
    .select("id, user_id, portfolio_id, amount, status")
    .eq("provider_tx_id", payload.reference)
    .single();

  if (!tx) {
    return NextResponse.json({ error: "Transaction inconnue" }, { status: 404 });
  }
  if (tx.status !== "PENDING") {
    return NextResponse.json({ ok: true }); // idempotent
  }

  if (payload.status === "SUCCESS") {
    await admin
      .from("transactions")
      .update({ status: "SUCCESS" })
      .eq("id", tx.id);
    // Upgrade plan : PRO < 100k <= VIP
    const plan = tx.amount >= 100_000 ? "VIP" : "PRO";
    if (tx.portfolio_id) {
      await admin
        .from("portfolios")
        .update({ plan })
        .eq("id", tx.portfolio_id);
    } else {
      await admin.from("portfolios").update({ plan }).eq("user_id", tx.user_id);
    }
  } else {
    await admin
      .from("transactions")
      .update({ status: "FAILED" })
      .eq("id", tx.id);
  }

  return NextResponse.json({ ok: true });
}
