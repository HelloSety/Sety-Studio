"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Send, Phone, MoreVertical, Bot, UserCheck,
  MapPin, Calendar, Paperclip, Smile, ChevronRight,
  Sparkles, Star, Filter
} from "lucide-react";
import { mockLeads, mockMessages } from "@/lib/mock-data";
import { timeAgo, scoreToLabel, cn } from "@/lib/utils";
import type { Lead } from "@/types";
import Header from "@/components/layout/header";

// ── Score ring SVG ────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const progress = (score / 100) * circ;
  const color = score >= 70 ? "#22C55E" : score >= 40 ? "#F59E0B" : "#3F3F46";
  return (
    <svg width="72" height="72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
      <circle
        cx="36" cy="36" r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={`${progress} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
        style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
      />
      <text x="36" y="36" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="13" fontWeight="700">
        {score}
      </text>
    </svg>
  );
}

const TABS = ["Todos", "Quentes", "IA", "Humano"];

export default function ConversasPage() {
  const [selected, setSelected] = useState<Lead>(mockLeads[0]);
  const [input, setInput] = useState("");
  const [tab, setTab] = useState("Todos");
  const messages = mockMessages.filter((m) => m.lead_id === selected.id);
  const score = scoreToLabel(selected.score);

  const filtered = mockLeads.filter((l) => {
    if (tab === "Quentes") return l.temperature === "hot";
    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Conversas" subtitle={`${mockLeads.length} contatos ativos`} />

      <div className="flex flex-1 overflow-hidden">
        {/* ── Contact list ──────────────────────────────────────────────────── */}
        <aside className="w-[272px] shrink-0 border-r border-white/[0.04] flex flex-col overflow-hidden bg-[#0F0F12]">
          {/* Search */}
          <div className="p-3 border-b border-white/[0.04]">
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.04] rounded-xl px-3 py-2">
              <Search className="w-3.5 h-3.5 text-[#3F3F46] shrink-0" />
              <input
                placeholder="Buscar contato..."
                className="bg-transparent text-[12px] text-white placeholder:text-[#3F3F46] flex-1 outline-none"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-white/[0.04] overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all",
                  tab === t ? "bg-[#7C3AED]/15 text-[#8B5CF6]" : "text-[#3F3F46] hover:text-[#A1A1AA]"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Contacts */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/[0.03]">
            {filtered.map((lead) => {
              const s = scoreToLabel(lead.score);
              const active = selected.id === lead.id;
              return (
                <motion.div
                  key={lead.id}
                  onClick={() => setSelected(lead)}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                  className={cn(
                    "flex items-start gap-3 p-3.5 cursor-pointer transition-all relative",
                    active && "bg-white/[0.04]"
                  )}
                >
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#7C3AED] rounded-r-full" />
                  )}

                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7C3AED]/40 to-[#8B5CF6]/40 flex items-center justify-center text-[13px] font-semibold text-white">
                      {lead.name[0]}
                    </div>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0F0F12]",
                      lead.temperature === "hot" ? "bg-red-400" :
                      lead.temperature === "warm" ? "bg-orange-400" : "bg-[#3F3F46]"
                    )} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-[13px] font-medium text-white truncate">{lead.name}</p>
                      <span className="text-[10px] text-[#3F3F46] shrink-0 ml-1">
                        {lead.last_message_at ? timeAgo(lead.last_message_at) : ""}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#52525B] truncate">{lead.last_message}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[10px] font-semibold ${s.color}`}>{lead.score}</span>
                      <span className="text-[10px] text-[#3F3F46]">·</span>
                      {lead.tags.slice(0, 1).map((t) => (
                        <span key={t} className="text-[10px] bg-white/[0.04] text-[#52525B] px-1.5 py-0.5 rounded-md">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {(lead.unread ?? 0) > 0 && (
                    <span className="shrink-0 w-4 h-4 bg-[#7C3AED] rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                      {lead.unread}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </aside>

        {/* ── Chat ─────────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat top bar */}
          <div className="h-14 border-b border-white/[0.04] flex items-center justify-between px-4 shrink-0 bg-[#09090B]/80 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED]/40 to-[#8B5CF6]/40 flex items-center justify-center text-sm font-semibold text-white">
                {selected.name[0]}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">{selected.name}</p>
                <p className="text-[11px] text-[#52525B]">{selected.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#8B5CF6] text-[12px] font-medium hover:bg-[#7C3AED]/20 transition-all">
                <UserCheck className="w-3.5 h-3.5" />
                Assumir
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl text-[#3F3F46] hover:text-[#A1A1AA] hover:bg-white/[0.04] transition-all">
                <Phone className="w-[15px] h-[15px]" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl text-[#3F3F46] hover:text-[#A1A1AA] hover:bg-white/[0.04] transition-all">
                <MoreVertical className="w-[15px] h-[15px]" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-[#3F3F46]">
                <MessageBubblePlaceholder />
                <p className="text-[13px] mt-3">Sem mensagens ainda</p>
              </div>
            )}
            {messages.map((msg) => {
              const isClient = msg.role === "client";
              const isAurora = msg.role === "aurora";
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-2.5", isClient ? "justify-start" : "justify-end")}
                >
                  {isClient && (
                    <div className="w-6 h-6 rounded-full bg-[#1A1A21] flex items-center justify-center shrink-0 mt-auto">
                      <span className="text-[10px] font-bold text-[#A1A1AA]">{selected.name[0]}</span>
                    </div>
                  )}

                  <div className={cn(
                    "max-w-[68%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed",
                    isClient
                      ? "bg-[#131318] text-white rounded-bl-sm border border-white/[0.04]"
                      : isAurora
                        ? "bg-[#7C3AED]/15 border border-[#7C3AED]/20 text-white rounded-br-sm"
                        : "bg-[#25D366]/10 border border-[#25D366]/20 text-white rounded-br-sm"
                  )}>
                    {isAurora && (
                      <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-white/[0.06]">
                        <Bot className="w-3 h-3 text-[#8B5CF6]" />
                        <span className="text-[10px] font-semibold text-[#8B5CF6]">Lucas · Aurora IA</span>
                      </div>
                    )}
                    {msg.content}
                    <p className="text-[9px] text-[#3F3F46] mt-1.5 text-right">{timeAgo(msg.timestamp)}</p>
                  </div>

                  {!isClient && (
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-auto",
                      isAurora ? "bg-[#7C3AED]/20" : "bg-[#25D366]/20"
                    )}>
                      {isAurora
                        ? <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
                        : <UserCheck className="w-3 h-3 text-[#25D366]" />}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Input */}
          <div className="border-t border-white/[0.04] p-4 shrink-0">
            <div className="flex items-end gap-2">
              <button className="text-[#3F3F46] hover:text-[#52525B] transition-colors mb-2">
                <Paperclip className="w-[15px] h-[15px]" />
              </button>
              <div className="flex-1 bg-[#131318] border border-white/[0.06] rounded-2xl px-4 py-3 focus-within:border-[#7C3AED]/30 transition-all">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escrever mensagem..."
                  rows={1}
                  className="w-full bg-transparent text-[13px] text-white placeholder:text-[#3F3F46] outline-none resize-none"
                />
              </div>
              <button className="text-[#3F3F46] hover:text-[#52525B] transition-colors mb-2">
                <Smile className="w-[15px] h-[15px]" />
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 bg-[#7C3AED] rounded-xl flex items-center justify-center shrink-0"
                style={{ boxShadow: "0 4px 16px rgba(124,58,237,0.35)" }}
              >
                <Send className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* ── Lead panel ───────────────────────────────────────────────────── */}
        <aside className="w-[248px] shrink-0 border-l border-white/[0.04] overflow-y-auto bg-[#0F0F12]">
          {/* Score section */}
          <div className="p-5 border-b border-white/[0.04] flex flex-col items-center text-center">
            <ScoreRing score={selected.score} />
            <p className="text-[14px] font-semibold text-white mt-3">{selected.name}</p>
            <p className="text-[11px] text-[#52525B]">{selected.phone}</p>
            <div className="mt-2.5">
              <span className={cn(
                "text-[11px] font-semibold px-2.5 py-1 rounded-full",
                selected.temperature === "hot"
                  ? "bg-red-500/10 text-red-400 border border-red-500/15"
                  : selected.temperature === "warm"
                    ? "bg-orange-500/10 text-orange-400 border border-orange-500/15"
                    : "bg-[#1A1A21] text-[#52525B] border border-white/[0.05]"
              )}>
                {score.emoji} {score.label}
              </span>
            </div>
          </div>

          {/* Probabilidade */}
          <div className="p-4 border-b border-white/[0.04]">
            <p className="text-[10px] font-semibold text-[#3F3F46] uppercase tracking-widest mb-3">Análise IA</p>
            {[
              { label: "Prob. Fechamento", value: selected.score, color: "#22C55E" },
              { label: "Confiança Lucas", value: 92, color: "#7C3AED" },
              { label: "Intenção de Compra", value: Math.max(0, selected.score - 8), color: "#8B5CF6" },
            ].map((item) => (
              <div key={item.label} className="mb-2.5">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-[#52525B]">{item.label}</span>
                  <span className="text-white font-semibold">{item.value}%</span>
                </div>
                <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${item.color}80, ${item.color})`,
                      boxShadow: `0 0 6px ${item.color}40`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="p-4 border-b border-white/[0.04] space-y-2.5">
            <p className="text-[10px] font-semibold text-[#3F3F46] uppercase tracking-widest">Informações</p>
            {[
              { icon: MapPin, label: "Cidade", value: selected.city || "N/A" },
              { icon: Star, label: "Origem", value: selected.origin || "N/A" },
              { icon: Calendar, label: "Entrada", value: new Date(selected.created_at).toLocaleDateString("pt-BR") },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <item.icon className="w-3.5 h-3.5 text-[#3F3F46] shrink-0" />
                <div>
                  <p className="text-[10px] text-[#3F3F46]">{item.label}</p>
                  <p className="text-[12px] text-[#A1A1AA]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tags */}
          {selected.tags.length > 0 && (
            <div className="p-4 border-b border-white/[0.04]">
              <p className="text-[10px] font-semibold text-[#3F3F46] uppercase tracking-widest mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.map((t) => (
                  <span key={t} className="tag-purple">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Next action */}
          <div className="p-4">
            <p className="text-[10px] font-semibold text-[#3F3F46] uppercase tracking-widest mb-2.5">Próxima Ação</p>
            <div className="bg-[#7C3AED]/08 border border-[#7C3AED]/15 rounded-xl p-3">
              <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
                Enviar proposta de Shopify Pro com parcelamento em 3x.
              </p>
              <button className="mt-2 flex items-center gap-1 text-[11px] text-[#7C3AED] hover:text-[#8B5CF6] transition-colors font-medium">
                Executar <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MessageBubblePlaceholder() {
  return (
    <div className="flex flex-col items-center gap-2 opacity-20">
      <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center">
        <MessageSquare className="w-5 h-5 text-white" />
      </div>
    </div>
  );
}

// Need to import MessageSquare below since it was not imported above
function MessageSquare({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
    </svg>
  );
}
