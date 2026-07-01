"use client";

import { useState } from "react";

/* ── Integration data ────────────────────────────────────── */
type Integration = { name: string; slug: string; hex: string };

const ROW1: Integration[] = [
  { name: "WhatsApp",      slug: "whatsapp",      hex: "25D366" },
  { name: "OpenAI",        slug: "openai",        hex: "10A37F" },
  { name: "Stripe",        slug: "stripe",        hex: "635BFF" },
  { name: "Instagram",     slug: "instagram",     hex: "E4405F" },
  { name: "HubSpot",       slug: "hubspot",       hex: "FF7A59" },
  { name: "Shopify",       slug: "shopify",       hex: "7AB55C" },
  { name: "Notion",        slug: "notion",        hex: "000000" },
  { name: "Slack",         slug: "slack",         hex: "4A154B" },
  { name: "Supabase",      slug: "supabase",      hex: "3ECF8E" },
  { name: "GitHub",        slug: "github",        hex: "181717" },
  { name: "Discord",       slug: "discord",       hex: "5865F2" },
  { name: "Figma",         slug: "figma",         hex: "F24E1E" },
];

const ROW2: Integration[] = [
  { name: "N8N",           slug: "n8n",           hex: "EA4B71" },
  { name: "Zapier",        slug: "zapier",        hex: "FF4F00" },
  { name: "Make",          slug: "make",          hex: "6D00CC" },
  { name: "Anthropic",     slug: "anthropic",     hex: "D97757" },
  { name: "Vercel",        slug: "vercel",        hex: "000000" },
  { name: "Docker",        slug: "docker",        hex: "2496ED" },
  { name: "Cloudflare",    slug: "cloudflare",    hex: "F38020" },
  { name: "Railway",       slug: "railway",       hex: "0B0D0E" },
  { name: "Trello",        slug: "trello",        hex: "0052CC" },
  { name: "Asana",         slug: "asana",         hex: "F06A6A" },
  { name: "Airtable",      slug: "airtable",      hex: "18BFFF" },
  { name: "Typeform",      slug: "typeform",      hex: "262627" },
];

const ROW3: Integration[] = [
  { name: "Meta Ads",      slug: "meta",          hex: "0467DF" },
  { name: "LinkedIn",      slug: "linkedin",      hex: "0A66C2" },
  { name: "TikTok",        slug: "tiktok",        hex: "000000" },
  { name: "Pinterest",     slug: "pinterest",     hex: "BD081C" },
  { name: "YouTube",       slug: "youtube",       hex: "FF0000" },
  { name: "Google Ads",    slug: "googleads",     hex: "4285F4" },
  { name: "WooCommerce",   slug: "woocommerce",   hex: "96588A" },
  { name: "Mercado Pago",  slug: "mercadopago",   hex: "00B1EA" },
  { name: "Calendly",      slug: "calendly",      hex: "006BFF" },
  { name: "Gmail",         slug: "gmail",         hex: "EA4335" },
  { name: "Dropbox",       slug: "dropbox",       hex: "0061FF" },
  { name: "Mailchimp",     slug: "mailchimp",     hex: "FFE01B" },
];

/* ── Single integration item ────────────────────────────── */
function IntItem({ item }: { item: Integration }) {
  const ico = 38;
  const box = 72;
  const r   = 18;
  /* Mailchimp yellow needs a dark icon */
  const isDark = ["FFE01B", "96BF48", "6AFDEF"].includes(item.hex.toUpperCase());
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "0 40px", flexShrink: 0, userSelect: "none",
      }}
    >
      <div
        style={{
          width: box, height: box, borderRadius: r,
          background: `#${item.hex}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.13), 0 1px 4px rgba(0,0,0,0.07)",
          flexShrink: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/integrations/${item.slug}.svg`}
          alt={item.name}
          width={ico} height={ico}
          style={{
            width: ico, height: ico,
            filter: isDark ? "brightness(0)" : "brightness(0) invert(1)",
          }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
        />
      </div>
      <span
        style={{
          fontSize: 19, fontWeight: 700, color: "#0A0A0A",
          whiteSpace: "nowrap", letterSpacing: "-0.02em",
        }}
      >
        {item.name}
      </span>
    </div>
  );
}

/* ── Single marquee row ─────────────────────────────────── */
function MarqueeRow({
  items, reverse, speed,
}: {
  items: Integration[];
  reverse?: boolean;
  speed: number;
}) {
  const [paused, setPaused] = useState(false);
  /* Triple for seamless loop */
  const tripled = [...items, ...items, ...items];

  return (
    <div
      style={{ overflow: "hidden", position: "relative", width: "100%" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Fade left */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 200, zIndex: 2, pointerEvents: "none",
        maskImage: "linear-gradient(to right, black, transparent)",
        WebkitMaskImage: "linear-gradient(to right, black, transparent)",
        background: "white",
      }} />
      {/* Fade right */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 200, zIndex: 2, pointerEvents: "none",
        maskImage: "linear-gradient(to left, black, transparent)",
        WebkitMaskImage: "linear-gradient(to left, black, transparent)",
        background: "white",
      }} />

      <div
        style={{
          display: "flex", alignItems: "center", height: 104,
          width: "max-content", willChange: "transform",
          animation: `mq-scroll ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {tripled.map((item, i) => (
          <IntItem key={`${item.slug}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

/* ── Main export ──────────────────────────────────────────── */
export function LogoMarquee() {
  return (
    <div
      style={{
        background: "#FFFFFF",
        borderTop: "1px solid rgba(0,0,0,0.05)",
        borderBottom: "1px solid rgba(0,0,0,0.05)",
        padding: "64px 0",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes mq-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>

      <p style={{
        textAlign: "center", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.1em", textTransform: "uppercase",
        color: "#9CA3AF", marginBottom: 40,
      }}>
        Conecta com as ferramentas que você já usa
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <MarqueeRow items={ROW1} speed={40} />
        <MarqueeRow items={ROW2} speed={52} reverse />
        <MarqueeRow items={ROW3} speed={44} />
      </div>
    </div>
  );
}
