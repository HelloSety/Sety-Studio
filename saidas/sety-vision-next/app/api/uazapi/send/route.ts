import { NextRequest, NextResponse } from "next/server";
import { sendText, sendImage, sendDocument, sendAudio, isConfigured } from "@/lib/uazapi";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json({ error: "uazapi não configurado" }, { status: 503 });
  }
  try {
    const body = await req.json();
    const { number, type = "text", text, image, document, fileName, audio, ptt, caption } = body;

    if (!number) return NextResponse.json({ error: "number obrigatório" }, { status: 400 });

    let result;
    switch (type) {
      case "image":
        result = await sendImage(number, image, caption);
        break;
      case "document":
        result = await sendDocument(number, document, fileName, caption);
        break;
      case "audio":
        result = await sendAudio(number, audio, ptt ?? true);
        break;
      default:
        if (!text) return NextResponse.json({ error: "text obrigatório" }, { status: 400 });
        result = await sendText(number, text);
    }

    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
