/**
 * Formatação de mensagens de WhatsApp — garante que nenhuma resposta (SDR ou
 * follow-up) saia como bloco único de texto, mesmo se o modelo ignorar o prompt.
 * Correção global 2026-07-06: textão com travessão/parênteses é o maior sinal
 * de "escrito por IA" no WhatsApp — aqui a quebra é determinística, não depende
 * da obediência do Claude às instruções de estilo.
 */

const MAX_CHARS_PER_BUBBLE = 250;
const MAX_LINES_PER_BUBBLE = 2;
const MAX_BUBBLES = 5;

export function sanitizeMessageStyle(text: string): string {
  return text
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/^[•\-]\s*/gm, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

// Fallback só pra frase isolada que sozinha já estourou o limite (raro — texto
// corrido sem pontuação). Reagrupa em pedaços que cabem no limite de caracteres.
function splitOversizedChunk(text: string): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > MAX_CHARS_PER_BUBBLE && current) {
      chunks.push(current.trim());
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

// Lista tipo "🚀 Loja Shopify completa" / "💰 R$ 1.500" (pacote/proposta) —
// tem 3+ linhas com emoji/tópico no início e não tem pontuação de frase, é
// pra ficar junta como um cartão só. Nunca fragmentar isso por frase/tamanho.
const EMOJI_OR_BULLET_LINE = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}✓✅❌•\-]/u;
function looksLikeList(paragraph: string): boolean {
  const lines = paragraph.split("\n").filter((l) => l.trim());
  if (lines.length < 3) return false;
  const listLines = lines.filter((l) => EMOJI_OR_BULLET_LINE.test(l.trim()));
  return listLines.length >= lines.length * 0.6;
}

// Cada FRASE vira seu próprio balão, sempre — não só quando o parágrafo fica
// grande demais. "Boa! Isso ajuda bastante. Você já vende hoje?" precisa virar
// 3 balões mesmo cabendo em 250 caracteres, porque são 3 ideias diferentes.
function splitParagraphIntoSentences(paragraph: string): string[] {
  if (looksLikeList(paragraph)) return [paragraph];

  const lines = paragraph.split("\n").filter(Boolean);
  if (paragraph.length <= MAX_CHARS_PER_BUBBLE && lines.length <= MAX_LINES_PER_BUBBLE) {
    const sentences = paragraph.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean);
    if (!sentences || sentences.length <= 1) return [paragraph];
    return sentences;
  }

  const sentences =
    paragraph.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) ??
    [paragraph];

  return sentences.flatMap((s) => (s.length > MAX_CHARS_PER_BUBBLE ? splitOversizedChunk(s) : [s]));
}

// Quebra em até MAX_BUBBLES mensagens curtas, uma frase/ideia por balão —
// nunca depende só da IA ter separado por parágrafo ou por frase.
export function splitIntoBubbles(message: string): string[] {
  const sanitized = sanitizeMessageStyle(message);
  const paragraphs = sanitized.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const base = paragraphs.length > 0 ? paragraphs : [sanitized];
  const expanded = base.flatMap(splitParagraphIntoSentences);

  if (expanded.length <= MAX_BUBBLES) return expanded;
  const head = expanded.slice(0, MAX_BUBBLES - 1);
  const tail = expanded.slice(MAX_BUBBLES - 1).join(" ");
  return [...head, tail];
}
