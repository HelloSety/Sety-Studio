'use client';

import { motion } from 'framer-motion';
import { PROCESS_STEPS } from '@/lib/data';

export default function Process() {
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
            <p className="eyebrow mb-3">Como trabalhamos</p>
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
                Processo.{' '}
                <span style={{ color: 'rgba(255,255,255,0.22)' }}>Sem improviso.</span>
              </h2>
              <p className="text-white/30 text-sm leading-relaxed max-w-xs">
                Metodologia testada que elimina retrabalho e garante resultado previsível.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Mobile: stacked cards. Desktop: 4-col grid with border trick */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-0 md:divide-x md:divide-white/[0.06] border border-white/[0.06] md:border-white/[0.06] rounded-2xl overflow-hidden">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              className="bg-[#000] p-7 md:p-8 group hover:bg-white/[0.02] transition-colors duration-300 border-b border-white/[0.06] last:border-b-0 md:border-b-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="text-white/08 group-hover:text-white/14 transition-colors mb-6"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 900,
                  fontSize: '2.5rem',
                  letterSpacing: '-0.05em',
                  lineHeight: 1,
                }}
              >
                {step.n}
              </div>
              <h3
                className="text-white mb-2.5"
                style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '-0.02em' }}
              >
                {step.title}
              </h3>
              <p className="text-white/32 text-sm leading-relaxed group-hover:text-white/45 transition-colors">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
