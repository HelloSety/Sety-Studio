const FETCH_TIMEOUT_MS = 10_000;
const MAX_CONTENT_LENGTH = 2000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Timeout (${ms}ms) ao ler link`)), ms)),
  ]);
}

export function extractFirstUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s<>()"']+/i);
  return match ? match[0].replace(/[.,;!?]+$/, "") : null;
}

// Usa o Jina Reader (r.jina.ai) pra extrair o conteúdo legível de qualquer URL
// sem precisar de headless browser/scraper próprio — devolve texto/markdown limpo.
export async function fetchLinkContent(url: string): Promise<string | null> {
  try {
    const res = await withTimeout(
      fetch(`https://r.jina.ai/${url}`, { headers: { Accept: "text/plain" } }),
      FETCH_TIMEOUT_MS
    );
    if (!res.ok) {
      console.log(`[LINK] Falha ao ler ${url} (status ${res.status})`);
      return null;
    }
    const text = (await res.text()).trim();
    if (!text) return null;
    return text.slice(0, MAX_CONTENT_LENGTH);
  } catch (e) {
    console.log(`[LINK] Erro/timeout ao ler ${url}: ${e}`);
    return null;
  }
}
