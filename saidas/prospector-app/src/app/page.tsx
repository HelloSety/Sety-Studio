'use client'
import { useQuery } from '@tanstack/react-query'
import { BarChart2, Users, MessageSquare, Megaphone, TrendingUp } from 'lucide-react'

interface DashboardData {
  totalLeads: number
  qualified: number
  contacted: number
  campaigns: number
  conversations: number
  replyRate: number
  daily: { date: string; count: number }[]
}

export default function DashboardPage() {
  const { data } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: () => fetch('/api/dashboard').then((r) => r.json()),
  })

  const stats = [
    { label: 'Total Leads', value: data?.totalLeads ?? 0, icon: Users, color: 'bg-green-950', change: '+142 esta semana' },
    { label: 'Conversas', value: data?.conversations ?? 0, icon: MessageSquare, color: 'bg-blue-950', change: `${data?.replyRate ?? 0}% taxa resposta` },
    { label: 'Campanhas', value: data?.campaigns ?? 0, icon: Megaphone, color: 'bg-purple-950', change: '3 ativas' },
    { label: 'Taxa Resposta', value: `${data?.replyRate ?? 0}%`, icon: TrendingUp, color: 'bg-amber-950', change: '+4% vs mês ant.' },
    { label: 'Qualificados', value: data?.qualified ?? 0, icon: BarChart2, color: 'bg-green-950', change: `${data?.totalLeads ? ((data.qualified / data.totalLeads) * 100).toFixed(1) : 0}% do total` },
  ]

  const maxDaily = Math.max(...(data?.daily?.map((d) => d.count) ?? [1]), 1)

  return (
    <>
      <div className="h-14 bg-[#111] border-b border-[#2A2A2A] flex items-center px-6 gap-4">
        <div>
          <h1 className="text-base font-semibold">Dashboard</h1>
          <p className="text-xs text-neutral-500">Junho 2026</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="px-3 py-1.5 text-xs border border-[#333] rounded-lg text-neutral-400 hover:bg-[#1A1A1A]">📅 Últimos 30 dias</button>
          <a href="/buscar" className="px-3 py-1.5 text-xs bg-green-500 text-black rounded-lg font-medium hover:bg-green-600">+ Buscar Leads</a>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-5 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] text-neutral-500">{s.label}</span>
                <div className={`w-8 h-8 ${s.color} rounded-lg flex items-center justify-center`}>
                  <s.icon size={14} className="text-neutral-300" />
                </div>
              </div>
              <div className="text-2xl font-bold mb-1">{s.value}</div>
              <div className="text-[11px] text-green-400">↑ {s.change}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold mb-4">Leads capturados por dia</h2>
          <div className="flex items-end gap-2" style={{ height: 120 }}>
            {data?.daily?.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-green-400 font-semibold">{d.count}</span>
                <div
                  className="w-full bg-green-500 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                  style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: 4 }}
                />
                <span className="text-[9px] text-neutral-500">{d.date.slice(5)}</span>
              </div>
            )) ?? (
              <div className="flex-1 flex items-center justify-center text-neutral-600 text-sm">
                Nenhum dado ainda. Busque leads para começar.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
