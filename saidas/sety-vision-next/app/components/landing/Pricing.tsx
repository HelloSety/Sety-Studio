"use client";

import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/motion";
import { useRef } from "react";
import { Check, ArrowRight, Zap, Star } from "lucide-react";

const WA_LINK = "https://wa.me/559XXXXXXXXX?text=Quero+agendar+um+diagnóstico+do+Sety+Vision";

const premiumFeatures = [
  "🤖 IA no WhatsApp (texto e áudio)",
  "🎙️ Resposta por áudio automatizada",
  "📱 WhatsApp Business integrado",
  "📊 CRM completo com pipeline",
  "📈 Dashboard de resultados",
  "🛠️ Atualizações contínuas do bot",
  "☁️ Hospedagem incluída",
  "🔒 Backups automáticos",
  "💬 Suporte prioritário WhatsApp",
];

const growthFeatures = [
  "🤖 IA no WhatsApp (texto e áudio)",
  "🎙️ Resposta por áudio automatizada",
  "📱 WhatsApp Business integrado",
  "📊 CRM completo com pipeline",
  "🌐 Site de alta conversão",
  "📈 Gestão de Meta Ads e Google Ads",
  "📊 Dashboard de resultados",
  "🛠️ Atualizações contínuas",
  "☁️ Hospedagem incluída",
  "🔒 Backups automáticos",
  "💬 Suporte prioritário",
  "📅 Reunião mensal de performance",
];

export function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="planos" className="section-pad" style={{ background: "#FFFFFF", borderTop: "1px solid #ECECEC" }} ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[12px] font-medium"
            style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.2)", color: "#7C3AED" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
            Investimento
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="text-[clamp(28px,4vw,52px)] font-black tracking-[-2px] leading-[1.1]"
            style={{ color: "#111111" }}
          >
            Dois planos.
            <br />
            <span style={{ color: "#6B7280" }}>Resultado de sistema.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="text-[15px] max-w-120 leading-[1.6]"
            style={{ color: "#6B7280" }}
          >
            Quem já tem site entra no Premium. Quem precisa de tudo para vender todo dia escolhe o Growth.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-220 mx-auto items-start">

          {/* ── Card 1: Premium ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
            className="rounded-3xl p-8 flex flex-col"
            style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}
          >
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(124,58,237,0.08)" }}>
                <Star size={14} style={{ color: "#7C3AED" }} />
              </div>
              <div>
                <div className="text-[12px] font-bold tracking-[0.08em]" style={{ color: "#7C3AED" }}>PREMIUM</div>
                <div className="text-[11px]" style={{ color: "#9CA3AF" }}>Ideal para quem já tem site</div>
              </div>
            </div>

            {/* Preços */}
            <div className="rounded-2xl p-5 mb-6" style={{ background: "#F9FAFB" }}>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-[13px]" style={{ color: "#6B7280" }}>Implementação</span>
              </div>
              <div className="text-[36px] font-black tracking-[-2px] leading-none mb-3" style={{ color: "#111111" }}>
                R$&nbsp;6.900
              </div>
              <div className="h-px mb-3" style={{ background: "#E5E7EB" }} />
              <div className="flex items-end gap-1">
                <span className="text-[13px]" style={{ color: "#6B7280" }}>Mensalidade</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[30px] font-black tracking-[-1.5px]" style={{ color: "#111111" }}>R$&nbsp;1.490</span>
                <span className="text-[14px]" style={{ color: "#6B7280" }}>/mês</span>
              </div>
            </div>

            <div className="h-px mb-6" style={{ background: "#ECECEC" }} />

            <ul className="flex flex-col gap-3 flex-1 mb-8">
              {premiumFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(34,197,94,0.10)" }}>
                    <Check size={9} style={{ color: "#22C55E" }} />
                  </div>
                  <span className="text-[13px] leading-normal" style={{ color: "#374151" }}>{f}</span>
                </li>
              ))}
            </ul>

            <motion.a
              href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 rounded-[18px] text-[14px] font-semibold no-underline"
              style={{ background: "#FFFFFF", color: "#111111", border: "1px solid #E5E7EB" }}
              whileHover={{ y: -2, borderColor: "#7C3AED", color: "#7C3AED" } as any}
              whileTap={{ scale: 0.98 }}
            >
              Quero o Premium
              <ArrowRight size={15} />
            </motion.a>
          </motion.div>

          {/* ── Card 2: Premium Growth (featured) ───────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
            className="relative rounded-3xl p-8 flex flex-col"
            style={{
              background: "linear-gradient(160deg, #FAF5FF 0%, #FFFFFF 55%)",
              border: "1px solid rgba(124,58,237,0.3)",
              boxShadow: "0 30px 70px rgba(124,58,237,0.10)",
            }}
          >
            {/* Badge recomendado */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="flex items-center gap-1.5 bg-[#7C3AED] text-white text-[11px] font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                <Zap size={10} /> Recomendado · Solução completa
              </span>
            </div>

            <div className="flex items-center gap-2 mb-5 mt-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(124,58,237,0.14)" }}>
                <Zap size={14} style={{ color: "#7C3AED" }} />
              </div>
              <div>
                <div className="text-[12px] font-bold tracking-[0.08em]" style={{ color: "#7C3AED" }}>PREMIUM GROWTH</div>
                <div className="text-[11px]" style={{ color: "#9CA3AF" }}>Para vender todo dia, do zero</div>
              </div>
            </div>

            {/* Preços */}
            <div className="rounded-2xl p-5 mb-6" style={{ background: "rgba(124,58,237,0.04)", border: "1px solid rgba(124,58,237,0.1)" }}>
              <div className="text-[13px] mb-1" style={{ color: "#6B7280" }}>Implementação</div>
              <div className="text-[36px] font-black tracking-[-2px] leading-none mb-3" style={{ color: "#111111" }}>
                R$&nbsp;9.900
              </div>
              <div className="h-px mb-3" style={{ background: "rgba(124,58,237,0.12)" }} />
              <div className="text-[13px] mb-1" style={{ color: "#6B7280" }}>Mensalidade</div>
              <div className="flex items-baseline gap-1">
                <span className="text-[30px] font-black tracking-[-1.5px]" style={{ color: "#111111" }}>R$&nbsp;2.990</span>
                <span className="text-[14px]" style={{ color: "#6B7280" }}>/mês</span>
              </div>
            </div>

            <div className="h-px mb-6" style={{ background: "#ECECEC" }} />

            <ul className="flex flex-col gap-3 flex-1 mb-8">
              {growthFeatures.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(124,58,237,0.14)" }}>
                    <Check size={9} style={{ color: "#7C3AED" }} />
                  </div>
                  <span className="text-[13px] leading-normal" style={{ color: "#374151" }}>{f}</span>
                </li>
              ))}
            </ul>

            <motion.a
              href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 rounded-[18px] text-[15px] font-bold no-underline"
              style={{ background: "#7C3AED", color: "#FFFFFF" }}
              whileHover={{ y: -2, backgroundColor: "#6D28D9", boxShadow: "0 12px 40px rgba(124,58,237,0.32)" } as any}
              whileTap={{ scale: 0.98 }}
            >
              Quero o Growth
              <ArrowRight size={16} />
            </motion.a>
          </motion.div>
        </div>

        {/* Nota rodapé */}
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-10 max-w-150 mx-auto"
        >
          <div className="rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left"
            style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}>
            <span className="text-[20px]">💡</span>
            <p className="text-[13px] leading-[1.6]" style={{ color: "#6B7280" }}>
              <strong style={{ color: "#374151" }}>Verba de anúncios não inclusa.</strong> O cliente paga diretamente ao Meta e Google — a mensalidade cobre a gestão completa das campanhas.
            </p>
          </div>

          <p className="text-center text-[13px] mt-5" style={{ color: "#9CA3AF" }}>
            Diagnóstico gratuito antes de qualquer compromisso · Sem taxa de setup oculta
          </p>
        </motion.div>

      </div>
    </section>
  );
}
