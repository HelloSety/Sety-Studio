"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, ChevronRight, Zap } from "lucide-react";
import { colors, radius, motion as M } from "@/lib/tokens";

const WA_LINK = "https://wa.me/559XXXXXXXXX?text=Quero+ver+o+Sety+Vision";

/* ── Floating icons ──────────────────────────────────────── */
type FI = { slug: string; hex: string; name: string; style: CSSProperties; delay: number; size: number };
const FLOAT_ICONS: FI[] = [
  { slug: "whatsapp",  hex: "25D366", name: "WhatsApp",  style: { top: "-24px",  left: "-48px"  }, delay: 0,   size: 56 },
  { slug: "openai",    hex: "10A37F", name: "OpenAI",    style: { top: "-20px",  right: "-44px" }, delay: 0.3, size: 52 },
  { slug: "hubspot",   hex: "FF7A59", name: "HubSpot",   style: { bottom: "15%", left: "-56px"  }, delay: 0.7, size: 48 },
  { slug: "stripe",    hex: "635BFF", name: "Stripe",    style: { bottom: "18%", right: "-48px" }, delay: 0.5, size: 48 },
  { slug: "n8n",       hex: "EA4B71", name: "N8N",       style: { top: "38%",    left: "-44px"  }, delay: 1.0, size: 44 },
  { slug: "anthropic", hex: "D97757", name: "Anthropic", style: { top: "35%",    right: "-42px" }, delay: 0.2, size: 44 },
];
function FloatingIcon({ slug, hex, name, style, delay, size }: FI) {
  const ico = Math.round(size * 0.50);
  const r   = Math.round(size * 0.24);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.9 + delay, ease: M.ease }}
      style={{ position: "absolute", ...style, zIndex: 10 }}>
      <motion.div animate={{ y: [0, -9, 0] }}
        transition={{ duration: 3.6 + delay * 0.7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: size, height: size, borderRadius: r,
          background: `#${hex}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 28px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.10), 0 0 0 1px rgba(255,255,255,0.08)",
        }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/integrations/${slug}.svg`} alt={name} width={ico} height={ico}
          style={{ width: ico, height: ico, filter: "brightness(0) invert(1)" }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }} />
      </motion.div>
    </motion.div>
  );
}

/* ── Monotone cubic bezier (Fritsch-Carlson) ─────────────── */
function monoPath(pts: [number, number][]): string {
  const n = pts.length;
  if (n < 2) return `M${pts[0]?.[0] ?? 0},${pts[0]?.[1] ?? 0}`;
  const dx = pts.slice(1).map((p, i) => p[0] - pts[i][0]);
  const dy = pts.slice(1).map((p, i) => p[1] - pts[i][1]);
  const s  = dx.map((d, i) => (d === 0 ? 0 : dy[i] / d));
  const t: number[] = new Array(n);
  t[0] = s[0]; t[n-1] = s[n-2];
  for (let i = 1; i < n - 1; i++)
    t[i] = s[i-1] * s[i] <= 0 ? 0 : (s[i-1] + s[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (Math.abs(s[i]) < 1e-8) { t[i] = t[i+1] = 0; continue; }
    const a = t[i] / s[i], b = t[i+1] / s[i], r = Math.sqrt(a*a + b*b);
    if (r > 3) { t[i] *= 3/r; t[i+1] *= 3/r; }
  }
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${(pts[i][0]+h).toFixed(2)},${(pts[i][1]+t[i]*h).toFixed(2)} ${(pts[i+1][0]-h).toFixed(2)},${(pts[i+1][1]-t[i+1]*h).toFixed(2)} ${pts[i+1][0].toFixed(2)},${pts[i+1][1].toFixed(2)}`;
  }
  return d;
}

/* ── Sparkline ───────────────────────────────────────────── */
function Sparkline({ data, color, id }: { data: number[]; color: string; id: string }) {
  const min = Math.min(...data); const max = Math.max(...data); const range = max - min || 1;
  const W = 44; const H = 20;
  const pts: [number, number][] = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - 3 - ((v - min) / range) * (H - 6),
  ]);
  const line = monoPath(pts);
  const fill = `${line} L${W},${H} L0,${H}Z`;
  return (
    <svg width={W} height={H} style={{ overflow: "visible", flexShrink: 0 }}>
      <defs>
        <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#sg-${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx={pts[pts.length-1][0]} cy={pts[pts.length-1][1]} r="1.8" fill={color} />
    </svg>
  );
}

/* ── LiveChart — redesigned com eixos ────────────────────── */
const CHART_DATA = [32, 36, 40, 39, 45, 48, 54, 58, 56, 62, 69, 75];
const WIN = 8;

function LiveChart() {
  const [winStart, setWinStart]       = useState(0);
  const [showTip, setShowTip]         = useState(false);
  const [activePeriod, setActivePeriod] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setShowTip(true), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const id = setInterval(() =>
      setWinStart(s => s < CHART_DATA.length - WIN ? s + 1 : 0), 2800);
    return () => clearInterval(id);
  }, []);

  const visible = CHART_DATA.slice(winStart, winStart + WIN);
  const W = 160; const H = 64;
  const yMin = 26; const yMax = 80;
  const sx = (i: number) => (i / (WIN - 1)) * W;
  const sy = (v: number) => H - 4 - ((v - yMin) / (yMax - yMin)) * (H - 8);
  const pts: [number, number][] = visible.map((v, i) => [sx(i), sy(v)]);
  const line = monoPath(pts);
  const area = `${line} L${W},${H} L0,${H}Z`;
  const lp   = pts[pts.length - 1];
  const lv   = visible[visible.length - 1];

  const PERIODS  = ["7D", "30D", "90D"];
  const Y_LABELS = [75, 52, 30];
  const X_LABELS = ["Dez", "Fev", "Abr", "Jun"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: 6, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#7C3AED" }} />
            <span style={{ fontSize: 7, color: "rgba(255,255,255,0.4)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Conversões — {PERIODS[activePeriod]}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1 }}>{lv}</span>
            <span style={{ fontSize: 7.5, fontWeight: 700, color: "#4ADE80" }}>↑ +24%</span>
          </div>
        </div>
        {/* Period tabs */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 6, padding: "2px", gap: 1 }}>
          {PERIODS.map((p, i) => (
            <button key={p} onClick={() => setActivePeriod(i)} style={{
              fontSize: 6.5, fontWeight: 700, padding: "2.5px 7px", borderRadius: 4,
              border: "none", cursor: "pointer", transition: "all 0.15s",
              background: activePeriod === i ? "rgba(124,58,237,0.28)" : "transparent",
              color: activePeriod === i ? "#A78BFA" : "rgba(255,255,255,0.28)",
            }}>{p}</button>
          ))}
        </div>
      </div>

      {/* Chart + axes */}
      <div style={{ flex: 1, display: "flex", gap: 4, minHeight: 0 }}>
        {/* Y-axis labels */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingBottom: 13, paddingTop: 2, flexShrink: 0, alignItems: "flex-end" }}>
          {Y_LABELS.map(v => (
            <span key={v} style={{ fontSize: 5.5, color: "rgba(255,255,255,0.22)", fontWeight: 600, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{v}</span>
          ))}
        </div>
        {/* SVG column */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, gap: 2 }}>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ flex: 1, width: "100%", overflow: "visible" }} preserveAspectRatio="none">
            <defs>
              <linearGradient id="lcGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#7C3AED" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.01" />
              </linearGradient>
              <filter id="lcGlow">
                <feGaussianBlur stdDeviation="1" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <clipPath id="lcClip">
                <motion.rect x={0} y={-4} height={H + 8}
                  initial={{ width: 0 }}
                  animate={{ width: W }}
                  transition={{ duration: 1.8, delay: 0.8, ease: "easeOut" }}
                />
              </clipPath>
            </defs>

            {/* Horizontal gridlines */}
            {[0.12, 0.40, 0.68, 0.92].map((f, i) => (
              <line key={i} x1="0" y1={H * f} x2={W} y2={H * f}
                stroke="rgba(255,255,255,0.058)" strokeWidth="0.6" strokeDasharray="3,4" />
            ))}

            <g clipPath="url(#lcClip)">
              <AnimatePresence mode="wait">
                <motion.g key={winStart}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}>
                  <path d={area} fill="url(#lcGrad)" />
                  <path d={line} fill="none" stroke="#7C3AED" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" filter="url(#lcGlow)" />
                  {pts.slice(0, -1).map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="1.6" fill="#7C3AED" fillOpacity="0.38" />
                  ))}
                </motion.g>
              </AnimatePresence>

              {/* Last point — pulse ring */}
              <motion.circle cx={lp[0]} cy={lp[1]}
                animate={{ r: [2.2, 3.2, 2.2] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                fill="#7C3AED" />
              <circle cx={lp[0]} cy={lp[1]} r="5.5" fill="none"
                stroke="#7C3AED" strokeWidth="0.5" strokeOpacity="0.2" />

              {/* Vertical drop line */}
              <line x1={lp[0]} y1={lp[1] + 4} x2={lp[0]} y2={H}
                stroke="rgba(124,58,237,0.18)" strokeWidth="0.8" strokeDasharray="2,3" />

              {/* Tooltip */}
              <AnimatePresence>
                {showTip && (
                  <motion.g
                    initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <rect
                      x={Math.min(lp[0] - 16, W - 34)} y={lp[1] - 27}
                      width={32} height={18} rx={4}
                      fill="rgba(12,12,20,0.96)" stroke="rgba(124,58,237,0.45)" strokeWidth="0.5" />
                    <text x={Math.min(lp[0] - 16, W - 34) + 16} y={lp[1] - 16.5}
                      fontSize="8" fill="white" textAnchor="middle" fontWeight="800">{lv}</text>
                    <text x={Math.min(lp[0] - 16, W - 34) + 16} y={lp[1] - 9.5}
                      fontSize="5.5" fill="rgba(167,139,250,0.7)" textAnchor="middle">leads</text>
                    <line x1={lp[0]} y1={lp[1] - 9} x2={lp[0]} y2={lp[1] - 4}
                      stroke="rgba(124,58,237,0.4)" strokeWidth="0.5" />
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          </svg>

          {/* X-axis labels */}
          <div style={{ display: "flex", justifyContent: "space-between", flexShrink: 0, paddingRight: 2 }}>
            {X_LABELS.map(m => (
              <span key={m} style={{ fontSize: 5.5, color: "rgba(255,255,255,0.2)", fontWeight: 500 }}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── useCountUp ──────────────────────────────────────────── */
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

/* ── Dashboard constants ─────────────────────────────────── */
type ChatMsg = { role: "user" | "ai"; text: string };

const SCRIPT: ChatMsg[] = [
  { role: "user", text: "Oi! Tenho uma clínica e quero automatizar agendamentos." },
  { role: "ai",   text: "Perfeito! A Sety Vision agenda, confirma e faz follow-up 24h. Quantos pacientes/dia?" },
  { role: "user", text: "Cerca de 30 por dia." },
  { role: "ai",   text: "Ideal para o Business! IA + CRM + WhatsApp ilimitado. Posso agendar uma demo?" },
  { role: "user", text: "Sim! Quinta às 14h." },
  { role: "ai",   text: "📅 Demo agendada! Confirmação no WhatsApp. Lead: Alta Prioridade 🔥" },
];

const NAV_ICONS = [
  { d: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z", active: true },
  { d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z", active: false },
  { d: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z", active: false },
  { d: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01", active: false },
  { d: "M22 12h-4l-3 9L9 3l-3 9H2", active: false },
];

const KPIS = [
  { label: "Leads",     display: "47",  suffix: "",  change: "+18%", up: true,  color: "#7C3AED",
    spark: [28,32,26,38,42,35,47],       id: "leads",
    icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" },
  { label: "Receita",   display: "34K", suffix: "",  change: "+24%", up: true,  color: "#22C55E",
    spark: [18,22,24,20,28,30,34],       id: "receita",
    icon: "M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" },
  { label: "Conversão", display: "94",  suffix: "%", change: "+6%",  up: true,  color: "#3B82F6",
    spark: [76,80,84,82,88,90,94],       id: "conv",
    icon: "M22 7l-8.5 8.5-5-5L2 17M15 7h7v7" },
  { label: "Resp. IA",  display: "0.6", suffix: "s", change: "−32%", up: false, color: "#F59E0B",
    spark: [1.4,1.2,1.0,0.9,0.8,0.7,0.6], id: "resp",
    icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z" },
];

const ACTIVITY = [
  { icon: "🤖", text: "IA respondeu Ana em 0.6s",      badge: "Automático",  bc: "#7C3AED" },
  { icon: "📅", text: "Demo agendada — Carlos M.",      badge: "Agendado",    bc: "#22C55E" },
  { icon: "🎯", text: "Lead qualificado — Score 94",    badge: "Alta Prior.", bc: "#F59E0B" },
  { icon: "💰", text: "Nova oportunidade R$6.200",      badge: "Pipeline",    bc: "#3B82F6" },
  { icon: "💬", text: "WhatsApp — 47 contatos",         badge: "Enviado",     bc: "#25D366" },
];

/* ── DashboardMockup ─────────────────────────────────────── */
function DashboardMockup() {
  const [phase,   setPhase]   = useState(0);
  const [typing,  setTyping]  = useState(false);
  const [actIdx,  setActIdx]  = useState(0);
  const [clock,   setClock]   = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const upd = () => setClock(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    upd();
    const id = setInterval(upd, 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const seq: [number, () => void][] = [
      [900,   () => setPhase(1)],
      [2100,  () => setTyping(true)],
      [3500,  () => { setTyping(false); setPhase(2); }],
      [5200,  () => setPhase(3)],
      [6400,  () => setTyping(true)],
      [7800,  () => { setTyping(false); setPhase(4); }],
      [9600,  () => setPhase(5)],
      [10800, () => setTyping(true)],
      [12200, () => { setTyping(false); setPhase(6); }],
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
      initial={{ opacity: 0, y: 32, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: M.ease }}
      style={{
        width: "100%", borderRadius: 20, overflow: "hidden",
        background: "linear-gradient(180deg, #0D0D14 0%, #080810 100%)",
        boxShadow: [
          "0 60px 140px rgba(0,0,0,0.55)",
          "0 24px 60px rgba(124,58,237,0.22)",
          "0 0 0 1px rgba(255,255,255,0.07)",
          "inset 0 1px 0 rgba(255,255,255,0.055)",
        ].join(", "),
        position: "relative",
      }}
    >
      {/* Glass highlight strip */}
      <div aria-hidden style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "38%",
        background: "linear-gradient(180deg, rgba(255,255,255,0.052) 0%, transparent 100%)",
        borderRadius: "20px 20px 0 0", pointerEvents: "none", zIndex: 10,
      }} />

      {/* Browser chrome */}
      <div style={{
        padding: "8px 14px",
        background: "rgba(255,255,255,0.025)",
        borderBottom: "1px solid rgba(255,255,255,0.048)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ display: "flex", gap: 4.5, flexShrink: 0 }}>
          {["#FF5F57","#FFBD2E","#28C840"].map(c => (
            <div key={c} style={{ width: 7.5, height: 7.5, borderRadius: "50%", background: c, boxShadow: `0 0 4px ${c}60` }} />
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(255,255,255,0.05)", borderRadius: 5,
            padding: "2.5px 12px", border: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{ width: 4.5, height: 4.5, borderRadius: "50%", background: "#22C55E", boxShadow: "0 0 5px #22C55E88" }} />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", fontWeight: 500 }}>app.sety.vision</span>
          </div>
        </div>
        <div style={{ fontSize: 8.5, color: "rgba(255,255,255,0.16)", fontVariantNumeric: "tabular-nums" }}>{clock}</div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", height: 480, position: "relative" }}>

        {/* Ambient glow */}
        <div aria-hidden style={{
          position: "absolute", top: "20%", left: "25%",
          width: "65%", height: "65%",
          background: "radial-gradient(circle, rgba(124,58,237,0.065) 0%, transparent 65%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        {/* ── Sidebar ── */}
        <div style={{
          width: 40, background: "#050508",
          borderRight: "1px solid rgba(255,255,255,0.04)",
          display: "flex", flexDirection: "column", alignItems: "center",
          paddingTop: 10, paddingBottom: 10, zIndex: 1, flexShrink: 0,
        }}>
          {/* Logo */}
          <div style={{
            width: 22, height: 22, borderRadius: 7,
            background: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 14, flexShrink: 0,
            boxShadow: "0 2px 12px rgba(124,58,237,0.45)",
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Nav items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
            {NAV_ICONS.map((item, i) => (
              <div key={i} style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", padding: "2px 0" }}>
                {item.active && (
                  <div style={{
                    position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                    width: 2, height: 14, background: "#7C3AED", borderRadius: "0 2px 2px 0",
                    boxShadow: "2px 0 8px rgba(124,58,237,0.5)",
                  }} />
                )}
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: item.active ? "rgba(124,58,237,0.13)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s",
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke={item.active ? "#9B72F6" : "rgba(255,255,255,0.2)"}
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={item.d} />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Avatar */}
          <div style={{
            width: 24, height: 24, borderRadius: "50%",
            background: "linear-gradient(135deg, #7C3AED, #3B82F6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, color: "white", fontWeight: 800,
            boxShadow: "0 0 0 1.5px rgba(124,58,237,0.45), 0 2px 8px rgba(0,0,0,0.4)",
          }}>S</div>
        </div>

        {/* ── Main area ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, padding: "10px 10px 0", zIndex: 1 }}>

          {/* Topbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexShrink: 0 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11.5, fontWeight: 800, color: "#fff", letterSpacing: "-0.04em" }}>Painel</span>
                <span style={{
                  fontSize: 7, color: "rgba(255,255,255,0.25)",
                  background: "rgba(255,255,255,0.05)", padding: "1.5px 6px",
                  borderRadius: 20, border: "1px solid rgba(255,255,255,0.07)",
                }}>Workspace</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 1 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#22C55E" }} />
                <span style={{ fontSize: 6.5, color: "rgba(255,255,255,0.22)" }}>seg, 30 jun · sincronizado agora</span>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {/* Search */}
              <div style={{
                display: "flex", alignItems: "center", gap: 4,
                background: "rgba(255,255,255,0.042)",
                border: "1px solid rgba(255,255,255,0.065)",
                borderRadius: 20, padding: "3px 10px",
              }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <span style={{ fontSize: 7.5, color: "rgba(255,255,255,0.2)" }}>Buscar…</span>
                <span style={{ fontSize: 6, color: "rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.06)", padding: "0.5px 4px", borderRadius: 3 }}>⌘K</span>
              </div>
              {/* IA badge */}
              <div style={{
                display: "flex", alignItems: "center", gap: 3,
                background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.15)",
                borderRadius: 20, padding: "2.5px 8px",
              }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E", animation: "mpulse 2s ease-in-out infinite" }} />
                <span style={{ fontSize: 7.5, color: "#4ADE80", fontWeight: 600, letterSpacing: "0.03em" }}>IA ATIVA</span>
              </div>
              {/* Bell */}
              <div style={{ position: "relative", width: 24, height: 24, borderRadius: 7, background: "rgba(255,255,255,0.042)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
                <div style={{ position: "absolute", top: 2, right: 2, width: 5.5, height: 5.5, borderRadius: "50%", background: "#EF4444", border: "1.5px solid #080810", boxShadow: "0 0 6px #EF444488" }} />
              </div>
              {/* Avatar */}
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "white", fontWeight: 800, boxShadow: "0 0 0 1.5px rgba(124,58,237,0.5)" }}>S</div>
            </div>
          </div>

          {/* KPI Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 8, flexShrink: 0 }}>
            {KPIS.map((k) => (
              <div key={k.id} style={{
                background: "rgba(255,255,255,0.032)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10, padding: "9px 10px",
                position: "relative", overflow: "hidden",
              }}>
                {/* Top accent line */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: k.color, opacity: 0.55, borderRadius: "10px 10px 0 0" }} />
                {/* Corner glow */}
                <div aria-hidden style={{ position: "absolute", bottom: -6, right: -6, width: 36, height: 36, borderRadius: "50%", background: k.color, opacity: 0.06, filter: "blur(10px)" }} />

                {/* Label + icon */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 6.5, fontWeight: 700, color: "rgba(255,255,255,0.32)", letterSpacing: "0.05em", textTransform: "uppercase" }}>{k.label}</span>
                  <div style={{ width: 17, height: 17, borderRadius: 5, background: `${k.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="8.5" height="8.5" viewBox="0 0 24 24" fill="none" stroke={k.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={k.icon} />
                    </svg>
                  </div>
                </div>

                {/* Value */}
                <p style={{ fontSize: 19, fontWeight: 900, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.06em", lineHeight: 1 }}>
                  {k.display}<span style={{ fontSize: 11, fontWeight: 600 }}>{k.suffix}</span>
                </p>

                {/* Change + sparkline */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <span style={{ fontSize: 7.5, color: k.up ? "#4ADE80" : "#FBBF24", fontWeight: 700 }}>
                      {k.up ? "▲" : "▼"}
                    </span>
                    <span style={{ fontSize: 7.5, color: k.up ? "#4ADE80" : "#FBBF24", fontWeight: 700 }}>{k.change}</span>
                    <span style={{ fontSize: 6.5, color: "rgba(255,255,255,0.2)" }}>vs mês</span>
                  </div>
                  <Sparkline data={k.spark} color={k.color} id={k.id} />
                </div>
              </div>
            ))}
          </div>

          {/* Content row: Chart + WhatsApp */}
          <div style={{ display: "grid", gridTemplateColumns: "54% 44%", gap: 8, flex: 1, minHeight: 0 }}>

            {/* Chart panel */}
            <div style={{
              background: "rgba(255,255,255,0.022)",
              border: "1px solid rgba(255,255,255,0.052)",
              borderRadius: 10, padding: "10px 11px",
              display: "flex", flexDirection: "column",
            }}>
              <LiveChart />
            </div>

            {/* WhatsApp Business panel */}
            <div style={{ borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column", background: "#E5DDD5" }}>
              {/* WA header */}
              <div style={{ background: "#1F2C34", padding: "6px 8px", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: "linear-gradient(135deg,#7C3AED,#8B5CF6)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9,
                    boxShadow: "0 0 0 1.5px rgba(124,58,237,0.5)",
                  }}>🤖</div>
                  <div style={{ position: "absolute", bottom: 0, right: 0, width: 6, height: 6, borderRadius: "50%", background: "#22C55E", border: "1px solid #1F2C34" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <p style={{ fontSize: 8.5, fontWeight: 700, color: "#fff", margin: 0 }}>Sety Vision IA</p>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="#25D366">
                      <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: 6.5, color: "rgba(255,255,255,0.55)", margin: 0 }}>
                    {typing ? "digitando…" : "online agora"}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                    "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"].map((d, i) => (
                    <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round">
                      <path d={d}/>
                    </svg>
                  ))}
                </div>
              </div>

              {/* Chat area */}
              <div ref={chatRef} style={{
                flex: 1, overflowY: "auto", padding: "6px 6px 4px",
                display: "flex", flexDirection: "column", gap: 3,
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}>
                {visible.length === 0 && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.4 }}>
                    <p style={{ fontSize: 7, color: "#555", textAlign: "center", margin: 0 }}>Aguardando cliente…</p>
                  </div>
                )}
                <AnimatePresence>
                  {visible.map((msg, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, y: 5, scale: 0.93 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", paddingLeft: msg.role === "user" ? 16 : 0, paddingRight: msg.role === "ai" ? 16 : 0 }}>
                      <div style={{
                        maxWidth: "90%",
                        background: msg.role === "user" ? "#D9FDD3" : "#FFFFFF",
                        borderRadius: msg.role === "user" ? "8px 8px 2px 8px" : "8px 8px 8px 2px",
                        padding: "4px 8px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.10)",
                      }}>
                        {msg.role === "ai" && (
                          <p style={{ fontSize: 6, color: "#7C3AED", margin: "0 0 1px", fontWeight: 700 }}>Sety IA</p>
                        )}
                        <p style={{ fontSize: 7.5, color: "#111", margin: 0, lineHeight: 1.4 }}>{msg.text}</p>
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2, marginTop: 1 }}>
                          <span style={{ fontSize: 5.5, color: "#999" }}>
                            {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {msg.role === "user" && <span style={{ fontSize: 7, color: "#53BDEB" }}>✓✓</span>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <AnimatePresence>
                  {typing && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div style={{ background: "#fff", borderRadius: "8px 8px 8px 2px", padding: "5px 9px", display: "inline-flex", gap: 2.5, alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.10)" }}>
                        {[0, 0.15, 0.3].map((d, i) => (
                          <motion.div key={i}
                            style={{ width: 4, height: 4, borderRadius: "50%", background: "#8B9196" }}
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 0.6, delay: d, repeat: Infinity }} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input bar */}
              <div style={{ padding: "4px 6px", background: "#1F2C34", display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
                <div style={{ flex: 1, background: "#2A3942", borderRadius: 20, padding: "4px 10px", fontSize: 7, color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center" }}>
                  Escreva uma mensagem
                </div>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#00A884", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="white">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Activity feed */}
          <div style={{ display: "flex", gap: 6, padding: "8px 0 8px", borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: 8, flexShrink: 0 }}>
            <AnimatePresence mode="wait">
              {[act1, act2].map((ev, i) => (
                <motion.div key={`${actIdx}-${i}`}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", gap: 5,
                    background: "rgba(255,255,255,0.022)",
                    border: "1px solid rgba(255,255,255,0.042)",
                    borderRadius: 7, padding: "5px 8px",
                  }}>
                  <span style={{ fontSize: 10, flexShrink: 0 }}>{ev.icon}</span>
                  <span style={{ fontSize: 7.5, color: "rgba(255,255,255,0.5)", flex: 1, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{ev.text}</span>
                  <span style={{ fontSize: 6.5, color: ev.bc, fontWeight: 700, flexShrink: 0, background: `${ev.bc}16`, padding: "1.5px 6px", borderRadius: 4, border: `1px solid ${ev.bc}30` }}>{ev.badge}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`@keyframes mpulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </motion.div>
  );
}

/* ── PillBadge ───────────────────────────────────────────── */
function PillBadge() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }} style={{ marginBottom: 28 }}>
      <a href="#produto" style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "5px 14px 5px 6px", borderRadius: radius.full,
        background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.20)",
        textDecoration: "none",
      }}>
        <span style={{ background: colors.purple, color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: "0.07em", padding: "2px 8px", borderRadius: radius.full }}>NOVO</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: colors.purple }}>IA com qualificação automática via WhatsApp</span>
        <ChevronRight size={11} color={colors.purple} />
      </a>
    </motion.div>
  );
}

/* ── StatCounter ─────────────────────────────────────────── */
function StatCounter({ to, suf }: { to: number; suf: string }) {
  const { ref, v } = useCountUp(to);
  return <span ref={ref}>{to >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}{suf}</span>;
}

/* ── Hero ────────────────────────────────────────────────── */
export function Hero() {
  return (
    <section style={{ position: "relative", overflow: "visible", minHeight: "100vh", display: "flex", alignItems: "center", padding: "120px 32px 80px", background: "#FFFFFF" }}>
      {/* Mesh glows */}
      <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-25%", left: "-18%", width: "85%", height: "110%", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.28) 0%, rgba(124,58,237,0.08) 45%, transparent 70%)", filter: "blur(80px)", animation: "pulse-glow 6s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-25%", right: "-15%", width: "75%", height: "95%", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.22) 0%, rgba(59,130,246,0.06) 50%, transparent 70%)", filter: "blur(80px)", animation: "pulse-glow 8s ease-in-out infinite 2s" }} />
        <div style={{ position: "absolute", top: "10%", right: "15%", width: "55%", height: "70%", borderRadius: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 65%)", filter: "blur(90px)", animation: "pulse-glow 7s ease-in-out infinite 1s" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,0,0,0.032) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.032) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.45fr", gap: 48, alignItems: "center" }}>

          {/* Left */}
          <div>
            <PillBadge />
            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2, ease: M.ease }}
              style={{ fontSize: "clamp(40px, 5.5vw, 70px)", fontWeight: 900, letterSpacing: "-0.045em", lineHeight: 1.02, color: colors.text, margin: "0 0 24px" }}>
              A IA que automatiza<br />
              <span style={{ background: `linear-gradient(135deg, ${colors.purple} 0%, #A855F7 45%, #C084FC 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>WhatsApp,</span><br />
              CRM e vendas.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              style={{ fontSize: 17, lineHeight: 1.7, color: colors.textSecondary, maxWidth: 420, margin: "0 0 36px" }}>
              Converta visitantes em clientes com IA que responde, qualifica e agenda — automático, 24h por dia, sem código.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.48 }}
              style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 52 }}>
              <motion.a href="/painel"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, background: colors.text, color: "#fff", padding: "14px 28px", borderRadius: radius.full, fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(10,10,10,0.28)", position: "relative", overflow: "hidden" }}
                whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(10,10,10,0.38), 0 0 0 3px rgba(124,58,237,0.18)" } as never}
                whileTap={{ scale: 0.97 }}>
                Começar grátis
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} style={{ display: "flex" }}>
                  <ArrowRight size={14} />
                </motion.span>
              </motion.a>
              <motion.a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "transparent", color: colors.text, padding: "14px 24px", borderRadius: radius.full, fontSize: 14, fontWeight: 600, textDecoration: "none", border: "1.5px solid rgba(0,0,0,0.12)" }}
                whileHover={{ scale: 1.03, borderColor: colors.purple, color: colors.purple } as never}
                whileTap={{ scale: 0.97 }}>
                <Zap size={13} fill="currentColor" /> Ver demo
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
              style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
              {([
                { v: 300,   suf: "+", label: "Empresas"   },
                { v: 50000, suf: "+", label: "Mensagens"  },
                { v: 48,    suf: "",  label: "Integrações" },
              ] as const).map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 900, letterSpacing: "-1.5px", color: colors.text, lineHeight: 1 }}>
                    <StatCounter to={s.v} suf={s.suf} />
                  </div>
                  <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 4, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: mockup */}
          <div style={{ position: "relative" }}>
            {FLOAT_ICONS.map(icon => <FloatingIcon key={icon.slug} {...icon} />)}
            <div aria-hidden style={{ position: "absolute", top: "-12%", left: "-10%", right: "-10%", bottom: "-12%", background: "radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.32) 0%, rgba(59,130,246,0.14) 45%, transparent 70%)", filter: "blur(72px)", zIndex: 0 }} />
            <div aria-hidden style={{ position: "absolute", bottom: "-5%", right: "-5%", width: "60%", height: "50%", background: "radial-gradient(circle, rgba(236,72,153,0.16) 0%, transparent 70%)", filter: "blur(52px)", zIndex: 0 }} />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "relative", zIndex: 1 }}>
              <DashboardMockup />
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 920px) { .hero-grid { grid-template-columns: 1fr !important; } .hero-grid > div:last-child { display: none; } }
        @media (max-width: 640px) { section[style] { padding-left: 20px !important; padding-right: 20px !important; } }
      `}</style>
    </section>
  );
}
