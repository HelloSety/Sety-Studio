'use client';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] pt-12 pb-8 relative overflow-hidden">

      {/* Giant decorative text */}
      <div
        className="absolute bottom-0 left-0 right-0 select-none pointer-events-none overflow-hidden"
        aria-hidden
      >
        <div
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 900,
            fontSize: 'clamp(3.5rem, 12vw, 11rem)',
            letterSpacing: '-0.05em',
            color: 'rgba(255,255,255,0.022)',
            lineHeight: 0.85,
            whiteSpace: 'nowrap',
            paddingLeft: '1.5rem',
          }}
        >
          SETY STUDIO
        </div>
      </div>

      <div className="container-main relative z-10">
        {/* Top: brand + links */}
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-14">

          {/* Brand */}
          <div className="max-w-xs">
            <span
              style={{
                fontFamily: 'var(--font-montserrat)',
                fontWeight: 900,
                fontSize: '1.0625rem',
                letterSpacing: '-0.03em',
                color: 'white',
              }}
            >
              SETY<span style={{ color: 'rgba(255,255,255,0.2)' }}>STUDIO</span>
            </span>
            <p className="text-white/22 text-sm mt-3 leading-relaxed">
              Agência digital para negócios de alto valor que querem crescer de verdade.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:flex sm:gap-14">
            <div>
              <p className="eyebrow mb-4">Navegação</p>
              <ul className="space-y-2.5">
                {[['Portfólio', '#portfolio'], ['Serviços', '#services'], ['FAQ', '#faq'], ['Contato', '#contact']].map(([l, h]) => (
                  <li key={l}>
                    <a href={h} className="text-white/32 hover:text-white text-sm transition-colors" style={{ cursor: 'none' }}>
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="eyebrow mb-4">Contato</p>
              <ul className="space-y-2.5">
                <li>
                  <a href="https://wa.me/5519988090110" target="_blank" rel="noopener noreferrer"
                    className="text-white/32 hover:text-white text-sm transition-colors" style={{ cursor: 'none' }}>
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href="mailto:contato@setystudio.com.br"
                    className="text-white/32 hover:text-white text-sm transition-colors" style={{ cursor: 'none' }}>
                    Email
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/setystudio" target="_blank" rel="noopener noreferrer"
                    className="text-white/32 hover:text-white text-sm transition-colors" style={{ cursor: 'none' }}>
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-6 border-t border-white/[0.05]">
          <p className="text-white/18 text-xs">© {year} Sety Studio. Todos os direitos reservados.</p>
          <p className="text-white/12 text-xs">Belém, Pará — Brasil</p>
        </div>
      </div>
    </footer>
  );
}
