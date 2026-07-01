"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { whatsappLink } from "@/lib/utils";
import { siteConfig } from "@/lib/data";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-gwm-dark">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/vehicles/h6gt-dark.webp"
          alt="Haval H6 GT"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-28 pt-40 w-full">
        <div className="max-w-2xl">
          <motion.div {...fadeUp(0.2)} className="flex items-center gap-4 mb-8">
            <div className="w-8 h-px bg-gwm-red" />
            <span className="text-gwm-red text-[0.65rem] font-bold tracking-[0.35em] uppercase">
              Consultor Especialista GWM
            </span>
          </motion.div>

          <motion.h1 {...fadeUp(0.35)} className="heading-xl text-white mb-6">
            A GWM ideal<br />para você.
          </motion.h1>

          <motion.p {...fadeUp(0.5)} className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg font-light">
            Atendimento personalizado, consultoria especializada e condições exclusivas com Alex Messias.
          </motion.p>

          <motion.div {...fadeUp(0.65)} className="flex flex-wrap gap-4">
            <a href="#veiculos" className="bg-white text-[#111] text-[0.7rem] font-bold tracking-widest uppercase px-7 py-4 hover:bg-white/90 transition-colors">
              Ver Veículos
            </a>
            <a
              href={whatsappLink(siteConfig.whatsapp, "Olá Alex! Gostaria de mais informações sobre os veículos GWM.")}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/30 text-white text-[0.7rem] font-bold tracking-widest uppercase px-7 py-4 hover:bg-white/10 hover:border-white/60 transition-all"
            >
              Falar no WhatsApp
            </a>
          </motion.div>

          <motion.div {...fadeUp(0.85)} className="flex gap-10 mt-16 pt-10 border-t border-white/10">
            {[
              { value: "300+", label: "Clientes" },
              { value: "5★", label: "Avaliação" },
              { value: "3", label: "Cidades" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-white/40 text-[0.6rem] tracking-widest uppercase mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1"
      >
        <span className="text-white/30 text-[0.6rem] tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>
          <ChevronDown size={16} className="text-white/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
