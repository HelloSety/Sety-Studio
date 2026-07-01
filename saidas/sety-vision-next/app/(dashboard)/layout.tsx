"use client";

import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { ToastProvider } from "@/app/components/ui/Toast";
import { CommandPalette } from "@/app/components/ui/CommandPalette";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex h-screen bg-[#050505] overflow-hidden text-white">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
      <CommandPalette />
    </ToastProvider>
  );
}
