"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { Modal } from "@/app/components/ui/Modal";
import { useToast } from "@/app/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import { Search, Phone, MessageSquare, Mail, MoreHorizontal, Star, Plus, X, User, Building2, DollarSign, Tag, Trash2, Edit } from "lucide-react";

type Stage = "Todos" | "Novo" | "Contato" | "Qualificado" | "Proposta" | "Fechamento" | "Ganho" | "Perdido";
const stages: Stage[] = ["Todos","Novo","Contato","Qualificado","Proposta","Fechamento","Ganho","Perdido"];

type Contact = {
  id: string; name: string; company: string; phone: string; email: string;
  stage: string; val: string; score: number; hot: boolean; avatar: string; grad: string;
  tags?: string[];
};

const initContacts: Contact[] = [
  { id: "c1", name: "Ana Paula Ribeiro", company: "Clínica Bella Vita", phone: "(11) 99876-5432", email: "ana@bellavita.com", stage: "Proposta", val: "R$ 8.400", score: 92, hot: true, avatar: "A", grad: "from-[#7C3AED] to-[#EC4899]", tags: ["Clínica","Alto ticket"] },
  { id: "c2", name: "Marcos Oliveira", company: "Imob 360", phone: "(21) 98765-4321", email: "marcos@imob360.com.br", stage: "Qualificado", val: "R$ 15.200", score: 78, hot: false, avatar: "M", grad: "from-[#3B82F6] to-[#7C3AED]", tags: ["Imobiliária"] },
  { id: "c3", name: "Carla Drummond", company: "Auto Center Premium", phone: "(31) 97654-3210", email: "carla@autocenter.com", stage: "Contato", val: "R$ 4.700", score: 45, hot: false, avatar: "C", grad: "from-[#059669] to-[#0891B2]", tags: ["Automotivo"] },
  { id: "c4", name: "Ricardo Pires", company: "Studio Fitness", phone: "(41) 96543-2109", email: "ricardo@studiofitness.com", stage: "Fechamento", val: "R$ 22.000", score: 96, hot: true, avatar: "R", grad: "from-[#D97706] to-[#DC2626]", tags: ["Fitness","Urgente"] },
  { id: "c5", name: "Patrícia Fontes", company: "Clínica Dr. Fontes", phone: "(51) 95432-1098", email: "patricia@fontes.med.br", stage: "Qualificado", val: "R$ 6.800", score: 71, hot: false, avatar: "P", grad: "from-[#7C3AED] to-[#0891B2]", tags: ["Saúde"] },
  { id: "c6", name: "Bruno Mendes", company: "TechStart Soluções", phone: "(85) 94321-0987", email: "bruno@techstart.com.br", stage: "Novo", val: "R$ 9.500", score: 38, hot: false, avatar: "B", grad: "from-[#6B7280] to-[#374151]", tags: ["Tech"] },
  { id: "c7", name: "Fernanda Castro", company: "Grupo Castro Imóveis", phone: "(91) 93210-9876", email: "fernanda@grupocastro.com", stage: "Ganho", val: "R$ 34.000", score: 100, hot: false, avatar: "F", grad: "from-[#22C55E] to-[#059669]", tags: ["VIP","Fechado"] },
  { id: "c8", name: "Gustavo Lima", company: "Lima & Associados", phone: "(71) 92109-8765", email: "gustavo@limaassoc.adv.br", stage: "Proposta", val: "R$ 12.800", score: 84, hot: true, avatar: "G", grad: "from-[#EC4899] to-[#7C3AED]", tags: ["Jurídico"] },
];

const stageColors: Record<string, { bg: string; text: string }> = {
  "Novo":        { bg: "rgba(107,114,128,0.15)", text: "#9CA3AF" },
  "Contato":     { bg: "rgba(59,130,246,0.12)",  text: "#60A5FA" },
  "Qualificado": { bg: "rgba(124,58,237,0.12)",  text: "#A78BFA" },
  "Proposta":    { bg: "rgba(245,158,11,0.12)",  text: "#FCD34D" },
  "Fechamento":  { bg: "rgba(34,197,94,0.12)",   text: "#4ADE80" },
  "Ganho":       { bg: "rgba(34,197,94,0.2)",    text: "#22C55E" },
  "Perdido":     { bg: "rgba(239,68,68,0.12)",   text: "#F87171" },
};

const scoreColor = (s: number) => s >= 80 ? "#22C55E" : s >= 50 ? "#F59E0B" : "#EF4444";

export default function CrmPage() {
  const { success, info, warning, error: toastError } = useToast();
  const [contacts, setContacts] = useState<Contact[]>(initContacts);
  const [filter, setFilter] = useState<Stage>("Todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Contact | null>(null);
  const [newModal, setNewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<Contact | null>(null);
  const [editStageModal, setEditStageModal] = useState<Contact | null>(null);
  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "", val: "", stage: "Novo", tags: "" });

  const visible = contacts.filter(c =>
    (filter === "Todos" || c.stage === filter) &&
    (search === "" || c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()))
  );

  const addContact = () => {
    if (!form.name.trim()) { toastError("Nome obrigatório", "Preencha o nome do contato"); return; }
    const newC: Contact = {
      id: `c${Date.now()}`, name: form.name, company: form.company || "—",
      phone: form.phone, email: form.email, stage: form.stage,
      val: form.val || "—", score: 40, hot: false,
      avatar: form.name[0].toUpperCase(), grad: "from-[#7C3AED] to-[#3B82F6]",
      tags: form.tags ? form.tags.split(",").map(t => t.trim()) : [],
    };
    setContacts(prev => [newC, ...prev]);
    setNewModal(false);
    setForm({ name: "", company: "", phone: "", email: "", val: "", stage: "Novo", tags: "" });
    success("Lead criado!", `${newC.name} adicionado ao CRM`);
  };

  const deleteContact = (c: Contact) => {
    setContacts(prev => prev.filter(x => x.id !== c.id));
    setDeleteModal(null);
    setSelected(null);
    warning("Contato removido", `${c.name} foi removido do CRM`);
  };

  const changeStage = (contact: Contact, stage: string) => {
    setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, stage } : c));
    setEditStageModal(null);
    setSelected(prev => prev ? { ...prev, stage } : null);
    success("Estágio atualizado!", `${contact.name} → ${stage}`);
  };

  const toggleHot = (c: Contact) => {
    setContacts(prev => prev.map(x => x.id === c.id ? { ...x, hot: !x.hot } : x));
    setSelected(prev => prev && prev.id === c.id ? { ...prev, hot: !prev.hot } : prev);
    info(c.hot ? "Removido dos favoritos" : "Marcado como quente!", c.name);
  };

  return (
    <>
      <Topbar title="CRM / Clientes" subtitle={`${contacts.length} contatos · ${contacts.filter(c => c.hot).length} oportunidades quentes`} action={{ label: "Novo lead", onClick: () => setNewModal(true) }} />

      <main className="flex-1 overflow-y-auto p-6 space-y-4">

        {/* Search + filter row */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" />
            <input type="text" placeholder="Buscar por nome ou empresa..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#111114] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-white placeholder-[#4B5563] outline-none focus:border-[rgba(124,58,237,0.4)] transition-colors" />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-white">
                <X size={12} />
              </button>
            )}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {stages.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all border cursor-pointer ${filter === s ? "bg-[rgba(124,58,237,0.15)] text-[#A78BFA] border-[rgba(124,58,237,0.3)]" : "text-[#6B7280] border-white/[0.06] hover:text-white bg-transparent"}`}>
                {s}
              </button>
            ))}
          </div>
          <button onClick={() => setNewModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#7C3AED] text-white text-[12px] font-semibold rounded-xl hover:bg-[#8B5CF6] transition-colors flex-shrink-0">
            <Plus size={13} /> Novo lead
          </button>
        </div>

        {/* Results count */}
        <div className="text-[12px] text-[#4B5563]">{visible.length} contato{visible.length !== 1 ? "s" : ""} encontrado{visible.length !== 1 ? "s" : ""}</div>

        {/* Contact list */}
        <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
          <div className="hidden lg:grid grid-cols-[2.5fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-[#0C0C10] border-b border-white/[0.06]">
            {["Contato","Empresa","Valor","Estágio","Score",""].map((h, i) => (
              <div key={i} className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-[0.5px]">{h}</div>
            ))}
          </div>

          <AnimatePresence>
            {visible.length === 0 ? (
              <div className="flex flex-col items-center py-16">
                <div className="text-[14px] text-[#4B5563] mb-2">Nenhum contato encontrado</div>
                <button onClick={() => setNewModal(true)} className="text-[12px] text-[#7C3AED] hover:underline">Criar novo lead</button>
              </div>
            ) : (
              visible.map((c, i) => {
                const sc = stageColors[c.stage] ?? stageColors["Novo"];
                return (
                  <motion.div key={c.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer group items-center"
                    onClick={() => setSelected(c)}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold text-white bg-gradient-to-br ${c.grad} flex-shrink-0`}>{c.avatar}</div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-semibold text-white truncate">{c.name}</span>
                          {c.hot && <Star size={11} className="text-[#F59E0B] fill-[#F59E0B] flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          {c.tags?.slice(0, 2).map(t => (
                            <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/[0.06] text-[#6B7280]">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-[13px] text-[#9CA3AF] truncate hidden lg:block">{c.company}</div>
                    <div className="text-[13px] font-semibold text-white hidden lg:block">{c.val}</div>
                    <div className="hidden lg:block">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>{c.stage}</span>
                    </div>
                    <div className="hidden lg:flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full" style={{ width: `${c.score}%`, background: scoreColor(c.score) }} />
                      </div>
                      <span className="text-[11px] font-bold flex-shrink-0" style={{ color: scoreColor(c.score) }}>{c.score}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <button onClick={() => info("WhatsApp", `Mensagem para ${c.name}`)} className="w-7 h-7 rounded-lg bg-[rgba(37,211,102,0.1)] flex items-center justify-center text-[#25D366] hover:bg-[rgba(37,211,102,0.2)] transition-colors">
                        <MessageSquare size={11} />
                      </button>
                      <button onClick={() => info("Ligando...", c.phone)} className="w-7 h-7 rounded-lg bg-[rgba(59,130,246,0.1)] flex items-center justify-center text-[#60A5FA] hover:bg-[rgba(59,130,246,0.2)] transition-colors">
                        <Phone size={11} />
                      </button>
                      <button onClick={() => info("Email", c.email)} className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-[#6B7280] hover:text-white hover:bg-white/[0.08] transition-colors">
                        <Mail size={11} />
                      </button>
                      <button onClick={() => setDeleteModal(c)} className="w-7 h-7 rounded-lg bg-[rgba(239,68,68,0.08)] flex items-center justify-center text-[#F87171] hover:bg-[rgba(239,68,68,0.15)] transition-colors">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* === CONTACT DETAIL DRAWER === */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40" onClick={() => setSelected(null)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 h-full w-full max-w-sm z-50 overflow-y-auto"
              style={{ background: "#0C0C10", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[16px] font-bold text-white bg-gradient-to-br ${selected.grad}`}>{selected.avatar}</div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[16px] font-bold text-white">{selected.name}</span>
                        {selected.hot && <Star size={13} className="text-[#F59E0B] fill-[#F59E0B]" />}
                      </div>
                      <div className="text-[11px] text-[#6B7280]">{selected.company}</div>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#6B7280] hover:text-white transition-all">
                    <X size={14} />
                  </button>
                </div>

                {/* Score + stage */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl p-3 text-center" style={{ background: "#111114" }}>
                    <div className="text-[24px] font-black" style={{ color: scoreColor(selected.score) }}>{selected.score}</div>
                    <div className="text-[10px] text-[#4B5563]">Score de qualificação</div>
                  </div>
                  <div className="rounded-xl p-3 text-center cursor-pointer" style={{ background: "#111114" }}
                    onClick={() => setEditStageModal(selected)}>
                    <div className="text-[13px] font-bold mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[11px]"
                        style={{ background: (stageColors[selected.stage] ?? stageColors["Novo"]).bg, color: (stageColors[selected.stage] ?? stageColors["Novo"]).text }}>
                        {selected.stage}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#4B5563] flex items-center justify-center gap-0.5"><Edit size={9} /> Alterar estágio</div>
                  </div>
                </div>

                {/* Info */}
                <div className="rounded-2xl p-4 space-y-3" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {[
                    { label: "Telefone", val: selected.phone, icon: Phone },
                    { label: "Email", val: selected.email, icon: Mail },
                    { label: "Valor estimado", val: selected.val, icon: DollarSign },
                  ].map(f => {
                    const Icon = f.icon;
                    return (
                      <div key={f.label} className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0"><Icon size={12} className="text-[#4B5563]" /></div>
                        <div>
                          <div className="text-[10px] text-[#4B5563]">{f.label}</div>
                          <div className="text-[12px] font-medium text-white">{f.val || "—"}</div>
                        </div>
                      </div>
                    );
                  })}
                  {selected.tags && selected.tags.length > 0 && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0"><Tag size={12} className="text-[#4B5563]" /></div>
                      <div className="flex flex-wrap gap-1">
                        {selected.tags.map(t => <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-[rgba(124,58,237,0.1)] text-[#A78BFA]">{t}</span>)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => info("WhatsApp", `Abrindo conversa com ${selected.name}`)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[rgba(37,211,102,0.1)] text-[#25D366] text-[12px] font-semibold hover:bg-[rgba(37,211,102,0.2)] transition-colors border border-[rgba(37,211,102,0.2)]">
                    <MessageSquare size={13} /> WhatsApp
                  </button>
                  <button onClick={() => info("Ligando...", selected.phone)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[rgba(59,130,246,0.1)] text-[#60A5FA] text-[12px] font-semibold hover:bg-[rgba(59,130,246,0.2)] transition-colors border border-[rgba(59,130,246,0.2)]">
                    <Phone size={13} /> Ligar
                  </button>
                  <button onClick={() => info("Email", selected.email)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/[0.04] text-[#9CA3AF] text-[12px] font-semibold hover:bg-white/[0.08] transition-colors border border-white/[0.06]">
                    <Mail size={13} /> Email
                  </button>
                  <button onClick={() => toggleHot(selected)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-semibold transition-colors border"
                    style={{ background: selected.hot ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.04)", color: selected.hot ? "#F59E0B" : "#6B7280", borderColor: selected.hot ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.06)" }}>
                    <Star size={13} className={selected.hot ? "fill-[#F59E0B]" : ""} /> {selected.hot ? "Quente" : "Favoritar"}
                  </button>
                  <button onClick={() => setDeleteModal(selected)}
                    className="col-span-2 flex items-center justify-center gap-1 py-2 rounded-xl bg-[rgba(239,68,68,0.08)] text-[#F87171] text-[11px] hover:bg-[rgba(239,68,68,0.15)] transition-colors border border-[rgba(239,68,68,0.15)]">
                    <Trash2 size={11} /> Remover contato
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* === NEW CONTACT MODAL === */}
      <Modal open={newModal} onClose={() => setNewModal(false)} title="Novo lead" subtitle="Adiciona ao CRM automaticamente"
        footer={
          <>
            <button onClick={() => setNewModal(false)} className="px-4 py-2 rounded-xl text-[12px] text-[#6B7280] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.06]">Cancelar</button>
            <button onClick={addContact} className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-[#7C3AED] hover:bg-[#8B5CF6] transition-colors">Criar lead</button>
          </>
        }>
        <div className="space-y-4">
          {[
            { label: "Nome completo *", key: "name", icon: User, placeholder: "Ex: Ana Paula Ribeiro" },
            { label: "Empresa", key: "company", icon: Building2, placeholder: "Ex: Clínica Bella Vita" },
            { label: "Telefone / WhatsApp", key: "phone", icon: Phone, placeholder: "Ex: (11) 99999-0000" },
            { label: "Email", key: "email", icon: Mail, placeholder: "Ex: ana@empresa.com" },
            { label: "Valor estimado", key: "val", icon: DollarSign, placeholder: "Ex: R$ 8.400" },
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
            <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">Estágio inicial</label>
            <select value={form.stage} onChange={e => setForm(prev => ({ ...prev, stage: e.target.value }))}
              className="w-full bg-[#0C0C10] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(124,58,237,0.5)] transition-colors">
              {["Novo","Contato","Qualificado","Proposta","Fechamento"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">Tags (separadas por vírgula)</label>
            <div className="relative">
              <Tag size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" />
              <input type="text" placeholder="Ex: Clínica, Alto ticket, VIP" value={form.tags}
                onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full bg-[#0C0C10] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(124,58,237,0.5)] transition-colors" />
            </div>
          </div>
        </div>
      </Modal>

      {/* === CHANGE STAGE MODAL === */}
      <Modal open={!!editStageModal} onClose={() => setEditStageModal(null)} title="Alterar estágio" size="sm">
        {editStageModal && (
          <div className="space-y-2">
            {Object.entries(stageColors).map(([stage, colors]) => (
              <button key={stage} onClick={() => changeStage(editStageModal, stage)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${editStageModal.stage === stage ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"}`}
                style={{ border: `1px solid ${editStageModal.stage === stage ? colors.text + "40" : "rgba(255,255,255,0.04)"}` }}>
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: colors.text }} />
                <span className="text-[13px] text-[#9CA3AF] flex-1">{stage}</span>
                {editStageModal.stage === stage && <span className="text-[10px] text-[#A78BFA]">atual</span>}
              </button>
            ))}
          </div>
        )}
      </Modal>

      {/* === DELETE MODAL === */}
      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Remover contato" size="sm"
        footer={
          <>
            <button onClick={() => setDeleteModal(null)} className="px-4 py-2 rounded-xl text-[12px] text-[#6B7280] hover:text-white bg-white/[0.04] transition-colors border border-white/[0.06]">Cancelar</button>
            <button onClick={() => deleteModal && deleteContact(deleteModal)} className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-[#EF4444] hover:bg-red-400 transition-colors">Remover</button>
          </>
        }>
        {deleteModal && (
          <div className="text-[13px] text-[#9CA3AF] leading-[1.6]">
            Tem certeza que deseja remover <strong className="text-white">{deleteModal.name}</strong> da {deleteModal.company} do CRM?
            <br />Esta ação não pode ser desfeita.
          </div>
        )}
      </Modal>
    </>
  );
}
