'use client'
import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Send, Wifi, WifiOff, QrCode } from 'lucide-react'

interface Message { id: string; content: string; direction: 'IN' | 'OUT'; createdAt: string }
interface Lead { id: string; name: string; phone: string | null; category: string; score: number }

export default function WhatsAppPage() {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [input, setInput] = useState('')
  const [qr, setQr] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const qc = useQueryClient()

  const { data: statusData } = useQuery({
    queryKey: ['wa-status'],
    queryFn: () => fetch('/api/whatsapp/status').then((r) => r.json()),
    refetchInterval: 5000,
  })
  const connected = statusData?.status === 'connected'

  const connectMutation = useMutation({
    mutationFn: () => fetch('/api/whatsapp/connect', { method: 'POST' }).then((r) => r.json()),
  })

  const { data: leadsData } = useQuery({
    queryKey: ['leads-wa'],
    queryFn: () => fetch('/api/leads?status=CONTACTED&limit=50').then((r) => r.json()),
  })
  const leads: Lead[] = leadsData?.leads ?? []

  const { data: messages } = useQuery<Message[]>({
    queryKey: ['messages', selectedLead?.id],
    queryFn: () => fetch(`/api/conversations/${selectedLead?.id}`).then((r) => r.json()),
    enabled: !!selectedLead,
    refetchInterval: 3000,
  })

  const sendMutation = useMutation({
    mutationFn: ({ leadId, content }: { leadId: string; content: string }) =>
      fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, content }),
      }).then((r) => r.json()),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['messages', selectedLead?.id] })
      setInput('')
    },
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || !selectedLead) return
    sendMutation.mutate({ leadId: selectedLead.id, content: input.trim() })
  }

  return (
    <>
      <div className="h-14 bg-[#111] border-b border-[#2A2A2A] flex items-center px-6 gap-3">
        <h1 className="text-base font-semibold">WhatsApp · S-zap</h1>
        <div className="ml-auto flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
            connected ? 'bg-green-950 border-green-500/30 text-green-400' : 'bg-neutral-900 border-[#333] text-neutral-500'
          }`}>
            {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
            {connected ? 'Conectado' : 'Desconectado'}
          </div>
          {!connected && (
            <button
              onClick={() => connectMutation.mutate()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-green-500 text-black rounded-lg font-semibold hover:bg-green-600"
            >
              <QrCode size={12} /> Conectar WhatsApp
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* CONV LIST */}
        <div className="w-[280px] border-r border-[#2A2A2A] flex flex-col">
          <div className="p-3 border-b border-[#2A2A2A]">
            <input placeholder="🔍 Buscar..." className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-neutral-200 outline-none focus:border-green-500" />
          </div>
          <div className="flex-1 overflow-auto">
            {leads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className={`p-3 border-b border-[#2A2A2A] cursor-pointer transition-colors ${
                  selectedLead?.id === lead.id ? 'bg-green-950/20' : 'hover:bg-[#1A1A1A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-[#222] rounded-xl flex items-center justify-center text-base flex-shrink-0">
                    {lead.category.includes('Odontol') ? '🦷' :
                      lead.category.includes('Est') ? '✨' :
                      lead.category.includes('Solar') ? '☀️' :
                      lead.category.includes('Advoc') ? '⚖️' :
                      lead.category.includes('Imob') ? '🏢' : '🏢'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white truncate">{lead.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{lead.phone ?? 'Sem telefone'}</p>
                  </div>
                </div>
              </div>
            ))}
            {leads.length === 0 && (
              <div className="p-6 text-center text-sm text-neutral-600">
                Nenhum lead em contato ainda
              </div>
            )}
          </div>
        </div>

        {/* CHAT */}
        {selectedLead ? (
          <div className="flex-1 flex flex-col">
            <div className="px-4 py-3 border-b border-[#2A2A2A] flex items-center gap-3 bg-[#111]">
              <div className="w-9 h-9 bg-[#222] rounded-xl flex items-center justify-center text-base">🏢</div>
              <div>
                <p className="text-sm font-semibold">{selectedLead.name}</p>
                <p className="text-[11px] text-neutral-500">{selectedLead.phone}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-green-950 rounded-full text-[10px] text-green-400 font-semibold">
                Score: {selectedLead.score}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3 bg-[#0A0A0A]">
              {(messages ?? []).map((msg) => (
                <div key={msg.id} className={`flex ${msg.direction === 'OUT' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-3 py-2.5 rounded-xl text-sm leading-relaxed ${
                    msg.direction === 'OUT'
                      ? 'bg-green-500 text-black rounded-br-sm'
                      : 'bg-[#1A1A1A] text-neutral-200 border border-[#2A2A2A] rounded-bl-sm'
                  }`}>
                    {msg.content}
                    <div className={`text-[10px] mt-1 opacity-60 ${msg.direction === 'OUT' ? 'text-right' : ''}`}>
                      {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {(!messages || messages.length === 0) && (
                <div className="text-center text-sm text-neutral-600 py-12">
                  Nenhuma mensagem ainda. Envie a primeira!
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="px-4 py-3 border-t border-[#2A2A2A] flex gap-2 bg-[#111]">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Digite uma mensagem..."
                className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-sm text-neutral-200 outline-none focus:border-green-500"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || !connected}
                className="px-4 py-2 bg-green-500 text-black rounded-lg font-semibold text-sm hover:bg-green-600 disabled:opacity-40 flex items-center gap-1.5"
              >
                <Send size={13} /> Enviar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-neutral-600">
            <div className="text-center">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-sm">Selecione um lead para conversar</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
