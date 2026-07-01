"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { motion } from "framer-motion";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import { Plus, Eye, Send, CheckCircle, XCircle, Clock, MoreHorizontal, FileText, TrendingUp, DollarSign, Copy } from "lucide-react";

type Tab = "Todas" | "Em aberto" | "Aceitas" | "Expiradas" | "Recusadas";
const tabs: Tab[] = ["Todas", "Em aberto", "Aceitas", "Expiradas", "Recusadas"];

const proposals = [
  {
    id: "#P-1047", client: "Clínica Bella Vita", contact: "Dra. Fernanda Castro",
    value: "R$ 8.400", monthly: "R$ 700/mês", status: "aceita",
    service: "Sistema de Gestão + IA WhatsApp", sent: "15/06/2026", expires: "30/06/2026",
    views: 7, opens: 3,
  },
  {
    id: "#P-1048", client: "Imob 360", contact: "Ricardo Pires",
    value: "R$ 14.900", monthly: "R$ 1.490/mês", status: "aberta",
    service: "Hub Operacional Completo + Automações", sent: "22/06/2026", expires: "07/07/2026",
    views: 12, opens: 5,
  },
  {
    id: "#P-1049", client: "Lima & Associados", contact: "Gustavo Lima",
    value: "R$ 6.200", monthly: "R$ 620/mês", status: "aberta",
    service: "CRM + Landing Pages + Relatórios", sent: "24/06/2026", expires: "09/07/2026",
    views: 3, opens: 1,
  },
  {
    id: "#P-1046", client: "Studio Fitness", contact: "Ana Paula Ribeiro",
    value: "R$ 4.800", monthly: "R$ 400/mês", status: "aceita",
    service: "Landing Page + WhatsApp + CRM", sent: "10/06/2026", expires: "25/06/2026",
    views: 9, opens: 4,
  },
  {
    id: "#P-1045", client: "NovaTech Solutions", contact: "Marcos Oliveira",
    value: "R$ 19.200", monthly: "R$ 1.600/mês", status: "recusada",
    service: "Hub Operacional + IA Completo", sent: "01/06/2026", expires: "16/06/2026",
    views: 4, opens: 2,
  },
  {
    id: "#P-1044", client: "Empório Gourmet", contact: "Carla Sousa",
    value: "R$ 3.600", monthly: "R$ 300/mês", status: "expirada",
    service: "WhatsApp + Cardápio Digital", sent: "20/05/2026", expires: "04/06/2026",
    views: 1, opens: 0,
  },
];

const statusConfig: Record<string, { label: string; bg: string; color: string; icon: typeof CheckCircle }> = {
  aceita:   { label: "Aceita", bg: "rgba(34,197,94,0.12)", color: "#4ADE80", icon: CheckCircle },
  aberta:   { label: "Em aberto", bg: "rgba(59,130,246,0.12)", color: "#60A5FA", icon: Clock },
  recusada: { label: "Recusada", bg: "rgba(239,68,68,0.12)", color: "#F87171", icon: XCircle },
  expirada: { label: "Expirada", bg: "rgba(107,114,128,0.12)", color: "#9CA3AF", icon: Clock },
};

export default function PropostasPage() {
  const [tab, setTab] = useState<Tab>("Todas");

  const filtered = tab === "Todas" ? proposals
    : tab === "Em aberto" ? proposals.filter(p => p.status === "aberta")
    : tab === "Aceitas" ? proposals.filter(p => p.status === "aceita")
    : tab === "Recusadas" ? proposals.filter(p => p.status === "recusada")
    : proposals.filter(p => p.status === "expirada");

  const totalValue = proposals.filter(p => p.status === "aceita").reduce((s, p) => s + parseInt(p.value.replace(/\D/g, "")), 0);
  const openValue = proposals.filter(p => p.status === "aberta").reduce((s, p) => s + parseInt(p.value.replace(/\D/g, "")), 0);

  return (
    <>
      <Topbar
        title="Propostas"
        subtitle="Crie, envie e acompanhe propostas"
        action={{ label: "Nova proposta" }}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Propostas aceitas", val: proposals.filter(p => p.status === "aceita").length.toString(), color: "#22C55E", icon: CheckCircle },
            { label: "Em aberto", val: proposals.filter(p => p.status === "aberta").length.toString(), color: "#3B82F6", icon: Clock },
            { label: "Receita fechada", val: `R$ ${(totalValue / 1000).toFixed(1)}k`, color: "#22C55E", icon: DollarSign },
            { label: "Pipeline aberto", val: `R$ ${(openValue / 1000).toFixed(1)}k`, color: "#7C3AED", icon: TrendingUp },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, ease: EASE }}
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
                whileHover={{ y: -2 }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}25` }}>
                  <Icon size={15} style={{ color: kpi.color }} />
                </div>
                <div>
                  <div className="text-[22px] font-black leading-none">{kpi.val}</div>
                  <div className="text-[11px] text-[#6B7280] mt-0.5">{kpi.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1.5 flex-wrap">
            {tabs.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3.5 py-1.5 rounded-xl text-[12px] font-medium transition-all border cursor-pointer ${
                  tab === t
                    ? "bg-[rgba(124,58,237,0.15)] text-[#A78BFA] border-[rgba(124,58,237,0.3)]"
                    : "text-[#6B7280] border-white/[0.06] hover:text-white hover:border-white/10 bg-transparent"
                }`}>
                {t}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#7C3AED] text-white text-[12px] font-semibold rounded-xl hover:bg-[#8B5CF6] transition-colors">
            <Plus size={13} /> Nova proposta
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
          <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-[#0C0C10] border-b border-white/[0.06]">
            {["#","Cliente / Serviço","Valor","Status","Enviado","Visualizações",""].map((h, i) => (
              <div key={i} className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-[0.5px]">{h}</div>
            ))}
          </div>

          {filtered.map((p, i) => {
            const st = statusConfig[p.status];
            const StatusIcon = st.icon;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer group items-center"
              >
                <div className="text-[11px] text-[#4B5563] font-mono">{p.id}</div>
                <div>
                  <div className="text-[13px] font-semibold text-white">{p.client}</div>
                  <div className="text-[11px] text-[#6B7280] mt-0.5">{p.service}</div>
                  <div className="text-[10px] text-[#4B5563]">{p.contact}</div>
                </div>
                <div>
                  <div className="text-[13px] font-bold text-white">{p.value}</div>
                  <div className="text-[10px] text-[#6B7280]">{p.monthly}</div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                    style={{ background: st.bg, color: st.color }}>
                    <StatusIcon size={9} /> {st.label}
                  </span>
                </div>
                <div className="text-[12px] text-[#6B7280]">{p.sent}</div>
                <div>
                  <div className="flex items-center gap-1 text-[12px] text-[#6B7280]">
                    <Eye size={10} /> {p.views}
                    <span className="text-[#4B5563] ml-1">({p.opens}x lida)</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="px-2.5 py-1 rounded-lg bg-white/[0.04] text-[#9CA3AF] text-[10px] hover:text-white hover:bg-white/[0.08] transition-all flex items-center gap-1">
                    <Eye size={9} /> Ver
                  </button>
                  <button className="px-2.5 py-1 rounded-lg bg-[rgba(124,58,237,0.1)] text-[#A78BFA] text-[10px] hover:bg-[rgba(124,58,237,0.2)] transition-all flex items-center gap-1">
                    <Send size={9} /> Reenviar
                  </button>
                  <button className="w-6 h-6 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#6B7280] hover:text-white">
                    <MoreHorizontal size={11} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* IA CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, ease: EASE }}
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.04))", border: "1px solid rgba(124,58,237,0.15)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-[rgba(124,58,237,0.15)] flex items-center justify-center flex-shrink-0">
            <FileText size={18} className="text-[#A78BFA]" />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-bold text-white mb-0.5">IA geradora de propostas</div>
            <div className="text-[12px] text-[#6B7280]">Passe o briefing do cliente e a IA cria uma proposta profissional completa em segundos</div>
          </div>
          <button className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-[#7C3AED] text-white text-[12px] font-semibold rounded-xl hover:bg-[#8B5CF6] transition-colors">
            <Copy size={12} /> Gerar com IA
          </button>
        </motion.div>

      </main>
    </>
  );
}
