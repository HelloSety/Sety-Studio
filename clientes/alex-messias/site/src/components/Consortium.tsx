"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { whatsappLink } from "@/lib/utils";
import { siteConfig } from "@/lib/data";

const benefits = [
  "Sem juros — apenas taxa de administração",
  "Planos de 60 a 100 meses",
  "Carta de crédito para qualquer modelo GWM",
  "Lance para contemplação antecipada",
  "Assessoria completa em todo o processo",
  "Entrega nas concessionárias GWM de SP",
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function Consortium() {
  return (
    <section id="consorcio" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Content */}
          <div>
            <motion.div {...fadeUp()} className="flex items-center gap-4 mb-7">
              <div className="w-8 h-px bg-gwm-red" />
              <span className="text-gwm-red text-[0.65rem] font-bold tracking-[0.3em] uppercase">
                Consórcio GWM
              </span>
            </motion.div>

            <motion.h2 {...fadeUp(0.1)} className="heading-lg text-gwm-dark mb-6">
              Realize o sonho
              <br />do seu GWM{" "}
              <span className="text-gwm-red">sem juros.</span>
            </motion.h2>

            <motion.p {...fadeUp(0.2)} className="text-gwm-gray text-[0.95rem] leading-relaxed mb-9">
              O consórcio é a forma mais inteligente de adquirir seu veículo. Sem entrada obrigatória, sem juros, com parcelas que cabem no seu orçamento. Alex cuida de tudo — da simulação à entrega das chaves.
            </motion.p>

            <motion.div {...fadeUp(0.3)} className="space-y-3 mb-10">
              {benefits.map((b) => (
                <div key={b} className="flex items-start gap-3">
                  <CheckCircle2 size={15} className="text-gwm-red shrink-0 mt-0.5" />
                  <span className="text-gwm-gray-mid text-sm">{b}</span>
                </div>
              ))}
            </motion.div>

            <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-3">
              <a
                href={whatsappLink(siteConfig.whatsapp, "Olá Alex! Quero simular um consórcio GWM.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gwm-red text-white text-[0.7rem] font-bold tracking-widest uppercase px-7 py-4 hover:bg-[#c5000f] transition-colors"
              >
                Simular Agora
                <ArrowRight size={14} />
              </a>
              <a
                href={whatsappLink(siteConfig.whatsapp, "Olá Alex! Tenho dúvidas sobre o consórcio GWM.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-gwm-border text-gwm-gray-mid text-[0.7rem] font-bold tracking-widest uppercase px-7 py-4 hover:border-gwm-dark hover:text-gwm-dark transition-all"
              >
                Tirar Dúvidas
              </a>
            </motion.div>
          </div>

          {/* Image + info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="relative"
          >
            <div className="relative aspect-4/3 overflow-hidden">
              <Image
                src="/cars/haval-h6-hev/branco.webp"
                alt="Consórcio GWM"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-6">
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <p className="text-[0.6rem] text-gwm-gray tracking-widest uppercase mb-1">A partir de</p>
                  <p className="text-xl font-black text-gwm-dark">R$ 1.200<span className="text-xs font-normal text-gwm-gray">/mês</span></p>
                </div>
                <div className="w-px h-10 bg-gwm-border" />
                <div className="text-center">
                  <p className="text-[0.6rem] text-gwm-gray tracking-widest uppercase mb-1">Prazo</p>
                  <p className="text-xl font-black text-gwm-dark">até 100<span className="text-xs font-normal text-gwm-gray"> meses</span></p>
                </div>
                <div className="w-px h-10 bg-gwm-border" />
                <div className="text-center">
                  <p className="text-[0.6rem] text-gwm-gray tracking-widest uppercase mb-1">Juros</p>
                  <p className="text-xl font-black text-gwm-red">0%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
