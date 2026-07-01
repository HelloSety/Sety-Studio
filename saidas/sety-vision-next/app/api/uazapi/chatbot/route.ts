import { NextRequest, NextResponse } from "next/server";
import { getChatbotSettings, updateChatbotSettings, isConfigured } from "@/lib/uazapi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({
      enabled: false,
      aiProvider: "anthropic",
      model: "claude-haiku-4-5-20251001",
      systemPrompt: "",
      stopBotKeyword: "#humano",
      inactivityTimeout: 1800,
    });
  }
  try {
    const settings = await getChatbotSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ enabled: false });
  }
}

export async function PUT(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json({ error: "uazapi não configurado" }, { status: 503 });
  }
  try {
    const body = await req.json();
    const result = await updateChatbotSettings(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
