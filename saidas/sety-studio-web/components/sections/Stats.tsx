'use client';

import { motion, useInView, animate } from 'framer-motion';
import { useRef, useEffect } from 'react';

const STATS = [
  { value: 50, suffix: '+', label: 'Projetos entregues' },
  { value: 10, prefix: 'R$', suffix: 'M+', label: 'Gerado para clientes' },
  { value: 98, suffix: '%', label: 'Taxa de satisfação' },
  { value: 3, suffix: ' dias', label: 'Prazo médio' },
];

function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const ctrl = animate(0, value, {
      duration: 1.6,
      ease: [0.25, 1, 0.5, 1],
      onUpdate(v) {
        if (ref.current) ref.current.textContent = prefix + Math.round(v).toString() + suffix;
      },
    });
    return ctrl.stop;
  }, [inView, value, prefix, suffix]);

  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export default function Stats() {
  return (
    <section className="border-t border-white/[0.06]">
      <div className="container-main">
        {/* 2×2 on mobile, 4×1 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className={[
                'py-8 px-5 md:py-12 md:px-8',
                // right border on left column items
                i % 2 === 0 ? 'border-r border-white/[0.06]' : '',
                // top border on bottom row items (mobile)
                i >= 2 ? 'border-t border-white/[0.06] md:border-t-0' : '',
                // left border on all except first (desktop)
                i > 0 ? 'md:border-l md:border-white/[0.06] md:border-r-0' : '',
              ].join(' ')}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 900,
                  fontSize: 'clamp(1.75rem, 3.5vw, 3rem)',
                  letterSpacing: '-0.05em',
                  lineHeight: 1,
                  color: 'white',
                  marginBottom: '0.375rem',
                }}
              >
                <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <p className="eyebrow text-white/28 text-[10px] leading-snug">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
