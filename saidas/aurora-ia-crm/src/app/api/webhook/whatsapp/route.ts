import { NextRequest, NextResponse } from "next/server";
import { classifyContact } from "@/lib/contact-classifier";
import { generateSdrResponse, buildHumanTransferMessage } from "@/lib/sdr-engine";
import {
  findOrCreateLead,
  updateLead,
  getLeadHistory,
  saveMessage,
  getContactProfile,
  upsertContactProfile,
  isContactBlocked,
  createCrmNotification,
} from "@/lib/lead-memory";

const ZAPI_INSTANCE = process.env.ZAPI_INSTANCE_ID!;
const ZAPI_TOKEN    = process.env.ZAPI_TOKEN!;
const ZAPI_BASE     = "https://api.z-api.io";
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET ?? "";

// ── Enviar mensagem via Z-API ─────────────────────────────────────────────────

async function sendWhatsAppMessage(phone: string, text: string): Promise<void> {
  const res = await fetch(
    `${ZAPI_BASE}/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, message: text }),
    }
  );
  if (!res.ok) {
    console.error("Erro ao enviar mensagem Z-API:", await res.text());
  }
}

// ── Notificar responsável ─────────────────────────────────────────────────────

async function notifyResponsible(_phone: string, text: string): Promise<void> {
  const RESPONSIBLE = process.env.RESPONSIBLE_PHONE;
  if (!RESPONSIBLE) return;
  await sendWhatsAppMessage(RESPONSIBLE, text);
}

// ── Handler principal ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    if (WEBHOOK_SECRET) {
      const secret = req.headers.get("x-webhook-secret") ?? req.nextUrl.searchParams.get("secret");
      if (secret !== WEBHOOK_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const body = await req.json();

    // Z-API só envia ReceivedCallback para mensagens recebidas
    if (body.type !== "ReceivedCallback") {
      return NextResponse.json({ ok: true, skipped: body.type });
    }

    // Ignorar mensagens próprias
    if (body.fromMe) {
      return NextResponse.json({ ok: true, skipped: "own_message" });
    }

    // Extrair dados — Z-API payload
    const phone: string = (body.phone ?? "").replace(/[^0-9]/g, "");
    const isGroup: boolean = !!(body.participantPhone) || String(body.phone).includes("-");
    const senderName: string | undefined = body.senderName ?? body.chatName;
    const messageText: string =
      body.text?.message ??
      body.image?.caption ??
      body.audio?.caption ??
      "";

    if (!phone || !messageText) {
      return NextResponse.json({ ok: true, skipped: "empty" });
    }

    if (await isContactBlocked(phone)) {
      return NextResponse.json({ ok: true, skipped: "blocked_contact" });
    }

    const [profile, lead] = await Promise.all([
      getContactProfile(phone),
      findOrCreateLead(phone, senderName),
    ]);

    const history = await getLeadHistory(lead.id, 10);
    const classification = classifyContact({
      phone,
      message: messageText,
      senderName,
      isGroup,
      conversationHistory: history.map((m) => ({ role: m.role, content: m.content })),
      existingContactType: profile?.contactType,
      existingTags: lead.tags,
    });

    await saveMessage({
      lead_id: lead.id,
      content: messageText,
      role: "client",
      timestamp: new Date().toISOString(),
      status: "delivered",
    });

    await upsertContactProfile({
      phone,
      name: senderName,
      contactType: classification.contactType,
      isBlocked: false,
      isGroup,
      messageFrequency: (profile?.messageFrequency ?? 0) + 1,
      firstSeen: profile?.firstSeen ?? new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      tags: lead.tags,
    });

    if (classification.decision === "ignore") {
      console.log(`[Aurora] Ignorando ${phone} — ${classification.reasoning}`);
      return NextResponse.json({ ok: true, action: "ignored", reason: classification.reasoning });
    }

    const sdrResult = await generateSdrResponse(
      messageText,
      { ...lead, ...classification },
      history,
      classification
    );

    await sendWhatsAppMessage(phone, sdrResult.message);

    await saveMessage({
      lead_id: lead.id,
      content: sdrResult.message,
      role: "aurora",
      timestamp: new Date().toISOString(),
      status: "sent",
    });

    await updateLead(lead.id, {
      ...sdrResult.leadUpdate,
      name: senderName ?? lead.name,
    });

    if (sdrResult.shouldNotifyHuman || classification.decision === "notify_human") {
      const notifMsg = await buildHumanTransferMessage(lead, messageText, classification.intentScore);
      await Promise.all([
        notifyResponsible(phone, notifMsg),
        createCrmNotification({
          type: "hot_lead",
          title: `Lead quente — ${senderName ?? phone}`,
          body: `Score ${classification.intentScore}/100 — "${messageText.slice(0, 80)}..."`,
          lead_id: lead.id,
        }),
      ]);
    }

    if (history.length === 0) {
      await createCrmNotification({
        type: "new_lead",
        title: `Novo lead — ${senderName ?? phone}`,
        body: messageText.slice(0, 100),
        lead_id: lead.id,
      });
    }

    return NextResponse.json({
      ok: true,
      action: "responded",
      classification: classification.contactType,
      intentScore: classification.intentScore,
      leadStatus: sdrResult.leadUpdate.status ?? lead.status,
      notifiedHuman: sdrResult.shouldNotifyHuman,
    });

  } catch (err) {
    console.error("[Aurora Webhook] Erro:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    ok: true,
    service: "Aurora IA Webhook",
    version: "2.1-zapi",
    timestamp: new Date().toISOString(),
  });
}
