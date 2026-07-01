/**
 * uazapi / uaizap API client — server-side only.
 * Tokens NUNCA expostos ao cliente; use via API routes proxy em /api/uazapi/*.
 * Suporta config runtime (via /api/uazapi/config) além das env vars.
 */

const _env = {
  baseUrl:       (process.env.UAZAPI_BASE_URL        || "").replace(/\/$/, ""),
  instanceToken:  process.env.UAZAPI_INSTANCE_TOKEN   || "",
  adminToken:     process.env.UAZAPI_ADMIN_TOKEN       || "",
};

let _runtime = { baseUrl: "", instanceToken: "", adminToken: "" };

export function setRuntimeConfig(cfg: {
  baseUrl?: string;
  instanceToken?: string;
  adminToken?: string;
}) {
  if (cfg.baseUrl       !== undefined) _runtime.baseUrl        = cfg.baseUrl.replace(/\/$/, "");
  if (cfg.instanceToken !== undefined) _runtime.instanceToken  = cfg.instanceToken;
  if (cfg.adminToken    !== undefined) _runtime.adminToken     = cfg.adminToken;
}

export function getRuntimeConfig() {
  return {
    baseUrl:       _runtime.baseUrl       || _env.baseUrl,
    instanceToken: _runtime.instanceToken || _env.instanceToken,
    adminToken:    _runtime.adminToken    || _env.adminToken,
  };
}

export function normalizeNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits.startsWith("55")) return `55${digits}`;
  return digits;
}

async function api<T = unknown>(
  path: string,
  opts: RequestInit & { useAdmin?: boolean } = {},
): Promise<T> {
  const { useAdmin, ...fetchOpts } = opts;
  const c = getRuntimeConfig();
  const res = await fetch(`${c.baseUrl}${path}`, {
    ...fetchOpts,
    headers: {
      "Content-Type": "application/json",
      token: useAdmin ? c.adminToken : c.instanceToken,
      ...(fetchOpts.headers as Record<string, string> | undefined),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`uazapi ${path} → ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

/* ── Instance ─────────────────────────────────────────────── */

export type InstanceStatus = "open" | "connecting" | "close" | "qr";

export interface StatusResponse {
  status: InstanceStatus;
}

export interface ConnectResponse {
  qrcode: string;
  pairingCode?: string;
}

export interface ProfileResponse {
  name: string;
  phone: string;
  about?: string;
  profilePicUrl?: string;
}

export function getStatus() {
  return api<StatusResponse>("/instance/status");
}

export function getQRCode() {
  return api<ConnectResponse>("/instance/connect");
}

export function getProfile() {
  return api<ProfileResponse>("/instance/profile");
}

export function restartInstance() {
  return api<{ ok: boolean }>("/instance/restart", { method: "POST" });
}

export function logoutInstance() {
  return api<{ ok: boolean }>("/instance/logout", { method: "DELETE" });
}

/* ── Send ─────────────────────────────────────────────────── */

export interface SendResult {
  id?: string;
  messageId?: string;
  status?: string;
}

export function sendText(number: string, text: string, linkPreview = false) {
  return api<SendResult>("/send/text", {
    method: "POST",
    body: JSON.stringify({ number: normalizeNumber(number), text, linkPreview }),
  });
}

export function sendImage(number: string, image: string, caption?: string) {
  return api<SendResult>("/send/image", {
    method: "POST",
    body: JSON.stringify({ number: normalizeNumber(number), image, caption }),
  });
}

export function sendDocument(number: string, document: string, fileName: string, caption?: string) {
  return api<SendResult>("/send/document", {
    method: "POST",
    body: JSON.stringify({ number: normalizeNumber(number), document, fileName, caption }),
  });
}

export function sendAudio(number: string, audio: string, ptt = true) {
  return api<SendResult>("/send/audio", {
    method: "POST",
    body: JSON.stringify({ number: normalizeNumber(number), audio, ptt }),
  });
}

export function sendPresence(number: string, presence: "composing" | "recording" | "paused") {
  return api<{ ok: boolean }>("/send/presence", {
    method: "POST",
    body: JSON.stringify({ number: normalizeNumber(number), presence }),
  });
}

export function sendReaction(number: string, messageId: string, emoji: string) {
  return api<SendResult>("/send/reaction", {
    method: "POST",
    body: JSON.stringify({ number: normalizeNumber(number), messageId, emoji }),
  });
}

export function markAsRead(number: string, messageId: string) {
  return api<{ ok: boolean }>("/send/read", {
    method: "PUT",
    body: JSON.stringify({ number: normalizeNumber(number), messageId }),
  });
}

/* ── Check number ─────────────────────────────────────────── */

export interface CheckNumberResponse {
  exists: boolean;
  jid: string;
}

export function checkNumber(number: string) {
  return api<CheckNumberResponse>(`/chat/check-number?number=${normalizeNumber(number)}`);
}

/* ── Chatbot ─────────────────────────────────────────────── */

export type AIProvider = "openai" | "anthropic" | "google" | "deepseek";

export interface ChatbotSettings {
  enabled: boolean;
  aiProvider: AIProvider;
  apiKey?: string;
  model: string;
  systemPrompt: string;
  stopBotKeyword?: string;
  inactivityTimeout?: number;
}

export function getChatbotSettings() {
  return api<ChatbotSettings>("/chatbot/settings");
}

export function updateChatbotSettings(settings: Partial<ChatbotSettings>) {
  return api<{ ok: boolean }>("/chatbot/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}

/* ── Webhook ─────────────────────────────────────────────── */

export interface WebhookConfig {
  webhookUrl: string;
  events: string[];
}

export function getWebhook() {
  return api<WebhookConfig>("/webhook");
}

export function setWebhook(webhookUrl: string, events = ["message", "message_status", "connection"]) {
  return api<{ ok: boolean }>("/webhook", {
    method: "PUT",
    body: JSON.stringify({ webhookUrl, events }),
  });
}

/* ── Webhook event types ─────────────────────────────────── */

export interface WebhookMessageData {
  id: string;
  from: string;
  fromMe: boolean;
  to: string;
  body: string;
  type: "text" | "image" | "video" | "audio" | "document" | "sticker" | "button_reply" | "list_reply" | "location" | string;
  timestamp: number;
  pushName?: string;
  isGroup: boolean;
  groupJid?: string | null;
  quotedMessage?: unknown;
  media?: {
    url?: string;
    mimeType?: string;
    fileSize?: number;
    fileName?: string;
  } | null;
  buttonId?: string;
  listRowId?: string;
}

export interface WebhookStatusData {
  messageId: string;
  to: string;
  status: "sent" | "delivered" | "read" | "failed";
  timestamp: number;
}

export interface WebhookConnectionData {
  status: InstanceStatus;
  timestamp: number;
}

export interface WebhookEvent {
  instance: string;
  event: "message" | "message_status" | "connection" | "group_participant" | "call" | string;
  data: WebhookMessageData | WebhookStatusData | WebhookConnectionData | Record<string, unknown>;
}

/* ── Campaigns ───────────────────────────────────────────── */

export interface SimpleCampaignPayload {
  name: string;
  numbers: string[];
  messageType: "text" | "image" | "video";
  message: string;
  delayMin?: number;
  delayMax?: number;
  scheduledAt?: string;
}

export function createSimpleCampaign(payload: SimpleCampaignPayload) {
  return api<{ campaignId: string }>("/campaign/simple", {
    method: "POST",
    body: JSON.stringify({
      ...payload,
      numbers: payload.numbers.map(normalizeNumber),
      delayMin: payload.delayMin ?? 10,
      delayMax: payload.delayMax ?? 30,
    }),
  });
}

export function listCampaigns() {
  return api<Array<{ id: string; name: string; status: string; sent: number; total: number }>>("/campaign/list");
}

/* ── Config guard ────────────────────────────────────────── */

export function isConfigured(): boolean {
  const c = getRuntimeConfig();
  return Boolean(c.baseUrl && c.instanceToken);
}
