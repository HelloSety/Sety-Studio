'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Project } from '@/lib/data';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/sections/Footer';

export default function CasePage({ project: p }: { project: Project }) {
  const demoLink = p.demoUrl ?? p.demoPath;

  return (
    <>
      <Navbar />
      <main>

        {/* Hero */}
        <section className="relative min-h-[60vh] flex flex-col justify-end overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient}`} />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.4) 50%, transparent 100%)' }} />

          <div className="container-main relative z-10 pb-14 pt-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/#portfolio"
                className="inline-flex items-center gap-2 eyebrow text-white/30 hover:text-white/60 transition-colors mb-8 group"
                style={{ cursor: 'none' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M5 12l7-7M5 12l7 7" />
                </svg>
                Todos os casos
              </Link>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{p.nicheIcon}</span>
                <span className="eyebrow text-white/45">{p.nicheLabel}</span>
                <span className="eyebrow text-white/20">· {p.year}</span>
                {p.badge && (
                  <span className="flex items-center gap-1 bg-amber-500 text-black text-[9px] font-black tracking-[0.2em] uppercase px-2.5 py-1 rounded-full">
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {p.badge}
                  </span>
                )}
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 900,
                  fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                  letterSpacing: '-0.05em',
                  color: 'white',
                  lineHeight: 0.92,
                  marginBottom: '1rem',
                }}
              >
                {p.title}
              </h1>
              <p className="text-white/40 text-base max-w-md mb-6">{p.tagline}</p>

              {demoLink && (
                <a
                  href={demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-white/20 text-white/60 hover:border-white/50 hover:text-white text-[11px] font-bold tracking-[0.15em] uppercase px-5 py-2.5 rounded-lg transition-all duration-200"
                  style={{ cursor: 'none', fontFamily: 'var(--font-montserrat)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                  </svg>
                  Ver Site do Projeto
                </a>
              )}
            </motion.div>
          </div>
        </section>

        {/* Metrics */}
        <section className="border-b border-white/[0.06]">
          <div className="container-main">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/[0.06]">
              {p.metrics.map((m, i) => (
                <motion.div
                  key={m.label}
                  className="py-10 px-8 first:pl-0"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-montserrat)',
                      fontWeight: 900,
                      fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
                      letterSpacing: '-0.04em',
                      color: 'white',
                      lineHeight: 1,
                    }}
                  >
                    {m.value}
                  </div>
                  <p className="eyebrow text-white/28 mt-1">{m.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Demo preview (desktop mockup) */}
        {demoLink && (
          <section className="border-b border-white/[0.06] bg-[#030303]">
            <div className="container-main py-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <p className="eyebrow mb-6">Preview do Site</p>

                {/* Browser chrome mockup */}
                <div className="rounded-xl overflow-hidden border border-white/[0.07] shadow-2xl">
                  <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-3 border-b border-white/[0.05]">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    </div>
                    <div className="flex-1 bg-[#111] rounded-md px-3 py-1.5 text-white/20 text-[11px] font-mono">
                      {demoLink}
                    </div>
                    <a
                      href={demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/30 hover:text-white/60 transition-colors"
                      style={{ cursor: 'none' }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>
                      </svg>
                    </a>
                  </div>
                  <div className="relative bg-white" style={{ height: 'clamp(400px, 55vw, 700px)' }}>
                    <iframe
                      src={demoLink}
                      className="w-full h-full border-0"
                      title={`Preview — ${p.title}`}
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Mobile mockup */}
                <div className="mt-8 flex justify-center">
                  <div className="w-[280px] rounded-[2rem] overflow-hidden border-4 border-white/10 shadow-2xl bg-white">
                    <div className="bg-[#1a1a1a] h-8 flex items-center justify-center">
                      <div className="w-16 h-1.5 bg-white/20 rounded-full" />
                    </div>
                    <div className="relative bg-white" style={{ height: '560px' }}>
                      <iframe
                        src={demoLink}
                        className="w-full h-full border-0"
                        style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}
                        title={`Mobile — ${p.title}`}
                        loading="lazy"
                      />
                    </div>
                    <div className="bg-[#1a1a1a] h-10 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border border-white/10" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Case body */}
        <section className="section-padding">
          <div className="container-main">
            <div className="max-w-3xl mx-auto">

              {/* Technologies */}
              {p.technologies && p.technologies.length > 0 && (
                <motion.div
                  className="mb-14"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="eyebrow mb-4">Tecnologias</p>
                  <div className="flex flex-wrap gap-2">
                    {p.technologies.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-semibold text-white/50 border border-white/[0.12] bg-white/[0.03] rounded-md px-3 py-1.5"
                        style={{ fontFamily: 'var(--font-montserrat)' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Objective */}
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="eyebrow mb-4">Objetivo</p>
                <p className="text-white/70 text-lg leading-relaxed">{p.objective}</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.06] mb-16">
                <motion.div
                  className="bg-[#050505] p-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="eyebrow mb-4">Desafio</p>
                  <p className="text-white/55 text-[14px] leading-relaxed">{p.problem}</p>
                </motion.div>
                <motion.div
                  className="bg-[#050505] p-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                >
                  <p className="eyebrow mb-4">Solução</p>
                  <p className="text-white/55 text-[14px] leading-relaxed">{p.solution}</p>
                </motion.div>
              </div>

              {/* Impact */}
              <motion.div
                className="mb-16 bg-white/[0.02] border border-white/[0.07] rounded-2xl p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="eyebrow mb-4">Impacto</p>
                <p className="text-white/70 text-base leading-relaxed">{p.impact}</p>
              </motion.div>

              {/* Tags */}
              <motion.div
                className="flex flex-wrap gap-2 mb-16"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] font-semibold text-white/30 border border-white/[0.08] rounded-md px-3 py-1.5"
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  >
                    {t}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Social Media Gallery */}
        {p.socialMediaPath && (
          <section className="border-t border-white/[0.06] bg-[#030303]">
            <div className="container-main py-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="eyebrow mb-2">Social Media</p>
                <h3
                  style={{
                    fontFamily: 'var(--font-montserrat)',
                    fontWeight: 800,
                    fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
                    letterSpacing: '-0.03em',
                    color: 'white',
                    lineHeight: 1.1,
                    marginBottom: '1.5rem',
                  }}
                >
                  Kit de conteúdo do projeto
                </h3>
                <p className="text-white/35 text-sm mb-8">10 posts + 5 stories prontos para uso.</p>

                <div className="rounded-xl overflow-hidden border border-white/[0.07]">
                  <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-3 border-b border-white/[0.05]">
                    <span className="text-white/30 text-[11px] eyebrow">Posts & Stories — {p.title}</span>
                    <div className="ml-auto">
                      <a
                        href={p.socialMediaPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/30 hover:text-white/60 transition-colors text-[10px] eyebrow"
                        style={{ cursor: 'none' }}
                      >
                        Abrir em nova aba →
                      </a>
                    </div>
                  </div>
                  <div style={{ height: '600px' }}>
                    <iframe
                      src={p.socialMediaPath}
                      className="w-full h-full border-0 bg-[#111]"
                      title={`Social Media — ${p.title}`}
                      loading="lazy"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section-padding border-t border-white/[0.06]">
          <div className="container-main">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <p className="eyebrow mb-4">Próximo passo</p>
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
                  Quer um resultado<br />
                  <span style={{ color: 'rgba(255,255,255,0.25)' }}>parecido com esse?</span>
                </h2>
                <p className="text-white/35 text-sm mb-8">Diagnóstico gratuito. Proposta em 24h.</p>
                <a
                  href="https://wa.me/5519988090110?text=Ol%C3%A1%2C%20vi%20o%20portf%C3%B3lio%20da%20Sety%20Studio%20e%20quero%20saber%20mais"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-black font-bold text-sm px-7 py-3.5 rounded-xl hover:bg-white/90 transition-all"
                  style={{ cursor: 'none', fontFamily: 'var(--font-montserrat)' }}
                >
                  Falar pelo WhatsApp
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              </motion.div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
