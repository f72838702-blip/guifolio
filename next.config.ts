import type { NextConfig } from "next";

// CSP stricte : ressources = nous + Supabase (app SaaS)
const cspGuifolio = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https: data: blob:", // Storage Supabase + QR data: URI
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
];

// CSP assouplie pour les sites statiques intégrés (public/mamadou-thiam, ...) :
// ils utilisent Tailwind CDN, Lucide (unpkg) et Google Fonts
const cspStatic = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' https: data: blob:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
];

const securityHeaders = [
  // Empêche le navigateur de deviner le type MIME (anti-XSS)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Anti-clickjacking : le site ne peut être mis en iframe que par lui-même
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Fuite d'URL limitée vers les sites tiers
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // HTTPS forcé pendant 2 ans, sous-domaines inclus (guifolio.com + *.guifolio.com)
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // API navigateur : caméra uniquement pour nous (upload photo), rien d'autre
  {
    key: "Permissions-Policy",
    value: "camera=(self), microphone=(), geolocation=(), payment=()",
  },
  // Content Security Policy : ressources autorisées = nous + Supabase
  {
    key: "Content-Security-Policy",
    value: cspGuifolio.join("; "),
  },
];

// Mêmes headers, CSP assouplie (sites statiques hébergés)
const staticSiteHeaders = securityHeaders.map((h) =>
  h.key === "Content-Security-Policy"
    ? { key: h.key, value: cspStatic.join("; ") }
    : h
);

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  async headers() {
    return [
      // Tout l'app SaaS (sauf les dossiers de sites statiques)
      { source: "/((?!mamadou-thiam).*)", headers: securityHeaders },
      // Sites statiques hébergés : CSP assouplie
      { source: "/mamadou-thiam/:path*", headers: staticSiteHeaders },
    ];
  },
};

export default nextConfig;
