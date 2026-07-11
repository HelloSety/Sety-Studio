import { NextRequest, NextResponse } from "next/server";
import { classifyContact, wantsPaymentConfirmation } from "@/lib/contact-classifier";
import { generateSdrResponse, buildHumanTransferMessage, type IncomingImage } from "@/lib/sdr-engine";
import { splitIntoBubbles } from "@/lib/message-formatting";
import { detectProofTrigger, pickProofImages, inferNiche, detectDemoTrigger, buildDemoMessage } from "@/lib/social-proof-assets";
import { transcribeAudio } from "@/lib/audio-transcription";
import { extractFirstUrl, fetchLinkContent } from "@/lib/link-preview";
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

// Retorna se o envio foi aceito pela UAZAPI — nunca assumir "entregue" sem
// checar isso. Um envio que falha silenciosamente (token, número inválido,
// rate limit) deixava o CRM marcado como "sent" sem o cliente receber nada.
async function sendTextAttempt(phone: string, text: string): Promise<boolean> {
  try {
    const res = await fetch(`${UAZAPI_BASE_URL}/send/text`, {
      method: "POST",
      headers: { token: UAZAPI_INSTANCE_TOKEN, "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ number: phone, text }),
    });
    if (!res.ok) {
      console.error(`Erro ao enviar mensagem UAZAPI pra ${phone}:`, await res.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error(`Exceção ao enviar mensagem UAZAPI pra ${phone}:`, e);
    return false;
  }
}

// A UAZAPI pode falhar de forma transitória (ex: "host not mapped" durante uma
// reconexão momentânea da sessão) — uma tentativa a mais recupera esses casos
// sem precisar notificar o Seven por um blip que se resolve sozinho em segundos.
async function sendWhatsAppMessage(phone: string, text: string): Promise<boolean> {
  if (await sendTextAttempt(phone, text)) return true;
  console.log(`Retentando envio pra ${phone} após falha...`);
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return sendTextAttempt(phone, text);
}

async function sendWhatsAppImage(phone: string, imageUrl: string): Promise<void> {
  const res = await fetch(`${UAZAPI_BASE_URL}/send/image`, {
    method: "POST",
    headers: { token: UAZAPI_INSTANCE_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify({ number: phone, image: imageUrl }),
  });
  if (!res.ok) {
    console.error("Erro ao enviar imagem UAZAPI:", await res.text());
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

// ── Horário comercial (gate determinístico, roda ANTES de qualquer IA) ───────
// Segunda a sábado, 9h-18h, horário de Brasília. Domingo fechado.
const BUSINESS_DAYS = [1, 2, 3, 4, 5, 6]; // 0=domingo
const BUSINESS_START_HOUR = 9;
const BUSINESS_END_HOUR = 18;
const WEEKDAY_MAP: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function isWithinBusinessHours(): boolean {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const day = WEEKDAY_MAP[parts.find((p) => p.type === "weekday")?.value ?? ""] ?? 0;
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10) % 24;
  return BUSINESS_DAYS.includes(day) && hour >= BUSINESS_START_HOUR && hour < BUSINESS_END_HOUR;
}

function brazilDateKey(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
}

const OUT_OF_HOURS_MESSAGE =
  "Olá! 😊\n\nNo momento nossa equipe está fora do horário de atendimento.\n\nNosso horário é de segunda a sábado, das 9h às 18h.\n\nAssim que retornarmos, respondemos sua mensagem o mais rápido possível. Agradecemos a compreensão!";

// Delay do PRIMEIRO balão simula tempo de leitura + raciocínio, calibrado pela
// INTENÇÃO do lead (score de compra): comprador quer resposta rápida, curioso
// pode esperar um pouco mais. "O cliente deve sentir que existe uma pessoa
// pensando, mas nunca esperando mais do que o necessário." Nunca tempo fixo (por
// isso o jitter). Áudio transcrito vira texto comum antes de chegar aqui.
function firstReplyDelayRange(
  intentScore: number,
  incomingType: "text" | "image"
): [number, number] {
  if (incomingType === "image") return [4_000, 8_000];
  if (intentScore >= 80) return [2_000, 4_000]; // comprador
  if (intentScore >= 60) return [3_000, 5_000]; // quente
  if (intentScore >= 40) return [4_000, 6_000]; // interessado
  return [5_000, 8_000];                        // curioso / frio
}

async function simulateTyping(
  phone: string,
  intentScore: number,
  incomingType: "text" | "image" = "text",
  forceShort = false
): Promise<void> {
  await sendPresence(phone, "composing");
  // Balão de continuação (2º+ de uma resposta dividida): a pessoa já formulou o
  // pensamento inteiro, só está terminando de digitar — pausa bem curta (1-3s),
  // não repete o tempo de "pensar" do primeiro balão. Também limita o atraso
  // total quando a resposta vem em vários balões (teto de duração do Vercel).
  const [min, max] = forceShort ? [1_000, 3_000] : firstReplyDelayRange(intentScore, incomingType);
  const jitterRange = forceShort ? 500 : 1500;
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
    const SUPPORTED_TYPES = ["text", "audio", "image", "sticker", "video"];
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

    // ── Fora do horário comercial: nunca chama a IA, nunca processa mídia. Manda
    // o aviso UMA vez por dia (Brasil) e fica em silêncio até o próximo aviso
    // válido — reseta sozinho no dia seguinte ou quando o horário reabrir.
    if (!isWithinBusinessHours()) {
      const lead = await findOrCreateLead(phone, senderName);
      let notesObj: Record<string, unknown> = {};
      try {
        notesObj = JSON.parse(lead.notes ?? "{}") ?? {};
      } catch {
        notesObj = {};
      }
      const today = brazilDateKey();
      if (notesObj.aviso_fora_horario_data === today) {
        return NextResponse.json({ ok: true, skipped: "outside_business_hours_already_notified" });
      }
      await sendWhatsAppMessage(phone, OUT_OF_HOURS_MESSAGE);
      await saveMessage({
        lead_id: lead.id,
        content: OUT_OF_HOURS_MESSAGE,
        role: "aurora",
        timestamp: new Date().toISOString(),
        status: "sent",
      });
      await updateLead(lead.id, { notes: JSON.stringify({ ...notesObj, aviso_fora_horario_data: today }) });
      return NextResponse.json({ ok: true, action: "outside_business_hours_notice_sent" });
    }

    try {

    let messageText: string = msg.text ?? msg.content ?? "";

    // Transcreve áudio via Gemini antes de decidir o que fazer. Se a transcrição
    // falhar, vier vazia ou estourar o timeout, cai no fallback de pedir texto —
    // nunca manda áudio pro Claude sem confirmar que veio algo utilizável.
    if (msg.type === "audio") {
      console.log(`[AUDIO] Áudio recebido de ${phone} — transcrevendo`);
      await sendPresence(phone, "composing");
      const media = phone && messageId
        ? await downloadMedia(phone, messageId, "audio/ogg", "AUDIO")
        : null;
      const transcribed = media ? await transcribeAudio(media.base64, media.mimeType) : null;
      await sendPresence(phone, "paused");

      if (transcribed) {
        console.log(`[AUDIO] Transcrito de ${phone}: "${transcribed}"`);
        messageText = transcribed;
      } else {
        console.log(`[AUDIO] Falha ao transcrever áudio de ${phone} — pedindo texto`);
        const firstName = senderName?.trim().split(/\s+/)[0];
        const fallbackMessage = `Opa${firstName ? ", " + firstName : ""}! 😄 Não consegui entender direito seu áudio agora. Pode me mandar por mensagem de texto, por favor? Fica bem mais fácil pra eu te responder certinho.`;
        await simulateTyping(phone, 50, "text");
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
        return NextResponse.json({ ok: true, action: "audio_transcription_failed_text_requested" });
      }
    }

    // Sticker: nunca manda pra IA, resposta canned e curta, encerra o processamento.
    const STICKER_REPLIES = ["😂 Boa!", "Hahaha 😄", "kkkkk boa essa"];
    if (msg.type === "sticker") {
      const stickerReply = STICKER_REPLIES[Math.floor(Math.random() * STICKER_REPLIES.length)];
      await simulateTyping(phone, 40, "text");
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

      // Imagem sem legenda: analisa mesmo assim (o cliente espera que o bot
      // simplesmente veja e comente, sem precisar digitar nada primeiro).
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

    // Vídeo: Claude não aceita vídeo como mídia de entrada (só imagem), então nunca
    // baixa/analisa frame a frame — usa a legenda como a mensagem em si (cai no fluxo
    // de texto normal) e, sem legenda, pede o que o cliente precisa em vez de ignorar
    // a mensagem em silêncio (era exatamente esse silêncio que parecia "travar").
    if (msg.type === "video") {
      console.log(`[VIDEO] Vídeo recebido de ${phone}`);
      const caption = (msg.text ?? msg.content ?? "").trim();
      if (caption) {
        messageText = `[Vídeo enviado] ${caption}`;
      } else {
        const askForText = "Recebi seu vídeo 😊\n\nAinda não consigo assistir vídeos por aqui, mas pode me contar rapidinho o que você precisa que eu já te ajudo.";
        await simulateTyping(phone, 50, "text");
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
        return NextResponse.json({ ok: true, action: "video_without_caption_text_requested" });
      }
    }

    // Link enviado no texto: extrai o conteúdo legível via Jina Reader e injeta
    // como contexto extra pro Claude, sem travar a conversa se a leitura falhar.
    let extraContext: string | undefined;
    if (msg.type === "text") {
      const url = extractFirstUrl(messageText);
      if (url) {
        console.log(`[LINK] URL detectada de ${phone}: ${url}`);
        await sendPresence(phone, "composing");
        const linkContent = await fetchLinkContent(url);
        await sendPresence(phone, "paused");
        extraContext = linkContent
          ? `CONTEÚDO EXTRAÍDO DO LINK QUE O CONTATO ENVIOU (${url}):\n"""\n${linkContent}\n"""\nUse essas informações se forem relevantes para responder. Não invente dados que não estejam aqui.`
          : `O contato enviou um link (${url}) mas não foi possível abrir o conteúdo automaticamente. Comente isso rapidamente e com naturalidade, sem termos técnicos, e continue a conversa normalmente.`;
      }
    }

    // Normaliza o tipo pra digitação simulada — áudio transcrito e sticker nunca
    // chegam aqui (retornam antes), então só sobra "text" ou "image" de fato.
    const effectiveType: "text" | "image" = incomingImage ? "image" : "text";

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

    if (classification.decision === "redirect_once") {
      const REDIRECT_MESSAGES = [
        "Oi! Tudo bem? 😊 Poderia me encaminhar pra quem cuida da parte comercial, por gentileza?",
        "Oi! Tudo bem? 😊 Gostaria de falar com o responsável pelo comercial. Quem seria a melhor pessoa?",
      ];
      const redirectMessage = REDIRECT_MESSAGES[Math.floor(Math.random() * REDIRECT_MESSAGES.length)];

      await simulateTyping(phone, 30, "text");
      await sendWhatsAppMessage(phone, redirectMessage);
      await saveMessage({
        lead_id: lead.id,
        content: redirectMessage,
        role: "aurora",
        timestamp: new Date().toISOString(),
        status: "sent",
      });
      await createCrmNotification({
        type: "auto_reply_redirect",
        title: `Atendimento automatizado detectado — ${senderName ?? phone}`,
        body: "Identificado como bot/recepção automática de outra empresa. Enviado pedido único pra falar com o responsável; automação pausada até revisão manual.",
        lead_id: lead.id,
      });

      console.log(`[Sety Vision] Resposta automática de outra empresa detectada em ${phone} — redirecionado uma vez, automação pausada.`);
      return NextResponse.json({ ok: true, action: "redirected_once_then_paused", classification: "empresa_automatizada" });
    }

    // Debounce: se o cliente mandar várias mensagens em sequência (comum no WhatsApp,
    // uma ideia por balão), cada uma chega como um evento de webhook independente.
    // Um único sleep fixo de 4s + checagem única falha quando o intervalo real entre
    // balões passa de 4s (comum — gerou 3 respostas separadas, cada uma perguntando
    // segmento de novo, incidente real de 2026-07-06 com a lead "Duds"). Em vez disso,
    // espera em rounds de silêncio: só segue se não chegou nada novo por 6s seguidos.
    // Cada mensagem do lote "cede a vez" pra próxima assim que uma mais nova aparece —
    // só a ÚLTIMA mensagem do lote sobrevive até gerar a resposta (com o histórico
    // inteiro do lote já disponível, via freshHistory logo abaixo).
    const DEBOUNCE_QUIET_MS = 6000;
    const DEBOUNCE_MAX_ROUNDS = 4;
    let supersededByNewer = false;
    for (let round = 0; round < DEBOUNCE_MAX_ROUNDS; round++) {
      await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_QUIET_MS));
      if (await hasNewerClientMessage(lead.id, thisMessageTimestamp)) {
        supersededByNewer = true;
        break;
      }
    }
    if (supersededByNewer) {
      console.log(`[Sety Vision] Mensagem de ${phone} superada por outra mais recente — cedendo a resposta.`);
      return NextResponse.json({ ok: true, action: "superseded_by_newer_message" });
    }

    const freshHistory = await getLeadHistory(lead.id, 10);
    const sdrResult = await generateSdrResponse(
      messageText,
      { ...lead, ...classification },
      freshHistory,
      classification,
      incomingImage,
      extraContext
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
    // de leitura/raciocínio, calibrado pelo tamanho do que o CLIENTE mandou (não
    // pela bolha de saída — ver firstReplyDelayRange).
    const bubbles = splitIntoBubbles(sdrResult.message);
    let anySendFailed = false;
    for (let i = 0; i < bubbles.length; i++) {
      await simulateTyping(phone, classification.intentScore, i === 0 ? effectiveType : "text", i > 0);
      const ok = await sendWhatsAppMessage(phone, bubbles[i]);
      if (!ok) anySendFailed = true;
    }

    if (anySendFailed) {
      await Promise.all([
        notifyResponsible(phone, `⚠️ *Falha no envio* — parte da resposta pode não ter chegado pro cliente ${senderName ?? phone} (${phone}). Verificar manualmente.`),
        createCrmNotification({
          type: "message",
          title: `Falha ao enviar mensagem — ${senderName ?? phone}`,
          body: "A UAZAPI recusou/falhou ao enviar pelo menos um balão da resposta. Verificar se o cliente recebeu.",
          lead_id: lead.id,
        }),
      ]);
    }

    // Prova social / demonstração — gatilho determinístico, nunca depende do Claude
    // "lembrar" de mostrar. Portfólio (screenshots de loja) só faz sentido pra
    // e-commerce; pra clínica/veterinário/serviço a prova certa é a DEMO do sistema.
    const proofTrigger = detectProofTrigger(messageText);
    if (proofTrigger) {
      let segmento: string | null = null;
      try {
        segmento = JSON.parse(sdrResult.leadUpdate.notes ?? lead.notes ?? "{}")?.segmento ?? null;
      } catch {
        segmento = null;
      }
      const recognizedNiche = (segmento ? inferNiche(segmento) : null) ?? inferNiche(messageText);
      // Portfólio (screenshots de loja) só prova algo pra e-commerce. Pra outros
      // segmentos NÃO manda site de loja aleatório e NÃO dispara a demo sozinho —
      // o SDR OFERECE a demo no texto (nunca automática); quando o cliente aceitar
      // ("pode mostrar", "quero ver"), o gatilho de demo abaixo envia o link.
      const isIrrelevantPortfolio = proofTrigger === "portfolio" && !recognizedNiche;
      if (!isIrrelevantPortfolio) {
        const images = pickProofImages(proofTrigger, recognizedNiche);
        for (const imageUrl of images) {
          await sendPresence(phone, "composing");
          await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1500));
          await sendPresence(phone, "paused");
          await sendWhatsAppImage(phone, imageUrl);
        }
      }
    }

    // Demo enviada SÓ quando o cliente pede pra ver / aceita a oferta ("quero ver o
    // painel", "pode mostrar"). Nunca automática — a OFERTA é feita pelo SDR no texto.
    if (detectDemoTrigger(messageText)) {
      await sendPresence(phone, "composing");
      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1500));
      await sendPresence(phone, "paused");
      await sendWhatsAppMessage(phone, buildDemoMessage());
    }

    await saveMessage({
      lead_id: lead.id,
      content: sdrResult.message,
      role: "aurora",
      timestamp: new Date().toISOString(),
      status: "sent",
    });

    // Dashboard de demonstração — só quando o cliente pede pra ver o sistema
    // funcionando, e só uma vez por lead (marca demo_sent em notes pra não
    // ficar repetindo o link toda vez que ele mencionar algo parecido).
    let notesObj: Record<string, unknown> = {};
    try {
      notesObj = JSON.parse(sdrResult.leadUpdate.notes ?? lead.notes ?? "{}") ?? {};
    } catch {
      notesObj = {};
    }
    const demoTriggered = detectDemoTrigger(messageText);
    if (demoTriggered && !notesObj.demo_sent) {
      await sendPresence(phone, "composing");
      await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 1200));
      await sendPresence(phone, "paused");
      await sendWhatsAppMessage(phone, buildDemoMessage());
      notesObj.demo_sent = true;
    }

    // Confirmação de pagamento: nunca depende do Claude lembrar de avisar —
    // marca fechado no CRM e notifica o Seven de verdade, pra ele criar o
    // grupo do WhatsApp e assumir o projeto (a promessa do pós-venda só vale
    // se um humano realmente agir).
    const paymentConfirmed =
      wantsPaymentConfirmation(messageText) &&
      (lead.status === "proposta" || lead.status === "negociacao");

    await updateLead(lead.id, {
      ...sdrResult.leadUpdate,
      ...(demoTriggered && notesObj.demo_sent ? { notes: JSON.stringify(notesObj) } : {}),
      ...(paymentConfirmed ? { status: "fechado" as const } : {}),
      name: senderName ?? lead.name,
    });

    if (paymentConfirmed) {
      const closedMsg = `💰 *Pagamento confirmado — Ação Necessária*\n\n*Cliente:* ${lead.name || phone}\n*Telefone:* ${phone}\n\nCriar o grupo do WhatsApp e assumir o projeto diretamente.`;
      await Promise.all([
        notifyResponsible(phone, closedMsg),
        createCrmNotification({
          type: "closed",
          title: `Venda fechada — ${senderName ?? phone}`,
          body: "Cliente enviou comprovante de pagamento. Criar grupo do WhatsApp e assumir o atendimento.",
          lead_id: lead.id,
        }),
      ]);
    }

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
