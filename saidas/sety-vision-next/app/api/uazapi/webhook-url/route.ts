import { NextRequest, NextResponse } from "next/server";
import { setWebhook, isConfigured } from "@/lib/uazapi";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json({ error: "uazapi não configurado" }, { status: 503 });
  }
  try {
    const { webhookUrl } = await req.json();
    if (!webhookUrl) return NextResponse.json({ error: "webhookUrl obrigatório" }, { status: 400 });

    const result = await setWebhook(webhookUrl, [
      "message",
      "message_status",
      "connection",
      "group_participant",
    ]);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
