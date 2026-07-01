"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { motion } from "framer-motion";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import {
  Plus, Play, Pause, Zap, MessageSquare, Mail, Clock,
  Users, TrendingUp, CheckCircle, ChevronRight, Settings,
  MoreHorizontal, Activity, Brain, ShoppingCart
} from "lucide-react";

type Tab = "Todas" | "WhatsApp" | "Email" | "CRM" | "IA" | "Vendas";
const tabs: Tab[] = ["Todas", "WhatsApp", "Email", "CRM", "IA", "Vendas"];

const automations = [
  {
    id: 1, name: "Boas-vindas ao lead", category: "WhatsApp" as Tab, status: "ativa",
    trigger: "Novo lead cadastrado", steps: 4, runs: 1247, conversion: "34%",
    lastRun: "há 3 min", icon: MessageSquare, color: "#25D366",
    flow: ["Lead entra", "Aguarda 30s", "IA envia mensagem de boas-vindas", "Tag: novo-lead"],
  },
  {
    id: 2, name: "Follow-up de proposta", category: "WhatsApp" as Tab, status: "ativa",
    trigger: "Proposta enviada + 24h sem resposta", steps: 6, runs: 389, conversion: "22%",
    lastRun: "há 1h", icon: TrendingUp, color: "#7C3AED",
    flow: ["Proposta enviada", "Aguarda 24h", "Verifica se respondeu", "Se não → IA envia follow-up", "Aguarda 48h", "Se não → Alerta no CRM"],
  },
  {
    id: 3, name: "Recuperação de carrinho abandonado", category: "IA" as Tab, status: "ativa",
    trigger: "Carrinho abandonado por 2h", steps: 5, runs: 214, conversion: "28%",
    lastRun: "há 22 min", icon: ShoppingCart, color: "#F59E0B",
    flow: ["Carrinho abandonado", "Aguarda 2h", "IA analisa histórico do cliente", "Mensagem personalizada com desconto", "Marca como recuperado se pagar"],
  },
  {
    id: 4, name: "Qualificação automática de lead", category: "IA" as Tab, status: "ativa",
    trigger: "Novo contato no WhatsApp", steps: 7, runs: 3102, conversion: "41%",
    lastRun: "há 1 min", icon: Brain, color: "#A78BFA",
    flow: ["Contato entra", "IA responde em 10s", "Coleta nome, empresa e interesse", "Score de qualificação", "Lead quente → CRM + alerta", "Lead frio → nurturing", "Lead sem perfil → arquiva"],
  },
  {
    id: 5, name: "Onboarding de novo cliente", category: "Email" as Tab, status: "ativa",
    trigger: "Venda confirmada", steps: 8, runs: 67, conversion: "100%",
    lastRun: "há 2 dias", icon: Users, color: "#3B82F6",
    flow: ["Venda confirmada", "Email de boas-vindas", "Agenda call de onboarding", "Envia materiais", "Semana 1: check-in", "Semana 2: dúvidas", "Mês 1: review", "Solicita depoimento"],
  },
  {
    id: 6, name: "Alerta de lead inativo", category: "CRM" as Tab, status: "pausada",
    trigger: "Lead sem contato há 7 dias", steps: 3, runs: 892, conversion: "12%",
    lastRun: "há 3 dias", icon: Clock, color: "#EF4444",
    flow: ["Lead sem contato há 7 dias", "Alerta no CRM para o responsável", "Task criada automaticamente"],
  },
  {
    id: 7, name: "Email de aniversário do cliente", category: "Email" as Tab, status: "ativa",
    trigger: "Aniversário do cliente", steps: 2, runs: 48, conversion: "8%",
    lastRun: "há 4 dias", icon: Mail, color: "#EC4899",
    flow: ["Data de aniversário chegou", "Email personalizado com oferta especial"],
  },
  {
    id: 8, name: "Relatório semanal automático", category: "IA" as Tab, status: "ativa",
    trigger: "Toda segunda-feira às 08:00", steps: 4, runs: 24, conversion: "—",
    lastRun: "há 2 dias", icon: Activity, color: "#22C55E",
    flow: ["Toda segunda 08h", "IA compila dados da semana", "Gera relatório PDF", "Envia por email + WhatsApp"],
  },
];

const statusConfig = {
  ativa:   { label: "Ativa", bg: "rgba(34,197,94,0.12)", color: "#4ADE80" },
  pausada: { label: "Pausada", bg: "rgba(239,68,68,0.12)", color: "#F87171" },
};

export default function AutomacoesPage() {
  const [tab, setTab] = useState<Tab>("Todas");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [automList, setAutomList] = useState(automations);

  const filtered = tab === "Todas" ? automList : automList.filter(a => a.category === tab);
  const activeCount = automList.filter(a => a.status === "ativa").length;
  const totalRuns = automList.reduce((sum, a) => sum + a.runs, 0);

  const toggleStatus = (id: number) => {
    setAutomList(prev => prev.map(a =>
      a.id === id ? { ...a, status: a.status === "ativa" ? "pausada" : "ativa" } : a
    ));
  };

  return (
    <>
      <Topbar
        title="Automações"
        subtitle="Fluxos inteligentes que trabalham enquanto você dorme"
        action={{ label: "Nova automação" }}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Automações ativas", val: activeCount.toString(), color: "#22C55E", icon: CheckCircle },
            { label: "Execuções totais", val: totalRuns.toLocaleString("pt-BR"), color: "#7C3AED", icon: Zap },
            { label: "Leads qualificados", val: "3.102", color: "#3B82F6", icon: Users },
            { label: "Receita gerada", val: "R$ 18.4k", color: "#F59E0B", icon: TrendingUp },
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
                  <Icon size={16} style={{ color: kpi.color }} />
                </div>
                <div>
                  <div className="text-[20px] font-black leading-none">{kpi.val}</div>
                  <div className="text-[11px] text-[#6B7280] mt-0.5">{kpi.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs + new button */}
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
            <Plus size={13} /> Nova automação
          </button>
        </div>

        {/* Automation cards */}
        <div className="space-y-3">
          {filtered.map((a, i) => {
            const Icon = a.icon;
            const st = statusConfig[a.status as keyof typeof statusConfig];
            const isExpanded = expanded === a.id;

            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, ease: EASE }}
                className="rounded-2xl overflow-hidden"
                style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="flex items-center gap-4 p-5 cursor-pointer hover:bg-white/[0.01] transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : a.id)}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${a.color}15`, border: `1px solid ${a.color}25` }}>
                    <Icon size={16} style={{ color: a.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[14px] font-bold text-white truncate">{a.name}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                    <div className="text-[12px] text-[#6B7280] truncate">{a.trigger}</div>
                  </div>

                  <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
                    <div className="text-center">
                      <div className="text-[14px] font-bold text-white">{a.steps}</div>
                      <div className="text-[10px] text-[#4B5563]">passos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[14px] font-bold text-white">{a.runs.toLocaleString("pt-BR")}</div>
                      <div className="text-[10px] text-[#4B5563]">execuções</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[14px] font-bold text-[#22C55E]">{a.conversion}</div>
                      <div className="text-[10px] text-[#4B5563]">conversão</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleStatus(a.id); }}
                      className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                      style={{ background: a.status === "ativa" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.08)" }}>
                      {a.status === "ativa" ? <Pause size={13} className="text-[#4ADE80]" /> : <Play size={13} className="text-[#F87171]" />}
                    </button>
                    <button className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#6B7280] transition-all">
                      <Settings size={13} />
                    </button>
                    <button className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#6B7280] transition-all">
                      <MoreHorizontal size={13} />
                    </button>
                    <ChevronRight size={14} className={`text-[#4B5563] transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                  </div>
                </div>

                {/* Flow visualization */}
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/[0.06] px-5 py-4"
                  >
                    <div className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider mb-3">Fluxo de execução</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {a.flow.map((step, si) => (
                        <div key={si} className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium"
                            style={{ background: `${a.color}10`, color: a.color, border: `1px solid ${a.color}20` }}>
                            <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-bold">{si + 1}</span>
                            {step}
                          </div>
                          {si < a.flow.length - 1 && <ChevronRight size={12} className="text-[#4B5563] flex-shrink-0" />}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/[0.04]">
                      <span className="text-[11px] text-[#6B7280] flex items-center gap-1"><Clock size={10} /> Última execução: {a.lastRun}</span>
                      <span className="text-[11px] text-[#6B7280]">· Categoria: {a.category}</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA — template library */}
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
            <div className="text-[14px] font-semibold text-white mb-0.5">Biblioteca de templates de automação</div>
            <div className="text-[12px] text-[#6B7280]">+50 automações prontas para ativar com 1 clique — WhatsApp, email, CRM, IA e muito mais</div>
          </div>
          <button className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 bg-[#7C3AED] text-white text-[12px] font-semibold rounded-xl hover:bg-[#8B5CF6] transition-colors">
            Ver templates <ChevronRight size={12} />
          </button>
        </motion.div>

      </main>
    </>
  );
}
