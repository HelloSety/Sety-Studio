import Anthropic from "@anthropic-ai/sdk";
import { VOICE_SYSTEM_PROMPT } from "@/lib/voice-prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Message = { role: "user" | "assistant"; content: string };

const client = new Anthropic();

export async function POST(req: Request) {
  try {
    const { message, history = [] }: { message: string; history: Message[] } = await req.json();

    if (!message?.trim()) {
      return Response.json({ error: "Mensagem vazia" }, { status: 400 });
    }

    const messages: Message[] = [
      ...history.slice(-8),  // Keep last 8 turns for context
      { role: "user", content: message },
    ];

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",  // Fast model for low latency
      max_tokens: 200,                      // Short responses for voice
      system: VOICE_SYSTEM_PROMPT,
      messages,
    });

    const reply = response.content[0].type === "text"
      ? response.content[0].text.trim()
      : "Desculpe, não consegui processar sua mensagem.";

    return Response.json({ reply });
  } catch (err) {
    console.error("[voice] error:", err);
    return Response.json(
      { error: "Erro ao processar sua mensagem. Tente novamente." },
      { status: 500 }
    );
  }
}
