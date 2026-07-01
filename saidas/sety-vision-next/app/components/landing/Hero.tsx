"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, ChevronRight, Zap } from "lucide-react";
import { colors, radius, shadow, motion as M } from "@/lib/tokens";

const WA_LINK = "https://wa.me/559XXXXXXXXX?text=Quero+ver+o+Sety+Vision";

/* ── Floating icons ──────────────────────────────────────── */
type FI = { slug: string; hex: string; name: string; style: CSSProperties; delay: number; size: number };

const FLOAT_ICONS: FI[] = [
  { slug: "whatsapp",  hex: "25D366", name: "WhatsApp",  style: { top: "-24px",   left: "-48px"  }, delay: 0,    size: 56 },
  { slug: "openai",    hex: "10A37F", name: "OpenAI",    style: { top: "-20px",   right: "-44px" }, delay: 0.3,  size: 52 },
  { slug: "hubspot",   hex: "FF7A59", name: "HubSpot",   style: { bottom: "15%",  left: "-56px"  }, delay: 0.7,  size: 48 },
  { slug: "stripe",    hex: "635BFF", name: "Stripe",    style: { bottom: "18%",  right: "-48px" }, delay: 0.5,  size: 48 },
  { slug: "n8n",       hex: "EA4B71", name: "N8N",       style: { top: "38%",     left: "-44px"  }, delay: 1.0,  size: 44 },
  { slug: "anthropic", hex: "D97757", name: "Anthropic", style: { top: "35%",     right: "-42px" }, delay: 0.2,  size: 44 },
];

function FloatingIcon({ slug, hex, name, style, delay, size }: FI) {
  const ico = Math.round(size * 0.50);
  const r   = Math.round(size * 0.24);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.9 + delay, ease: M.ease }}
      style={{ position: "absolute", ...style, zIndex: 10 }}
    >
      <motion.div
        animate={{ y: [0, -9, 0] }}
        transition={{ duration: 3.6 + delay * 0.7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: size, height: size, borderRadius: r,
          background: `#${hex}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 28px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/integrations/${slug}.svg`} alt={name} width={ico} height={ico}
          style={{ width: ico, height: ico, filter: "brightness(0) invert(1)" }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ── Sparkline ───────────────────────────────────────────── */
function Sparkline({ data, color, id }: { data: number[]; color: string; id: string }) {
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1;
  const W = 44; const H = 18;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - min) / range) * H * 0.82 + H * 0.09,
  ]);
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const fill = `${line} L${W},${H} L0,${H}Z`;
  return (
    <svg width={W} height={H} style={{ overflow: "visible", flexShrink: 0 }}>
      <defs>
        <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#sg-${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="2" fill={color} />
    </svg>
  );
}

/* ── Mini stat counter ───────────────────────────────────── */
function useCountUp(to: number, dur = 1200) {
  const ref    = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / dur, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, to, dur]);
  return { ref, v };
}

/* ── Dashboard Mockup ────────────────────────────────────── */
type ChatMsg = { role: "user" | "ai"; text: string };

const SCRIPT: ChatMsg[] = [
  { role: "user", text: "Oi! Tenho uma clínica e quero automatizar agendamentos." },
  { role: "ai",   text: "Perfeito! A Sety Vision agenda, confirma e faz follow-up 24h. Quantos pacientes/dia?" },
  { role: "user", text: "Cerca de 30 por dia." },
  { role: "ai",   text: "Ideal para o Business! IA + CRM + WhatsApp ilimitado. Posso agendar uma demo?" },
  { role: "user", text: "Sim! Quinta às 14h." },
  { role: "ai",   text: "📅 Demo agendada! Confirmação no WhatsApp. Lead: Alta Prioridade 🔥" },
];

const KPIS = [
  { label: "Leads",     value: 47,   display: "47",   suffix: "",    change: "+18%", up: true,  color: "#7C3AED", spark: [28,32,26,38,42,35,47],     id: "leads" },
  { label: "Receita",   value: 34200,display: "34K",  suffix: "",    change: "+24%", up: true,  color: "#22C55E", spark: [18,22,24,20,28,30,34],     id: "receita" },
  { label: "Conversão", value: 94,   display: "94",   suffix: "%",   change: "+6%",  up: true,  color: "#3B82F6", spark: [76,80,84,82,88,90,94],     id: "conv" },
  { label: "Resp. IA",  value: 0,    display: "0.6",  suffix: "s",   change: "−32%", up: false, color: "#F59E0B", spark: [1.4,1.2,1.0,0.9,0.8,0.7,0.6], id: "resp" },
];

const ACTIVITY = [
  { icon: "🤖", text: "IA respondeu Ana em 0.6s",         badge: "Automático",   bc: "#7C3AED" },
  { icon: "📅", text: "Demo agendada — Carlos M.",         badge: "Agendado",     bc: "#22C55E" },
  { icon: "🎯", text: "Lead qualificado — Score 94",       badge: "Alta Prior.",  bc: "#F59E0B" },
  { icon: "💰", text: "Nova oportunidade R$6.200",         badge: "Pipeline",     bc: "#3B82F6" },
  { icon: "💬", text: "WhatsApp enviado — 47 contatos",    badge: "Enviado",      bc: "#25D366" },
];

function DashboardMockup() {
  const [phase, setPhase]   = useState(0);
  const [typing, setTyping] = useState(false);
  const [actIdx, setActIdx] = useState(0);
  const [clock, setClock]   = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setClock(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const seq: [number, () => void][] = [
      [900,  () => setPhase(1)],
      [2100, () => setTyping(true)],
      [3500, () => { setTyping(false); setPhase(2); }],
      [5200, () => setPhase(3)],
      [6400, () => setTyping(true)],
      [7800, () => { setTyping(false); setPhase(4); }],
      [9600, () => setPhase(5)],
      [10800,() => setTyping(true)],
      [12200,() => { setTyping(false); setPhase(6); }],
    ];
    const timers = seq.map(([t, fn]) => setTimeout(fn, t));
    const loop = setInterval(() => {
      setPhase(0); setTyping(false);
      seq.forEach(([t, fn]) => setTimeout(fn, t));
    }, 16000);
    return () => { timers.forEach(clearTimeout); clearInterval(loop); };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActIdx(v => (v + 1) % ACTIVITY.length), 3500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
  }, [phase, typing]);

  const visible = SCRIPT.slice(0, phase);
  const act1 = ACTIVITY[actIdx];
  const act2 = ACTIVITY[(actIdx + 1) % ACTIVITY.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, delay: 0.5, ease: M.ease }}
      style={{
        width: "100%", borderRadius: 18, overflow: "hidden",
        background: "linear-gradient(180deg, rgba(22,22,28,0.99) 0%, rgba(14,14,18,0.99) 100%)",
        boxShadow: [
          "0 40px 100px rgba(0,0,0,0.32)",
          "0 12px 40px rgba(124,58,237,0.12)",
          "0 0 0 1px rgba(255,255,255,0.07)",
        ].join(", "),
        position: "relative",
      }}
    >
      {/* Glass reflection strip */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "35%",
        background: "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, transparent 100%)",
        borderRadius: "18px 18px 0 0", pointerEvents: "none", zIndex: 10,
      }} />

      {/* Browser chrome */}
      <div style={{
        padding: "9px 14px", background: "rgba(255,255,255,0.03)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#FF5F57","#FFBD2E","#28C840"].map((c) => (
            <div key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(255,255,255,0.06)", borderRadius: 5,
            padding: "2px 10px",
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E" }} />
            <span style={{ fontSize: 9.5, color: "rgba(255,255,255,0.32)", fontWeight: 500 }}>
              app.sety.vision
            </span>
          </div>
        </div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.20)", fontWeight: 500 }}>{clock}</div>
      </div>

      {/* Dashboard body */}
      <div style={{ display: "flex", height: 418 }}>

        {/* Sidebar */}
        <div style={{
          width: 42, background: "rgba(0,0,0,0.22)",
          borderRight: "1px solid rgba(255,255,255,0.04)",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "10px 0", gap: 8,
        }}>
          <div style={{ width: 24, height: 24, borderRadius: 7, background: colors.purple, display:"flex", alignItems:"center", justifyContent:"center", marginBottom: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {/* Active nav item */}
          <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center" }}>
            <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 2, height: 14, background: colors.purple, borderRadius: "0 2px 2px 0" }} />
            <div style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(124,58,237,0.15)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: "rgba(124,58,237,0.6)" }} />
            </div>
          </div>
          {[1,2,3,4].map((i) => (
            <div key={i} style={{ width: 24, height: 24, borderRadius: 7, background: "rgba(255,255,255,0.05)" }} />
          ))}
          <div style={{ marginTop: "auto" }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#3B82F6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize: 8, color: "white", fontWeight: 700 }}>S</div>
          </div>
        </div>

        {/* Main area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, padding: "10px 10px 0" }}>

          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>Painel</p>
              <p style={{ fontSize: 8, color: "rgba(255,255,255,0.32)", margin: 0 }}>Última sync: agora</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {/* Search */}
              <div style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 6, padding: "3px 8px",
              }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.25)" }} />
                <span style={{ fontSize: 8, color: "rgba(255,255,255,0.28)" }}>Buscar…</span>
              </div>
              {/* Live indicator */}
              <div style={{ display: "flex", alignItems: "center", gap: 3, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 20, padding: "2px 6px" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E", animation: "mockup-pulse 2s ease-in-out infinite" }} />
                <span style={{ fontSize: 7.5, color: "#22C55E", fontWeight: 600 }}>IA ATIVA</span>
              </div>
              {/* Notifications */}
              <div style={{ position: "relative", width: 22, height: 22, borderRadius: 6, background: "rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width: 9, height: 9, borderRadius: 2, background: "rgba(255,255,255,0.35)" }} />
                <div style={{ position: "absolute", top: 3, right: 3, width: 5, height: 5, borderRadius: "50%", background: "#EF4444", border: "1px solid rgba(14,14,18,0.99)" }} />
              </div>
              {/* Avatar */}
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#3B82F6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize: 8, color: "white", fontWeight: 700 }}>S</div>
            </div>
          </div>

          {/* KPI grid — 4 cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 8 }}>
            {KPIS.map((k) => (
              <div key={k.id} style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 9, padding: "7px 8px",
              }}>
                <p style={{ fontSize: 7.5, color: "rgba(255,255,255,0.36)", margin: "0 0 3px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {k.label}
                </p>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.04em", lineHeight: 1 }}>
                      {k.display}{k.suffix}
                    </p>
                    <span style={{ fontSize: 7, color: k.up ? "#22C55E" : "#F59E0B", fontWeight: 700 }}>
                      {k.up ? "▲" : "▼"} {k.change}
                    </span>
                  </div>
                  <Sparkline data={k.spark} color={k.color} id={k.id} />
                </div>
              </div>
            ))}
          </div>

          {/* Content row: Chart + WhatsApp */}
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 8, flex: 1, minHeight: 0 }}>

            {/* Premium chart */}
            <div style={{
              background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: 10, padding: "8px 10px", display: "flex", flexDirection: "column",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <p style={{ fontSize: 8.5, color: "rgba(255,255,255,0.38)", margin: 0, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Conversões — 30 dias
                </p>
                <div style={{ display: "flex", gap: 3 }}>
                  {["7d","30d","90d"].map((t, i) => (
                    <span key={t} style={{
                      fontSize: 7, fontWeight: 600, padding: "1px 5px", borderRadius: 3,
                      background: i === 1 ? "rgba(124,58,237,0.2)" : "transparent",
                      color: i === 1 ? colors.purple : "rgba(255,255,255,0.25)",
                    }}>{t}</span>
                  ))}
                </div>
              </div>
              <svg viewBox="0 0 160 70" style={{ flex: 1 }} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.40" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.02" />
                  </linearGradient>
                  <filter id="glow2">
                    <feGaussianBlur stdDeviation="2.5" result="blur"/>
                    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                  <clipPath id="cc2">
                    <motion.rect x={0} y={0} height={72}
                      initial={{ width: 0 }}
                      animate={{ width: 160 }}
                      transition={{ duration: 2.0, delay: 0.9, ease: "easeOut" }}
                    />
                  </clipPath>
                </defs>
                {/* Grid lines */}
                {[58,44,30,16].map((y) => (
                  <line key={y} x1="0" y1={y} x2="160" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
                ))}
                <g clipPath="url(#cc2)">
                  <path
                    d="M0,62 C8,62 15,52 23,52 C31,52 38,47 46,46 C54,45 61,37 70,36 C79,35 86,39 93,40 C100,41 108,25 116,24 C124,23 132,17 140,16 L150,10 L160,7"
                    fill="url(#cg2)"
                  />
                  <path
                    d="M0,62 C8,62 15,52 23,52 C31,52 38,47 46,46 C54,45 61,37 70,36 C79,35 86,39 93,40 C100,41 108,25 116,24 C124,23 132,17 140,16 L150,10 L160,7"
                    fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"
                    filter="url(#glow2)"
                  />
                  {[[23,52],[46,46],[70,36],[93,40],[116,24],[140,16],[160,7]].map(([x,y],i) => (
                    <motion.circle key={i} cx={x} cy={y} r={2.5} fill="#7C3AED"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + i * 0.18 }}
                    />
                  ))}
                </g>
              </svg>
            </div>

            {/* WhatsApp panel */}
            <div style={{
              borderRadius: 10, overflow: "hidden",
              display: "flex", flexDirection: "column",
              background: "#ECE5DD",
            }}>
              <div style={{ background: "#075E54", padding: "5px 8px", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                <div style={{ width: 19, height: 19, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, flexShrink: 0 }}>🤖</div>
                <div>
                  <p style={{ fontSize: 8, fontWeight: 700, color: "#fff", margin: 0 }}>Sety Vision IA</p>
                  <p style={{ fontSize: 6.5, color: "rgba(255,255,255,0.7)", margin: 0 }}>{typing ? "digitando…" : "online"}</p>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: 3 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(255,255,255,0.12)" }}/>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(255,255,255,0.12)" }}/>
                </div>
              </div>

              <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "5px 5px 3px", display: "flex", flexDirection: "column", gap: 3 }}>
                {visible.length === 0 && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.5 }}>
                    <p style={{ fontSize: 7, color: "#666", textAlign: "center", margin: 0 }}>Aguardando cliente…</p>
                  </div>
                )}
                <AnimatePresence>
                  {visible.map((msg, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 6, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
                    >
                      <div style={{
                        maxWidth: "88%",
                        background: msg.role === "user" ? "#DCF8C6" : "#fff",
                        borderRadius: msg.role === "user" ? "7px 7px 1px 7px" : "7px 7px 7px 1px",
                        padding: "3px 7px 3px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
                      }}>
                        <p style={{ fontSize: 7, color: "#111", margin: 0, lineHeight: 1.45 }}>{msg.text}</p>
                        <p style={{ fontSize: 5.5, color: "#999", margin: "1px 0 0", textAlign: "right" }}>
                          {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          {msg.role === "ai" && " ✓✓"}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <AnimatePresence>
                  {typing && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div style={{ background: "#fff", borderRadius: "7px 7px 7px 1px", padding: "5px 8px", display: "inline-flex", gap: 2.5, alignItems: "center" }}>
                        {[0, 0.15, 0.3].map((d, i) => (
                          <motion.div key={i}
                            style={{ width: 3.5, height: 3.5, borderRadius: "50%", background: "#9CA3AF" }}
                            animate={{ y: [0, -2.5, 0] }}
                            transition={{ duration: 0.6, delay: d, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div style={{ padding: "3px 5px", background: "#F0F0F0", display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
                <div style={{ flex: 1, background: "#fff", borderRadius: 10, padding: "3px 7px", fontSize: 6.5, color: "#999" }}>Mensagem</div>
                <div style={{ width: 17, height: 17, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, flexShrink: 0 }}>➤</div>
              </div>
            </div>
          </div>

          {/* Activity feed */}
          <div style={{
            display: "flex", gap: 6, padding: "8px 0 8px",
            borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: 8,
          }}>
            <AnimatePresence mode="wait">
              {[act1, act2].map((ev, i) => (
                <motion.div key={`${actIdx}-${i}`}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", gap: 5,
                    background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)",
                    borderRadius: 7, padding: "5px 7px",
                  }}
                >
                  <span style={{ fontSize: 10, flexShrink: 0 }}>{ev.icon}</span>
                  <span style={{ fontSize: 7.5, color: "rgba(255,255,255,0.55)", flex: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{ev.text}</span>
                  <span style={{ fontSize: 6.5, color: ev.bc, fontWeight: 700, flexShrink: 0, background: `${ev.bc}18`, padding: "1px 5px", borderRadius: 3 }}>{ev.badge}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mockup-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </motion.div>
  );
}

/* ── Pill badge ──────────────────────────────────────────── */
function PillBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      style={{ marginBottom: 28 }}
    >
      <a href="#produto" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 14px 5px 6px", borderRadius: radius.full,
        background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.20)",
        textDecoration: "none",
      }}>
        <span style={{
          background: colors.purple, color: "#fff",
          fontSize: 9, fontWeight: 800, letterSpacing: "0.07em",
          padding: "2px 8px", borderRadius: radius.full,
        }}>NOVO</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: colors.purple }}>
          IA com qualificação automática via WhatsApp
        </span>
        <ChevronRight size={11} color={colors.purple} />
      </a>
    </motion.div>
  );
}

/* ── Stats counter ───────────────────────────────────────── */
function StatCounter({ to, suf }: { to: number; suf: string }) {
  const { ref, v } = useCountUp(to);
  return (
    <span ref={ref}>
      {to >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}{suf}
    </span>
  );
}

/* ── Hero ────────────────────────────────────────────────── */
export function Hero() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "visible",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        padding: "120px 32px 80px",
        background: "#FFFFFF",
      }}
    >
      {/* Background mesh glows */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-25%", left: "-18%",
          width: "85%", height: "110%", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.28) 0%, rgba(124,58,237,0.08) 45%, transparent 70%)",
          filter: "blur(80px)", animation: "pulse-glow 6s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-25%", right: "-15%",
          width: "75%", height: "95%", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.22) 0%, rgba(59,130,246,0.06) 50%, transparent 70%)",
          filter: "blur(80px)", animation: "pulse-glow 8s ease-in-out infinite 2s",
        }} />
        <div style={{
          position: "absolute", top: "10%", right: "15%",
          width: "55%", height: "70%", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 65%)",
          filter: "blur(90px)", animation: "pulse-glow 7s ease-in-out infinite 1s",
        }} />
        <div style={{
          position: "absolute", bottom: "0%", left: "20%",
          width: "40%", height: "50%", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 65%)",
          filter: "blur(60px)",
        }} />
        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(0,0,0,0.032) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.032) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }} />
      </div>

      {/* 2-column content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.45fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          {/* Left: text */}
          <div>
            <PillBadge />

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease: M.ease }}
              style={{
                fontSize: "clamp(40px, 5.5vw, 70px)",
                fontWeight: 900,
                letterSpacing: "-0.045em",
                lineHeight: 1.02,
                color: colors.text,
                margin: "0 0 24px",
              }}
            >
              A IA que automatiza
              <br />
              <span style={{
                background: `linear-gradient(135deg, ${colors.purple} 0%, #A855F7 45%, #C084FC 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                WhatsApp,
              </span>
              <br />
              CRM e vendas.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              style={{
                fontSize: 17, lineHeight: 1.7, color: colors.textSecondary,
                maxWidth: 420, margin: "0 0 36px",
              }}
            >
              Converta visitantes em clientes com IA que responde, qualifica e agenda
              — automático, 24h por dia, sem código.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.48 }}
              style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 52 }}
            >
              <motion.a
                href="/painel"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: colors.text, color: "#fff",
                  padding: "14px 28px", borderRadius: radius.full,
                  fontSize: 14, fontWeight: 700, textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(10,10,10,0.28)",
                  position: "relative", overflow: "hidden",
                }}
                whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(10,10,10,0.38), 0 0 0 3px rgba(124,58,237,0.18)" } as never}
                whileTap={{ scale: 0.97 }}
              >
                Começar grátis
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  style={{ display: "flex" }}
                >
                  <ArrowRight size={14} />
                </motion.span>
              </motion.a>

              <motion.a
                href={WA_LINK} target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  background: "transparent", color: colors.text,
                  padding: "14px 24px", borderRadius: radius.full,
                  fontSize: 14, fontWeight: 600, textDecoration: "none",
                  border: "1.5px solid rgba(0,0,0,0.12)",
                }}
                whileHover={{ scale: 1.03, borderColor: colors.purple, color: colors.purple } as never}
                whileTap={{ scale: 0.97 }}
              >
                <Zap size={13} fill="currentColor" /> Ver demo
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              style={{ display: "flex", gap: 36, flexWrap: "wrap" }}
            >
              {([
                { v: 300,   suf: "+", label: "Empresas" },
                { v: 50000, suf: "+", label: "Mensagens" },
                { v: 48,    suf: "",  label: "Integrações" },
              ] as const).map((s, i) => (
                <div key={i}>
                  <div style={{
                    fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 900,
                    letterSpacing: "-1.5px", color: colors.text, lineHeight: 1,
                  }}>
                    <StatCounter to={s.v} suf={s.suf} />
                  </div>
                  <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 4, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: mockup */}
          <div style={{ position: "relative" }}>
            {FLOAT_ICONS.map((icon) => (
              <FloatingIcon key={icon.slug} {...icon} />
            ))}

            {/* Multi-layer glow behind mockup */}
            <div aria-hidden style={{
              position: "absolute", top: "-12%", left: "-10%", right: "-10%", bottom: "-12%",
              background: "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.32) 0%, rgba(59,130,246,0.14) 45%, transparent 70%)",
              filter: "blur(72px)", zIndex: 0,
            }} />
            <div aria-hidden style={{
              position: "absolute", bottom: "-5%", right: "-5%",
              width: "60%", height: "50%",
              background: "radial-gradient(circle, rgba(236,72,153,0.16) 0%, transparent 70%)",
              filter: "blur(52px)", zIndex: 0,
            }} />

            {/* Float + perspective */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "relative", zIndex: 1 }}
            >
              <DashboardMockup />
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 920px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-grid > div:last-child { display: none; }
        }
        @media (max-width: 640px) {
          section[style] { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>
    </section>
  );
}
