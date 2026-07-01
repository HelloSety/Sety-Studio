"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search, LayoutDashboard, Users, TrendingUp, MessageSquare, BarChart3,
  Globe, Zap, Calendar, FileText, CreditCard, Settings, Bell, Brain,
  UserCheck, PieChart, Link, GraduationCap, Target, X, ArrowRight,
  Plus, RefreshCw, Download
} from "lucide-react";

const pages = [
  { icon: LayoutDashboard, label: "Painel Geral", href: "/painel", group: "Navegação" },
  { icon: Users,           label: "CRM / Clientes", href: "/crm", group: "Navegação" },
  { icon: TrendingUp,      label: "Pipeline", href: "/pipeline", group: "Navegação" },
  { icon: MessageSquare,   label: "WhatsApp", href: "/whatsapp", group: "Navegação" },
  { icon: BarChart3,       label: "Campanhas", href: "/campanhas", group: "Navegação" },
  { icon: Globe,           label: "Landing Pages", href: "/landing-pages", group: "Navegação" },
  { icon: Zap,             label: "Automações", href: "/automacoes", group: "Navegação" },
  { icon: Calendar,        label: "Agenda", href: "/agenda", group: "Navegação" },
  { icon: FileText,        label: "Propostas", href: "/propostas", group: "Navegação" },
  { icon: CreditCard,      label: "Financeiro", href: "/financeiro", group: "Navegação" },
  { icon: Bell,            label: "Notificações", href: "/notificacoes", group: "Navegação" },
  { icon: Brain,           label: "IA Assistant", href: "/ia", group: "Navegação" },
  { icon: PieChart,        label: "Relatórios", href: "/relatorios", group: "Navegação" },
  { icon: UserCheck,       label: "Equipe", href: "/equipe", group: "Navegação" },
  { icon: Link,            label: "Integrações", href: "/integracoes", group: "Navegação" },
  { icon: GraduationCap,   label: "Academia", href: "/academia", group: "Navegação" },
  { icon: Target,          label: "Plano de Marketing", href: "/plano-marketing", group: "Navegação" },
  { icon: Settings,        label: "Configurações", href: "/configuracoes", group: "Navegação" },
];

const actions = [
  { icon: Plus,       label: "Criar novo lead", group: "Ações", href: "/crm" },
  { icon: RefreshCw,  label: "Sincronizar integrações", group: "Ações", href: "/integracoes" },
  { icon: Download,   label: "Exportar relatório", group: "Ações", href: "/relatorios" },
  { icon: Brain,      label: "Ativar IA Assistant", group: "Ações", href: "/ia" },
];

const allItems = [...pages, ...actions];

type Item = typeof allItems[0];

let _open: (() => void) | null = null;
export function openCommandPalette() { _open?.(); }

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  _open = () => setOpen(true);

  const filtered = query.trim()
    ? allItems.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : allItems.slice(0, 12);

  const grouped = filtered.reduce<Record<string, Item[]>>((acc, item) => {
    acc[item.group] = [...(acc[item.group] ?? []), item];
    return acc;
  }, {});

  const flat = Object.values(grouped).flat();

  const go = useCallback((item: Item) => {
    setOpen(false);
    setQuery("");
    router.push(item.href);
  }, [router]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setOpen(o => !o); }
      if (!open) return;
      if (e.key === "Escape") { setOpen(false); setQuery(""); }
      if (e.key === "ArrowDown") { e.preventDefault(); setCursor(c => Math.min(c + 1, flat.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
      if (e.key === "Enter" && flat[cursor]) go(flat[cursor]);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [open, flat, cursor, go]);

  useEffect(() => { if (open) { setTimeout(() => inputRef.current?.focus(), 50); setCursor(0); } }, [open]);
  useEffect(() => { setCursor(0); }, [query]);

  let globalIdx = 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => { setOpen(false); setQuery(""); }} />

          <motion.div
            className="fixed z-50 left-1/2 top-[20%] w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl shadow-2xl"
            style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(124,58,237,0.2)" }}
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
              <Search size={16} className="text-[#6B7280] shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar páginas, ações..."
                className="flex-1 bg-transparent text-[14px] text-white placeholder-[#4B5563] outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")} className="text-[#4B5563] hover:text-white transition-colors">
                  <X size={13} />
                </button>
              )}
              <kbd className="text-[10px] text-[#4B5563] border border-white/[0.08] rounded px-1.5 py-0.5 shrink-0">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[420px] overflow-y-auto py-2">
              {flat.length === 0 ? (
                <div className="py-12 text-center text-[13px] text-[#4B5563]">
                  Nenhum resultado para &ldquo;{query}&rdquo;
                </div>
              ) : (
                Object.entries(grouped).map(([group, items]) => (
                  <div key={group}>
                    <div className="px-4 py-1.5 text-[10px] font-semibold text-[#4B5563] uppercase tracking-[0.1em]">
                      {group}
                    </div>
                    {items.map(item => {
                      const idx = globalIdx++;
                      const isActive = idx === cursor;
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors group"
                          style={{ background: isActive ? "rgba(124,58,237,0.12)" : "transparent" }}
                          onMouseEnter={() => setCursor(idx)}
                          onClick={() => go(item)}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: isActive ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.04)" }}>
                            <Icon size={13} style={{ color: isActive ? "#A78BFA" : "#6B7280" }} />
                          </div>
                          <span className="flex-1 text-[13px] font-medium" style={{ color: isActive ? "#fff" : "#9CA3AF" }}>
                            {item.label}
                          </span>
                          {isActive && <ArrowRight size={12} className="text-[#A78BFA] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-white/[0.06] text-[10px] text-[#4B5563]">
              <span className="flex items-center gap-1"><kbd className="border border-white/[0.08] rounded px-1">↑↓</kbd> navegar</span>
              <span className="flex items-center gap-1"><kbd className="border border-white/[0.08] rounded px-1">↵</kbd> abrir</span>
              <span className="flex items-center gap-1"><kbd className="border border-white/[0.08] rounded px-1">Esc</kbd> fechar</span>
              <span className="ml-auto">Sety Vision</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
