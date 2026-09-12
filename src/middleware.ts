import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "guifolio.com";
const RESERVED = new Set(["www", "app", "api", "admin"]);

/**
 * 1. Wildcard DNS : pseudo.guifolio.com → /p/pseudo (rewrite invisible)
 * 2. Refresh de session Supabase (magic link cookies)
 */
export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  const url = req.nextUrl.clone();

  // --- Wildcard subdomain : pseudo.guifolio.com uniquement ---
  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    const sub = host.replace(`.${ROOT_DOMAIN}`, "");
    if (!RESERVED.has(sub)) {
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
