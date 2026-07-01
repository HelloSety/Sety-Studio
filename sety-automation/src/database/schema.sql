-- ── Sety Studio — Schema Supabase ────────────────────────────────────────────
-- Rodar no SQL Editor do Supabase

-- ── Leads ─────────────────────────────────────────────────────────────────────
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  phone TEXT NOT NULL UNIQUE,
  name TEXT,
  instagram TEXT,
  city TEXT,
  nicho TEXT,
  tipo_projeto TEXT,
  situacao_atual TEXT,
  num_produtos TEXT,
  urgencia TEXT,
  orcamento TEXT,
  plataforma TEXT,
  score INTEGER DEFAULT 0,
  classification TEXT DEFAULT 'COLD' CHECK (classification IN ('HOT', 'WARM', 'COLD')),
  stage TEXT DEFAULT 'qualification' CHECK (stage IN ('qualification','portfolio','proposal','negotiation','closed','onboarding','delivered')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new','active','proposal_sent','won','lost')),
  origem TEXT DEFAULT 'whatsapp',
  last_contact TIMESTAMPTZ DEFAULT now(),
  followup_1d BOOLEAN DEFAULT false,
  followup_3d BOOLEAN DEFAULT false,
  followup_7d BOOLEAN DEFAULT false,
  followup_15d BOOLEAN DEFAULT false,
  followup_30d BOOLEAN DEFAULT false,
  human_requested BOOLEAN DEFAULT false,
  notes TEXT
);

-- ── Conversas ─────────────────────────────────────────────────────────────────
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL
);

CREATE INDEX idx_conversations_phone ON conversations(phone);
CREATE INDEX idx_conversations_lead_id ON conversations(lead_id);

-- ── Propostas ─────────────────────────────────────────────────────────────────
CREATE TABLE proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  value DECIMAL(10,2),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent','viewed','accepted','rejected')),
  sent_at TIMESTAMPTZ DEFAULT now()
);

-- ── Projetos ──────────────────────────────────────────────────────────────────
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  name TEXT,
  stage TEXT DEFAULT 'briefing' CHECK (stage IN ('briefing','development','review','corrections','done','delivered')),
  deadline DATE,
  value DECIMAL(10,2),
  paid BOOLEAN DEFAULT false,
  logo_url TEXT,
  domain TEXT,
  platform TEXT,
  delivered_at TIMESTAMPTZ,
  notes TEXT
);

-- ── Pagamentos ────────────────────────────────────────────────────────────────
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  lead_id UUID REFERENCES leads(id),
  project_id UUID REFERENCES projects(id),
  amount DECIMAL(10,2),
  method TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','failed','refunded')),
  gateway_id TEXT,
  approved_at TIMESTAMPTZ
);

-- ── Função: atualizar updated_at ──────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── View: Dashboard ───────────────────────────────────────────────────────────
CREATE VIEW dashboard AS
SELECT
  COUNT(*) FILTER (WHERE created_at > now() - interval '30 days') AS leads_30d,
  COUNT(*) FILTER (WHERE classification = 'HOT') AS hot_leads,
  COUNT(*) FILTER (WHERE classification = 'WARM') AS warm_leads,
  COUNT(*) FILTER (WHERE classification = 'COLD') AS cold_leads,
  COUNT(*) FILTER (WHERE status = 'proposal_sent') AS proposals_sent,
  COUNT(*) FILTER (WHERE status = 'won') AS won,
  AVG(score) AS avg_score
FROM leads;

-- ── RLS (Row Level Security) ──────────────────────────────────────────────────
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Política: service_role tem acesso total
CREATE POLICY "service_role_all" ON leads FOR ALL TO service_role USING (true);
CREATE POLICY "service_role_all" ON conversations FOR ALL TO service_role USING (true);
CREATE POLICY "service_role_all" ON proposals FOR ALL TO service_role USING (true);
CREATE POLICY "service_role_all" ON projects FOR ALL TO service_role USING (true);
CREATE POLICY "service_role_all" ON payments FOR ALL TO service_role USING (true);

-- ── Função: upsert_lead ───────────────────────────────────────────────────────
-- Garante idempotência: retorna lead existente ou cria novo
CREATE OR REPLACE FUNCTION upsert_lead(p_phone TEXT, p_name TEXT DEFAULT NULL)
RETURNS leads AS $$
DECLARE
  v_lead leads;
BEGIN
  INSERT INTO leads (phone, name)
  VALUES (p_phone, p_name)
  ON CONFLICT (phone) DO UPDATE
    SET last_contact = now()
  RETURNING * INTO v_lead;
  RETURN v_lead;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION upsert_lead TO service_role;

-- ── View: Leads HOT ───────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW hot_leads AS
SELECT
  id, phone, name, nicho, tipo_projeto, score, classification,
  stage, status, urgencia, orcamento, last_contact
FROM leads
WHERE classification = 'HOT'
ORDER BY score DESC, last_contact DESC;
