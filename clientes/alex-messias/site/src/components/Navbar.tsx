"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, whatsappLink } from "@/lib/utils";
import { siteConfig } from "@/lib/data";

const navLinks = [
  { href: "#veiculos", label: "Veículos" },
  { href: "/alex", label: "Alex Messias" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#consorcio", label: "Consórcio" },
  { href: "#depoimentos", label: "Depoimentos" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setAtTop(window.scrollY < 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isLight = scrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isLight
          ? "bg-white/95 backdrop-blur-md border-b border-black/5 shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-0.5 h-7 bg-gwm-red" />
          <div>
            <p
              className={cn(
                "font-black text-sm tracking-widest uppercase leading-tight transition-colors",
                isLight ? "text-[#111]" : "text-white"
              )}
            >
              Alex Messias
            </p>
            <p
              className={cn(
                "text-[0.6rem] tracking-[0.3em] uppercase transition-colors",
                isLight ? "text-[#888]" : "text-white/50"
              )}
            >
              Consultor GWM
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((l) => {
            const isPage = l.href.startsWith("/");
            const isActive = isPage && pathname === l.href;
            return isPage ? (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "text-[0.7rem] font-semibold tracking-widest uppercase link-underline transition-colors",
                  isActive ? "text-gwm-red" : isLight ? "text-[#555] hover:text-[#111]" : "text-white/70 hover:text-white"
                )}
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  "text-[0.7rem] font-semibold tracking-widest uppercase link-underline transition-colors",
                  isLight ? "text-[#555] hover:text-[#111]" : "text-white/70 hover:text-white"
                )}
              >
                {l.label}
              </a>
            );
          })}
        </div>

        {/* CTA */}
        <div className="hidden lg:block">
          <a
            href={whatsappLink(siteConfig.whatsapp, "Olá Alex! Gostaria de mais informações sobre os veículos GWM.")}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gwm-red text-white text-[0.65rem] font-bold tracking-widest uppercase px-5 py-3 hover:bg-[#c5000f] transition-colors"
          >
            Falar com Alex
          </a>
        </div>

        {/* Mobile */}
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "lg:hidden p-2 transition-colors",
            isLight ? "text-[#111]" : "text-white"
          )}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-black/5"
          >
            <div className="px-6 py-8 flex flex-col gap-5">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-[#555] text-xs font-semibold tracking-widest uppercase hover:text-[#111] transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={whatsappLink(siteConfig.whatsapp, "Olá Alex! Gostaria de mais informações sobre os veículos GWM.")}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gwm-red text-white text-xs font-bold tracking-widest uppercase px-6 py-4 text-center"
              >
                Falar com Alex
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
