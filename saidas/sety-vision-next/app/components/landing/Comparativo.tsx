"use client";

import { motion, useInView } from "framer-motion";
import { EASE } from "@/lib/motion";
import { useRef } from "react";
import { X, Check } from "lucide-react";

const sem = [
  "Responde manualmente no WhatsApp",
  "Perde lead fora do horário comercial",
  "Agenda no papel ou planilha",
  "Sem histórico do cliente",
  "Não sabe de onde vêm os leads",
  "Proposta criada na mão, por e-mail",
  "Sem relatórios ou métricas",
  "Time sobrecarregado de tarefas repetitivas",
];

const com = [
  "IA responde em menos de 2 segundos",
  "Atendimento 24h, 7 dias por semana",
  "Agenda integrada e automática",
  "CRM com histórico completo de cada cliente",
  "Dashboard mostra origem de cada lead",
  "Proposta gerada e enviada pela IA",
  "Relatórios semanais automáticos",
  "Time foca só em fechar negócios",
];

export function Comparativo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="section-pad" style={{ background: "#FFFFFF", borderTop: "1px solid #ECECEC" }}>
      <div className="max-w-[1280px] mx-auto px-8">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: EASE }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-5 rounded-full px-3.5 py-1.5 text-[12px] font-medium"
            style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.16)", color: "#7C3AED" }}>
            Comparativo real
          </div>
          <h2 className="text-[clamp(32px,4.5vw,58px)] font-black tracking-[-3px] leading-[1]" style={{ color: "#111111" }}>
            Empresa igual à sua,<br />
            <span style={{
              background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>dois cenários diferentes.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Sem Sety */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
            className="rounded-2xl p-6"
            style={{ background: "#FFFFFF", border: "1px solid #ECECEC" }}>
            <div className="flex items-center gap-2.5 mb-6 pb-5" style={{ borderBottom: "1px solid #ECECEC" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(239,68,68,0.08)" }}>
                <X size={15} style={{ color: "#EF4444" }} />
              </div>
              <div>
                <div className="text-[14px] font-bold" style={{ color: "#111111" }}>Sem Sety Vision</div>
                <div className="text-[11px]" style={{ color: "#9CA3AF" }}>Operação manual e fragmentada</div>
              </div>
            </div>
            <div className="space-y-3">
              {sem.map((item, i) => (
                <motion.div key={item}
                  initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.35, delay: 0.15 + i * 0.05, ease: EASE }}
                  className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(239,68,68,0.08)" }}>
                    <X size={10} style={{ color: "#EF4444" }} />
                  </div>
                  <span className="text-[13px] leading-[1.5]" style={{ color: "#6B7280" }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Com Sety */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{ background: "linear-gradient(180deg, #FAF5FF 0%, #FFFFFF 60%)", border: "1px solid rgba(124,58,237,0.22)" }}>
            <div className="flex items-center gap-2.5 mb-6 pb-5" style={{ borderBottom: "1px solid #ECECEC" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(34,197,94,0.10)" }}>
                <Check size={15} style={{ color: "#22C55E" }} />
              </div>
              <div>
                <div className="text-[14px] font-bold" style={{ color: "#111111" }}>Com Sety Vision</div>
                <div className="text-[11px]" style={{ color: "#9CA3AF" }}>Sistema operacional com IA</div>
              </div>
            </div>
            <div className="space-y-3">
              {com.map((item, i) => (
                <motion.div key={item}
                  initial={{ opacity: 0, x: 12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.35, delay: 0.2 + i * 0.05, ease: EASE }}
                  className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(34,197,94,0.10)" }}>
                    <Check size={10} style={{ color: "#22C55E" }} />
                  </div>
                  <span className="text-[13px] leading-[1.5]" style={{ color: "#374151" }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
