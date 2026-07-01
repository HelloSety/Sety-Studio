"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Pause, Plus, Zap, MessageSquare, Clock, GitBranch,
  ChevronRight, Settings, ToggleLeft, ToggleRight, Bot, Send, Tag
} from "lucide-react";
import { mockAutomations } from "@/lib/mock-data";
import Header from "@/components/layout/header";
import { cn } from "@/lib/utils";

const TRIGGER_ICONS: Record<string, React.ElementType> = {
  message_received: MessageSquare,
  score_threshold: Zap,
  time_elapsed: Clock,
  tag_added: Tag,
};

const ACTION_ICONS: Record<string, React.ElementType> = {
  send_message: Send,
  assign_tag: Tag,
  update_score: Zap,
  notify_human: Bot,
};

export default function AutomacoesPage() {
  const [automations, setAutomations] = useState(mockAutomations);
  const [selected, setSelected] = useState(mockAutomations[0]);

  const toggle = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Automações" subtitle="Fluxos inteligentes para qualificar e nutrir leads" />

      <div className="flex flex-1 overflow-hidden p-6 gap-6">
        {/* Automations list */}
        <div className="w-[320px] shrink-0 space-y-3">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#8B3FFF]/15 hover:bg-[#8B3FFF]/25 border border-[#8B3FFF]/30 border-dashed rounded-xl text-[#A066FF] text-sm font-medium transition-all">
            <Plus className="w-4 h-4" />
            Nova Automação
          </button>

          {automations.map((auto) => {
            const TriggerIcon = TRIGGER_ICONS[auto.trigger] ?? Zap;
            const isSelected = selected?.id === auto.id;
            return (
              <motion.div
                key={auto.id}
                onClick={() => setSelected(auto)}
                whileHover={{ x: 1 }}
                className={cn(
                  "glass-card p-4 cursor-pointer transition-all",
                  isSelected ? "border-[#8B3FFF]/40 bg-[#8B3FFF]/05" : "hover:border-white/[0.14]"
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center",
                      auto.active ? "bg-[#8B3FFF]/20 border border-[#8B3FFF]/30" : "bg-white/[0.05] border border-white/[0.08]"
                    )}>
                      <TriggerIcon className={cn("w-3.5 h-3.5", auto.active ? "text-[#8B3FFF]" : "text-slate-500")} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-white">{auto.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggle(auto.id); }}
                    className="shrink-0"
                  >
                    {auto.active
                      ? <ToggleRight className="w-5 h-5 text-[#8B3FFF]" />
                      : <ToggleLeft className="w-5 h-5 text-slate-600" />}
                  </button>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
                    auto.active ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-700/40 text-slate-500"
                  )}>
                    {auto.active ? "Ativo" : "Pausado"}
                  </span>
                  <span>{auto.runs_count ?? 0} execuções</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Flow canvas */}
        {selected && (
          <AnimatePresence mode="wait">
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="flex-1 glass-card overflow-hidden flex flex-col"
            >
              {/* Flow header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
                <div>
                  <h3 className="text-sm font-semibold text-white">{selected.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Trigger: <span className="text-slate-300">{selected.trigger.replace("_", " ")}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-ghost py-1.5 px-3 text-xs border border-white/[0.08]">
                    <Settings className="w-3.5 h-3.5" />
                    Configurar
                  </button>
                  <button
                    onClick={() => toggle(selected.id)}
                    className={cn(
                      "py-1.5 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all",
                      selected.active
                        ? "bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25"
                        : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25"
                    )}
                  >
                    {selected.active ? <><Pause className="w-3.5 h-3.5" /> Pausar</> : <><Play className="w-3.5 h-3.5" /> Ativar</>}
                  </button>
                </div>
              </div>

              {/* Flow nodes */}
              <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center gap-0">
                {/* Trigger node */}
                <div className="w-64">
                  <div className="bg-[#8B3FFF]/15 border border-[#8B3FFF]/40 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-[#8B3FFF]" />
                      <span className="text-[11px] font-semibold text-[#A066FF] uppercase tracking-wider">Gatilho</span>
                    </div>
                    <p className="text-[13px] text-white font-medium">{selected.trigger.replace(/_/g, " ")}</p>
                  </div>
                  <div className="flex justify-center my-1">
                    <div className="w-px h-6 bg-white/[0.1]" />
                  </div>
                  <div className="flex justify-center">
                    <ChevronRight className="w-4 h-4 text-slate-600 rotate-90" />
                  </div>
                </div>

                {/* Action nodes */}
                {selected.actions.map((action, i) => {
                  const ActionIcon = ACTION_ICONS[action.type] ?? Send;
                  return (
                    <div key={i} className="w-64">
                      <div className="flex justify-center mb-1">
                        <div className="w-px h-4 bg-white/[0.1]" />
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-4 hover:border-white/[0.15] transition-all"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-6 h-6 bg-[#06B6D4]/15 border border-[#06B6D4]/30 rounded-lg flex items-center justify-center">
                            <ActionIcon className="w-3 h-3 text-[#06B6D4]" />
                          </div>
                          <span className="text-[10px] font-semibold text-[#06B6D4] uppercase tracking-wider">Ação {i + 1}</span>
                        </div>
                        <p className="text-[13px] text-white">{action.type.replace(/_/g, " ")}</p>
                        {action.config?.message && typeof action.config.message === "string" && (
                          <p className="text-[11px] text-slate-500 mt-1 italic">"{action.config.message.slice(0, 60)}..."</p>
                        )}
                      </motion.div>
                      {i < selected.actions.length - 1 && (
                        <>
                          <div className="flex justify-center my-1"><div className="w-px h-4 bg-white/[0.1]" /></div>
                          <div className="flex justify-center"><ChevronRight className="w-4 h-4 text-slate-600 rotate-90" /></div>
                        </>
                      )}
                    </div>
                  );
                })}

                {/* Add action button */}
                <div className="w-64 mt-4">
                  <div className="flex justify-center mb-2"><div className="w-px h-4 bg-white/[0.1]" /></div>
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-dashed border-white/[0.12] rounded-xl text-slate-500 hover:text-slate-300 text-[12px] transition-all">
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar Ação
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
