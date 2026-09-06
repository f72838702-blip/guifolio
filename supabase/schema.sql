-- GUIFOLIO — Schéma Supabase (à exécuter dans le SQL Editor)
-- Ton schéma + trigger updated_at + index slug

CREATE TABLE public.portfolios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  plan VARCHAR(20) DEFAULT 'FREE' CHECK (plan IN ('FREE', 'PRO', 'VIP')),
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE SET NULL,
  provider_tx_id VARCHAR(100) UNIQUE NOT NULL,
  provider VARCHAR(50) NOT NULL, -- 'ORANGE_MONEY' | 'MTN_MOMOPAY' | 'CHARIOW'
  amount NUMERIC NOT NULL,
  currency VARCHAR(10) DEFAULT 'GNF',
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Portfolios" ON public.portfolios
  FOR SELECT USING (is_public = true);
CREATE POLICY "Owner Edit Portfolios" ON public.portfolios
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Owner Read Transactions" ON public.transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Index pour lookup par slug (page publique + sous-domaine wildcard)
CREATE INDEX portfolios_slug_idx ON public.portfolios (slug);
CREATE INDEX transactions_user_idx ON public.transactions (user_id);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER portfolios_touch
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- NOTE : l'INSERT de transactions et l'UPDATE de plan au paiement SUCCESS
-- se font via la service role key (API routes), qui bypass RLS.
