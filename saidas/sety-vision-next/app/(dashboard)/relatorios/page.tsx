"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { EASE } from "@/lib/motion";
import {
  TrendingUp, DollarSign, Users, Zap,
  Download, FileText, ChevronDown,
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

/* ── Data ────────────────────────────────────────────────── */
const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

const DATA_SETS = {
  revenue: [18400, 22100, 19800, 28700, 31200, 38900],
  leads:   [312,   387,   341,   498,   542,   687],
  convos:  [1840,  2100,  1920,  2760,  3050,  3840],
};

const PREV_SETS = {
  revenue: [14200, 17400, 18100, 21200, 23000, 29000],
  leads:   [245,   298,   275,   362,   410,   542],
};

const FUNNEL = [
  { stage: "Visitantes",     value: 18400, pct: 100,  color: "#6B7280" },
  { stage: "Leads captados", value: 687,   pct: 3.7,  color: "#7C3AED" },
  { stage: "Qualificados",   value: 423,   pct: 61.6, color: "#3B82F6" },
  { stage: "Propostas",      value: 187,   pct: 44.2, color: "#F59E0B" },
  { stage: "Fechados",       value: 64,    pct: 34.2, color: "#22C55E" },
];

const CHANNELS = [
  { name: "Meta Ads",     leads: 298, pct: 43, cost: "R$8,40",  color: "#3B82F6" },
  { name: "WhatsApp IA",  leads: 187, pct: 27, cost: "R$2,10",  color: "#22C55E" },
  { name: "Orgânico SEO", leads: 112, pct: 16, cost: "R$0,80",  color: "#7C3AED" },
  { name: "Google Ads",   leads: 56,  pct: 8,  cost: "R$12,60", color: "#F59E0B" },
  { name: "Indicação",    leads: 34,  pct: 5,  cost: "R$0,00",  color: "#A78BFA" },
];

/* ── KPI Card ────────────────────────────────────────────── */
type KPIConfig = {
  label: string; Icon: React.ElementType;
  to: number; fmt: (v: number) => string;
  change: string; up: boolean; color: string; sub: string;
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
      whileHover={{ y: -2 } as never}
      style={{ background: "#0C0C12", border: "1px solid rgba(255,255,255,0.058)", borderRadius: 14, padding: "18px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1.5, background: k.color, opacity: 0.45, borderRadius: "14px 14px 0 0" }} />
      <div aria-hidden style={{ position: "absolute", bottom: -12, right: -12, width: 56, height: 56, borderRadius: "50%", background: k.color, opacity: 0.055, filter: "blur(18px)" }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#52525B", letterSpacing: "0.04em", textTransform: "uppercase" }}>{k.label}</span>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: `${k.color}14`, border: `1px solid ${k.color}28`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <k.Icon size={13} color={k.color} />
        </div>
      </div>

      <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1, color: "white", marginBottom: 10, fontVariantNumeric: "tabular-nums" }}>
        {k.fmt(count)}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: k.up ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: k.up ? "#22C55E" : "#EF4444" }}>
          {k.up ? "▲" : "▼"} {k.change}
        </span>
        <span style={{ fontSize: 10, color: "#3F3F46" }}>{k.sub}</span>
      </div>
    </motion.div>
  );
}

/* ── Dual area chart ─────────────────────────────────────── */
type ChartDataset = "revenue" | "leads";

function MainChart() {
  const [active, setActive] = useState<ChartDataset>("revenue");
  const W = 600; const H = 200;

  const currData = DATA_SETS[active];
  const prevData = active === "revenue" ? PREV_SETS.revenue : PREV_SETS.leads;

  const buildPath = (d: number[]) => {
    const mn = Math.min(...d) * 0.85; const mx = Math.max(...d) * 1.06;
    const sx = (i: number) => (i / (d.length - 1)) * W;
    const sy = (v: number) => H - ((v - mn) / (mx - mn)) * H;
    const pts: [number, number][] = d.map((v, i) => [sx(i), sy(v)]);
    return { line: mono(pts), area: `${mono(pts)} L${W},${H} L0,${H}Z`, pts };
  };

  const curr = buildPath(currData);
  const prev = buildPath(prevData);

  const fmtY = (v: number) => active === "revenue" ? `R$${(v / 1000).toFixed(0)}k` : `${v}`;
  const yLabels = [
    fmtY(Math.max(...currData) * 0.98),
    fmtY((Math.max(...currData) + Math.min(...currData)) / 2),
    fmtY(Math.min(...currData) * 0.96),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, ease: EASE }}
      style={{ background: "#0C0C12", border: "1px solid rgba(255,255,255,0.058)", borderRadius: 14, padding: "22px" }}>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 6 }}>Evolução do Período</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 18, height: 2, borderRadius: 2, background: "#22C55E" }} />
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>Período atual</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 18, height: 2, borderRadius: 2, background: "rgba(124,58,237,0.5)", backgroundImage: "repeating-linear-gradient(90deg,rgba(124,58,237,0.5) 0,rgba(124,58,237,0.5) 4px,transparent 4px,transparent 8px)" }} />
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>Período anterior</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 14px" }}>
            <div style={{ fontSize: 10, color: "#52525B", marginBottom: 2 }}>{active === "revenue" ? "Receita (jun)" : "Leads (jun)"}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "white", display: "flex", alignItems: "center", gap: 6, letterSpacing: "-0.5px" }}>
              {active === "revenue" ? "R$ 38,9k" : "687"}
              <span style={{ fontSize: 11, fontWeight: 700, color: "#22C55E" }}>▲ {active === "revenue" ? "+34%" : "+27%"}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 1, background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 2 }}>
            {(["revenue", "leads"] as ChartDataset[]).map(ds => (
              <button key={ds} onClick={() => setActive(ds)} style={{
                fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                background: active === ds ? "rgba(124,58,237,0.2)" : "transparent",
                color: active === ds ? "#A78BFA" : "rgba(255,255,255,0.3)", transition: "all 0.15s",
              }}>
                {ds === "revenue" ? "Receita" : "Leads"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingBottom: 20, flexShrink: 0, alignItems: "flex-end" }}>
          {yLabels.map(l => (
            <span key={l} style={{ fontSize: 9.5, color: "rgba(255,255,255,0.2)", fontVariantNumeric: "tabular-nums" }}>{l}</span>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: 200, overflow: "visible" }}>
            <defs>
              <linearGradient id="rGradCurr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#22C55E" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#22C55E" stopOpacity="0.01" />
              </linearGradient>
              <linearGradient id="rGradPrev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#7C3AED" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.00" />
              </linearGradient>
              <filter id="rGlow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <clipPath id="rClip">
                <motion.rect x={0} y={-4} height={H + 8}
                  initial={{ width: 0 }} animate={{ width: W }}
                  transition={{ duration: 1.6, ease: "easeOut", delay: 0.2 }} />
              </clipPath>
            </defs>
            {[0.1, 0.38, 0.65, 0.92].map((f, i) => (
              <line key={i} x1={0} y1={H * f} x2={W} y2={H * f}
                stroke="rgba(255,255,255,0.05)" strokeWidth="0.6" strokeDasharray="3,4" />
            ))}
            <g clipPath="url(#rClip)">
              <path d={prev.area} fill="url(#rGradPrev)" />
              <path d={prev.line} fill="none" stroke="rgba(124,58,237,0.40)" strokeWidth="1.2" strokeDasharray="4,4" strokeLinecap="round" />
              <path d={curr.area} fill="url(#rGradCurr)" />
              <path d={curr.line} fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#rGlow)" />
              {curr.pts.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y}
                  r={i === curr.pts.length - 1 ? 3 : 2}
                  fill="#22C55E" fillOpacity={i === curr.pts.length - 1 ? 1 : 0.4} />
              ))}
            </g>
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {MONTHS.map(m => (
              <span key={m} style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontWeight: 500 }}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Conversion Funnel ───────────────────────────────────── */
function ConversionFunnel() {
  const maxVal = FUNNEL[0].value;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, ease: EASE }}
      style={{ background: "#0C0C12", border: "1px solid rgba(255,255,255,0.058)", borderRadius: 14, padding: "22px", display: "flex", flexDirection: "column" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 3 }}>Funil de Conversão</div>
      <div style={{ fontSize: 11, color: "#52525B", marginBottom: 22 }}>Último período · Junho 2025</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {FUNNEL.map((f, i) => (
          <div key={f.stage}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: f.color }} />
                <span style={{ fontSize: 12, fontWeight: 500, color: "#9CA3AF" }}>{f.stage}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {i > 0 && (
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: f.color }}>
                    {f.pct.toFixed(1)}%
                  </span>
                )}
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "white", fontVariantNumeric: "tabular-nums", minWidth: 52, textAlign: "right" }}>
                  {f.value >= 1000 ? `${(f.value / 1000).toFixed(1)}k` : f.value}
                </span>
              </div>
            </div>
            <div style={{ height: 8, borderRadius: 8, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(f.value / maxVal) * 100}%` }}
                transition={{ duration: 1.0, ease: "easeOut", delay: 0.42 + i * 0.08 }}
                style={{ height: "100%", borderRadius: 8, background: f.color, opacity: 0.8 }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 22, padding: "12px 16px", background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.1)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11.5, color: "#9CA3AF" }}>Taxa de fechamento global</span>
        <span style={{ fontSize: 18, fontWeight: 900, color: "#22C55E", letterSpacing: "-0.5px" }}>0,35%</span>
      </div>
    </motion.div>
  );
}

/* ── Channels table ──────────────────────────────────────── */
function ChannelsTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.48, ease: EASE }}
      style={{ background: "#0C0C12", border: "1px solid rgba(255,255,255,0.058)", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "22px 22px 14px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 3 }}>Canais de Aquisição</div>
        <div style={{ fontSize: 11, color: "#52525B" }}>Custo por lead · Junho 2025</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 56px 56px 70px", gap: 0, padding: "8px 22px", background: "rgba(255,255,255,0.022)", borderTop: "1px solid rgba(255,255,255,0.038)", borderBottom: "1px solid rgba(255,255,255,0.038)" }}>
        {["Canal", "Leads", "Share", "CPL"].map(h => (
          <span key={h} style={{ fontSize: 10, fontWeight: 700, color: "#52525B", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</span>
        ))}
      </div>

      {CHANNELS.map((ch, i) => (
        <motion.div key={ch.name}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.52 + i * 0.06, ease: EASE }}
          style={{ display: "grid", gridTemplateColumns: "1fr 56px 56px 70px", gap: 0, padding: "12px 22px", borderBottom: i < CHANNELS.length - 1 ? "1px solid rgba(255,255,255,0.032)" : "none", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: ch.color }} />
              <span style={{ fontSize: 12.5, fontWeight: 500, color: "white" }}>{ch.name}</span>
            </div>
            <div style={{ height: 3, borderRadius: 3, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${ch.pct}%` }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 0.55 + i * 0.06 }}
                style={{ height: "100%", borderRadius: 3, background: ch.color, opacity: 0.75 }}
              />
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "white", fontVariantNumeric: "tabular-nums" }}>{ch.leads}</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: `${ch.color}14`, color: ch.color, display: "inline-block" }}>
            {ch.pct}%
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: ch.cost === "R$0,00" ? "#22C55E" : "#9CA3AF", fontVariantNumeric: "tabular-nums" }}>
            {ch.cost}
          </span>
        </motion.div>
      ))}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 56px 56px 70px", padding: "12px 22px", borderTop: "1px solid rgba(255,255,255,0.058)", background: "rgba(255,255,255,0.018)", alignItems: "center" }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: "#52525B", textTransform: "uppercase", letterSpacing: "0.04em" }}>Total</span>
        <span style={{ fontSize: 13, fontWeight: 900, color: "white" }}>687</span>
        <span style={{ fontSize: 11, color: "#52525B" }}>100%</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF" }}>R$4,96</span>
      </div>
    </motion.div>
  );
}

/* ── KPI config ──────────────────────────────────────────── */
const KPIS: KPIConfig[] = [
  { label: "Receita total",  Icon: DollarSign,  to: 38900, fmt: v => `R$${(v / 1000).toFixed(0)}k`, change: "+34%", up: true, color: "#22C55E", sub: "vs mai" },
  { label: "Leads gerados",  Icon: Users,       to: 687,   fmt: v => `${v}`,                          change: "+27%", up: true, color: "#7C3AED", sub: "vs mai" },
  { label: "Conversas IA",   Icon: TrendingUp,  to: 3840,  fmt: v => `${(v / 1000).toFixed(1)}k`,    change: "+26%", up: true, color: "#3B82F6", sub: "vs mai" },
  { label: "Taxa automação", Icon: Zap,         to: 96,    fmt: v => `${v}%`,                         change: "+2%",  up: true, color: "#F59E0B", sub: "cobertura" },
];

const PERIODS = ["Esta semana", "Últimos 30 dias", "Último trimestre", "Este ano"];

/* ── Page ────────────────────────────────────────────────── */
export default function RelatoriosPage() {
  const [period, setPeriod] = useState(1);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <Topbar title="Relatórios" subtitle="Análise completa de performance" />

      <main style={{ flex: 1, overflowY: "auto", padding: "20px 24px 32px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* Controls row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowMenu(!showMenu)} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
              background: "#0C0C12", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600, color: "white",
            }}>
              {PERIODS[period]}
              <ChevronDown size={13} color="#52525B" />
            </button>
            {showMenu && (
              <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, background: "#111114", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden", zIndex: 40, minWidth: 190, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
                {PERIODS.map((p, i) => (
                  <button key={p} onClick={() => { setPeriod(i); setShowMenu(false); }} style={{
                    display: "block", width: "100%", textAlign: "left", padding: "9px 14px",
                    fontSize: 13, fontWeight: i === period ? 700 : 400,
                    color: i === period ? "white" : "#9CA3AF",
                    background: "transparent", border: "none", cursor: "pointer",
                    borderBottom: i < PERIODS.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)")}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            {[
              { icon: Download, label: "Exportar CSV" },
              { icon: FileText, label: "Gerar PDF" },
            ].map(({ icon: Icon, label }) => (
              <button key={label} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#9CA3AF",
                transition: "all 0.15s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "white"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.14)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#9CA3AF"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}>
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {KPIS.map((k, i) => <KPICard key={k.label} k={k} delay={i * 0.07} />)}
        </div>

        {/* Area chart */}
        <MainChart />

        {/* Funnel + Channels */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 12 }}>
          <ConversionFunnel />
          <ChannelsTable />
        </div>

        {/* Monthly history table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, ease: EASE }}
          style={{ background: "#0C0C12", border: "1px solid rgba(255,255,255,0.058)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "20px 22px 16px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 3 }}>Histórico Mensal</div>
            <div style={{ fontSize: 11, color: "#52525B" }}>Receita e leads dos últimos 6 meses</div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.022)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {["Mês", "Receita", "vs anterior", "Leads", "Conversas IA", "Taxa auto."].map(h => (
                    <th key={h} style={{ padding: "9px 22px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#52525B", letterSpacing: "0.05em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MONTHS.map((m, i) => {
                  const rev = DATA_SETS.revenue[i];
                  const lds = DATA_SETS.leads[i];
                  const cvs = DATA_SETS.convos[i];
                  const prevRev = i > 0 ? DATA_SETS.revenue[i - 1] : null;
                  const diff = prevRev !== null ? ((rev - prevRev) / prevRev * 100).toFixed(1) : null;
                  const isUp = diff !== null && parseFloat(diff) > 0;
                  const isLast = i === MONTHS.length - 1;
                  return (
                    <tr key={m} style={{ borderBottom: i < MONTHS.length - 1 ? "1px solid rgba(255,255,255,0.032)" : "none", background: isLast ? "rgba(34,197,94,0.025)" : "transparent" }}>
                      <td style={{ padding: "12px 22px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: isLast ? 700 : 500, color: isLast ? "white" : "#9CA3AF" }}>
                          {isLast && <span style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: "#22C55E", animation: "dot-pulse 2s infinite" }} />}
                          {m}
                        </span>
                      </td>
                      <td style={{ padding: "12px 22px", fontSize: 13, fontWeight: 800, color: "white", fontVariantNumeric: "tabular-nums" }}>
                        R$ {(rev / 1000).toFixed(1)}k
                      </td>
                      <td style={{ padding: "12px 22px" }}>
                        {diff !== null ? (
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: isUp ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: isUp ? "#22C55E" : "#EF4444" }}>
                            {isUp ? "▲" : "▼"} {Math.abs(parseFloat(diff))}%
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, color: "#3F3F46" }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "12px 22px", fontSize: 12.5, fontWeight: 600, color: "#9CA3AF", fontVariantNumeric: "tabular-nums" }}>{lds}</td>
                      <td style={{ padding: "12px 22px", fontSize: 12.5, fontWeight: 600, color: "#9CA3AF", fontVariantNumeric: "tabular-nums" }}>{cvs.toLocaleString("pt-BR")}</td>
                      <td style={{ padding: "12px 22px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 64, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 4, background: "#F59E0B", width: `${88 + i * 1.5}%` }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#F59E0B", fontVariantNumeric: "tabular-nums" }}>{(88 + i * 1.5).toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

      </main>
      <style>{`@keyframes dot-pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </>
  );
}
