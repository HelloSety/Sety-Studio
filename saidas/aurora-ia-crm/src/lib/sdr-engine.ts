/**
 * Aurora IA SDR Engine
 * Motor de resposta automática para qualificação de leads
 * Gera respostas contextuais via Claude API
 */

import Anthropic from "@anthropic-ai/sdk";
import type { Lead, Message } from "@/types";
import type { ContactClassification } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// ── System Prompt do SDR ──────────────────────────────────────────────────────

const SDR_SYSTEM_PROMPT = `Você é Aurora, a assistente SDR (Sales Development Representative) da Sety Studio.

A Sety Studio é uma agência digital especializada em negócios de alto valor — clínicas, advogados, imobiliárias, consórcios, energia solar. Ajudamos empresas a vender mais pela internet criando sites, anúncios e automações que transformam visitantes em clientes.

**SERVIÇOS:**
- Sites e landing pages profissionais
- Tráfego pago (Meta Ads, Google Ads)
- Branding e identidade visual
- Automação de WhatsApp e CRM
- E-commerce (Shopify, Nuvemshop)

**SEU PAPEL:**
- Qualificar leads com perguntas inteligentes
- Entender o problema/necessidade do contato
- Apresentar como a Sety resolve esse problema
- Coletar: nome, empresa, cidade, nicho, orçamento disponível
- Para leads quentes: avisar que o David vai entrar em contato

**TOM:**
- Direto, profissional e confiante
- Sem enrolação — frases curtas
- Sem emojis excessivos (máximo 1 por mensagem)
- Nunca prometa resultados milagrosos
- Nunca diga preços fixos (só colhe o interesse e passa pro humano)

**REGRAS:**
1. Nunca invente informações sobre preços ou prazos específicos
2. Se não souber algo, diga que vai verificar com a equipe
3. Para fechar interesse: "Posso pedir para o David te ligar para conversar melhor?"
4. Mensagens curtas — máximo 3 linhas por resposta
5. Sempre termine com uma pergunta ou call to action claro`;

// ── Contexto de qualificação ──────────────────────────────────────────────────

function buildQualificationContext(lead: Lead, history: Message[]): string {
  const collectedInfo: string[] = [];

  if (lead.city) collectedInfo.push(`Cidade: ${lead.city}`);
  if (lead.tags.length > 0) collectedInfo.push(`Tags/Nicho: ${lead.tags.join(", ")}`);
  if (lead.score > 0) collectedInfo.push(`Score atual: ${lead.score}/100`);
  if (lead.notes) collectedInfo.push(`Notas: ${lead.notes}`);

  const recentHistory = history.slice(-8).map((m) => ({
    role: m.role === "client" ? "user" : "assistant",
    content: m.content,
  }));

  return JSON.stringify({ collectedInfo, messageCount: history.length });
}

// ── Gerador de resposta SDR ───────────────────────────────────────────────────

export interface SdrResponse {
  message: string;
  shouldNotifyHuman: boolean;
  leadUpdate: Partial<Lead>;
  action?: "qualify" | "close" | "follow_up" | "transfer";
}

export async function generateSdrResponse(
  incomingMessage: string,
  lead: Lead,
  history: Message[],
  classification: ContactClassification
): Promise<SdrResponse> {

  const context = buildQualificationContext(lead, history);
  const isFirstMessage = history.length === 0;

  const userContext = `
CONTEXTO DO LEAD:
- Nome: ${lead.name || "Desconhecido"}
- Telefone: ${lead.phone}
- Status no funil: ${lead.status}
- Score de interesse: ${classification.intentScore}/100
- Palavras detectadas: ${classification.detectedKeywords.join(", ") || "nenhuma"}
- Informações coletadas: ${context}
- Primeira mensagem: ${isFirstMessage ? "SIM" : "NÃO"}

MENSAGEM DO CONTATO:
"${incomingMessage}"

${isFirstMessage
  ? "INSTRUÇÃO: É o primeiro contato. Cumprimente, apresente a Sety brevemente e pergunte como pode ajudar."
  : "INSTRUÇÃO: Continue a qualificação. Colete as informações que ainda faltam."}

Gere APENAS o texto da resposta. Sem explicações. Máximo 3 linhas.`;

  const conversationMessages = history.slice(-6).map((m) => ({
    role: (m.role === "client" ? "user" : "assistant") as "user" | "assistant",
    content: m.content,
  }));

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    system: SDR_SYSTEM_PROMPT,
    messages: [
      ...conversationMessages,
      { role: "user", content: userContext },
    ],
  });

  const replyText = response.content[0].type === "text"
    ? response.content[0].text.trim()
    : "Olá! Recebemos sua mensagem. Como posso ajudar?";

  // Detectar se deve transferir para humano
  const HIGH_INTENT_PHRASES = [
    "quero contratar", "quanto custa", "pode me mandar uma proposta",
    "vamos fechar", "quero começar", "tem disponibilidade",
    "me manda o contrato", "pix", "transferência",
  ];
  const shouldNotify = HIGH_INTENT_PHRASES.some((p) =>
    incomingMessage.toLowerCase().includes(p)
  ) || classification.intentScore >= 80;

  // Atualizar score do lead
  const newScore = Math.min(100, lead.score + Math.floor(classification.intentScore * 0.3));

  const leadUpdate: Partial<Lead> = {
    score: newScore,
    temperature: newScore >= 80 ? "hot" : newScore >= 40 ? "warm" : "cold",
    last_message: incomingMessage,
    last_message_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Avançar no funil conforme o score
  if (lead.status === "novo" && history.length >= 1) {
    leadUpdate.status = "contato";
  } else if (lead.status === "contato" && newScore >= 60) {
    leadUpdate.status = "qualificado";
  } else if (lead.status === "qualificado" && shouldNotify) {
    leadUpdate.status = "proposta";
  }

  return {
    message: replyText,
    shouldNotifyHuman: shouldNotify,
    leadUpdate,
    action: shouldNotify ? "transfer" : newScore >= 60 ? "close" : "qualify",
  };
}

// ── Notificação para humano ───────────────────────────────────────────────────

export async function buildHumanTransferMessage(
  lead: Lead,
  incomingMessage: string,
  score: number
): Promise<string> {
  return `🔥 *Lead Quente — Ação Necessária*

*Contato:* ${lead.name || lead.phone}
*Telefone:* ${lead.phone}
*Score:* ${score}/100
*Status:* ${lead.status}
*Tags:* ${lead.tags.join(", ") || "—"}

*Última mensagem:*
"${incomingMessage}"

Acesse o CRM para continuar o atendimento.`;
}
