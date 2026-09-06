"use client";

import { create } from "zustand";

export type CheckoutStep =
  | "idle"
  | "form"
  | "processing"
  | "waiting_ussd"
  | "success"
  | "error";

type CheckoutStore = {
  step: CheckoutStep;
  plan: "PRO" | "VIP";
  method: "ORANGE_MONEY" | "MTN_MOMOPAY";
  phone: string;
  message: string;
  open: (plan: "PRO" | "VIP") => void;
  close: () => void;
  setPlan: (p: "PRO" | "VIP") => void;
  setMethod: (m: "ORANGE_MONEY" | "MTN_MOMOPAY") => void;
  setPhone: (p: string) => void;
  setStep: (s: CheckoutStep, message?: string) => void;
};

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  step: "idle",
  plan: "PRO",
  method: "ORANGE_MONEY",
  phone: "",
  message: "",
  open: (plan) => set({ step: "form", plan, message: "" }),
  close: () => set({ step: "idle", message: "", phone: "" }),
  setPlan: (plan) => set({ plan }),
  setMethod: (method) => set({ method }),
  setPhone: (phone) => set({ phone }),
  setStep: (step, message = "") => set({ step, message }),
}));
