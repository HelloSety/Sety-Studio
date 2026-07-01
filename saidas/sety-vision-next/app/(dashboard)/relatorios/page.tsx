"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { motion } from "framer-motion";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import { Download, TrendingUp, Users, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";

const periods = ["7 dias", "30 dias", "90 dias", "6 meses", "12 meses"];

const funnelStages = [
  { label: "Visitantes", val: 12400, pct: 100, color: "#6B7280" },
  { label: "Leads Gerados", val: 3720, pct: 30, color: "#7C3AED" },
  { label: "Qualificados", val: 1116, pct: 9, color: "#3B82F6" },
  { label: "Proposta Enviada", val: 334, pct: 2.7, color: "#F59E0B" },
  { label: "Negociação", val: 134, pct: 1.1, color: "#EC4899" },
  { label: "Fechados", val: 67, pct: 0.5, color: "#22C55E" },
];

const monthlyData = [
  { month: "Jan", receita: 18400, leads: 312, clientes: 8 },
  { month: "Fev", receita: 22100, leads: 387, clientes: 11 },
  { month: "Mar", receita: 19800, leads: 341, clientes: 9 },
  { month: "Abr", receita: 28700, leads: 498, clientes: 14 },
  { month: "Mai", receita: 31200, leads: 542, clientes: 17 },
  { month: "Jun", receita: 38900, leads: 687, clientes: 21 },
];

const channels = [
  { label: "WhatsApp", leads: 832, conversions: 34, revenue: "R$ 16.820", pct: 44, color: "#22C55E" },
  { label: "Google Ads", leads: 487, conversions: 18, revenue: "R$ 8.910", pct: 26, color: "#3B82F6" },
  { label: "Meta Ads", leads: 354, conversions: 9, revenue: "R$ 4.455", pct: 19, color: "#7C3AED" },
  { label: "Orgânico / Indicação", leads: 174, conversions: 6, revenue: "R$ 2.970", pct: 9, color: "#F59E0B" },
  { label: "Outros", leads: 41, conversions: 0, revenue: "R$ 0", pct: 2, color: "#6B7280" },
];

const maxRevenue = Math.max(...monthlyData.map(d => d.receita));

export default function RelatoriosPage() {
  const [period, setPeriod] = useState("30 dias");

  return (
    <>
      <Topbar
        title="Relatórios"
        subtitle="Análise completa de performance"
        action={{ label: "Exportar PDF" }}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Period selector */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1.5 flex-wrap">
            {periods.map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3.5 py-1.5 rounded-xl text-[12px] font-medium transition-all border cursor-pointer ${
                  period === p
                    ? "bg-[rgba(124,58,237,0.15)] text-[#A78BFA] border-[rgba(124,58,237,0.3)]"
                    : "text-[#6B7280] border-white/[0.06] hover:text-white hover:border-white/10 bg-transparent"
                }`}>
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[rgba(255,255,255,0.06)] border border-white/[0.08] text-[12px] text-[#9CA3AF] hover:text-white rounded-xl transition-colors">
            <Download size={13} /> Exportar
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Receita total", val: "R$ 159.100", change: "+34%", up: true, sub: "vs período anterior", icon: DollarSign, color: "#22C55E" },
            { label: "Total de leads", val: "1.888", change: "+28%", up: true, sub: "leads qualificados", icon: Users, color: "#7C3AED" },
            { label: "Clientes fechados", val: "67", change: "+41%", up: true, sub: "novos contratos", icon: TrendingUp, color: "#3B82F6" },
            { label: "Ticket médio", val: "R$ 2.375", change: "+8%", up: true, sub: "por cliente", icon: BarChart3, color: "#F59E0B" },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, ease: EASE }}
                className="rounded-2xl p-5"
                style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
                whileHover={{ y: -3, boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-[12px] text-[#6B7280]">{kpi.label}</div>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}18`, border: `1px solid ${kpi.color}30` }}>
                    <Icon size={14} style={{ color: kpi.color }} />
                  </div>
                </div>
                <div className="text-[26px] font-black tracking-tight leading-none mb-2">{kpi.val}</div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: kpi.up ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: kpi.up ? "#22C55E" : "#EF4444" }}>
                    {kpi.up ? <ArrowUpRight size={9} className="mr-0.5" /> : <ArrowDownRight size={9} className="mr-0.5" />}
                    {kpi.change}
                  </span>
                  <span className="text-[11px] text-[#4B5563]">{kpi.sub}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ease: EASE }}
          className="rounded-2xl p-6"
          style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-[14px] font-bold text-white">Receita Mensal</div>
              <div className="text-[12px] text-[#6B7280] mt-0.5">Evolução dos últimos 6 meses</div>
            </div>
            <div className="text-right">
              <div className="text-[22px] font-black tracking-tight">R$ 159.100</div>
              <div className="text-[12px] text-[#22C55E] font-semibold">▲ +34% vs período anterior</div>
            </div>
          </div>
          <div className="flex items-end gap-4 h-52">
            {monthlyData.map((d, i) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                <div className="relative w-full group-hover:scale-x-105 transition-transform"
                  style={{ height: `${(d.receita / maxRevenue) * 180}px` }}>
                  <div
                    className="w-full h-full rounded-t-xl transition-all duration-300"
                    style={{
                      background: i === monthlyData.length - 1
                        ? "linear-gradient(180deg, #7C3AED, #5B21B6)"
                        : `rgba(124,58,237,${0.2 + i * 0.08})`,
                      boxShadow: i === monthlyData.length - 1 ? "0 0 20px rgba(124,58,237,0.3)" : "none",
                    }}
                  />
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#18181B] border border-white/10 rounded-lg px-2 py-1 text-[10px] font-semibold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    R$ {(d.receita / 1000).toFixed(1)}k
                  </div>
                </div>
                <div className="text-[11px] text-[#6B7280] font-medium">{d.month}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Funnel + Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Funnel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ease: EASE }}
            className="rounded-2xl p-6"
            style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="text-[14px] font-bold text-white mb-5">Funil de Conversão</div>
            <div className="space-y-3">
              {funnelStages.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-[12px] mb-1.5">
                    <span className="text-[#9CA3AF] font-medium">{s.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{s.val.toLocaleString("pt-BR")}</span>
                      <span className="text-[10px] text-[#4B5563]">{s.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.06]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: s.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${s.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-white/[0.06]">
              <div className="text-[12px] text-[#6B7280]">Taxa de conversão total: <span className="text-[#22C55E] font-bold">0,5%</span></div>
            </div>
          </motion.div>

          {/* Channels */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, ease: EASE }}
            className="rounded-2xl p-6"
            style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="text-[14px] font-bold text-white mb-5">Canais de Aquisição</div>
            <div className="space-y-4">
              {channels.map((c) => (
                <div key={c.label} className="group cursor-pointer hover:bg-white/[0.02] -mx-2 px-2 py-1 rounded-xl transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                      <span className="text-[13px] text-[#9CA3AF] font-medium">{c.label}</span>
                    </div>
                    <div className="flex items-center gap-4 text-[12px]">
                      <span className="text-[#6B7280]">{c.leads} leads</span>
                      <span className="text-white font-semibold">{c.revenue}</span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: c.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${c.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </main>
    </>
  );
}
