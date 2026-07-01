"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { motion } from "framer-motion";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import { Plus, Eye, TrendingUp, MousePointer, ExternalLink, Copy, MoreHorizontal, Globe, LayoutTemplate, Zap } from "lucide-react";

type Tab = "Todas" | "Ativas" | "Rascunhos" | "Templates";
const tabs: Tab[] = ["Todas", "Ativas", "Rascunhos", "Templates"];

const pages = [
  {
    id: 1, name: "Captação de Leads — Clínicas", status: "ativa",
    url: "sety.vision/c/clinicas", visits: 4820, leads: 312, conversion: "6,5%",
    updated: "há 2 dias", thumb: "purple",
    tags: ["WhatsApp", "Formulário"],
  },
  {
    id: 2, name: "Vendas — Consultoria Premium", status: "ativa",
    url: "sety.vision/c/premium", visits: 2140, leads: 189, conversion: "8,8%",
    updated: "há 5 dias", thumb: "blue",
    tags: ["Checkout", "Pixel"],
  },
  {
    id: 3, name: "Evento ao vivo — Webinar", status: "ativa",
    url: "sety.vision/c/webinar", visits: 1340, leads: 98, conversion: "7,3%",
    updated: "há 1 sem", thumb: "green",
    tags: ["Email", "WhatsApp"],
  },
  {
    id: 4, name: "Black Friday — Imobiliárias", status: "rascunho",
    url: "—", visits: 0, leads: 0, conversion: "—",
    updated: "ontem", thumb: "orange",
    tags: ["Checkout"],
  },
  {
    id: 5, name: "Agências — Proposta Digital", status: "rascunho",
    url: "—", visits: 0, leads: 0, conversion: "—",
    updated: "há 3 dias", thumb: "purple",
    tags: ["Formulário"],
  },
];

const templates = [
  { name: "Captação de Leads Simples", category: "Lead gen", color: "#7C3AED", uses: 847 },
  { name: "Vendas com Checkout", category: "E-commerce", color: "#3B82F6", uses: 423 },
  { name: "Clínica / Consultório", category: "Saúde", color: "#22C55E", uses: 312 },
  { name: "Imobiliária", category: "Imóveis", color: "#F59E0B", uses: 198 },
  { name: "Restaurante e Delivery", category: "Alimentos", color: "#EF4444", uses: 156 },
  { name: "Evento e Webinar", category: "Educação", color: "#EC4899", uses: 234 },
];

const thumbGradients: Record<string, string> = {
  purple: "linear-gradient(135deg, #7C3AED, #4F46E5)",
  blue:   "linear-gradient(135deg, #3B82F6, #1D4ED8)",
  green:  "linear-gradient(135deg, #22C55E, #15803D)",
  orange: "linear-gradient(135deg, #F59E0B, #D97706)",
};

export default function LandingPagesPage() {
  const [tab, setTab] = useState<Tab>("Todas");

  const visible = tab === "Todas"
    ? pages
    : tab === "Ativas" ? pages.filter(p => p.status === "ativa")
    : tab === "Rascunhos" ? pages.filter(p => p.status === "rascunho")
    : [];

  return (
    <>
      <Topbar
        title="Landing Pages"
        subtitle="Crie, publique e converta"
        action={{ label: "Nova landing page" }}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Páginas ativas", val: "3", color: "#22C55E", icon: Globe },
            { label: "Total de visitas", val: "8.300", color: "#7C3AED", icon: Eye },
            { label: "Leads gerados", val: "599", color: "#3B82F6", icon: MousePointer },
            { label: "Conversão média", val: "7,2%", color: "#F59E0B", icon: TrendingUp },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ease: EASE }}
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
                whileHover={{ y: -2 }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                  <Icon size={16} style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-[22px] font-black leading-none">{s.val}</div>
                  <div className="text-[11px] text-[#6B7280] mt-0.5">{s.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1.5">
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
            <Plus size={13} /> Nova página
          </button>
        </div>

        {/* Templates tab */}
        {tab === "Templates" ? (
          <div>
            <div className="text-[12px] text-[#6B7280] mb-4">Selecione um template para começar em minutos</div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {templates.map((tmpl, i) => (
                <motion.div
                  key={tmpl.name}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, ease: EASE }}
                  className="rounded-2xl overflow-hidden cursor-pointer group"
                  style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
                  whileHover={{ y: -3, borderColor: `${tmpl.color}40` }}
                >
                  <div className="h-28 flex items-center justify-center" style={{ background: `${tmpl.color}12` }}>
                    <LayoutTemplate size={32} style={{ color: tmpl.color, opacity: 0.5 }} />
                  </div>
                  <div className="p-4">
                    <div className="text-[13px] font-bold text-white mb-0.5">{tmpl.name}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#6B7280]">{tmpl.category}</span>
                      <span className="text-[10px] text-[#4B5563]">{tmpl.uses} usos</span>
                    </div>
                    <button className="w-full mt-3 py-2 rounded-xl text-[12px] font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-[#9CA3AF] hover:text-white transition-colors">
                      Usar template
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Pages grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {visible.map((page, i) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, ease: EASE }}
                className="rounded-2xl overflow-hidden group cursor-pointer"
                style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
                whileHover={{ y: -3, boxShadow: "0 16px 40px rgba(0,0,0,0.4)" }}
              >
                {/* Preview thumb */}
                <div className="h-32 relative flex items-center justify-center"
                  style={{ background: thumbGradients[page.thumb] ?? thumbGradients.purple }}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <div className="w-24 h-3 bg-white rounded-full mb-4 mt-6" />
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 rounded-lg bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all">
                      <Eye size={12} />
                    </button>
                    <button className="w-7 h-7 rounded-lg bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all">
                      <ExternalLink size={12} />
                    </button>
                  </div>
                  <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    page.status === "ativa"
                      ? "bg-[rgba(34,197,94,0.9)] text-white"
                      : "bg-[rgba(107,114,128,0.9)] text-white"
                  }`}>
                    {page.status === "ativa" ? "Ativa" : "Rascunho"}
                  </span>
                </div>

                <div className="p-4">
                  <div className="text-[13px] font-bold text-white mb-1">{page.name}</div>
                  {page.url !== "—" && (
                    <div className="flex items-center gap-1 mb-3">
                      <Globe size={9} className="text-[#4B5563]" />
                      <span className="text-[10px] text-[#6B7280] font-mono">{page.url}</span>
                      <button className="ml-0.5 text-[#4B5563] hover:text-white transition-colors"><Copy size={9} /></button>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 mb-3">
                    {page.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-white/[0.06] text-[#6B7280]">{tag}</span>
                    ))}
                  </div>

                  {/* Stats */}
                  {page.status === "ativa" && (
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        { label: "Visitas", val: page.visits.toLocaleString("pt-BR"), color: "#6B7280" },
                        { label: "Leads", val: page.leads.toString(), color: "#7C3AED" },
                        { label: "Conv.", val: page.conversion, color: "#22C55E" },
                      ].map(s => (
                        <div key={s.label} className="text-center p-2 rounded-xl bg-white/[0.03]">
                          <div className="text-[13px] font-bold" style={{ color: s.color }}>{s.val}</div>
                          <div className="text-[9px] text-[#4B5563]">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                    <span className="text-[10px] text-[#4B5563]">Editado {page.updated}</span>
                    <div className="flex gap-1">
                      <button className="px-2.5 py-1 rounded-lg bg-[rgba(124,58,237,0.1)] text-[#A78BFA] text-[10px] font-semibold hover:bg-[rgba(124,58,237,0.2)] transition-colors">
                        Editar
                      </button>
                      <button className="w-6 h-6 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#6B7280] transition-all">
                        <MoreHorizontal size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* New page card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: visible.length * 0.06, ease: EASE }}
              className="rounded-2xl flex flex-col items-center justify-center gap-3 p-8 cursor-pointer group min-h-[260px]"
              style={{ background: "rgba(124,58,237,0.04)", border: "2px dashed rgba(124,58,237,0.2)" }}
              whileHover={{ borderColor: "rgba(124,58,237,0.4)", background: "rgba(124,58,237,0.06)" }}
            >
              <div className="w-12 h-12 rounded-2xl bg-[rgba(124,58,237,0.12)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={20} className="text-[#A78BFA]" />
              </div>
              <div className="text-center">
                <div className="text-[13px] font-semibold text-[#A78BFA]">Nova landing page</div>
                <div className="text-[11px] text-[#4B5563] mt-0.5">Criar do zero ou usar template</div>
              </div>
            </motion.div>
          </div>
        )}

        {/* AI CRO banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, ease: EASE }}
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.04))", border: "1px solid rgba(124,58,237,0.15)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-[rgba(124,58,237,0.15)] flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-[#A78BFA]" />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-bold text-white mb-0.5">IA de Otimização de Conversão (CRO)</div>
            <div className="text-[12px] text-[#6B7280]">A IA analisa suas páginas e sugere melhorias para aumentar a taxa de conversão automaticamente</div>
          </div>
          <button className="flex-shrink-0 px-4 py-2 bg-[#7C3AED] text-white text-[12px] font-semibold rounded-xl hover:bg-[#8B5CF6] transition-colors">
            Ativar CRO IA
          </button>
        </motion.div>

      </main>
    </>
  );
}
