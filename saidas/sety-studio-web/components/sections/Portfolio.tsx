'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { PROJECTS, type Project } from '@/lib/data';

const vin = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

function FeaturedCard({ p }: { p: Project }) {
  return (
    <Link
      href={`/cases/${p.slug}`}
      className="group col-span-12 relative flex flex-col md:flex-row overflow-hidden cursor-none"
      style={{
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: '#080808',
        minHeight: '360px',
        transition: 'border-color 0.3s',
      }}
    >
      {/* Screenshot */}
      {p.thumbPath && (
        <div className="relative md:w-[58%] overflow-hidden" style={{ minHeight: '260px' }}>
          <Image
            src={p.thumbPath}
            alt={p.title}
            fill
            className="object-cover object-top"
            style={{ transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)' }}
            sizes="(max-width: 768px) 100vw, 58vw"
          />
          <div className="group-hover:[&>*:first-child]:scale-105 absolute inset-0 pointer-events-none" />
          <style>{`.group:hover .feat-img{transform:scale(1.03)}`}</style>
          {/* Right fade */}
          <div className="absolute inset-0 hidden md:block" style={{
            background: 'linear-gradient(to right, transparent 55%, #080808 95%)',
          }} />
          {/* Bottom fade mobile */}
          <div className="absolute inset-0 md:hidden" style={{
            background: 'linear-gradient(to bottom, transparent 55%, #080808 95%)',
          }} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between p-7 md:p-10 md:w-[42%]">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: '#F59E0B', color: '#000',
            fontSize: '9px', fontWeight: 900, letterSpacing: '0.18em',
            padding: '5px 12px', borderRadius: '100px',
            fontFamily: 'var(--font-montserrat)',
          }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l6.91-1.01z" />
            </svg>
            {p.badge ?? 'Destaque'}
          </span>
          <span style={{
            background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)',
            fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em',
            padding: '5px 12px', borderRadius: '100px',
            fontFamily: 'var(--font-montserrat)',
          }}>
            {p.nicheLabel.toUpperCase()}
          </span>
        </div>

        <div>
          <h2 style={{
            fontFamily: 'var(--font-montserrat)', fontWeight: 900,
            fontSize: 'clamp(1.6rem, 3vw, 2.8rem)', letterSpacing: '-0.045em',
            color: 'white', lineHeight: 1.0, marginBottom: '10px',
          }}>
            {p.title}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '13px', lineHeight: 1.6, marginBottom: '6px' }}>
            {p.tagline}
          </p>
          <p style={{
            color: '#F59E0B', fontSize: '12px', fontWeight: 700, opacity: 0.7,
            fontFamily: 'var(--font-montserrat)',
          }}>
            {p.result}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {p.demoUrl && (
            <a
              href={p.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                cursor: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: '#F59E0B', color: '#000',
                fontSize: '11px', fontWeight: 900, letterSpacing: '0.1em',
                padding: '11px 20px', borderRadius: '10px',
                fontFamily: 'var(--font-montserrat)',
                transition: 'background 0.2s',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
              VER SITE AO VIVO
            </a>
          )}
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.32)',
            fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
            padding: '11px 20px', borderRadius: '10px',
            fontFamily: 'var(--font-montserrat)',
            transition: 'border-color 0.25s, color 0.25s',
          }} className="group-hover:border-white/25 group-hover:text-white/60">
            VER CASE COMPLETO →
          </span>
        </div>
      </div>
    </Link>
  );
}

function Card({ p, idx }: { p: Project; idx: number }) {
  return (
    <motion.div custom={idx} variants={vin} initial="hidden" whileInView="show" viewport={{ once: true }}>
      <Link
        href={`/cases/${p.slug}`}
        className="group flex flex-col overflow-hidden cursor-none"
        style={{
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.07)',
          background: '#080808',
          transition: 'border-color 0.3s',
        }}
      >
        {/* Screenshot */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
          {p.thumbPath ? (
            <Image
              src={p.thumbPath}
              alt={p.title}
              fill
              style={{ objectFit: 'contain', objectPosition: 'top center', background: '#050505', transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)' }}
              className="group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-[#050505]">
              <span className="text-4xl opacity-15">{p.nicheIcon}</span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.45)' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'white', color: '#000',
              fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em',
              padding: '8px 16px', borderRadius: '8px',
              fontFamily: 'var(--font-montserrat)',
            }}>
              VER CASE
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </span>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
            <span style={{ fontSize: '13px' }}>{p.nicheIcon}</span>
            <span style={{
              fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.3)',
              fontFamily: 'var(--font-montserrat)',
            }}>
              {p.nicheLabel.toUpperCase()}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.12)', marginLeft: 'auto', fontSize: '9px', fontFamily: 'var(--font-montserrat)' }}>
              {p.year}
            </span>
          </div>
          <h3 style={{
            fontFamily: 'var(--font-montserrat)', fontWeight: 800,
            fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)', letterSpacing: '-0.025em',
            color: 'rgba(255,255,255,0.82)', lineHeight: 1.15, marginBottom: '3px',
          }}>
            {p.title}
          </h3>
          <p style={{
            fontSize: '10px', color: 'rgba(255,255,255,0.28)',
            fontFamily: 'var(--font-montserrat)', fontWeight: 600,
          }}>
            {p.result}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Portfolio() {
  const featured = PROJECTS.find(p => p.featured);
  const rest     = PROJECTS.filter(p => !p.featured).slice(0, 4);

  return (
    <section id="portfolio" className="section-padding border-t border-white/[0.06]">
      <div className="container-main">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="eyebrow mb-3">Portfólio</p>
            <h2 style={{
              fontFamily: 'var(--font-montserrat)', fontWeight: 900,
              fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.04em',
              color: 'white', lineHeight: 1,
            }}>
              Cases reais.
              <span style={{ color: 'rgba(255,255,255,0.2)' }}> Resultados reais.</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay: 0.15 }}
            className="hidden md:block">
            <Link href="/portfolio"
              className="text-[11px] font-semibold text-white/30 hover:text-white transition-colors flex items-center gap-1.5"
              style={{ cursor: 'none', fontFamily: 'var(--font-montserrat)', letterSpacing: '0.06em' }}>
              VER TODOS →
            </Link>
          </motion.div>
        </div>

        {/* Featured */}
        {featured && (
          <motion.div
            className="grid grid-cols-12 mb-4"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <FeaturedCard p={featured} />
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {rest.map((p, i) => (
            <Card key={p.id} p={p} idx={i} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="text-center md:hidden">
          <Link href="/portfolio"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white text-[11px] font-semibold tracking-widest uppercase transition-colors"
            style={{ cursor: 'none', fontFamily: 'var(--font-montserrat)' }}>
            Ver galeria completa →
          </Link>
        </div>

      </div>
    </section>
  );
}
