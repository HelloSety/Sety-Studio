/**
 * Biblioteca de prova social — só materiais reais hospedados em setystudio.com.br.
 * Nunca inventar case, depoimento ou resultado que não esteja aqui.
 *
 * ATENÇÃO: a reestruturação do site em 2026-07-13 mudou a estrutura de pastas
 * públicas (removeu o prefixo /uploads/) e quebrou FEEDBACK_IMAGES e RESULT_IMAGES
 * (404 ao vivo). Corrigido nesta data. PORTFOLIO_BY_NICHE (streetwear/esportivo/
 * importados) segue quebrado — os arquivos de mockup não existem mais no site
 * novo, que pivotou pro portfólio de nichos alto-ticket (advocacia/dental/solar).
 * Precisa reenviar os mockups esportivos originais pra restaurar essa categoria.
 */

const DOMAIN = "https://setystudio.com.br";

export const PORTFOLIO_BY_NICHE: Record<string, string[]> = {
  streetwear: [
    `${DOMAIN}/portfolio/SITES%20ESPORTIVO/UNDERZ%20STORE/Macbook-Air-1560x975.png`,
    `${DOMAIN}/portfolio/SITES%20ESPORTIVO/MANTOPRO/Macbook-Air-1560.0001220703125x975.0000610351562.png`,
  ],
  esportivo: [
    `${DOMAIN}/portfolio/SITES%20ESPORTIVO/LOJA%20VANCIR%20SPORTS/Macbook-Air-1560x975.png`,
    `${DOMAIN}/portfolio/SITES%20ESPORTIVO/EMPORIO%20BELEM/Macbook-Air-1560x975.png`,
    `${DOMAIN}/portfolio/SITES%20ESPORTIVO/SPORTKINGS/Macbook-Air-1560x975.png`,
  ],
  importados: [`${DOMAIN}/portfolio/SITES%20ESPORTIVO/LULU%20IMPORTS/Macbook-Air-1560x975.png`],
};

const FEEDBACK_IMAGES = [
  `${DOMAIN}/feedback/feedback-1.jpg`,
  `${DOMAIN}/feedback/feedback-2.jpg`,
  `${DOMAIN}/feedback/feedback-3.jpg`,
  `${DOMAIN}/feedback/feedback-4.jpg`,
  `${DOMAIN}/feedback/feedback-5.jpg`,
  `${DOMAIN}/feedback/feedback-6.jpg`,
];

const RESULT_IMAGES = [
  `${DOMAIN}/resultados/Screenshot_43.png`,
  `${DOMAIN}/resultados/WhatsApp%20Image%202026-04-09%20at%201.26.12%20PM.jpeg`,
  `${DOMAIN}/resultados/WhatsApp%20Image%202026-04-15%20at%2012.22.02%20PM.jpeg`,
  `${DOMAIN}/resultados/WhatsApp%20Image%202026-04-16%20at%205.04.34%20PM.jpeg`,
];

const NICHE_KEYWORDS: Record<string, string[]> = {
  streetwear: ["streetwear", "oversized", "moda urbana", "moda street", "hypebeast"],
  esportivo: ["esportivo", "esporte", "time de futebol", "uniforme", "camisa de time", "moda esportiva"],
  importados: ["importado", "importados", "dropshipping", "produto importado"],
};

export function inferNiche(text: string): string | null {
  const t = text.toLowerCase();
  for (const [niche, keywords] of Object.entries(NICHE_KEYWORDS)) {
    if (keywords.some((k) => t.includes(k))) return niche;
  }
  return null;
}

const PORTFOLIO_TRIGGERS = [
  "já fizeram", "ja fizeram", "tem exemplo", "como fica", "loja parecida",
  "loja igual", "algum caso", "case parecido", "algum projeto", "já criaram loja",
];
const FEEDBACK_TRIGGERS = [
  "funciona mesmo", "tenho medo", "medo de pagar", "não confio", "nao confio",
  "é confiável", "e confiavel", "posso confiar", "tem depoimento", "avaliação de cliente",
];
const RESULT_TRIGGERS = ["tem resultado", "dá resultado", "da resultado", "vale a pena", "compensa"];

export type ProofTrigger = "portfolio" | "feedback" | "resultado";

// Detecção determinística, não depende do Claude decidir sozinho quando mostrar prova.
export function detectProofTrigger(text: string): ProofTrigger | null {
  const t = text.toLowerCase();
  if (PORTFOLIO_TRIGGERS.some((k) => t.includes(k))) return "portfolio";
  if (FEEDBACK_TRIGGERS.some((k) => t.includes(k))) return "feedback";
  if (RESULT_TRIGGERS.some((k) => t.includes(k))) return "resultado";
  return null;
}

// Nunca mais de 2 imagens por vez (evita bombardear o WhatsApp do cliente).
export function pickProofImages(trigger: ProofTrigger, niche: string | null): string[] {
  if (trigger === "portfolio") {
    const list = (niche && PORTFOLIO_BY_NICHE[niche]) || PORTFOLIO_BY_NICHE.esportivo;
    return list.slice(0, 2);
  }
  if (trigger === "feedback") return FEEDBACK_IMAGES.slice(0, 2);
  return RESULT_IMAGES.slice(0, 2);
}

/**
 * Dashboard de demonstração da Sety Vision (modo comercial) — ver
 * saidas/sety-vision-next/app/(dashboard)/demo/. Enviado só quando o cliente
 * pede pra ver a plataforma/sistema/painel funcionando, nunca de graça em
 * toda conversa (gatilho determinístico, igual ao de prova social acima).
 */
export const DEMO_LINK = "https://sety-vision-next.vercel.app/demo";

const DEMO_TRIGGERS = [
  "tem demonstração", "tem demonstracao", "tem demo", "tem alguma demonstração",
  "posso ver como funciona", "posso ver o painel", "posso ver o sistema", "posso ver a plataforma",
  "quero ver o crm", "quero ver a plataforma", "quero ver o sistema", "quero ver o painel", "quero ver o dashboard",
  "como é a plataforma", "como e a plataforma", "tem algum painel", "tem um painel",
  // Aceite da oferta de demo feita pelo SDR ("posso te mostrar a plataforma?" → cliente aceita)
  "pode mostrar", "pode me mostrar", "quero ver sim", "pode mostrar sim", "quero ver a demo",
  "manda a demo", "quero ver a demonstração", "quero ver a demonstracao", "quero conhecer a plataforma",
];

export function detectDemoTrigger(text: string): boolean {
  const t = text.toLowerCase();
  return DEMO_TRIGGERS.some((k) => t.includes(k));
}

export function buildDemoMessage(): string {
  return `Claro! Para facilitar a visualização, preparamos uma demonstração da plataforma da Sety Vision.\n\nNela você pode conhecer o painel, CRM, automações, agenda, dashboards e acompanhar como tudo funciona na prática.\n\n🔗 Acesse a demonstração:\n${DEMO_LINK}\n\nNavegue com calma. Se surgir qualquer dúvida, posso explicar cada recurso e mostrar como ele seria adaptado para a sua empresa 😊`;
}
