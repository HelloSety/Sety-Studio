'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Play, Pause, Plus, Megaphone } from 'lucide-react'

interface Campaign {
  id: string
  name: string
  status: 'DRAFT' | 'RUNNING' | 'PAUSED' | 'COMPLETED'
  sent: number
  delivered: number
  replied: number
  segment: string | null
  city: string | null
  delay: number
  _count: { campaignLeads: number }
}

const NICHES = [
  '🦷 Clínica Odontológica', '✨ Clínica de Estética', '☀️ Energia Solar',
  '⚖️ Advocacia', '🏢 Imobiliária', '📈 Consórcios',
]

const STATUS_CONFIG = {
  DRAFT: { label: 'Rascunho', cls: 'bg-neutral-800 text-neutral-400' },
  RUNNING: { label: '● Ativa', cls: 'bg-green-950 text-green-400' },
  PAUSED: { label: '⏸ Pausada', cls: 'bg-amber-950 text-amber-400' },
  COMPLETED: { label: '✓ Concluída', cls: 'bg-neutral-800 text-neutral-400' },
}

export default function CampanhasPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', message: 'Olá {{nome}}! Tudo bem? 🙂\n\nSomos a Sety Studio, agência digital especializada em negócios de alto valor.\n\nPodemos ajudar {{nome}} a atrair mais clientes online. Posso te mostrar como? Demora só 15 min.',
    segment: '', city: '', limit: 0, delay: 35, varyDelay: true,
  })
  const qc = useQueryClient()

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ['campaigns'],
    queryFn: () => fetch('/api/campaigns').then((r) => r.json()),
  })

  const createMutation = useMutation({
    mutationFn: (data: typeof form) =>
      fetch('/api/campaigns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['campaigns'] }); setShowForm(false) },
  })

  const fireMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/campaigns/${id}/fire`, { method: 'POST' }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] }),
  })

  const preview = form.message.replace(/\{\{nome\}\}/g, 'Empresa Exemplo').replace(/\{\{cidade\}\}/g, form.city || 'São Paulo').replace(/\{\{categoria\}\}/g, form.segment || 'negócio')

  return (
    <>
      <div className="h-14 bg-[#111] border-b border-[#2A2A2A] flex items-center px-6 gap-3">
        <div>
          <h1 className="text-base font-semibold">Campanhas</h1>
          <p className="text-xs text-neutral-500">{campaigns.length} campanhas</p>
        </div>
        <div className="ml-auto">
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-4 py-1.5 text-xs bg-green-500 text-black rounded-lg font-semibold hover:bg-green-600">
            <Plus size={12} /> Nova Campanha
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-5">
        {showForm && (
          <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-6">
            <h2 className="text-sm font-semibold mb-5">Nova Campanha</h2>
            <div className="grid grid-cols-[1fr_1fr_320px] gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Nome da campanha</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Prospecção Clínicas SP" className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-neutral-200 outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Segmento</label>
                  <select value={form.segment} onChange={(e) => setForm({ ...form, segment: e.target.value })} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-neutral-200 outline-none focus:border-green-500">
                    <option value="">Todos</option>
                    {NICHES.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Cidade</label>
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="São Paulo" className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-neutral-200 outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Limite de leads (0 = sem limite)</label>
                  <input type="number" value={form.limit} onChange={(e) => setForm({ ...form, limit: Number(e.target.value) })} className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-neutral-200 outline-none focus:border-green-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Mensagem</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full h-[160px] bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-neutral-200 outline-none focus:border-green-500 resize-none"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['{{nome}}', '{{cidade}}', '{{categoria}}', '{{bairro}}'].map((v) => (
                    <button key={v} onClick={() => setForm({ ...form, message: form.message + v })} className="px-2 py-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-[11px] text-neutral-400 hover:border-green-500 hover:text-green-400 transition-colors">{v}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Delay entre mensagens: {form.delay}s</label>
                  <input type="range" min={15} max={180} value={form.delay} onChange={(e) => setForm({ ...form, delay: Number(e.target.value) })} className="w-full" />
                  <p className="text-[11px] text-neutral-600 mt-1">Min: 15s · Max: 180s · Recomendado: 35–60s</p>
                </div>
                <label className="flex items-center gap-2 text-sm text-neutral-400 cursor-pointer">
                  <input type="checkbox" checked={form.varyDelay} onChange={(e) => setForm({ ...form, varyDelay: e.target.checked })} className="accent-green-500" />
                  Variar intervalo (±50%)
                </label>
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3">
                  <p className="text-[11px] text-neutral-500 mb-2">Preview:</p>
                  <p className="text-[12px] text-neutral-300 leading-relaxed whitespace-pre-wrap">{preview}</p>
                </div>
                <div className="flex gap-2 mt-auto pt-2">
                  <button onClick={() => setShowForm(false)} className="flex-1 px-3 py-2 text-sm border border-[#333] rounded-lg text-neutral-400 hover:bg-[#1A1A1A]">Cancelar</button>
                  <button onClick={() => createMutation.mutate(form)} disabled={!form.name || !form.message} className="flex-1 px-3 py-2 text-sm bg-green-500 text-black rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50">🚀 Criar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {campaigns.map((camp) => {
            const total = camp._count.campaignLeads
            const pct = total > 0 ? Math.round((camp.sent / total) * 100) : 0
            const replyRate = camp.sent > 0 ? Math.round((camp.replied / camp.sent) * 100) : 0
            const statusConf = STATUS_CONFIG[camp.status]
            return (
              <div key={camp.id} className="bg-[#111] border border-[#2A2A2A] rounded-xl p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-sm font-semibold">{camp.name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{camp.segment ?? 'Todos os segmentos'} · {camp.city ?? 'Todas as cidades'}</p>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${statusConf.cls}`}>{statusConf.label}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div><div className="text-xl font-bold">{camp.sent}</div><div className="text-[10px] text-neutral-500">Enviadas</div></div>
                  <div><div className="text-xl font-bold text-green-400">{camp.replied}</div><div className="text-[10px] text-neutral-500">Respostas</div></div>
                  <div><div className="text-xl font-bold text-amber-400">{replyRate}%</div><div className="text-[10px] text-neutral-500">Taxa</div></div>
                </div>
                <div className="h-1 bg-[#222] rounded-full mb-2 overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[11px] text-neutral-600 mb-3">{total} leads · {pct}% enviado · delay: {camp.delay}s</p>
                <div className="flex gap-2">
                  {camp.status !== 'COMPLETED' && (
                    <button
                      onClick={() => fireMutation.mutate(camp.id)}
                      disabled={camp.status === 'RUNNING'}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs bg-green-500 text-black rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50"
                    >
                      {camp.status === 'RUNNING' ? <><Pause size={11} /> Pausar</> : <><Play size={11} /> Disparar</>}
                    </button>
                  )}
                </div>
              </div>
            )
          })}

          {campaigns.length === 0 && !showForm && (
            <div className="col-span-3 flex flex-col items-center justify-center py-16 text-neutral-600">
              <Megaphone size={36} className="mb-3 text-neutral-700" />
              <p className="text-sm">Nenhuma campanha ainda.</p>
              <button onClick={() => setShowForm(true)} className="mt-3 px-4 py-2 text-sm bg-green-500 text-black rounded-lg font-semibold hover:bg-green-600">+ Nova Campanha</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
