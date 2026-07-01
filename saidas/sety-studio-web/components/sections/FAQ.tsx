'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FAQS } from '@/lib/data';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="section-padding border-t border-white/[0.06]">
      <div className="container-main">

        <div className="flex flex-col md:flex-row gap-20">

          {/* Left sticky */}
          <div className="md:w-60 flex-shrink-0">
            <motion.div
              className="md:sticky md:top-28"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="eyebrow mb-3">FAQ</p>
              <h2
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 900,
                  fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                  letterSpacing: '-0.04em',
                  color: 'white',
                  lineHeight: 1.05,
                }}
              >
                Perguntas<br />frequentes.
              </h2>

              <div className="mt-8">
                <p className="text-white/28 text-sm mb-4">Ainda tem dúvidas?</p>
                <a
                  href="https://wa.me/5519988090110"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[13px] font-semibold text-white/45 hover:text-white border border-white/[0.08] hover:border-white/22 px-4 py-2.5 rounded-lg transition-all"
                  style={{ cursor: 'none' }}
                >
                  Perguntar no WhatsApp
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Accordion */}
          <div className="flex-1 divide-y divide-white/[0.05]">
            {FAQS.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-start justify-between gap-4 py-5 text-left group"
                  style={{ cursor: 'none' }}
                >
                  <span
                    className={`text-[14px] font-semibold leading-snug transition-colors ${open === i ? 'text-white' : 'text-white/55 group-hover:text-white/85'}`}
                    style={{ fontFamily: 'var(--font-montserrat)', letterSpacing: '-0.015em' }}
                  >
                    {f.q}
                  </span>

                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.22 }}
                    className="flex-shrink-0 mt-0.5 text-white/22 group-hover:text-white/45 transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-white/42 text-sm leading-relaxed pb-5 max-w-prose">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
