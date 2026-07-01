"use client";

import { Bell, Plus, ChevronDown, Command } from "lucide-react";
import { openCommandPalette } from "@/app/components/ui/CommandPalette";

interface TopbarProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick?: () => void };
  breadcrumbs?: { label: string; href?: string }[];
}

export function Topbar({ title, subtitle, action, breadcrumbs }: TopbarProps) {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-white/[0.06] bg-[#050505] flex-shrink-0">
      <div>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1.5 mb-0.5">
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-[#374151] text-[10px]">/</span>}
                <span className="text-[10px] text-[#6B7280] font-medium">{b.label}</span>
              </span>
            ))}
          </div>
        )}
        <h1 className="text-[15px] font-bold text-white leading-none">{title}</h1>
        {subtitle && <p className="text-[11px] text-[#6B7280] mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {/* Command Palette trigger */}
        <button
          onClick={openCommandPalette}
          className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-1.5 text-[12px] text-[#4B5563] hover:text-white hover:border-white/[0.1] transition-all group"
        >
          <Command size={12} className="group-hover:text-[#A78BFA] transition-colors" />
          <span>Buscar...</span>
          <kbd className="text-[10px] border border-white/[0.08] rounded px-1">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#6B7280] hover:text-white hover:border-white/[0.1] transition-all">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] border-2 border-[#050505]" />
        </button>

        {/* Action */}
        {action && (
          <button
            onClick={action.onClick}
            className="flex items-center gap-1.5 bg-[#7C3AED] hover:bg-[#8B5CF6] text-white px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors"
          >
            <Plus size={14} />
            {action.label}
          </button>
        )}

        {/* Avatar */}
        <div className="flex items-center gap-2 cursor-pointer pl-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] flex items-center justify-center text-[12px] font-bold text-white">
            S
          </div>
          <ChevronDown size={13} className="text-[#6B7280]" />
        </div>
      </div>
    </header>
  );
}
