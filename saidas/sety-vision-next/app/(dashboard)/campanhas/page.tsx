"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { motion } from "framer-motion";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import { Plus, TrendingUp, Eye, MousePointer, ShoppingCart, Pause, Play, MoreHorizontal, BarChart3, Globe } from "lucide-react";

type Tab = "Todas" | "Google Ads" | "Meta Ads" | "TikTok" | "Orgânico";
const tabs: Tab[] = ["Todas", "Google Ads", "Meta Ads", "TikTok", "Orgânico"];

const campaigns = [
  {
    name: "Gestão Profissional — Google",
    platform: "Google Ads", status: "ativa",
    budget: "R$ 1.500/mês", spend: "R$ 987",
    impressions: "48.200", clicks: "1.847", conversions: "94",
    cpl: "R$ 10,50", roas: "4,7x", color: "#3B82F6",
  },
  {
    name: "CRM para Clínicas — Meta",
    platform: "Meta Ads", status: "ativa",
    budget: "R$ 2.000/mês", spend: "R$ 1.340",
    impressions: "94.700", clicks: "3.204", conversions: "78",
    cpl: "R$ 17,18", roas: "3,9x", color: "#3B82F6",
  },
  {
    name: "Automação WhatsApp — Retargeting",
    platform: "Meta Ads", status: "ativa",
    budget: "R$ 800/mês", spend: "R$ 420",
    impressions: "22.100", clicks: "890", conversions: "42",
    cpl: "R$ 10,00", roas: "5,2x", color: "#3B82F6",
  },
  {
    name: "Imobiliárias — Google Máx Performance",
    platform: "Google Ads", status: "pausada",
    budget: "R$ 3.000/mês", spend: "R$ 2.100",
    impressions: "76.400", clicks: "2.180", conversions: "31",
    cpl: "R$ 67,74", roas: "1,8x", color: "#EF4444",
  },
  {
    name: "Agências — TikTok Awareness",
    platform: "TikTok", status: "rascunho",
    budget: "R$ 500/mês", spend: "R$ 0",
    impressions: "—", clicks: "—", conversions: "—",
    cpl: "—", roas: "—", color: "#6B7280",
  },
];

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  "ativa":    { bg: "rgba(34,197,94,0.12)", text: "#4ADE80", label: "Ativa" },
  "pausada":  { bg: "rgba(239,68,68,0.12)", text: "#F87171", label: "Pausada" },
  "rascunho": { bg: "rgba(107,114,128,0.12)", text: "#9CA3AF", label: "Rascunho" },
};

const kpis = [
  { label: "Investimento total", val: "R$ 4.847", change: "+12%", up: true, icon: ShoppingCart, color: "#7C3AED" },
  { label: "Impressões", val: "241.400", change: "+28%", up: true, icon: Eye, color: "#3B82F6" },
  { label: "Cliques", val: "8.121", change: "+19%", up: true, icon: MousePointer, color: "#F59E0B" },
  { label: "ROAS médio", val: "4,7x", change: "+0,8x", up: true, icon: TrendingUp, color: "#22C55E" },
];

export default function CampanhasPage() {
  const [tab, setTab] = useState<Tab>("Todas");
  const [period, setPeriod] = useState("30d");

  const filtered = tab === "Todas" ? campaigns : campaigns.filter(c => c.platform === tab);

  return (
    <>
      <Topbar
        title="Campanhas"
        subtitle="Google Ads · Meta Ads · TikTok"
        action={{ label: "Nova campanha" }}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                custom={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: EASE }}
                className="rounded-2xl p-5 cursor-pointer"
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
                <div className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: kpi.up ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: kpi.up ? "#22C55E" : "#EF4444" }}>
                  {kpi.up ? "▲" : "▼"} {kpi.change}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Chart placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, ease: EASE }}
          className="rounded-2xl p-6"
          style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-[14px] font-bold text-white">Performance de Campanhas</div>
              <div className="text-[12px] text-[#6B7280] mt-0.5">Investimento vs Retorno</div>
            </div>
            <div className="flex gap-2">
              {["7d","30d","90d"].map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${p === period ? "bg-[rgba(124,58,237,0.15)] text-[#A78BFA]" : "text-[#6B7280] hover:text-white"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-48 flex items-end gap-2">
            {[
              [35,52],[42,68],[38,58],[55,82],[48,74],[62,90],[58,85],
              [70,95],[65,88],[75,98],[80,100],[72,94]
            ].map(([invest, ret], i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                <div className="relative w-full flex gap-0.5 items-end" style={{ height: "160px" }}>
                  <div className="flex-1 rounded-t transition-all duration-200 group-hover:opacity-90"
                    style={{ height: `${invest}%`, background: "rgba(59,130,246,0.5)" }} />
                  <div className="flex-1 rounded-t transition-all duration-200 group-hover:opacity-90"
                    style={{ height: `${ret}%`, background: "#7C3AED" }} />
                </div>
                <div className="text-[9px] text-[#4B5563]">{i + 1}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
              <div className="w-3 h-2 rounded-sm bg-[rgba(59,130,246,0.5)]" /> Investimento
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
              <div className="w-3 h-2 rounded-sm bg-[#7C3AED]" /> Retorno
            </div>
          </div>
        </motion.div>

        {/* Campaign list */}
        <div>
          {/* Tabs + actions */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex gap-1.5 flex-wrap">
              {tabs.map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-medium transition-all border cursor-pointer ${
                    tab === t
                      ? "bg-[rgba(124,58,237,0.15)] text-[#A78BFA] border-[rgba(124,58,237,0.3)]"
                      : "text-[#6B7280] border-white/[0.06] hover:text-white hover:border-white/10 bg-transparent"
                  }`}>
                  {t === "Google Ads" ? <Globe size={11} /> : t === "Meta Ads" ? <BarChart3 size={11} /> : null}
                  {t}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-[#7C3AED] text-white text-[12px] font-semibold rounded-xl hover:bg-[#8B5CF6] transition-colors">
              <Plus size={13} /> Nova campanha
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-[#0C0C10] border-b border-white/[0.06]">
              {["Campanha","Gasto","Impressões","Cliques","CPL","ROAS",""].map((h, i) => (
                <div key={i} className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-[0.5px]">{h}</div>
              ))}
            </div>
            {filtered.map((c, i) => {
              const st = statusStyles[c.status];
              return (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors items-center cursor-pointer group"
                >
                  <div>
                    <div className="text-[13px] font-semibold text-white mb-1 truncate">{c.name}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)", color: "#9CA3AF" }}>{c.platform}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.text }}>{st.label}</span>
                    </div>
                  </div>
                  <div className="text-[13px] font-semibold text-white">{c.spend}</div>
                  <div className="text-[13px] text-[#9CA3AF]">{c.impressions}</div>
                  <div className="text-[13px] text-[#9CA3AF]">{c.clicks}</div>
                  <div className="text-[13px] text-[#9CA3AF]">{c.cpl}</div>
                  <div className="text-[13px] font-bold" style={{ color: c.color === "#EF4444" ? "#F87171" : "#4ADE80" }}>{c.roas}</div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#6B7280] hover:text-white transition-all">
                      {c.status === "ativa" ? <Pause size={11} /> : <Play size={11} />}
                    </button>
                    <button className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#6B7280] hover:text-white transition-all">
                      <MoreHorizontal size={11} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </main>
    </>
  );
}
