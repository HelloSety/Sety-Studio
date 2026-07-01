"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { whatsappLink } from "@/lib/utils";
import { siteConfig } from "@/lib/data";

const services = [
  "Consultoria especializada",
  "Atendimento personalizado",
  "Test Drive facilitado",
  "Financiamento",
  "Consórcio",
  "Avaliação de usados",
  "Pós-venda",
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function About() {
  return (
    <section id="sobre" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Foto */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="relative"
          >
            <div className="relative aspect-3/4 max-w-sm overflow-hidden">
              <Image
                src="/images/alex/foto-4.jpg"
                alt="Alex Messias — Consultor GWM"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gwm-red pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gwm-red pointer-events-none" />
            </div>

            <div className="absolute -bottom-6 -right-4 bg-gwm-dark text-white px-7 py-5 shadow-xl">
              <p className="text-3xl font-black text-gwm-red">5★</p>
              <p className="text-[#888] text-[0.65rem] tracking-widest uppercase mt-0.5">Google</p>
            </div>

            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gwm-red flex flex-col items-center justify-center">
              <p className="text-white font-black text-xl leading-none">10+</p>
              <p className="text-white/70 text-[0.55rem] tracking-widest uppercase leading-tight text-center">anos de mercado</p>
            </div>
          </motion.div>

          {/* Conteúdo */}
          <div>
            <motion.div {...fadeUp(0.1)} className="flex items-center gap-4 mb-8">
              <div className="w-8 h-px bg-gwm-red" />
              <span className="text-gwm-red text-[0.65rem] font-bold tracking-[0.3em] uppercase">
                Sobre Alex Messias
              </span>
            </motion.div>

            <motion.h2 {...fadeUp(0.2)} className="heading-lg text-gwm-dark mb-6">
              Mais que vender carros.
              <br />
              <span className="text-gwm-red">Criar experiências.</span>
            </motion.h2>

            <motion.div {...fadeUp(0.3)} className="space-y-4 text-gwm-gray text-[0.95rem] leading-relaxed mb-10">
              <p>
                Com anos de experiência no mercado automotivo, Alex Messias se tornou referência em consultoria GWM no interior de São Paulo.
              </p>
              <p>
                Especialista em veículos híbridos, plug-in e elétricos — ele encontra o veículo certo para cada estilo de vida, rotina e orçamento.
              </p>
              <p>
                Atendimento sem pressão, consultoria completa e pós-venda de verdade.
              </p>
            </motion.div>

            <motion.div {...fadeUp(0.4)} className="grid grid-cols-2 gap-3 mb-10">
              {services.map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-gwm-red shrink-0" />
                  <span className="text-gwm-gray-mid text-sm">{s}</span>
                </div>
              ))}
            </motion.div>

            <motion.div {...fadeUp(0.5)} className="flex flex-wrap gap-5 mb-10">
              {siteConfig.locations.map((loc) => (
                <div key={loc} className="flex items-center gap-1.5 text-gwm-gray text-sm">
                  <MapPin size={13} className="text-gwm-red" />
                  {loc}
                </div>
              ))}
            </motion.div>

            <motion.div {...fadeUp(0.6)} className="flex flex-wrap gap-3">
              <Link
                href="/alex"
                className="inline-flex items-center gap-3 bg-gwm-dark text-white text-[0.7rem] font-bold tracking-widest uppercase px-7 py-4 hover:bg-gwm-charcoal transition-all duration-300"
              >
                Saiba mais sobre Alex
                <ArrowRight size={14} />
              </Link>
              <a
                href={whatsappLink(siteConfig.whatsapp, "Olá Alex! Quero conhecer melhor seu trabalho e os veículos GWM disponíveis.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 border border-gwm-border text-gwm-gray-mid text-[0.7rem] font-bold tracking-widest uppercase px-7 py-4 hover:border-gwm-dark hover:text-gwm-dark transition-all duration-300"
              >
                WhatsApp
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
