'use client';

import { motion } from 'framer-motion';
import { DIFFERENTIALS } from '@/lib/data';

const ICONS = [
  <svg key="1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
  <svg key="2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  <svg key="3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  <svg key="4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  <svg key="5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  <svg key="6" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
];

export default function Differentials() {
  return (
    <section className="section-padding border-t border-white/[0.06]">
      <div className="container-main">

        <div className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="eyebrow mb-3">Diferenciais</p>
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
              Por que a Sety.
            </h2>
          </motion.div>
        </div>

        {/* Responsive grid: 1 col mobile → 2 col md → 3 col lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {DIFFERENTIALS.map((d, i) => (
            <motion.div
              key={d.title}
              className="relative bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] rounded-xl p-6 group hover:bg-white/[0.03] transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
            >
              {/* Subtle hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 100%)' }}
              />

              <div className="relative z-10">
                <div className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-white/28 group-hover:text-white/55 group-hover:border-white/[0.14] transition-all duration-300 mb-5">
                  {ICONS[i]}
                </div>
                <h3
                  className="text-white/85 group-hover:text-white transition-colors mb-2"
                  style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.02em' }}
                >
                  {d.title}
                </h3>
                <p className="text-white/32 text-sm leading-relaxed group-hover:text-white/48 transition-colors">
                  {d.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
