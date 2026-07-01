'use client';

import { motion } from 'framer-motion';
import { SERVICES } from '@/lib/data';

const ICONS = [
  <svg key="1" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  <svg key="2" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  <svg key="3" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
  <svg key="4" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  <svg key="5" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
  <svg key="6" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
];

export default function Services() {
  return (
    <section id="services" className="section-padding border-t border-white/[0.06]">
      <div className="container-main">

        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="eyebrow mb-3">Serviços</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 900,
                  fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                  letterSpacing: '-0.04em',
                  color: 'white',
                  lineHeight: 1,
                }}
              >
                O que construímos.
              </h2>
              <p className="text-white/30 text-sm leading-relaxed max-w-xs">
                Cada serviço resolve um problema específico — sem pacote genérico.
              </p>
            </div>
          </motion.div>
        </div>

        {/* List */}
        <div className="divide-y divide-white/[0.05]">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.id}
              className="group py-5 transition-colors duration-200 hover:bg-white/[0.02] rounded-xl px-3 -mx-3"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
            >
              {/* Mobile layout: icon + title row, desc below */}
              <div className="flex items-center gap-3 mb-2 md:mb-0 md:hidden">
                <div className="w-8 h-8 flex-shrink-0 rounded-lg border border-white/[0.07] flex items-center justify-center text-white/30">
                  {ICONS[i]}
                </div>
                <h3
                  className="text-white/85 text-[0.9375rem] flex-1"
                  style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, letterSpacing: '-0.02em' }}
                >
                  {s.title}
                </h3>
                <svg className="flex-shrink-0 opacity-20" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
              <p className="text-white/32 text-sm leading-relaxed pl-11 md:hidden">{s.desc}</p>

              {/* Desktop layout: single row */}
              <div className="hidden md:flex md:items-center gap-5">
                <div className="w-8 h-8 flex-shrink-0 rounded-lg border border-white/[0.07] flex items-center justify-center text-white/25 group-hover:text-white/55 group-hover:border-white/[0.12] transition-all">
                  {ICONS[i]}
                </div>
                <span
                  className="text-white/10 group-hover:text-white/20 transition-colors flex-shrink-0 w-5 text-center"
                  style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.1em' }}
                >
                  {s.id}
                </span>
                <h3
                  className="flex-shrink-0 w-52 text-white/80 group-hover:text-white transition-colors"
                  style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.02em' }}
                >
                  {s.title}
                </h3>
                <p className="flex-1 text-white/30 text-sm leading-relaxed group-hover:text-white/50 transition-colors">
                  {s.desc}
                </p>
                <p className="flex-shrink-0 text-white/18 text-[11px] hidden lg:block text-right w-32">
                  {s.detail}
                </p>
                <svg
                  className="flex-shrink-0 opacity-0 group-hover:opacity-30 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
                >
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
