interface LogoProps { size?: number; className?: string }

function Meta({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#1877F2"/>
      <path d="M16.5 12.073C16.5 9.508 14.485 7.5 12 7.5S7.5 9.508 7.5 12.073c0 2.312 1.693 4.228 3.906 4.573v-3.234H10.07v-1.339h1.336V11.26c0-1.32.786-2.05 1.99-2.05.576 0 1.178.103 1.178.103v1.295h-.663c-.654 0-.856.406-.856.822v.987h1.46l-.233 1.339h-1.227v3.234C14.807 16.301 16.5 14.385 16.5 12.073z" fill="white"/>
    </svg>
  );
}

function Google({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="white"/>
      <path d="M21.6 12.23c0-.68-.06-1.34-.17-1.96H12v3.7h5.38c-.23 1.22-.94 2.25-2 2.94v2.44h3.24c1.9-1.75 2.98-4.33 2.98-7.12z" fill="#4285F4"/>
      <path d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.44c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.75-5.58-4.12H3.08v2.52C4.74 19.74 8.1 22 12 22z" fill="#34A853"/>
      <path d="M6.42 13.97A5.82 5.82 0 016.1 12c0-.69.12-1.36.32-1.97V7.51H3.08A9.97 9.97 0 002 12c0 1.63.39 3.17 1.08 4.49l3.34-2.52z" fill="#FBBC05"/>
      <path d="M12 6.5c1.47 0 2.79.5 3.83 1.5l2.87-2.87C17.06 3.6 14.7 2.5 12 2.5c-3.9 0-7.26 2.26-8.92 5.51l3.34 2.52C7.2 8.16 9.4 6.5 12 6.5z" fill="#EA4335"/>
    </svg>
  );
}

function WhatsApp({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#25D366"/>
      <path d="M12 4.5a7.5 7.5 0 00-6.33 11.5L4.5 19.5l3.6-1.15A7.5 7.5 0 1012 4.5zm0 13.5a6 6 0 01-3.05-.83l-.22-.13-2.28.73.74-2.22-.14-.23A6 6 0 1118 12a6 6 0 01-6 6zm3.27-4.49c-.18-.09-1.06-.52-1.22-.58-.16-.06-.28-.09-.4.09-.12.18-.46.58-.57.7-.1.12-.21.13-.39.04-.18-.09-.75-.27-1.44-.88-.53-.47-.89-1.06-.99-1.24-.1-.18-.01-.27.08-.36.08-.08.18-.21.27-.32.09-.1.12-.18.18-.3.06-.12.03-.22-.01-.31-.04-.09-.4-.97-.55-1.33-.14-.35-.29-.3-.4-.3h-.34c-.12 0-.31.05-.47.22-.16.18-.63.62-.63 1.5s.65 1.73.74 1.85c.09.12 1.26 1.92 3.05 2.69.43.18.76.29 1.02.37.43.14.82.12 1.13.07.34-.05 1.06-.43 1.21-.85.15-.42.15-.78.1-.85-.04-.07-.16-.12-.34-.21z" fill="white"/>
    </svg>
  );
}

function TikTok({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#010101"/>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.95a8.18 8.18 0 004.78 1.52V7.02a4.85 4.85 0 01-1.01-.33z" fill="white"/>
    </svg>
  );
}

function Shopify({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#96BF48"/>
      <path d="M16.8 5.9c0-.1-.1-.1-.2-.1s-1.3-.1-1.3-.1-.9-.9-1-.9V20l5-1.1s-2-13.3-2-13.4-.5.4-.5.4zm-2.7-.1c0-.1-.5-.1-.5-.1l-.6 1.9c-.6-.3-1.3-.4-2-.4-1.7 0-1.8 1.1-1.8 1.3 0 1.5 3.9 2.1 3.9 5.6 0 2.8-1.8 4.6-4.1 4.6-2.8 0-4.3-1.8-4.3-1.8l.8-2.5s1.5 1.3 2.8 1.3c.8 0 1.2-.6 1.2-1.1 0-2-3.2-2.1-3.2-5.3 0-2.7 1.9-5.4 5.9-5.4.9 0 1.7.2 1.7.2l.2.7z" fill="white"/>
    </svg>
  );
}

function Stripe({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#635BFF"/>
      <path d="M10.5 9.7c0-.7.6-1 1.5-1 1.3 0 3 .4 4.2 1l.7-4.3C15.8 4.8 13.9 4 12 4 8.8 4 6.5 5.6 6.5 8.9c0 5 6.7 4.2 6.7 6.3 0 .8-.7 1.1-1.8 1.1-1.5 0-3.5-.6-5-.9L5.7 20c1.5.6 3.1 1 4.6 1 3.3 0 5.8-1.6 5.8-4.9 0-5.2-6.6-4.3-6.6-6.4h1z" fill="white"/>
    </svg>
  );
}

function Amazon({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#131921"/>
      <path d="M5.5 16.5c3.2 2 6.8 3 10.7 3 2.6 0 5.1-.5 7.4-1.4.5-.2.1-.8-.4-.6-2.1.8-4.4 1.2-6.6 1.2-3.5 0-6.8-1-9.6-2.8-.4-.2-.8.2-.5.6z" fill="#FF9900"/>
      <path d="M18 14.5c-.3-.5-2-.7-2.7-.6-.7.1-.3.5.2.5.5 0 1.4.1 1.5.4.2.3-.7 2.2-.9 2.5-.2.3.2.4.4.2.9-1.1 1.8-2.5 1.5-3z" fill="#FF9900"/>
      <path d="M14 7c-1.4-.4-3-.4-4.2 0-1.5.5-2.5 1.5-2.5 3.2 0 2.8 2 4.2 4.2 4.2 1.1 0 2.3-.3 3.1-1.1l.4 1h2V8.2h-2.8L14 7zm.2 5.8c-.4.5-1 .7-1.7.7-1.4 0-2.3-1-2.3-2.4 0-1.5.9-2.4 2.3-2.4.7 0 1.3.2 1.7.7.4.5.6 1.1.6 1.8 0 .6-.2 1.2-.6 1.6z" fill="white"/>
    </svg>
  );
}

function MercadoLivre({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#FFE600"/>
      <path d="M12 5c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm0 12.5c-3.03 0-5.5-2.47-5.5-5.5S8.97 6.5 12 6.5s5.5 2.47 5.5 5.5-2.47 5.5-5.5 5.5z" fill="#009EE3"/>
      <path d="M12 8.5c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm0 5.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="#009EE3"/>
    </svg>
  );
}

function MercadoPago({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#009EE3"/>
      <path d="M12 5c-3.86 0-7 3.14-7 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm.5 10.5h-1v-5.24l-1.5.87-.5-.87 2.5-1.44V15.5zm2.5-1.5c-.27 0-.5-.22-.5-.5v-4c0-.27.22-.5.5-.5h1.5v1h-1v3h1v1H15z" fill="white"/>
    </svg>
  );
}

function Shopee({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#EE4D2D"/>
      <path d="M12 4.5a4 4 0 00-4 4h1.5A2.5 2.5 0 0112 6a2.5 2.5 0 012.5 2.5H16A4 4 0 0012 4.5zm-5 5l.63 7h8.74l.63-7H7z" fill="white"/>
      <circle cx="10" cy="8" r=".75" fill="white"/>
      <circle cx="14" cy="8" r=".75" fill="white"/>
    </svg>
  );
}

function Nuvemshop({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#1E1E2E"/>
      <path d="M17 10.5a3.5 3.5 0 00-6.46-1.87A2.5 2.5 0 007 11a2.5 2.5 0 002.5 2.5h7A2.5 2.5 0 0019 11a2.5 2.5 0 00-2-2.46z" fill="white"/>
      <rect x="8" y="14" width="8" height="1" rx=".5" fill="#7C3AED"/>
      <rect x="9" y="15.5" width="6" height="1" rx=".5" fill="#A78BFA"/>
    </svg>
  );
}

function WooCommerce({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#7F54B3"/>
      <path d="M3 8.5h18v1.2H3zm0 5.8h18v1.2H3z" fill="rgba(255,255,255,0.3)"/>
      <text x="3.5" y="14.5" fontSize="5" fontWeight="bold" fill="white" fontFamily="Arial,sans-serif">WooCommerce</text>
    </svg>
  );
}

function Bling({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#FF6B00"/>
      <path d="M9 6h3.5c2 0 3.5 1.2 3.5 3 0 1-.5 1.8-1.3 2.3C15.8 11.9 16.5 13 16.5 14c0 2-1.7 3.5-4 3.5H9V6zm2 4.5h1.5c.8 0 1.5-.5 1.5-1.2 0-.8-.7-1.3-1.5-1.3H11v2.5zm0 5H13c1 0 1.7-.6 1.7-1.5S14 12.5 13 12.5H11V15.5z" fill="white"/>
    </svg>
  );
}

function TinyERP({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#0066CC"/>
      <path d="M6 7.5h12v2H6zM6 11h12v2H6zM6 14.5h8v2H6z" fill="white" opacity=".3"/>
      <text x="5" y="15.5" fontSize="7" fontWeight="900" fill="white" fontFamily="Arial,sans-serif">tiny</text>
    </svg>
  );
}

function MelhorEnvio({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#00C2D4"/>
      <path d="M5 10h10l-1.3 5.5H6.3L5 10zm0 0l.8-3h8.4l.8 3" stroke="white" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      <circle cx="9" cy="17" r="1.2" fill="white"/>
      <circle cx="14" cy="17" r="1.2" fill="white"/>
      <path d="M16 10l3-2v5l-3-1" fill="white" opacity=".8"/>
    </svg>
  );
}

function Correios({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#F5A500"/>
      <rect x="5" y="8" width="14" height="9" rx="1.5" fill="white"/>
      <path d="M5 9.5l7 4 7-4" stroke="#F5A500" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function Asaas({ size = 24 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#00D4AA"/>
      <path d="M12 6L8 15h2.5l.7-2h2.6l.7 2H17L13 6h-1zm-.6 5.5l.9-2.7.9 2.7H11.4z" fill="white"/>
    </svg>
  );
}

const brandMap: Record<string, React.FC<LogoProps>> = {
  meta: Meta,
  facebook: Meta,
  google: Google,
  whatsapp: WhatsApp,
  tiktok: TikTok,
  shopify: Shopify,
  stripe: Stripe,
  amazon: Amazon,
  mercadolivre: MercadoLivre,
  "mercado livre": MercadoLivre,
  mercadopago: MercadoPago,
  "mercado pago": MercadoPago,
  shopee: Shopee,
  nuvemshop: Nuvemshop,
  woocommerce: WooCommerce,
  bling: Bling,
  tiny: TinyERP,
  "tiny erp": TinyERP,
  "bling erp": Bling,
  melhorenvio: MelhorEnvio,
  "melhor envio": MelhorEnvio,
  correios: Correios,
  asaas: Asaas,
};

export function BrandLogo({ brand, size = 24, className }: { brand: string; size?: number; className?: string }) {
  const key = brand.toLowerCase();
  const Component = brandMap[key];
  if (!Component) return null;
  return <Component size={size} className={className} />;
}
