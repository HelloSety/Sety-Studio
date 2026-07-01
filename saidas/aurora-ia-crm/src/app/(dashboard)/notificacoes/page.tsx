"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, Check, CheckCheck, Flame, Zap, User, MessageSquare, X } from "lucide-react";
import { mockNotifications } from "@/lib/mock-data";
import { timeAgo, cn } from "@/lib/utils";
import Header from "@/components/layout/header";
import type { Notification } from "@/types";

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  hot_lead: { icon: Flame, color: "text-red-400", bg: "bg-red-500/15 border-red-500/25" },
  message: { icon: MessageSquare, color: "text-[#8B3FFF]", bg: "bg-[#8B3FFF]/15 border-[#8B3FFF]/25" },
  score_update: { icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/15 border-yellow-500/25" },
  new_lead: { icon: User, color: "text-[#06B6D4]", bg: "bg-[#06B6D4]/15 border-[#06B6D4]/25" },
};

const FILTERS = ["Todas", "Leads Quentes", "Mensagens", "Sistema"];

export default function NotificacoesPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState("Todas");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const dismiss = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  const filtered = notifications.filter((n) => {
    if (filter === "Todas") return true;
    if (filter === "Leads Quentes") return n.type === "hot_lead";
    if (filter === "Mensagens") return n.type === "message";
    return n.type === "score_update" || n.type === "new_lead";
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Notificações" subtitle={unreadCount > 0 ? `${unreadCount} não lidas` : "Tudo em dia"} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                    filter === f
                      ? "bg-[#8B3FFF]/15 text-[#A066FF] border-[#8B3FFF]/30"
                      : "bg-transparent text-slate-400 border-white/[0.08] hover:text-white hover:border-white/[0.15]"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 text-xs text-[#8B3FFF] hover:text-[#A066FF] transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* Notifications */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-600">
              <BellOff className="w-10 h-10 mb-3 opacity-50" />
              <p className="text-sm">Sem notificações</p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence initial={false}>
                {filtered.map((notif) => {
                  const cfg = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.message;
                  const Icon = cfg.icon;
                  return (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 32, height: 0, marginBottom: 0, padding: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => markRead(notif.id)}
                      className={cn(
                        "flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all group",
                        notif.read
                          ? "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                          : "bg-white/[0.05] border-white/[0.1] hover:bg-white/[0.07]"
                      )}
                    >
                      {/* Icon */}
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border", cfg.bg)}>
                        <Icon className={cn("w-4 h-4", cfg.color)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-[13px] font-medium", notif.read ? "text-slate-300" : "text-white")}>
                            {notif.title}
                          </p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {!notif.read && <div className="w-2 h-2 rounded-full bg-[#8B3FFF]" />}
                            <span className="text-[10px] text-slate-600">{timeAgo(notif.created_at)}</span>
                          </div>
                        </div>
                        <p className="text-[12px] text-slate-500 mt-0.5">{notif.body}</p>
                        {notif.action_label && (
                          <button className="mt-2 text-[11px] text-[#8B3FFF] hover:text-[#A066FF] transition-colors font-medium">
                            {notif.action_label} →
                          </button>
                        )}
                      </div>

                      {/* Dismiss */}
                      <button
                        onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                        className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-slate-300 transition-all mt-0.5 shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
