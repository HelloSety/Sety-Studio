'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Zap, Trash2 } from 'lucide-react'

interface Script { id: string; name: string; type: 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'; content: string }

const TYPES = [
  { value: 'TEXT', label: '📝 Texto' },
  { value: 'IMAGE', label: '🖼️ Imagem' },
  { value: 'VIDEO', label: '🎥 Vídeo' },
  { value: 'DOCUMENT', label: '📄 Documento' },
]

export default function ScriptsPage() {
  const [form, setForm] = useState({ name: '', type: 'TEXT', content: '' })
  const [showForm, setShowForm] = useState(false)
  const qc = useQueryClient()

  const { data: scripts = [] } = useQuery<Script[]>({
    queryKey: ['scripts'],
    queryFn: () => fetch('/api/scripts').then((r) => r.json()),
  })

  const createMutation = useMutation({
    mutationFn: (data: typeof form) =>
      fetch('/api/scripts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then((r) => r.json()),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['scripts'] }); setForm({ name: '', type: 'TEXT', content: '' }); setShowForm(false) },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetch(`/api/scripts?id=${id}`, { method: 'DELETE' }).then((r) => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scripts'] }),
  })

  const byType = (type: string) => scripts.filter((s) => s.type === type)

  return (
    <>
      <div className="h-14 bg-[#111] border-b border-[#2A2A2A] flex items-center px-6 gap-3">
        <h1 className="text-base font-semibold">Biblioteca de Scripts</h1>
        <div className="ml-auto">
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-4 py-1.5 text-xs bg-green-500 text-black rounded-lg font-semibold hover:bg-green-600">
            <Plus size={12} /> Novo Script
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-5">
        {showForm && (
          <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-5">
            <h2 className="text-sm font-semibold mb-4">Novo Script</h2>
            <div className="grid grid-cols-[1fr_2fr] gap-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Nome</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex: Saudação inicial" className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-neutral-200 outline-none focus:border-green-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Tipo</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TYPES.map((t) => (
                      <button key={t.value} onClick={() => setForm({ ...form, type: t.value })} className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${form.type === t.value ? 'bg-green-950 border-green-500 text-green-400' : 'bg-[#1A1A1A] border-[#2A2A2A] text-neutral-400 hover:border-[#333]'}`}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                    {form.type === 'TEXT' ? 'Mensagem' : 'URL da mídia ou mensagem de legenda'}
                  </label>
                  <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder={form.type === 'TEXT' ? 'Olá {{nome}}! ...' : 'https://...'} className="w-full h-28 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-neutral-200 outline-none focus:border-green-500 resize-none" />
                  {form.type === 'TEXT' && (
                    <div className="flex gap-1.5 mt-2">
                      {['{{nome}}', '{{cidade}}', '{{categoria}}'].map((v) => (
                        <button key={v} onClick={() => setForm({ ...form, content: form.content + v })} className="px-2 py-0.5 bg-[#1A1A1A] border border-[#2A2A2A] rounded-full text-[10px] text-neutral-500 hover:border-green-500 hover:text-green-400 transition-colors">{v}</button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowForm(false)} className="px-3 py-2 text-sm border border-[#333] rounded-lg text-neutral-400 hover:bg-[#1A1A1A]">Cancelar</button>
                  <button onClick={() => createMutation.mutate(form)} disabled={!form.name || !form.content} className="px-4 py-2 text-sm bg-green-500 text-black rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50">Salvar Script</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          {TYPES.map((type) => (
            <div key={type.value} className="bg-[#111] border border-[#2A2A2A] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-widest">{type.label}</span>
                <span className="bg-[#1A1A1A] px-2 py-0.5 rounded-full text-[10px] text-neutral-500">{byType(type.value).length}</span>
              </div>
              <div className="space-y-2">
                {byType(type.value).map((script) => (
                  <div key={script.id} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3 group cursor-pointer hover:border-green-500/50 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[12.5px] font-medium text-neutral-200 flex items-center gap-1.5">
                        <Zap size={10} className="text-green-400 flex-shrink-0" />
                        {script.name}
                      </p>
                      <button onClick={() => deleteMutation.mutate(script.id)} className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-400 transition-all flex-shrink-0">
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <p className="text-[11.5px] text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed">{script.content}</p>
                  </div>
                ))}
                {byType(type.value).length === 0 && (
                  <div className="text-center py-6 text-neutral-700 text-xs">Nenhum script</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
