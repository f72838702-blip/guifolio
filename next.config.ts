import type { NextConfig } from "next";

// Note : la CSP n'est PAS définie ici car next.config headers() est évalué AVANT
// le middleware, sur le chemin d'entrée (pas le chemin réécrit) — impossible de
// brancher sur le hostname. Le middleware applique CSP_APP ou CSP_STATIC_SITE
// selon la requête : voir src/lib/csp.ts.
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
];

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
