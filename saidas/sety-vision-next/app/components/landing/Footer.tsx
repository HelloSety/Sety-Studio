"use client";

import { colors, radius } from "@/lib/tokens";

const COLS: { title: string; links: string[] }[] = [
  { title: "Produto",  links: ["CRM Inteligente", "WhatsApp Bot", "Automações", "Integrações", "Relatórios"] },
  { title: "Empresa",  links: ["Sobre nós", "Blog", "Casos de sucesso", "Parceiros", "Carreiras"] },
  { title: "Recursos", links: ["Central de ajuda", "Documentação", "Status", "Comunidade", "Agendar demo"] },
  { title: "Legal",    links: ["Privacidade", "Termos", "Cookies", "LGPD"] },
];

const CONTAINER = { maxWidth: 1280, margin: "0 auto", padding: "0 32px", width: "100%" } as const;

export function Footer() {
  return (
    <footer style={{ background: colors.surface, borderTop: "1px solid rgba(0,0,0,0.07)" }}>
      <style>{`
        @media (max-width: 640px) { .ftr-container { padding-left: 20px !important; padding-right: 20px !important; } }
        .ftr-grid { display: grid; grid-template-columns: 1.4fr repeat(4, 1fr) 1.2fr; gap: 40px; }
        @media (max-width: 1024px) { .ftr-grid { grid-template-columns: 1fr 1fr 1fr; } }
        @media (max-width: 560px)  { .ftr-grid { grid-template-columns: 1fr 1fr; } }
        .ftr-link { color: ${colors.textSecondary}; text-decoration: none; font-size: 14px; transition: color 0.15s; }
        .ftr-link:hover { color: ${colors.text}; }
      `}</style>

      <div className="ftr-container" style={CONTAINER}>
        {/* Main */}
        <div className="ftr-grid" style={{ paddingTop: 80, paddingBottom: 64 }}>
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <a href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", width: "fit-content" }}>
              <div style={{ width: 28, height: 28, borderRadius: radius.sm, background: colors.purple, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: "-0.3px", color: colors.text }}>Sety Vision</span>
            </a>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: colors.textSecondary, maxWidth: 240 }}>
              O sistema operacional inteligente para empresas que querem crescer mais rápido.
            </p>
          </div>

          {/* Link columns */}
          {COLS.map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 16 }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {col.links.map((l) => (
                  <a key={l} href="#" className="ftr-link">{l}</a>
                ))}
              </div>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: colors.text, marginBottom: 16 }}>Newsletter</div>
            <p style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 12, lineHeight: 1.55 }}>
              Estratégias de crescimento no seu e-mail.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                placeholder="seu@email.com"
                style={{
                  flex: 1, minWidth: 0, borderRadius: radius.md, padding: "10px 12px", fontSize: 13,
                  outline: "none", background: colors.white, border: `1px solid ${colors.border}`, color: colors.text,
                }}
              />
              <button style={{
                borderRadius: radius.md, padding: "10px 14px", fontSize: 13, fontWeight: 600,
                background: colors.text, color: colors.white, border: "none", cursor: "pointer", whiteSpace: "nowrap",
              }}>
                Assinar
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: 24, paddingBottom: 24,
          borderTop: "1px solid rgba(0,0,0,0.07)",
          display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16,
        }}>
          <span style={{ fontSize: 13, color: colors.textSecondary }}>© 2026 Sety Vision. Todos os direitos reservados.</span>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="#" className="ftr-link">Privacidade</a>
            <a href="#" className="ftr-link">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
