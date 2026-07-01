"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { Modal } from "@/app/components/ui/Modal";
import { useToast } from "@/app/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Search, X, Plus, MessageSquare, Phone, Star, Trash2, TrendingUp, Users, Zap, Target, Filter } from "lucide-react";

type Source = "Todos" | "WhatsApp" | "Meta Ads" | "Google" | "Orgânico" | "Indicação";
type Status = "Novo" | "Contatado" | "Qualificado" | "Descartado";

const SOURCES: Source[] = ["Todos", "WhatsApp", "Meta Ads", "Google", "Orgânico", "Indicação"];
const STATUSES: Status[] = ["Novo", "Contatado", "Qualificado", "Descartado"];

type Lead = {
  id: string;
  name: string;
  phone: string;
  source: Source;
  status: Status;
  score: number;
  interest: string;
  capturedAt: string;
  avatar: string;
  grad: string;
  hot: boolean;
};

const INIT_LEADS: Lead[] = [
  { id: "l1", name: "Camila Torres",    phone: "(11) 99123-4567", source: "Meta Ads",  status: "Novo",        score: 88, interest: "Site + IA WhatsApp",   capturedAt: "Há 12 min",  avatar: "C", grad: "from-[#7C3AED] to-[#EC4899]", hot: true  },
  { id: "l2", name: "Diego Marques",    phone: "(21) 98234-5678", source: "WhatsApp",  status: "Contatado",   score: 62, interest: "Tráfego Pago",          capturedAt: "Há 1h",      avatar: "D", grad: "from-[#3B82F6] to-[#7C3AED]", hot: false },
  { id: "l3", name: "Larissa Cunha",    phone: "(31) 97345-6789", source: "Google",    status: "Qualificado", score: 95, interest: "Sistema completo",       capturedAt: "Há 2h",      avatar: "L", grad: "from-[#22C55E] to-[#059669]", hot: true  },
  { id: "l4", name: "Rafael Souza",     phone: "(41) 96456-7890", source: "Indicação", status: "Novo",        score: 74, interest: "Automação WhatsApp",    capturedAt: "Há 3h",      avatar: "R", grad: "from-[#F59E0B] to-[#D97706]", hot: false },
  { id: "l5", name: "Isabela Neves",    phone: "(51) 95567-8901", source: "Orgânico",  status: "Contatado",   score: 51, interest: "Landing page",           capturedAt: "Ontem",      avatar: "I", grad: "from-[#EC4899] to-[#7C3AED]", hot: false },
  { id: "l6", name: "Pedro Almeida",    phone: "(61) 94678-9012", source: "Meta Ads",  status: "Qualificado", score: 91, interest: "CRM + Pipeline",         capturedAt: "Ontem",      avatar: "P", grad: "from-[#7C3AED] to-[#3B82F6]", hot: true  },
  { id: "l7", name: "Aline Ferreira",   phone: "(71) 93789-0123", source: "Google",    status: "Novo",        score: 38, interest: "Site institucional",     capturedAt: "Há 2 dias",  avatar: "A", grad: "from-[#6B7280] to-[#374151]", hot: false },
  { id: "l8", name: "Thiago Barbosa",   phone: "(81) 92890-1234", source: "WhatsApp",  status: "Descartado",  score: 12, interest: "Só informações",         capturedAt: "Há 3 dias",  avatar: "T", grad: "from-[#374151] to-[#1F2937]", hot: false },
];

const sourceColors: Record<string, { bg: string; text: string; icon: string }> = {
  "WhatsApp":  { bg: "rgba(37,211,102,0.12)",  text: "#25D366", icon: "💬" },
  "Meta Ads":  { bg: "rgba(59,130,246,0.12)",  text: "#60A5FA", icon: "📘" },
  "Google":    { bg: "rgba(234,67,53,0.12)",   text: "#EA4335", icon: "🔍" },
  "Orgânico":  { bg: "rgba(124,58,237,0.12)",  text: "#A78BFA", icon: "🌱" },
  "Indicação": { bg: "rgba(245,158,11,0.12)",  text: "#FCD34D", icon: "⭐" },
};

const statusColors: Record<Status, { bg: string; text: string }> = {
  "Novo":        { bg: "rgba(59,130,246,0.12)",  text: "#60A5FA" },
  "Contatado":   { bg: "rgba(245,158,11,0.12)",  text: "#FCD34D" },
  "Qualificado": { bg: "rgba(34,197,94,0.12)",   text: "#4ADE80" },
  "Descartado":  { bg: "rgba(107,114,128,0.12)", text: "#9CA3AF" },
};

const scoreColor = (s: number) => s >= 80 ? "#22C55E" : s >= 50 ? "#F59E0B" : "#EF4444";

const STATS = [
  { label: "Total de leads",   key: "total",     color: "#7C3AED", icon: Users     },
  { label: "Qualificados",     key: "qualified", color: "#22C55E", icon: Target    },
  { label: "Leads quentes",    key: "hot",       color: "#F59E0B", icon: Zap       },
  { label: "Taxa de conversão",key: "rate",      color: "#3B82F6", icon: TrendingUp},
];

export default function LeadsPage() {
  const { success, info, warning } = useToast();
  const [leads, setLeads] = useState<Lead[]>(INIT_LEADS);
  const [filterSource, setFilterSource] = useState<Source>("Todos");
  const [filterStatus, setFilterStatus] = useState<Status | "Todos">("Todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", interest: "", source: "WhatsApp" as Source });

  const visible = leads.filter(l =>
    (filterSource === "Todos" || l.source === filterSource) &&
    (filterStatus === "Todos" || l.status === filterStatus) &&
    (search === "" || l.name.toLowerCase().includes(search.toLowerCase()) || l.interest.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total: leads.length,
    qualified: leads.filter(l => l.status === "Qualificado").length,
    hot: leads.filter(l => l.hot).length,
    rate: `${Math.round((leads.filter(l => l.status === "Qualificado").length / leads.length) * 100)}%`,
  };

  const addLead = () => {
    if (!form.name.trim()) { warning("Atenção", "Nome é obrigatório"); return; }
    const lead: Lead = {
      id: `l${Date.now()}`,
      name: form.name, phone: form.phone, source: form.source,
      status: "Novo", score: 40, interest: form.interest || "Não informado",
      capturedAt: "Agora", avatar: form.name[0].toUpperCase(),
      grad: "from-[#7C3AED] to-[#3B82F6]", hot: false,
    };
    setLeads(prev => [lead, ...prev]);
    setAddModal(false);
    setForm({ name: "", phone: "", interest: "", source: "WhatsApp" });
    success("Lead capturado!", form.name + " adicionado");
  };

  const qualifyLead = (lead: Lead) => {
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: "Qualificado" } : l));
    setSelected(prev => prev?.id === lead.id ? { ...prev, status: "Qualificado" } : prev);
    success("Lead qualificado!", lead.name + " → Qualificado");
  };

  const discardLead = (lead: Lead) => {
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: "Descartado" } : l));
    setSelected(prev => prev?.id === lead.id ? { ...prev, status: "Descartado" } : prev);
    info("Lead descartado", lead.name);
  };

  const removeLead = (lead: Lead) => {
    setLeads(prev => prev.filter(l => l.id !== lead.id));
    setSelected(null);
    warning("Removido", lead.name + " removido da lista");
  };

  const toggleHot = (lead: Lead) => {
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, hot: !l.hot } : l));
    setSelected(prev => prev?.id === lead.id ? { ...prev, hot: !prev.hot } : prev);
    info(lead.hot ? "Removido dos quentes" : "Marcado como quente", lead.name);
  };

  return (
    <>
      <Topbar
        title="Leads"
        subtitle={`${stats.total} leads · ${stats.qualified} qualificados · ${stats.hot} quentes`}
        action={{ label: "Novo lead", onClick: () => setAddModal(true) }}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map((s) => {
            const Icon = s.icon;
            const val = stats[s.key as keyof typeof stats];
            return (
              <div key={s.key} className="rounded-2xl p-4 flex items-center gap-3"
                style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: s.color + "18" }}>
                  <Icon size={15} style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-[20px] font-black text-white leading-none">{val}</div>
                  <div className="text-[11px] text-[#4B5563] mt-0.5">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search + filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" />
            <input type="text" placeholder="Buscar por nome ou interesse..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#111114] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-[13px] text-white placeholder-[#4B5563] outline-none focus:border-[rgba(124,58,237,0.4)] transition-colors" />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-white">
                <X size={12} />
              </button>
            )}
          </div>

          <button onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[12px] font-medium border transition-all ${showFilters ? "bg-[rgba(124,58,237,0.12)] text-[#A78BFA] border-[rgba(124,58,237,0.3)]" : "text-[#6B7280] border-white/[0.06] hover:text-white"}`}>
            <Filter size={12} /> Filtros
          </button>

          <button onClick={() => setAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#7C3AED] text-white text-[12px] font-semibold rounded-xl hover:bg-[#8B5CF6] transition-colors flex-shrink-0">
            <Plus size={13} /> Novo lead
          </button>
        </div>

        {/* Expandable filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-3 p-4 rounded-2xl"
                style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <div className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-2">Origem</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {SOURCES.map(s => (
                      <button key={s} onClick={() => setFilterSource(s)}
                        className={`px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all border cursor-pointer ${filterSource === s ? "bg-[rgba(124,58,237,0.15)] text-[#A78BFA] border-[rgba(124,58,237,0.3)]" : "text-[#6B7280] border-white/[0.06] hover:text-white bg-transparent"}`}>
                        {s !== "Todos" && sourceColors[s]?.icon + " "}{s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#4B5563] uppercase tracking-wider mb-2">Status</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {(["Todos", ...STATUSES] as const).map(s => (
                      <button key={s} onClick={() => setFilterStatus(s as Status | "Todos")}
                        className={`px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all border cursor-pointer ${filterStatus === s ? "bg-[rgba(124,58,237,0.15)] text-[#A78BFA] border-[rgba(124,58,237,0.3)]" : "text-[#6B7280] border-white/[0.06] hover:text-white bg-transparent"}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-[12px] text-[#4B5563]">{visible.length} lead{visible.length !== 1 ? "s" : ""} encontrado{visible.length !== 1 ? "s" : ""}</div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
          <div className="hidden lg:grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-[#0C0C10] border-b border-white/[0.06]">
            {["Lead", "Interesse", "Origem", "Status", "Score", ""].map((h, i) => (
              <div key={i} className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-[0.5px]">{h}</div>
            ))}
          </div>

          <AnimatePresence>
            {visible.length === 0 ? (
              <div className="flex flex-col items-center py-16">
                <div className="text-[14px] text-[#4B5563] mb-2">Nenhum lead encontrado</div>
                <button onClick={() => setAddModal(true)} className="text-[12px] text-[#7C3AED] hover:underline">Adicionar manualmente</button>
              </div>
            ) : (
              visible.map((l, i) => {
                const sc = statusColors[l.status];
                const src = sourceColors[l.source];
                return (
                  <motion.div key={l.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer group items-center"
                    onClick={() => setSelected(l)}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-bold text-white bg-gradient-to-br ${l.grad} flex-shrink-0`}>{l.avatar}</div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-semibold text-white truncate">{l.name}</span>
                          {l.hot && <Star size={10} className="text-[#F59E0B] fill-[#F59E0B] flex-shrink-0" />}
                        </div>
                        <div className="text-[10px] text-[#4B5563]">{l.capturedAt} · {l.phone}</div>
                      </div>
                    </div>
                    <div className="text-[12px] text-[#9CA3AF] truncate hidden lg:block">{l.interest}</div>
                    <div className="hidden lg:block">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: src?.bg, color: src?.text }}>
                        {src?.icon} {l.source}
                      </span>
                    </div>
                    <div className="hidden lg:block">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.text }}>{l.status}</span>
                    </div>
                    <div className="hidden lg:flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full" style={{ width: `${l.score}%`, background: scoreColor(l.score) }} />
                      </div>
                      <span className="text-[11px] font-bold flex-shrink-0" style={{ color: scoreColor(l.score) }}>{l.score}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <button onClick={() => info("WhatsApp", l.phone)} className="w-7 h-7 rounded-lg bg-[rgba(37,211,102,0.1)] flex items-center justify-center text-[#25D366] hover:bg-[rgba(37,211,102,0.2)] transition-colors">
                        <MessageSquare size={11} />
                      </button>
                      <button onClick={() => info("Ligando...", l.phone)} className="w-7 h-7 rounded-lg bg-[rgba(59,130,246,0.1)] flex items-center justify-center text-[#60A5FA] hover:bg-[rgba(59,130,246,0.2)] transition-colors">
                        <Phone size={11} />
                      </button>
                      <button onClick={() => removeLead(l)} className="w-7 h-7 rounded-lg bg-[rgba(239,68,68,0.08)] flex items-center justify-center text-[#F87171] hover:bg-[rgba(239,68,68,0.15)] transition-colors">
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

      {/* === LEAD DETAIL DRAWER === */}
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
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[16px] font-bold text-white bg-gradient-to-br ${selected.grad}`}>{selected.avatar}</div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[16px] font-bold text-white">{selected.name}</span>
                        {selected.hot && <Star size={13} className="text-[#F59E0B] fill-[#F59E0B]" />}
                      </div>
                      <div className="text-[11px] text-[#6B7280]">{selected.capturedAt}</div>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#6B7280] hover:text-white transition-all">
                    <X size={14} />
                  </button>
                </div>

                {/* Score + Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl p-3 text-center" style={{ background: "#111114" }}>
                    <div className="text-[24px] font-black" style={{ color: scoreColor(selected.score) }}>{selected.score}</div>
                    <div className="text-[10px] text-[#4B5563]">Score ICP</div>
                  </div>
                  <div className="rounded-xl p-3 text-center" style={{ background: "#111114" }}>
                    <span className="text-[12px] font-bold px-2.5 py-1 rounded-full inline-block"
                      style={{ background: statusColors[selected.status].bg, color: statusColors[selected.status].text }}>
                      {selected.status}
                    </span>
                    <div className="text-[10px] text-[#4B5563] mt-1">Status atual</div>
                  </div>
                </div>

                {/* Info */}
                <div className="rounded-2xl p-4 space-y-3" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {[
                    { label: "Telefone", val: selected.phone },
                    { label: "Interesse", val: selected.interest },
                    { label: "Origem", val: `${sourceColors[selected.source]?.icon} ${selected.source}` },
                  ].map(f => (
                    <div key={f.label}>
                      <div className="text-[10px] text-[#4B5563] mb-0.5">{f.label}</div>
                      <div className="text-[13px] text-white">{f.val}</div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => info("WhatsApp", selected.phone)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[rgba(37,211,102,0.1)] text-[#25D366] text-[12px] font-semibold hover:bg-[rgba(37,211,102,0.2)] transition-colors border border-[rgba(37,211,102,0.2)]">
                    <MessageSquare size={13} /> WhatsApp
                  </button>
                  <button onClick={() => info("Ligando...", selected.phone)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[rgba(59,130,246,0.1)] text-[#60A5FA] text-[12px] font-semibold hover:bg-[rgba(59,130,246,0.2)] transition-colors border border-[rgba(59,130,246,0.2)]">
                    <Phone size={13} /> Ligar
                  </button>
                  <button onClick={() => qualifyLead(selected)}
                    disabled={selected.status === "Qualificado"}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-semibold transition-colors border disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: "rgba(34,197,94,0.1)", color: "#4ADE80", borderColor: "rgba(34,197,94,0.2)" }}>
                    <Target size={13} /> Qualificar
                  </button>
                  <button onClick={() => toggleHot(selected)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[12px] font-semibold transition-colors border"
                    style={{ background: selected.hot ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.04)", color: selected.hot ? "#F59E0B" : "#6B7280", borderColor: selected.hot ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.06)" }}>
                    <Star size={13} className={selected.hot ? "fill-[#F59E0B]" : ""} /> {selected.hot ? "Quente" : "Marcar"}
                  </button>
                  <button onClick={() => discardLead(selected)}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.04] text-[#9CA3AF] text-[11px] hover:bg-white/[0.08] transition-colors border border-white/[0.06]">
                    Descartar lead
                  </button>
                  <button onClick={() => removeLead(selected)}
                    className="flex items-center justify-center gap-1 py-2 rounded-xl bg-[rgba(239,68,68,0.08)] text-[#F87171] text-[11px] hover:bg-[rgba(239,68,68,0.15)] transition-colors border border-[rgba(239,68,68,0.15)]">
                    <Trash2 size={11} /> Remover
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* === ADD LEAD MODAL === */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Novo lead" subtitle="Captura manual de lead"
        footer={
          <>
            <button onClick={() => setAddModal(false)} className="px-4 py-2 rounded-xl text-[12px] text-[#6B7280] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.06]">Cancelar</button>
            <button onClick={addLead} className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-[#7C3AED] hover:bg-[#8B5CF6] transition-colors">Capturar lead</button>
          </>
        }>
        <div className="space-y-4">
          {[
            { label: "Nome completo *", key: "name", placeholder: "Ex: Camila Torres" },
            { label: "Telefone / WhatsApp", key: "phone", placeholder: "Ex: (11) 99999-0000" },
            { label: "Interesse", key: "interest", placeholder: "Ex: Site + IA WhatsApp" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">{f.label}</label>
              <input type="text" placeholder={f.placeholder} value={(form as Record<string, string>)[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full bg-[#0C0C10] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(124,58,237,0.5)] transition-colors" />
            </div>
          ))}
          <div>
            <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">Origem</label>
            <select value={form.source} onChange={e => setForm(prev => ({ ...prev, source: e.target.value as Source }))}
              className="w-full bg-[#0C0C10] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(124,58,237,0.5)] transition-colors">
              {SOURCES.filter(s => s !== "Todos").map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </>
  );
}
