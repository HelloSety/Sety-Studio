'use client';

import { motion } from 'framer-motion';
import { TESTIMONIALS } from '@/lib/data';

export default function Testimonials() {
  return (
    <section className="section-padding border-t border-white/[0.06]">
      <div className="container-main">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="eyebrow mb-3">Clientes</p>
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
              O que dizem<br />
              <span style={{ color: 'rgba(255,255,255,0.22)' }}>sobre nós.</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              className="relative bg-white/[0.02] border border-white/[0.07] hover:border-white/[0.12] rounded-2xl p-7 transition-all duration-300 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, s) => (
                  <svg key={s} width="11" height="11" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-white/65 text-[14px] leading-relaxed mb-7 group-hover:text-white/80 transition-colors">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    fontFamily: 'var(--font-montserrat)',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  {t.initial}
                </div>
                <div>
                  <p
                    className="text-white/70 text-sm font-semibold"
                    style={{ fontFamily: 'var(--font-montserrat)', letterSpacing: '-0.01em' }}
                  >
                    {t.name}
                  </p>
                  <p className="text-white/30 text-xs">{t.role} · {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
