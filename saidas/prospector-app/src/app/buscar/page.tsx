'use client'
import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Search, MapPin, X, Plus } from 'lucide-react'

const MapPicker = dynamic(() => import('@/components/map-picker'), { ssr: false })

const NICHES: { emoji: string; label: string; featured?: boolean }[] = [
  { emoji: '🦷', label: 'Clínica Odontológica', featured: true },
  { emoji: '✨', label: 'Clínica de Estética', featured: true },
  { emoji: '☀️', label: 'Energia Solar', featured: true },
  { emoji: '⚖️', label: 'Advocacia', featured: true },
  { emoji: '🏢', label: 'Imobiliária', featured: true },
  { emoji: '📈', label: 'Consórcios', featured: true },
  { emoji: '🏥', label: 'Clínica Médica' },
  { emoji: '🧬', label: 'Dermatologista' },
  { emoji: '💊', label: 'Farmácia' },
  { emoji: '🧘', label: 'Academia' },
  { emoji: '🥗', label: 'Nutricionista' },
  { emoji: '🧠', label: 'Psicólogo' },
  { emoji: '🍕', label: 'Pizzaria' },
  { emoji: '🍔', label: 'Hamburgueria' },
  { emoji: '☕', label: 'Cafeteria' },
  { emoji: '🍣', label: 'Sushi' },
  { emoji: '🏗️', label: 'Construtora' },
  { emoji: '📐', label: 'Arquitetura' },
  { emoji: '🔧', label: 'Elétricista' },
  { emoji: '🎨', label: 'Pintor' },
  { emoji: '👕', label: 'Loja de Roupas' },
  { emoji: '💎', label: 'Joalheria' },
  { emoji: '📱', label: 'Agência Digital' },
  { emoji: '💻', label: 'Dev de Sites' },
]

interface Location {
  name: string
  ll: string
  radius: number
  lat: number
  lng: number
}

type SearchState = 'idle' | 'running' | 'done'

export default function BuscarPage() {
  const [selected, setSelected] = useState<string[]>(['Clínica Odontológica', 'Clínica de Estética', 'Advocacia', 'Imobiliária'])
  const [locations, setLocations] = useState<Location[]>([])
  const [requirePhone, setRequirePhone] = useState(true)
  const [requireSite, setRequireSite] = useState(false)
  const [requireInstagram, setRequireInstagram] = useState(false)
  const [limit, setLimit] = useState(110)
  const [state, setState] = useState<SearchState>('idle')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{ total: number } | null>(null)

  const toggleNiche = (label: string) => {
    setSelected((p) => p.includes(label) ? p.filter((x) => x !== label) : [...p, label])
  }

  const onMapClick = useCallback((lat: number, lng: number, name: string) => {
    setLocations((p) => [...p, { name, ll: `${lat},${lng}`, radius: 50, lat, lng }])
  }, [])

  const updateRadius = (i: number, radius: number) => {
    setLocations((p) => p.map((l, idx) => idx === i ? { ...l, radius } : l))
  }

  const removeLocation = (i: number) => {
    setLocations((p) => p.filter((_, idx) => idx !== i))
  }

  const handleSearch = async () => {
    if (selected.length === 0 || locations.length === 0) return
    setState('running')
    setProgress(0)

    const interval = setInterval(() => setProgress((p) => Math.min(p + Math.random() * 15 + 5, 90)), 400)

    try {
      const res = await fetch('/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: selected, locations, limit, requirePhone, requireSite, requireInstagram }),
      })
      const data = await res.json()
      clearInterval(interval)
      setProgress(100)
      setState('done')
      setResult(data)
    } catch {
      clearInterval(interval)
      setState('idle')
    }
  }

  const featured = NICHES.filter((n) => n.featured)
  const rest = NICHES.filter((n) => !n.featured)

  return (
    <>
      <div className="h-14 bg-[#111] border-b border-[#2A2A2A] flex items-center px-6 gap-3">
        <div>
          <h1 className="text-base font-semibold">Buscar Leads</h1>
          <p className="text-xs text-neutral-500">Foursquare Places API · 1.000 buscas/dia grátis</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#333] rounded-lg text-neutral-400 hover:bg-[#1A1A1A]">
            📥 Importar CSV
          </button>
          <button
            onClick={handleSearch}
            disabled={selected.length === 0 || locations.length === 0 || state === 'running'}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs bg-green-500 text-black rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search size={12} /> Iniciar Busca
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-[1fr_380px] gap-5">
          {/* LEFT: CATEGORIES */}
          <div className="space-y-4">
            <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-5">
              <h2 className="text-sm font-semibold mb-4">Segmentos / Nichos</h2>

              <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">🎯 Focos da Sety Studio</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {featured.map((n) => (
                  <button
                    key={n.label}
                    onClick={() => toggleNiche(n.label)}
                    className={`px-3 py-1.5 rounded-full text-[12.5px] border transition-colors ${
                      selected.includes(n.label)
                        ? 'bg-green-950 border-green-500 text-green-400'
                        : 'bg-[#1A1A1A] border-[#2A2A2A] text-neutral-400 hover:border-[#333] hover:text-neutral-200'
                    }`}
                  >
                    {n.emoji} {n.label}
                  </button>
                ))}
              </div>

              <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">Outros segmentos</p>
              <div className="flex flex-wrap gap-2">
                {rest.map((n) => (
                  <button
                    key={n.label}
                    onClick={() => toggleNiche(n.label)}
                    className={`px-3 py-1.5 rounded-full text-[12.5px] border transition-colors ${
                      selected.includes(n.label)
                        ? 'bg-green-950 border-green-500 text-green-400'
                        : 'bg-[#1A1A1A] border-[#2A2A2A] text-neutral-400 hover:border-[#333] hover:text-neutral-200'
                    }`}
                  >
                    {n.emoji} {n.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-5">
              <h2 className="text-sm font-semibold mb-4">Filtros de Qualidade</h2>
              <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">Salvar apenas leads com:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { label: '📞 Telefone', key: 'phone', val: requirePhone, set: setRequirePhone },
                  { label: '🌐 Site', key: 'site', val: requireSite, set: setRequireSite },
                  { label: '📷 Instagram', key: 'ig', val: requireInstagram, set: setRequireInstagram },
                ].map((f) => (
                  <button
                    key={f.key}
                    onClick={() => f.set(!f.val)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors ${
                      f.val ? 'bg-green-950 border-green-500 text-green-400' : 'bg-[#1A1A1A] border-[#2A2A2A] text-neutral-400'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest mb-2">Máx. resultados por categoria</p>
              <div className="flex items-center gap-3">
                <input
                  type="range" min={10} max={300} value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-semibold text-green-400 w-8 text-right">{limit}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: MAP */}
          <div className="space-y-4">
            <div className="bg-[#111] border border-[#2A2A2A] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold">Localização</h2>
                <span className="text-xs text-neutral-500">{locations.length} pin{locations.length !== 1 ? 's' : ''}</span>
              </div>

              <div className="rounded-lg overflow-hidden mb-4 h-[200px]">
                <MapPicker locations={locations} onMapClick={onMapClick} />
              </div>

              <div className="space-y-3">
                {locations.map((loc, i) => (
                  <div key={i} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={12} className="text-green-400 flex-shrink-0" />
                      <span className="text-sm font-medium flex-1 truncate">{loc.name}</span>
                      <span className="text-xs text-neutral-500">{loc.radius} km</span>
                      <button onClick={() => removeLocation(i)} className="text-neutral-500 hover:text-red-400 transition-colors">
                        <X size={13} />
                      </button>
                    </div>
                    <input
                      type="range" min={5} max={300} value={loc.radius}
                      onChange={(e) => updateRadius(i, Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                ))}

                {locations.length === 0 && (
                  <div className="text-center py-6 text-sm text-neutral-600">
                    <MapPin size={20} className="mx-auto mb-2 text-neutral-700" />
                    Clique no mapa para adicionar uma localização
                  </div>
                )}
              </div>

              {state === 'running' && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-400">Buscando leads...</span>
                    <span className="text-green-400 font-semibold">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-1 bg-[#222] rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              {state === 'done' && result && (
                <div className="mt-4 p-3 bg-green-950/50 border border-green-500/30 rounded-lg">
                  <p className="text-sm text-green-400 font-semibold">✅ Busca concluída</p>
                  <p className="text-xs text-neutral-400 mt-1">{result.total} novos leads encontrados</p>
                  <a href="/leads" className="mt-2 block w-full text-center text-xs bg-green-500 text-black py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors">
                    Ver leads no CRM →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
