import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { CursorGlow }     from "./components/ui/CursorGlow";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sety Vision — Sistema Operacional do seu Negócio",
  description: "CRM com IA, automação de vendas, WhatsApp, campanhas, landing pages e muito mais. Tudo em uma plataforma premium para empresas brasileiras.",
  keywords: "CRM, automação, WhatsApp, vendas, marketing, IA, Brazil",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-[#0A0A0A]">
        <ScrollProgress />
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
