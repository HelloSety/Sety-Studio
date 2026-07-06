import { NextRequest, NextResponse } from "next/server";
import { runFollowUpAutomation } from "@/lib/follow-up-engine";

// Vercel Cron manda "Authorization: Bearer $CRON_SECRET" automaticamente quando
// a env var CRON_SECRET está configurada no projeto — é assim que autentica,
// sem precisar de secret na URL. Configurar CRON_SECRET no painel da Vercel é
// passo manual (Seven), não dá pra fazer remotamente.
//
// Duração: até 5 leads por invocação, cada um com 1-5 balões + jitter de
// 5-20s + delay de digitação entre balões — soma no máximo ~2-3min. Se o
// plano da Vercel limitar maxDuration abaixo disso, é truncado automaticamente
// (mesmo comportamento documentado no webhook principal).
export const maxDuration = 280;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const report = await runFollowUpAutomation();
    return NextResponse.json({ ok: true, ...report });
  } catch (err) {
    console.error("[cron/follow-up] Erro:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
