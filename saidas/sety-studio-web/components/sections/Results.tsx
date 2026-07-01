'use client';

import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const STATS = [
  { value: 50, suffix: '+', label: 'Projetos entregues', sub: 'Em 12 meses de operação' },
  { value: 10, prefix: 'R$', suffix: 'M+', label: 'Gerados para clientes', sub: 'Em receita direta e indireta' },
  { value: 98, suffix: '%', label: 'Taxa de satisfação', sub: 'NPS verificado pós-entrega' },
  { value: 3, suffix: ' dias', label: 'Prazo médio', sub: 'Do briefing ao ar' },
];

function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

export default function Results() {
  return (
    <section id="results" className="section-padding border-t border-white/[0.06] bg-[#050505]">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            className="eyebrow mb-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Números reais
          </motion.p>
          <motion.h2
            className="heading-xl text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Resultados que
            <br />
            <span className="text-white/25">falam por si.</span>
          </motion.h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden mb-16">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              className="bg-[#050505] p-8 md:p-10 text-center group hover:bg-[#0a0a0a] transition-colors duration-300"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div
                className="counter-value text-white mb-3"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
              >
                <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div
                className="text-white mb-1"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  letterSpacing: '-0.01em',
                }}
              >
                {stat.label}
              </div>
              <p className="text-white/25 text-xs">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Quote */}
        <motion.div
          className="relative max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p
            className="text-white/40 leading-relaxed"
            style={{ fontSize: 'clamp(1.125rem, 2.5vw, 1.5rem)', fontStyle: 'italic' }}
          >
            "Não vendemos design. Vendemos o que o design gera:
            <br />
            <span className="text-white/70">clientes, autoridade e crescimento previsível."</span>
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="w-6 h-px bg-white/20" />
            <span className="eyebrow text-white/25">Seven · Fundador, Sety Studio</span>
            <span className="w-6 h-px bg-white/20" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
