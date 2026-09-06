import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  title: {
    default: "Guifolio — Votre carte de visite digitale en 2 minutes",
    template: "%s | Guifolio",
  },
  description:
    "Transformez votre CV en un portfolio interactif ultra-moderne. Sous-domaine offert, bouton WhatsApp, paiement Orange Money & MTN. Fait pour la Guinée et l'Afrique de l'Ouest.",
  metadataBase: new URL(
    `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "guifolio.com"}`
  ),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${grotesk.variable} font-sans antialiased bg-slate-950 text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
