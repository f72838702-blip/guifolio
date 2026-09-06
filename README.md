# Guifolio.com 🇬🇳

SaaS de portfolios / cartes de visite digitales pour la Guinée & l'Afrique de l'Ouest.
Upload d'un CV PDF → extraction IA → portfolio sur `vous.guifolio.com` avec bouton WhatsApp. Paiements Orange Money / MTN MoMo.

## Stack

- **Next.js 16** (App Router, Turbopack, TypeScript) + Tailwind CSS v4 + Lucide
- **Supabase** — PostgreSQL + RLS, Auth magic links
- **IA** — GLM / Kimi (API OpenAI-compatible) pour l'extraction `PDF → JSON`
- **Zustand** — éditeur temps réel (auto-save) + checkout
- **Vercel** — wildcard DNS `*.guifolio.com`, ISR sur `/p/[slug]`

## Setup

```bash
npm install
cp .env.example .env.local   # remplir les clés
```

1. **Supabase** : créer un projet, exécuter `supabase/schema.sql` dans le SQL Editor,
   copier URL + anon key + **service role key** dans `.env.local`.
   Activer le provider Email (magic link) dans Auth > Providers.
2. **LLM** : `LLM_API_KEY` + `LLM_BASE_URL` (GLM : `https://open.bigmodel.cn/api/paas/v4`,
   Kimi : `https://api.moonshot.cn/v1`). Sans clé → extraction mock en local.
3. **Paiements** : sans `CHARIOW_API_KEY`, le checkout tourne en **mode démo**
   (succès immédiat + upgrade de plan) — pratique pour tester le flow.

```bash
npm run dev
```

Tester les sous-domaines en local : `http://mon-slug.lvh.me:3000` (lvh.me résout vers 127.0.0.1).

## Architecture

| Route | Rôle |
|---|---|
| `/` | Landing + pricing (GNF) |
| `/login` | Magic link Supabase |
| `/dashboard` | Création (import CV PDF), liste, upgrade plan |
| `/editor/[id]` | Éditeur temps réel, auto-save 1.2s (Zustand) |
| `/p/[slug]` | Page publique ISR (60s) + sous-domaine wildcard |
| `/api/parse-cv` | PDF/texte → LLM → JSON validé Zod (auth requis) |
| `/api/payments/initiate` | Démarre un paiement OM/MTN via Chariow (ou démo) |
| `/api/payments/webhook` | Callback Chariow signé HMAC → upgrade plan |

## RLS

- `portfolios` : lecture publique si `is_public`, écriture owner uniquement
- `transactions` : lecture owner ; écriture exclusivement via service role (API routes)
