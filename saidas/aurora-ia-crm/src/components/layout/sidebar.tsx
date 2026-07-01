"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, MessageSquare, Users, GitBranch, Zap,
  BarChart3, Settings, Wifi, UsersRound, Sparkles, Search, Bot
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard",      label: "Dashboard",   icon: LayoutDashboard },
  { href: "/whatsapp",       label: "WhatsApp",    icon: Wifi,            dot: true },
  { href: "/conversas",      label: "Conversas",   icon: MessageSquare,   badge: 6 },
  { href: "/leads-quentes",  label: "Leads",       icon: Users,           badge: 18 },
  { href: "/funil",          label: "Pipeline",    icon: GitBranch },
  { href: "/automacoes",     label: "Automações",  icon: Zap },
  { href: "/analytics",      label: "Analytics",   icon: BarChart3 },
];

const secondary = [
  { href: "/configuracoes",  label: "Configurações", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[196px] shrink-0 h-screen bg-[#0F0F12] border-r border-white/[0.04] flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/[0.04]">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center shrink-0 shadow-aurora">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-white leading-none">Aurora IA</p>
            <p className="text-[10px] text-[#52525B] mt-0.5">CRM</p>
          </div>
        </Link>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-1">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.04] text-[#52525B] hover:border-white/[0.07] hover:text-[#A1A1AA] transition-all duration-150">
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[12px] flex-1 text-left">Buscar...</span>
          <kbd className="text-[9px] bg-white/[0.06] px-1.5 py-0.5 rounded-md font-mono">⌘K</kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-2 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-medium text-[#3F3F46] uppercase tracking-widest px-3 py-2">
          Principal
        </p>

        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 1 }}
                transition={{ duration: 0.1 }}
                className={cn(
                  "flex items-center justify-between px-3 py-[7px] rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer group",
                  active
                    ? "text-white bg-white/[0.06] border-l-2 border-l-[#7C3AED]"
                    : "text-[#A1A1AA] hover:text-white hover:bg-white/[0.03]"
                )}
                style={active ? { paddingLeft: "10px" } : {}}
              >
                <div className="flex items-center gap-2.5">
                  <item.icon
                    className={cn(
                      "w-[15px] h-[15px] shrink-0 transition-colors",
                      active ? "text-white" : "text-[#52525B] group-hover:text-[#A1A1AA]"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.dot && (
                    <span className="dot-online shrink-0" />
                  )}
                  {item.badge && (
                    <span className={cn(
                      "text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none",
                      active
                        ? "bg-[#7C3AED]/30 text-[#8B5CF6]"
                        : "bg-white/[0.06] text-[#52525B]"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </motion.div>
            </Link>
          );
        })}

        <div className="pt-3">
          <p className="text-[10px] font-medium text-[#3F3F46] uppercase tracking-widest px-3 py-2">
            Sistema
          </p>
          {secondary.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 1 }}
                  transition={{ duration: 0.1 }}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-[7px] rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer group",
                    active
                      ? "text-white bg-white/[0.06] border-l-2 border-l-[#7C3AED]"
                      : "text-[#A1A1AA] hover:text-white hover:bg-white/[0.03]"
                  )}
                  style={active ? { paddingLeft: "10px" } : {}}
                >
                  <item.icon className={cn("w-[15px] h-[15px] shrink-0", active ? "text-white" : "text-[#52525B] group-hover:text-[#A1A1AA]")} />
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* AI Status */}
      <div className="mx-3 mb-3 p-3 rounded-xl bg-[#7C3AED]/08 border border-[#7C3AED]/15">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center">
            <Bot className="w-2.5 h-2.5 text-white" />
          </div>
          <span className="text-[11px] font-semibold text-white">Aurora IA</span>
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="ml-auto w-1.5 h-1.5 rounded-full bg-[#25D366]"
          />
        </div>
        <p className="text-[10px] text-[#52525B]">Lucas ativo · 247 leads</p>
      </div>

      {/* User */}
      <div className="px-3 pb-4 border-t border-white/[0.04] pt-3">
        <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/[0.04] transition-all group">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
            S
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-[12px] font-medium text-white truncate">Seven</p>
            <p className="text-[10px] text-[#52525B] truncate">Admin</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
