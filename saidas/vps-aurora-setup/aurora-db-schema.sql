-- ============================================================
-- AURORA IA CRM — Schema do Banco de Dados
-- Execute via Supabase SQL Editor ou diretamente no PostgreSQL
-- ============================================================

-- ── Enum types ──────────────────────────────────────────────

CREATE TYPE lead_status AS ENUM (
    'novo', 'contato', 'qualificado', 'proposta', 'negociacao', 'fechado', 'perdido'
);

CREATE TYPE lead_temp AS ENUM ('hot', 'warm', 'cold');

CREATE TYPE contact_type AS ENUM (
    'cliente_potencial', 'cliente_ativo', 'cliente_antigo',
    'parceiro', 'fornecedor', 'amigo', 'familiar', 'contato_pessoal', 'spam'
);

CREATE TYPE message_role AS ENUM ('client', 'aurora', 'human');

-- ── Leads ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS leads (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    phone       TEXT NOT NULL UNIQUE,
    email       TEXT,
    city        TEXT,
    origin      TEXT,
    status      lead_status NOT NULL DEFAULT 'novo',
    temperature lead_temp   NOT NULL DEFAULT 'cold',
    score       INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    tags        TEXT[] NOT NULL DEFAULT '{}',
    notes       TEXT,
    avatar      TEXT,
    unread      INTEGER NOT NULL DEFAULT 0,
    last_message     TEXT,
    last_message_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_phone    ON leads(phone);
CREATE INDEX idx_leads_status   ON leads(status);
CREATE INDEX idx_leads_score    ON leads(score DESC);
CREATE INDEX idx_leads_updated  ON leads(updated_at DESC);

-- ── Mensagens ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS messages (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id   UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    content   TEXT NOT NULL,
    role      message_role NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status    TEXT DEFAULT 'sent'
);

CREATE INDEX idx_messages_lead_id  ON messages(lead_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp DESC);

-- ── Perfis de contato ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS contact_profiles (
    phone              TEXT PRIMARY KEY,
    name               TEXT,
    contact_type       contact_type NOT NULL DEFAULT 'contato_pessoal',
    is_blocked         BOOLEAN NOT NULL DEFAULT FALSE,
    is_group           BOOLEAN NOT NULL DEFAULT FALSE,
    message_frequency  INTEGER NOT NULL DEFAULT 0,
    first_seen         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tags               TEXT[] NOT NULL DEFAULT '{}'
);

-- ── Notificações ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type        TEXT NOT NULL,
    title       TEXT NOT NULL,
    body        TEXT NOT NULL,
    lead_id     UUID REFERENCES leads(id) ON DELETE SET NULL,
    read        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    action_label TEXT
);

CREATE INDEX idx_notifications_read       ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ── Configurações do sistema ─────────────────────────────────

CREATE TABLE IF NOT EXISTS system_config (
    key   TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Config padrão do filtro SDR
INSERT INTO system_config (key, value) VALUES
(
    'sdr_filter',
    '{
        "autoRespondTypes": ["cliente_potencial","cliente_ativo","cliente_antigo"],
        "filterGroups": true,
        "filterEmpty": true,
        "filterSpam": true,
        "respondNewUnknown": false,
        "transferThreshold": 80,
        "responsiblePhone": "",
        "keywords": ["site","loja virtual","shopify","tráfego pago","google ads","meta ads",
                     "landing page","automação","crm","orçamento","quanto custa","vender mais"]
    }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- ── Função para updated_at automático ───────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── RLS — Row Level Security (para Supabase) ─────────────────
-- Desabilitar RLS para service role (backend), habilitar para anon (frontend)

ALTER TABLE leads               ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications       ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_config       ENABLE ROW LEVEL SECURITY;

-- Políticas: acesso total para service_role (backend/webhook)
-- O frontend usa a anon key com as políticas abaixo

CREATE POLICY "service_role_all_leads"            ON leads             FOR ALL USING (true);
CREATE POLICY "service_role_all_messages"         ON messages          FOR ALL USING (true);
CREATE POLICY "service_role_all_contact_profiles" ON contact_profiles  FOR ALL USING (true);
CREATE POLICY "service_role_all_notifications"    ON notifications     FOR ALL USING (true);
CREATE POLICY "service_role_all_system_config"    ON system_config     FOR ALL USING (true);

-- ── Views úteis ──────────────────────────────────────────────

CREATE OR REPLACE VIEW leads_summary AS
SELECT
    l.*,
    COUNT(m.id) as total_messages,
    MAX(m.timestamp) as last_activity
FROM leads l
LEFT JOIN messages m ON m.lead_id = l.id
GROUP BY l.id;

-- ============================================================
-- VERIFICAÇÃO
-- ============================================================
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

\echo 'Schema Aurora IA criado com sucesso!'
