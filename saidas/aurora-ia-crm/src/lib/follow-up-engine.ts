/**
 * Follow-up automático — leads quentes sem resposta 24h+.
 * Roda via cron diário (ver src/app/api/cron/follow-up/route.ts), sem
 * depender de comando manual. Ver [[project_sety_vision_follow_up_automation]]
 * na memória — esse era o projeto pendente que essa automação implementa.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { Lead, Message } from "@/types";
import {
  getFollowUpCandidates,
  getLeadHistory,
  getContactProfile,
  saveMessage,
  updateLead,
  createCrmNotification,
} from "@/lib/lead-memory";
import { splitIntoBubbles } from "@/lib/message-formatting";
import { HUMAN_TAKEOVER_TAG } from "@/lib/contact-classifier";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
const UAZAPI_BASE_URL = process.env.UAZAPI_BASE_URL!;
const UAZAPI_INSTANCE_TOKEN = process.env.UAZAPI_INSTANCE_TOKEN!;

// Um cron por invocação processa só um lote pequeno — o cron dispara a cada
// ~20min entre 08:30-10:30 (ver vercel.json), então o espaçamento real entre
// leads vem da própria cadência de invocações, não de um sleep de minutos
// dentro da function (Vercel serverless não aguenta isso sem estourar o
// maxDuration). Ver nota no route.ts sobre essa limitação de plataforma.
const MAX_FOLLOWUPS_PER_RUN = 3;
const BLOCKED_TAGS = ["amigo", "familiar", "pessoal", "ignorar", "parceiro", "fornecedor", "sem follow-up", "não perturbe"];
const EXCLUDED_CONTACT_TYPES = ["cliente_ativo", "spam", "inadequado", "amigo", "familiar", "contato_pessoal", "parceiro", "fornecedor"];

async function sendWhatsAppMessage(phone: string, text: string): Promise<void> {
  const res = await fetch(`${UAZAPI_BASE_URL}/send/text`, {
    method: "POST",
    headers: { token: UAZAPI_INSTANCE_TOKEN, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ number: phone, text }),
  });
  if (!res.ok) console.error("[follow-up] Erro ao enviar UAZAPI:", await res.text());
}

async function sendPresence(phone: string, presence: "composing" | "paused"): Promise<void> {
  await fetch(`${UAZAPI_BASE_URL}/send/presence`, {
    method: "POST",
    headers: { token: UAZAPI_INSTANCE_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify({ number: phone, presence }),
  }).catch(() => {});
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Entre balões: 1 a 3 segundos, como pedido na correção global de estilo.
async function sendBubbles(phone: string, bubbles: string[]): Promise<void> {
  for (let i = 0; i < bubbles.length; i++) {
    await sendPresence(phone, "composing");
    await sleep(Math.round(1000 + Math.random() * 2000));
    await sendPresence(phone, "paused");
    await sendWhatsAppMessage(phone, bubbles[i]);
  }
}

const FOLLOWUP_SYSTEM_PROMPT = `Você escreve mensagens de retomada (follow-up) para leads da Sety Studio que pararam de responder no WhatsApp.

Regras obrigatórias (correção global de estilo, 2026-07-06):
- Escreva como uma pessoa real mandando mensagem no WhatsApp, nunca como robô ou e-mail corporativo.
- Uma ideia por parágrafo, no máximo 1-2 linhas e 250 caracteres cada — cada parágrafo vira uma mensagem separada. Nunca junte duas ideias no mesmo parágrafo.
- Nunca use travessão (—), nunca liste tópicos com bullet, evite parênteses em excesso.
- No máximo 1 emoji por mensagem, nunca em sequência.
- Nunca copie a mesma abertura sempre — varie ("Bom dia!", "Oi, tudo bem?", "Passando aqui rapidinho...", "Vi nossa conversa aqui...").
- Nunca pressione, nunca soe como cobrança. O tom é leve, humano, consultivo.
- Sempre entregue algo de valor ou contexto real da conversa anterior — nunca mande "só passando" ou "viu minha mensagem?" vazio.
- Se já foram enviados follow-ups anteriores sem resposta, mude a abordagem (não repita a mesma ideia) e fique ainda mais leve, sem parecer insistência.
- Nunca invente preço, prazo ou informação que não esteja no histórico da conversa.`;

interface FollowUpReportEntry {
  leadId: string;
  name: string;
  phone: string;
  interestScore: number;
  closeProbability: string;
  reason: string;
  message: string;
}

export interface FollowUpReport {
  analyzed: number;
  sent: number;
  entries: FollowUpReportEntry[];
}

function reasonForLead(lead: Lead): string {
  const hours = lead.last_message_at
    ? Math.round((Date.now() - new Date(lead.last_message_at).getTime()) / 3_600_000)
    : 0;
  return `Sem resposta há ${hours}h, status "${lead.status}", score ${lead.score}/100`;
}

function closeProbabilityLabel(score: number): string {
  if (score >= 80) return "alta (70-85%)";
  if (score >= 60) return "média-alta (45-65%)";
  if (score >= 40) return "média (25-40%)";
  return "baixa (10-20%)";
}

async function generateFollowUpMessage(lead: Lead, history: Message[]): Promise<string> {
  const historyText = history
    .slice(-12)
    .map((m) => `${m.role === "client" ? "Cliente" : "Sety"}: ${m.content}`)
    .join("\n");

  const hoursSilent = lead.last_message_at
    ? Math.round((Date.now() - new Date(lead.last_message_at).getTime()) / 3_600_000)
    : 0;

  const context = `LEAD: ${lead.name || lead.phone}
STATUS NO FUNIL: ${lead.status}
SCORE DE INTERESSE: ${lead.score}/100
HORAS SEM RESPOSTA: ${hoursSilent}
FOLLOW-UPS JÁ ENVIADOS ANTES: ${lead.followup_count ?? 0}
NOTAS/FATOS CONHECIDOS: ${lead.notes || "nenhum"}

HISTÓRICO DA CONVERSA (mais recente por último):
${historyText || "(sem histórico salvo)"}

Escreva a mensagem de follow-up de bom dia para retomar essa conversa, mencionando o contexto real acima de forma natural.`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: FOLLOWUP_SYSTEM_PROMPT,
    messages: [{ role: "user", content: context }],
  });

  return response.content[0].type === "text"
    ? response.content[0].text.trim()
    : "Bom dia! ☀️\n\nPassando pra saber se ainda faz sentido seguir com o projeto.\n\nQualquer dúvida, só me chamar 😊";
}

async function isEligible(lead: Lead): Promise<boolean> {
  if (lead.tags?.some((t) => t.toLowerCase() === HUMAN_TAKEOVER_TAG)) return false;
  if (lead.tags?.some((t) => BLOCKED_TAGS.includes(t.toLowerCase()))) return false;

  const profile = await getContactProfile(lead.phone);
  if (profile?.isBlocked) return false;
  if (profile && EXCLUDED_CONTACT_TYPES.includes(profile.contactType)) return false;

  const isHotOrWarm = lead.temperature === "hot" || lead.temperature === "warm";
  return isHotOrWarm || lead.score >= 30;
}

export async function runFollowUpAutomation(): Promise<FollowUpReport> {
  const candidates = await getFollowUpCandidates(24);

  const eligible: Lead[] = [];
  for (const lead of candidates) {
    if (await isEligible(lead)) eligible.push(lead);
  }

  const prioritized = eligible
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_FOLLOWUPS_PER_RUN);

  const entries: FollowUpReportEntry[] = [];

  for (const lead of prioritized) {
    const history = await getLeadHistory(lead.id, 15);
    const rawMessage = await generateFollowUpMessage(lead, history);
    const bubbles = splitIntoBubbles(rawMessage);

    await sendBubbles(lead.phone, bubbles);

    const fullMessage = bubbles.join("\n\n");
    await saveMessage({
      lead_id: lead.id,
      content: fullMessage,
      role: "aurora",
      timestamp: new Date().toISOString(),
      status: "sent",
    });

    await updateLead(lead.id, {
      last_followup_at: new Date().toISOString(),
      followup_count: (lead.followup_count ?? 0) + 1,
    });

    await createCrmNotification({
      type: "follow_up",
      title: `Follow-up automático — ${lead.name || lead.phone}`,
      body: fullMessage.slice(0, 150),
      lead_id: lead.id,
    });

    entries.push({
      leadId: lead.id,
      name: lead.name || lead.phone,
      phone: lead.phone,
      interestScore: Math.round(lead.score / 10),
      closeProbability: closeProbabilityLabel(lead.score),
      reason: reasonForLead(lead),
      message: fullMessage,
    });
  }

  return { analyzed: candidates.length, sent: entries.length, entries };
}
