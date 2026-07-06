import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = "gemini-2.5-flash";
const TRANSCRIBE_TIMEOUT_MS = 15_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Timeout (${ms}ms) na transcrição`)), ms)),
  ]);
}

export async function transcribeAudio(base64: string, mimeType: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("[AUDIO] GEMINI_API_KEY não configurada — pulando transcrição");
    return null;
  }
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await withTimeout(
      ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { mimeType: mimeType.split(";")[0].trim(), data: base64 } },
              {
                text: "Transcreva literalmente o áudio a seguir, em português do Brasil. Responda apenas com o texto transcrito, sem comentários, sem aspas, sem explicações. Se não conseguir entender nada, responda exatamente: [inaudível]",
              },
            ],
          },
        ],
      }),
      TRANSCRIBE_TIMEOUT_MS
    );
    const text = response.text?.trim();
    if (!text || text === "[inaudível]") return null;
    return text;
  } catch (e) {
    console.log(`[AUDIO] Erro/timeout na transcrição: ${e}`);
    return null;
  }
}
