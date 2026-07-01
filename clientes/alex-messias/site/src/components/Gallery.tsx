"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { galleryImages } from "@/lib/data";

export default function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);

  const prev = () => {
    if (selected === null) return;
    setSelected((selected - 1 + galleryImages.length) % galleryImages.length);
  };
  const next = () => {
    if (selected === null) return;
    setSelected((selected + 1) % galleryImages.length);
  };

  return (
    <section id="galeria" className="py-32 bg-gwm-light">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <div className="flex items-center gap-4 mb-5">
            <div className="w-8 h-px bg-gwm-red" />
            <span className="text-gwm-red text-[0.65rem] font-bold tracking-[0.3em] uppercase">Galeria</span>
          </div>
          <h2 className="heading-lg text-gwm-dark">
            A linha GWM<br />
            <span className="text-gwm-red">em detalhes</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-2 space-y-2">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="break-inside-avoid cursor-pointer group relative overflow-hidden"
              onClick={() => setSelected(i)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={600}
                height={i % 3 === 0 ? 750 : 400}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gwm-dark/0 group-hover:bg-gwm-dark/30 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white text-[0.65rem] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Ampliar
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors"
              onClick={() => setSelected(null)}
            >
              <X size={24} />
            </button>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); prev(); }}
            >
              <ChevronLeft size={36} />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              onClick={(e) => { e.stopPropagation(); next(); }}
            >
              <ChevronRight size={36} />
            </button>

            <motion.div
              key={selected}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[85vh] w-full mx-16"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={galleryImages[selected].src}
                alt={galleryImages[selected].alt}
                width={1400}
                height={900}
                className="w-full h-full object-contain max-h-[85vh]"
              />
            </motion.div>

            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/30 text-[0.6rem] tracking-widest uppercase">
              {selected + 1} / {galleryImages.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
