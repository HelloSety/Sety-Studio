"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { EASE } from "@/lib/motion";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastCtx {
  toast: (t: Omit<Toast, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastCtx | null>(null);

const styles: Record<ToastType, { bg: string; border: string; icon: typeof CheckCircle; color: string }> = {
  success: { bg: "rgba(22,163,74,0.08)", border: "rgba(34,197,94,0.2)", icon: CheckCircle, color: "#4ADE80" },
  error:   { bg: "rgba(220,38,38,0.08)", border: "rgba(239,68,68,0.2)", icon: XCircle,     color: "#F87171" },
  warning: { bg: "rgba(217,119,6,0.08)", border: "rgba(245,158,11,0.2)", icon: AlertCircle, color: "#FCD34D" },
  info:    { bg: "rgba(37,99,235,0.08)", border: "rgba(59,130,246,0.2)", icon: Info,         color: "#60A5FA" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts(p => p.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p.slice(-3), { ...t, id }]);
    setTimeout(() => dismiss(id), 4000);
  }, [dismiss]);

  const success = useCallback((title: string, message?: string) => toast({ type: "success", title, message }), [toast]);
  const error   = useCallback((title: string, message?: string) => toast({ type: "error",   title, message }), [toast]);
  const warning = useCallback((title: string, message?: string) => toast({ type: "warning", title, message }), [toast]);
  const info    = useCallback((title: string, message?: string) => toast({ type: "info",    title, message }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2.5 pointer-events-none" style={{ maxWidth: "360px" }}>
        <AnimatePresence>
          {toasts.map(t => {
            const st = styles[t.type];
            const Icon = st.icon;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 60, scale: 0.92 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.92 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl"
                style={{ background: "#111114", border: `1px solid ${st.border}`, boxShadow: "0 20px 50px rgba(0,0,0,0.5)", backdropFilter: "blur(12px)" }}
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: st.bg }}>
                  <Icon size={14} style={{ color: st.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-white">{t.title}</div>
                  {t.message && <div className="text-[11px] text-[#6B7280] mt-0.5">{t.message}</div>}
                </div>
                <button onClick={() => dismiss(t.id)} className="text-[#4B5563] hover:text-white transition-colors flex-shrink-0 mt-0.5">
                  <X size={13} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}
