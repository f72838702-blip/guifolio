/**
 * Content Security Policy centralisée.
 *
 * next.config ne peut pas brancher sur le hostname (les headers() sont évalués
 * avant le middleware, sur le chemin d'entrée) : c'est le middleware qui choisit
 * la CSP à appliquer via applyCsp().
 *
 * - CSP_APP   : app SaaS — nous + Supabase uniquement
 * - CSP_STATIC_SITE : sites statiques intégrés (public/<site>) — 100% autonome :
 *   Tailwind, Lucide et les polices sont auto-hébergés dans leurs assets
 */

const SOURCES_APP = [
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

const SOURCES_STATIC_SITE = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https: data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
];

export const CSP_APP = SOURCES_APP.join("; ");
export const CSP_STATIC_SITE = SOURCES_STATIC_SITE.join("; ");
