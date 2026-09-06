"use client";

import { useRouter } from "next/navigation";
import { Crown, Loader2, X } from "lucide-react";
import { useCheckoutStore } from "@/stores/checkout";
import { PLANS } from "@/types/portfolio";

export default function UpgradeButton({ portfolioId }: { portfolioId: string }) {
  const router = useRouter();
  const store = useCheckoutStore();

  async function handlePay() {
    store.setStep("processing");
    const res = await fetch("/api/payments/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        portfolioId,
        plan: store.plan,
        method: store.method,
        phone: store.phone,
      }),
    });
    const body = await res.json();
    if (!res.ok) {
      store.setStep("error", body.error ?? "Erreur de paiement");
      return;
    }
    if (body.mode === "demo") {
      store.setStep("success", body.message);
      router.refresh();
    } else {
      store.setStep("waiting_ussd", body.message);
    }
  }

  if (store.step === "idle") {
    return (
      <button
        onClick={() => store.open("PRO")}
        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/25"
      >
        <Crown className="size-3.5" /> Passer Pro
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-7">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">
            Upgrade {PLANS[store.plan].name}
          </h3>
          <button onClick={store.close} aria-label="Fermer">
            <X className="size-5 text-slate-400 hover:text-white" />
          </button>
        </div>

        {store.step === "form" && (
          <div className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {(["PRO", "VIP"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => store.setPlan(p)}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                    store.plan === p
                      ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                      : "border-slate-700 text-slate-400"
                  }`}
                >
                  {PLANS[p].name} — {PLANS[p].priceGNF.toLocaleString("fr-GN")} GNF
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => store.setMethod("ORANGE_MONEY")}
                className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                  store.method === "ORANGE_MONEY"
                    ? "border-orange-500 bg-orange-500/10 text-orange-300"
                    : "border-slate-700 text-slate-400"
                }`}
              >
                🟠 Orange Money
              </button>
              <button
                onClick={() => store.setMethod("MTN_MOMOPAY")}
                className={`rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                  store.method === "MTN_MOMOPAY"
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-300"
                    : "border-slate-700 text-slate-400"
                }`}
              >
                🟡 MTN MoMo
              </button>
            </div>
            <input
              value={store.phone}
              onChange={(e) => store.setPhone(e.target.value)}
              placeholder="Numéro Mobile Money (ex: 620 00 00 00)"
              inputMode="tel"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-emerald-500"
            />
            <button
              onClick={handlePay}
              disabled={store.phone.replace(/\D/g, "").length < 9}
              className="w-full rounded-lg bg-emerald-500 py-3 font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:opacity-50"
            >
              Payer {PLANS[store.plan].priceGNF.toLocaleString("fr-GN")} GNF
            </button>
          </div>
        )}

        {(store.step === "processing" || store.step === "waiting_ussd") && (
          <div className="mt-6 flex flex-col items-center gap-3 py-6 text-center">
            <Loader2 className="size-8 animate-spin text-emerald-400" />
            <p className="text-sm text-slate-300">
              {store.message || "Traitement en cours…"}
            </p>
          </div>
        )}

        {store.step === "success" && (
          <div className="mt-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-center text-sm text-emerald-200">
            🎉 {store.message}
            <button
              onClick={() => {
                store.close();
                router.refresh();
              }}
              className="mt-4 w-full rounded-lg bg-emerald-500 py-2.5 font-semibold text-emerald-950"
            >
              Terminé
            </button>
          </div>
        )}

        {store.step === "error" && (
          <div className="mt-6 rounded-xl border border-red-500/40 bg-red-500/10 p-5 text-center text-sm text-red-200">
            {store.message}
            <button
              onClick={() => store.setStep("form")}
              className="mt-4 w-full rounded-lg border border-slate-600 py-2.5 font-semibold text-slate-200"
            >
              Réessayer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
