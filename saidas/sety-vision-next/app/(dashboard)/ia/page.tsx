"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { motion } from "framer-motion";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import {
  MessageSquare, ShoppingCart, CalendarDays, TrendingUp,
  Users, Zap, Bot, Send
} from "lucide-react";

/* ── Priority panel data ──────────────────────────────────── */
const opportunities = [
  { emoji: "💬", text: "12 clientes aguardam resposta no WhatsApp",  action: "Abrir WhatsApp",   href: "/whatsapp",  color: "#22C55E" },
  { emoji: "🛒", text: "4 propostas enviadas sem resposta há +48h",   action: "Ver propostas",    href: "/crm",       color: "#F59E0B" },
  { emoji: "📅", text: "2 reuniões confirmadas para hoje",            action: "Abrir agenda",     href: "/agenda",    color: "#3B82F6" },
];

const insights = [
  { icon: TrendingUp, text: "Campanhas do Instagram performando 2× melhor que Facebook esta semana", color: "#A78BFA" },
  { icon: Users,      text: "Ricardo Pires abriu a proposta 3× mas não respondeu — momento ideal para ligar", color: "#F59E0B" },
  { icon: Zap,        text: "Melhor horário de resposta dos seus leads: 14h–17h", color: "#3B82F6" },
];

const automations = [
  { icon: MessageSquare, label: "WhatsApp ativo",       status: "284 msgs hoje",   on: true  },
  { icon: Bot,           label: "Qualificação de leads", status: "12 qualificados", on: true  },
  { icon: ShoppingCart,  label: "Follow-up automático", status: "Pausado",         on: false },
  { icon: CalendarDays,  label: "Agendamento IA",       status: "Ativo",           on: true  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45, ease: EASE } }),
};

export default function IAPage() {
  const [toggles, setToggles] = useState(automations.map(a => a.on));
  const [input, setInput] = useState("");
  const [sent, setSent] = useState(false);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  const handleAsk = () => {
    if (!input.trim()) return;
    setSent(true);
    setInput("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <>
      <Topbar title="IA" subtitle="Assistente inteligente do seu negócio" />

      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-4 max-w-[960px]">

        {/* ── Greeting + opportunities ── */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="rounded-2xl p-6"
          style={{ background: "#0C0C12", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[rgba(124,58,237,0.15)] border border-[rgba(124,58,237,0.2)] flex items-center justify-center">
              <Bot size={18} className="text-[#A78BFA]" />
            </div>
            <div>
              <div className="text-[15px] font-bold">{greeting}, Seven 👋</div>
              <div className="text-[12px] text-[#52525B] mt-0.5">Encontrei {opportunities.length} oportunidades para hoje</div>
            </div>
          </div>

          <div className="space-y-2.5">
            {opportunities.map((op, i) => (
              <motion.div key={op.text} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible"
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-[20px] shrink-0">{op.emoji}</span>
                <span className="flex-1 text-[13px] text-[#D1D5DB]">{op.text}</span>
                <a href={op.href}
                  className="shrink-0 text-[12px] font-semibold px-4 py-2 rounded-xl no-underline transition-all hover:opacity-90"
                  style={{ background: `${op.color}15`, color: op.color, border: `1px solid ${op.color}25` }}>
                  {op.action}
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Ask IA ── */}
        <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
          className="rounded-2xl p-5"
          style={{ background: "#0C0C12", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="text-[12px] font-semibold text-[#52525B] mb-3 uppercase tracking-wider">Pergunte à IA</div>
          <div className="flex items-center gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleAsk()}
              placeholder="Ex: Quais leads tenho maior chance de fechar esta semana?"
              className="flex-1 bg-[#111116] border border-white/[0.07] rounded-xl px-4 py-3 text-[13px] text-white placeholder-[#374151] outline-none focus:border-[rgba(124,58,237,0.4)] transition-colors"
            />
            <button onClick={handleAsk}
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all hover:opacity-90"
              style={{ background: input.trim() ? "#7C3AED" : "rgba(255,255,255,0.05)" }}>
              <Send size={14} className={input.trim() ? "text-white" : "text-[#374151]"} />
            </button>
          </div>
          {sent && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-[12px] text-[#A78BFA] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A78BFA] animate-pulse" />
              IA processando sua pergunta...
            </motion.div>
          )}
        </motion.div>

        {/* ── 2-col: insights + automations ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Insights */}
          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible"
            className="rounded-2xl p-5"
            style={{ background: "#0C0C12", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="text-[13px] font-bold mb-4">Insights da semana</div>
            <div className="space-y-4">
              {insights.map((ins) => {
                const Icon = ins.icon;
                return (
                  <div key={ins.text} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${ins.color}12` }}>
                      <Icon size={13} style={{ color: ins.color }} />
                    </div>
                    <p className="text-[12px] text-[#9CA3AF] leading-[1.6]">{ins.text}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Automations toggle */}
          <motion.div custom={6} variants={fadeUp} initial="hidden" animate="visible"
            className="rounded-2xl p-5"
            style={{ background: "#0C0C12", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="text-[13px] font-bold mb-4">Automações ativas</div>
            <div className="space-y-3">
              {automations.map((auto, i) => {
                const Icon = auto.icon;
                return (
                  <div key={auto.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: toggles[i] ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.04)" }}>
                        <Icon size={13} style={{ color: toggles[i] ? "#22C55E" : "#52525B" }} />
                      </div>
                      <div>
                        <div className="text-[12px] font-medium">{auto.label}</div>
                        <div className="text-[10px] text-[#52525B]">{toggles[i] ? auto.status : "Pausado"}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setToggles(prev => prev.map((v, j) => j === i ? !v : v))}
                      className="relative w-9 h-5 rounded-full transition-all duration-200"
                      style={{ background: toggles[i] ? "#7C3AED" : "rgba(255,255,255,0.08)" }}>
                      <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200"
                        style={{ left: toggles[i] ? "calc(100% - 18px)" : "2px" }} />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

      </main>
    </>
  );
}
