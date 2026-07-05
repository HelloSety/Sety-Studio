"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, X, FileText, MessageSquare, User,
  TrendingUp, AlertTriangle, Lightbulb, ChevronRight, Send
} from "lucide-react";

const actions = [
  { icon: FileText,      label: "Resumir conversa",     desc: "Síntese do que o lead falou" },
  { icon: MessageSquare, label: "Gerar Follow-Up",       desc: "Mensagem ideal para reengajar" },
  { icon: Send,          label: "Responder Cliente",     desc: "Rascunho de resposta contextual" },
  { icon: User,          label: "Analisar Lead",         desc: "Perfil, intenção e estágio" },
  { icon: AlertTriangle, label: "Detectar Objeções",     desc: "Identifica bloqueios de compra" },
  { icon: Lightbulb,     label: "Gerar Insights",        desc: "Oportunidades e próximos passos" },
];

export default function AuroraFloat() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-[320px] rounded-2xl border border-white/[0.06] overflow-hidden"
            style={{
              background: "rgba(15,15,18,0.96)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05]">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">Aurora IA</p>
                  <p className="text-[10px] text-[#52525B]">Assistente de vendas</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-[#52525B] hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Actions */}
            <div className="p-2">
              {actions.map((action, i) => (
                <motion.button
                  key={action.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/[0.05] transition-all group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#7C3AED]/12 border border-[#7C3AED]/20 flex items-center justify-center shrink-0 group-hover:bg-[#7C3AED]/20 transition-all">
                    <action.icon className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-white">{action.label}</p>
                    <p className="text-[10px] text-[#52525B]">{action.desc}</p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[#3F3F46] group-hover:text-[#A1A1AA] shrink-0 transition-colors" />
                </motion.button>
              ))}
            </div>

            {/* Input */}
            <div className="px-3 pb-3">
              <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2.5">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pergunte algo sobre este lead..."
                  className="flex-1 bg-transparent text-[12px] text-white placeholder:text-[#3F3F46] outline-none"
                />
                <button className="w-6 h-6 rounded-lg bg-[#7C3AED] flex items-center justify-center shrink-0 hover:bg-[#6D28D9] transition-all">
                  <Send className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        animate={open ? {} : { boxShadow: ["0 0 20px rgba(124,58,237,0.3)", "0 0 40px rgba(124,58,237,0.5)", "0 0 20px rgba(124,58,237,0.3)"] }}
        transition={open ? {} : { duration: 2, repeat: Infinity }}
        className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center"
        style={{ boxShadow: "0 8px 32px rgba(124,58,237,0.4), 0 0 0 1px rgba(124,58,237,0.3)" }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="w-5 h-5 text-white" />
            </motion.span>
          ) : (
            <motion.span key="spark" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <Sparkles className="w-5 h-5 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
