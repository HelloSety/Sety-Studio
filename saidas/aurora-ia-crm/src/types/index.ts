export type LeadStatus = "novo" | "contato" | "qualificado" | "proposta" | "negociacao" | "fechado" | "perdido";
export type LeadTemp = "hot" | "warm" | "cold";

export type ContactType =
  | "cliente_potencial"
  | "cliente_ativo"
  | "cliente_antigo"
  | "parceiro"
  | "fornecedor"
  | "amigo"
  | "familiar"
  | "contato_pessoal"
  | "spam"
  | "inadequado"
  | "empresa_automatizada";

export type AutoResponseDecision = "respond" | "ignore" | "notify_human" | "respond_once" | "redirect_once";

export interface ContactClassification {
  contactType: ContactType;
  decision: AutoResponseDecision;
  confidence: number;
  intentScore: number;
  detectedKeywords: string[];
  reasoning: string;
}

export interface ContactProfile {
  phone: string;
  name?: string;
  contactType: ContactType;
  isBlocked: boolean;
  isGroup: boolean;
  messageFrequency: number;
  firstSeen: string;
  lastSeen: string;
  tags: string[];
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  origin?: string;
  status: LeadStatus;
  temperature: LeadTemp;
  score: number;
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
  last_message?: string;
  last_message_at?: string;
  last_followup_at?: string;
  followup_count?: number;
  avatar?: string;
  unread?: number;
}

export interface Message {
  id: string;
  lead_id: string;
  content: string;
  role: "client" | "aurora" | "human";
  timestamp: string;
  status?: "sent" | "delivered" | "read";
}

export interface Notification {
  id: string;
  type: "new_lead" | "hot_lead" | "reply" | "inactive" | "closed" | "human_request" | "message" | "score_update" | "follow_up";
  title: string;
  body: string;
  lead_id?: string;
  read: boolean;
  created_at: string;
  action_label?: string;
}

export interface FunnelColumn {
  id: LeadStatus;
  label: string;
  color: string;
  leads: Lead[];
}

export interface AutomationAction {
  type: "send_message" | "assign_tag" | "update_score" | "notify_human";
  config?: Record<string, string | number>;
}

export interface AutomationFlow {
  id: string;
  name: string;
  trigger: "message_received" | "score_threshold" | "time_elapsed" | "tag_added";
  active: boolean;
  runs: number;
  runs_count?: number;
  last_run?: string;
  nodes: AutomationNode[];
  actions: AutomationAction[];
}

export interface AutomationNode {
  id: string;
  type: "trigger" | "condition" | "action" | "delay";
  label: string;
  x: number;
  y: number;
  connections: string[];
}

export interface AiInsight {
  lead_id: string;
  confidence: number;
  buy_probability: number;
  close_chance: number;
  summary: string;
  intent: string;
  objections: string[];
  next_action: string;
}

export interface Analytics {
  total_leads: number;
  leads_today: number;
  active_conversations: number;
  hot_leads: number;
  cold_leads: number;
  closed_sales: number;
  conversion_rate: number;
  avg_response_time: number;
  cpl: number;
  roi: number;
  revenue: number;
}
