"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { EASE } from "@/lib/motion";
import { MessageSquare, Users, Calendar, Brain } from "lucide-react";

const TABS = [
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { id: "crm",      label: "CRM",      icon: Users },
  { id: "agenda",   label: "Agenda",   icon: Calendar },
  { id: "ia",       label: "IA",       icon: Brain },
];

const TAG_COLORS: Record<string, string> = {
  "Novo":       "#6B7280",
  "Qualificado":"#3B82F6",
  "Proposta":   "#F59E0B",
  "Negociação": "#7C3AED",
  "Fechado":    "#22C55E",
};

function WhatsAppMockup() {
  const contacts = [
    { name: "João Silva",   preview: "Tenho interesse",          time: "14:32", badge: "2", tag: "Qualificado" },
    { name: "Maria Santos", preview: "Quando posso agendar?",    time: "13:15", badge: "",  tag: "Proposta" },
    { name: "Pedro Alves",  preview: "Qual o valor mensal?",     time: "12:08", badge: "1", tag: "Novo" },
    { name: "Ana Costa",    preview: "Vou pensar e retorno",     time: "11:30", badge: "",  tag: "Negociação" },
  ];
  const msgs = [
    { from: "user", text: "Olá! Vi o anúncio de vocês no Instagram" },
    { from: "ai",   text: "Olá! Que bom falar com você 😊 Sou a assistente virtual. Como posso ajudar?" },
    { from: "user", text: "Quero saber mais sobre os planos" },
    { from: "ai",   text: "Claro! Temos 3 opções a partir de R$ 297/mês. Posso enviar detalhes ou agendar uma demonstração?" },
  ];
  return (
    <div className="flex h-full">
      {/* Contacts */}
      <div className="w-48 flex-shrink-0" style={{ borderRight: "1px solid #F3F4F6" }}>
        <div className="px-3 py-2" style={{ borderBottom: "1px solid #F3F4F6" }}>
          <span className="text-[10px] font-bold tracking-wider" style={{ color: "#9CA3AF" }}>CONVERSAS</span>
        </div>
        {contacts.map((c) => {
          const col = TAG_COLORS[c.tag] || "#6B7280";
          const active = c.name === "João Silva";
          return (
            <div key={c.name} className="flex items-start gap-2 px-3 py-2.5 cursor-pointer"
              style={{ borderBottom: "1px solid #F9FAFB", background: active ? "#F5F3FF" : undefined }}>
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: col }}>
                {c.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] font-semibold truncate" style={{ color: "#111827" }}>{c.name}</span>
                  <span className="text-[9px] ml-1 flex-shrink-0" style={{ color: "#9CA3AF" }}>{c.time}</span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] truncate" style={{ color: "#9CA3AF" }}>{c.preview}</span>
                  {c.badge && (
                    <span className="w-4 h-4 rounded-full bg-green-500 flex-shrink-0 flex items-center justify-center text-[8px] text-white font-bold">{c.badge}</span>
                  )}
                </div>
                <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-semibold"
                  style={{ background: `${col}18`, color: col }}>{c.tag}</span>
              </div>
            </div>
          );
        })}
      </div>
      {/* Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-2.5 px-4 py-2.5" style={{ borderBottom: "1px solid #F3F4F6" }}>
          <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-[10px] font-bold text-white">J</div>
          <div className="flex-1">
            <div className="text-[12px] font-semibold" style={{ color: "#111827" }}>João Silva</div>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[9px]" style={{ color: "#9CA3AF" }}>IA ativa · respondendo</span>
            </div>
          </div>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#F5F3FF", color: "#7C3AED" }}>Qualificado</span>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[78%] px-3 py-2 rounded-2xl text-[11px] leading-relaxed`}
                style={{
                  background: m.from === "user" ? "#1F2937" : "#F3F4F6",
                  color: m.from === "user" ? "white" : "#374151",
                  borderBottomRightRadius: m.from === "user" ? 4 : undefined,
                  borderBottomLeftRadius: m.from === "ai" ? 4 : undefined,
                }}>
                {m.text}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center text-[7px] text-white font-black">IA</div>
            <div className="flex gap-1 items-center">
              {[0, 150, 300].map(d => (
                <div key={d} className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: "#D1D5DB", animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        </div>
        <div className="px-3 py-2.5" style={{ borderTop: "1px solid #F3F4F6" }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#F9FAFB" }}>
            <span className="flex-1 text-[11px]" style={{ color: "#D1D5DB" }}>Mensagem automática via IA...</span>
            <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M9 5L1 1.5v3L5.5 5 1 6.5V10L9 5z" fill="white"/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CRMMockup() {
  const cols = [
    { label: "Novos",       leads: [{ name: "Carlos M.", val: "R$ 1.200", src: "Instagram" }, { name: "Beatriz L.", val: "R$ 890", src: "WhatsApp" }] },
    { label: "Qualificados",leads: [{ name: "João Silva", val: "R$ 3.500", src: "Google Ads" }] },
    { label: "Proposta",    leads: [{ name: "Maria S.", val: "R$ 5.800", src: "Indicação" }, { name: "Pedro A.", val: "R$ 2.200", src: "Meta Ads" }] },
    { label: "Fechados",    leads: [{ name: "Ana Costa", val: "R$ 4.100", src: "WhatsApp" }] },
  ];
  const colKeys = Object.keys(TAG_COLORS).slice(0, 4);
  const colors = [TAG_COLORS["Novo"], TAG_COLORS["Qualificado"], TAG_COLORS["Proposta"], TAG_COLORS["Fechado"]];
  return (
    <div className="flex gap-3 h-full px-4 py-3 overflow-x-auto">
      {cols.map((col, ci) => (
        <div key={col.label} className="flex-shrink-0 w-[140px]">
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="w-2 h-2 rounded-full" style={{ background: colors[ci] }} />
            <span className="text-[10px] font-bold" style={{ color: "#374151" }}>{col.label}</span>
            <span className="ml-auto text-[9px]" style={{ color: "#9CA3AF" }}>{col.leads.length}</span>
          </div>
          <div className="space-y-2">
            {col.leads.map(lead => (
              <div key={lead.name} className="rounded-xl p-2.5" style={{ background: "white", border: "1px solid #F3F4F6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <div className="w-6 h-6 rounded-full mb-1.5 flex items-center justify-center text-[9px] font-bold text-white"
                  style={{ background: colors[ci] }}>
                  {lead.name[0]}
                </div>
                <div className="text-[10px] font-semibold mb-0.5" style={{ color: "#111827" }}>{lead.name}</div>
                <div className="text-[12px] font-black mb-1.5" style={{ color: "#111827" }}>{lead.val}</div>
                <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: "#F3F4F6", color: "#6B7280" }}>{lead.src}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AgendaMockup() {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex"];
  const apts: Record<string, { name: string; time: string; color: string }[]> = {
    "Seg": [{ name: "João — Demo", time: "09:00", color: "#7C3AED" }],
    "Ter": [{ name: "Maria — Onboard", time: "11:30", color: "#3B82F6" }, { name: "Pedro — Follow", time: "15:00", color: "#F59E0B" }],
    "Qua": [{ name: "Ana — Reunião", time: "10:00", color: "#22C55E" }],
    "Qui": [{ name: "Carlos — Demo", time: "14:30", color: "#7C3AED" }],
    "Sex": [],
  };
  return (
    <div className="flex flex-col h-full px-4 py-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-black" style={{ color: "#111827" }}>Junho 2026</span>
        <div className="flex gap-1">
          <span className="px-2 py-0.5 rounded-lg text-[9px] font-semibold" style={{ background: "#7C3AED", color: "white" }}>Semana</span>
          <span className="px-2 py-0.5 rounded-lg text-[9px] font-semibold" style={{ background: "#F3F4F6", color: "#6B7280" }}>Mês</span>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 flex-1">
        {days.map((d) => (
          <div key={d}>
            <div className={`text-[9px] font-bold text-center mb-2 py-1 rounded-lg`}
              style={d === "Ter" ? { background: "#7C3AED", color: "white" } : { color: "#9CA3AF" }}>
              {d}
            </div>
            <div className="space-y-1.5">
              {(apts[d] || []).map((a) => (
                <div key={a.name} className="rounded-lg p-2 text-[8px] font-semibold leading-tight"
                  style={{ background: `${a.color}15`, color: a.color }}>
                  <div className="font-black mb-0.5">{a.time}</div>
                  {a.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-2" style={{ borderTop: "1px solid #F3F4F6" }}>
        <div className="flex items-center gap-2 text-[9px]" style={{ color: "#9CA3AF" }}>
          <div className="w-2 h-2 rounded-full bg-violet-500" />
          4 reuniões · IA agendou 3 automaticamente
        </div>
      </div>
    </div>
  );
}

function IAMockup() {
  const insights = [
    { label: "Lead quente",  desc: "João Silva abriu a proposta 3×", action: "Ligar agora", color: "#22C55E" },
    { label: "Follow-up",    desc: "5 leads sem resposta há 48h",    action: "Reativar",    color: "#F59E0B" },
    { label: "Oportunidade", desc: "3 leads prontos para proposta",   action: "Enviar proposta", color: "#7C3AED" },
  ];
  return (
    <div className="flex gap-3 h-full px-4 py-3">
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3.5">
          <div className="w-7 h-7 rounded-xl bg-violet-600 flex items-center justify-center">
            <Brain size={14} className="text-white" />
          </div>
          <div>
            <div className="text-[12px] font-black" style={{ color: "#111827" }}>Bom dia, Seven 👋</div>
            <div className="text-[9px]" style={{ color: "#9CA3AF" }}>3 oportunidades identificadas</div>
          </div>
        </div>
        <div className="space-y-2 flex-1">
          {insights.map((ins) => (
            <div key={ins.label} className="flex items-start justify-between gap-2 p-3 rounded-xl"
              style={{ background: "white", border: "1px solid #F3F4F6", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
              <div className="flex-1 min-w-0">
                <div className="text-[9px] font-black mb-0.5" style={{ color: ins.color }}>{ins.label}</div>
                <div className="text-[10px] leading-tight" style={{ color: "#6B7280" }}>{ins.desc}</div>
              </div>
              <span className="flex-shrink-0 text-[9px] font-bold px-2 py-1 rounded-lg"
                style={{ background: `${ins.color}15`, color: ins.color }}>
                {ins.action}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "#F9FAFB" }}>
          <span className="flex-1 text-[10px]" style={{ color: "#D1D5DB" }}>Pergunte algo para a IA...</span>
          <div className="w-5 h-5 rounded-lg bg-violet-600 flex items-center justify-center">
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M8 4.5L0 1.5v3l4.5.5L0 6.5V9L8 4.5z" fill="white"/></svg>
          </div>
        </div>
      </div>
    </div>
  );
}

const TAB_CONTENT: Record<string, React.ReactNode> = {
  whatsapp: <WhatsAppMockup />,
  crm:      <CRMMockup />,
  agenda:   <AgendaMockup />,
  ia:       <IAMockup />,
};

export function ProdutoShowcase() {
  const [activeTab, setActiveTab] = useState("whatsapp");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="produto" ref={ref} className="py-28" style={{ background: "#F8F9FB" }}>
      <div className="max-w-[1280px] mx-auto px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold border"
            style={{ background: "rgba(124,58,237,0.06)", borderColor: "rgba(124,58,237,0.15)", color: "#7C3AED" }}>
            Plataforma
          </div>
          <h2 className="text-[clamp(32px,4.5vw,58px)] font-black tracking-[-3px] leading-none mb-4"
            style={{ color: "#0F0F15" }}>
            Um sistema. Toda a operação.
          </h2>
          <p className="text-[16px] max-w-lg mx-auto" style={{ color: "#6B7280" }}>
            Da primeira mensagem no WhatsApp até o contrato fechado — num único painel.
          </p>
        </motion.div>

        {/* Tab switcher */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.12, ease: EASE }}
          className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl"
            style={{ background: "white", border: "1px solid #E5E7EB", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                  style={{
                    background: active ? "#7C3AED" : "transparent",
                    color: active ? "white" : "#6B7280",
                    boxShadow: active ? "0 4px 14px rgba(124,58,237,0.28)" : "none",
                    transform: active ? "scale(1.02)" : "scale(1)",
                    transition: "all 0.2s ease",
                  }}>
                  <Icon size={14} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Browser window */}
        <motion.div initial={{ opacity: 0, y: 36, scale: 0.96 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.72, delay: 0.22, ease: EASE }}
          className="rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 40px 100px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.06)" }}>

          {/* Title bar */}
          <div className="flex items-center gap-3 px-4 py-2.5" style={{ background: "#FAFAFA", borderBottom: "1px solid #ECECEC" }}>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28CA41" }} />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-1.5 px-4 py-1 rounded-lg text-[11px]"
                style={{ background: "#ECECEC", color: "#6B7280" }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 0.5C2.5 0.5 0.5 2.5 0.5 5s2 4.5 4.5 4.5S9.5 7.5 9.5 5 7.5 0.5 5 0.5z" stroke="#9CA3AF" strokeWidth="1" fill="none"/>
                </svg>
                app.setyvision.com
              </div>
            </div>
          </div>

          {/* App shell */}
          <div className="flex" style={{ height: 420, background: "#FAFAFA" }}>
            {/* Sidebar */}
            <div className="w-12 flex-shrink-0 flex flex-col items-center gap-2.5 py-3"
              style={{ background: "white", borderRight: "1px solid #F3F4F6" }}>
              <div className="w-7 h-7 rounded-xl bg-violet-600 flex items-center justify-center mb-1">
                <span className="text-[9px] font-black text-white">S</span>
              </div>
              {TABS.map((tab, i) => {
                const Icon = tab.icon;
                const active = i === TABS.findIndex((t) => t.id === activeTab);
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                    style={{ background: active ? "#F5F3FF" : "transparent" }}>
                    <Icon size={14} style={{ color: active ? "#7C3AED" : "#9CA3AF" }} />
                  </button>
                );
              })}
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-hidden relative" style={{ background: "#F8F9FB" }}>
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.18 }}
                  className="absolute inset-0">
                  {TAB_CONTENT[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
