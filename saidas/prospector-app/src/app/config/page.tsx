'use client'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff, Save, CheckCircle } from 'lucide-react'

export default function ConfigPage() {
  const [fsqKey, setFsqKey] = useState('')
  const [gmapsKey, setGmapsKey] = useState('')
  const [showFsq, setShowFsq] = useState(false)
  const [showGmaps, setShowGmaps] = useState(false)
  const [saved, setSaved] = useState(false)

  const saveMutation = useMutation({
    mutationFn: () =>
      fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(fsqKey ? { fsq_api_key: fsqKey } : {}),
          ...(gmapsKey ? { gmaps_api_key: gmapsKey } : {}),
        }),
      }).then((r) => r.json()),
    onSuccess: () => {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  return (
    <>
      <div className="h-14 bg-[#111] border-b border-[#2A2A2A] flex items-center px-6">
        <h1 className="text-base font-semibold">Configurações</h1>
      </div>

      <div className="flex-1 overflow-auto p-6 max-w-[560px]">
        <div className="space-y-4">
          <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-sm font-semibold">Foursquare Places API</h2>
              <span className="bg-green-950 text-green-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">GRATUITO</span>
            </div>
            <p className="text-xs text-neutral-500 mb-4">1.000 buscas/dia sem custo. Recomendado.</p>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">FOURSQUARE API KEY</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showFsq ? 'text' : 'password'}
                  value={fsqKey}
                  onChange={(e) => setFsqKey(e.target.value)}
                  placeholder="fsq3abc..."
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-neutral-200 outline-none focus:border-green-500 pr-9"
                />
                <button onClick={() => setShowFsq(!showFsq)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
                  {showFsq ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-sm font-semibold">Google Maps API</h2>
              <span className="bg-amber-950 text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">PAGO</span>
            </div>
            <div className="bg-amber-950/40 border border-amber-500/20 rounded-lg p-3 mb-4 text-xs text-amber-300">
              <strong>⚠️ Ative a "Places API (New)"</strong> — não a "Places API" antiga. São APIs diferentes no Console do Google.
            </div>
            <label className="block text-xs font-medium text-neutral-400 mb-1.5">API KEY</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showGmaps ? 'text' : 'password'}
                  value={gmapsKey}
                  onChange={(e) => setGmapsKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-neutral-200 outline-none focus:border-green-500 pr-9"
                />
                <button onClick={() => setShowGmaps(!showGmaps)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300">
                  {showGmaps ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-green-500 text-black rounded-lg font-semibold text-sm hover:bg-green-600 disabled:opacity-50 transition-colors"
          >
            {saved ? <><CheckCircle size={14} /> Salvo!</> : <><Save size={14} /> Salvar configurações</>}
          </button>
        </div>
      </div>
    </>
  )
}
