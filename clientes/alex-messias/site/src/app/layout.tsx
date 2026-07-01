import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const baseUrl = "https://alexmessias.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Alex Messias | Consultor Especialista GWM — Campinas, Jundiaí e SP",
    template: "%s | Alex Messias · Consultor GWM",
  },
  description:
    "Consultoria especializada em veículos GWM. Haval H6, ORA 5, Tank 300. Atendimento personalizado em Campinas, Jundiaí e São Paulo. Financiamento, consórcio e test drive facilitados.",
  keywords: [
    "GWM", "Haval H6", "Haval H6 GT", "ORA 5", "Tank 300",
    "consultor GWM", "carro híbrido Campinas", "carro elétrico Jundiaí",
    "Alex Messias consultor", "veículos GWM São Paulo", "consórcio GWM",
    "financiamento GWM", "test drive GWM", "mobilidade híbrida",
  ],
  openGraph: {
    title: "Alex Messias | Consultor Especialista GWM",
    description: "Consultoria personalizada em veículos GWM — híbridos, plug-in e elétricos.",
    type: "website",
    locale: "pt_BR",
    url: baseUrl,
    siteName: "Alex Messias Consultor GWM",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex Messias | Consultor GWM",
    description: "Consultoria personalizada em veículos GWM.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: baseUrl },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Alex Messias",
  jobTitle: "Consultor Especialista GWM",
  description: "Consultoria especializada em veículos híbridos e elétricos GWM",
  url: baseUrl,
  areaServed: ["Campinas", "Jundiaí", "São Paulo"],
  knowsAbout: ["GWM", "Haval H6", "ORA 5", "Veículos Híbridos", "Veículos Elétricos"],
  sameAs: ["https://www.instagram.com/alexmessiasoficial/"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-full bg-white antialiased">{children}</body>
    </html>
  );
}
