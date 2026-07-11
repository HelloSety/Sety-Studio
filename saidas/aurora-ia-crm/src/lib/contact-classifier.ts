/**
 * Sistema de classificação de contatos para Sety Vision SDR
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
  "site", "sites", "loja", "lojas", "loja virtual", "montar uma loja",
  "abrir uma loja", "ter uma loja", "shopify", "nuvemshop", "vtex",
  "ecommerce", "e-commerce", "landing page", "página de vendas", "hotsite",
  "webflow", "framer", "wordpress",
  // Marketing digital
  "tráfego", "trafego", "anúncio", "anuncio", "ads", "meta ads", "google ads",
  "campanha", "remarketing", "gestão de anúncios", "gestão de tráfego",
  "marketing digital", "redes sociais", "instagram", "facebook",
  // Automação
  "automação", "automacao", "whatsapp", "chatbot", "bot", "n8n", "crm",
  "atendimento automatizado", "disparo", "funil", "pipeline",
  // Sistema comercial / máquina de crescimento
  "sistema", "sistema comercial", "sistema de vendas", "máquina de vendas",
  "gestão comercial", "organizar vendas", "qualificar leads", "qualificar lead",
  "follow-up", "follow up", "agenda", "agendamento", "dashboard", "relatório",
  "relatorio", "perco lead", "perco cliente", "responder rápido", "atendimento",
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

// Sinais de urgência/prazo — não eram pontuados antes, mas indicam intenção alta
// (cliente com pressa decide mais rápido e merece prioridade de atendimento).
const URGENCY_KEYWORDS = [
  "urgente", "com urgência", "pra ontem", "o quanto antes", "hoje mesmo",
  "essa semana", "prazo apertado", "preciso rápido", "o mais rápido possível",
];

// Sinais de lead pronto pra fechar que não eram cobertos pelas keywords comerciais
// gerais (perguntar "como funciona" ou sobre pagamento é sinal de decisão próxima,
// não só interesse genérico).
const CLOSING_SIGNAL_KEYWORDS = [
  "como funciona", "vocês fazem", "vocês fazem isso", "forma de pagamento",
  "formas de pagamento", "parcelamento", "parcela", "à vista", "a vista",
  "já pesquisei", "já cotei", "outras empresas", "outros orçamentos", "comparando",
];

// Frases que pedem explicitamente atendimento humano — nunca dependem do LLM
// interpretar corretamente, porque é o momento mais sensível da conversa
// (cliente já decidiu que não quer mais falar com a automação).
export const HUMAN_HANDOFF_KEYWORDS = [
  "falar com humano", "falar com um humano", "falar com atendente",
  "falar com uma pessoa", "falar com alguém", "quero um atendente",
  "quero falar com alguém", "tem algum atendente", "quero uma pessoa real",
  "atendimento humano", "falar com o responsável", "quero falar com o dono",
  "falar com o seven", "isso é um robô", "você é um robô", "é um bot",
];

export function wantsHumanHandoff(message: string): boolean {
  const text = message.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  return HUMAN_HANDOFF_KEYWORDS.some((kw) =>
    text.includes(kw.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""))
  );
}

// Tag aplicada quando o cliente pede humano — pausa a automação pra esse lead
// até o Seven remover a tag manualmente pelo CRM.
export const HUMAN_TAKEOVER_TAG = "aguardando humano";

// Confirmação de pagamento — nunca depende do Claude "lembrar" de avisar o
// Seven; dispara notificação real e marca o lead como fechado no CRM.
const PAYMENT_CONFIRMATION_KEYWORDS = [
  "comprovante", "paguei", "fiz o pix", "pix feito", "transferi", "transferência feita",
  "pagamento feito", "pagamento realizado", "segue o comprovante", "consegui pagar", "já paguei",
];

export function wantsPaymentConfirmation(message: string): boolean {
  const text = message.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  return PAYMENT_CONFIRMATION_KEYWORDS.some((kw) =>
    text.includes(kw.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""))
  );
}

// Resposta automática de OUTRA empresa (recepção/atendimento virtual de quem foi
// contatado na prospecção) — nunca é um lead de verdade, é o bot/fluxo automático
// deles. Sem essa detecção, o SDR tratava "seja bem-vindo ao nosso atendimento..."
// como sinal comercial (a palavra "atendimento" já pontua em COMMERCIAL_KEYWORDS)
// e ficava "qualificando" o próprio bot da outra empresa, mensagem após mensagem,
// toda vez que ele mandava mais uma linha do fluxo automatizado dele.
// "meu nome é" foi removido de propósito: é ambíguo demais (humano se
// apresentando também fala assim, ver QUEM SOU EU NESSA CONVERSA no
// sdr-engine.ts) — mantinha esse bloqueio impedindo até o modelo tentar
// distinguir um humano real de um bot nesse caso específico.
const BUSINESS_AUTOREPLY_KEYWORDS = [
  "seja bem-vindo", "seja bem-vinda", "bem-vindo(a)", "bem-vindo à", "bem-vinda à",
  "em instantes", "aguarde um momento", "aguarde só um instante",
  "mensagem automática", "resposta automática", "atendimento automático",
  "horário de atendimento", "fora do nosso horário", "fora do horário de atendimento",
  "obrigado pelo contato", "em breve um de nossos atendentes", "em breve iremos retornar",
  "iremos retornar", "retornaremos em breve", "assim que possível iremos", "já vamos te atender",
  "recebemos sua mensagem", "recebemos seu contato", "informe seu nome", "informe o motivo",
  "secretária virtual", "assistente virtual", "atendimento exclusivo", "digite uma opção",
  "escolha uma opção", "menu de atendimento", "para agilizar seu atendimento",
];

export function isLikelyAutomatedBusinessReply(message: string): boolean {
  const text = message.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  return BUSINESS_AUTOREPLY_KEYWORDS.some((kw) =>
    text.includes(kw.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""))
  );
}

const SPAM_KEYWORDS = [
  "promoção exclusiva", "ganhe dinheiro fácil", "renda extra sem sair",
  "oportunidade única", "clique aqui e ganhe", "você foi selecionado",
  "vaga de emprego", "emprego em casa", "bitcoin", "investimento garantido",
  "pirâmide", "multinível", "sorteio", "prêmio",
];

// Só xingamento/ofensa clara e direta — nunca informalidade, gíria ou mensagem confusa.
// Objetivo é pegar abuso óbvio, não penalizar quem escreve mal ou brinca.
const OFFENSIVE_KEYWORDS = [
  "vai se fuder", "vai tomar no cu", "seu filho da puta", "seu merda",
  "vtnc", "vsf", "arrombado", "corno", "vagabundo",
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
      } else if (["site", "shopify", "loja virtual", "trafego", "automacao", "crm", "sistema comercial", "sistema de vendas", "maquina de vendas", "chatbot"].includes(normalized)) {
        score += 20;
      } else {
        score += 10;
      }
    }
  }

  for (const kw of URGENCY_KEYWORDS) {
    const normalized = kw.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    if (text.includes(normalized)) {
      found.push(kw);
      score += 20;
    }
  }

  for (const kw of CLOSING_SIGNAL_KEYWORDS) {
    const normalized = kw.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    if (text.includes(normalized)) {
      found.push(kw);
      score += 20;
    }
  }

  // Intenção de compra explícita (lead comprador vindo de anúncio): força score alto
  // pra ativar o MODO CLOSER (>=70) e o bot NÃO tratar quem pediu preço como lead frio.
  const BUYER_INTENT_PHRASES = [
    "quanto custa", "quanto fica", "qual o valor", "qual valor", "qual o investimento",
    "quanto custa", "qnt custa", "quero contratar", "quero fechar", "pode mandar proposta",
    "manda a proposta", "me manda a proposta", "me passa o orcamento", "me manda o orcamento",
    "tenho interesse", "quero uma demonstracao", "quero demonstracao", "quero uma proposta",
    "quais os planos", "qual o plano", "quais planos", "me passa o valor", "preco",
    "orcamento", "mensalidade",
  ];
  for (const kw of BUYER_INTENT_PHRASES) {
    const normalized = kw.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    if (text.includes(normalized)) {
      if (!found.includes(kw)) found.push(kw);
      score = Math.max(score, 80);
    }
  }

  return { score: Math.min(score, 100), keywords: found };
}

// ── Detecção de spam ──────────────────────────────────────────────────────────

function isSpam(message: string): boolean {
  const text = message.toLowerCase();
  return SPAM_KEYWORDS.some((kw) => text.includes(kw.toLowerCase()));
}

// ── Detecção de conteúdo ofensivo (xingamento/abuso claro, não gíria ou confusão) ─

function isOffensive(message: string): boolean {
  const text = message.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  return OFFENSIVE_KEYWORDS.some((kw) => text.includes(kw.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")));
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
  /** Nome salvo pelo próprio Seven no celular conectado — sinal real de contato pessoal, diferente de "já tem lead no CRM" */
  isSavedContact?: boolean;
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

  // Cliente pediu atendimento humano numa mensagem anterior — automação pausada pra esse lead
  // até o Seven remover a tag "aguardando humano" manualmente pelo CRM. Prioridade máxima:
  // vale mesmo pra cliente_ativo, porque quem pediu humano não quer mais falar com o bot.
  if (existingTags.some((t) => t.toLowerCase() === HUMAN_TAKEOVER_TAG)) {
    return {
      contactType: existingContactType ?? "cliente_potencial",
      decision: "ignore",
      confidence: 1.0,
      intentScore: 0,
      detectedKeywords: [],
      reasoning: "Lead marcado com 'aguardando humano' — automação pausada até o Seven assumir a conversa.",
    };
  }

  // Já identificado antes como resposta automática de outra empresa (recepção/bot
  // deles): nunca mais responde — evita ficar "conversando" com o bot alheio pra
  // sempre, mensagem automática após mensagem automática.
  if (existingContactType === "empresa_automatizada") {
    return {
      contactType: "empresa_automatizada",
      decision: "ignore",
      confidence: 0.9,
      intentScore: 0,
      detectedKeywords: [],
      reasoning: "Contato já identificado como atendimento automatizado de outra empresa — não responde mais.",
    };
  }

  // Primeira vez que detecta um fluxo automático de outra empresa (ex: prospecção
  // ativa batendo na recepção virtual de uma clínica): responde UMA única vez
  // pedindo pra ser encaminhado ao responsável, e nunca mais continua sozinho.
  if (isLikelyAutomatedBusinessReply(message)) {
    return {
      contactType: "empresa_automatizada",
      decision: "redirect_once",
      confidence: 0.8,
      intentScore: 0,
      detectedKeywords: [],
      reasoning: "Mensagem com indícios de atendimento automatizado de outra empresa — redirecionando uma única vez e pausando.",
    };
  }

  // Conteúdo ofensivo/abusivo — já foi marcado antes como inadequado: não responde mais, nem uma vez
  if (existingContactType === "inadequado") {
    return {
      contactType: "inadequado",
      decision: "ignore",
      confidence: 0.9,
      intentScore: 0,
      detectedKeywords: [],
      reasoning: "Contato já classificado como inadequado — automação encerrada para essa conversa.",
    };
  }

  // Ofensa clara pela primeira vez: responde educadamente UMA vez, depois encerra a automação
  if (isOffensive(message)) {
    return {
      contactType: "inadequado",
      decision: "respond_once",
      confidence: 0.75,
      intentScore: 0,
      detectedKeywords: [],
      reasoning: "Conteúdo ofensivo detectado — respondendo uma vez de forma educada e encerrando automação.",
    };
  }

  // Tag de escape manual: Seven pode reativar automação pra qualquer contato salvo
  // (ex: cliente antigo que voltou a falar) sem precisar remover da agenda.
  const AUTOMATION_OVERRIDE_TAGS = ["automação ativa", "automacao ativa", "lead"];
  const hasAutomationOverride = existingTags.some((t) =>
    AUTOMATION_OVERRIDE_TAGS.includes(t.toLowerCase())
  );

  // Se já é cliente ativo: sempre responder (verifica antes do bloqueio, tem prioridade)
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

  if (!hasAutomationOverride) {
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

    // Tipos que nunca recebem resposta automática
    const NO_AUTO_RESPOND: ContactType[] = [
      "amigo", "familiar", "contato_pessoal", "parceiro", "fornecedor", "inadequado",
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

    // Contato salvo no celular conectado (nome real da agenda, via GET /contact/info da UAZAPI —
    // nunca pushName/displayName de perfil, que qualquer um pode definir sem estar na sua agenda).
    // Vale mesmo se já existir um contactType antigo (ex: classificado como lead antes dessa
    // regra existir) — só não bloqueia se for cliente_ativo (já tratado acima) ou tiver a tag
    // de exceção (já tratado pelo hasAutomationOverride).
    if (input.isSavedContact) {
      return {
        contactType: "contato_pessoal",
        decision: "ignore",
        confidence: 0.9,
        intentScore: 0,
        detectedKeywords: [],
        reasoning: "Número salvo nos contatos do WhatsApp conectado — tratado como pessoal, não como lead.",
      };
    }
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

  // Mensagem pessoal genérica (ex: "oi", "tudo bem?") de contato JÁ conhecido como pessoal/amigo/etc:
  // já foi filtrado acima pelo NO_AUTO_RESPOND. Se chegou até aqui, é contato novo ou já é lead —
  // nunca ignorar só por parecer saudação, pode ser lead de anúncio esquentando a conversa.
  if (isPersonalMessage(message) && effectiveScore < 20 && existingContactType) {
    return {
      contactType: existingContactType,
      decision: "respond",
      confidence: 0.6,
      intentScore: effectiveScore,
      detectedKeywords: keywords,
      reasoning: "Saudação genérica de lead já conhecido — respondendo para manter a conversa.",
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

  // Sem intenção clara mas é contato NOVO/desconhecido (nunca salvo antes): responder sempre.
  // Pode ser lead de anúncio abrindo a conversa com algo genérico — não deixar sem resposta.
  if (!existingContactType) {
    return {
      contactType: "cliente_potencial",
      decision: "respond",
      confidence: 0.6,
      intentScore: effectiveScore,
      detectedKeywords: keywords,
      reasoning: "Contato novo/desconhecido — respondendo automaticamente para não perder lead.",
    };
  }

  // Chegou até aqui = já passou por todo bloqueio legítimo (grupo, spam, ofensa repetida,
  // tag de exclusão, tipo pessoal/amigo/parceiro/fornecedor, contato salvo pessoal).
  // Não existe mais "ignore" por falta de palavra-chave: quem decide o teor da resposta
  // é o próprio Claude no sdr-engine (que entende intenção de verdade), não uma lista fixa.
  // Silêncio no meio de uma conversa é sempre pior do que responder algo de baixa confiança —
  // foi exatamente a falta dessa regra que causou o bug de "parou do meio da conversa".
  return {
    contactType: existingContactType,
    decision: "respond",
    confidence: 0.55,
    intentScore: effectiveScore,
    detectedKeywords: keywords,
    reasoning: `Sem palavra-chave exata para '${existingContactType}', mas nenhuma mensagem válida fica sem resposta — deixando o Claude interpretar o contexto.`,
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
  inadequado:        { label: "Inadequado",    color: "text-orange-400 bg-orange-400/10",   emoji: "🚩", autoRespond: false },
  empresa_automatizada: { label: "Bot de outra empresa", color: "text-gray-400 bg-gray-400/10", emoji: "🤖", autoRespond: false },
};
