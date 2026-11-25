import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "guifolio.com";
const RESERVED = new Set(["www", "app", "api", "admin"]);

// Sites statiques intégrés (dossiers sous public/) servis tels quels sur leur sous-domaine
// ex : mamadou-thiam.guifolio.com → public/mamadou-thiam/
const STATIC_SITES: Record<string, string> = {
  "mamadou-thiam": "/mamadou-thiam",
};

/**
 * 1. Wildcard DNS : pseudo.guifolio.com → /p/pseudo (rewrite invisible)
 *    + sites statiques : mamadou-thiam.guifolio.com → /mamadou-thiam/index.html
 * 2. Refresh de session Supabase (magic link cookies)
 */
/**
 * Réécrit une requête d'un sous-domaine site statique :
 *  /            → <base>/index.html
 *  /assets/*    → <base>/assets/* (chemins relatifs du site)
 *  n'importe quoi d'autre → <base>/index.html (fallback page unique)
 */
function staticSiteRewrite(url: URL, base: string) {
  if (url.pathname.startsWith("/assets/")) {
    url.pathname = `${base}${url.pathname}`;
  } else {
    url.pathname = `${base}/index.html`;
  }
  return NextResponse.rewrite(url);
}

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const url = req.nextUrl.clone();

  // --- Ancienne URL Vercel → redirection permanente vers guifolio.com ---
  // (l'alias <projet>.vercel.app ne disparaît jamais tout seul : on bascule tout)
  if (host === "guifolio-zeta.vercel.app") {
    // Sites statiques → leur sous-domaine dédié
    for (const sub of Object.keys(STATIC_SITES)) {
      if (
        url.pathname === `/${sub}` ||
        url.pathname.startsWith(`/${sub}/`)
      ) {
        return NextResponse.redirect(`https://${sub}.${ROOT_DOMAIN}`, 301);
      }
    }
    const m = url.pathname.match(/^\/(p|c|cv)\/([^/]+)/);
    if (m) {
      const [, kind, sub] = m;
      const suffix =
        kind === "c"
          ? url.pathname.endsWith("/print")
            ? "/carte/impression"
            : "/carte"
          : kind === "cv"
            ? "/cv"
            : "";
      return NextResponse.redirect(
        `https://${sub}.${ROOT_DOMAIN}${suffix}${url.search}`,
        301
      );
    }
    return NextResponse.redirect(
      `https://${ROOT_DOMAIN}${url.pathname}${url.search}`,
      301
    );
  }

  // --- Wildcard subdomain : pseudo.guifolio.com uniquement ---
  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    const sub = host.replace(`.${ROOT_DOMAIN}`, "");
    if (!RESERVED.has(sub)) {
      if (STATIC_SITES[sub]) {
        return staticSiteRewrite(url, STATIC_SITES[sub]);
      }
      // /carte → carte de visite · /cv → CV PDF
      if (url.pathname === "/carte") {
        url.pathname = `/c/${sub}`;
        return NextResponse.rewrite(url);
      }
      if (url.pathname === "/carte/impression") {
        url.pathname = `/c/${sub}/print`;
        return NextResponse.rewrite(url);
      }
      if (url.pathname === "/cv") {
        url.pathname = `/cv/${sub}`;
        return NextResponse.rewrite(url);
      }
      url.pathname = `/p/${sub}${url.pathname === "/" ? "" : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }
  // Dev local : pseudo.lvh.me:3000
  if (host.includes("lvh.me")) {
    const sub = host.split(".")[0];
    if (sub !== "lvh" && !RESERVED.has(sub)) {
      if (STATIC_SITES[sub]) {
        return staticSiteRewrite(url, STATIC_SITES[sub]);
      }
      if (url.pathname === "/carte") {
        url.pathname = `/c/${sub}`;
        return NextResponse.rewrite(url);
      }
      if (url.pathname === "/carte/impression") {
        url.pathname = `/c/${sub}/print`;
        return NextResponse.rewrite(url);
      }
      if (url.pathname === "/cv") {
        url.pathname = `/cv/${sub}`;
        return NextResponse.rewrite(url);
      }
      url.pathname = `/p/${sub}${url.pathname === "/" ? "" : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // --- Site statique demandé sur le domaine racine → sous-domaine dédié ---
  if (host === ROOT_DOMAIN) {
    for (const sub of Object.keys(STATIC_SITES)) {
      if (
        url.pathname === `/${sub}` ||
        url.pathname.startsWith(`/${sub}/`)
      ) {
        return NextResponse.redirect(`https://${sub}.${ROOT_DOMAIN}`, 301);
      }
    }
  }

  // --- Session Supabase (ignorée si env non configurées : preview UI) ---
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request: req });
  }

  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  await supabase.auth.getUser();
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg).*)"],
};
