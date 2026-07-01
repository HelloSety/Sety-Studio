"use client";

import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/motion";
import { useRef } from "react";
import { Plug, BrainCircuit, Workflow, TrendingUp } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: Plug,
    title: "Conecte",
    sub: "WhatsApp & ferramentas",
    desc: "Integração em 30 minutos. WhatsApp Business, CRM, agenda — tudo na mesma plataforma.",
    color: "#7C3AED",
  },
  {
    num: "02",
    icon: BrainCircuit,
    title: "Treine a IA",
    sub: "Com o seu negócio",
    desc: "Alimentamos a IA com seus produtos, objeções e tom de voz. Ela responde como você responderia.",
    color: "#3B82F6",
  },
  {
    num: "03",
    icon: Workflow,
    title: "Automatize",
    sub: "Fluxos de venda",
    desc: "Qualificação, follow-up, agendamento e cobrança — sem operador humano envolvido.",
    color: "#F59E0B",
  },
  {
    num: "04",
    icon: TrendingUp,
    title: "Venda 24h",
    sub: "Enquanto dorme",
    desc: "O sistema atende, converte e atualiza o CRM sozinho. Você acorda com leads qualificados.",
    color: "#22C55E",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="como-funciona" ref={ref} className="section-pad" style={{ background: "#FFFFFF", borderTop: "1px solid #ECECEC" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-5 rounded-full px-3.5 py-1.5 text-[12px] font-medium"
            style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.16)", color: "#7C3AED" }}>
            Processo simples
          </div>
          <h2 className="text-[clamp(32px,4.5vw,58px)] font-black tracking-[-3px] leading-[1] mb-4" style={{ color: "#111111" }}>
            Pronto em{" "}
            <span style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>4 etapas</span>
          </h2>
          <p className="text-[16px] max-w-[440px] mx-auto" style={{ color: "#6B7280" }}>
            Da instalação à primeira venda automática em menos de 15 dias.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.num}
                initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}>
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
                  className="rounded-2xl p-6 h-full"
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #ECECEC",
                    boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
                  }}>

                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${s.color}12`, border: `1px solid ${s.color}25` }}>
                    <Icon size={18} style={{ color: s.color }} />
                  </div>

                  <div className="text-[10px] font-bold mb-1.5 tracking-widest" style={{ color: s.color }}>
                    PASSO {s.num}
                  </div>
                  <h3 className="text-[18px] font-black tracking-[-0.5px] mb-0.5" style={{ color: "#111111" }}>{s.title}</h3>
                  <div className="text-[12px] font-semibold mb-3" style={{ color: s.color }}>{s.sub}</div>
                  <p className="text-[13px] leading-[1.65]" style={{ color: "#6B7280" }}>{s.desc}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
