"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/motion";
import {
  LayoutDashboard, MessageSquare, Users, CalendarDays,
  Brain, BarChart3, Settings, ChevronLeft, ChevronRight, LogOut,
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
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.28, ease: EASE }}
      className="relative flex flex-col h-full bg-[#060609] border-r border-white/[0.05] flex-shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-white/[0.05] flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#7C3AED] flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                <div className="text-[12px] font-black text-white whitespace-nowrap tracking-wide">SETY VISION</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 pt-4 space-y-0.5">
        {nav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/crm" && pathname === "/pipeline");
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
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#7C3AED] rounded-r-full"
                  style={{ width: 3, height: 20, zIndex: 1 }}
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
                <div className="absolute left-full ml-2 py-1.5 px-3 rounded-lg bg-[#111114] border border-white/[0.08] text-[12px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  {item.label}
                </div>
              )}
            </a>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/[0.05] px-2 py-3 space-y-0.5">
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
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-[13px] font-medium whitespace-nowrap overflow-hidden">
                Configurações
              </motion.span>
            )}
          </AnimatePresence>
        </a>

        {/* User */}
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

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-[#111114] border border-white/[0.08] flex items-center justify-center text-[#52525B] hover:text-white transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
      </button>
    </motion.aside>
  );
}
