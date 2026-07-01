"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/lib/motion";
import {
  DollarSign, TrendingUp, MessageSquare, Zap, ArrowUpRight, ChevronRight,
} from "lucide-react";

/* ── Monotone cubic bezier ───────────────────────────────── */
function mono(pts: [number, number][]): string {
  const n = pts.length;
  if (n < 2) return `M${pts[0]?.[0] ?? 0},${pts[0]?.[1] ?? 0}`;
  const dx = pts.slice(1).map((p, i) => p[0] - pts[i][0]);
  const dy = pts.slice(1).map((p, i) => p[1] - pts[i][1]);
  const s  = dx.map((d, i) => d === 0 ? 0 : dy[i] / d);
  const t: number[] = new Array(n);
  t[0] = s[0]; t[n - 1] = s[n - 2];
  for (let i = 1; i < n - 1; i++)
    t[i] = s[i - 1] * s[i] <= 0 ? 0 : (s[i - 1] + s[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (Math.abs(s[i]) < 1e-8) { t[i] = t[i + 1] = 0; continue; }
    const a = t[i] / s[i], b = t[i + 1] / s[i], r = Math.sqrt(a * a + b * b);
    if (r > 3) { t[i] *= 3 / r; t[i + 1] *= 3 / r; }
  }
  let d = `M${pts[0][0].toFixed(2)},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += ` C${(pts[i][0] + h).toFixed(2)},${(pts[i][1] + t[i] * h).toFixed(2)} ${(pts[i + 1][0] - h).toFixed(2)},${(pts[i + 1][1] - t[i + 1] * h).toFixed(2)} ${pts[i + 1][0].toFixed(2)},${pts[i + 1][1].toFixed(2)}`;
  }
  return d;
}

/* ── Sparkline ───────────────────────────────────────────── */
function Spark({ data, color, id }: { data: number[]; color: string; id: string }) {
  const mn = Math.min(...data); const mx = Math.max(...data); const rng = mx - mn || 1;
  const W = 56; const H = 26;
  const pts: [number, number][] = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - 3 - ((v - mn) / rng) * (H - 6),
  ]);
  const line = mono(pts);
  return (
    <svg width={W} height={H} style={{ overflow: "visible", flexShrink: 0 }}>
      <defs>
        <linearGradient id={`sp-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${line} L${W},${H} L0,${H}Z`} fill={`url(#sp-${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="2.2" fill={color} />
    </svg>
  );
}

/* ── KPI Card ────────────────────────────────────────────── */
type KPIConfig = {
  label: string;
  Icon: React.ElementType;
  to: number;
  fmt: (v: number) => string;
  change: string;
  up: boolean;
  color: string;
  spark: number[];
  sub: string;
};

function KPICard({ k, delay }: { k: KPIConfig; delay: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = Date.now(); const dur = 1300;
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * k.to));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [k.to]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: EASE, duration: 0.4 }}
      whileHover={{ y: -2, boxShadow: `0 24px 56px rgba(0,0,0,0.45), 0 0 0 1px ${k.color}28` } as never}
      style={{
        background: "#0C0C12", border: "1px solid rgba(255,255,255,0.058)",
        borderRadius: 14, padding: "18px", position: "relative", overflow: "hidden",
      }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: k.color, opacity: 0.45, borderRadius: "14px 14px 0 0" }} />
      <div aria-hidden style={{ position: "absolute", bottom: -12, right: -12, width: 56, height: 56, borderRadius: "50%", background: k.color, opacity: 0.055, filter: "blur(18px)" }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#52525B", letterSpacing: "0.04em", textTransform: "uppercase" }}>{k.label}</span>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: `${k.color}14`, border: `1px solid ${k.color}28`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <k.Icon size={13} color={k.color} />
        </div>
      </div>

      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1, color: "white", marginBottom: 10, fontVariantNumeric: "tabular-nums" }}>
        {k.fmt(count)}
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 3,
            fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
            background: k.up ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
            color: k.up ? "#22C55E" : "#EF4444",
          }}>{k.up ? "▲" : "▼"} {k.change}</span>
          <span style={{ fontSize: 10, color: "#3F3F46" }}>{k.sub}</span>
        </div>
        <Spark data={k.spark} color={k.color} id={k.label} />
      </div>
    </motion.div>
  );
}

/* ── Revenue area chart ──────────────────────────────────── */
const REV   = [18400, 22100, 19800, 28700, 31200, 38900];
const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
const PERIODS_REV = ["7D", "30D", "3M"];

function RevChart() {
  const [period, setPeriod] = useState(2);
  const W = 400; const H = 140;
  const min = Math.min(...REV) * 0.88; const max = Math.max(...REV) * 1.06;
  const sx = (i: number) => (i / (REV.length - 1)) * W;
  const sy = (v: number) => H - ((v - min) / (max - min)) * H;
  const pts: [number, number][] = REV.map((v, i) => [sx(i), sy(v)]);
  const line = mono(pts);
  const area = `${line} L${W},${H} L0,${H}Z`;
  const lp = pts[pts.length - 1];

  return (
    <div style={{ background: "#0C0C12", border: "1px solid rgba(255,255,255,0.058)", borderRadius: 14, padding: "20px", display: "flex", flexDirection: "column", height: "100%", minHeight: 300 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18, flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 3 }}>Receita Mensal</div>
          <div style={{ fontSize: 11, color: "#52525B" }}>Evolução dos últimos 6 meses</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-1px", color: "white", lineHeight: 1 }}>R$ 38,9k</div>
            <div style={{ fontSize: 11, color: "#22C55E", fontWeight: 600, marginTop: 2 }}>▲ +34% vs mai</div>
          </div>
          <div style={{ display: "flex", gap: 1, background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 2, flexShrink: 0 }}>
            {PERIODS_REV.map((p, i) => (
              <button key={p} onClick={() => setPeriod(i)} style={{
                fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                border: "none", cursor: "pointer", transition: "all 0.15s",
                background: period === i ? "rgba(34,197,94,0.2)" : "transparent",
                color: period === i ? "#4ADE80" : "rgba(255,255,255,0.28)",
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", gap: 8, minHeight: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingBottom: 16, flexShrink: 0, alignItems: "flex-end" }}>
          {["39k", "29k", "18k"].map(l => (
            <span key={l} style={{ fontSize: 9.5, color: "rgba(255,255,255,0.2)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>R${l}</span>
          ))}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ flex: 1, width: "100%", overflow: "visible" }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#22C55E" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity="0.01" />
              </linearGradient>
              <filter id="revGlow">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <clipPath id="revClip">
                <motion.rect x={0} y={-4} height={H + 8}
                  initial={{ width: 0 }} animate={{ width: W }}
                  transition={{ duration: 1.6, ease: "easeOut", delay: 0.3 }} />
              </clipPath>
            </defs>
            {[0.12, 0.40, 0.68, 0.94].map((f, i) => (
              <line key={i} x1={0} y1={H * f} x2={W} y2={H * f}
                stroke="rgba(255,255,255,0.052)" strokeWidth="0.6" strokeDasharray="3,4" />
            ))}
            <g clipPath="url(#revClip)">
              <path d={area} fill="url(#revGrad)" />
              <path d={line} fill="none" stroke="#22C55E" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" filter="url(#revGlow)" />
              {pts.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 2.8 : 1.8}
                  fill="#22C55E" fillOpacity={i === pts.length - 1 ? 1 : 0.4} />
              ))}
              <motion.circle cx={lp[0]} cy={lp[1]}
                animate={{ r: [3.5, 6, 3.5] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                fill="none" stroke="#22C55E" strokeWidth="0.8" strokeOpacity="0.25" />
            </g>
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", paddingRight: 2 }}>
            {MONTHS.map(m => (
              <span key={m} style={{ fontSize: 9.5, color: "rgba(255,255,255,0.2)", fontWeight: 500 }}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Live Activity Feed ──────────────────────────────────── */
type FeedItem = { id: number; emoji: string; text: string; tag: string; tc: string; delay: number };
const POOL: Omit<FeedItem, "id">[] = [
  { emoji: "💬", text: "IA respondeu João Silva — Clínica Norte",        tag: "WhatsApp",  tc: "#22C55E", delay: 0    },
  { emoji: "🔥", text: "Lead quente: Ana Paula Ribeiro (score 91)",      tag: "Lead",      tc: "#EF4444", delay: 1200 },
  { emoji: "📅", text: "Reunião agendada com Marcos Oliveira — 15h",     tag: "Agenda",    tc: "#3B82F6", delay: 900  },
  { emoji: "💳", text: "Proposta enviada: Studio Fitness — R$8.400",     tag: "Proposta",  tc: "#A78BFA", delay: 800  },
  { emoji: "✅", text: "Pagamento confirmado: Clínica Bella Vita",        tag: "Venda",     tc: "#22C55E", delay: 700  },
  { emoji: "🤖", text: "IA qualificou 12 leads automaticamente",          tag: "Automação", tc: "#7C3AED", delay: 1100 },
  { emoji: "📩", text: "Novo lead: Ricardo Pires via Meta Ads",           tag: "Novo",      tc: "#6B7280", delay: 600  },
  { emoji: "🎯", text: "Follow-up enviado: 7 clientes (D+3)",             tag: "Auto",      tc: "#3B82F6", delay: 800  },
  { emoji: "⭐", text: "Avaliação 5 estrelas recebida",                   tag: "Review",    tc: "#F59E0B", delay: 1000 },
  { emoji: "💬", text: "IA respondeu Carla Drummond em 0.8s",             tag: "WhatsApp",  tc: "#22C55E", delay: 700  },
];

function LiveFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const cnt = useRef(0); const idx = useRef(0);
  useEffect(() => {
    const next = () => {
      const base = POOL[idx.current % POOL.length];
      idx.current++;
      setItems(prev => [{ ...base, id: cnt.current++ }, ...prev].slice(0, 9));
      setTimeout(next, POOL[idx.current % POOL.length].delay + 500 + Math.random() * 400);
    };
    const t = setTimeout(next, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <AnimatePresence initial={false}>
        {items.map((item, i) => (
          <motion.div key={item.id}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: Math.max(0.15, 1 - i * 0.1), y: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            style={{
              display: "flex", alignItems: "center", gap: 9, padding: "9px 11px",
              borderRadius: 10, overflow: "hidden",
              background: "rgba(255,255,255,0.022)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${item.tc}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13 }}>
              {item.emoji}
            </div>
            <span style={{ flex: 1, fontSize: 12.5, color: "#9CA3AF", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{item.text}</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, flexShrink: 0, background: `${item.tc}14`, color: item.tc, border: `1px solid ${item.tc}28` }}>
              {item.tag}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ── Pipeline mini ───────────────────────────────────────── */
const STAGES = [
  { name: "Novo",        color: "#6B7280", count: 12, total: "R$43k", deals: [{ n: "Bruno Mendes",   v: "R$9,5k" }, { n: "Aline Ferreira",  v: "R$4,2k" }] },
  { name: "Qualificado", color: "#7C3AED", count: 8,  total: "R$74k", deals: [{ n: "Ana Paula R.",   v: "R$8,4k" }, { n: "Patrícia Fontes", v: "R$6,8k" }] },
  { name: "Proposta",    color: "#F59E0B", count: 5,  total: "R$78k", deals: [{ n: "Gustavo Lima",   v: "R$12,8k" }, { n: "Marcos Oliveira", v: "R$15,2k" }] },
  { name: "Fechado",     color: "#22C55E", count: 3,  total: "R$67k", deals: [{ n: "Ricardo Pires",  v: "R$22k" }] },
];

/* ── Goal widget ─────────────────────────────────────────── */
function GoalWidget() {
  const pct = 78;
  return (
    <div style={{ background: "#0C0C12", border: "1px solid rgba(255,255,255,0.058)", borderRadius: 14, padding: "20px", display: "flex", flexDirection: "column", gap: 14, width: 232, flexShrink: 0 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 2 }}>Meta Mensal</div>
        <div style={{ fontSize: 11, color: "#52525B" }}>Junho · 8 dias restantes</div>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
          <span style={{ fontSize: 11, color: "#9CA3AF" }}>Progresso</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: "#22C55E" }}>{pct}%</span>
        </div>
        <div style={{ height: 7, borderRadius: 7, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ duration: 1.3, ease: "easeOut", delay: 0.4 }}
            style={{ height: "100%", borderRadius: 7, background: "linear-gradient(90deg,#16A34A,#22C55E,#4ADE80)", boxShadow: "0 0 10px rgba(34,197,94,0.45)" }}
          />
        </div>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {[
          { label: "Realizado", val: "R$38,9k", color: "white" },
          { label: "Faltam",    val: "R$11,1k", color: "#F59E0B" },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.025)", borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontSize: 9, color: "#52525B", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: s.color, letterSpacing: "-0.5px" }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Target */}
      <div style={{ padding: "10px 12px", background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.12)", borderRadius: 10 }}>
        <div style={{ fontSize: 10, color: "#52525B", marginBottom: 2 }}>Meta total</div>
        <div style={{ fontSize: 15, fontWeight: 800, color: "white", letterSpacing: "-0.5px" }}>R$ 50.000</div>
      </div>
    </div>
  );
}

/* ── KPI config ──────────────────────────────────────────── */
const KPIS: KPIConfig[] = [
  { label: "Receita",       Icon: DollarSign,    to: 38900, fmt: v => `R$${(v / 1000).toFixed(0)}k`, change: "+34%", up: true,  color: "#22C55E", spark: [18.4,22.1,19.8,28.7,31.2,38.9], sub: "vs mês anterior" },
  { label: "Leads ativos",  Icon: TrendingUp,    to: 47,    fmt: v => `${v}`,                          change: "+18%", up: true,  color: "#7C3AED", spark: [28,32,26,38,42,35,47],           sub: "vs mês anterior" },
  { label: "Conversas IA",  Icon: MessageSquare, to: 284,   fmt: v => `${v}`,                          change: "+12%", up: true,  color: "#3B82F6", spark: [210,248,235,265,258,272,284],     sub: "vs mês anterior" },
  { label: "Automação",     Icon: Zap,           to: 96,    fmt: v => `${v}%`,                         change: "+2%",  up: true,  color: "#F59E0B", spark: [88,90,92,91,94,95,96],            sub: "taxa de cobertura" },
];

/* ── Page ────────────────────────────────────────────────── */
export default function PainelPage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <>
      <Topbar title="Dashboard" subtitle={`${greeting}, Seven`} />

      <main style={{ flex: 1, overflowY: "auto", padding: "20px 24px 32px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Row 1: KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {KPIS.map((k, i) => <KPICard key={k.label} k={k} delay={i * 0.07} />)}
        </div>

        {/* Row 2: Revenue chart + Live feed */}
        <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 12 }}>
          <RevChart />

          {/* Feed panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ease: EASE }}
            style={{ background: "#0C0C12", border: "1px solid rgba(255,255,255,0.058)", borderRadius: 14, padding: "20px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4, flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 3 }}>Atividade em tempo real</div>
                <div style={{ fontSize: 11, color: "#52525B" }}>O sistema trabalhando por você</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 20, padding: "3.5px 10px", flexShrink: 0 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E", animation: "dash-pulse 2s ease-in-out infinite" }} />
                <span style={{ fontSize: 10, color: "#4ADE80", fontWeight: 600 }}>Ao vivo</span>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", marginTop: 10 }}>
              <LiveFeed />
            </div>
          </motion.div>
        </div>

        {/* Row 3: Pipeline + Goal */}
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          {/* Pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, ease: EASE }}
            style={{ flex: 1, background: "#0C0C12", border: "1px solid rgba(255,255,255,0.058)", borderRadius: 14, padding: "20px", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 2 }}>Pipeline</div>
                <div style={{ fontSize: 11, color: "#52525B" }}>28 negócios em aberto · R$262k</div>
              </div>
              <a href="/pipeline" style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#52525B", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "white")}
                onMouseLeave={e => (e.currentTarget.style.color = "#52525B")}>
                Ver tudo <ArrowUpRight size={11} />
              </a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
              {STAGES.map(st => (
                <div key={st.name}>
                  {/* Column header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: st.color }} />
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: "#9CA3AF" }}>{st.name}</span>
                    </div>
                    <span style={{ fontSize: 9.5, color: "#3F3F46" }}>{st.count}</span>
                  </div>
                  {/* Total */}
                  <div style={{ fontSize: 13, fontWeight: 800, color: st.color, marginBottom: 8, letterSpacing: "-0.5px" }}>{st.total}</div>
                  {/* Deal cards */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {st.deals.map(d => (
                      <div key={d.n} style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.042)", borderRadius: 8, padding: "7px 10px" }}>
                        <div style={{ fontSize: 11, color: "white", fontWeight: 500, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: 1 }}>{d.n}</div>
                        <div style={{ fontSize: 10.5, fontWeight: 700, color: st.color }}>{d.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, ease: EASE }}>
            <GoalWidget />
          </motion.div>
        </div>

        {/* Row 4: Hot leads */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, ease: EASE }}
          style={{ background: "#0C0C12", border: "1px solid rgba(255,255,255,0.058)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.042)" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 2 }}>Leads que precisam de atenção</div>
              <div style={{ fontSize: 11, color: "#52525B" }}>Priorize estes agora</div>
            </div>
            <a href="/leads" style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#52525B", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = "#52525B")}>
              Ver todos <ArrowUpRight size={11} />
            </a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 0 }}>
            {[
              { name: "Ana Paula Ribeiro", company: "Clínica Bella Vita",  stage: "Proposta",   val: "R$8,4k",  score: 92, sc: "#A78BFA" },
              { name: "Ricardo Pires",     company: "Studio Fitness",       stage: "Fechamento", val: "R$22k",   score: 96, sc: "#22C55E" },
              { name: "Marcos Oliveira",   company: "Imob 360",             stage: "Qualificado",val: "R$15,2k", score: 78, sc: "#60A5FA" },
              { name: "Gustavo Lima",      company: "Lima & Associados",    stage: "Proposta",   val: "R$12,8k", score: 84, sc: "#A78BFA" },
            ].map((lead, i) => (
              <a key={lead.name} href="/crm"
                style={{ display: "flex", alignItems: "center", gap: 11, padding: "14px 20px", textDecoration: "none", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.038)" : "none", transition: "background 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.022)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1a1a2e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white", flexShrink: 0 }}>
                  {lead.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "white", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: 1 }}>{lead.name}</div>
                  <div style={{ fontSize: 10.5, color: "#52525B", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{lead.company}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: lead.sc, marginBottom: 1 }}>{lead.stage}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "white" }}>{lead.val}</div>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: lead.score >= 90 ? "#22C55E" : lead.score >= 70 ? "#F59E0B" : "#9CA3AF", flexShrink: 0 }}>
                  {lead.score}
                </div>
                <ChevronRight size={12} color="#3F3F46" style={{ flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </motion.div>

      </main>
      <style>{`@keyframes dash-pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </>
  );
}
