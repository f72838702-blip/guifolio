import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";
import { extractPortfolioFromText } from "@/lib/llm";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60; // Vercel Hobby : jusqu'à 60s

const MAX_PDF_BYTES = 5 * 1024 * 1024; // 5 Mo
const MAX_TEXT_CHARS = 30_000;

export async function POST(req: NextRequest) {
  // Auth obligatoire : l'extraction coûte des tokens LLM
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const contentType = req.headers.get("content-type") ?? "";
    let cvText = "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
      }
      if (file.size > MAX_PDF_BYTES) {
        return NextResponse.json(
          { error: "PDF trop lourd (max 5 Mo)" },
          { status: 413 }
        );
      }
      const buffer = new Uint8Array(await file.arrayBuffer());
      const { text } = await extractText(buffer, { mergePages: true });
      cvText = text;
    } else {
      const body = (await req.json()) as { text?: string };
      cvText = body.text ?? "";
    }

    cvText = cvText.trim();
    if (cvText.length < 40) {
      return NextResponse.json(
        { error: "Texte de CV trop court ou illisible" },
        { status: 422 }
      );
    }

    const portfolio = await extractPortfolioFromText(
      cvText.slice(0, MAX_TEXT_CHARS)
    );
    return NextResponse.json({ data: portfolio });
  } catch (err) {
    console.error("[parse-cv]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur d'extraction" },
      { status: 500 }
    );
  }
}
