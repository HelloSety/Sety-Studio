"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi, WifiOff, RefreshCw, CheckCircle2,
  Smartphone, Clock, AlertCircle, Hash, QrCode,
  Server, Zap, Eye, EyeOff,
} from "lucide-react";
import Header from "@/components/layout/header";

type State = "checking" | "disconnected" | "connecting_qr" | "connecting_pair" | "connecting_server" | "connected" | "error";
type Method = "pairing" | "qr" | "server" | "quick";

const METHODS: { id: Method; label: string; icon: React.ElementType; hint: string }[] = [
  { id: "pairing", label: "Por Número",   icon: Hash,   hint: "Código de 8 dígitos no celular" },
  { id: "qr",      label: "QR Code",      icon: QrCode, hint: "Escaneia com a câmera" },
  { id: "server",  label: "Via Servidor", icon: Server,  hint: "PC/servidor já conectado" },
  { id: "quick",   label: "Reconexão",    icon: Zap,    hint: "Reutiliza sessão salva" },
];

const STORAGE_KEY = "aurora_wa_server";
interface SavedServer { url: string; apiKey: string; instance: string }

export default function WhatsAppPage() {
  const [state, setState]             = useState<State>("checking");
  const [method, setMethod]           = useState<Method>("pairing");
  const [qr, setQr]                   = useState<string | null>(null);
  const [pairCode, setPairCode]       = useState<string | null>(null);
  const [phone, setPhone]             = useState("");
  const [errMsg, setErrMsg]           = useState("");
  const [lastSync, setLastSync]       = useState("");
  const [savedServer, setSavedServer] = useState<SavedServer | null>(null);
  const [srvUrl, setSrvUrl]           = useState("");
  const [srvKey, setSrvKey]           = useState("");
  const [srvInst, setSrvInst]         = useState("");
  const [showKey, setShowKey]         = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  };

  const markConnected = () => {
    stopPolling();
    setState("connected");
    setLastSync(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
  };

  const checkStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/whatsapp/status");
      const data = await res.json();
      return (data.state ?? "error") as string;
    } catch { return "error"; }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      const s = await checkStatus();
      if (s === "open") markConnected();
      else if (s === "error") { stopPolling(); setState("error"); setErrMsg("Servidor indisponível."); }
    }, 3000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkStatus]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setSavedServer(JSON.parse(saved));

    (async () => {
      const s = await checkStatus();
      if (s === "open") {
        setState("connected");
        setLastSync(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
      } else if (s === "error") {
        setState("error");
        setErrMsg("Não foi possível conectar ao servidor Evolution API.");
      } else {
        setState("disconnected");
      }
    })();
    return stopPolling;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkStatus]);

  // ── QR Code ───────────────────────────────────────────────────────────────
  const connectQr = async () => {
    setState("connecting_qr"); setQr(null); setErrMsg("");
    try {
      const res = await fetch("/api/whatsapp/connect");
      const data = await res.json();
      if (data.base64) setQr(data.base64);
      else setErrMsg(data.error ?? "Sem QR retornado");
    } catch (e) { setErrMsg(String(e)); }
    startPolling();
  };

  // ── Pairing Code ──────────────────────────────────────────────────────────
  const connectPairing = async () => {
    if (!phone.trim()) return;
    setState("connecting_pair"); setPairCode(null); setErrMsg("");
    try {
      const res = await fetch("/api/whatsapp/pairing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });
      const data = await res.json();
      if (data.code) setPairCode(data.code);
      else setErrMsg(data.error ?? "Erro ao gerar código");
    } catch (e) { setErrMsg(String(e)); }
    startPolling();
  };

  // ── Via Servidor ──────────────────────────────────────────────────────────
  const connectServer = async () => {
    if (!srvUrl.trim() || !srvKey.trim() || !srvInst.trim()) return;
    setState("connecting_server"); setErrMsg("");
    try {
      const res = await fetch("/api/whatsapp/server", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: srvUrl, apiKey: srvKey, instance: srvInst }),
      });
      const data = await res.json();
      if (!res.ok) { setState("error"); setErrMsg(data.error ?? "Erro ao conectar"); return; }

      if (data.state === "open") {
        const srv: SavedServer = { url: srvUrl, apiKey: srvKey, instance: srvInst };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(srv));
        setSavedServer(srv);
        markConnected();
      } else {
        setState("error");
        setErrMsg(`Servidor acessível mas instância está "${data.state}". Conecte o WhatsApp nele primeiro.`);
      }
    } catch (e) { setState("error"); setErrMsg(String(e)); }
  };

  // ── Reconexão Rápida ──────────────────────────────────────────────────────
  const connectQuick = async () => {
    if (!savedServer) return;
    setState("connecting_server"); setErrMsg("");
    try {
      const res = await fetch("/api/whatsapp/server", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savedServer),
      });
      const data = await res.json();
      if (!res.ok || data.state !== "open") {
        setState("error");
        setErrMsg(data.error ?? `Instância "${data.state}" — reconecte via outro método.`);
        return;
      }
      markConnected();
    } catch (e) { setState("error"); setErrMsg(String(e)); }
  };

  const handleDisconnect = () => {
    stopPolling(); setState("disconnected"); setQr(null); setPairCode(null);
  };

  const forgetSaved = () => {
    localStorage.removeItem(STORAGE_KEY); setSavedServer(null); setMethod("pairing");
  };

  const isConnecting = state === "connecting_qr" || state === "connecting_pair" || state === "connecting_server";
  const serverValid  = srvUrl.trim() && srvKey.trim() && srvInst.trim();
  const connectDisabled =
    (method === "pairing" && !phone.trim()) ||
    (method === "server"  && !serverValid)  ||
    (method === "quick"   && !savedServer);

  const handleConnect = () => {
    if (method === "pairing") connectPairing();
    else if (method === "qr") connectQr();
    else if (method === "server") connectServer();
    else connectQuick();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Conexão WhatsApp" subtitle="Vincule seu número para ativar a Aurora IA" />
      <div className="flex-1 overflow-y-auto p-6 flex items-start justify-center">
        <div className="w-full max-w-lg space-y-4 mt-4">

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
            {/* Status bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                {state === "connected"  && <span className="dot-online" />}
                {isConnecting           && <span className="dot-connecting" />}
                {state === "checking"   && <span className="dot-connecting" />}
                {(state === "disconnected" || state === "error") && <span className="dot-offline" />}
                <span className={`text-[13px] font-medium ${
                  state === "connected"         ? "text-[#25D366]" :
                  isConnecting                  ? "text-[#F59E0B]" :
                  state === "error"             ? "text-[#EF4444]" : "text-[#52525B]"
                }`}>
                  {state === "connected"         ? "WhatsApp Conectado"     :
                   state === "connecting_qr"     ? "Aguardando QR Scan…"   :
                   state === "connecting_pair"   ? "Aguardando código…"     :
                   state === "connecting_server" ? "Verificando servidor…"  :
                   state === "checking"          ? "Verificando…"           :
                   state === "error"             ? "Erro de Conexão"        : "Desconectado"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/[0.05] rounded-xl px-3 py-1.5">
                <Wifi className="w-3 h-3 text-[#52525B]" />
                <span className="text-[11px] text-[#52525B]">Evolution API</span>
                <div className={`w-1.5 h-1.5 rounded-full ${state === "error" ? "bg-red-400" : "bg-[#25D366]"}`} />
              </div>
            </div>

            <AnimatePresence mode="wait">

              {state === "checking" && (
                <motion.div key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex justify-center py-10">
                  <RefreshCw className="w-8 h-8 text-[#3F3F46] animate-spin" />
                </motion.div>
              )}

              {state === "connected" && (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex flex-col items-center gap-3 py-6">
                  <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
                    style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)", boxShadow: "0 0 30px rgba(37,211,102,0.2)" }}>
                    <CheckCircle2 className="w-10 h-10 text-[#25D366]" />
                  </div>
                  <p className="text-[14px] font-semibold text-[#25D366]">Conectado com sucesso!</p>
                  <p className="text-[12px] text-[#52525B]">Aurora IA (Lucas) está ativa e respondendo</p>
                </motion.div>
              )}

              {state === "error" && (
                <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 py-6">
                  <div className="w-16 h-16 rounded-2xl bg-red-500/08 border border-red-500/15 flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-[12px] text-[#52525B] text-center">{errMsg || "Servidor indisponível"}</p>
                  <button onClick={() => setState("disconnected")} className="text-[12px] text-[#7C3AED] hover:text-[#8B5CF6] transition-colors">
                    Tentar novamente →
                  </button>
                </motion.div>
              )}

              {state === "disconnected" && (
                <motion.div key="disco" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                  <div className="grid grid-cols-2 gap-2">
                    {METHODS.filter((m) => m.id !== "quick" || savedServer).map((m) => {
                      const active = method === m.id;
                      return (
                        <button key={m.id} onClick={() => setMethod(m.id)}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left border transition-all ${
                            active ? "bg-[#7C3AED]/12 border-[#7C3AED]/30 text-[#8B5CF6]"
                                   : "bg-transparent border-white/[0.05] text-[#52525B] hover:text-[#A1A1AA] hover:border-white/[0.09]"}`}>
                          <m.icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? "text-[#8B5CF6]" : ""}`} />
                          <div>
                            <p className="text-[11px] font-semibold leading-none">{m.label}</p>
                            <p className={`text-[9px] mt-0.5 ${active ? "text-[#7C3AED]/70" : "text-[#3F3F46]"}`}>{m.hint}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {method === "pairing" && (
                    <div className="space-y-3">
                      <div className="bg-[#7C3AED]/06 border border-[#7C3AED]/15 rounded-xl p-4">
                        <p className="text-[12px] font-semibold text-white mb-1">Como funciona</p>
                        <p className="text-[11px] text-[#52525B] leading-relaxed">
                          Gera um código de 8 dígitos. No WhatsApp:{" "}
                          <strong className="text-[#A1A1AA]">Dispositivos Conectados → Conectar → Usar número de telefone</strong>.
                        </p>
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-[#52525B] block mb-1.5">Número do WhatsApp (com DDD)</label>
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="5511999999999" className="input-dark" />
                        <p className="text-[10px] text-[#3F3F46] mt-1">Com código do país. Ex: 5511999999999</p>
                      </div>
                    </div>
                  )}

                  {method === "qr" && (
                    <div className="bg-[#131318] border border-white/[0.05] rounded-xl p-4">
                      <p className="text-[12px] font-semibold text-white mb-1">Como funciona</p>
                      <p className="text-[11px] text-[#52525B] leading-relaxed">
                        Gera um QR Code. No WhatsApp:{" "}
                        <strong className="text-[#A1A1AA]">Dispositivos Conectados → Conectar Dispositivo</strong>. Aponte a câmera.
                      </p>
                    </div>
                  )}

                  {method === "server" && (
                    <div className="space-y-3">
                      <div className="bg-[#131318] border border-white/[0.05] rounded-xl p-4">
                        <p className="text-[12px] font-semibold text-white mb-1">Como funciona</p>
                        <p className="text-[11px] text-[#52525B] leading-relaxed">
                          Conecta a uma instância Evolution API em um <strong className="text-[#A1A1AA]">servidor ou PC remoto</strong> que já está com WhatsApp conectado.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="text-[11px] font-medium text-[#52525B] block mb-1">URL do servidor Evolution API</label>
                          <input value={srvUrl} onChange={(e) => setSrvUrl(e.target.value)}
                            placeholder="http://67.207.90.199:8080" className="input-dark" />
                          <p className="text-[10px] text-[#3F3F46] mt-1">Ex: http://seu-ip:8080 ou https://api.seudominio.com</p>
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-[#52525B] block mb-1">API Key</label>
                          <div className="relative">
                            <input type={showKey ? "text" : "password"} value={srvKey} onChange={(e) => setSrvKey(e.target.value)}
                              placeholder="sua-api-key" className="input-dark pr-10" />
                            <button type="button" onClick={() => setShowKey((v) => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#A1A1AA]">
                              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-[#52525B] block mb-1">Nome da instância</label>
                          <input value={srvInst} onChange={(e) => setSrvInst(e.target.value)}
                            placeholder="aurora-ia" className="input-dark" />
                        </div>
                      </div>
                    </div>
                  )}

                  {method === "quick" && savedServer && (
                    <div className="space-y-3">
                      <div className="bg-[#25D366]/06 border border-[#25D366]/15 rounded-xl p-4">
                        <p className="text-[12px] font-semibold text-white mb-1">Sessão salva</p>
                        <div className="space-y-1 mt-2">
                          <div className="flex items-center gap-2">
                            <Server className="w-3 h-3 text-[#52525B]" />
                            <span className="text-[10px] text-[#A1A1AA] font-mono truncate">{savedServer.url}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Smartphone className="w-3 h-3 text-[#52525B]" />
                            <span className="text-[10px] text-[#A1A1AA]">Instância: {savedServer.instance}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={forgetSaved} className="text-[11px] text-[#52525B] hover:text-red-400 transition-colors">
                        Esquecer sessão salva
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {state === "connecting_qr" && (
                <motion.div key="conn_qr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 py-4">
                  {qr ? (
                    <div className="relative">
                      <img src={qr} alt="QR Code WhatsApp" className="w-48 h-48 rounded-2xl" style={{ imageRendering: "pixelated" }} />
                      <motion.div animate={{ top: ["4%", "88%", "4%"] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-2 right-2 h-0.5 rounded-full"
                        style={{ background: "linear-gradient(90deg, transparent, #7C3AED, transparent)", boxShadow: "0 0 8px rgba(124,58,237,0.8)" }} />
                    </div>
                  ) : (
                    <div className="w-48 h-48 bg-white/[0.03] border border-white/[0.05] rounded-2xl flex items-center justify-center">
                      <RefreshCw className="w-8 h-8 text-[#3F3F46] animate-spin" />
                    </div>
                  )}
                  <p className="text-[12px] text-[#52525B]">Escaneie com o WhatsApp</p>
                  {errMsg && <p className="text-[11px] text-red-400">{errMsg}</p>}
                </motion.div>
              )}

              {state === "connecting_pair" && (
                <motion.div key="conn_pair" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-5 py-6">
                  {pairCode ? (
                    <>
                      <p className="text-[11px] text-[#52525B]">Digite este código no WhatsApp</p>
                      <div className="flex gap-2">
                        {pairCode.replace("-", "").split("").map((char, i) => (
                          <div key={i} className={`w-10 h-12 rounded-xl flex items-center justify-center text-[20px] font-bold text-white ${i === 4 ? "ml-2" : ""}`}
                            style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.25)", boxShadow: "0 0 12px rgba(124,58,237,0.15)" }}>
                            {char}
                          </div>
                        ))}
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-[12px] text-[#52525B]">WhatsApp → Dispositivos Conectados → Conectar</p>
                        <p className="text-[12px] font-semibold text-[#A1A1AA]">→ "Usar número de telefone" → digitar o código</p>
                      </div>
                      <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex items-center gap-2 text-[11px] text-[#52525B]">
                        <RefreshCw className="w-3 h-3" /> Aguardando confirmação…
                      </motion.div>
                    </>
                  ) : errMsg ? (
                    <div className="text-center space-y-2">
                      <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
                      <p className="text-[12px] text-red-400">{errMsg}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw className="w-8 h-8 text-[#3F3F46] animate-spin" />
                      <p className="text-[12px] text-[#52525B]">Gerando código…</p>
                    </div>
                  )}
                </motion.div>
              )}

              {state === "connecting_server" && (
                <motion.div key="conn_srv" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 py-10">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                      <Server className="w-8 h-8 text-[#8B5CF6]" />
                    </motion.div>
                  </div>
                  <p className="text-[13px] font-medium text-white">Verificando servidor…</p>
                  <p className="text-[11px] text-[#52525B]">Testando conexão com a instância Evolution API</p>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>

          {state === "connected" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3">
              {[
                { icon: Smartphone, label: "Instância", value: savedServer?.instance ?? "aurora-ia" },
                { icon: Wifi,       label: "API",        value: "Online" },
                { icon: Clock,      label: "Sync",       value: lastSync || "agora" },
              ].map((info) => (
                <div key={info.label} className="glass-card p-4 text-center">
                  <info.icon className="w-4 h-4 text-[#7C3AED] mx-auto mb-2" />
                  <p className="text-[10px] text-[#3F3F46] mb-0.5">{info.label}</p>
                  <p className="text-[12px] font-semibold text-white">{info.value}</p>
                </div>
              ))}
            </motion.div>
          )}

          <div className="flex gap-3">
            {state === "disconnected" && (
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={handleConnect} disabled={connectDisabled}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}>
                {{
                  pairing: <><Hash className="w-4 h-4" /> Gerar Código</>,
                  qr:      <><QrCode className="w-4 h-4" /> Gerar QR Code</>,
                  server:  <><Server className="w-4 h-4" /> Verificar Servidor</>,
                  quick:   <><Zap className="w-4 h-4" /> Reconectar Agora</>,
                }[method]}
              </motion.button>
            )}

            {isConnecting && (
              <>
                <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-[#F59E0B] bg-[#F59E0B]/08 border border-[#F59E0B]/20">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}>
                    <RefreshCw className="w-4 h-4" />
                  </motion.span>
                  {state === "connecting_server" ? "Verificando…" : "Verificando a cada 3s…"}
                </div>
                <button onClick={handleDisconnect} className="btn-outline px-4 py-3 text-[13px]">Cancelar</button>
              </>
            )}

            {state === "connected" && (
              <button onClick={handleDisconnect}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-medium text-red-400 border border-red-500/15 hover:bg-red-500/05 transition-all">
                <WifiOff className="w-4 h-4" /> Desconectar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
