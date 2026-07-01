'use client';

import Link from 'next/link';
import { PROJECTS } from '@/lib/data';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';

const NICHE_COLORS: Record<string, string> = {
  consorcio: 'from-blue-950 to-slate-900',
  odontologia: 'from-emerald-950 to-slate-900',
  estetica: 'from-stone-900 to-zinc-900',
  solar: 'from-sky-950 to-slate-900',
  advocacia: 'from-zinc-900 to-stone-900',
  imobiliaria: 'from-gray-900 to-slate-900',
};

export default function PortfolioPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">

        {/* Hero */}
        <section className="relative pt-40 pb-20 border-b border-white/[0.06]">
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)`,
            backgroundSize: '60px 60px',
          }} />
          <div className="container-main relative z-10">
            <Link
              href="/#portfolio"
              className="inline-flex items-center gap-2 eyebrow text-white/30 hover:text-white/60 transition-colors mb-10 group"
              style={{ cursor: 'none' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M5 12l7-7M5 12l7 7" />
              </svg>
              Início
            </Link>
            <p className="eyebrow mb-4">Portfólio</p>
            <h1
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 900,
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                letterSpacing: '-0.05em',
                color: 'white',
                lineHeight: 0.92,
                marginBottom: '1.5rem',
              }}
            >
              Sites premium<br />
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>prontos para usar.</span>
            </h1>
            <p className="text-white/40 text-base max-w-lg leading-relaxed">
              Cada projeto é um site completo, deploy-ready, com copy real, calculadoras, animações e kit de social media. Clique em qualquer nicho para ver ao vivo.
            </p>
          </div>
        </section>

        {/* Projects grid */}
        <section className="section-padding">
          <div className="container-main">

            {/* Featured — Consórcio primeiro e maior */}
            {PROJECTS.filter(p => p.featured).map(p => (
              <div key={p.id} className="mb-6">
                <Link
                  href={`/cases/${p.slug}`}
                  className={`group relative flex flex-col rounded-2xl overflow-hidden border border-amber-500/20 hover:border-amber-500/50 bg-gradient-to-br ${p.gradient} transition-all duration-400 cursor-none`}
                  style={{ minHeight: '340px' }}
                >
                  {/* Badge */}
                  <div className="absolute top-5 right-5 flex gap-2 z-10">
                    <span className="flex items-center gap-1.5 bg-amber-500 text-black text-[9px] font-black tracking-[0.2em] uppercase px-3 py-1.5 rounded-full">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      {p.badge}
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/10 text-white/60 text-[9px] font-bold tracking-[0.2em] uppercase px-3 py-1.5 rounded-full">
                      Projeto Destaque
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col md:flex-row items-start md:items-end justify-between p-8 md:p-10 gap-8">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-3xl">{p.nicheIcon}</span>
                        <span className="eyebrow text-amber-400/60">{p.nicheLabel}</span>
                        <span className="eyebrow text-white/20">· {p.year}</span>
                      </div>
                      <h2
                        style={{
                          fontFamily: 'var(--font-montserrat)',
                          fontWeight: 900,
                          fontSize: 'clamp(1.75rem, 4vw, 3.5rem)',
                          letterSpacing: '-0.04em',
                          color: 'white',
                          lineHeight: 1,
                          marginBottom: '0.75rem',
                        }}
                      >
                        {p.title}
                      </h2>
                      <p className="text-white/40 text-sm mb-2">{p.tagline}</p>
                      <p className="text-amber-400/50 text-sm font-semibold">{p.result}</p>
                    </div>

                    <div className="flex flex-col gap-3 flex-shrink-0">
                      {p.demoUrl && (
                        <a
                          href={p.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-2 bg-amber-500 text-black text-[11px] font-black tracking-[0.15em] uppercase px-5 py-3 rounded-lg hover:bg-amber-400 transition-all"
                          style={{ cursor: 'none', fontFamily: 'var(--font-montserrat)' }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                          </svg>
                          Ver Site ao Vivo
                        </a>
                      )}
                      <span className="flex items-center gap-2 border border-white/10 text-white/40 group-hover:border-white/30 group-hover:text-white/60 text-[11px] font-bold tracking-[0.15em] uppercase px-5 py-3 rounded-lg transition-all justify-center"
                        style={{ fontFamily: 'var(--font-montserrat)' }}>
                        Ver Case Completo →
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {/* Other projects grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROJECTS.filter(p => !p.featured).map(p => (
                <Link
                  key={p.id}
                  href={`/cases/${p.slug}`}
                  className={`group relative flex flex-col rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/[0.2] bg-gradient-to-br ${NICHE_COLORS[p.niche] ?? 'from-zinc-900 to-slate-900'} transition-all duration-300 cursor-none`}
                  style={{ minHeight: '280px' }}
                >
                  <div className="flex-1 flex flex-col justify-between p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{p.nicheIcon}</span>
                        <span className="eyebrow text-white/40">{p.nicheLabel}</span>
                      </div>
                      {(p.demoUrl || p.demoPath) && (
                        <a
                          href={p.demoUrl ?? p.demoPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-white/20 hover:text-white/60 transition-colors"
                          style={{ cursor: 'none' }}
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                          </svg>
                        </a>
                      )}
                    </div>

                    <div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-montserrat)',
                          fontWeight: 800,
                          fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                          letterSpacing: '-0.03em',
                          color: 'rgba(255,255,255,0.85)',
                          lineHeight: 1.15,
                          marginBottom: '0.5rem',
                        }}
                      >
                        {p.title}
                      </h3>
                      <p className="text-white/35 text-[12px] mb-3">{p.tagline}</p>
                      <p className="text-white/50 text-[11px] font-semibold" style={{ fontFamily: 'var(--font-montserrat)' }}>
                        {p.result}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-5 border-t border-white/[0.05] pt-4 flex items-center justify-between">
                    <div className="flex gap-1.5 flex-wrap">
                      {p.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-[10px] text-white/25 border border-white/[0.07] rounded px-2 py-0.5"
                          style={{ fontFamily: 'var(--font-montserrat)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="w-6 h-6 rounded-full border border-white/[0.1] flex items-center justify-center text-white/30 group-hover:bg-white group-hover:border-white group-hover:text-black transition-all duration-250">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="section-padding border-t border-white/[0.06]">
          <div className="container-main text-center">
            <p className="eyebrow mb-4">Próximo projeto</p>
            <h2
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 900,
                fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                letterSpacing: '-0.04em',
                color: 'white',
                lineHeight: 1,
                marginBottom: '1.25rem',
              }}
            >
              Seu negócio merece<br />
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>um site assim.</span>
            </h2>
            <p className="text-white/35 text-sm mb-8 max-w-md mx-auto">
              Entregamos sites premium em até 3 dias úteis. Copy, design, animações e deploy inclusos.
            </p>
            <a
              href="https://wa.me/5519988090110?text=Ol%C3%A1%2C%20vi%20o%20portf%C3%B3lio%20da%20Sety%20Studio%20e%20quero%20solicitar%20um%20site"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm px-7 py-3.5 rounded-xl hover:bg-white/90 transition-all"
              style={{ cursor: 'none', fontFamily: 'var(--font-montserrat)' }}
            >
              Solicitar Orçamento
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
