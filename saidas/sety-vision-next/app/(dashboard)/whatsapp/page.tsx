"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { Modal } from "@/app/components/ui/Modal";
import { useToast } from "@/app/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";
import { EASE } from "@/lib/motion";
import {
  Search, Send, Paperclip, Smile, Phone, Video, MoreHorizontal, Bot,
  Check, CheckCheck, Plus, X, User, Wifi, WifiOff, QrCode, Settings,
  RefreshCw, Copy, ExternalLink, ChevronRight,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */

type ConnStatus = "open" | "connecting" | "close" | "qr" | "not_configured";

type Message = {
  id: string;
  from: "contact" | "bot" | "user";
  text: string;
  time: string;
  read: boolean;
  mediaUrl?: string;
  mimeType?: string;
};

type Conv = {
  name: string;
  phone: string;
  last: string;
  time: string;
  unread: number;
  online: boolean;
  avatar: string;
  grad: string;
  ai: boolean;
  messages: Message[];
};

/* ─── Mock seed (mostrado antes de mensagens reais chegarem) ─ */

const SEED_CONVS: Conv[] = [
  {
    name: "Ana Paula Ribeiro", phone: "5511998765432",
    last: "Adorei a proposta! Quando podemos agendar?",
    time: "14:23", unread: 2, online: true, avatar: "A", grad: "from-[#7C3AED] to-[#EC4899]", ai: false,
    messages: [
      { id: "m1", from: "contact", text: "Olá! Vi o anúncio sobre o CRM com IA. Quero saber mais.", time: "13:40", read: true },
      { id: "m2", from: "bot", text: "Olá, Ana Paula! Sou a assistente da Sety Vision 🤖\n\nO Sety Vision é um sistema completo de CRM + WhatsApp + automações com IA. Posso te contar mais?\n\n1️⃣ Sim, quero saber mais\n2️⃣ Prefiro falar com um especialista", time: "13:40", read: true },
      { id: "m3", from: "contact", text: "1", time: "13:42", read: true },
      { id: "m4", from: "bot", text: "Ótimo! O Sety Vision inclui:\n\n✅ CRM com IA para qualificar leads\n✅ WhatsApp integrado com bot\n✅ Pipeline visual de vendas\n✅ Relatórios em tempo real", time: "13:43", read: true },
      { id: "m5", from: "contact", text: "Adorei a proposta! Quando podemos agendar?", time: "14:23", read: false },
    ],
  },
  {
    name: "Ricardo Pires", phone: "5541965432109",
    last: "Pode confirmar o contrato amanhã?",
    time: "13:45", unread: 1, online: true, avatar: "R", grad: "from-[#D97706] to-[#DC2626]", ai: true,
    messages: [
      { id: "r1", from: "contact", text: "Boa tarde! Queria confirmar o contrato amanhã às 10h.", time: "13:43", read: true },
      { id: "r2", from: "user", text: "Confirmado, Ricardo! Amanhã às 10h. Vou te mandar a proposta finalizada hoje ainda.", time: "13:45", read: true },
      { id: "r3", from: "contact", text: "Pode confirmar o contrato amanhã?", time: "13:45", read: false },
    ],
  },
  {
    name: "Marcos Oliveira", phone: "5521987654321",
    last: "Que tal quinta-feira às 15h?",
    time: "11:30", unread: 0, online: false, avatar: "M", grad: "from-[#3B82F6] to-[#7C3AED]", ai: false,
    messages: [
      { id: "o1", from: "user", text: "Marcos, tudo bem? Gostaria de agendar uma call para apresentar a proposta completa.", time: "10:00", read: true },
      { id: "o2", from: "contact", text: "Que tal quinta-feira às 15h?", time: "11:30", read: true },
    ],
  },
];

const EMOJIS = ["😄", "👍", "🔥", "💪", "✅", "🤝", "📊", "🚀", "💡", "🎯"];

/* ─── Helpers ────────────────────────────────────────────── */

function ts() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function normalizePhone(raw: string) {
  const d = raw.replace(/\D/g, "");
  return d.startsWith("55") ? d : `55${d}`;
}

function initials(name: string) {
  return name.trim()[0]?.toUpperCase() ?? "?";
}

/* ─── Status pill ─────────────────────────────────────────── */

function ConnectionBadge({ status }: { status: ConnStatus }) {
  const map: Record<ConnStatus, { label: string; color: string; bg: string; dot: string }> = {
    open:            { label: "Conectado",        color: "#22C55E", bg: "rgba(34,197,94,0.1)",    dot: "#22C55E" },
    connecting:      { label: "Conectando...",    color: "#F59E0B", bg: "rgba(245,158,11,0.1)",   dot: "#F59E0B" },
    qr:              { label: "Aguardando QR",    color: "#F59E0B", bg: "rgba(245,158,11,0.1)",   dot: "#F59E0B" },
    close:           { label: "Desconectado",     color: "#EF4444", bg: "rgba(239,68,68,0.1)",    dot: "#EF4444" },
    not_configured:  { label: "Não configurado",  color: "#6B7280", bg: "rgba(107,114,128,0.1)",  dot: "#6B7280" },
  };
  const c = map[status] ?? map.close;
  return (
    <span className="flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold"
      style={{ background: c.bg, color: c.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}

/* ═══ Main page ══════════════════════════════════════════════ */

export default function WhatsAppPage() {
  const { success, error: toastError, info, warning } = useToast();

  const [convs, setConvs]             = useState<Conv[]>(SEED_CONVS);
  const [activeIdx, setActiveIdx]     = useState(0);
  const [msg, setMsg]                 = useState("");
  const [search, setSearch]           = useState("");
  const [emojiOpen, setEmojiOpen]     = useState(false);
  const [typing, setTyping]           = useState(false);

  const [connStatus, setConnStatus]   = useState<ConnStatus>("close");
  const [qrCode, setQrCode]           = useState<string | null>(null);
  const [qrLoading, setQrLoading]     = useState(false);
  const [profile, setProfile]         = useState<{ name?: string; phone?: string } | null>(null);
  const [sending, setSending]         = useState(false);

  // Modals
  const [qrModal, setQrModal]         = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [newConvModal, setNewConvModal]  = useState(false);
  const [newConvForm, setNewConvForm]   = useState({ name: "", phone: "" });

  // Setup wizard
  const [setupProvider, setSetupProvider] = useState("uaizap");
  const [setupUrl, setSetupUrl]           = useState("");
  const [setupToken, setSetupToken]       = useState("");
  const [setupSaving, setSetupSaving]     = useState(false);
  const [setupError, setSetupError]       = useState("");

  // Chatbot settings (carregados lazy no modal)
  const [chatbotEnabled, setChatbotEnabled]     = useState(false);
  const [chatbotProvider, setChatbotProvider]   = useState("anthropic");
  const [chatbotModel, setChatbotModel]         = useState("claude-haiku-4-5-20251001");
  const [chatbotPrompt, setChatbotPrompt]       = useState("Você é uma assistente de vendas da Sety Vision. Responda sempre em português, seja direto e profissional.");
  const [chatbotKeyword, setChatbotKeyword]     = useState("#humano");
  const [chatbotSaving, setChatbotSaving]       = useState(false);
  const [chatbotLoaded, setChatbotLoaded]       = useState(false);

  const msgContainerRef = useRef<HTMLDivElement>(null);
  const inputRef        = useRef<HTMLInputElement>(null);
  const pollRef         = useRef<ReturnType<typeof setInterval> | null>(null);

  const activeConv  = convs[activeIdx];
  const filteredConvs = convs.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  /* ── Scroll to bottom on new messages ─────────────────── */
  useEffect(() => {
    if (msgContainerRef.current)
      msgContainerRef.current.scrollTop = msgContainerRef.current.scrollHeight;
  }, [activeConv?.messages]);

  /* ── Fetch connection status on mount ────────────────── */
  const refreshStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/uazapi/status");
      const data = await res.json();
      setConnStatus(data.status as ConnStatus);
      if (data.profile) setProfile(data.profile);
    } catch {
      setConnStatus("close");
    }
  }, []);

  useEffect(() => {
    refreshStatus();
    const iv = setInterval(refreshStatus, 15_000);
    return () => clearInterval(iv);
  }, [refreshStatus]);

  /* ── Poll incoming messages every 5s ─────────────────── */
  const pollMessages = useCallback(async () => {
    if (connStatus !== "open") return;
    try {
      const res = await fetch(`/api/uazapi/messages?number=${activeConv?.phone}`);
      if (!res.ok) return;
      const { messages: incoming } = await res.json() as { messages: Array<{
        id: string; body: string; timestamp: number; fromMe: boolean; pushName?: string; type: string;
      }> };
      if (!incoming?.length) return;

      setConvs((prev) =>
        prev.map((c, i) => {
          if (i !== activeIdx) return c;
          const existingIds = new Set(c.messages.map((m) => m.id));
          const newMsgs = incoming
            .filter((m) => !existingIds.has(m.id))
            .map((m) => ({
              id: m.id,
              from: (m.fromMe ? "user" : "contact") as "user" | "contact",
              text: m.body || "",
              time: new Date(m.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
              read: m.fromMe,
            }));
          if (!newMsgs.length) return c;
          const lastMsg = newMsgs[newMsgs.length - 1];
          return {
            ...c,
            messages: [...c.messages, ...newMsgs],
            last: lastMsg.text,
            time: lastMsg.time,
            unread: c.unread + newMsgs.filter((m) => m.from === "contact").length,
          };
        })
      );
    } catch {
      // silent
    }
  }, [activeConv?.phone, activeIdx, connStatus]);

  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(pollMessages, 5_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [pollMessages]);

  /* ── QR code ─────────────────────────────────────────── */
  const fetchQR = async () => {
    setQrLoading(true);
    try {
      const res = await fetch("/api/uazapi/connect");
      const data = await res.json();
      if (data.qrcode) {
        setQrCode(data.qrcode);
        setQrModal(true);
      } else {
        warning("QR indisponível", data.error || "Verifique as configurações.");
      }
    } catch {
      toastError("Erro", "Não foi possível obter o QR code.");
    } finally {
      setQrLoading(false);
    }
  };

  /* ── Send message ─────────────────────────────────────── */
  const sendMsg = async () => {
    const text = msg.trim();
    if (!text) return;

    const optimistic: Message = {
      id: `opt-${Date.now()}`, from: "user", text, time: ts(), read: true,
    };
    setConvs((prev) =>
      prev.map((c, i) => i === activeIdx
        ? { ...c, last: text, time: ts(), messages: [...c.messages, optimistic] }
        : c)
    );
    setMsg("");

    if (connStatus === "open") {
      setSending(true);
      try {
        const res = await fetch("/api/uazapi/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ number: activeConv.phone, text }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          toastError("Falha no envio", data.error || "Tente novamente.");
        }
      } catch {
        toastError("Erro de rede", "Mensagem pode não ter sido entregue.");
      } finally {
        setSending(false);
      }
    } else if (activeConv.ai) {
      // Demo bot reply
      setTyping(true);
      setTimeout(() => {
        const botReply: Message = {
          id: `b${Date.now()}`, from: "bot",
          text: "Entendido! Estou processando sua mensagem e em breve darei uma resposta mais detalhada. Posso ajudar com mais alguma coisa? 🤖",
          time: ts(), read: true,
        };
        setConvs((prev) =>
          prev.map((c, i) => i === activeIdx
            ? { ...c, messages: [...c.messages, botReply] }
            : c)
        );
        setTyping(false);
      }, 1800);
    }
  };

  /* ── Select conversation ─────────────────────────────── */
  const selectConv = (realIdx: number) => {
    setActiveIdx(realIdx);
    setConvs((prev) => prev.map((c, i) => (i === realIdx ? { ...c, unread: 0 } : c)));
  };

  /* ── Create new conversation ─────────────────────────── */
  const createConv = () => {
    if (!newConvForm.name.trim()) return;
    const phone = normalizePhone(newConvForm.phone || "");
    const newConv: Conv = {
      name: newConvForm.name,
      phone,
      last: "Nova conversa iniciada",
      time: ts(),
      unread: 0,
      online: false,
      avatar: initials(newConvForm.name),
      grad: "from-[#7C3AED] to-[#3B82F6]",
      ai: false,
      messages: [],
    };
    setConvs((prev) => [newConv, ...prev]);
    setActiveIdx(0);
    setNewConvModal(false);
    setNewConvForm({ name: "", phone: "" });
    success("Conversa criada!", `Iniciando chat com ${newConvForm.name}`);
  };

  /* ── Load chatbot settings ───────────────────────────── */
  const loadChatbot = async () => {
    if (chatbotLoaded) return;
    try {
      const res = await fetch("/api/uazapi/chatbot");
      const data = await res.json();
      setChatbotEnabled(data.enabled ?? false);
      setChatbotProvider(data.aiProvider ?? "anthropic");
      setChatbotModel(data.model ?? "claude-haiku-4-5-20251001");
      setChatbotPrompt(data.systemPrompt ?? "");
      setChatbotKeyword(data.stopBotKeyword ?? "#humano");
      setChatbotLoaded(true);
    } catch { /* ignore */ }
  };

  /* ── Save chatbot settings ───────────────────────────── */
  const saveChatbot = async () => {
    setChatbotSaving(true);
    try {
      const res = await fetch("/api/uazapi/chatbot", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: chatbotEnabled,
          aiProvider: chatbotProvider,
          model: chatbotModel,
          systemPrompt: chatbotPrompt,
          stopBotKeyword: chatbotKeyword,
          inactivityTimeout: 1800,
        }),
      });
      if (res.ok) {
        success("Chatbot salvo!", "Configurações aplicadas.");
        setSettingsModal(false);
      } else {
        toastError("Erro", "Não foi possível salvar.");
      }
    } catch {
      toastError("Erro de rede", "Verifique sua conexão.");
    } finally {
      setChatbotSaving(false);
    }
  };

  /* ── Webhook URL ─────────────────────────────────────── */
  const webhookUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/webhook/whatsapp`
    : "/api/webhook/whatsapp";

  const copyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    info("Copiado!", "URL do webhook copiada.");
  };

  /* ── UaiZap setup wizard ─────────────────────────────── */
  const saveSetup = async () => {
    if (!setupUrl.trim() || !setupToken.trim()) {
      setSetupError("Preencha a URL e o token da instância.");
      return;
    }
    setSetupSaving(true);
    setSetupError("");
    try {
      const res = await fetch("/api/uazapi/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: setupUrl.trim(), instanceToken: setupToken.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setSetupError(data.error || "Erro ao salvar configuração.");
        return;
      }
      success("Conectado!", "Configuração salva. Aguarde o status atualizar.");
      await refreshStatus();
    } catch {
      setSetupError("Erro de rede. Verifique sua conexão.");
    } finally {
      setSetupSaving(false);
    }
  };

  /* ════════════════════════════════════════════════════════ */

  return (
    <>
      <Topbar
        title="WhatsApp"
        subtitle={`${convs.filter((c) => c.unread > 0).length} novas mensagens · ${convs.filter((c) => c.ai).length} com IA ativa`}
        action={{ label: "Nova conversa", onClick: () => setNewConvModal(true) }}
      />

      {/* ── Connection banner (close / connecting / qr only) ── */}
      <AnimatePresence>
        {connStatus !== "open" && connStatus !== "not_configured" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-3"
              style={{ background: "#0C0C10", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex items-center gap-3">
                <WifiOff size={15} className="text-[#EF4444]" />
                <span className="text-[13px]" style={{ color: "#9CA3AF" }}>
                  WhatsApp desconectado. Escaneie o QR code para reconectar.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ConnectionBadge status={connStatus} />
                <button onClick={fetchQR} disabled={qrLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold transition-colors disabled:opacity-50"
                  style={{ background: "rgba(124,58,237,0.15)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.3)" }}>
                  {qrLoading ? <RefreshCw size={12} className="animate-spin" /> : <QrCode size={12} />}
                  {qrLoading ? "Carregando..." : "Escanear QR"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex overflow-hidden relative">

        {/* ── UaiZap Setup Wizard ────────────────────────── */}
        {connStatus === "not_configured" && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-8"
            style={{ background: "#07070A" }}>
            <div style={{
              maxWidth: 480, width: "100%",
              background: "#0C0C10",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: "36px 32px",
            }}>
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "linear-gradient(135deg, #25D366, #128C7E)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M11.998 0C5.374 0 0 5.373 0 12c0 2.112.549 4.094 1.508 5.815L0 24l6.334-1.485A11.955 11.955 0 0 0 12 24c6.626 0 12-5.373 12-12S18.624 0 11.998 0zm.002 21.818a9.818 9.818 0 0 1-5.016-1.373l-.36-.213-3.76.881.923-3.657-.234-.376A9.784 9.784 0 0 1 2.182 12c0-5.415 4.403-9.818 9.818-9.818 5.414 0 9.818 4.403 9.818 9.818S17.414 21.818 12 21.818z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[15px] font-bold text-white">Conectar WhatsApp</div>
                  <div className="text-[12px] mt-0.5" style={{ color: "#6B7280" }}>via UaiZap · uaizap.net</div>
                </div>
              </div>

              {/* Provider selector */}
              <div className="mb-5">
                <label className="text-[11px] font-semibold uppercase tracking-wider block mb-2.5" style={{ color: "#6B7280" }}>
                  Provedor de API
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {([
                    { id: "uaizap",    label: "UaiZap",       hint: "uaizap.net" },
                    { id: "evolution", label: "Evolution",     hint: "evolutionapi.com" },
                    { id: "meta",      label: "Cloud API Meta",hint: "graph.facebook.com" },
                    { id: "ultramsg",  label: "UltraMsg",     hint: "ultramsg.com" },
                    { id: "wppconn",   label: "WPPConnect",   hint: "self-hosted" },
                    { id: "greenapi",  label: "Green API",    hint: "green-api.com" },
                  ] as const).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSetupProvider(p.id)}
                      className="text-left px-3 py-2.5 rounded-xl transition-all"
                      style={{
                        background: setupProvider === p.id ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.03)",
                        border: setupProvider === p.id ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div className="text-[11px] font-semibold" style={{ color: setupProvider === p.id ? "#A78BFA" : "#9CA3AF" }}>{p.label}</div>
                      <div className="text-[9px] mt-0.5" style={{ color: setupProvider === p.id ? "rgba(167,139,250,0.6)" : "#4B5563" }}>{p.hint}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "#6B7280" }}>
                    {setupProvider === "meta" ? "Número da conta" : "URL da instância / API"}
                  </label>
                  <input
                    type="url"
                    placeholder={
                      setupProvider === "uaizap"    ? "https://app.uaizap.net/instancia" :
                      setupProvider === "evolution" ? "https://seudominio.evolutionapi.com" :
                      setupProvider === "meta"      ? "https://graph.facebook.com/v19.0" :
                      setupProvider === "ultramsg"  ? "https://api.ultramsg.com/instance" :
                      setupProvider === "wppconn"   ? "https://seudominio.com" :
                                                     "https://api.green-api.com/waInstance123"
                    }
                    value={setupUrl}
                    onChange={(e) => setSetupUrl(e.target.value)}
                    className="w-full rounded-xl px-4 py-2.5 text-[13px] text-white placeholder-[#4B5563] outline-none transition-colors"
                    style={{ background: "#18181B", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider block mb-1.5" style={{ color: "#6B7280" }}>
                    {setupProvider === "meta" ? "Access Token" : setupProvider === "evolution" ? "API Key" : "Token da instância"}
                  </label>
                  <input
                    type="password"
                    placeholder={
                      setupProvider === "meta" ? "EAAxxxxx..." :
                      setupProvider === "evolution" ? "Sua API key do painel" :
                      "Cole seu token aqui"
                    }
                    value={setupToken}
                    onChange={(e) => setSetupToken(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveSetup(); }}
                    className="w-full rounded-xl px-4 py-2.5 text-[13px] text-white placeholder-[#4B5563] outline-none transition-colors"
                    style={{ background: "#18181B", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                </div>
              </div>

              {setupError && (
                <div className="text-[12px] mb-3 px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}>
                  {setupError}
                </div>
              )}

              <button
                onClick={saveSetup}
                disabled={setupSaving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold text-white transition-colors disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}
              >
                {setupSaving
                  ? <><RefreshCw size={14} className="animate-spin" /> Conectando...</>
                  : <><Wifi size={14} /> Conectar WhatsApp</>
                }
              </button>

              <p className="text-center text-[11px] mt-4" style={{ color: "#4B5563" }}>
                Prefere usar variáveis de ambiente?{" "}
                <span style={{ color: "#6B7280" }}>Configure UAZAPI_BASE_URL e UAZAPI_INSTANCE_TOKEN na Vercel.</span>
              </p>
            </div>
          </div>
        )}

        {/* ── Conv sidebar ───────────────────────────────── */}
        <div className="w-72 shrink-0 flex flex-col" style={{ borderRight: "1px solid rgba(255,255,255,0.06)", background: "#0C0C10" }}>
          <div className="p-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <Search size={13} className="text-[#6B7280]" />
              <input className="flex-1 bg-transparent text-[13px] text-white placeholder-[#6B7280] outline-none"
                placeholder="Buscar conversa..." value={search} onChange={(e) => setSearch(e.target.value)} />
              {search && (
                <button onClick={() => setSearch("")} className="text-[#4B5563] hover:text-white">
                  <X size={11} />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConvs.length === 0 && (
              <div className="text-center py-10 text-[12px] text-[#4B5563]">Nenhuma conversa encontrada</div>
            )}
            {filteredConvs.map((conv) => {
              const realIdx = convs.indexOf(conv);
              return (
                <div key={conv.phone + conv.name} onClick={() => selectConv(realIdx)}
                  className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-all ${activeIdx === realIdx ? "bg-[rgba(124,58,237,0.08)]" : "hover:bg-white/[0.02]"}`}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="relative shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-bold bg-gradient-to-br ${conv.grad} text-white`}>
                      {conv.avatar}
                    </div>
                    {conv.online && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#22C55E]"
                        style={{ border: "2px solid #0C0C10" }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-semibold text-white truncate">{conv.name}</span>
                      <span className="text-[10px] text-[#6B7280] shrink-0 ml-2">{conv.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {conv.ai && <Bot size={10} className="text-[#A78BFA] shrink-0" />}
                      <span className="text-[12px] text-[#6B7280] truncate">{conv.last}</span>
                    </div>
                  </div>
                  {conv.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#22C55E] text-[10px] font-bold flex items-center justify-center shrink-0"
                      style={{ color: "#050505" }}>
                      {conv.unread}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button onClick={() => setNewConvModal(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-semibold transition-colors"
              style={{ background: "rgba(124,58,237,0.1)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.2)" }}>
              <Plus size={13} /> Nova conversa
            </button>
            <button onClick={() => { loadChatbot(); setSettingsModal(true); }}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] transition-colors"
              style={{ background: "rgba(255,255,255,0.03)", color: "#6B7280", border: "1px solid rgba(255,255,255,0.06)" }}>
              <Settings size={12} /> Configurar chatbot
            </button>
          </div>
        </div>

        {/* ── Chat area ──────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3.5"
            style={{ background: "#0C0C10", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold bg-gradient-to-br ${activeConv.grad} text-white`}>
                {activeConv.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-semibold text-white">{activeConv.name}</span>
                  {activeConv.ai && (
                    <span className="flex items-center gap-0.5 text-[10px] text-[#A78BFA] rounded-full px-2 py-0.5"
                      style={{ background: "rgba(124,58,237,0.1)" }}>
                      <Bot size={9} /> IA ativa
                    </span>
                  )}
                </div>
                <div className="text-[11px] flex items-center gap-1.5">
                  {activeConv.online
                    ? <><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" /><span className="text-[#22C55E]">Online agora</span></>
                    : <span className="text-[#6B7280]">{activeConv.phone}</span>
                  }
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ConnectionBadge status={connStatus} />
              {[{ icon: Phone, label: "Ligar" }, { icon: Video, label: "Vídeo" }, { icon: MoreHorizontal, label: "Mais" }].map(({ icon: Icon, label }) => (
                <button key={label} onClick={() => info(label, activeConv.name)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-[#6B7280] hover:text-white hover:bg-white/[0.08] transition-colors"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div ref={msgContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4"
            style={{ background: "linear-gradient(180deg, #050505 0%, #08080D 100%)" }}>
            <AnimatePresence initial={false}>
              {activeConv.messages.map((m) => (
                <motion.div key={m.id}
                  initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: EASE }}
                  className={`flex ${m.from === "contact" ? "justify-start" : "justify-end"}`}>
                  {m.from === "bot" && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-auto shrink-0"
                      style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}>
                      <Bot size={11} className="text-[#A78BFA]" />
                    </div>
                  )}
                  <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${m.from === "contact" ? "rounded-tl-sm" : "rounded-tr-sm"}`}
                    style={{
                      background: m.from === "contact" ? "#18181B"
                        : m.from === "bot" ? "rgba(124,58,237,0.12)" : "#7C3AED",
                      border: m.from === "bot"
                        ? "1px solid rgba(124,58,237,0.2)"
                        : "1px solid rgba(255,255,255,0.04)",
                    }}>
                    {m.from === "bot" && (
                      <div className="text-[10px] text-[#A78BFA] font-semibold mb-1 flex items-center gap-1">
                        <Bot size={9} /> Assistente IA
                      </div>
                    )}
                    {m.mediaUrl && m.mimeType?.startsWith("image") && (
                      <img src={m.mediaUrl} alt="mídia" className="rounded-xl mb-2 max-w-[240px]" />
                    )}
                    <p className="text-[13px] text-[#E5E7EB] leading-[1.6] whitespace-pre-line">{m.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1.5">
                      <span className="text-[10px] text-[#6B7280]">{m.time}</span>
                      {m.from !== "contact" && (
                        m.read
                          ? <CheckCheck size={11} className="text-[#7C3AED]" />
                          : <Check size={11} className="text-[#6B7280]" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {typing && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-end">
                <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl rounded-tr-sm"
                  style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)" }}>
                  <Bot size={11} className="text-[#A78BFA]" />
                  {[0, 1, 2].map((i) => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[#A78BFA]"
                      animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Offline notice */}
            {connStatus !== "open" && connStatus !== "not_configured" && (
              <div className="flex justify-center">
                <span className="text-[11px] px-3 py-1.5 rounded-full" style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444" }}>
                  WhatsApp desconectado — mensagens serão enviadas quando reconectar
                </span>
              </div>
            )}
          </div>

          {/* Emoji picker */}
          <AnimatePresence>
            {emojiOpen && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                className="px-4 pb-1 flex gap-1 flex-wrap" style={{ background: "#0C0C10" }}>
                {EMOJIS.map((e) => (
                  <button key={e} onClick={() => { setMsg((p) => p + e); inputRef.current?.focus(); }}
                    className="w-8 h-8 rounded-lg text-lg hover:bg-white/[0.08] transition-colors flex items-center justify-center">{e}</button>
                ))}
                <button onClick={() => setEmojiOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/[0.08] flex items-center justify-center text-[#4B5563] hover:text-white ml-auto">
                  <X size={11} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input bar */}
          <div className="p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#0C0C10" }}>
            <div className="flex items-center gap-3">
              <button onClick={() => info("Anexo", "Selecione um arquivo")}
                className="text-[#6B7280] hover:text-white transition-colors shrink-0">
                <Paperclip size={18} />
              </button>
              <div className="flex-1 rounded-2xl px-4 py-2.5 flex items-center gap-2"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <input ref={inputRef} value={msg} onChange={(e) => setMsg(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg(); } }}
                  placeholder="Digite uma mensagem... (Enter para enviar)"
                  className="flex-1 bg-transparent text-[14px] text-white placeholder-[#6B7280] outline-none" />
                <button onClick={() => setEmojiOpen((v) => !v)} className="text-[#6B7280] hover:text-white transition-colors shrink-0">
                  <Smile size={16} />
                </button>
              </div>
              <motion.button onClick={sendMsg} disabled={sending}
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors disabled:opacity-60"
                style={{ background: msg.trim() ? "#7C3AED" : "rgba(124,58,237,0.3)" }}
                whileHover={msg.trim() ? { scale: 1.05 } : {}}
                whileTap={msg.trim() ? { scale: 0.95 } : {}}>
                {sending ? <RefreshCw size={14} className="text-white animate-spin" /> : <Send size={16} className="text-white" />}
              </motion.button>
            </div>
          </div>
        </div>
      </main>

      {/* ═══ QR CODE MODAL ═════════════════════════════════════ */}
      <Modal open={qrModal} onClose={() => setQrModal(false)} title="Conectar WhatsApp" subtitle="Escaneie o QR code com o WhatsApp do seu celular" size="sm"
        footer={
          <button onClick={() => { setQrModal(false); refreshStatus(); }}
            className="px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white bg-[#7C3AED] hover:bg-[#8B5CF6] transition-colors">
            Já escaniei
          </button>
        }>
        <div className="flex flex-col items-center gap-4">
          {qrCode ? (
            <>
              <div className="rounded-2xl p-3 bg-white">
                <img
                  src={qrCode.startsWith("data:") ? qrCode : `data:image/png;base64,${qrCode}`}
                  alt="QR Code WhatsApp"
                  className="w-56 h-56"
                />
              </div>
              <p className="text-[12px] text-[#6B7280] text-center">
                Abra o WhatsApp → Dispositivos vinculados → Vincular dispositivo
              </p>
              <button onClick={fetchQR}
                className="flex items-center gap-1.5 text-[12px] text-[#A78BFA] hover:text-white transition-colors">
                <RefreshCw size={12} /> Gerar novo QR
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 py-8 text-[#6B7280]">
              <RefreshCw size={16} className="animate-spin" />
              <span className="text-[13px]">Carregando QR code...</span>
            </div>
          )}
        </div>
      </Modal>

      {/* ═══ CHATBOT SETTINGS MODAL ════════════════════════════ */}
      <Modal open={settingsModal} onClose={() => setSettingsModal(false)}
        title="Configurações do Chatbot" subtitle="Defina o comportamento da IA no WhatsApp"
        size="lg"
        footer={
          <div className="flex items-center gap-3">
            <button onClick={() => setSettingsModal(false)}
              className="px-4 py-2 rounded-xl text-[12px] text-[#6B7280] transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              Cancelar
            </button>
            <button onClick={saveChatbot} disabled={chatbotSaving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-[#7C3AED] hover:bg-[#8B5CF6] transition-colors disabled:opacity-60">
              {chatbotSaving && <RefreshCw size={11} className="animate-spin" />}
              Salvar configurações
            </button>
          </div>
        }>
        <div className="space-y-5">

          {/* Toggle on/off */}
          <div className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <div className="text-[13px] font-semibold text-white">Chatbot com IA</div>
              <div className="text-[11px] text-[#6B7280] mt-0.5">Responde automaticamente às mensagens recebidas</div>
            </div>
            <button onClick={() => setChatbotEnabled((v) => !v)}
              className="relative w-10 h-5 rounded-full transition-all duration-200"
              style={{ background: chatbotEnabled ? "#7C3AED" : "rgba(255,255,255,0.08)" }}>
              <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
                style={{ left: chatbotEnabled ? "calc(100% - 18px)" : "2px" }} />
            </button>
          </div>

          {/* AI Provider */}
          <div>
            <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-2">Provedor de IA</label>
            <div className="grid grid-cols-2 gap-2">
              {(["anthropic", "openai", "google", "deepseek"] as const).map((p) => (
                <button key={p} onClick={() => setChatbotProvider(p)}
                  className="py-2.5 px-4 rounded-xl text-[13px] font-medium capitalize transition-colors"
                  style={{
                    background: chatbotProvider === p ? "rgba(124,58,237,0.15)" : "rgba(255,255,255,0.03)",
                    border: chatbotProvider === p ? "1px solid rgba(124,58,237,0.4)" : "1px solid rgba(255,255,255,0.06)",
                    color: chatbotProvider === p ? "#A78BFA" : "#6B7280",
                  }}>
                  {p === "anthropic" ? "Claude (Anthropic)" : p === "openai" ? "GPT (OpenAI)" : p === "google" ? "Gemini (Google)" : "DeepSeek"}
                </button>
              ))}
            </div>
          </div>

          {/* Model */}
          <div>
            <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-2">Modelo</label>
            <select value={chatbotModel} onChange={(e) => setChatbotModel(e.target.value)}
              className="w-full rounded-xl px-4 py-2.5 text-[13px] text-white outline-none transition-colors"
              style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.08)" }}>
              {chatbotProvider === "anthropic" && <>
                <option value="claude-haiku-4-5-20251001">Claude Haiku 4.5 (rápido · barato)</option>
                <option value="claude-sonnet-4-6">Claude Sonnet 4.6 (equilibrado)</option>
              </>}
              {chatbotProvider === "openai" && <>
                <option value="gpt-4o-mini">GPT-4o mini (rápido · barato)</option>
                <option value="gpt-4o">GPT-4o (avançado)</option>
              </>}
              {chatbotProvider === "google" && <>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              </>}
              {chatbotProvider === "deepseek" && <>
                <option value="deepseek-chat">DeepSeek Chat</option>
                <option value="deepseek-reasoner">DeepSeek Reasoner</option>
              </>}
            </select>
          </div>

          {/* System prompt */}
          <div>
            <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-2">Prompt do sistema</label>
            <textarea value={chatbotPrompt} onChange={(e) => setChatbotPrompt(e.target.value)}
              rows={4} placeholder="Descreva como a IA deve se comportar, qual empresa representa, tom de voz, limitações..."
              className="w-full rounded-xl px-4 py-3 text-[13px] text-white placeholder-[#4B5563] outline-none transition-colors resize-none"
              style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.08)" }} />
          </div>

          {/* Stop keyword */}
          <div>
            <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-2">Palavra para desativar o bot</label>
            <input value={chatbotKeyword} onChange={(e) => setChatbotKeyword(e.target.value)}
              placeholder="#humano"
              className="w-full rounded-xl px-4 py-2.5 text-[13px] text-white placeholder-[#4B5563] outline-none"
              style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.08)" }} />
            <p className="text-[11px] text-[#4B5563] mt-1.5">Quando enviada pelo operador, desativa o bot para aquele chat.</p>
          </div>

          {/* Webhook URL info */}
          <div className="rounded-xl p-4" style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <div className="text-[11px] font-semibold text-[#A78BFA] mb-2 flex items-center gap-1.5">
              <ExternalLink size={11} /> URL do Webhook (cole no painel uazapi)
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-[11px] text-[#E5E7EB] truncate">{webhookUrl}</code>
              <button onClick={copyWebhook}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors"
                style={{ background: "rgba(124,58,237,0.15)", color: "#A78BFA" }}>
                <Copy size={10} /> Copiar
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* ═══ NEW CONV MODAL ════════════════════════════════════ */}
      <Modal open={newConvModal} onClose={() => setNewConvModal(false)}
        title="Nova conversa" subtitle="Inicia uma nova thread no WhatsApp" size="sm"
        footer={
          <>
            <button onClick={() => setNewConvModal(false)}
              className="px-4 py-2 rounded-xl text-[12px] text-[#6B7280] transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              Cancelar
            </button>
            <button onClick={createConv}
              className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-[#7C3AED] hover:bg-[#8B5CF6] transition-colors">
              Iniciar
            </button>
          </>
        }>
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">Nome *</label>
            <div className="relative">
              <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" />
              <input type="text" placeholder="Nome do contato" value={newConvForm.name}
                onChange={(e) => setNewConvForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(124,58,237,0.5)] transition-colors"
                style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">WhatsApp</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563] text-[13px]">+55</span>
              <input type="text" placeholder="(11) 99999-0000" value={newConvForm.phone}
                onChange={(e) => setNewConvForm((p) => ({ ...p, phone: e.target.value }))}
                className="w-full rounded-xl pl-12 pr-4 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(124,58,237,0.5)] transition-colors"
                style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.08)" }} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
