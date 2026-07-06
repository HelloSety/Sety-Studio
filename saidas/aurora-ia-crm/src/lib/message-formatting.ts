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

function splitLongParagraph(paragraph: string): string[] {
  const lines = paragraph.split("\n").filter(Boolean);
  if (paragraph.length <= MAX_CHARS_PER_BUBBLE && lines.length <= MAX_LINES_PER_BUBBLE) {
    return [paragraph];
  }

  const sentences =
    paragraph.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) ??
    [paragraph];

  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length > MAX_CHARS_PER_BUBBLE && current) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

// Quebra em até MAX_BUBBLES mensagens curtas, cada uma dentro do limite de
// caracteres/linhas — nunca depende só da IA ter separado por parágrafo.
export function splitIntoBubbles(message: string): string[] {
  const sanitized = sanitizeMessageStyle(message);
  const paragraphs = sanitized.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const base = paragraphs.length > 0 ? paragraphs : [sanitized];
  const expanded = base.flatMap(splitLongParagraph);

  if (expanded.length <= MAX_BUBBLES) return expanded;
  const head = expanded.slice(0, MAX_BUBBLES - 1);
  const tail = expanded.slice(MAX_BUBBLES - 1).join(" ");
  return [...head, tail];
}
