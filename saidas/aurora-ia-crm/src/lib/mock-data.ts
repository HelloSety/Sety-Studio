import type { Lead, Message, Notification, FunnelColumn, AutomationFlow, Analytics, AutomationAction } from "@/types";

export const mockLeads: Lead[] = [
  { id: "1", name: "Rafael Mendes", phone: "5511987654321", city: "São Paulo", origin: "Instagram", status: "qualificado", temperature: "hot", score: 87, tags: ["shopify", "urgente"], created_at: "2026-06-20T10:00:00Z", updated_at: "2026-06-22T14:30:00Z", last_message: "Quero fechar ainda essa semana!", last_message_at: "2026-06-22T14:30:00Z", unread: 3 },
  { id: "2", name: "Camila Torres", phone: "5521976543210", city: "Rio de Janeiro", origin: "WhatsApp", status: "proposta", temperature: "hot", score: 92, tags: ["nuvemshop", "moda"], created_at: "2026-06-19T09:00:00Z", updated_at: "2026-06-22T13:45:00Z", last_message: "Podem enviar a proposta?", last_message_at: "2026-06-22T13:45:00Z", unread: 1 },
  { id: "3", name: "Bruno Alves", phone: "5531965432109", city: "Belo Horizonte", origin: "Google", status: "contato", temperature: "warm", score: 55, tags: ["landing-page"], created_at: "2026-06-21T11:00:00Z", updated_at: "2026-06-22T12:00:00Z", last_message: "Tenho interesse em saber mais", last_message_at: "2026-06-22T12:00:00Z" },
  { id: "4", name: "Larissa Souza", phone: "5541954321098", city: "Curitiba", origin: "Indicação", status: "negociacao", temperature: "hot", score: 78, tags: ["shopify", "esportes"], created_at: "2026-06-18T08:00:00Z", updated_at: "2026-06-22T11:30:00Z", last_message: "Consigo parcelar em 3x?", last_message_at: "2026-06-22T11:30:00Z", unread: 2 },
  { id: "5", name: "Diego Ferreira", phone: "5551943210987", city: "Porto Alegre", origin: "TikTok", status: "novo", temperature: "cold", score: 22, tags: [], created_at: "2026-06-22T09:00:00Z", updated_at: "2026-06-22T09:05:00Z", last_message: "Oi", last_message_at: "2026-06-22T09:05:00Z" },
  { id: "6", name: "Fernanda Lima", phone: "5561932109876", city: "Brasília", origin: "Instagram", status: "fechado", temperature: "hot", score: 100, tags: ["shopify", "saude"], created_at: "2026-06-15T10:00:00Z", updated_at: "2026-06-22T10:00:00Z", last_message: "Perfeito! Vou fazer o pix agora.", last_message_at: "2026-06-22T10:00:00Z" },
  { id: "7", name: "Marcos Costa", phone: "5571921098765", city: "Salvador", origin: "Meta Ads", status: "qualificado", temperature: "warm", score: 61, tags: ["nuvemshop"], created_at: "2026-06-21T14:00:00Z", updated_at: "2026-06-22T09:30:00Z", last_message: "Tem exemplo de loja que vocês fizeram?", last_message_at: "2026-06-22T09:30:00Z" },
];

export const mockMessages: Message[] = [
  { id: "1", lead_id: "1", content: "Oi, vi vocês no Instagram! Faço loja virtual?", role: "client", timestamp: "2026-06-22T10:00:00Z" },
  { id: "2", lead_id: "1", content: "Olá Rafael! 😊 Sim, criamos lojas profissionais no Shopify e Nuvemshop. Qual é o seu nicho?", role: "aurora", timestamp: "2026-06-22T10:00:30Z" },
  { id: "3", lead_id: "1", content: "Vendo suplementos e roupas fitness.", role: "client", timestamp: "2026-06-22T10:02:00Z" },
  { id: "4", lead_id: "1", content: "Perfeito! Temos experiência com esse nicho. Já tem um site hoje ou vai começar do zero?", role: "aurora", timestamp: "2026-06-22T10:02:15Z" },
  { id: "5", lead_id: "1", content: "Do zero. Quero algo profissional com integração de pagamento.", role: "client", timestamp: "2026-06-22T10:05:00Z" },
  { id: "6", lead_id: "1", content: "Entendido! Para uma loja completa com catálogo fitness, integração de pagamento e layout personalizado, o investimento é a partir de R$ 2.500. Tem ideia de quantos produtos vai vender inicialmente?", role: "aurora", timestamp: "2026-06-22T10:05:20Z" },
  { id: "7", lead_id: "1", content: "Uns 30-40 produtos. Quando conseguem entregar?", role: "client", timestamp: "2026-06-22T10:08:00Z" },
  { id: "8", lead_id: "1", content: "Em 10 a 15 dias úteis após o briefing. Você tem urgência para lançar?", role: "aurora", timestamp: "2026-06-22T10:08:15Z" },
  { id: "9", lead_id: "1", content: "Quero fechar ainda essa semana!", role: "client", timestamp: "2026-06-22T14:30:00Z" },
];

export const mockNotifications: Notification[] = [
  { id: "1", type: "hot_lead", title: "Lead Quente Detectado", body: "Rafael Mendes — Score 87. Quer fechar essa semana!", lead_id: "1", read: false, created_at: "2026-06-22T14:30:00Z", action_label: "Ver conversa" },
  { id: "2", type: "hot_lead", title: "Lead Quente Detectado", body: "Camila Torres — Score 92. Solicitou proposta.", lead_id: "2", read: false, created_at: "2026-06-22T13:45:00Z", action_label: "Assumir lead" },
  { id: "3", type: "new_lead", title: "Novo Lead", body: "Diego Ferreira entrou via TikTok.", lead_id: "5", read: false, created_at: "2026-06-22T09:05:00Z" },
  { id: "4", type: "closed", title: "Venda Fechada!", body: "Fernanda Lima — Shopify Premium R$ 4.500", lead_id: "6", read: true, created_at: "2026-06-22T10:00:00Z" },
  { id: "5", type: "inactive", title: "Lead Parado há 24h", body: "Bruno Alves não responde desde ontem.", lead_id: "3", read: true, created_at: "2026-06-21T12:00:00Z", action_label: "Enviar follow-up" },
  { id: "6", type: "human_request", title: "Transferência Solicitada", body: "Larissa Souza pediu falar com humano.", lead_id: "4", read: false, created_at: "2026-06-22T11:30:00Z", action_label: "Assumir conversa" },
  { id: "7", type: "message", title: "Nova Mensagem", body: "Marcos Costa: 'Tem exemplo de loja que vocês fizeram?'", lead_id: "7", read: false, created_at: "2026-06-22T09:30:00Z", action_label: "Responder" },
  { id: "8", type: "score_update", title: "Score Atualizado", body: "Larissa Souza subiu para 78 pontos.", lead_id: "4", read: true, created_at: "2026-06-22T11:00:00Z" },
];

export const mockFunnelColumns: FunnelColumn[] = [
  { id: "novo", label: "Novo Lead", color: "#6B7280", leads: [mockLeads[4]] },
  { id: "contato", label: "Contato Iniciado", color: "#3B82F6", leads: [mockLeads[2]] },
  { id: "qualificado", label: "Qualificado", color: "#8B5CF6", leads: [mockLeads[0], mockLeads[6]] },
  { id: "proposta", label: "Proposta Enviada", color: "#F59E0B", leads: [mockLeads[1]] },
  { id: "negociacao", label: "Negociação", color: "#F97316", leads: [mockLeads[3]] },
  { id: "fechado", label: "Fechado", color: "#10B981", leads: [mockLeads[5]] },
  { id: "perdido", label: "Perdido", color: "#EF4444", leads: [] },
];

export const mockAutomations: AutomationFlow[] = [
  {
    id: "1", name: "Boas-vindas", trigger: "message_received", active: true, runs: 247, runs_count: 247,
    last_run: "2026-06-22T14:00:00Z", nodes: [],
    actions: [
      { type: "send_message", config: { message: "Olá! Sou o Lucas da Sety Studio. Como posso ajudar você hoje?" } },
      { type: "assign_tag", config: { tag: "novo-lead" } },
    ],
  },
  {
    id: "2", name: "Follow-up 24h", trigger: "time_elapsed", active: true, runs: 89, runs_count: 89,
    last_run: "2026-06-22T10:00:00Z", nodes: [],
    actions: [
      { type: "send_message", config: { message: "Oi! Passando para ver se ainda tem interesse em criar sua loja virtual." } },
      { type: "update_score", config: { delta: -5 } },
    ],
  },
  {
    id: "3", name: "Recuperação 72h", trigger: "time_elapsed", active: false, runs: 34, runs_count: 34,
    last_run: "2026-06-20T12:00:00Z", nodes: [],
    actions: [
      { type: "send_message", config: { message: "Última tentativa: temos uma condição especial esta semana!" } },
      { type: "assign_tag", config: { tag: "reengajamento" } },
    ],
  },
  {
    id: "4", name: "Alerta Lead Quente", trigger: "score_threshold", active: true, runs: 12, runs_count: 12,
    last_run: "2026-06-22T10:05:00Z", nodes: [],
    actions: [
      { type: "notify_human", config: { channel: "telegram" } },
      { type: "assign_tag", config: { tag: "lead-quente" } },
    ],
  },
];

export const mockAnalytics: Analytics = {
  total_leads: 247,
  leads_today: 12,
  active_conversations: 34,
  hot_leads: 18,
  cold_leads: 89,
  closed_sales: 23,
  conversion_rate: 9.3,
  avg_response_time: 1.4,
  cpl: 18.5,
  roi: 340,
  revenue: 87500,
};

export const mockChartData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
  leads: Math.floor(Math.random() * 20) + 3,
  conversoes: Math.floor(Math.random() * 5) + 1,
  enviadas: Math.floor(Math.random() * 80) + 20,
  recebidas: Math.floor(Math.random() * 60) + 15,
}));
