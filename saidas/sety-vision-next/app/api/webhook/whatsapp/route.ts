import { NextRequest, NextResponse } from "next/server";
import type { WebhookEvent, WebhookMessageData, WebhookConnectionData } from "@/lib/uazapi";
import { storeMessage, setConnectionStatus } from "@/app/api/uazapi/store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // Responder 200 imediatamente — uazapi exige resposta em <5s
  const payload = await req.json().catch(() => null);

  // Processar de forma assíncrona (sem bloquear a resposta)
  processEvent(payload).catch((err) => console.error("[webhook] error:", err));

  return NextResponse.json({ ok: true });
}

async function processEvent(payload: unknown) {
  if (!payload || typeof payload !== "object") return;
  const event = payload as WebhookEvent;

  switch (event.event) {
    case "message": {
      const data = event.data as WebhookMessageData;
      if (!data.fromMe) {
        const number = data.from.replace("@s.whatsapp.net", "").replace(/\D/g, "");
        storeMessage(number, {
          id: data.id,
          from: number,
          fromMe: false,
          body: data.body || "",
          type: data.type,
          timestamp: data.timestamp * 1000,
          pushName: data.pushName,
          mediaUrl: data.media?.url,
          mimeType: data.media?.mimeType,
          fileName: data.media?.fileName,
        });
      }
      break;
    }

    case "connection": {
      const data = event.data as WebhookConnectionData;
      setConnectionStatus(data.status);
      break;
    }

    default:
      // message_status, group_participant, call — logar apenas
      if (process.env.NODE_ENV !== "production") {
        console.log(`[webhook] ${event.event}:`, JSON.stringify(event.data).slice(0, 200));
      }
  }
}

// GET — health check / verificação do webhook pelo painel do uazapi
export async function GET() {
  return NextResponse.json({ ok: true, service: "sety-vision-whatsapp-webhook" });
}
