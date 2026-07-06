/**
 * Biblioteca de prova social — só materiais reais hospedados em setystudio.com.br
 * (verificado ao vivo em 2026-07-06, todas as URLs retornam 200). Nunca inventar
 * case, depoimento ou resultado que não esteja aqui.
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
  `${DOMAIN}/uploads/feedback/feedback-1.jpg`,
  `${DOMAIN}/uploads/feedback/feedback-2.jpg`,
  `${DOMAIN}/uploads/feedback/feedback-3.jpg`,
  `${DOMAIN}/uploads/feedback/feedback-4.jpg`,
  `${DOMAIN}/uploads/feedback/feedback-5.jpg`,
  `${DOMAIN}/uploads/feedback/feedback-6.jpg`,
];

const RESULT_IMAGES = [
  `${DOMAIN}/uploads/resultados/Screenshot_43.png`,
  `${DOMAIN}/uploads/resultados/WhatsApp%20Image%202026-04-09%20at%201.26.12%20PM.jpeg`,
  `${DOMAIN}/uploads/resultados/WhatsApp%20Image%202026-04-15%20at%2012.22.02%20PM.jpeg`,
  `${DOMAIN}/uploads/resultados/WhatsApp%20Image%202026-04-16%20at%205.04.34%20PM.jpeg`,
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
