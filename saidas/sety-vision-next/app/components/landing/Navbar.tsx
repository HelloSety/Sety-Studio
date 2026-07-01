"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Menu, X } from "lucide-react";
import { colors, radius, shadow, motion as M } from "@/lib/tokens";

const NAV_LINKS = [
  { label: "Produto",     id: "produto" },
  { label: "Automação",   id: "automacao" },
  { label: "Integrações", id: "integracoes" },
  { label: "Planos",      id: "planos" },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "smooth" });
}

function Logo() {
  return (
    <a href="/" aria-label="Sety Vision"
      style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
      <div style={{
        width: 24, height: 24, borderRadius: 7,
        background: colors.purple,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "-0.3px", color: colors.text }}>
        Sety Vision
      </span>
    </a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 72);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* ── ESTADO 1: Barra integrada (topo da página) ── */
  if (!scrolled) {
    return (
      <motion.header
        key="bar"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: M.ease }}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 50,
          height: 64,
          background: "rgba(255,255,255,0.70)",
          backdropFilter: "blur(16px) saturate(160%)",
          WebkitBackdropFilter: "blur(16px) saturate(160%)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "0 32px",
          height: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between",
        }}>
          <Logo />

          {/* Desktop nav links */}
          <nav className="hidden md:flex" style={{ alignItems: "center", gap: 0 }}>
            {NAV_LINKS.map((l) => (
              <button key={l.id} onClick={() => scrollToSection(l.id)}
                style={{
                  padding: "6px 14px", borderRadius: radius.md,
                  fontSize: 13, fontWeight: 500,
                  color: colors.textSecondary, background: "transparent",
                  border: "none", cursor: "pointer", whiteSpace: "nowrap",
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = colors.purple; e.currentTarget.style.background = "rgba(124,58,237,0.07)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = colors.textSecondary; e.currentTarget.style.background = "transparent"; }}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex" style={{ alignItems: "center", gap: 8 }}>
            <a href="/entrar" style={{
              padding: "7px 16px", borderRadius: radius.full,
              fontSize: 13, fontWeight: 500, color: colors.textSecondary, textDecoration: "none",
              transition: "color 0.2s, background 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.color = colors.text; e.currentTarget.style.background = "rgba(0,0,0,0.05)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = colors.textSecondary; e.currentTarget.style.background = "transparent"; }}
            >
              Entrar
            </a>
            <motion.a href="/painel" style={{
              display: "flex", alignItems: "center", gap: 5,
              background: colors.text, color: colors.white,
              padding: "8px 18px", borderRadius: radius.full,
              fontSize: 13, fontWeight: 700, textDecoration: "none",
              boxShadow: shadow.sm,
            }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            >
              Começar grátis <ChevronRight size={11} />
            </motion.a>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden" onClick={() => setMobileOpen((v) => !v)}
            style={{ padding: "6px 8px", borderRadius: radius.md, border: "none", background: "transparent", color: colors.textSecondary, cursor: "pointer" }}>
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              className="md:hidden"
              style={{
                background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(0,0,0,0.07)", padding: "8px 16px 12px", overflow: "hidden",
              }}
            >
              {NAV_LINKS.map((l) => (
                <button key={l.id} onClick={() => { scrollToSection(l.id); setMobileOpen(false); }}
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: radius.md, fontSize: 14, fontWeight: 500, color: colors.textSecondary, background: "transparent", border: "none", cursor: "pointer" }}>
                  {l.label}
                </button>
              ))}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", marginTop: 6, paddingTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <a href="/entrar" style={{ padding: "10px 14px", textAlign: "center", borderRadius: radius.md, fontSize: 14, color: colors.textSecondary, background: colors.surface, textDecoration: "none", fontWeight: 500 }}>Entrar</a>
                <a href="/painel" style={{ padding: "10px 14px", textAlign: "center", borderRadius: radius.md, fontSize: 14, color: colors.white, background: colors.text, textDecoration: "none", fontWeight: 700 }}>Começar grátis</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    );
  }

  /* ── ESTADO 2: Pill flutuante (após scroll) ── */
  return (
    <motion.header
      key="pill"
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: M.ease }}
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        width: "max-content",
        maxWidth: "calc(100vw - 32px)",
        borderRadius: radius.full,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(0,0,0,0.09)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{
        height: 48, padding: "0 8px 0 16px",
        display: "flex", alignItems: "center", gap: 4, minWidth: 0,
      }}>
        <Logo />

        <div style={{ width: 1, height: 16, background: "rgba(0,0,0,0.08)", margin: "0 8px", flexShrink: 0 }} />

        <nav className="hidden md:flex" style={{ alignItems: "center", gap: 0 }}>
          {NAV_LINKS.map((l) => (
            <button key={l.id} onClick={() => scrollToSection(l.id)}
              style={{
                padding: "6px 12px", borderRadius: radius.md,
                fontSize: 13, fontWeight: 500,
                color: colors.textSecondary, background: "transparent",
                border: "none", cursor: "pointer", whiteSpace: "nowrap",
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = colors.purple; e.currentTarget.style.background = "rgba(124,58,237,0.07)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = colors.textSecondary; e.currentTarget.style.background = "transparent"; }}
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:block" style={{ width: 1, height: 16, background: "rgba(0,0,0,0.08)", margin: "0 6px", flexShrink: 0 }} />

        <div className="hidden md:flex" style={{ alignItems: "center", gap: 4, flexShrink: 0 }}>
          <a href="/entrar" style={{
            padding: "6px 14px", borderRadius: radius.full,
            fontSize: 13, fontWeight: 500, color: colors.textSecondary, textDecoration: "none", whiteSpace: "nowrap",
            transition: "color 0.2s, background 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.color = colors.text; e.currentTarget.style.background = "rgba(0,0,0,0.05)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = colors.textSecondary; e.currentTarget.style.background = "transparent"; }}
          >
            Entrar
          </a>
          <motion.a href="/painel" style={{
            display: "flex", alignItems: "center", gap: 5,
            background: colors.text, color: colors.white,
            padding: "7px 16px", borderRadius: radius.full,
            fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap",
            boxShadow: shadow.sm,
          }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
          >
            Começar grátis <ChevronRight size={11} />
          </motion.a>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen((v) => !v)}
          style={{ padding: "6px 8px", borderRadius: radius.md, border: "none", background: "transparent", color: colors.textSecondary, cursor: "pointer", flexShrink: 0 }}>
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="md:hidden"
            style={{
              borderTop: "1px solid rgba(0,0,0,0.07)",
              padding: "8px 8px 10px", overflow: "hidden",
              background: "rgba(255,255,255,0.97)",
              borderRadius: `0 0 ${radius.xl}px ${radius.xl}px`,
            }}
          >
            {NAV_LINKS.map((l) => (
              <button key={l.id} onClick={() => { scrollToSection(l.id); setMobileOpen(false); }}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: radius.md, fontSize: 14, fontWeight: 500, color: colors.textSecondary, background: "transparent", border: "none", cursor: "pointer" }}>
                {l.label}
              </button>
            ))}
            <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", marginTop: 6, paddingTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              <a href="/entrar" style={{ padding: "10px 14px", textAlign: "center", borderRadius: radius.md, fontSize: 14, color: colors.textSecondary, background: colors.surface, textDecoration: "none", fontWeight: 500 }}>Entrar</a>
              <a href="/painel" style={{ padding: "10px 14px", textAlign: "center", borderRadius: radius.md, fontSize: 14, color: colors.white, background: colors.text, textDecoration: "none", fontWeight: 700 }}>Começar grátis</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
