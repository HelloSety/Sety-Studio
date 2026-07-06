import { NextRequest, NextResponse } from "next/server";
import { classifyContact } from "@/lib/contact-classifier";
import { generateSdrResponse, buildHumanTransferMessage, type IncomingImage } from "@/lib/sdr-engine";
import { splitIntoBubbles } from "@/lib/message-formatting";
import {
  findOrCreateLead,
  updateLead,
  getLeadHistory,
  saveMessage,
  getContactProfile,
  upsertContactProfile,
  isContactBlocked,
  createCrmNotification,
  tryClaimMessage,
  markMessageProcessed,
  hasNewerClientMessage,
} from "@/lib/lead-memory";

// Precisa de mais que o padrão de 10s da Vercel Hobby pra caber o delay humano.
// Pior caso: download de imagem (até 15s) + debounce (4s) + Claude (~3-5s) +
// digitação em até 5 balões (até ~60s) pode passar de 70s somados. 90s dá
// margem real. Se o plano da Vercel não permitir esse valor, ele é limitado
// automaticamente ao máximo do plano — vale confirmar contra o plano contratado.
export const maxDuration = 90;

const UAZAPI_BASE_URL      = process.env.UAZAPI_BASE_URL!;
const UAZAPI_INSTANCE_TOKEN = process.env.UAZAPI_INSTANCE_TOKEN!;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET ?? "";

const AUDIO_DOWNLOAD_TIMEOUT_MS = 15_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`[AUDIO] timeout (${ms}ms) em ${label}`)), ms)),
  ]);
}

// ── Baixar mídia recebida (áudio) via UAZAPI ─────────────────────────────────

async function downloadMedia(
  number: string,
  messageId: string,
  fallbackMimeType: string,
  label: string
): Promise<{ base64: string; mimeType: string } | null> {
  try {
    const res = await withTimeout(
      fetch(`${UAZAPI_BASE_URL}/send/download-media`, {
        method: "POST",
        headers: { token: UAZAPI_INSTANCE_TOKEN, "Content-Type": "application/json" },
        body: JSON.stringify({ number, messageId }),
      }),
      AUDIO_DOWNLOAD_TIMEOUT_MS,
      "download de mídia"
    );
    if (!res.ok) {
      console.log(`[${label}] Download falhou (status ${res.status})`);
      return null;
    }
    const data = await res.json();
    if (!data?.base64) {
      console.log(`[${label}] Download concluído mas sem base64 no retorno`);
      return null;
    }
    return { base64: data.base64, mimeType: data.mimeType || fallbackMimeType };
  } catch (e) {
    console.log(`[${label}] Erro/timeout no download: ${e}`);
    return null;
  }
}

// Claude só aceita esses quatro formatos de imagem — qualquer outro (ex: image/bmp,
// ou variações estranhas que a UAZAPI às vezes manda) cai no fallback jpeg.
const SUPPORTED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;

function normalizeImageMimeType(mimeType: string): IncomingImage["mimeType"] {
  const match = SUPPORTED_IMAGE_MIME_TYPES.find((m) => m === mimeType);
  return match ?? "image/jpeg";
}

// ── Enviar mensagem via UAZAPI ────────────────────────────────────────────────

async function sendWhatsAppMessage(phone: string, text: string): Promise<void> {
  const res = await fetch(`${UAZAPI_BASE_URL}/send/text`, {
    method: "POST",
    headers: { token: UAZAPI_INSTANCE_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify({ number: phone, text }),
  });
  if (!res.ok) {
    console.error("Erro ao enviar mensagem UAZAPI:", await res.text());
  }
}

async function sendPresence(phone: string, presence: "composing" | "paused"): Promise<void> {
  await fetch(`${UAZAPI_BASE_URL}/send/presence`, {
    method: "POST",
    headers: { token: UAZAPI_INSTANCE_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify({ number: phone, presence }),
  }).catch(() => {});
}

async function markChatAsRead(phone: string): Promise<void> {
  await fetch(`${UAZAPI_BASE_URL}/chat/read`, {
    method: "POST",
    headers: { token: UAZAPI_INSTANCE_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify({ number: phone, read: true }),
  }).catch(() => {});
}

// Delay calibrado pra simular tempo humano de digitação/leitura. Áudio não entra
// mais aqui — não transcrevemos mais, então nunca chega a gerar uma resposta pra
// simular digitação (ver tratamento de "audio" logo no início do POST).
function typingDelayRange(message: string, incomingType: "text" | "image"): [number, number] {
  if (incomingType === "image") return [12_000, 20_000];
  const words = message.trim().split(/\s+/).filter(Boolean).length;
  if (words <= 15) return [2_000, 5_000];
  if (words <= 40) return [5_000, 8_000];
  if (words <= 80) return [8_000, 12_000];
  return [10_000, 16_000];
}

async function simulateTyping(
  phone: string,
  message: string,
  incomingType: "text" | "image" = "text",
  forceShort = false
): Promise<void> {
  await sendPresence(phone, "composing");
  // Balão de continuação (2º+ de uma resposta dividida): a pessoa já formulou o
  // pensamento inteiro, só está terminando de digitar — pausa bem curta (1-3s),
  // não repete o tempo de "pensar" do primeiro balão. Também limita o atraso
  // total da função quando a resposta vem em vários balões.
  const [min, max] = forceShort ? [1_000, 3_000] : typingDelayRange(message, incomingType);
  const jitterRange = forceShort ? 500 : 2000;
  const jitter = (Math.random() * 2 - 1) * jitterRange;
  const delayMs = Math.max(800, Math.round(min + Math.random() * (max - min) + jitter));
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  await sendPresence(phone, "paused");
}

// ── Notificar responsável ─────────────────────────────────────────────────────

async function notifyResponsible(_phone: string, text: string): Promise<void> {
  const RESPONSIBLE = process.env.RESPONSIBLE_PHONE;
  if (!RESPONSIBLE) return;
  await sendWhatsAppMessage(RESPONSIBLE, text);
}

// ── Similaridade simples entre duas mensagens (sem chamada de IA) ───────────
// Detecta perguntas "quase iguais" (ex: "Qual seu segmento?" vs "Qual seu
// segmento? (roupas, acessórios...)"), não só texto idêntico.

function wordSet(text: string): Set<string> {
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w\s]/g, " ");
  return new Set(normalized.split(/\s+/).filter((w) => w.length > 2));
}

function similarity(a: string, b: string): number {
  const setA = wordSet(a);
  const setB = wordSet(b);
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const w of setA) if (setB.has(w)) intersection++;
  const union = setA.size + setB.size - intersection;
  return intersection / union;
}

// ── Verificar se o número é um contato salvo no WhatsApp conectado ───────────
// (nome que o próprio Seven salvou no celular — diferente de "já tem lead no CRM")

async function isSavedContact(phone: string): Promise<boolean> {
  try {
    const res = await fetch(`${UAZAPI_BASE_URL}/contact/info?number=${phone}`, {
      headers: { token: UAZAPI_INSTANCE_TOKEN },
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data?.name);
  } catch {
    return false;
  }
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

    // UAZAPI real: evento vem em EventType, a mensagem vem em body.message
    if (body.EventType !== "messages" && body.EventType !== "message") {
      return NextResponse.json({ ok: true, skipped: body.EventType });
    }

    const msg = body.message ?? {};

    // Ignorar mensagens próprias, de grupo, ou tipos que não processamos
    const SUPPORTED_TYPES = ["text", "audio", "image", "sticker"];
    if (msg.fromMe || msg.isGroup || !SUPPORTED_TYPES.includes(msg.type)) {
      return NextResponse.json({ ok: true, skipped: "filtered" });
    }

    // Extrair dados — payload real da UAZAPI
    const phone: string = String(msg.chatid ?? "").split("@")[0];
    const isGroup = false;
    const senderName: string | undefined = msg.senderName;
    const messageId: string = msg.id ?? msg.messageid ?? "";

    // ── Idempotência: se a UAZAPI reenviar este mesmo evento (retry/reconexão),
    // ignora completamente em vez de gerar uma segunda resposta.
    const claimed = await tryClaimMessage(messageId, phone);
    if (!claimed) {
      console.log(`[Sety Vision] messageId ${messageId} já processado/em processamento — ignorando duplicata.`);
      return NextResponse.json({ ok: true, skipped: "duplicate_message_id" });
    }
    let finalStatus: "done" | "failed" = "done";

    // Marca como lida assim que aceita pra processar — replica o comportamento humano
    // de abrir a conversa e ver a mensagem antes mesmo de começar a digitar a resposta.
    await markChatAsRead(phone);

    try {

    let messageText: string = msg.text ?? msg.content ?? "";

    // Política atual: não transcreve áudio. Tentar baixar+transcrever adicionava
    // latência, custo de API e falha silenciosa (ex: transcrição virou "Fali" e
    // o bot interpretou como "faliu" — respondeu errado com confiança). Mais
    // simples e mais seguro pedir texto direto, sem travar a operação esperando
    // download/transcrição de terceiro (Gemini).
    if (msg.type === "audio") {
      console.log(`[AUDIO] Áudio recebido de ${phone} — pedindo texto (sem transcrição)`);
      const firstName = senderName?.trim().split(/\s+/)[0];
      const fallbackMessage = `Opa${firstName ? ", " + firstName : ""}! 😄 Me manda por mensagem, por favor? Fica bem mais fácil pra eu te responder certinho.`;
      await simulateTyping(phone, fallbackMessage, "text");
      await sendWhatsAppMessage(phone, fallbackMessage);
      try {
        const lead = await findOrCreateLead(phone, senderName);
        await saveMessage({
          lead_id: lead.id,
          content: fallbackMessage,
          role: "aurora",
          timestamp: new Date().toISOString(),
          status: "sent",
        });
      } catch {
        // se salvar o histórico falhar, a mensagem já foi enviada — não bloqueia a resposta
      }
      return NextResponse.json({ ok: true, action: "audio_text_requested" });
    }

    // Sticker: nunca manda pra IA, resposta canned e curta, encerra o processamento.
    const STICKER_REPLIES = ["😂 Boa!", "Hahaha 😄", "kkkkk boa essa"];
    if (msg.type === "sticker") {
      const stickerReply = STICKER_REPLIES[Math.floor(Math.random() * STICKER_REPLIES.length)];
      await simulateTyping(phone, stickerReply, "text");
      await sendWhatsAppMessage(phone, stickerReply);
      try {
        const lead = await findOrCreateLead(phone, senderName);
        await saveMessage({
          lead_id: lead.id,
          content: stickerReply,
          role: "aurora",
          timestamp: new Date().toISOString(),
          status: "sent",
        });
      } catch {
        // se salvar o histórico falhar, a mensagem já foi enviada — não bloqueia a resposta
      }
      return NextResponse.json({ ok: true, action: "sticker_acknowledged" });
    }

    let incomingImage: IncomingImage | undefined;

    if (msg.type === "image") {
      console.log(`[IMAGEM] Imagem recebida de ${phone}`);
      const caption = (msg.text ?? msg.content ?? "").trim();

      // Imagem sem legenda nenhuma: nunca manda pra IA (visão custa tokens e o
      // cliente não disse o que quer) — pede o texto e encerra, sem download.
      if (!caption) {
        const askForText = "Recebi sua imagem 😊\n\nPode me explicar rapidinho em texto o que você precisa? Assim consigo te ajudar da melhor forma.";
        await simulateTyping(phone, askForText, "image");
        await sendWhatsAppMessage(phone, askForText);
        try {
          const lead = await findOrCreateLead(phone, senderName);
          await saveMessage({
            lead_id: lead.id,
            content: askForText,
            role: "aurora",
            timestamp: new Date().toISOString(),
            status: "sent",
          });
        } catch {
          // se salvar o histórico falhar, a mensagem já foi enviada — não bloqueia a resposta
        }
        return NextResponse.json({ ok: true, action: "image_without_caption_text_requested" });
      }

      try {
        const media = phone && messageId
          ? await downloadMedia(phone, messageId, "image/jpeg", "IMAGEM")
          : null;

        if (media) {
          incomingImage = { base64: media.base64, mimeType: normalizeImageMimeType(media.mimeType) };
          messageText = caption ? `[Imagem] ${caption}` : "[Imagem enviada]";
        } else {
          console.log("[IMAGEM] Falha no download — seguindo em failsafe (pedindo reenvio, sem expor erro técnico)");
          await sendWhatsAppMessage(
            phone,
            "Recebi sua imagem, mas não consegui visualizar todos os detalhes desta vez. 😊\n\nSe puder reenviar a imagem ou me explicar rapidamente o que ela mostra, continuo seu atendimento normalmente."
          );
          return NextResponse.json({ ok: true, action: "image_fallback_text_requested" });
        }
      } catch (e) {
        console.log(`[IMAGEM] Falha ao processar: exceção não tratada — ${e}`);
        await sendWhatsAppMessage(
          phone,
          "Recebi sua imagem, mas não consegui visualizar todos os detalhes desta vez. 😊\n\nSe puder reenviar a imagem ou me explicar rapidamente o que ela mostra, continuo seu atendimento normalmente."
        );
        return NextResponse.json({ ok: true, action: "image_fallback_text_requested" });
      }
    }

    if (!phone || !messageText) {
      return NextResponse.json({ ok: true, skipped: "empty" });
    }

    if (await isContactBlocked(phone)) {
      return NextResponse.json({ ok: true, skipped: "blocked_contact" });
    }

    const [profile, lead, savedContact] = await Promise.all([
      getContactProfile(phone),
      findOrCreateLead(phone, senderName),
      isSavedContact(phone),
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
      isSavedContact: savedContact,
    });

    const thisMessageTimestamp = new Date().toISOString();
    await saveMessage({
      lead_id: lead.id,
      content: messageText,
      role: "client",
      timestamp: thisMessageTimestamp,
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
      console.log(`[Sety Vision] Ignorando ${phone} — ${classification.reasoning}`);
      return NextResponse.json({ ok: true, action: "ignored", reason: classification.reasoning });
    }

    if (classification.decision === "respond_once") {
      const declineMessage =
        "Olá! Nosso atendimento automático é destinado a assuntos relacionados aos serviços da Sety Studio. Se precisar de ajuda com algum projeto no futuro, ficaremos à disposição. Tenha um ótimo dia! 😊";

      await sendWhatsAppMessage(phone, declineMessage);
      await saveMessage({
        lead_id: lead.id,
        content: declineMessage,
        role: "aurora",
        timestamp: new Date().toISOString(),
        status: "sent",
      });
      await createCrmNotification({
        type: "inappropriate_lead",
        title: `Lead inadequado — ${senderName ?? phone}`,
        body: `Conteúdo ofensivo detectado (confiança ${Math.round(classification.confidence * 100)}%). Automação encerrada para essa conversa. Revisar manualmente se quiser bloquear.`,
        lead_id: lead.id,
      });

      console.log(`[Sety Vision] Lead inadequado ${phone} — resposta única enviada, automação encerrada.`);
      return NextResponse.json({ ok: true, action: "responded_once_then_stopped", classification: "inadequado" });
    }

    // Debounce: se o cliente mandar mais de uma mensagem em sequência rápida, cada uma
    // chega como um evento de webhook independente. Sem isso, duas mensagens próximas
    // geram duas chamadas de IA em paralelo — cada uma sem ver a outra — e o cliente
    // recebe duas perguntas parecidas mas diferentes (ex: "qual seu segmento?" +
    // "qual seu segmento? (roupas, acessórios...)"). Espera um pouco e cede a vez pra
    // mensagem mais nova processar o lote inteiro de uma vez.
    await new Promise((resolve) => setTimeout(resolve, 4000));
    if (await hasNewerClientMessage(lead.id, thisMessageTimestamp)) {
      console.log(`[Sety Vision] Mensagem de ${phone} superada por outra mais recente — cedendo a resposta.`);
      return NextResponse.json({ ok: true, action: "superseded_by_newer_message" });
    }

    const freshHistory = await getLeadHistory(lead.id, 10);
    const sdrResult = await generateSdrResponse(
      messageText,
      { ...lead, ...classification },
      freshHistory,
      classification,
      incomingImage
    );

    // Defesa extra: nunca reenviar uma resposta igual ou muito parecida com a última
    // (protege contra reprocessamento mesmo se o guard de messageId falhar por algum motivo,
    // e pega também "quase repetições" — mesma pergunta reformulada de forma diferente).
    const lastBotMsg = [...freshHistory].reverse().find((m) => m.role === "aurora");
    const withinWindow = lastBotMsg ? Date.now() - new Date(lastBotMsg.timestamp).getTime() < 20_000 : false;
    const isRepeatedReply = withinWindow && similarity(lastBotMsg!.content, sdrResult.message) >= 0.6;

    if (isRepeatedReply) {
      console.log(`[Sety Vision] Resposta muito parecida com a última enviada há <20s para ${phone} — envio cancelado.`);
      return NextResponse.json({ ok: true, action: "skipped_repeated_reply" });
    }

    // Envia em até 5 balões (ver splitIntoBubbles) — só o primeiro carrega o delay
    // de "processar imagem" (áudio nunca chega aqui, ver tratamento no início do POST).
    const bubbles = splitIntoBubbles(sdrResult.message);
    for (let i = 0; i < bubbles.length; i++) {
      await simulateTyping(phone, bubbles[i], i === 0 ? (msg.type as "text" | "image") : "text", i > 0);
      await sendWhatsAppMessage(phone, bubbles[i]);
    }

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
      finalStatus = "failed";
      throw err;
    } finally {
      await markMessageProcessed(messageId, finalStatus);
    }

  } catch (err) {
    console.error("[Sety Vision Webhook] Erro:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    ok: true,
    service: "Sety Vision Webhook",
    version: "2.2-uazapi",
    timestamp: new Date().toISOString(),
  });
}
