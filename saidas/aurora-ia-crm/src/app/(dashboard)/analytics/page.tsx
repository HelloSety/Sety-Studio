"use client";

import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Users, DollarSign, MessageSquare,
  Zap, Clock, BarChart3, Target, Award
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import Header from "@/components/layout/header";
import { mockChartData, mockAnalytics } from "@/lib/mock-data";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#18181F] border border-white/[0.09] rounded-lg p-3 shadow-xl text-xs">
      <p className="text-slate-400 mb-2">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color ?? p.fill }} className="font-medium">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

const funnelData = [
  { stage: "Novos leads", value: 247, color: "#8B3FFF" },
  { stage: "Qualificados", value: 148, color: "#06B6D4" },
  { stage: "Propostas", value: 67, color: "#F59E0B" },
  { stage: "Negociações", value: 38, color: "#F97316" },
  { stage: "Fechados", value: 23, color: "#10B981" },
];

const originData = [
  { name: "Instagram", value: 42, color: "#8B3FFF" },
  { name: "Google Ads", value: 28, color: "#06B6D4" },
  { name: "WhatsApp", value: 18, color: "#10B981" },
  { name: "Indicação", value: 12, color: "#F59E0B" },
];

const kpis = [
  { label: "Total Leads", value: "247", sub: "+18% vs mês anterior", up: true, icon: Users, color: "#8B3FFF" },
  { label: "Receita Gerada", value: "R$ 82.400", sub: "+24% vs mês anterior", up: true, icon: DollarSign, color: "#10B981" },
  { label: "Taxa de Conversão", value: "9.3%", sub: "+1.2pp vs mês anterior", up: true, icon: Target, color: "#06B6D4" },
  { label: "Ticket Médio", value: "R$ 3.583", sub: "+8% vs mês anterior", up: true, icon: Award, color: "#F59E0B" },
  { label: "Tempo Médio", value: "1.4h", sub: "-20min vs mês anterior", up: true, icon: Clock, color: "#A066FF" },
  { label: "Mensagens/Lead", value: "14.2", sub: "+2.1 vs mês anterior", up: true, icon: MessageSquare, color: "#06B6D4" },
];

export default function AnalyticsPage() {
  const chartData = mockChartData.slice(-30);
  const weekData = chartData.slice(-7);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Analytics" subtitle="Performance detalhada dos últimos 30 dias" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* KPI grid */}
        <div className="grid grid-cols-3 gap-4">
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}25` }}
                >
                  <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
                <span className={`flex items-center gap-0.5 text-[11px] font-medium ${kpi.up ? "text-emerald-400" : "text-red-400"}`}>
                  {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.sub.split(" ")[0]}
                </span>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">{kpi.value}</p>
              <p className="text-[12px] text-slate-400 mt-0.5">{kpi.label}</p>
              <p className="text-[10px] text-slate-600 mt-1">{kpi.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-3 gap-4">
          {/* Main area chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="col-span-2 glass-card p-5"
          >
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white">Leads e Conversões — 30 dias</h3>
              <p className="text-xs text-slate-500">Entradas diárias vs fechamentos</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B3FFF" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#8B3FFF" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} interval={6} />
                <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="leads" name="Leads" stroke="#8B3FFF" strokeWidth={2} fill="url(#gLeads)" />
                <Area type="monotone" dataKey="conversoes" name="Conversões" stroke="#10B981" strokeWidth={2} fill="url(#gConv)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Origem dos leads pie */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="glass-card p-5"
          >
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white">Origem dos Leads</h3>
              <p className="text-xs text-slate-500">Distribuição por canal</p>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={originData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {originData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {originData.map((o) => (
                <div key={o.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: o.color }} />
                    <span className="text-slate-400">{o.name}</span>
                  </div>
                  <span className="text-white font-medium">{o.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-2 gap-4">
          {/* Funnel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-5"
          >
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white">Funil de Conversão</h3>
              <p className="text-xs text-slate-500">Leads por etapa</p>
            </div>
            <div className="space-y-2.5">
              {funnelData.map((row, i) => {
                const pct = Math.round((row.value / funnelData[0].value) * 100);
                return (
                  <div key={row.stage}>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-400">{row.stage}</span>
                      <span className="text-white font-medium">{row.value} <span className="text-slate-600">({pct}%)</span></span>
                    </div>
                    <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.7, delay: i * 0.08 }}
                        className="h-full rounded-full"
                        style={{ background: row.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Weekly messages bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="glass-card p-5"
          >
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white">Mensagens — 7 dias</h3>
              <p className="text-xs text-slate-500">Enviadas vs recebidas</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weekData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="enviadas" name="Enviadas" fill="#8B3FFF" radius={[3, 3, 0, 0]} opacity={0.85} />
                <Bar dataKey="recebidas" name="Recebidas" fill="#06B6D4" radius={[3, 3, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
