'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  BarChart2, Search, Users, MessageSquare, Megaphone, Zap, Settings
} from 'lucide-react'

const nav = [
  { label: 'Dashboard', href: '/', icon: BarChart2, section: 'Principal' },
  { label: 'Buscar Leads', href: '/buscar', icon: Search, section: 'Principal' },
  { label: 'CRM de Leads', href: '/leads', icon: Users, badge: null, section: 'Principal' },
  { label: 'Conversas', href: '/whatsapp', icon: MessageSquare, badge: null, section: 'WhatsApp' },
  { label: 'Campanhas', href: '/campanhas', icon: Megaphone, section: 'WhatsApp' },
  { label: 'Scripts', href: '/scripts', icon: Zap, section: 'WhatsApp' },
  { label: 'Configurações', href: '/config', icon: Settings, section: 'Config' },
]

export function Sidebar() {
  const path = usePathname()
  const sections = [...new Set(nav.map((n) => n.section))]

  return (
    <aside className="w-[220px] min-w-[220px] bg-[#111] border-r border-[#2A2A2A] flex flex-col">
      <div className="px-5 py-4 border-b border-[#2A2A2A] flex items-center gap-2.5">
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-base">🎯</div>
        <span className="text-[15px] font-bold">ProspectAI</span>
        <span className="ml-auto text-[9px] text-green-400 bg-green-950 px-1.5 py-0.5 rounded font-semibold">PRO</span>
      </div>

      <nav className="flex-1 py-3">
        {sections.map((section) => (
          <div key={section}>
            <p className="px-4 pt-3 pb-1 text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">{section}</p>
            {nav.filter((n) => n.section === section).map((item) => {
              const active = path === item.href || (item.href !== '/' && path.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] transition-colors relative',
                    active
                      ? 'bg-green-950 text-green-400 before:absolute before:left-0 before:inset-y-0 before:w-0.5 before:bg-green-400 before:rounded-r'
                      : 'text-neutral-400 hover:bg-[#1A1A1A] hover:text-neutral-200'
                  )}
                >
                  <item.icon size={15} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-[#2A2A2A]">
        <div className="flex items-center gap-2.5 p-2.5 bg-[#1A1A1A] rounded-xl cursor-pointer hover:bg-[#222] transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center text-[13px] font-bold text-black">S</div>
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-semibold">Seven</p>
            <p className="text-[10px] text-green-400">Plano Pro</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
