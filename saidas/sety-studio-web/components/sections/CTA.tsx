'use client';

import { motion } from 'framer-motion';

const MOCKUP_LINES = [
  { indent: 0, text: '📁 _contexto/', dim: false, comment: '— quem é, ICP, oferta' },
  { indent: 1, text: 'empresa.md', dim: true, comment: '' },
  { indent: 1, text: 'preferencias.md', dim: true, comment: '— tom de voz' },
  { indent: 1, text: 'estrategia.md', dim: true, comment: '— foco e prazos' },
  { indent: 0, text: '📁 clientes/', dim: false, comment: '— um por cliente' },
  { indent: 1, text: 'clinica-identita/', dim: true, comment: '' },
  { indent: 1, text: 'alto-imoveis/', dim: true, comment: '' },
  { indent: 0, text: '📁 saidas/', dim: false, comment: '— sites, peças, scripts' },
  { indent: 1, text: 'sety-studio-web/', dim: true, comment: '' },
  { indent: 0, text: '📁 marketing/', dim: false, comment: '— anúncios, conteúdo' },
  { indent: 0, text: '📁 scripts/', dim: false, comment: '— automações' },
];

export default function CTA() {
  return (
    <section id="contact" className="section-padding border-t border-white/[0.06]">
      <div className="container-main">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 900,
              fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
              letterSpacing: '-0.055em',
              color: 'white',
              lineHeight: 0.92,
              marginBottom: '1.25rem',
            }}
          >
            Vamos construir<br />
            <span style={{ color: 'rgba(255,255,255,0.22)' }}>algo juntos?</span>
          </h2>
          <p className="text-white/32 text-sm leading-relaxed max-w-xs mx-auto">
            Diagnóstico gratuito. Proposta em 24h com escopo e valor fixo.
          </p>
        </motion.div>

        {/* Split card */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 border border-white/[0.08] rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Left — CTA */}
          <div className="bg-[#080808] border-b md:border-b-0 md:border-r border-white/[0.08] p-10 flex flex-col justify-between gap-10">
            <div>
              <p className="eyebrow mb-5">Acesso imediato</p>
              <h3
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontWeight: 900,
                  fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                  letterSpacing: '-0.04em',
                  color: 'white',
                  lineHeight: 1.1,
                  marginBottom: '0.75rem',
                }}
              >
                Fale com a Sety Studio agora
              </h3>
              <p className="text-white/35 text-sm leading-relaxed">
                Conte o seu projeto e receba uma proposta com escopo, prazo e valor fixo em até 24h.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/5519988090110?text=Ol%C3%A1%2C%20quero%20um%20diagn%C3%B3stico%20gratuito%20para%20meu%20neg%C3%B3cio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 w-full bg-white text-black font-bold text-sm px-6 py-3.5 rounded-xl hover:bg-white/90 transition-all"
                style={{ cursor: 'none', fontFamily: 'var(--font-montserrat)' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.934 1.399 5.61L0 24l6.596-1.371A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.651-.516-5.162-1.414l-.37-.22-3.817.793.812-3.723-.244-.386A9.937 9.937 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Falar pelo WhatsApp
              </a>

              <a
                href="mailto:contato@setystudio.com.br"
                className="flex items-center justify-center gap-2 w-full text-white/40 hover:text-white text-sm font-semibold border border-white/[0.08] hover:border-white/20 px-6 py-3.5 rounded-xl transition-all"
                style={{ cursor: 'none' }}
              >
                contato@setystudio.com.br
              </a>
            </div>

            <p className="text-white/20 text-xs">
              Diagnóstico gratuito · Proposta em 24h · Contrato claro
            </p>
          </div>

          {/* Right — mockup terminal/explorer */}
          <div className="bg-[#050505] p-0 flex flex-col">
            {/* Window bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-white/10" />
                <span className="w-3 h-3 rounded-full bg-white/10" />
                <span className="w-3 h-3 rounded-full bg-white/10" />
              </div>
              <span className="eyebrow text-white/20">~/sety-studio</span>
              <div className="flex items-center gap-3">
                <span className="eyebrow text-white/20">● main</span>
              </div>
            </div>

            {/* Explorer */}
            <div className="flex-1 p-6 font-mono text-[12px] leading-6 overflow-hidden">
              <div className="flex items-center gap-2 mb-4 text-white/20">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                <span className="tracking-widest text-[10px] font-bold uppercase">Explorer</span>
                <span className="text-white/12">— / sety-studio</span>
              </div>

              {MOCKUP_LINES.map((line, i) => (
                <motion.div
                  key={i}
                  className="flex items-baseline gap-2"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.4 }}
                  style={{ paddingLeft: line.indent * 20 }}
                >
                  {line.indent > 0 && (
                    <span className="text-white/10 select-none">└</span>
                  )}
                  <span className={line.dim ? 'text-white/35' : 'text-white/75 font-semibold'}>
                    {line.text}
                  </span>
                  {line.comment && (
                    <span className="text-white/18 text-[11px]">{line.comment}</span>
                  )}
                </motion.div>
              ))}

              {/* Cursor line */}
              <motion.div
                className="flex items-center gap-2 mt-5 pt-4 border-t border-white/[0.05]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.9 }}
              >
                <span className="text-white/30">›</span>
                <span className="text-white/45">sety diagnóstico</span>
                <motion.span
                  className="inline-block w-2 h-4 bg-white/50"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1.1, repeat: Infinity }}
                />
              </motion.div>
            </div>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
