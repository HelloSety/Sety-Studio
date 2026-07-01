'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40);
      if (window.scrollY > 40) setOpen(false);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'Projetos', href: '#portfolio', page: false },
    { label: 'Serviços', href: '#services', page: false },
    { label: 'Portfólio', href: '/portfolio', page: true },
    { label: 'FAQ', href: '#faq', page: false },
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-[900]"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        style={{
          background: scrolled || open ? 'rgba(0,0,0,0.95)' : 'transparent',
          backdropFilter: scrolled || open ? 'blur(20px)' : 'none',
          borderBottom: scrolled || open ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
          transition: 'all 0.35s ease',
        }}
      >
        <div className="container-main">
          <div className="flex items-center justify-between h-14">

            {/* Logo */}
            <a href="/" onClick={() => setOpen(false)} style={{ cursor: 'none' }}>
              <Image
                src="/logo.png"
                alt="Sety Studio"
                width={140}
                height={24}
                style={{ objectFit: 'contain', height: '22px', width: 'auto' }}
                priority
              />
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              {links.map((l) =>
                l.page ? (
                  <Link
                    key={l.label}
                    href={l.href}
                    className="text-[13px] text-white/40 hover:text-white transition-colors"
                    style={{ cursor: 'none' }}
                  >
                    {l.label}
                  </Link>
                ) : (
                  <a
                    key={l.label}
                    href={l.href}
                    className="text-[13px] text-white/40 hover:text-white transition-colors"
                    style={{ cursor: 'none' }}
                  >
                    {l.label}
                  </a>
                )
              )}
              <a
                href="#contact"
                className="text-[13px] font-semibold text-black bg-white hover:bg-white/88 px-4 py-2 rounded-lg transition-colors"
                style={{ cursor: 'none', fontFamily: 'var(--font-montserrat)' }}
              >
                Falar agora
              </a>
            </div>

            {/* Mobile right */}
            <div className="flex md:hidden items-center gap-3">
              <a
                href="#contact"
                className="text-[12px] font-semibold text-black bg-white px-3.5 py-1.5 rounded-lg"
                style={{ fontFamily: 'var(--font-montserrat)' }}
                onClick={() => setOpen(false)}
              >
                Falar agora
              </a>

              {/* Hamburger */}
              <button
                onClick={() => setOpen(!open)}
                className="w-8 h-8 flex flex-col items-center justify-center gap-1.5"
                aria-label="Menu"
              >
                <motion.span
                  className="block w-5 h-px bg-white/60"
                  animate={{ rotate: open ? 45 : 0, y: open ? 4 : 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block w-5 h-px bg-white/60"
                  animate={{ opacity: open ? 0 : 1 }}
                  transition={{ duration: 0.15 }}
                />
                <motion.span
                  className="block w-5 h-px bg-white/60"
                  animate={{ rotate: open ? -45 : 0, y: open ? -4 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden md:hidden border-t border-white/[0.05]"
            >
              <div className="container-main py-5 flex flex-col gap-1">
                {links.map((l) =>
                  l.page ? (
                    <Link
                      key={l.label}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="text-[15px] text-white/60 hover:text-white py-2.5 border-b border-white/[0.04] last:border-b-0 transition-colors"
                      style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 600 }}
                    >
                      {l.label}
                    </Link>
                  ) : (
                    <a
                      key={l.label}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="text-[15px] text-white/60 hover:text-white py-2.5 border-b border-white/[0.04] last:border-b-0 transition-colors"
                      style={{ fontFamily: 'var(--font-montserrat)', fontWeight: 600 }}
                    >
                      {l.label}
                    </a>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
