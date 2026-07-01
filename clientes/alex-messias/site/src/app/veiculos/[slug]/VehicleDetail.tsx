"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import type { Vehicle } from "@/lib/data";
import { whatsappLink, cn } from "@/lib/utils";
import { siteConfig } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

export default function VehicleDetail({ vehicle }: { vehicle: Vehicle }) {
  const [activeImg, setActiveImg] = useState(0);
  const [activeColor, setActiveColor] = useState(0);

  const displayImage = vehicle.colors[activeColor]?.image ?? vehicle.gallery[activeImg];
  const allImages = [...vehicle.gallery];

  const prevImg = () => setActiveImg((i) => (i - 1 + allImages.length) % allImages.length);
  const nextImg = () => setActiveImg((i) => (i + 1) % allImages.length);

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-white min-h-screen">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs text-gwm-gray">
          <Link href="/" className="hover:text-gwm-dark transition-colors">Início</Link>
          <span>/</span>
          <Link href="/#veiculos" className="hover:text-gwm-dark transition-colors">Veículos</Link>
          <span>/</span>
          <span className="text-gwm-dark">{vehicle.name} {vehicle.version}</span>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">

            {/* LEFT — Gallery */}
            <div>
              {/* Main image */}
              <div className="relative aspect-video bg-gwm-light overflow-hidden mb-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={displayImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={displayImage}
                      alt={`${vehicle.name} ${vehicle.version}`}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Nav arrows */}
                <button
                  onClick={prevImg}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={nextImg}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                >
                  <ChevronRight size={18} />
                </button>

                {/* Counter */}
                <span className="absolute bottom-3 left-3 bg-gwm-dark/70 text-white text-[0.65rem] tracking-widest px-2 py-1">
                  {activeImg + 1} / {allImages.length}
                </span>

                {vehicle.badge && (
                  <span className="absolute top-3 right-3 bg-gwm-red text-white text-[0.6rem] font-bold tracking-widest uppercase px-3 py-1">
                    {vehicle.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveImg(i); setActiveColor(-1); }}
                    className={cn(
                      "relative shrink-0 w-20 h-14 overflow-hidden border-2 transition-all",
                      activeImg === i && activeColor === -1
                        ? "border-gwm-dark"
                        : "border-transparent hover:border-gwm-gray-light"
                    )}
                  >
                    <Image src={img} alt={`Foto ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>

              {/* Highlights */}
              <div className="mt-10">
                <h3 className="text-gwm-dark font-black text-sm uppercase tracking-wide mb-5">Equipamentos</h3>
                <div className="grid grid-cols-2 gap-3">
                  {vehicle.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-2.5">
                      <CheckCircle2 size={14} className="text-gwm-red shrink-0 mt-0.5" />
                      <span className="text-gwm-gray text-sm">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs table */}
              <div className="mt-10">
                <h3 className="text-gwm-dark font-black text-sm uppercase tracking-wide mb-5">Ficha Técnica</h3>
                <div className="border border-gwm-border overflow-hidden">
                  {vehicle.specs.map((s, i) => (
                    <div
                      key={s.label}
                      className={`flex items-center justify-between px-5 py-3.5 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gwm-light/50"}`}
                    >
                      <span className="text-gwm-gray">{s.label}</span>
                      <span className="text-gwm-dark font-semibold">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT — Sticky info panel */}
            <div className="lg:sticky lg:top-24">
              {/* Category */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-gwm-red" />
                <span className="text-gwm-red text-[0.65rem] font-bold tracking-widest uppercase">
                  {vehicle.category}
                </span>
              </div>

              <h1 className="text-3xl font-black text-gwm-dark leading-tight mb-1">
                {vehicle.name}
              </h1>
              <p className="text-gwm-gray text-sm mb-5">{vehicle.version}</p>

              <p className="text-gwm-gray text-[0.95rem] leading-relaxed mb-7">{vehicle.description}</p>

              {/* Price */}
              <div className="bg-gwm-light p-5 mb-7">
                <p className="text-gwm-gray text-[0.65rem] tracking-widest uppercase mb-1">Preço</p>
                <p className="text-2xl font-black text-gwm-dark">{vehicle.price}</p>
                <p className="text-gwm-gray text-xs mt-1">{vehicle.priceNote}</p>
              </div>

              {/* Color selector */}
              {vehicle.colors.length > 0 && (
                <div className="mb-7">
                  <p className="text-gwm-gray text-[0.65rem] font-bold tracking-widest uppercase mb-3">
                    Cor — {vehicle.colors[Math.max(0, activeColor)].name}
                  </p>
                  <div className="flex gap-2.5">
                    {vehicle.colors.map((c, i) => (
                      <button
                        key={c.name}
                        onClick={() => { setActiveColor(i); setActiveImg(0); }}
                        title={c.name}
                        className={cn(
                          "w-7 h-7 rounded-full border-2 transition-all",
                          activeColor === i
                            ? "border-gwm-dark scale-110 shadow-md"
                            : "border-transparent ring-1 ring-gwm-border hover:ring-gwm-gray-light"
                        )}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="space-y-3">
                <a
                  href={whatsappLink(siteConfig.whatsapp, `Olá Alex! Tenho interesse no ${vehicle.name} ${vehicle.version}. Pode me enviar mais informações?`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-gwm-red text-white text-[0.7rem] font-bold tracking-widest uppercase px-6 py-4 hover:bg-[#c5000f] transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Solicitar Proposta
                </a>
                <a
                  href={whatsappLink(siteConfig.whatsapp, `Olá Alex! Quero agendar um test drive do ${vehicle.name} ${vehicle.version}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full border border-gwm-dark text-gwm-dark text-[0.7rem] font-bold tracking-widest uppercase px-6 py-4 hover:bg-gwm-dark hover:text-white transition-all"
                >
                  Agendar Test Drive
                </a>
                <Link
                  href="/#veiculos"
                  className="flex items-center justify-center gap-2 w-full border border-gwm-border text-gwm-gray text-[0.7rem] font-bold tracking-widest uppercase px-6 py-3.5 hover:border-gwm-gray-light transition-colors"
                >
                  <ArrowLeft size={14} />
                  Ver todos os modelos
                </Link>
              </div>

              {/* Guarantee */}
              <div className="mt-6 p-4 border border-gwm-border bg-gwm-light/50">
                <p className="text-gwm-gray text-xs leading-relaxed">
                  <strong className="text-gwm-dark">Garantia GWM:</strong> 5 anos ou 100.000 km, o que ocorrer primeiro. Assistência técnica autorizada em toda a rede GWM.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  );
}
