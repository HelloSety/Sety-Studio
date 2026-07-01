"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";
import { EASE } from "@/lib/motion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, subtitle, children, size = "md", footer }: ModalProps) {
  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.22, ease: EASE }}
            className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-32px)] ${widths[size]} z-50`}
          >
            <div className="rounded-2xl overflow-hidden" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 80px rgba(0,0,0,0.7)" }}>
              {/* Header */}
              {(title || subtitle) && (
                <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
                  <div>
                    {title && <div className="text-[16px] font-bold text-white">{title}</div>}
                    {subtitle && <div className="text-[12px] text-[#6B7280] mt-0.5">{subtitle}</div>}
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#6B7280] hover:text-white transition-all flex-shrink-0 ml-4"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="p-6">{children}</div>

              {/* Footer */}
              {footer && (
                <div className="px-6 pb-5 border-t border-white/[0.06] pt-4 flex items-center justify-end gap-2">
                  {footer}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
