"use client";

import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/motion";
import { useRef } from "react";

/* ── Stats row ─────────────────────────────────────────── */
const stats = [
  { val: "+347%",  label: "Aumento médio de leads",    color: "#7C3AED" },
  { val: "18x",    label: "ROI médio em 90 dias",       color: "#22C55E" },
  { val: "4 seg",  label: "Tempo médio de resposta IA", color: "#3B82F6" },
  { val: "97%",    label: "Taxa de retenção anual",     color: "#F59E0B" },
];

/* ── Depoimentos ─────────────────────────────────────── */
const featured = [
  {
    quote: "Em 30 dias dobramos a taxa de conversão. O bot atende sozinho às 2h da manhã — é como ter um vendedor que nunca dorme e nunca erra.",
    name: "Dr. Carlos Mendes",
    role: "Clínica Odontológica · São Paulo, SP",
    result: "+247% leads · ROI 22x",
    bg: "linear-gradient(135deg, #F5F3FF 0%, #FFFFFF 70%)",
    border: "rgba(124,58,237,0.18)",
    resultColor: "#7C3AED",
    grad: "from-[#7C3AED] to-[#3B82F6]",
  },
  {
    quote: "1.200 leads no primeiro mês. Pipeline integrado com WhatsApp salvou o processo de vendas. Equipe 3x mais produtiva sem contratar ninguém.",
    name: "Amanda Torres",
    role: "Imobiliária Digital · Belo Horizonte, MG",
    result: "1.200 leads · 3x produtividade",
    bg: "linear-gradient(135deg, #FFFBEB 0%, #FFFFFF 70%)",
    border: "rgba(245,158,11,0.22)",
    resultColor: "#D97706",
    grad: "from-[#F59E0B] to-[#EF4444]",
  },
];

const rest = [
  {
    quote: "Antes usava 7 ferramentas diferentes. Com a Sety Vision unificamos tudo. O relatório automático toda segunda já me diz onde estão os gargalos.",
    name: "Rafael Souza",
    role: "E-commerce Esportivo · Belém, PA",
    avatar: "R", grad: "from-[#059669] to-[#0891B2]",
    result: "7 → 1 ferramenta",
  },
  {
    quote: "O IA Assistant virou nosso SDR virtual. Qualifica, agenda e faz follow-up automaticamente. 40 reuniões qualificadas em um mês sem aumentar a equipe.",
    name: "Marina Ferreira",
    role: "Consultoria Empresarial · Curitiba, PR",
    avatar: "M", grad: "from-[#7C3AED] to-[#EC4899]",
    result: "40 reuniões/mês",
  },
  {
    quote: "Nossa clínica cresceu 3x em 6 meses. Funil de vendas com automação de WhatsApp é imbatível. ROI de 18x no primeiro trimestre.",
    name: "Dr. Paulo Henrique",
    role: "Clínica de Estética · Recife, PE",
    avatar: "P", grad: "from-[#EC4899] to-[#7C3AED]",
    result: "ROI 18x · 3x crescimento",
  },
];

export function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="section-pad" style={{ background: "#FAFAFB", borderTop: "1px solid #ECECEC" }} ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-[12px] font-semibold uppercase tracking-[0.1em] mb-4"
            style={{ color: "#6B7280" }}
          >
            Resultados reais
          </motion.div>
          <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
            <motion.h2
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08, ease: EASE }}
              className="text-[clamp(32px,5vw,64px)] font-black tracking-[-3px] leading-[1.0]"
              style={{ color: "#111111" }}
            >
              Quem usa,<br />
              <span style={{ color: "#6B7280" }}>não volta atrás.</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 shrink-0"
            >
              <div className="flex -space-x-2">
                {["C","A","R","M","P","J"].map((l,i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {l}
                  </div>
                ))}
              </div>
              <div className="ml-2">
                <div className="text-[13px] font-bold" style={{ color: "#111111" }}>+2.400 empresas</div>
                <div className="text-[11px]" style={{ color: "#9CA3AF" }}>★★★★★ 4.9/5</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.05, ease: EASE }}
              className="rounded-2xl p-5"
              style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}
            >
              <div className="text-[28px] font-black tracking-[-1.5px] mb-1" style={{ color: s.color }}>{s.val}</div>
              <div className="text-[12px]" style={{ color: "#6B7280" }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* 2 featured large quotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {featured.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: EASE }}
              className="rounded-3xl p-10 flex flex-col justify-between min-h-[280px] relative overflow-hidden"
              style={{ background: t.bg, border: `1px solid ${t.border}` }}
              whileHover={{ y: -3 }}
            >
              <div className="text-[clamp(20px,2.5vw,28px)] font-bold leading-[1.4] tracking-[-0.5px] mb-8 relative z-10"
                style={{ color: "#111111" }}>
                &ldquo;{t.quote}&rdquo;
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.grad} flex items-center justify-center text-[14px] font-bold text-white shrink-0`}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-[14px] font-semibold" style={{ color: "#111111" }}>{t.name}</div>
                    <div className="text-[11px]" style={{ color: "#6B7280" }}>{t.role}</div>
                  </div>
                </div>
                <div className="px-3 py-1.5 rounded-full text-[11px] font-bold" style={{ background: `${t.resultColor}14`, color: t.resultColor }}>
                  {t.result}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3 smaller testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rest.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35 + i * 0.07, duration: 0.6, ease: EASE }}
              className="rounded-2xl p-7 flex flex-col gap-5"
              style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}
              whileHover={{ y: -3 }}
            >
              <div className="text-[20px] font-serif opacity-60 leading-none" style={{ color: "#7C3AED" }}>&ldquo;</div>
              <p className="text-[14px] leading-[1.7] flex-1" style={{ color: "#6B7280" }}>{t.quote}</p>
              <div className="pt-4" style={{ borderTop: "1px solid #ECECEC" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${t.grad} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>{t.avatar}</div>
                    <div>
                      <div className="text-[13px] font-semibold" style={{ color: "#111111" }}>{t.name}</div>
                      <div className="text-[10px]" style={{ color: "#9CA3AF" }}>{t.role}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full" style={{ color: "#22C55E", background: "rgba(34,197,94,0.10)" }}>{t.result}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-10 flex items-center justify-center gap-8 flex-wrap"
        >
          {[
            "✓ Sem contrato longo",
            "✓ Resultado em 15 dias",
            "✓ Suporte humano em português",
            "✓ Dados 100% seguros",
            "✓ Cancelamento sem burocracia",
          ].map(item => (
            <span key={item} className="text-[12px]" style={{ color: "#9CA3AF" }}>{item}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
