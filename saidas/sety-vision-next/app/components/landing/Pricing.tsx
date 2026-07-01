"use client";

import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/motion";
import { useRef } from "react";
import { Check, ArrowRight, Zap } from "lucide-react";

const WA_LINK = "https://wa.me/559XXXXXXXXX?text=Quero+agendar+um+diagnóstico+do+Sety+Vision";

const setup = [
  "Diagnóstico comercial completo",
  "Site de alta conversão no ar",
  "WhatsApp bot com IA (24h)",
  "CRM + pipeline configurado",
  "Meta Ads estruturado e pronto",
  "Automações internas da operação",
  "Identidade visual base",
  "Treinamento da equipe (1h)",
];

const monthly = [
  "Gestão de tráfego pago (Meta + Google)",
  "Otimizações mensais do bot e CRM",
  "Relatório mensal de resultados",
  "1 reunião de estratégia/mês",
  "Suporte prioritário WhatsApp",
  "Novos criativos (2/mês)",
];

export function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="planos" className="section-pad" style={{ background: "#FFFFFF", borderTop: "1px solid #ECECEC" }} ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-12">

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
            Preço de produto,
            <br />
            <span style={{ color: "#6B7280" }}>resultado de sistema.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="text-[15px] max-w-[460px] leading-[1.6]"
            style={{ color: "#6B7280" }}
          >
            Um cliente a mais por semana já paga o investimento. O sistema trabalha enquanto você foca no que importa.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">

          {/* ── Card 1: Implementação ──────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
            className="rounded-3xl p-8 flex flex-col"
            style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}
          >
            <div className="text-[12px] font-bold tracking-[0.08em] mb-2" style={{ color: "#7C3AED" }}>IMPLEMENTAÇÃO</div>
            <div className="text-[42px] font-black tracking-[-2px] leading-none mb-1" style={{ color: "#111111" }}>
              R$&nbsp;9.000
            </div>
            <div className="text-[13px] mb-6" style={{ color: "#6B7280" }}>Pagamento único · Setup em 15 dias</div>

            <div className="h-px mb-6" style={{ background: "#ECECEC" }} />

            <ul className="flex flex-col gap-3 flex-1 mb-8">
              {setup.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(34,197,94,0.10)" }}>
                    <Check size={9} style={{ color: "#22C55E" }} />
                  </div>
                  <span className="text-[13px] leading-[1.5]" style={{ color: "#374151" }}>{f}</span>
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
              Quero implementar
              <ArrowRight size={15} />
            </motion.a>
          </motion.div>

          {/* ── Card 2: Combo (featured) ───────────────────────────── */}
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
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="flex items-center gap-1.5 bg-[#7C3AED] text-white text-[11px] font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                <Zap size={10} /> Mais escolhido · Melhor ROI
              </span>
            </div>

            <div className="text-[12px] font-bold tracking-[0.08em] mb-2" style={{ color: "#7C3AED" }}>SETUP + 3 MESES</div>
            <div className="text-[42px] font-black tracking-[-2px] leading-none mb-1" style={{ color: "#111111" }}>
              R$&nbsp;16.500
            </div>
            <div className="text-[13px] mb-1" style={{ color: "#6B7280" }}>Setup + 3 meses de operação</div>
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold w-fit mb-6"
              style={{ background: "rgba(34,197,94,0.10)", color: "#16A34A" }}>
              ▼ Economia de R$2.000 vs. separado
            </div>

            <div className="h-px mb-6" style={{ background: "#ECECEC" }} />

            <ul className="flex flex-col gap-3 flex-1 mb-8">
              {[...setup.slice(0, 5), "Tudo da implementação +", ...monthly.slice(0, 4)].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(124,58,237,0.14)" }}>
                    <Check size={9} style={{ color: "#7C3AED" }} />
                  </div>
                  <span className="text-[13px] leading-[1.5]" style={{ color: f === "Tudo da implementação +" ? "#111111" : "#374151", fontWeight: f === "Tudo da implementação +" ? 600 : 400 }}>{f}</span>
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
              Quero esse pacote
              <ArrowRight size={16} />
            </motion.a>
          </motion.div>

          {/* ── Card 3: Operação Mensal ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.6, ease: EASE }}
            className="rounded-3xl p-8 flex flex-col"
            style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}
          >
            <div className="text-[12px] font-bold tracking-[0.08em] mb-2" style={{ color: "#7C3AED" }}>OPERAÇÃO MENSAL</div>
            <div className="text-[42px] font-black tracking-[-2px] leading-none mb-1" style={{ color: "#111111" }}>
              R$&nbsp;2.500
              <span className="text-[18px] font-normal tracking-normal" style={{ color: "#6B7280" }}>/mês</span>
            </div>
            <div className="text-[13px] mb-6" style={{ color: "#6B7280" }}>Após a implementação · Mín. 6 meses</div>

            <div className="h-px mb-6" style={{ background: "#ECECEC" }} />

            <ul className="flex flex-col gap-3 flex-1 mb-8">
              {monthly.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(34,197,94,0.10)" }}>
                    <Check size={9} style={{ color: "#22C55E" }} />
                  </div>
                  <span className="text-[13px] leading-[1.5]" style={{ color: "#374151" }}>{f}</span>
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
              Já tenho o setup
              <ArrowRight size={15} />
            </motion.a>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center text-[13px] mt-8"
          style={{ color: "#9CA3AF" }}
        >
          Parcelamento em até 3x sem juros · Diagnóstico gratuito antes de qualquer compromisso
        </motion.p>
      </div>
    </section>
  );
}
