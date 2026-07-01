'use client';

import { motion } from 'framer-motion';

const ITEMS = [
  'Empório Norte Belém', 'Clínica Premium', 'Studio Jurídico',
  'Construtora Elite', 'Performance Academy', 'Marka Sports',
  'Imóveis Pro', 'Solar Energy BR', 'Advocacia Freitas',
  'Fitness Club', 'Emprório Norte Belém', 'Clínica Premium',
  'Studio Jurídico', 'Construtora Elite', 'Performance Academy', 'Marka Sports',
];

export default function Clients() {
  return (
    <section className="py-16 border-t border-white/[0.06]">
      <div className="container-main mb-8">
        <p className="eyebrow text-white/25">Empresas que confiam na Sety</p>
      </div>

      <div className="marquee-container">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...ITEMS, ...ITEMS].map((name, i) => (
            <div
              key={i}
              className="flex items-center gap-10 px-10"
            >
              <span
                className="text-white/20 font-semibold text-sm tracking-widest uppercase whitespace-nowrap"
                style={{ fontFamily: 'var(--font-montserrat)' }}
              >
                {name}
              </span>
              <span className="w-1 h-1 bg-white/10 rounded-full flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
