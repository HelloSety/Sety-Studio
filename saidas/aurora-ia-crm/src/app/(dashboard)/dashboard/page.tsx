"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users, TrendingUp, MessageSquare, Flame,
  CheckCircle2, Clock, ArrowUpRight, ArrowDownRight, Wifi
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import { mockChartData, mockLeads } from "@/lib/mock-data";
import { timeAgo, scoreToLabel } from "@/lib/utils";

// ── Sparkline (SVG lightweight) ─────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 72;
  const h = 28;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Custom tooltip ────────────────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#131318] border border-white/[0.06] rounded-xl px-3 py-2.5 shadow-elevated text-xs">
      <p className="text-[#52525B] mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">{p.name}: <span className="text-white">{p.value}</span></p>
      ))}
    </div>
  );
}

// ── Greeting ─────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

const kpis = [
  {
    label: "Total Leads",
    value: "247",
    delta: "+18.4%",
    up: true,
    icon: Users,
    color: "#7C3AED",
    dataKey: "leads",
  },
  {
    label: "Leads Hoje",
    value: "12",
    delta: "+33%",
    up: true,
    icon: TrendingUp,
    color: "#25D366",
    dataKey: "conversoes",
  },
  {
    label: "Conversas Ativas",
    value: "34",
    delta: "+5",
    up: true,
    icon: MessageSquare,
    color: "#8B5CF6",
    dataKey: "enviadas",
  },
  {
    label: "Leads Quentes",
    value: "18",
    delta: "+2",
    up: true,
    icon: Flame,
    color: "#EF4444",
    dataKey: "leads",
  },
  {
    label: "Vendas Fechadas",
    value: "23",
    delta: "+3",
    up: true,
    icon: CheckCircle2,
    color: "#22C55E",
    dataKey: "conversoes",
  },
  {
    label: "Tempo Médio",
    value: "1.4h",
    delta: "-18min",
    up: true,
    icon: Clock,
    color: "#F59E0B",
    dataKey: "recebidas",
  },
];

const FILTERS = ["7d", "30d", "90d"];

export default function DashboardPage() {
  const [filter, setFilter] = useState("30d");
  const chartData = useMemo(() => mockChartData.slice(-30), []);
  const sparkData = useMemo(() => chartData.map((d) => d.leads), [chartData]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#09090B]">
      {/* Premium hero header */}
      <div className="shrink-0 px-7 py-5 border-b border-white/[0.04]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[22px] font-semibold text-white leading-tight">
              {getGreeting()}, Seven 👋
            </p>
            <p className="text-[13px] text-[#52525B] mt-1">
              Aurora IA monitorando <span className="text-[#A1A1AA]">247 leads</span> em tempo real
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* WA status */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#131318] border border-white/[0.04]">
              <span className="dot-online" />
              <Wifi className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="text-[12px] text-white font-medium">WhatsApp Online</span>
            </div>

            {/* Sync */}
            <div className="px-3 py-2 rounded-xl bg-[#131318] border border-white/[0.04]">
              <p className="text-[10px] text-[#52525B]">Última sync</p>
              <p className="text-[12px] text-white font-medium">há 2 min</p>
            </div>

            {/* Period filter */}
            <div className="flex items-center bg-[#131318] border border-white/[0.04] rounded-xl p-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-lg text-[12px] font-medium transition-all ${
                    filter === f ? "bg-[#7C3AED] text-white" : "text-[#52525B] hover:text-[#A1A1AA]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-7 py-5 space-y-5">
        {/* KPI grid — Stripe style */}
        <div className="grid grid-cols-3 gap-3">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="glass-card p-5 hover:bg-[#1A1A21] transition-all duration-200 cursor-default"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${kpi.color}12`, border: `1px solid ${kpi.color}20` }}
                >
                  <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
                <span
                  className={`flex items-center gap-0.5 text-[11px] font-medium ${
                    kpi.up ? "text-[#22C55E]" : "text-[#EF4444]"
                  }`}
                >
                  {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.delta}
                </span>
              </div>

              <p className="text-[28px] font-bold text-white tracking-tight leading-none mb-1">
                {kpi.value}
              </p>
              <p className="text-[12px] text-[#52525B] mb-4">{kpi.label}</p>

              <Sparkline
                data={chartData.map((d) => d[kpi.dataKey as keyof typeof d] as number)}
                color={kpi.color}
              />
            </motion.div>
          ))}
        </div>

        {/* Main chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-[14px] font-semibold text-white">Leads e Conversões</h3>
              <p className="text-[12px] text-[#52525B] mt-0.5">Entradas diárias nos últimos 30 dias</p>
            </div>
            <div className="flex items-center gap-4 text-[12px]">
              <span className="flex items-center gap-1.5 text-[#52525B]">
                <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                Leads
              </span>
              <span className="flex items-center gap-1.5 text-[#52525B]">
                <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                Conversões
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gConv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#25D366" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#25D366" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "#3F3F46", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                interval={6}
              />
              <YAxis
                tick={{ fill: "#3F3F46", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="leads"
                name="Leads"
                stroke="#7C3AED"
                strokeWidth={2}
                fill="url(#gLeads)"
                dot={false}
                activeDot={{ r: 4, fill: "#7C3AED", stroke: "#09090B", strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="conversoes"
                name="Conversões"
                stroke="#25D366"
                strokeWidth={2}
                fill="url(#gConv)"
                dot={false}
                activeDot={{ r: 4, fill: "#25D366", stroke: "#09090B", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent leads */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
            <h3 className="text-[13px] font-semibold text-white">Leads Recentes</h3>
            <a href="/leads-quentes" className="text-[11px] text-[#7C3AED] hover:text-[#8B5CF6] transition-colors">
              Ver todos →
            </a>
          </div>

          <div className="divide-y divide-white/[0.03]">
            {mockLeads.slice(0, 5).map((lead, i) => {
              const score = scoreToLabel(lead.score);
              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-[#131318]/60 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED]/30 to-[#8B5CF6]/30 flex items-center justify-center text-[12px] font-semibold text-white shrink-0">
                    {lead.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white">{lead.name}</p>
                    <p className="text-[11px] text-[#52525B] truncate">{lead.last_message}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[11px] font-medium ${score.color}`}>{score.emoji} {lead.score}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      lead.temperature === "hot" ? "bg-red-400" :
                      lead.temperature === "warm" ? "bg-orange-400" : "bg-[#3F3F46]"
                    }`} />
                    <span className="text-[10px] text-[#3F3F46] w-14 text-right">
                      {lead.last_message_at ? timeAgo(lead.last_message_at) : ""}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
