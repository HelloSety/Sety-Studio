"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, Volume2, MessageCircle } from "lucide-react";

/* ── Types ───────────────────────────────────────────────── */
type Message = { role: "user" | "assistant"; content: string };
type Status  = "idle" | "listening" | "thinking" | "speaking";

/* ── Browser Speech types ────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SR = any;
declare global {
  interface Window {
    SpeechRecognition: SR;
    webkitSpeechRecognition: SR;
  }
}

/* ── Voice agent widget ──────────────────────────────────── */
export function VoiceAgent() {
  const [open, setOpen]         = useState(false);
  const [status, setStatus]     = useState<Status>("idle");
  const [history, setHistory]   = useState<Message[]>([]);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported]   = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recogRef  = useRef<SR>(null);
  const synthRef  = useRef<SR>(null);

  // Check browser support
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) setSupported(false);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [history, transcript]);

  // Initial greeting when opened
  useEffect(() => {
    if (open && history.length === 0) {
      speak("Olá! Sou a Sety, consultora da Sety Vision. Em que posso ajudar você hoje?", []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* ── Speak (TTS) ─── */
  const speak = useCallback((text: string, updatedHistory: Message[]) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang  = "pt-BR";
    utt.rate  = 1.05;
    utt.pitch = 1.0;

    // Try to use a natural Brazilian voice
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith("pt") && v.localService)
      || voices.find(v => v.lang.startsWith("pt"));
    if (ptVoice) utt.voice = ptVoice;

    setStatus("speaking");
    synthRef.current = utt;

    utt.onend = () => {
      setStatus("idle");
      synthRef.current = null;
    };
    utt.onerror = () => setStatus("idle");

    // Save assistant message to history
    setHistory(updatedHistory);

    window.speechSynthesis.speak(utt);
  }, []);

  /* ── Call Claude API ─── */
  const askClaude = useCallback(async (text: string, currentHistory: Message[]) => {
    setStatus("thinking");
    const userHistory: Message[] = [...currentHistory, { role: "user", content: text }];

    try {
      const res = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: currentHistory }),
      });
      const data = await res.json();
      const reply: string = data.reply || "Desculpe, tive um problema. Pode repetir?";
      const newHistory: Message[] = [...userHistory, { role: "assistant", content: reply }];
      speak(reply, newHistory);
    } catch {
      const errMsg = "Erro de conexão. Tente novamente.";
      speak(errMsg, [...userHistory, { role: "assistant", content: errMsg }]);
    }
  }, [speak]);

  /* ── Listen (STT) ─── */
  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;

    // Stop speaking if active
    window.speechSynthesis?.cancel();

    const recog = new SR();
    recogRef.current = recog;
    recog.lang = "pt-BR";
    recog.interimResults = true;
    recog.maxAlternatives = 1;

    setStatus("listening");
    setTranscript("");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recog.onresult = (e: any) => {
      const current = Array.from(e.results as ArrayLike<{ 0: { transcript: string } }>)
        .map((r) => r[0].transcript)
        .join("");
      setTranscript(current);
    };

    recog.onend = () => {
      const finalText = transcript || "";
      setTranscript("");
      if (finalText.trim().length > 1) {
        askClaude(finalText.trim(), history);
      } else {
        setStatus("idle");
      }
    };

    recog.onerror = () => setStatus("idle");
    recog.start();
  }, [history, transcript, askClaude]);

  const stopListening = useCallback(() => {
    recogRef.current?.stop();
  }, []);

  const handleMic = () => {
    if (status === "listening") {
      stopListening();
    } else if (status === "idle") {
      startListening();
    }
  };

  const handleClose = () => {
    window.speechSynthesis?.cancel();
    recogRef.current?.stop();
    setOpen(false);
    setStatus("idle");
    setTranscript("");
  };

  const clearHistory = () => {
    setHistory([]);
    window.speechSynthesis?.cancel();
    setStatus("idle");
  };

  /* ── Status colors ─── */
  const statusColor: Record<Status, string> = {
    idle:      "#9CA3AF",
    listening: "#EF4444",
    thinking:  "#F59E0B",
    speaking:  "#7C3AED",
  };

  const statusLabel: Record<Status, string> = {
    idle:      "Clique no microfone para falar",
    listening: "Escutando...",
    thinking:  "Pensando...",
    speaking:  "Sety está falando...",
  };

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9998,
          width: 60, height: 60, borderRadius: "50%",
          background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 24px rgba(124,58,237,0.45), 0 0 0 0 rgba(124,58,237,0.3)",
          display: open ? "none" : "flex",
          alignItems: "center", justifyContent: "center",
          animation: "voice-pulse 2.5s ease-in-out infinite",
        }}
        aria-label="Falar com consultor IA"
      >
        <MessageCircle size={24} color="white" />
      </motion.button>

      {/* Widget */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed", bottom: 24, right: 24, zIndex: 9999,
              width: 360, maxHeight: 560,
              background: "white",
              border: "1px solid rgba(0,0,0,0.09)",
              borderRadius: 24,
              boxShadow: "0 24px 80px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.06)",
              display: "flex", flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <style>{`
              @keyframes voice-pulse {
                0%   { box-shadow: 0 4px 24px rgba(124,58,237,.45), 0 0 0 0 rgba(124,58,237,.3); }
                70%  { box-shadow: 0 4px 24px rgba(124,58,237,.45), 0 0 0 12px rgba(124,58,237,0); }
                100% { box-shadow: 0 4px 24px rgba(124,58,237,.45), 0 0 0 0 rgba(124,58,237,0); }
              }
              @keyframes thinking-dot {
                0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
                40%            { opacity: 1;   transform: scale(1); }
              }
            `}</style>

            {/* Header */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.07)",
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <Volume2 size={18} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A" }}>Sety — Consultora IA</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: statusColor[status],
                    transition: "background 0.3s",
                  }} />
                  <span style={{ fontSize: 11, color: "#6B7280" }}>{statusLabel[status]}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    style={{
                      background: "transparent", border: "none", cursor: "pointer",
                      padding: 6, borderRadius: 8, color: "#9CA3AF",
                      fontSize: 10, fontWeight: 600,
                    }}
                    title="Nova conversa"
                  >
                    NOVO
                  </button>
                )}
                <button
                  onClick={handleClose}
                  style={{
                    background: "transparent", border: "none", cursor: "pointer",
                    padding: 6, borderRadius: 8, color: "#9CA3AF",
                    display: "flex", alignItems: "center",
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat area */}
            <div
              ref={scrollRef}
              style={{
                flex: 1, overflowY: "auto", padding: "16px 16px 8px",
                display: "flex", flexDirection: "column", gap: 10,
              }}
            >
              {history.map((msg, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}>
                  <div style={{
                    maxWidth: "82%",
                    padding: "10px 14px",
                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.role === "user" ? "#7C3AED" : "#F3F4F6",
                    color: msg.role === "user" ? "white" : "#111111",
                    fontSize: 13, lineHeight: 1.55,
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Interim transcript */}
              {transcript && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{
                    maxWidth: "82%", padding: "10px 14px",
                    borderRadius: "18px 18px 4px 18px",
                    background: "rgba(124,58,237,0.15)",
                    color: "#7C3AED", fontSize: 13, lineHeight: 1.55,
                    fontStyle: "italic",
                  }}>
                    {transcript}
                  </div>
                </div>
              )}

              {/* Thinking animation */}
              {status === "thinking" && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{
                    padding: "12px 16px", borderRadius: "18px 18px 18px 4px",
                    background: "#F3F4F6",
                    display: "flex", gap: 4, alignItems: "center",
                  }}>
                    {[0, 0.16, 0.32].map((delay, i) => (
                      <div key={i} style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: "#7C3AED",
                        animation: `thinking-dot 1.2s ease-in-out ${delay}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              )}

              {history.length === 0 && !transcript && status !== "thinking" && (
                <div style={{
                  textAlign: "center", padding: "20px 16px",
                  color: "#9CA3AF", fontSize: 12, lineHeight: 1.6,
                }}>
                  Pressione o microfone e fale
                  <br />
                  com a nossa consultora IA
                </div>
              )}
            </div>

            {/* Not supported warning */}
            {!supported && (
              <div style={{
                margin: "0 16px 12px",
                padding: "10px 14px",
                background: "#FFF7ED", border: "1px solid #FED7AA",
                borderRadius: 12, fontSize: 12, color: "#92400E",
              }}>
                Seu navegador não suporta reconhecimento de voz. Use Chrome ou Edge.
              </div>
            )}

            {/* Mic button */}
            <div style={{
              padding: "12px 20px 20px",
              display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8,
            }}>
              <motion.button
                onClick={handleMic}
                disabled={!supported || status === "thinking" || status === "speaking"}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                style={{
                  width: 64, height: 64, borderRadius: "50%", border: "none",
                  cursor: !supported || status === "thinking" || status === "speaking" ? "not-allowed" : "pointer",
                  background: status === "listening"
                    ? "#EF4444"
                    : status === "thinking" || status === "speaking"
                    ? "#E5E7EB"
                    : "linear-gradient(135deg, #7C3AED, #8B5CF6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: status === "listening"
                    ? "0 0 0 8px rgba(239,68,68,0.15)"
                    : "0 4px 16px rgba(124,58,237,0.3)",
                  transition: "all 0.3s ease",
                }}
              >
                {status === "listening"
                  ? <MicOff size={26} color="white" />
                  : <Mic size={26} color={status === "thinking" || status === "speaking" ? "#9CA3AF" : "white"} />
                }
              </motion.button>
              <span style={{ fontSize: 11, color: "#9CA3AF", letterSpacing: "0.03em" }}>
                {status === "listening" ? "Clique para parar" : "Clique para falar"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
