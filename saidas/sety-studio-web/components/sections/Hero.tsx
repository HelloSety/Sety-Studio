'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';

const SITES = [
  { nicho: 'alex-messias',  label: 'Automotivo',    nome: 'Alex Messias GWM',       cor: '#E30613', desc: '+300 clientes · 5★ Google' },
  { nicho: 'odontologia',   label: 'Odontologia',   nome: 'Prime Odonto',           cor: '#00B67A', desc: '+340% em agendamentos em 60 dias' },
  { nicho: 'estetica',      label: 'Estética',      nome: 'Aura Estética Premium',  cor: '#C9A96E', desc: 'R$280k nos primeiros 90 dias' },
  { nicho: 'energia-solar', label: 'Energia Solar', nome: 'SolarMax Energia',       cor: '#22C55E', desc: '85 projetos fechados em 4 meses' },
  { nicho: 'advocacia',     label: 'Advocacia',     nome: 'Valença & Assoc.',       cor: '#C9A73D', desc: '+80% no ticket médio dos contratos' },
  { nicho: 'imobiliaria',   label: 'Imobiliária',   nome: 'Prime Select Imóveis',   cor: '#6B7280', desc: '3× mais leads, custo 45% menor' },
];

const D = 1.6;

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % SITES.length), 3600);
    return () => clearInterval(t);
  }, []);

  const site = SITES[active];

  return (
    <section ref={ref} id="hero" className="relative min-h-screen flex items-center" style={{ overflow: 'clip' }}>

      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        opacity: 0.022,
        backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />

      {/* Ambient glow */}
      <AnimatePresence mode="wait">
        <motion.div key={site.nicho} className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse 52% 65% at 78% 48%, ${site.cor}13 0%, transparent 68%)`,
          }} />
        </motion.div>
      </AnimatePresence>

      <motion.div className="container-main relative z-10 w-full" style={{ y, opacity }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-center pt-28 pb-12">

          {/* ── LEFT ── */}
          <div className="min-w-0">
            <motion.div className="flex items-center gap-3 mb-9"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: D }}>
              <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em' }}>SETY STUDIO</span>
              <span className="w-px h-3 bg-white/15" />
              <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.18)', letterSpacing: '0.18em' }}>AGÊNCIA DIGITAL</span>
            </motion.div>

            <div className="mb-7">
              {[
                { text: 'Sites que vendem.', dim: false },
                { text: 'Anúncios que',      dim: false },
                { text: 'convertem.',        dim: true  },
              ].map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.div
                    initial={{ y: '110%' }} animate={{ y: '0%' }}
                    transition={{ duration: 1.0, delay: D + 0.06 + i * 0.13, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      fontFamily: 'var(--font-montserrat)', fontWeight: 900,
                      fontSize: 'clamp(2.4rem, 5vw, 5rem)', lineHeight: 1.02,
                      letterSpacing: '-0.05em',
                      color: line.dim ? 'rgba(255,255,255,0.18)' : 'white',
                    }}>
                    {line.text}
                  </motion.div>
                </div>
              ))}
            </div>

            <motion.p className="text-white/38 text-[0.95rem] leading-relaxed mb-8 max-w-[340px]"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: D + 0.52 }}>
              Criamos a presença digital que clínicas, imobiliárias, advogados e negócios de alto valor precisam para crescer online.
            </motion.p>

            <motion.div className="flex flex-wrap items-center gap-3 mb-10"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: D + 0.62 }}>
              <a href="#portfolio"
                className="inline-flex items-center gap-2 text-[13px] font-bold text-black bg-white hover:bg-white/90 px-6 py-3 rounded-lg transition-all"
                style={{ cursor: 'none', fontFamily: 'var(--font-montserrat)' }}>
                Ver projetos
              </a>
              <a href="https://wa.me/5519988090110" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-white/45 hover:text-white border border-white/[0.1] hover:border-white/25 px-6 py-3 rounded-lg transition-all"
                style={{ cursor: 'none' }}>
                Falar agora →
              </a>
            </motion.div>

            <motion.div className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: D + 0.8 }}>
              {SITES.map((s, i) => (
                <button key={s.nicho} onClick={() => setActive(i)}
                  className="text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-md border transition-all duration-300"
                  style={{
                    cursor: 'none', fontFamily: 'var(--font-montserrat)',
                    background:  active === i ? s.cor : 'transparent',
                    color:       active === i ? '#000' : 'rgba(255,255,255,0.30)',
                    borderColor: active === i ? s.cor : 'rgba(255,255,255,0.08)',
                  }}>
                  {s.label}
                </button>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT — screenshot showcase ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: D + 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-col items-center min-w-0"
          >
            {/* Screenshot card */}
            <div
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                width: '100%',
                maxWidth: '580px',
                aspectRatio: '16 / 10',
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.11)',
                boxShadow: hovered
                  ? `0 0 0 1px rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.4), 0 24px 60px rgba(0,0,0,0.5), 0 0 80px ${site.cor}18`
                  : '0 0 0 1px rgba(255,255,255,0.04), 0 4px 8px rgba(0,0,0,0.35), 0 16px 48px rgba(0,0,0,0.55), 0 40px 80px rgba(0,0,0,0.35)',
                background: '#050505',
                transform: hovered
                  ? 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1.015)'
                  : 'perspective(1200px) rotateX(3deg) rotateY(-7deg) scale(0.97)',
                transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div key={site.nicho} style={{ position: 'absolute', inset: 0 }}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.38, ease: 'easeInOut' }}>
                  <Image
                    src={`/portfolio/${site.nicho}/screenshots/thumb.png`}
                    alt={site.nome}
                    fill
                    style={{ objectFit: 'contain', objectPosition: 'top center', background: '#050505' }}
                    sizes="580px"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Bottom overlay */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '48px 16px 14px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                pointerEvents: 'none',
              }}>
                <AnimatePresence mode="wait">
                  <motion.span key={site.nicho}
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    style={{
                      color: site.cor, background: `${site.cor}20`,
                      fontSize: '9px', fontWeight: 800, fontFamily: 'var(--font-montserrat)',
                      letterSpacing: '0.12em', padding: '4px 9px', borderRadius: '5px',
                      border: `1px solid ${site.cor}35`,
                    }}>
                    {site.label.toUpperCase()}
                  </motion.span>
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  <motion.span key={site.desc}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    style={{ color: 'rgba(255,255,255,0.32)', fontSize: '10px', fontFamily: 'var(--font-montserrat)' }}>
                    {site.desc}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Info + dots */}
            <div style={{
              width: '100%', maxWidth: '580px', marginTop: '14px', padding: '0 2px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <AnimatePresence mode="wait">
                <motion.p key={site.nome}
                  initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.28 }}
                  style={{
                    fontFamily: 'var(--font-montserrat)', fontWeight: 700,
                    fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '-0.01em',
                  }}>
                  {site.nome}
                </motion.p>
              </AnimatePresence>
              <div style={{ display: 'flex', gap: '5px' }}>
                {SITES.map((s, i) => (
                  <button key={s.nicho} onClick={() => setActive(i)} style={{
                    cursor: 'none', border: 'none', padding: 0, borderRadius: '2px',
                    height: '4px',
                    width: active === i ? '20px' : '4px',
                    background: active === i ? s.cor : 'rgba(255,255,255,0.12)',
                    transition: 'all 0.45s ease',
                  }} />
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* Specialties strip */}
        <motion.div
          className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-10 border-t border-white/[0.05] pt-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: D + 0.9 }}>
          <span className="eyebrow text-white/18">Especialidades</span>
          {['Odontologia','Estética','Energia Solar','Advocacia','Imobiliária','Consórcio','Automotivo'].map(n => (
            <span key={n} className="eyebrow" style={{ color: 'rgba(255,255,255,0.28)' }}>{n}</span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
