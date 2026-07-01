"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/motion";
import {
  LayoutDashboard, MessageSquare, Users, CalendarDays,
  Brain, BarChart3, Settings, ChevronRight, LogOut,
  Zap, GitFork, TrendingUp, Plug,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { icon: LayoutDashboard, label: "Dashboard",   href: "/painel" },
  { icon: MessageSquare,   label: "WhatsApp",    href: "/whatsapp" },
  { icon: Users,           label: "CRM",         href: "/crm" },
  { icon: CalendarDays,    label: "Agenda",      href: "/agenda" },
  { icon: GitFork,         label: "Pipeline",    href: "/pipeline" },
  { icon: TrendingUp,      label: "Leads",       href: "/leads" },
  { icon: Zap,             label: "Automações",  href: "/automacoes" },
  { icon: Brain,           label: "IA",          href: "/ia" },
  { icon: Plug,            label: "Integrações", href: "/integracoes" },
  { icon: BarChart3,       label: "Relatórios",  href: "/relatorios" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname  = usePathname();

  return (
    /*
     * Wrapper sem overflow — permite que o botão de toggle flutue
     * sobre a borda sem ser clipado pelo aside.
     */
    <div style={{ position: "relative", display: "flex", flexShrink: 0, height: "100%" }}>

      {/* ── Aside — overflow:hidden apenas aqui ── */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.28, ease: EASE }}
        className="flex flex-col h-full bg-[#060609] border-r border-white/[0.05] overflow-hidden"
      >
        {/* Logo */}
        <div className="flex items-center h-16 px-4 border-b border-white/[0.05] flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#7C3AED] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <div className="text-[12px] font-black text-white whitespace-nowrap tracking-wide">
                    SETY VISION
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 pt-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {nav.map((item) => {
            const Icon    = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === "/crm" && pathname === "/pipeline");
            return (
              <a
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 no-underline group w-full",
                  isActive
                    ? "bg-white/[0.07] text-white"
                    : "text-[#52525B] hover:text-white hover:bg-white/[0.03]"
                )}
              >
                {isActive && (
                  <div
                    style={{ width: 3, height: 20, zIndex: 1 }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#7C3AED] rounded-r-full"
                  />
                )}
                <Icon size={15} className="flex-shrink-0" />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-[13px] font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-3 py-1.5 px-3 rounded-lg bg-[#111114] border border-white/[0.08] text-[12px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                    {item.label}
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/[0.05] px-2 py-3 space-y-0.5 flex-shrink-0">
          <a
            href="/configuracoes"
            title={collapsed ? "Configurações" : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all no-underline group",
              pathname === "/configuracoes"
                ? "bg-white/[0.07] text-white"
                : "text-[#52525B] hover:text-white hover:bg-white/[0.03]"
            )}
          >
            <Settings size={15} className="flex-shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-[13px] font-medium whitespace-nowrap overflow-hidden"
                >
                  Configurações
                </motion.span>
              )}
            </AnimatePresence>
          </a>

          {/* User row */}
          <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
              S
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden flex-1 min-w-0"
                >
                  <div className="text-[12px] font-semibold text-white whitespace-nowrap">Seven</div>
                </motion.div>
              )}
            </AnimatePresence>
            {!collapsed && (
              <button className="text-[#52525B] hover:text-white ml-auto flex-shrink-0 transition-colors">
                <LogOut size={13} />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* ── Toggle button ─────────────────────────────────────────
          Posicionado relativo ao wrapper (fora do aside) para nunca
          ser clipado pelo overflow:hidden do aside.               */}
      <motion.button
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ duration: 0.2 }}
        style={{
          position: "absolute",
          right: -20,
          top: "calc(50% - 20px)",
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "#18181B",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.04)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          flexShrink: 0,
          outline: "none",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#1F1F23";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.14)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(0,0,0,0.40), 0 0 0 1px rgba(255,255,255,0.06)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = "#18181B";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.04)";
        }}
      >
        <motion.div
          animate={{ rotate: collapsed ? 0 : 180 }}
          transition={{ duration: 0.28, ease: EASE }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <ChevronRight size={16} color="#71717A" />
        </motion.div>
      </motion.button>

    </div>
  );
}
