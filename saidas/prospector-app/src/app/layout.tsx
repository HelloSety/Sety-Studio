import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/sidebar'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ProspectAI — Captação de Leads Local',
  description: 'SaaS de prospecção local com WhatsApp integrado',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-[#0A0A0A] text-neutral-100 flex h-screen overflow-hidden`}>
        <Providers>
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-hidden">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
