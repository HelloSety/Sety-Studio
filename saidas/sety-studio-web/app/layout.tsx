import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/layout/SmoothScroll';
import CustomCursor from '@/components/layout/CustomCursor';
import Loading from '@/components/layout/Loading';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['700', '800', '900'],
  display: 'swap',
  preload: true,
});

const BASE_URL = 'https://setystudio.com.br';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Sety Studio — Sites, Anuncios e Automacoes para Negocios de Alto Valor',
    template: '%s | Sety Studio',
  },
  description:
    'Agencia digital especializada em sites de alta conversao, trafego pago e automacoes para clinicas, imobiliarias, advogados e negocios que querem crescer online.',
  keywords: [
    'agencia digital',
    'sites premium',
    'landing page',
    'trafego pago',
    'meta ads',
    'google ads',
    'automacao whatsapp',
    'marketing digital',
    'site para clinica',
    'site para advocacia',
    'site para imobiliaria',
    'energia solar marketing',
    'consorcio digital',
  ],
  authors: [{ name: 'Sety Studio', url: BASE_URL }],
  creator: 'Sety Studio',
  publisher: 'Sety Studio',
  icons: {
    icon: [
      { url: '/favicon.ico',    sizes: 'any',   type: 'image/x-icon' },
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-192.png',sizes: '192x192',type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: BASE_URL,
    siteName: 'Sety Studio',
    title: 'Sety Studio — Sites e Marketing Digital para Negocios de Alto Valor',
    description:
      'Criamos sites, anuncios e automacoes que geram clientes todos os dias. Especialistas em clinicas, imobiliarias, advocacia, energia solar e consorcio.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Sety Studio' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sety Studio — Agencia Digital Premium',
    description: 'Sites que vendem. Anuncios que convertem. Automacoes que trabalham 24h.',
    images: ['/og-image.png'],
  },
  alternates: { canonical: BASE_URL },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#050505',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <meta name="theme-color" content="#050505" />
        <meta name="color-scheme" content="dark" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ProfessionalService',
              name: 'Sety Studio',
              url: BASE_URL,
              description: 'Agencia digital especializada em sites, trafego pago e automacoes para negocios de alto valor.',
              serviceType: ['Web Design', 'Marketing Digital', 'Automacao'],
              areaServed: { '@type': 'Country', name: 'Brasil' },
              knowsAbout: ['Sites premium', 'Landing Pages', 'Meta Ads', 'Google Ads', 'Automacao WhatsApp', 'Branding'],
            }),
          }}
        />
      </head>
      <body>
        <Loading />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
