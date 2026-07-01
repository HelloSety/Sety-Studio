"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Volume2, CheckCircle2 } from "lucide-react";
import { colors, radius, shadow } from "@/lib/tokens";

/* ── Types ──────────────────────────────────────────────────── */
type Phase   = "idle" | "playing" | "done";
type Role    = "user" | "ai";
type ScriptMsg = { id: number; role: Role; text: string; delay: number };

/* ── Demo script ────────────────────────────────────────────── */
const SCRIPT: ScriptMsg[] = [
  { id: 1, role: "user", text: "Oi! Gostaria de saber se vocês têm horário esta semana para avaliação.", delay: 800 },
  { id: 2, role: "ai",   text: "Olá! Claro. Temos disponibilidade na quinta-feira às 14h e na sexta-feira às 10h. Qual horário prefere?", delay: 4800 },
  { id: 3, role: "user", text: "Quinta às 14h está ótimo!", delay: 11200 },
  { id: 4, role: "ai",   text: "Perfeito! Agendamento confirmado. Você receberá a confirmação por WhatsApp e e-mail em instantes. Nos vemos quinta!", delay: 14500 },
];

const RESULTS = [
  { icon: <CheckCircle2 size={16} color="#16A34A" />, label: "Lead qualificado", bg: "#F0FDF4", border: "#BBF7D0" },
  { icon: <CheckCircle2 size={16} color="#16A34A" />, label: "Reunião agendada",  bg: "#F0FDF4", border: "#BBF7D0" },
  { icon: <CheckCircle2 size={16} color="#16A34A" />, label: "CRM atualizado",    bg: "#F0FDF4", border: "#BBF7D0" },
  { icon: <span style={{ fontSize: 14 }}>⚡</span>,   label: "Tempo: 3,2 seg",   bg: "#FFF7ED", border: "#FED7AA" },
];

/* ── Waveform ───────────────────────────────────────────────── */
const BAR_H = [12, 20, 16, 24, 14, 22, 10, 18, 16, 20];
function Waveform({ active }: { active: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 28 }}>
      {BAR_H.map((h, i) => (
        <div
          key={i}
          style={{
            width: 3, borderRadius: 2,
            background: active ? colors.purple : "#D1D5DB",
            height: active ? h : 4,
            transition: "height 0.1s ease-in-out, background 0.3s",
            animation: active ? `wf-pulse ${0.55 + i * 0.07}s ease-in-out infinite alternate` : "none",
          }}
        />
      ))}
    </div>
  );
}

/* ── Typing bubble ──────────────────────────────────────────── */
function TypingBubble() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4 }}
      style={{
        display: "inline-flex", gap: 4, alignItems: "center",
        background: "white", borderRadius: "12px 12px 12px 2px",
        padding: "10px 14px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
      }}
    >
      {[0, 0.18, 0.36].map((d, i) => (
        <motion.div key={i}
          style={{ width: 7, height: 7, borderRadius: "50%", background: "#9CA3AF" }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.7, delay: d, repeat: Infinity }}
        />
      ))}
    </motion.div>
  );
}

/* ── Phone screen (inner chat area) ─────────────────────────── */
function PhoneScreen({
  messages, typing, activeTts, phase, scrollRef,
}: {
  messages: ScriptMsg[];
  typing: boolean;
  activeTts: number | null;
  phase: Phase;
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#ECE5DD" }}>
      {/* WhatsApp header */}
      <div style={{
        background: "#075E54",
        padding: "44px 14px 12px",
        display: "flex", alignItems: "center", gap: 10,
        flexShrink: 0,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, flexShrink: 0,
        }}>🤖</div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>Sety Vision IA</p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.2 }}>
            {typing ? "digitando..." : "online"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: "auto", padding: "12px 10px", display: "flex", flexDirection: "column", gap: 6 }}
      >
        {/* Idle placeholder */}
        {messages.length === 0 && phase === "idle" && (
          <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, opacity: 0.6 }}>
            <span style={{ fontSize: 28 }}>👇</span>
            <p style={{ fontSize: 11, color: "#667", textAlign: "center", margin: 0 }}>Clique em Ouvir demo</p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
            >
              <div style={{
                maxWidth: "82%",
                background: msg.role === "user" ? "#DCF8C6" : "#FFFFFF",
                borderRadius: msg.role === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                padding: "8px 11px 6px",
                boxShadow: activeTts === msg.id
                  ? `0 0 0 2px ${colors.purple}, 0 2px 8px rgba(124,58,237,0.15)`
                  : "0 1px 2px rgba(0,0,0,0.12)",
                transition: "box-shadow 0.3s",
              }}>
                {msg.role === "ai" && (
                  <p style={{ fontSize: 10, fontWeight: 700, color: colors.purple, margin: "0 0 2px" }}>Sety Vision IA</p>
                )}
                <p style={{ fontSize: 12.5, color: "#111", margin: 0, lineHeight: 1.55 }}>{msg.text}</p>
                <p style={{ fontSize: 9.5, color: "#999", margin: "3px 0 0", textAlign: "right" }}>
                  {now}{msg.role === "user" && " ✓✓"}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {typing && (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TypingBubble />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success overlay inside phone */}
        <AnimatePresence>
          {phase === "done" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 280, damping: 22, delay: 0.3 }}
              style={{
                margin: "10px 0 4px",
                background: "white",
                borderRadius: 16,
                padding: "14px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>🎉</div>
              <p style={{ fontSize: 11, fontWeight: 800, color: "#111", margin: "0 0 10px", letterSpacing: "0.02em" }}>
                ATENDIMENTO CONCLUÍDO
              </p>
              {RESULTS.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.12 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "5px 9px", background: r.bg,
                    border: `1px solid ${r.border}`,
                    borderRadius: 8, marginBottom: 5,
                  }}
                >
                  {r.icon}
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "#111" }}>{r.label}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <div style={{
        background: "#F0F0F0", padding: "7px 10px",
        display: "flex", alignItems: "center", gap: 7, flexShrink: 0,
        borderTop: "1px solid rgba(0,0,0,0.07)",
      }}>
        <div style={{
          flex: 1, background: "white", borderRadius: 20,
          padding: "7px 12px", fontSize: 11, color: "#999",
        }}>
          {typing ? "Sety Vision está digitando…" : "Mensagem"}
        </div>
        <div style={{
          width: 34, height: 34, borderRadius: "50%", background: "#25D366",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0,
        }}>🎤</div>
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────── */
export function HeroDemo() {
  const [phase, setPhase]         = useState<Phase>("idle");
  const [visible, setVisible]     = useState<number[]>([]);
  const [typing, setTyping]       = useState(false);
  const [speaking, setSpeaking]   = useState(false);
  const [activeTts, setActiveTts] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const clearAll = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => () => clearAll(), [clearAll]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
  }, [visible, typing]);

  const speakText = useCallback((text: string, id: number) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang  = "pt-BR";
    utt.rate  = 0.95;
    utt.pitch = 1.08;
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith("pt") && v.localService)
      || voices.find(v => v.lang.startsWith("pt"));
    if (ptVoice) utt.voice = ptVoice;
    setSpeaking(true);
    setActiveTts(id);
    utt.onend   = () => { setSpeaking(false); setActiveTts(null); };
    utt.onerror = () => { setSpeaking(false); setActiveTts(null); };
    window.speechSynthesis.speak(utt);
  }, []);

  const startDemo = useCallback(() => {
    clearAll();
    setPhase("playing");
    setVisible([]);
    setTyping(false);
    setSpeaking(false);
    setActiveTts(null);

    SCRIPT.forEach((msg, i) => {
      if (msg.role === "ai") {
        const t = setTimeout(() => setTyping(true), msg.delay - 1400);
        timers.current.push(t);
      }
      const t2 = setTimeout(() => {
        setTyping(false);
        setVisible(prev => [...prev, msg.id]);
        if (msg.role === "ai") speakText(msg.text, msg.id);
        if (i === SCRIPT.length - 1) {
          const t3 = setTimeout(() => setPhase("done"), 5500);
          timers.current.push(t3);
        }
      }, msg.delay);
      timers.current.push(t2);
    });
  }, [clearAll, speakText]);

  const reset = useCallback(() => {
    clearAll();
    setPhase("idle");
    setVisible([]);
    setTyping(false);
    setSpeaking(false);
    setActiveTts(null);
  }, [clearAll]);

  const visibleMsgs = SCRIPT.filter(m => visible.includes(m.id));

  return (
    <section style={{
      padding: "88px 32px 100px",
      background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)",
    }}>
      <style>{`
        @keyframes wf-pulse { from { transform: scaleY(0.35); } to { transform: scaleY(1); } }
        @keyframes demo-blink { 0%,100%{opacity:1;} 50%{opacity:0.35;} }
        .hero-demo-grid { display: grid; grid-template-columns: 1fr 340px 1fr; gap: 40px; align-items: start; max-width: 1280px; margin: 0 auto; }
        @media (max-width: 900px) { .hero-demo-grid { grid-template-columns: 1fr; justify-items: center; } .hd-side { display: none !important; } }
      `}</style>

      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: "center", maxWidth: 560, margin: "0 auto 56px" }}
      >
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 20,
          background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.18)",
          borderRadius: radius.full, padding: "5px 16px",
        }}>
          <Volume2 size={13} color={colors.purple} />
          <span style={{ fontSize: 11, fontWeight: 700, color: colors.purple, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Demo ao vivo
          </span>
        </div>
        <h2 style={{
          fontSize: "clamp(30px, 4.5vw, 50px)", fontWeight: 900,
          letterSpacing: "-0.038em", lineHeight: 1.05, color: colors.text,
          margin: "0 0 16px",
        }}>
          Ouça a IA{" "}
          <span style={{
            background: `linear-gradient(135deg, ${colors.purple} 0%, #A855F7 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>vendendo</span>{" "}para você
        </h2>
        <p style={{ fontSize: 16, color: colors.textSecondary, lineHeight: 1.65, margin: 0 }}>
          A IA qualifica o lead e agenda a reunião em segundos. Clique e veja acontecer.
        </p>
      </motion.div>

      {/* 3-column grid */}
      <div className="hero-demo-grid">

        {/* Left: Script timeline */}
        <motion.div
          className="hd-side"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
            Roteiro
          </p>
          {SCRIPT.map((msg) => {
            const done = visible.includes(msg.id);
            return (
              <div key={msg.id} style={{
                display: "flex", gap: 10,
                opacity: done ? 1 : 0.28,
                transition: "opacity 0.5s",
              }}>
                <div style={{
                  flexShrink: 0, marginTop: 2,
                  width: 20, height: 20, borderRadius: "50%",
                  background: done ? (msg.role === "ai" ? "rgba(124,58,237,0.12)" : "#F3F4F6") : "#F3F4F6",
                  border: done && msg.role === "ai" ? "1.5px solid rgba(124,58,237,0.3)" : "1.5px solid #E5E7EB",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 800, color: done && msg.role === "ai" ? colors.purple : colors.textMuted,
                }}>
                  {msg.role === "ai" ? "IA" : "L"}
                </div>
                <p style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 1.55, margin: 0 }}>
                  {msg.text.length > 90 ? msg.text.slice(0, 90) + "…" : msg.text}
                </p>
              </div>
            );
          })}

          {/* Speaking status */}
          <AnimatePresence>
            {speaking && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                style={{
                  marginTop: 8,
                  background: "rgba(124,58,237,0.05)",
                  border: "1px solid rgba(124,58,237,0.18)",
                  borderRadius: radius.lg,
                  padding: "14px 16px",
                  display: "flex", alignItems: "center", gap: 12,
                }}
              >
                <Volume2 size={15} color={colors.purple} />
                <div>
                  <p style={{ fontSize: 10, fontWeight: 800, color: colors.purple, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Falando</p>
                  <Waveform active={true} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Center: Phone */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          style={{
            width: 300,
            background: "#1A1A2E",
            borderRadius: 44,
            padding: 12,
            boxShadow: "0 48px 96px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.12)",
            position: "relative",
          }}
        >
          {/* Notch */}
          <div style={{
            position: "absolute", top: 12, left: "50%", transform: "translateX(-50%)",
            width: 90, height: 26, background: "#0D0D1A",
            borderRadius: 18, zIndex: 10,
          }} />

          {/* Screen */}
          <div style={{ background: "#ECE5DD", borderRadius: 34, height: 580, overflow: "hidden" }}>
            <PhoneScreen
              messages={visibleMsgs}
              typing={typing}
              activeTts={activeTts}
              phase={phase}
              scrollRef={scrollRef}
            />
          </div>

          {/* Home bar */}
          <div style={{ height: 5, background: "#2A2A40", borderRadius: 3, margin: "8px auto 0", width: 100 }} />
        </motion.div>

        {/* Right: Results */}
        <motion.div
          className="hd-side"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <p style={{ fontSize: 10, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>
            Resultados
          </p>

          <AnimatePresence>
            {phase === "done" ? (
              RESULTS.map((r, i) => (
                <motion.div
                  key={r.label}
                  initial={{ opacity: 0, x: 20, scale: 0.92 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: i * 0.18, type: "spring", stiffness: 320, damping: 26 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 18px",
                    background: r.bg,
                    border: `1px solid ${r.border}`,
                    borderRadius: radius.lg,
                    boxShadow: shadow.xs,
                  }}
                >
                  {r.icon}
                  <span style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>{r.label}</span>
                </motion.div>
              ))
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  background: "#F9FAFB",
                  border: `1px solid ${colors.border}`,
                  borderRadius: radius.xl,
                  padding: "24px",
                }}
              >
                <p style={{ fontSize: 12, color: colors.textMuted, lineHeight: 1.65, margin: 0 }}>
                  Os resultados do atendimento aparecem aqui assim que a demo terminar.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* CTA buttons */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 44 }}>
        {phase === "idle" && (
          <motion.button
            onClick={startDemo}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: colors.purple, color: "#fff",
              border: "none", cursor: "pointer",
              padding: "16px 40px", borderRadius: radius.full,
              fontSize: 15, fontWeight: 700,
              boxShadow: shadow.purple,
            }}
          >
            <Play size={16} fill="#fff" style={{ flexShrink: 0 }} />
            Ouvir demonstração
          </motion.button>
        )}

        {phase === "playing" && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 14,
            background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.18)",
            borderRadius: radius.full, padding: "14px 28px",
          }}>
            <div style={{
              width: 9, height: 9, borderRadius: "50%", background: colors.purple,
              animation: "demo-blink 1.4s ease-in-out infinite",
            }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: colors.purple }}>Demo em andamento…</span>
            <button
              onClick={reset}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", color: colors.textMuted, padding: 4,
              }}
              title="Parar"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        )}

        {phase === "done" && (
          <motion.button
            onClick={reset}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#fff", color: colors.text,
              border: `1.5px solid ${colors.border}`,
              cursor: "pointer", padding: "14px 32px",
              borderRadius: radius.full, fontSize: 14, fontWeight: 600,
            }}
          >
            <RotateCcw size={14} /> Repetir demo
          </motion.button>
        )}
      </div>
    </section>
  );
}
