"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, ChevronRight, Zap } from "lucide-react";
import { colors, radius, shadow, motion as M } from "@/lib/tokens";

const WA_LINK = "https://wa.me/559XXXXXXXXX?text=Quero+ver+o+Sety+Vision";

/* ── Floating icons (around the mockup) ─────────────────── */
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
        <img
          src={`/integrations/${slug}.svg`}
          alt={name} width={ico} height={ico}
          style={{ width: ico, height: ico, filter: "brightness(0) invert(1)" }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ── Dashboard Mockup (animated) ─────────────────────────── */
type ChatMsg = { role: "user" | "ai"; text: string };

const SCRIPT: ChatMsg[] = [
  { role: "user", text: "Oi, quero marcar uma avaliação." },
  { role: "ai",   text: "Olá! Temos quinta às 14h disponível. Confirmo?" },
  { role: "user", text: "Sim, perfeito!" },
  { role: "ai",   text: "Agendado! 📅 Confirmação enviada no WhatsApp." },
];

function useCountUp(to: number, dur = 1200) {
  const ref   = useRef<HTMLSpanElement>(null);
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

function KPI({ label, value, suffix, color }: { label: string; value: number; suffix: string; color: string }) {
  const { ref, v } = useCountUp(value);
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 10, padding: "8px 10px",
    }}>
      <p style={{ fontSize: 9, color: "rgba(255,255,255,0.38)", margin: "0 0 3px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
        {label}
      </p>
      <p style={{ fontSize: 17, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.03em", lineHeight: 1 }}>
        <span ref={ref}>{value >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}</span>{suffix}
      </p>
      <div style={{ marginTop: 5, height: 2, background: "rgba(255,255,255,0.07)", borderRadius: 2 }}>
        <div style={{ width: `${Math.min(value, 100)}%`, height: "100%", background: color, borderRadius: 2 }} />
      </div>
    </div>
  );
}

function DashboardMockup() {
  const [phase, setPhase]   = useState(0);
  const [typing, setTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seq = [
      [1000,  () => setPhase(1)],
      [2800,  () => setTyping(true)],
      [4200,  () => { setTyping(false); setPhase(2); }],
      [6000,  () => setPhase(3)],
      [7400,  () => setTyping(true)],
      [9000,  () => { setTyping(false); setPhase(4); }],
      [13000, () => { setPhase(0); setTyping(false); }],
    ] as [number, () => void][];

    const timers = seq.map(([t, fn]) => setTimeout(fn, t));
    const loop = setInterval(() => {
      setPhase(0); setTyping(false);
      seq.forEach(([t, fn]) => setTimeout(fn, t));
    }, 15000);
    return () => { timers.forEach(clearTimeout); clearInterval(loop); };
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
  }, [phase, typing]);

  const NOW = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const visible = SCRIPT.slice(0, phase);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.5, ease: M.ease }}
      style={{
        width: "100%", borderRadius: 18, overflow: "hidden",
        background: "#111118",
        boxShadow: "0 48px 100px rgba(0,0,0,0.30), 0 12px 40px rgba(0,0,0,0.18), 0 0 0 1px rgba(255,255,255,0.06)",
      }}
    >
      {/* Browser chrome */}
      <div style={{
        padding: "10px 14px", background: "#1A1A24",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#FF5F57","#FFBD2E","#28C840"].map((c) => (
            <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{
          flex: 1, textAlign: "center", fontSize: 10.5, color: "rgba(255,255,255,0.28)", fontWeight: 500,
        }}>
          app.sety.vision
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Dashboard body */}
      <div style={{ display: "flex", height: 340 }}>

        {/* Sidebar */}
        <div style={{
          width: 44, background: "#0D0D14",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "12px 0", gap: 10,
        }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: colors.purple, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {["rgba(255,255,255,0.10)","rgba(255,255,255,0.10)","rgba(255,255,255,0.10)"].map((bg, i) => (
            <div key={i} style={{ width: 26, height: 26, borderRadius: 7, background: bg }} />
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: "12px 12px 0", display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>

          {/* Topbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#fff", margin: 0 }}>Painel</p>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", animation: "mockup-pulse 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 9, color: "#22C55E", fontWeight: 600 }}>IA ativa</span>
            </div>
          </div>

          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
            <KPI label="Leads hoje"  value={47}    suffix=""  color="#7C3AED" />
            <KPI label="Receita"     value={34200} suffix="K" color="#22C55E" />
            <KPI label="Conversão"   value={94}    suffix="%" color="#3B82F6" />
          </div>

          {/* Chart + WhatsApp */}
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 8, flex: 1, minHeight: 0 }}>

            {/* Sparkline */}
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 10, padding: "8px 10px", display: "flex", flexDirection: "column",
            }}>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", margin: "0 0 6px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Conversões
              </p>
              <svg viewBox="0 0 140 56" style={{ flex: 1 }} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="cc">
                    <motion.rect x={0} y={0} height={60}
                      initial={{ width: 0 }}
                      animate={{ width: 140 }}
                      transition={{ duration: 1.8, delay: 0.8, ease: "easeOut" }}
                    />
                  </clipPath>
                </defs>
                <g clipPath="url(#cc)">
                  <path d="M0,52 L23,42 L46,36 L70,26 L93,30 L116,14 L140,6" fill="none" stroke="#7C3AED" strokeWidth="2.2" strokeLinecap="round"/>
                  <path d="M0,52 L23,42 L46,36 L70,26 L93,30 L116,14 L140,6 L140,56 L0,56Z" fill="url(#cg)"/>
                </g>
                {[23,46,70,93,116].map((x, i) => {
                  const y = [42,36,26,30,14][i];
                  return (
                    <motion.circle key={i} cx={x} cy={y} r={3} fill="#7C3AED"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.15 }}
                    />
                  );
                })}
              </svg>
            </div>

            {/* WhatsApp panel */}
            <div style={{
              borderRadius: 10, overflow: "hidden",
              display: "flex", flexDirection: "column",
              background: "#ECE5DD",
            }}>
              {/* WA header */}
              <div style={{ background: "#075E54", padding: "6px 8px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, flexShrink: 0 }}>🤖</div>
                <div>
                  <p style={{ fontSize: 8.5, fontWeight: 700, color: "#fff", margin: 0 }}>Sety Vision IA</p>
                  <p style={{ fontSize: 7, color: "rgba(255,255,255,0.7)", margin: 0 }}>{typing ? "digitando…" : "online"}</p>
                </div>
              </div>

              {/* Messages */}
              <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "5px 5px 3px", display: "flex", flexDirection: "column", gap: 3 }}>
                {visible.length === 0 && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.5 }}>
                    <p style={{ fontSize: 7.5, color: "#666", textAlign: "center", margin: 0 }}>Aguardando…</p>
                  </div>
                )}
                <AnimatePresence>
                  {visible.map((msg, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 6, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 360, damping: 28 }}
                      style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
                    >
                      <div style={{
                        maxWidth: "86%",
                        background: msg.role === "user" ? "#DCF8C6" : "#fff",
                        borderRadius: msg.role === "user" ? "7px 7px 1px 7px" : "7px 7px 7px 1px",
                        padding: "3px 7px 2px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.10)",
                      }}>
                        <p style={{ fontSize: 7.5, color: "#111", margin: 0, lineHeight: 1.4 }}>{msg.text}</p>
                        <p style={{ fontSize: 6, color: "#999", margin: "1px 0 0", textAlign: "right" }}>{NOW}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <AnimatePresence>
                  {typing && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ display: "flex" }}
                    >
                      <div style={{ background: "#fff", borderRadius: "7px 7px 7px 1px", padding: "4px 7px", display: "flex", gap: 2.5, alignItems: "center" }}>
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

              {/* Input bar */}
              <div style={{ padding: "3px 5px", background: "#F0F0F0", display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
                <div style={{ flex: 1, background: "#fff", borderRadius: 10, padding: "3px 7px", fontSize: 7, color: "#999" }}>Mensagem</div>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, flexShrink: 0 }}>➤</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes mockup-pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
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
      {/* ── Background mesh glows ── */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        {/* Purple — top-left */}
        <div style={{
          position: "absolute", top: "-15%", left: "-12%",
          width: "70%", height: "90%", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.20) 0%, transparent 65%)",
          filter: "blur(72px)",
        }} />
        {/* Blue — bottom-right */}
        <div style={{
          position: "absolute", bottom: "-20%", right: "-12%",
          width: "65%", height: "85%", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.16) 0%, transparent 65%)",
          filter: "blur(72px)",
        }} />
        {/* Pink — center-right */}
        <div style={{
          position: "absolute", top: "15%", right: "10%",
          width: "50%", height: "60%", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(214,70,239,0.09) 0%, transparent 65%)",
          filter: "blur(80px)",
        }} />
        {/* Subtle grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(0,0,0,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.028) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }} />
      </div>

      {/* ── 2-column content ── */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 56,
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
                whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(10,10,10,0.38)" } as never}
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
            {/* Floating icons */}
            {FLOAT_ICONS.map((icon) => (
              <FloatingIcon key={icon.slug} {...icon} />
            ))}

            {/* Glow behind mockup */}
            <div aria-hidden style={{
              position: "absolute", top: "5%", left: "5%", right: "5%", bottom: "5%",
              background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
              filter: "blur(48px)", zIndex: 0,
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
              <DashboardMockup />
            </div>
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
