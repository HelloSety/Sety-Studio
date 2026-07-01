"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Search, Zap } from "lucide-react";
import { colors, radius, shadow, motion as M } from "@/lib/tokens";

/* ── Types ─────────────────────────────────────────────────── */
type Card = {
  slug: string; hex: string; name: string;
  category: string; desc: string; tag: string;
};

/* ── Integration cards data (16 reais) ───────────────────────── */
const CARDS: Card[] = [
  { slug: "whatsapp",    hex: "25D366", name: "WhatsApp",     category: "comunicacao",   desc: "Atendimento automático 24/7 com IA integrada",           tag: "Nativo"    },
  { slug: "openai",      hex: "10A37F", name: "OpenAI GPT",   category: "ia",            desc: "Modelos GPT-4o para geração de conteúdo e análises",     tag: "Nativo"    },
  { slug: "hubspot",     hex: "FF7A59", name: "HubSpot",      category: "crm",           desc: "CRM completo integrado ao funil de vendas e automações", tag: "Nativo"    },
  { slug: "stripe",      hex: "635BFF", name: "Stripe",       category: "pagamento",     desc: "Cobranças, assinaturas e checkout automatizados",        tag: "Nativo"    },
  { slug: "meta",        hex: "0467DF", name: "Meta Ads",     category: "marketing",     desc: "Campanhas, audiências e criativos personalizados",       tag: "Conectado" },
  { slug: "shopify",     hex: "96BF48", name: "Shopify",      category: "ecommerce",     desc: "Loja virtual conectada ao CRM e automações de vendas",   tag: "Nativo"    },
  { slug: "instagram",   hex: "E4405F", name: "Instagram",    category: "comunicacao",   desc: "Inbox, DMs e comentários gerenciados pela IA",           tag: "Conectado" },
  { slug: "n8n",         hex: "EA4B71", name: "N8N",          category: "produtividade", desc: "Fluxos visuais e automações avançadas sem código",       tag: "Nativo"    },
  { slug: "mercadopago", hex: "009EE3", name: "Mercado Pago", category: "pagamento",     desc: "Pagamentos locais, Pix e parcelamento automatizado",     tag: "Conectado" },
  { slug: "notion",      hex: "000000", name: "Notion",       category: "produtividade", desc: "Base de conhecimento e docs sincronizados com o CRM",    tag: "Conectado" },
  { slug: "googleads",   hex: "4285F4", name: "Google Ads",   category: "marketing",     desc: "Campanhas de busca, Performance Max e remarketing",      tag: "Conectado" },
  { slug: "nuvemshop",   hex: "3FC3EE", name: "Nuvemshop",    category: "ecommerce",     desc: "E-commerce BR nativo com automação pós-compra",          tag: "Conectado" },
  { slug: "anthropic",   hex: "D97757", name: "Claude AI",    category: "ia",            desc: "Análises avançadas, resumos e respostas inteligentes",   tag: "Nativo"    },
  { slug: "slack",       hex: "4A154B", name: "Slack",        category: "comunicacao",   desc: "Notificações e alertas de vendas em tempo real",         tag: "Conectado" },
  { slug: "rdstation",   hex: "0099FF", name: "RD Station",   category: "crm",           desc: "Marketing automation e nutrição de leads integrada",     tag: "Conectado" },
  { slug: "zapier",      hex: "FF4A00", name: "Zapier",       category: "produtividade", desc: "Conecta mais de 5.000 apps em automações sem código",    tag: "Conectado" },
];

const FILTERS = [
  { id: "all",           label: "Todos" },
  { id: "crm",           label: "CRM" },
  { id: "ia",            label: "IA" },
  { id: "pagamento",     label: "Pagamento" },
  { id: "marketing",     label: "Marketing" },
  { id: "ecommerce",     label: "E-commerce" },
  { id: "comunicacao",   label: "Comunicação" },
  { id: "produtividade", label: "Produtividade" },
];

/* ── Marquee rows ────────────────────────────────────────────── */
interface Logo { name: string; slug: string; hex: string }

function LogoItem({ logo }: { logo: Logo }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 6, cursor: "default", userSelect: "none", flexShrink: 0,
        transition: "transform 0.2s", transform: hovered ? "scale(1.12)" : "scale(1)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://cdn.simpleicons.org/${logo.slug}/${hovered ? logo.hex : "CCCCCC"}`}
        alt={logo.name} width={28} height={28}
        style={{ width: 28, height: 28, objectFit: "contain", transition: "opacity 0.2s" }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
      />
      <span style={{ fontSize: 10, color: colors.textMuted, whiteSpace: "nowrap", fontWeight: 500, lineHeight: 1 }}>
        {logo.name}
      </span>
    </div>
  );
}

const ROW1: Logo[] = [
  { name: "WhatsApp",   slug: "whatsapp",  hex: "25D366" },
  { name: "Instagram",  slug: "instagram", hex: "E4405F" },
  { name: "Facebook",   slug: "facebook",  hex: "1877F2" },
  { name: "Gmail",      slug: "gmail",     hex: "EA4335" },
  { name: "Slack",      slug: "slack",     hex: "4A154B" },
  { name: "Meta Ads",   slug: "meta",      hex: "0467DF" },
  { name: "Google Ads", slug: "googleads", hex: "4285F4" },
  { name: "LinkedIn",   slug: "linkedin",  hex: "0A66C2" },
  { name: "Pinterest",  slug: "pinterest", hex: "E60023" },
  { name: "HubSpot",    slug: "hubspot",   hex: "FF7A59" },
  { name: "RD Station", slug: "rdstation", hex: "0099FF" },
];

const ROW2: Logo[] = [
  { name: "Shopify",      slug: "shopify",     hex: "96BF48" },
  { name: "Stripe",       slug: "stripe",      hex: "635BFF" },
  { name: "Mercado Pago", slug: "mercadopago", hex: "009EE3" },
  { name: "N8N",          slug: "n8n",         hex: "EA4B71" },
  { name: "Zapier",       slug: "zapier",      hex: "FF4A00" },
  { name: "Make",         slug: "make",        hex: "6D00CC" },
  { name: "OpenAI",       slug: "openai",      hex: "10A37F" },
  { name: "Anthropic",    slug: "anthropic",   hex: "D97757" },
  { name: "Supabase",     slug: "supabase",    hex: "3ECF8E" },
  { name: "GitHub",       slug: "github",      hex: "181717" },
  { name: "Vercel",       slug: "vercel",      hex: "000000" },
];

const ROW3: Logo[] = [
  { name: "Zoom",            slug: "zoom",           hex: "2D8CFF" },
  { name: "Notion",          slug: "notion",         hex: "000000" },
  { name: "Google Calendar", slug: "googlecalendar", hex: "4285F4" },
  { name: "Google Drive",    slug: "googledrive",    hex: "4285F4" },
  { name: "WooCommerce",     slug: "woocommerce",    hex: "96588A" },
  { name: "TikTok",          slug: "tiktok",         hex: "010101" },
  { name: "Docker",          slug: "docker",         hex: "2496ED" },
  { name: "Cloudflare",      slug: "cloudflare",     hex: "F38020" },
  { name: "Nuvemshop",       slug: "nuvemshop",      hex: "3FC3EE" },
  { name: "Calendly",        slug: "calendly",       hex: "006BFF" },
];

function MarqueeRow({ items, direction, speed }: { items: Logo[]; direction: "left" | "right"; speed: number }) {
  const tripled = [...items, ...items, ...items];
  return (
    <div style={{ overflow: "hidden", position: "relative", width: "100%", height: 64, display: "flex", alignItems: "center" }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 120, zIndex: 10, pointerEvents: "none",
        background: `linear-gradient(to right, ${colors.background}, transparent)`,
      }} />
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 120, zIndex: 10, pointerEvents: "none",
        background: `linear-gradient(to left, ${colors.background}, transparent)`,
      }} />
      <div style={{
        display: "flex", gap: 56, alignItems: "center",
        animation: `intg-marquee ${speed}s linear infinite`,
        animationDirection: direction === "right" ? "reverse" : "normal",
        willChange: "transform",
      }}>
        {tripled.map((logo, i) => <LogoItem key={`${logo.slug}-${i}`} logo={logo} />)}
      </div>
    </div>
  );
}

/* ── IntegrationCard ─────────────────────────────────────────── */
function IntegrationCard({ card }: { card: Card }) {
  const [hovered, setHovered] = useState(false);
  const sz = 48;
  const br = Math.round(sz * 0.22);
  const ico = Math.round(sz * 0.56);
  const isNativo = card.tag === "Nativo";
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{
        y: hovered ? -4 : 0,
        boxShadow: hovered ? "0 20px 60px rgba(124,58,237,0.12), 0 4px 16px rgba(0,0,0,0.06)" : shadow.xs,
      }}
      transition={{ duration: 0.22 }}
      style={{
        background: colors.card,
        border: hovered ? "1.5px solid rgba(124,58,237,0.28)" : `1.5px solid ${colors.border}`,
        borderRadius: radius.xl,
        padding: 20,
        cursor: "pointer",
        transition: "border-color 0.2s",
        display: "flex", flexDirection: "column",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <div style={{
          width: sz, height: sz, borderRadius: br, background: `#${card.hex}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.14)",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://cdn.simpleicons.org/${card.slug}/FFFFFF`}
            alt={card.name} width={ico} height={ico}
            style={{ width: ico, height: ico }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.text, lineHeight: 1.3 }}>{card.name}</div>
          <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 600 }}>
            {FILTERS.find((f) => f.id === card.category)?.label ?? card.category}
          </div>
        </div>
        <div style={{
          width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 4,
          background: colors.green, boxShadow: "0 0 8px rgba(34,197,94,0.5)",
        }} />
      </div>

      <p style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
        {card.desc}
      </p>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "5px 12px", borderRadius: radius.full,
          fontSize: 11, fontWeight: 600,
          background: isNativo ? "rgba(124,58,237,0.08)" : "rgba(34,197,94,0.08)",
          color: isNativo ? colors.purple : colors.greenDark,
          border: isNativo ? "1px solid rgba(124,58,237,0.15)" : "1px solid rgba(34,197,94,0.15)",
        }}>
          <Zap size={9} />
          {card.tag}
        </span>
        <span style={{
          fontSize: 12, fontWeight: 600,
          color: hovered ? colors.purple : colors.textMuted,
          transition: "color 0.2s", letterSpacing: "-0.2px",
        }}>
          Conectar →
        </span>
      </div>
    </motion.div>
  );
}

/* ── Trust badges ────────────────────────────────────────────── */
const trustBadges = [
  { label: "LGPD",                  icon: "🛡️" },
  { label: "SSL 256-bit",           icon: "🔒" },
  { label: "API Oficial WhatsApp",  icon: "✅" },
  { label: "99,9% uptime",          icon: "⚡" },
  { label: "Backup automático",     icon: "💾" },
  { label: "Suporte especializado", icon: "🎧" },
];

const CONTAINER = { maxWidth: 1280, margin: "0 auto", padding: "0 32px", width: "100%" } as const;

/* ── Integracoes ─────────────────────────────────────────────── */
export function Integracoes() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = CARDS.filter((c) => {
    const matchCat = activeFilter === "all" || c.category === activeFilter;
    const matchSearch = !search
      || c.name.toLowerCase().includes(search.toLowerCase())
      || c.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section id="integracoes" ref={ref} style={{ background: colors.background, paddingTop: 112, paddingBottom: 0 }}>
      <style>{`
        @keyframes intg-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        .intg-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
        }
        @media (max-width: 640px) {
          .intg-container { padding-left: 20px !important; padding-right: 20px !important; }
        }
        .intg-filter-scroll {
          display: flex; gap: 8px; overflow-x: auto;
          padding-bottom: 4px; scrollbar-width: none;
        }
        .intg-filter-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="intg-container" style={CONTAINER}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: M.ease }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20,
            borderRadius: radius.full, padding: "6px 14px", fontSize: 12, fontWeight: 600,
            background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.15)", color: colors.purple,
          }}>
            Ecossistema integrado
          </div>
          <h2 style={{
            fontSize: "clamp(32px, 4.5vw, 58px)", fontWeight: 900,
            letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 16, color: colors.text,
          }}>
            Conecte com as ferramentas
            <br />
            <span style={{
              background: `linear-gradient(135deg, ${colors.purple} 0%, ${colors.purpleLighter} 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              que sua empresa já usa.
            </span>
          </h2>
          <p style={{ color: colors.textSecondary, fontSize: 16, maxWidth: 480, margin: "0 auto" }}>
            +40 integrações nativas. Seus dados fluindo para um único painel, sem código.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.1, ease: M.ease }}
          style={{ position: "relative", maxWidth: 420, margin: "0 auto 24px" }}
        >
          <Search size={15} style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
            color: colors.textMuted, pointerEvents: "none",
          }} />
          <input
            type="text"
            placeholder="Buscar integração..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "12px 16px 12px 40px",
              borderRadius: radius.md, border: `1.5px solid ${colors.borderMid}`,
              fontSize: 14, color: colors.text, background: colors.surface,
              outline: "none", boxSizing: "border-box",
            }}
            onFocus={(e) => { e.currentTarget.style.border = "1.5px solid rgba(124,58,237,0.4)"; e.currentTarget.style.background = colors.white; }}
            onBlur={(e) => { e.currentTarget.style.border = `1.5px solid ${colors.borderMid}`; e.currentTarget.style.background = colors.surface; }}
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="intg-filter-scroll"
          style={{ justifyContent: "center", marginBottom: 40 }}
        >
          {FILTERS.map((f) => {
            const active = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                style={{
                  padding: "8px 18px", borderRadius: radius.full, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                  transition: "all 0.18s",
                  background: active ? colors.purple : "transparent",
                  color: active ? colors.white : colors.textSecondary,
                  border: active ? `1.5px solid ${colors.purple}` : `1.5px solid ${colors.borderMid}`,
                  boxShadow: active ? shadow.purple : "none",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </motion.div>

        {/* Cards grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div key="grid" className="intg-card-grid" style={{ marginBottom: 48 }}>
              {filtered.map((card, i) => (
                <motion.div
                  key={card.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.04, ease: M.ease }}
                >
                  <IntegrationCard card={card} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ textAlign: "center", padding: "60px 0", color: colors.textMuted }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>Nenhuma integração encontrada</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Link */}
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <a href="#planos" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 14, fontWeight: 600, color: colors.purple, textDecoration: "none",
          }}>
            Ver todas as 40+ integrações →
          </a>
        </div>
      </div>

      {/* Triple marquee — full bleed */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{ display: "flex", flexDirection: "column", gap: 28, marginBottom: 80 }}
      >
        <MarqueeRow items={ROW1} direction="left"  speed={38} />
        <MarqueeRow items={ROW2} direction="right" speed={52} />
        <MarqueeRow items={ROW3} direction="left"  speed={28} />
      </motion.div>

      {/* Trust badges */}
      <div className="intg-container" style={{ ...CONTAINER, paddingBottom: 80 }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            display: "flex", flexWrap: "wrap", alignItems: "center",
            justifyContent: "center", gap: 12,
            paddingTop: 40, borderTop: `1px solid ${colors.border}`,
          }}
        >
          {trustBadges.map((b) => (
            <div key={b.label} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: radius.full, fontSize: 11, fontWeight: 500,
              background: colors.surface, border: `1px solid ${colors.border}`, color: colors.textSecondary,
            }}>
              <span>{b.icon}</span> {b.label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
