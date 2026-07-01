'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Download, Upload, ChevronLeft, ChevronRight } from 'lucide-react'
import { LeadStatus } from '@prisma/client'

interface Lead {
  id: string
  name: string
  category: string
  city: string
  state: string
  phone: string | null
  website: string | null
  instagram: string | null
  score: number
  status: LeadStatus
}

const STATUS_LABELS: Record<LeadStatus, { label: string; cls: string }> = {
  ACTIVE: { label: 'Ativo', cls: 'bg-green-950 text-green-400' },
  QUALIFIED: { label: 'Qualificado', cls: 'bg-amber-950 text-amber-400' },
  CONTACTED: { label: 'Em Contato', cls: 'bg-blue-950 text-blue-400' },
  ARCHIVED: { label: 'Arquivado', cls: 'bg-neutral-800 text-neutral-400' },
}

const TABS: { status: LeadStatus | null; label: string }[] = [
  { status: null, label: 'Todos' },
  { status: 'ACTIVE', label: 'Ativos' },
  { status: 'QUALIFIED', label: '⭐ Qualificados' },
  { status: 'CONTACTED', label: 'Em Contato' },
  { status: 'ARCHIVED', label: 'Arquivados' },
]

export default function LeadsPage() {
  const [tab, setTab] = useState<LeadStatus | null>(null)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const qc = useQueryClient()

  const { data } = useQuery({
    queryKey: ['leads', tab, query, page],
    queryFn: () => {
      const p = new URLSearchParams({ page: String(page), limit: '50' })
      if (tab) p.set('status', tab)
      if (query) p.set('q', query)
      return fetch(`/api/leads?${p}`).then((r) => r.json())
    },
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      fetch('/api/leads', { method: 'PATCH', body: JSON.stringify({ id, status }), headers: { 'Content-Type': 'application/json' } }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leads'] }),
  })

  const exportCSV = () => {
    const url = `/api/leads/export${tab ? `?status=${tab}` : ''}`
    window.open(url)
  }

  const leads: Lead[] = data?.leads ?? []

  return (
    <>
      <div className="h-14 bg-[#111] border-b border-[#2A2A2A] flex items-center px-6 gap-3">
        <div>
          <h1 className="text-base font-semibold">CRM de Leads</h1>
          <p className="text-xs text-neutral-500">{data?.total ?? 0} leads</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#333] rounded-lg text-neutral-400 hover:bg-[#1A1A1A]">
            <Download size={12} /> Exportar CSV
          </button>
          <a href="/buscar" className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-green-500 text-black rounded-lg font-medium hover:bg-green-600">
            + Buscar mais
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="flex gap-1 bg-[#1A1A1A] rounded-xl p-1 w-fit mb-5">
          {TABS.map((t) => (
            <button
              key={t.label}
              onClick={() => { setTab(t.status); setPage(1) }}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                tab === t.status ? 'bg-[#111] text-white shadow' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              placeholder="Buscar por nome, cidade, telefone..."
              className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg pl-8 pr-3 py-2 text-sm text-neutral-200 outline-none focus:border-green-500 placeholder:text-neutral-600"
            />
          </div>
        </div>

        <div className="bg-[#111] border border-[#2A2A2A] rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1A1A1A]">
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Empresa</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Contato</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Presença</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Score</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Ações</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t border-[#2A2A2A] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-[13.5px] font-medium text-white">{lead.name}</div>
                      <div className="text-[11px] text-neutral-500">{lead.city}{lead.state ? `, ${lead.state}` : ''} · {lead.category}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[12px] text-neutral-400 space-y-0.5">
                      {lead.phone && <div>📞 {lead.phone}</div>}
                      {lead.website && <div className="truncate max-w-[160px]">🌐 {lead.website}</div>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className={`w-5 h-5 rounded text-[10px] flex items-center justify-center ${lead.phone ? 'bg-green-950' : 'bg-neutral-800 opacity-40'}`}>📞</span>
                      <span className={`w-5 h-5 rounded text-[10px] flex items-center justify-center ${lead.website ? 'bg-green-950' : 'bg-neutral-800 opacity-40'}`}>🌐</span>
                      <span className={`w-5 h-5 rounded text-[10px] flex items-center justify-center ${lead.instagram ? 'bg-green-950' : 'bg-neutral-800 opacity-40'}`}>📷</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus.mutate({ id: lead.id, status: e.target.value as LeadStatus })}
                      className={`text-[11px] font-medium px-2 py-1 rounded-full border-0 outline-none cursor-pointer ${STATUS_LABELS[lead.status].cls}`}
                    >
                      {Object.entries(STATUS_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-[#222] rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${lead.score}%` }} />
                      </div>
                      <span className="text-[12px] font-semibold text-green-400">{lead.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <a href={`/whatsapp?lead=${lead.id}`} className="w-7 h-7 bg-[#1A1A1A] border border-[#333] rounded-lg flex items-center justify-center text-[12px] hover:bg-[#222] transition-colors" title="Enviar WhatsApp">💬</a>
                    </div>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-neutral-500 text-sm">
                    Nenhum lead encontrado. <a href="/buscar" className="text-green-400 underline">Buscar leads</a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data?.pages > 1 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <span className="text-xs text-neutral-500">Página {page} de {data.pages} · {data.total} leads</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-1 px-3 py-1.5 text-xs border border-[#333] rounded-lg text-neutral-400 hover:bg-[#1A1A1A] disabled:opacity-40">
                <ChevronLeft size={12} /> Anterior
              </button>
              <button onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page === data.pages} className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-500 text-black rounded-lg font-medium hover:bg-green-600 disabled:opacity-40">
                Próximo <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
