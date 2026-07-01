/**
 * Memória de leads — persistência e recuperação via Supabase
 * Armazena perfil, histórico e classificação de cada contato
 */

import { createClient } from "@supabase/supabase-js";
import type { Lead, Message, ContactProfile } from "@/types";
import type { ContactType } from "@/types";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ── Buscar ou criar lead pelo telefone ───────────────────────────────────────

export async function findOrCreateLead(
  phone: string,
  name?: string
): Promise<Lead> {
  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from("leads")
    .select("*")
    .eq("phone", phone)
    .single();

  if (existing) return existing as Lead;

  const newLead: Omit<Lead, "id"> = {
    name: name || phone,
    phone,
    status: "novo",
    temperature: "cold",
    score: 0,
    tags: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    last_message_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("leads")
    .insert(newLead)
    .select()
    .single();

  if (error) throw new Error(`Erro ao criar lead: ${error.message}`);
  return data as Lead;
}

// ── Atualizar lead ────────────────────────────────────────────────────────────

export async function updateLead(
  id: string,
  updates: Partial<Lead>
): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("leads")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(`Erro ao atualizar lead: ${error.message}`);
}

// ── Buscar histórico de mensagens ─────────────────────────────────────────────

export async function getLeadHistory(leadId: string, limit = 20): Promise<Message[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("lead_id", leadId)
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data as Message[]).reverse();
}

// ── Salvar mensagem ───────────────────────────────────────────────────────────

export async function saveMessage(message: Omit<Message, "id">): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("messages").insert(message);
  if (error) console.error("Erro ao salvar mensagem:", error.message);
}

// ── Buscar ou criar perfil de contato ────────────────────────────────────────

export async function getContactProfile(phone: string): Promise<ContactProfile | null> {
  const supabase = getSupabase();
  const { data } = await supabase
    .from("contact_profiles")
    .select("*")
    .eq("phone", phone)
    .single();
  if (!data) return null;
  return {
    phone: data.phone,
    name: data.name,
    contactType: data.contact_type,
    isBlocked: data.is_blocked,
    isGroup: data.is_group,
    messageFrequency: data.message_frequency,
    firstSeen: data.first_seen,
    lastSeen: data.last_seen,
    tags: data.tags,
  } as ContactProfile;
}

export async function upsertContactProfile(
  profile: Partial<ContactProfile> & { phone: string }
): Promise<void> {
  const supabase = getSupabase();
  const row: Record<string, unknown> = { phone: profile.phone };
  if (profile.name !== undefined)            row.name = profile.name;
  if (profile.contactType !== undefined)     row.contact_type = profile.contactType;
  if (profile.isBlocked !== undefined)       row.is_blocked = profile.isBlocked;
  if (profile.isGroup !== undefined)         row.is_group = profile.isGroup;
  if (profile.messageFrequency !== undefined) row.message_frequency = profile.messageFrequency;
  if (profile.firstSeen !== undefined)       row.first_seen = profile.firstSeen;
  if (profile.lastSeen !== undefined)        row.last_seen = profile.lastSeen;
  if (profile.tags !== undefined)            row.tags = profile.tags;

  const { error } = await supabase
    .from("contact_profiles")
    .upsert(row, { onConflict: "phone" });
  if (error) console.error("Erro ao salvar perfil:", error.message);
}

// ── Verificar se é contato bloqueado ─────────────────────────────────────────

export async function isContactBlocked(phone: string): Promise<boolean> {
  const profile = await getContactProfile(phone);
  if (!profile) return false;
  if (profile.isBlocked) return true;

  const NO_RESPOND_TYPES: ContactType[] = [
    "amigo", "familiar", "contato_pessoal", "parceiro", "fornecedor", "spam",
  ];
  return NO_RESPOND_TYPES.includes(profile.contactType);
}

// ── Criar notificação no CRM ──────────────────────────────────────────────────

export async function createCrmNotification(notification: {
  type: string;
  title: string;
  body: string;
  lead_id?: string;
}): Promise<void> {
  const supabase = getSupabase();
  const { error } = await supabase.from("notifications").insert({
    ...notification,
    read: false,
    created_at: new Date().toISOString(),
  });
  if (error) console.error("Erro ao criar notificação:", error.message);
}
