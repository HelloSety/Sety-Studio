"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, MessageCircle, Calendar } from "lucide-react";
import { colors, radius, shadow, motion as M } from "@/lib/tokens";

const WA_LINK = "https://wa.me/559XXXXXXXXX?text=Quero+agendar+um+diagnóstico+do+Sety+Vision";

const BULLETS = [
  "✓ Sem contratos longos",
  "✓ Resultado em 15 dias",
  "✓ Suporte em português",
  "✓ Cancelamento fácil",
];

export function CTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="cta-section"
      style={{ background: colors.surface, borderTop: `1px solid ${colors.border}`, padding: "112px 32px" }}
    >
      <style>{`
        @media (max-width: 640px) { .cta-section { padding-left: 20px !important; padding-right: 20px !important; } }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: M.ease }}
        style={{
          maxWidth: 900, margin: "0 auto",
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: radius["3xl"],
          boxShadow: shadow.lg,
          padding: "80px 48px",
          textAlign: "center",
        }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            borderRadius: radius.full, padding: "6px 14px", fontSize: 12, fontWeight: 500, marginBottom: 32,
            background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.22)", color: colors.greenDark,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: radius.full, background: colors.green }} className="animate-pulse" />
          Diagnóstico gratuito · 15 minutos · Sem compromisso
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: "clamp(34px, 5.5vw, 64px)", fontWeight: 900,
            letterSpacing: "-0.035em", lineHeight: 1.05, marginBottom: 24, color: colors.text,
          }}
        >
          Pronto para instalar
          <br />
          <span style={{
            background: `linear-gradient(135deg, ${colors.text} 0%, ${colors.purple} 65%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            o Sety Vision?
          </span>
        </motion.h2>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          style={{ fontSize: 17, maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.6, color: colors.textSecondary }}
        >
          Fazemos um diagnóstico rápido da sua operação e mostramos exatamente o que o sistema faria pela sua empresa — de graça.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}
        >
          <motion.a
            href={WA_LINK} target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "16px 32px", borderRadius: radius.full, fontSize: 16, fontWeight: 700, textDecoration: "none",
              background: colors.purple, color: colors.white, boxShadow: shadow.purple,
            }}
            whileHover={{ y: -2, boxShadow: shadow.purpleLg } as never}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <Calendar size={18} />
            Agendar diagnóstico gratuito
            <ArrowRight size={18} />
          </motion.a>
          <motion.a
            href={WA_LINK} target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "16px 28px", borderRadius: radius.full, fontSize: 16, fontWeight: 600, textDecoration: "none",
              background: colors.white, border: `1.5px solid ${colors.border}`, color: colors.textSecondary,
            }}
            whileHover={{ y: -1, borderColor: colors.purple, color: colors.purple } as never}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle size={18} />
            Falar pelo WhatsApp
          </motion.a>
        </motion.div>

        {/* Guarantee bullets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}
        >
          {BULLETS.map((item) => (
            <span key={item} style={{ fontSize: 13, color: colors.textMuted }}>{item}</span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
