"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { vehicles, siteConfig } from "@/lib/data";
import { whatsappLink, cn } from "@/lib/utils";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

function VehicleCard({ vehicle, index }: { vehicle: (typeof vehicles)[0]; index: number }) {
  const [activeColor, setActiveColor] = useState(0);
  const currentImage = vehicle.colors[activeColor]?.image ?? vehicle.hero;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="group bg-white border border-gwm-border hover:border-gwm-gray-light hover:shadow-xl transition-all duration-500"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video bg-gwm-light">
        <Image
          src={currentImage}
          alt={vehicle.name}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {vehicle.badge && (
          <div className="absolute top-4 left-4 bg-gwm-red text-white text-[0.6rem] font-bold tracking-widest uppercase px-3 py-1">
            {vehicle.badge}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-gwm-gray text-[0.65rem] font-semibold tracking-widest uppercase mb-1">
              {vehicle.version}
            </p>
            <h3 className="text-2xl font-black text-gwm-dark tracking-tight">
              {vehicle.name}
            </h3>
          </div>
          <div className="text-right">
            <p className="text-gwm-gray text-[0.6rem] tracking-widest uppercase">Preço</p>
            <p className="text-gwm-dark font-bold text-sm mt-0.5">{vehicle.price}</p>
          </div>
        </div>

        <p className="text-gwm-gray text-sm leading-relaxed mb-6">{vehicle.description}</p>

        {/* Color selector */}
        {vehicle.colors.length > 1 && (
          <div className="mb-6">
            <p className="text-[0.6rem] font-semibold tracking-widest uppercase text-gwm-gray mb-3">
              Cor — {vehicle.colors[activeColor].name}
            </p>
            <div className="flex gap-2">
              {vehicle.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setActiveColor(i)}
                  title={c.name}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 transition-all duration-200",
                    activeColor === i
                      ? "border-gwm-dark scale-110 shadow-sm"
                      : "border-gwm-border hover:border-gwm-gray-light"
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-2">
          <Link
            href={`/veiculos/${vehicle.slug}`}
            className="flex items-center justify-between bg-gwm-dark text-white text-[0.7rem] font-bold tracking-widest uppercase px-5 py-3.5 hover:bg-gwm-charcoal transition-colors group/btn"
          >
            Ver Detalhes
            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <a
              href={whatsappLink(siteConfig.whatsapp, `Olá Alex! Quero uma proposta do ${vehicle.name} ${vehicle.version}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gwm-border text-gwm-gray-mid text-[0.65rem] font-bold tracking-widest uppercase px-4 py-3 text-center hover:border-gwm-dark hover:text-gwm-dark transition-all"
            >
              Solicitar Proposta
            </a>
            <a
              href={whatsappLink(siteConfig.whatsapp, `Olá Alex! Quero agendar um test drive do ${vehicle.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gwm-border text-gwm-gray-mid text-[0.65rem] font-bold tracking-widest uppercase px-4 py-3 text-center hover:border-gwm-red hover:text-gwm-red transition-all"
            >
              Test Drive
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Vehicles() {
  return (
    <section id="veiculos" className="py-32 bg-gwm-light">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div {...fadeUp()} className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px bg-gwm-red" />
              <span className="text-gwm-red text-[0.65rem] font-bold tracking-[0.3em] uppercase">Linha GWM</span>
            </div>
            <h2 className="heading-lg text-gwm-dark">
              Veículos<br />
              <span className="text-gwm-red">Disponíveis</span>
            </h2>
          </div>
          <p className="text-gwm-gray text-sm max-w-xs leading-relaxed">
            Híbridos, plug-in e elétricos. Encontre o modelo ideal para o seu estilo de vida e rotina.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {vehicles.map((v, i) => (
            <VehicleCard key={v.id} vehicle={v} index={i} />
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div {...fadeUp(0.3)} className="mt-16 text-center">
          <p className="text-gwm-gray text-sm mb-5">
            Não encontrou o que procura? Consulte disponibilidade de outros modelos.
          </p>
          <a
            href={whatsappLink(siteConfig.whatsapp, "Olá Alex! Preciso de informações sobre outros modelos GWM.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border border-gwm-dark text-gwm-dark text-[0.7rem] font-bold tracking-widest uppercase px-7 py-4 hover:bg-gwm-dark hover:text-white transition-all"
          >
            Consultar Outros Modelos
            <ArrowRight size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
