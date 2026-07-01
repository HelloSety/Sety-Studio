"use client";

import { Bell, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-white/[0.04] bg-[#09090B]/80 backdrop-blur-xl">
      <div>
        <h1 className="text-[14px] font-semibold text-white leading-none">{title}</h1>
        {subtitle && (
          <p className="text-[11px] text-[#52525B] mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {actions}

        <button className="w-8 h-8 flex items-center justify-center rounded-xl text-[#52525B] hover:text-[#A1A1AA] hover:bg-white/[0.04] transition-all">
          <Search className="w-[15px] h-[15px]" />
        </button>

        <button className="relative w-8 h-8 flex items-center justify-center rounded-xl text-[#52525B] hover:text-[#A1A1AA] hover:bg-white/[0.04] transition-all">
          <Bell className="w-[15px] h-[15px]" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
        </button>
      </div>
    </header>
  );
}
