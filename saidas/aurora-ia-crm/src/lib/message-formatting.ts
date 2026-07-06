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

// Bug crítico encontrado 2026-07-06: "R$1.500" (ponto como separador de milhar)
// tem um "." no meio sem espaço depois — o regex de frase trata isso como fim
// de frase, mas como não tem espaço/fim-de-string logo depois, o trecho anterior
// não casa com NENHUMA alternativa do regex e o JS descarta silenciosamente esse
// pedaço do texto (ex: "O valor mínimo é R$1.500" perdia "O valor mínimo é R$1"
// inteiro). Protege todo ponto entre dígitos ANTES de qualquer split de frase.
const DIGIT_DOT_PLACEHOLDER = "‗";
function protectDigitDots(text: string): string {
  return text.replace(/(\d)\.(\d)/g, `$1${DIGIT_DOT_PLACEHOLDER}$2`);
}
function restoreDigitDots(text: string): string {
  return text.replace(new RegExp(DIGIT_DOT_PLACEHOLDER, "g"), ".");
}

export function sanitizeMessageStyle(text: string): string {
  return text
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/^[•\-]\s*/gm, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

// Fallback só pra frase isolada que sozinha já estourou o limite (raro — texto
// corrido sem pontuação). Reagrupa em pedaços que cabem no limite de caracteres.
// Nunca separa "R$" do valor que vem depois — bug real encontrado 2026-07-06:
// um texto longo sem pontuação podia quebrar bem entre "R$" e "500", deixando
// um balão terminando em "R$" e o próximo começando em "500 (7-10 dias...)"
// sem o cifrão. Protege com um joiner invisível antes de tokenizar por espaço.
const CURRENCY_JOINER = "⁠";
function splitOversizedChunk(text: string): string[] {
  const protectedText = text.replace(/R\$\s+(?=\d)/g, `R$${CURRENCY_JOINER}`);
  const words = protectedText.split(/\s+/);
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
  return chunks.map((c) => c.replace(new RegExp(CURRENCY_JOINER, "g"), " "));
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

// Fragmento só de emoji (ex: "🙌" sobrando depois de "Perfeito! 🙌") nunca vira
// balão próprio — gruda de volta no anterior. Sem isso "Perfeito! 🙌" virava
// dois balões ("Perfeito!" + "🙌"), o que parece quebrado, não humano.
const HAS_LETTER_OR_DIGIT = /[a-zA-Z0-9À-ÿ]/;
function mergeEmojiOnlyFragments(sentences: string[]): string[] {
  const merged: string[] = [];
  for (const s of sentences) {
    if (merged.length > 0 && !HAS_LETTER_OR_DIGIT.test(s)) {
      merged[merged.length - 1] = `${merged[merged.length - 1]} ${s}`;
    } else {
      merged.push(s);
    }
  }
  return merged;
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
    return mergeEmojiOnlyFragments(sentences);
  }

  const sentences =
    paragraph.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) ??
    [paragraph];

  return mergeEmojiOnlyFragments(sentences).flatMap((s) =>
    s.length > MAX_CHARS_PER_BUBBLE ? splitOversizedChunk(s) : [s]
  );
}

// Ponto final em balão curto de WhatsApp é sinal de texto formal, não conversa.
// Nunca mexe em "?", "!" (usado de propósito em reação, ex: "Perfeito! 🙌") nem
// em "..." (reticências intencionais) nem em blocos de lista/cartão (têm \n).
function stripTrailingPeriod(bubble: string): string {
  if (bubble.includes("\n")) return bubble;
  if (/\.\.\.$/.test(bubble)) return bubble;
  if (/[^.]\.$/.test(bubble)) return bubble.slice(0, -1);
  return bubble;
}

// Quebra em até MAX_BUBBLES mensagens curtas, uma frase/ideia por balão —
// nunca depende só da IA ter separado por parágrafo ou por frase.
export function splitIntoBubbles(message: string): string[] {
  const sanitized = protectDigitDots(sanitizeMessageStyle(message));
  const paragraphs = sanitized.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const base = paragraphs.length > 0 ? paragraphs : [sanitized];
  const expanded = base.flatMap(splitParagraphIntoSentences);

  const result =
    expanded.length <= MAX_BUBBLES
      ? expanded
      : [...expanded.slice(0, MAX_BUBBLES - 1), expanded.slice(MAX_BUBBLES - 1).join(" ")];

  return result.map((b) => restoreDigitDots(stripTrailingPeriod(b)));
}
