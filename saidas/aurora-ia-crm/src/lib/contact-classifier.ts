/**
 * Sistema de classificação de contatos para Aurora IA SDR
 * Determina se deve responder automaticamente e como classificar o contato
 */

import type {
  ContactType,
  AutoResponseDecision,
  ContactClassification,
} from "@/types";

// ── Palavras-chave por categoria ──────────────────────────────────────────────

const COMMERCIAL_KEYWORDS = [
  // Serviços
  "site", "sites", "loja virtual", "shopify", "nuvemshop", "vtex",
  "ecommerce", "e-commerce", "landing page", "página de vendas", "hotsite",
  "webflow", "framer", "wordpress",
  // Marketing digital
  "tráfego", "trafego", "anúncio", "anuncio", "ads", "meta ads", "google ads",
  "campanha", "remarketing", "gestão de anúncios", "gestão de tráfego",
  "marketing digital", "redes sociais", "instagram", "facebook",
  // Automação
  "automação", "automacao", "whatsapp", "chatbot", "bot", "n8n", "crm",
  "atendimento automatizado", "disparo", "funil", "pipeline",
  // Precificação e interesse
  "orçamento", "orcamento", "valor", "preço", "preco", "quanto custa",
  "quero contratar", "precisando", "me interessa", "tenho interesse",
  "quero saber", "quero fazer", "quero criar", "quero melhorar",
  // Problemas/necessidades
  "vender mais", "gerar clientes", "mais vendas", "mais clientes",
  "captar leads", "crescer online", "presença digital", "divulgar",
  "aumentar faturamento", "escalar", "estrutura digital",
  // Identidade visual
  "identidade visual", "logo", "logotipo", "branding", "design",
  "material gráfico", "arte", "banner", "flyer",
];

const SPAM_KEYWORDS = [
  "promoção exclusiva", "ganhe dinheiro fácil", "renda extra sem sair",
  "oportunidade única", "clique aqui e ganhe", "você foi selecionado",
  "vaga de emprego", "emprego em casa", "bitcoin", "investimento garantido",
  "pirâmide", "multinível", "sorteio", "prêmio",
];

const PERSONAL_PATTERNS = [
  /^(oi|olá|ola|ei|eai|e aí|boa|bom dia|boa tarde|boa noite)\s*[!.?]?\s*$/i,
  /^(tudo bem|tudo bom|como vai|como você está|como vc tá)\s*[!.?]?\s*$/i,
  /^(feliz|parabéns|aniversário|felicidades)\s*/i,
];

// ── Pontuação de intenção comercial ──────────────────────────────────────────

export function calculateIntentScore(message: string): {
  score: number;
  keywords: string[];
} {
  const text = message.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const found: string[] = [];
  let score = 0;

  for (const kw of COMMERCIAL_KEYWORDS) {
    const normalized = kw.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    if (text.includes(normalized)) {
      found.push(kw);
      // Palavras de alta intenção valem mais
      if (["orcamento", "quanto custa", "preco", "valor", "quero contratar"].includes(normalized)) {
        score += 30;
      } else if (["site", "shopify", "loja virtual", "trafego", "automacao"].includes(normalized)) {
        score += 20;
      } else {
        score += 10;
      }
    }
  }

  return { score: Math.min(score, 100), keywords: found };
}

// ── Detecção de spam ──────────────────────────────────────────────────────────

function isSpam(message: string): boolean {
  const text = message.toLowerCase();
  return SPAM_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
}

// ── Detecção de conversa pessoal ─────────────────────────────────────────────

function isPersonalMessage(message: string): boolean {
  return PERSONAL_PATTERNS.some((p) => p.test(message.trim()));
}

// ── Classificador principal ───────────────────────────────────────────────────

export interface ClassificationInput {
  phone: string;
  message: string;
  senderName?: string;
  isGroup: boolean;
  conversationHistory?: Array<{ role: string; content: string }>;
  existingContactType?: ContactType;
  existingTags?: string[];
}

export function classifyContact(input: ClassificationInput): ContactClassification {
  const {
    phone,
    message,
    senderName,
    isGroup,
    conversationHistory = [],
    existingContactType,
    existingTags = [],
  } = input;

  // Grupos: nunca responder
  if (isGroup) {
    return {
      contactType: "contato_pessoal",
      decision: "ignore",
      confidence: 1.0,
      intentScore: 0,
      detectedKeywords: [],
      reasoning: "Grupos são ignorados automaticamente.",
    };
  }

  // Mensagem vazia
  if (!message.trim()) {
    return {
      contactType: existingContactType ?? "contato_pessoal",
      decision: "ignore",
      confidence: 1.0,
      intentScore: 0,
      detectedKeywords: [],
      reasoning: "Mensagem vazia ignorada.",
    };
  }

  // Spam
  if (isSpam(message)) {
    return {
      contactType: "spam",
      decision: "ignore",
      confidence: 0.9,
      intentScore: 0,
      detectedKeywords: [],
      reasoning: "Mensagem identificada como spam.",
    };
  }

  // Tags de bloqueio explícito
  const BLOCKED_TAGS = ["amigo", "familiar", "pessoal", "ignorar", "parceiro", "fornecedor"];
  if (existingTags.some((t) => BLOCKED_TAGS.includes(t.toLowerCase()))) {
    return {
      contactType: existingContactType ?? "contato_pessoal",
      decision: "ignore",
      confidence: 0.95,
      intentScore: 0,
      detectedKeywords: [],
      reasoning: `Contato marcado com tag de exclusão: ${existingTags.join(", ")}`,
    };
  }

  // Se já é cliente ativo: sempre responder
  if (existingContactType === "cliente_ativo") {
    return {
      contactType: "cliente_ativo",
      decision: "respond",
      confidence: 0.95,
      intentScore: 100,
      detectedKeywords: [],
      reasoning: "Cliente ativo — resposta automática habilitada.",
    };
  }

  // Tipos que nunca recebem resposta automática
  const NO_AUTO_RESPOND: ContactType[] = [
    "amigo", "familiar", "contato_pessoal", "parceiro", "fornecedor",
  ];
  if (existingContactType && NO_AUTO_RESPOND.includes(existingContactType)) {
    return {
      contactType: existingContactType,
      decision: "ignore",
      confidence: 0.95,
      intentScore: 0,
      detectedKeywords: [],
      reasoning: `Tipo de contato '${existingContactType}' não recebe resposta automática.`,
    };
  }

  // Análise de intenção comercial
  const { score: intentScore, keywords } = calculateIntentScore(message);

  // Analisar histórico para contexto
  let historyScore = 0;
  for (const msg of conversationHistory.slice(-5)) {
    const { score } = calculateIntentScore(msg.content);
    historyScore = Math.max(historyScore, score);
  }

  const effectiveScore = Math.max(intentScore, historyScore * 0.7);

  // Mensagem pessoal genérica sem intenção
  if (isPersonalMessage(message) && effectiveScore < 20) {
    return {
      contactType: "contato_pessoal",
      decision: "ignore",
      confidence: 0.7,
      intentScore: effectiveScore,
      detectedKeywords: keywords,
      reasoning: "Mensagem pessoal sem intenção comercial detectada.",
    };
  }

  // Decidir com base na pontuação
  if (effectiveScore >= 60) {
    const isHighIntent = effectiveScore >= 80;
    return {
      contactType: existingContactType ?? "cliente_potencial",
      decision: isHighIntent ? "notify_human" : "respond",
      confidence: 0.9,
      intentScore: effectiveScore,
      detectedKeywords: keywords,
      reasoning: isHighIntent
        ? `Alta intenção de compra (${effectiveScore}pts) — notificando responsável.`
        : `Intenção comercial detectada (${effectiveScore}pts) — respondendo automaticamente.`,
    };
  }

  if (effectiveScore >= 20) {
    return {
      contactType: existingContactType ?? "cliente_potencial",
      decision: "respond",
      confidence: 0.7,
      intentScore: effectiveScore,
      detectedKeywords: keywords,
      reasoning: `Possível interesse detectado (${effectiveScore}pts) — qualificando.`,
    };
  }

  // Sem intenção clara: não responder contatos desconhecidos
  if (!existingContactType) {
    return {
      contactType: "contato_pessoal",
      decision: "ignore",
      confidence: 0.6,
      intentScore: effectiveScore,
      detectedKeywords: [],
      reasoning: "Contato desconhecido sem intenção comercial clara.",
    };
  }

  return {
    contactType: existingContactType,
    decision: existingContactType === "cliente_antigo" ? "respond" : "ignore",
    confidence: 0.65,
    intentScore: effectiveScore,
    detectedKeywords: keywords,
    reasoning: `Sem intenção comercial clara para '${existingContactType}'.`,
  };
}

// ── Labels e cores para o UI ──────────────────────────────────────────────────

export const CONTACT_TYPE_CONFIG: Record<
  ContactType,
  { label: string; color: string; emoji: string; autoRespond: boolean }
> = {
  cliente_potencial: { label: "Potencial",     color: "text-emerald-400 bg-emerald-400/10", emoji: "🎯", autoRespond: true  },
  cliente_ativo:     { label: "Ativo",         color: "text-blue-400 bg-blue-400/10",       emoji: "⭐", autoRespond: true  },
  cliente_antigo:    { label: "Antigo",        color: "text-purple-400 bg-purple-400/10",   emoji: "🔄", autoRespond: true  },
  parceiro:          { label: "Parceiro",      color: "text-cyan-400 bg-cyan-400/10",       emoji: "🤝", autoRespond: false },
  fornecedor:        { label: "Fornecedor",    color: "text-amber-400 bg-amber-400/10",     emoji: "📦", autoRespond: false },
  amigo:             { label: "Amigo",         color: "text-pink-400 bg-pink-400/10",       emoji: "👋", autoRespond: false },
  familiar:          { label: "Familiar",      color: "text-rose-400 bg-rose-400/10",       emoji: "👨‍👩‍👧", autoRespond: false },
  contato_pessoal:   { label: "Pessoal",       color: "text-slate-400 bg-slate-400/10",     emoji: "👤", autoRespond: false },
  spam:              { label: "Spam",          color: "text-red-400 bg-red-400/10",         emoji: "🚫", autoRespond: false },
};
