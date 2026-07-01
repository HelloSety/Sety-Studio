"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { testimonials } from "@/lib/data";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-32 bg-gwm-light">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div {...fadeUp()} className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 h-px bg-gwm-red" />
            <span className="text-gwm-red text-[0.65rem] font-bold tracking-[0.3em] uppercase">Depoimentos</span>
            <div className="w-8 h-px bg-gwm-red" />
          </div>
          <h2 className="heading-lg text-gwm-dark">
            O que dizem
            <br /><span className="text-gwm-red">os clientes</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              {...fadeUp(i * 0.08)}
              className="group bg-white p-8 hover:shadow-lg transition-shadow duration-300 relative"
            >
              <span className="absolute top-4 right-6 text-6xl font-black text-gwm-light select-none leading-none">"</span>

              <div className="flex gap-0.5 mb-5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={13} className="text-gwm-red fill-gwm-red" />
                ))}
              </div>

              <p className="text-gwm-gray text-sm leading-relaxed mb-6 relative z-10">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3 border-t border-gwm-border pt-5">
                <div className="w-9 h-9 bg-gwm-light flex items-center justify-center text-gwm-dark font-bold text-sm shrink-0">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-gwm-dark font-bold text-sm">{t.name}</p>
                  <p className="text-gwm-gray text-[0.7rem]">{t.location} · {t.vehicle}</p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gwm-red group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>

        <motion.p {...fadeUp(0.4)} className="text-center text-gwm-gray text-xs mt-10">
          Avaliações reais de clientes atendidos por Alex Messias
        </motion.p>
      </div>
    </section>
  );
}
