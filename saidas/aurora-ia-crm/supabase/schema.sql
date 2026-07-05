-- AURORA IA CRM — Supabase Schema
-- Run this in: Supabase Dashboard > SQL Editor

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ===========================
-- LEADS
-- ===========================
create table public.leads (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  phone       text not null unique,
  email       text,
  city        text,
  origin      text,
  status      text not null default 'novo'
              check (status in ('novo','contato','qualificado','proposta','negociacao','fechado','perdido')),
  temperature text not null default 'cold'
              check (temperature in ('hot','warm','cold')),
  score       integer not null default 0 check (score between 0 and 100),
  tags        text[] default '{}',
  notes       text,
  avatar      text,
  unread      integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index leads_status_idx   on public.leads (status);
create index leads_score_idx    on public.leads (score desc);
create index leads_phone_idx    on public.leads (phone);
create index leads_created_idx  on public.leads (created_at desc);

-- Full-text search
create index leads_name_trgm_idx on public.leads using gin (name gin_trgm_ops);

-- ===========================
-- MESSAGES
-- ===========================
create table public.messages (
  id         uuid primary key default uuid_generate_v4(),
  lead_id    uuid not null references public.leads (id) on delete cascade,
  content    text not null,
  role       text not null check (role in ('client','aurora','human')),
  status     text default 'sent' check (status in ('sent','delivered','read')),
  timestamp  timestamptz default now()
);

create index messages_lead_idx  on public.messages (lead_id, timestamp desc);

-- ===========================
-- NOTIFICATIONS
-- ===========================
create table public.notifications (
  id           uuid primary key default uuid_generate_v4(),
  type         text not null check (type in ('new_lead','hot_lead','message','score_update','closed','inactive','human_request','reply')),
  title        text not null,
  body         text not null,
  lead_id      uuid references public.leads (id) on delete set null,
  read         boolean default false,
  action_label text,
  created_at   timestamptz default now()
);

create index notif_read_idx    on public.notifications (read, created_at desc);
create index notif_lead_idx    on public.notifications (lead_id);

-- ===========================
-- AUTOMATION FLOWS
-- ===========================
create table public.automation_flows (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  trigger    text not null check (trigger in ('message_received','score_threshold','time_elapsed','tag_added')),
  active     boolean default true,
  runs       integer default 0,
  last_run   timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ===========================
-- AUTOMATION ACTIONS
-- ===========================
create table public.automation_actions (
  id          uuid primary key default uuid_generate_v4(),
  flow_id     uuid not null references public.automation_flows (id) on delete cascade,
  type        text not null check (type in ('send_message','assign_tag','update_score','notify_human')),
  config      jsonb default '{}',
  order_index integer default 0
);

create index auto_actions_flow_idx on public.automation_actions (flow_id, order_index);

-- ===========================
-- AUTOMATION NODES (visual canvas)
-- ===========================
create table public.automation_nodes (
  id          uuid primary key default uuid_generate_v4(),
  flow_id     uuid not null references public.automation_flows (id) on delete cascade,
  type        text not null check (type in ('trigger','condition','action','delay')),
  label       text not null,
  x           float default 0,
  y           float default 0,
  connections uuid[] default '{}'
);

-- ===========================
-- AI INSIGHTS (per lead)
-- ===========================
create table public.ai_insights (
  id               uuid primary key default uuid_generate_v4(),
  lead_id          uuid not null unique references public.leads (id) on delete cascade,
  confidence       integer check (confidence between 0 and 100),
  buy_probability  integer check (buy_probability between 0 and 100),
  close_chance     integer check (close_chance between 0 and 100),
  summary          text,
  intent           text,
  objections       text[] default '{}',
  next_action      text,
  updated_at       timestamptz default now()
);

-- ===========================
-- ANALYTICS SNAPSHOTS (daily)
-- ===========================
create table public.analytics_snapshots (
  id                   uuid primary key default uuid_generate_v4(),
  date                 date not null unique default current_date,
  total_leads          integer default 0,
  leads_today          integer default 0,
  active_conversations integer default 0,
  hot_leads            integer default 0,
  cold_leads           integer default 0,
  closed_sales         integer default 0,
  conversion_rate      float default 0,
  avg_response_time    float default 0,
  cpl                  float default 0,
  roi                  float default 0,
  revenue              float default 0,
  messages_sent        integer default 0,
  messages_received    integer default 0
);

-- ===========================
-- SETTINGS (per user)
-- ===========================
create table public.settings (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null unique,
  agent_name           text default 'Lucas',
  agent_title          text default 'Consultor Comercial',
  agent_company        text default 'Sety Studio',
  evolution_url        text,
  evolution_key        text,
  evolution_instance   text default 'aurora-ia',
  anthropic_key        text,
  anthropic_model      text default 'claude-sonnet-4-6',
  telegram_bot_token   text,
  telegram_chat_id     text,
  hot_lead_alerts      boolean default true,
  message_notifs       boolean default true,
  email_digest         boolean default false,
  sound_alerts         boolean default true,
  human_transfer_score integer default 80,
  created_at           timestamptz default now(),
  updated_at           timestamptz default now()
);

-- ===========================
-- TRIGGERS — updated_at auto
-- ===========================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_updated_at         before update on public.leads            for each row execute function update_updated_at();
create trigger flows_updated_at         before update on public.automation_flows for each row execute function update_updated_at();
create trigger settings_updated_at      before update on public.settings         for each row execute function update_updated_at();

-- ===========================
-- CONTACT PROFILES (filtro SDR)
-- ===========================
create table if not exists public.contact_profiles (
  phone              text primary key,
  name               text,
  contact_type       text not null default 'contato_pessoal'
                     check (contact_type in (
                       'cliente_potencial','cliente_ativo','cliente_antigo',
                       'parceiro','fornecedor','amigo','familiar','contato_pessoal','spam'
                     )),
  is_blocked         boolean not null default false,
  is_group           boolean not null default false,
  message_frequency  integer not null default 0,
  first_seen         timestamptz not null default now(),
  last_seen          timestamptz not null default now(),
  tags               text[] default '{}'
);

create index contact_profiles_type_idx on public.contact_profiles (contact_type);

-- Adicionar colunas de memória ao leads (se não existirem)
alter table public.leads
  add column if not exists last_message     text,
  add column if not exists last_message_at  timestamptz;

-- Configuração do filtro SDR na tabela settings
alter table public.settings
  add column if not exists sdr_auto_respond_types  text[]   default array['cliente_potencial','cliente_ativo','cliente_antigo'],
  add column if not exists sdr_filter_groups       boolean  default true,
  add column if not exists sdr_filter_empty        boolean  default true,
  add column if not exists sdr_filter_spam         boolean  default true,
  add column if not exists sdr_respond_unknown     boolean  default false,
  add column if not exists sdr_transfer_threshold  integer  default 80,
  add column if not exists responsible_phone       text,
  add column if not exists sdr_keywords            text[]   default array[
    'site','loja virtual','shopify','tráfego pago','google ads','meta ads',
    'landing page','automação','crm','orçamento','quanto custa','vender mais'
  ];

-- ===========================
-- ROW LEVEL SECURITY
-- ===========================
alter table public.leads               enable row level security;
alter table public.messages            enable row level security;
alter table public.notifications       enable row level security;
alter table public.automation_flows    enable row level security;
alter table public.automation_actions  enable row level security;
alter table public.automation_nodes    enable row level security;
alter table public.ai_insights         enable row level security;
alter table public.analytics_snapshots enable row level security;
alter table public.settings            enable row level security;

-- Allow authenticated users to access all rows (single-tenant CRM)
create policy "auth_all" on public.leads               for all using (auth.role() = 'authenticated');
create policy "auth_all" on public.messages            for all using (auth.role() = 'authenticated');
create policy "auth_all" on public.notifications       for all using (auth.role() = 'authenticated');
create policy "auth_all" on public.automation_flows    for all using (auth.role() = 'authenticated');
create policy "auth_all" on public.automation_actions  for all using (auth.role() = 'authenticated');
create policy "auth_all" on public.automation_nodes    for all using (auth.role() = 'authenticated');
create policy "auth_all" on public.ai_insights         for all using (auth.role() = 'authenticated');
create policy "auth_all" on public.analytics_snapshots for all using (auth.role() = 'authenticated');
create policy "auth_all" on public.settings            for all using (auth.role() = 'authenticated' and user_id = auth.uid());
create policy "auth_all" on public.contact_profiles    for all using (auth.role() = 'authenticated');

-- Service role (webhook backend) — acesso total
create policy "service_role_leads"           on public.leads            for all using (auth.jwt()->>'role' = 'service_role');
create policy "service_role_messages"        on public.messages         for all using (auth.jwt()->>'role' = 'service_role');
create policy "service_role_notifications"   on public.notifications    for all using (auth.jwt()->>'role' = 'service_role');
create policy "service_role_contact_profiles" on public.contact_profiles for all using (auth.jwt()->>'role' = 'service_role');

-- ===========================
-- WEBHOOK IDEMPOTENCY (evita resposta duplicada em retry da UAZAPI)
-- ===========================
create table if not exists public.processed_webhook_events (
  external_message_id text primary key,
  phone                text,
  status               text not null default 'processing' check (status in ('processing','done','failed')),
  created_at           timestamptz default now()
);

create index if not exists processed_webhook_events_created_idx on public.processed_webhook_events (created_at desc);

alter table public.processed_webhook_events enable row level security;
create policy "service_role_processed_webhook_events" on public.processed_webhook_events for all using (auth.jwt()->>'role' = 'service_role');
