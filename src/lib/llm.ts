import { portfolioDataSchema, type PortfolioData } from "@/types/portfolio";

const EXTRACTION_PROMPT = `Tu es un extracteur de données de CV. À partir du texte brut d'un CV fourni, retourne STRICTEMENT un objet JSON valide (aucun texte autour, aucun markdown) avec exactement cette structure :

{
  "profile": { "full_name": "", "headline": "", "bio": "", "avatar_url": "" },
  "contacts": { "phone_raw": "", "phone_formatted": "", "whatsapp_number": "", "email": "", "location_text": "" },
  "skills": [""],
  "experiences": [{ "role": "", "company": "", "period": "", "description": "" }],
  "social_links": { "linkedin": "", "facebook": "", "github": "", "website": "" }
}

Règles :
- phone_formatted : format international E.164. Si le numéro est guinéen (indicatif 224 ou 8 chiffres locaux), préfixe +224. Ex: "+224620000000".
- whatsapp_number : uniquement des chiffres, sans + ni espaces. Ex: "224620000000".
- bio : résume le profil en 2-3 phrases à la première personne, en français, ton professionnel.
- headline : titre/métier court (ex: "Développeur Full-Stack | Conakry").
- Si une info est absente, utilise une chaîne vide ou un tableau/objet vide. Ne devine jamais.
- skills : maximum 12, les plus pertinentes.`;

type ChatResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

function extractJson(text: string): unknown {
  // Tolère un JSON entouré de ```json ... ``` ou de texte parasite
  const cleaned = text.replace(/```(?:json)?/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Pas de JSON dans la réponse LLM");
  return JSON.parse(cleaned.slice(start, end + 1));
}

export async function extractPortfolioFromText(
  cvText: string
): Promise<PortfolioData> {
  const apiKey = process.env.LLM_API_KEY;
  const baseUrl = process.env.LLM_BASE_URL ?? "https://api.z.ai/api/paas/v4";
  const model = process.env.LLM_MODEL ?? "glm-5.3-flash";

  // Mode mock si pas de clé : extraction regex basique pour développer l'UI
  if (!apiKey) {
    return mockExtraction(cvText);
  }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      messages: [
        { role: "system", content: EXTRACTION_PROMPT },
        { role: "user", content: cvText.slice(0, 16_000) },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`LLM ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as ChatResponse;
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Réponse LLM vide");

  const parsed = portfolioDataSchema.safeParse(extractJson(content));
  if (!parsed.success) {
    throw new Error(`JSON LLM invalide: ${parsed.error.issues[0]?.message}`);
  }
  return parsed.data;
}

/** Extraction heuristique locale (dev sans clé LLM) */
function mockExtraction(text: string): PortfolioData {
  const email = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/)?.[0] ?? "";
  const phoneMatch = text.match(/(\+?224)?[\s.-]?([6-7]\d[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2})/);
  const local = phoneMatch ? phoneMatch[2].replace(/[\s.-]/g, "") : "";
  const phoneFormatted = local ? `+224${local}` : "";
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const fullName = lines[0]?.slice(0, 80) ?? "";
  const headline = lines[1]?.slice(0, 100) ?? "";
  const location =
    text.match(/(?:Conakry|Dixinn|Kaloum|Matam|Ratoma|Kindia|Labé|Kankan|Nzérékoré)[^,\n]*/i)?.[0] ?? "";

  return portfolioDataSchema.parse({
    profile: {
      full_name: fullName,
      headline,
      bio: `[MOCK — configurez LLM_API_KEY pour l'extraction automatique] ${headline || fullName}`,
    },
    contacts: {
      phone_raw: phoneMatch?.[0]?.trim() ?? "",
      phone_formatted: phoneFormatted,
      whatsapp_number: local ? `224${local}` : "",
      email,
      location_text: location,
    },
    skills: [],
    experiences: [],
    social_links: {},
  });
}
