/**
 * In-memory store para mensagens recebidas via webhook.
 * Módulo-nível = persiste no mesmo processo Node.js.
 * Em produção escalável, substituir por Redis/Supabase.
 */

export interface StoredMessage {
  id: string;
  from: string;
  fromMe: boolean;
  body: string;
  type: string;
  timestamp: number;
  pushName?: string;
  mediaUrl?: string;
  mimeType?: string;
  fileName?: string;
}

const messages = new Map<string, StoredMessage[]>();
let connectionStatus: "open" | "connecting" | "close" | "qr" = "close";
const MAX_PER_CONTACT = 100;

export function storeMessage(number: string, msg: StoredMessage) {
  const key = number.replace(/\D/g, "");
  if (!messages.has(key)) messages.set(key, []);
  const arr = messages.get(key)!;
  if (!arr.find((m) => m.id === msg.id)) {
    arr.push(msg);
    if (arr.length > MAX_PER_CONTACT) arr.splice(0, arr.length - MAX_PER_CONTACT);
  }
}

export function getMessages(number: string): StoredMessage[] {
  return messages.get(number.replace(/\D/g, "")) ?? [];
}

export function setConnectionStatus(status: "open" | "connecting" | "close" | "qr") {
  connectionStatus = status;
}

export function getConnectionStatus() {
  return connectionStatus;
}

export function getAllConversations(): Array<{ number: string; lastMessage: StoredMessage }> {
  const result: Array<{ number: string; lastMessage: StoredMessage }> = [];
  for (const [number, msgs] of messages.entries()) {
    if (msgs.length > 0) {
      result.push({ number, lastMessage: msgs[msgs.length - 1] });
    }
  }
  return result.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
}
