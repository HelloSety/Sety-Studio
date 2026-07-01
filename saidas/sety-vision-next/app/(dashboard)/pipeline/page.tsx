"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import { Modal } from "@/app/components/ui/Modal";
import { useToast } from "@/app/components/ui/Toast";
import { MoreHorizontal, Plus, ChevronRight, MessageSquare, Phone, X, DollarSign, Building2, User, ChevronLeft } from "lucide-react";

type Deal = {
  id: string; name: string; company: string; val: string;
  days: number; avatar: string; grad: string; hot?: boolean;
  phone?: string; email?: string; notes?: string;
};

type Column = { id: string; label: string; color: string; deals: Deal[] };

const initColumns: Column[] = [
  { id: "novo", label: "Novo Lead", color: "#6B7280", deals: [
    { id: "d1", name: "Bruno Mendes", company: "TechStart", val: "R$ 9.500", days: 1, avatar: "B", grad: "from-[#6B7280] to-[#374151]", phone: "(85) 94321-0987", email: "bruno@techstart.com.br" },
    { id: "d2", name: "Silvia Torres", company: "Escola Plus", val: "R$ 3.200", days: 2, avatar: "S", grad: "from-[#3B82F6] to-[#7C3AED]", phone: "(11) 93456-7890", email: "silvia@escolaplus.com.br" },
  ]},
  { id: "contato", label: "Em Contato", color: "#3B82F6", deals: [
    { id: "d3", name: "Carla Drummond", company: "Auto Center", val: "R$ 4.700", days: 4, avatar: "C", grad: "from-[#059669] to-[#0891B2]", phone: "(31) 97654-3210" },
    { id: "d4", name: "João Batista", company: "JB Construtora", val: "R$ 18.000", days: 3, avatar: "J", grad: "from-[#7C3AED] to-[#3B82F6]", phone: "(61) 98765-4321" },
  ]},
  { id: "qualificado", label: "Qualificado", color: "#A78BFA", deals: [
    { id: "d5", name: "Marcos Oliveira", company: "Imob 360", val: "R$ 15.200", days: 7, avatar: "M", grad: "from-[#3B82F6] to-[#7C3AED]" },
    { id: "d6", name: "Patrícia Fontes", company: "Clínica Fontes", val: "R$ 6.800", days: 5, avatar: "P", grad: "from-[#7C3AED] to-[#0891B2]" },
  ]},
  { id: "proposta", label: "Proposta Enviada", color: "#F59E0B", deals: [
    { id: "d7", name: "Ana Paula Ribeiro", company: "Bella Vita", val: "R$ 8.400", days: 10, avatar: "A", grad: "from-[#7C3AED] to-[#EC4899]", hot: true },
    { id: "d8", name: "Gustavo Lima", company: "Lima & Assoc.", val: "R$ 12.800", days: 8, avatar: "G", grad: "from-[#EC4899] to-[#7C3AED]", hot: true },
  ]},
  { id: "fechamento", label: "Fechamento", color: "#22C55E", deals: [
    { id: "d9", name: "Ricardo Pires", company: "Studio Fitness", val: "R$ 22.000", days: 14, avatar: "R", grad: "from-[#D97706] to-[#DC2626]", hot: true },
  ]},
  { id: "ganho", label: "Ganho ✓", color: "#22C55E", deals: [
    { id: "d10", name: "Fernanda Castro", company: "Grupo Castro", val: "R$ 34.000", days: 21, avatar: "F", grad: "from-[#22C55E] to-[#059669]" },
  ]},
];

export default function PipelinePage() {
  const { success, info, error: toastError } = useToast();
  const [columns, setColumns] = useState<Column[]>(initColumns);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [selectedColId, setSelectedColId] = useState<string | null>(null);
  const [newDealModal, setNewDealModal] = useState(false);
  const [moveModal, setMoveModal] = useState<{ deal: Deal; colId: string } | null>(null);
  const [form, setForm] = useState({ name: "", company: "", val: "", phone: "", email: "", notes: "" });
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const totalVal = columns.reduce((sum, col) =>
    sum + col.deals.reduce((s, d) => s + parseFloat(d.val.replace("R$ ", "").replace(".", "").replace(",", ".")), 0), 0
  );

  const openDeal = (deal: Deal, colId: string) => {
    setSelectedDeal(deal);
    setSelectedColId(colId);
  };

  const moveDeal = (deal: Deal, fromColId: string, toColId: string) => {
    const toCol = columns.find(c => c.id === toColId);
    if (!toCol) return;
    setColumns(prev => prev.map(col => {
      if (col.id === fromColId) return { ...col, deals: col.deals.filter(d => d.id !== deal.id) };
      if (col.id === toColId) return { ...col, deals: [...col.deals, deal] };
      return col;
    }));
    setSelectedDeal(null);
    setMoveModal(null);
    success(`${deal.name} movido para "${toCol.label}"`, "Pipeline atualizado");
  };

  const deleteDeal = (deal: Deal, colId: string) => {
    setColumns(prev => prev.map(col =>
      col.id === colId ? { ...col, deals: col.deals.filter(d => d.id !== deal.id) } : col
    ));
    setSelectedDeal(null);
    info("Negócio removido", `${deal.name} foi removido do pipeline`);
  };

  const addDeal = () => {
    if (!form.name.trim() || !form.val.trim()) {
      toastError("Campos obrigatórios", "Nome e valor são obrigatórios");
      return;
    }
    const newDeal: Deal = {
      id: `d${Date.now()}`, name: form.name, company: form.company || "—",
      val: form.val.startsWith("R$") ? form.val : `R$ ${form.val}`,
      days: 0, avatar: form.name[0].toUpperCase(),
      grad: "from-[#7C3AED] to-[#3B82F6]",
      phone: form.phone, email: form.email, notes: form.notes,
    };
    setColumns(prev => prev.map(col => col.id === "novo" ? { ...col, deals: [newDeal, ...col.deals] } : col));
    setNewDealModal(false);
    setForm({ name: "", company: "", val: "", phone: "", email: "", notes: "" });
    success("Negócio criado!", `${newDeal.name} adicionado ao pipeline`);
  };

  return (
    <>
      <Topbar
        title="Pipeline de Vendas"
        subtitle={`R$ ${(totalVal / 1000).toFixed(0)}k em pipeline ativo`}
        action={{ label: "Novo negócio", onClick: () => setNewDealModal(true) }}
      />

      <main className="flex-1 overflow-x-auto p-6">
        {/* Summary bar */}
        <div className="flex items-center gap-4 mb-6">
          {columns.map(col => (
            <div key={col.id} className="flex-1 min-w-[100px]">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-[#6B7280] truncate">{col.label}</span>
                <span className="font-semibold ml-1 flex-shrink-0" style={{ color: col.color }}>{col.deals.length}</span>
              </div>
              <div className="h-1 rounded-full" style={{ background: `${col.color}30` }}>
                <div className="h-full rounded-full transition-all" style={{ background: col.color, width: `${Math.min((col.deals.length / 3) * 100, 100)}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Kanban */}
        <div className="flex gap-4 min-w-max">
          {columns.map((col, ci) => (
            <motion.div key={col.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.07, ease: EASE }} className="w-[260px] flex-shrink-0">
              {/* Col header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                  <span className="text-[13px] font-semibold text-white">{col.label}</span>
                  <span className="text-[11px] text-[#6B7280] bg-white/[0.06] rounded-full px-2 py-0.5">{col.deals.length}</span>
                </div>
                <button onClick={() => setNewDealModal(true)} className="text-[#6B7280] hover:text-white transition-colors">
                  <Plus size={14} />
                </button>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {col.deals.map((deal, di) => (
                  <motion.div key={deal.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ci * 0.07 + di * 0.05 + 0.1 }}
                    className="rounded-2xl p-4 cursor-pointer group transition-all duration-300"
                    style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
                    whileHover={{ y: -3, boxShadow: "0 16px 40px rgba(0,0,0,0.5)", borderColor: `${col.color}30` }}
                    onClick={() => openDeal(deal, col.id)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold bg-gradient-to-br ${deal.grad} text-white`}>
                          {deal.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-[12px] font-semibold text-white">{deal.name}</span>
                            {deal.hot && <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />}
                          </div>
                          <span className="text-[10px] text-[#6B7280]">{deal.company}</span>
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 text-[#6B7280] hover:text-white transition-all w-6 h-6 rounded-lg hover:bg-white/[0.08] flex items-center justify-center"
                        onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === deal.id ? null : deal.id); }}>
                        <MoreHorizontal size={13} />
                      </button>
                    </div>

                    <div className="text-[18px] font-black tracking-[-1px] mb-3">{deal.val}</div>

                    <div className="flex items-center justify-between">
                      <div className="h-1 rounded-full flex-1 mr-3" style={{ background: `${col.color}20` }}>
                        <div className="h-full rounded-full" style={{ background: col.color, width: "65%" }} />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.04)", color: "#6B7280" }}>
                          {deal.days}d
                        </span>
                        <ChevronRight size={12} className="text-[#4B5563] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* Quick actions on hover */}
                    <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[rgba(37,211,102,0.1)] text-[#25D366] text-[10px] hover:bg-[rgba(37,211,102,0.2)] transition-colors"
                        onClick={e => { e.stopPropagation(); info("Abrindo WhatsApp...", `Enviando mensagem para ${deal.name}`); }}>
                        <MessageSquare size={9} /> Msg
                      </button>
                      {deal.phone && (
                        <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[rgba(59,130,246,0.1)] text-[#60A5FA] text-[10px] hover:bg-[rgba(59,130,246,0.2)] transition-colors"
                          onClick={e => { e.stopPropagation(); info("Iniciando ligação...", `Ligando para ${deal.phone}`); }}>
                          <Phone size={9} /> Ligar
                        </button>
                      )}
                      <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[rgba(124,58,237,0.1)] text-[#A78BFA] text-[10px] hover:bg-[rgba(124,58,237,0.2)] transition-colors"
                        onClick={e => { e.stopPropagation(); openDeal(deal, col.id); setMoveModal({ deal, colId: col.id }); }}>
                        <ChevronRight size={9} /> Mover
                      </button>
                    </div>
                  </motion.div>
                ))}

                <button onClick={() => setNewDealModal(true)}
                  className="w-full py-2.5 rounded-2xl border border-dashed border-white/[0.08] text-[12px] text-[#6B7280] hover:text-white hover:border-white/20 hover:bg-white/[0.02] transition-all flex items-center justify-center gap-1">
                  <Plus size={12} /> Adicionar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* === DEAL DETAIL MODAL === */}
      <AnimatePresence>
        {selectedDeal && selectedColId && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40" onClick={() => setSelectedDeal(null)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm z-50 overflow-y-auto"
              style={{ background: "#0C0C10", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[14px] font-bold text-white bg-gradient-to-br ${selectedDeal.grad}`}>
                      {selectedDeal.avatar}
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-white">{selectedDeal.name}</div>
                      <div className="text-[11px] text-[#6B7280]">{selectedDeal.company}</div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedDeal(null)} className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#6B7280] hover:text-white transition-all">
                    <X size={14} />
                  </button>
                </div>

                <div className="text-[28px] font-black tracking-tight">{selectedDeal.val}</div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Estágio", val: columns.find(c => c.id === selectedColId)?.label ?? "—" },
                    { label: "Dias no pipeline", val: `${selectedDeal.days} dias` },
                    { label: "Telefone", val: selectedDeal.phone ?? "—" },
                    { label: "Email", val: selectedDeal.email ?? "—" },
                  ].map(f => (
                    <div key={f.label} className="rounded-xl p-3" style={{ background: "#111114" }}>
                      <div className="text-[10px] text-[#4B5563] mb-0.5">{f.label}</div>
                      <div className="text-[12px] font-semibold text-white truncate">{f.val}</div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => info("WhatsApp", `Abrindo conversa com ${selectedDeal.name}`)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[rgba(37,211,102,0.1)] text-[#25D366] text-[12px] font-semibold hover:bg-[rgba(37,211,102,0.2)] transition-colors border border-[rgba(37,211,102,0.2)]">
                    <MessageSquare size={13} /> WhatsApp
                  </button>
                  <button onClick={() => info("Ligando...", `Discando para ${selectedDeal.phone ?? selectedDeal.name}`)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[rgba(59,130,246,0.1)] text-[#60A5FA] text-[12px] font-semibold hover:bg-[rgba(59,130,246,0.2)] transition-colors border border-[rgba(59,130,246,0.2)]">
                    <Phone size={13} /> Ligar
                  </button>
                  <button onClick={() => setMoveModal({ deal: selectedDeal, colId: selectedColId })}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#7C3AED] text-white text-[12px] font-semibold hover:bg-[#8B5CF6] transition-colors col-span-2">
                    <ChevronRight size={13} /> Mover para próxima etapa
                  </button>
                  <button onClick={() => { deleteDeal(selectedDeal, selectedColId); }}
                    className="flex items-center justify-center gap-1 py-2 rounded-xl bg-[rgba(239,68,68,0.08)] text-[#F87171] text-[11px] hover:bg-[rgba(239,68,68,0.15)] transition-colors border border-[rgba(239,68,68,0.15)] col-span-2">
                    <X size={11} /> Remover do pipeline
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* === MOVE MODAL === */}
      <Modal open={!!moveModal} onClose={() => setMoveModal(null)} title="Mover para etapa" subtitle="Selecione a etapa destino" size="sm">
        {moveModal && (
          <div className="space-y-2">
            {columns.filter(c => c.id !== moveModal.colId).map(col => (
              <button key={col.id} onClick={() => moveDeal(moveModal.deal, moveModal.colId, col.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-colors group text-left"
                style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: col.color }} />
                <span className="text-[13px] text-[#9CA3AF] group-hover:text-white transition-colors">{col.label}</span>
                <span className="text-[10px] text-[#4B5563] ml-auto">{col.deals.length} deals</span>
                <ChevronRight size={12} className="text-[#4B5563] group-hover:text-white transition-colors" />
              </button>
            ))}
          </div>
        )}
      </Modal>

      {/* === NEW DEAL MODAL === */}
      <Modal open={newDealModal} onClose={() => setNewDealModal(false)} title="Novo negócio" subtitle="Adiciona ao início do pipeline"
        footer={
          <>
            <button onClick={() => setNewDealModal(false)} className="px-4 py-2 rounded-xl text-[12px] text-[#6B7280] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.06]">Cancelar</button>
            <button onClick={addDeal} className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-[#7C3AED] hover:bg-[#8B5CF6] transition-colors">Criar negócio</button>
          </>
        }>
        <div className="space-y-4">
          {[
            { label: "Nome do contato *", key: "name", icon: User, placeholder: "Ex: Ana Paula Ribeiro" },
            { label: "Empresa", key: "company", icon: Building2, placeholder: "Ex: Clínica Bella Vita" },
            { label: "Valor estimado *", key: "val", icon: DollarSign, placeholder: "Ex: R$ 8.400" },
            { label: "Telefone / WhatsApp", key: "phone", icon: Phone, placeholder: "Ex: (11) 99999-0000" },
          ].map(f => {
            const Icon = f.icon;
            return (
              <div key={f.key}>
                <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">{f.label}</label>
                <div className="relative">
                  <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" />
                  <input type="text" placeholder={f.placeholder} value={(form as Record<string, string>)[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full bg-[#0C0C10] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(124,58,237,0.5)] transition-colors" />
                </div>
              </div>
            );
          })}
          <div>
            <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">Observações</label>
            <textarea placeholder="Notas sobre o lead..." value={form.notes}
              onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))} rows={2}
              className="w-full bg-[#0C0C10] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(124,58,237,0.5)] transition-colors resize-none" />
          </div>
        </div>
      </Modal>
    </>
  );
}
