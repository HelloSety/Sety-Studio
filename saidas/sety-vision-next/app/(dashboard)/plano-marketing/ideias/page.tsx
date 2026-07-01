"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { Modal } from "@/app/components/ui/Modal";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/motion";
import { Plus, X, Lightbulb, Flame, Clock, Tag } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "sety_mkt_ideias";

type Prioridade = "alta" | "media" | "baixa";
type Pilar = "dor" | "demo" | "educacao" | "bastidores" | "cases" | "dicas" | "reel";

type Ideia = {
  id: string;
  titulo: string;
  descricao?: string;
  pilar: Pilar;
  prioridade: Prioridade;
  criadaEm: string;
};

const PILARES: Record<Pilar, { label: string; color: string }> = {
  dor:        { label: "Dor", color: "#EF4444" },
  demo:       { label: "Demo", color: "#7C3AED" },
  educacao:   { label: "Educação", color: "#3B82F6" },
  bastidores: { label: "Bastidores", color: "#F59E0B" },
  cases:      { label: "Cases", color: "#22C55E" },
  dicas:      { label: "Dicas", color: "#0891B2" },
  reel:       { label: "Reel IA", color: "#EC4899" },
};

const PRIORIDADES: Record<Prioridade, { label: string; color: string; bg: string }> = {
  alta:  { label: "Alta", color: "#EF4444", bg: "rgba(239,68,68,0.12)" },
  media: { label: "Média", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
  baixa: { label: "Baixa", color: "#6B7280", bg: "rgba(107,114,128,0.12)" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: EASE }
  }),
};

const blankForm = { titulo: "", descricao: "", pilar: "dor" as Pilar, prioridade: "media" as Prioridade };

export default function IdeiasPage() {
  const [ideias, setIdeias] = useState<Ideia[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(blankForm);
  const [filtro, setFiltro] = useState<Pilar | "todas">("todas");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setIdeias(JSON.parse(saved));
    } catch {}
  }, []);

  const save = (updated: Ideia[]) => {
    setIdeias(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const addIdeia = useCallback(() => {
    if (!form.titulo.trim()) return;
    const nova: Ideia = {
      id: Date.now().toString(),
      ...form,
      criadaEm: new Date().toLocaleDateString("pt-BR"),
    };
    save([nova, ...ideias]);
    setModal(false);
    setForm(blankForm);
  }, [form, ideias]);

  const deleteIdeia = (id: string) => save(ideias.filter(i => i.id !== id));

  const visibles = filtro === "todas" ? ideias : ideias.filter(i => i.pilar === filtro);
  const altas = ideias.filter(i => i.prioridade === "alta").length;

  return (
    <>
      <Topbar
        title="Banco de Ideias"
        subtitle={`${ideias.length} ideias · ${altas} alta prioridade`}
        action={{ label: "Nova ideia", onClick: () => setModal(true) }}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Filtro por pilar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setFiltro("todas")}
            className="px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all"
            style={filtro === "todas"
              ? { background: "rgba(124,58,237,0.15)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.25)" }
              : { background: "rgba(255,255,255,0.04)", color: "#6B7280", border: "1px solid rgba(255,255,255,0.06)" }}>
            Todas ({ideias.length})
          </button>
          {(Object.entries(PILARES) as [Pilar, { label: string; color: string }][]).map(([key, p]) => {
            const count = ideias.filter(i => i.pilar === key).length;
            if (count === 0) return null;
            return (
              <button key={key} onClick={() => setFiltro(key)}
                className="px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all"
                style={filtro === key
                  ? { background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}35` }
                  : { background: "rgba(255,255,255,0.04)", color: "#6B7280", border: "1px solid rgba(255,255,255,0.06)" }}>
                {p.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Lista de ideias */}
        {visibles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
              <Lightbulb size={24} className="text-[#7C3AED]" />
            </div>
            <div className="text-[14px] font-semibold text-[#6B7280]">Nenhuma ideia ainda</div>
            <div className="text-[12px] text-[#4B5563]">Clique em "Nova ideia" para começar</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            <AnimatePresence>
              {visibles.map((ideia, i) => {
                const pilar = PILARES[ideia.pilar];
                const prio = PRIORIDADES[ideia.prioridade];
                return (
                  <motion.div key={ideia.id} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="rounded-2xl p-4 group relative"
                    style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <button onClick={() => deleteIdeia(ideia.id)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#6B7280] hover:text-[#EF4444]">
                      <X size={13} />
                    </button>
                    <div className="flex items-start gap-2 mb-3">
                      {ideia.prioridade === "alta" && <Flame size={14} className="text-[#EF4444] mt-0.5 flex-shrink-0" />}
                      <div className="text-[13px] font-semibold text-white leading-snug pr-4">{ideia.titulo}</div>
                    </div>
                    {ideia.descricao && (
                      <p className="text-[11px] text-[#6B7280] leading-relaxed mb-3">{ideia.descricao}</p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold" style={{ background: `${pilar.color}15`, color: pilar.color }}>
                        <Tag size={9} className="inline mr-1" />{pilar.label}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold" style={{ background: prio.bg, color: prio.color }}>
                        {prio.label}
                      </span>
                      <span className="text-[10px] text-[#4B5563] ml-auto flex items-center gap-1">
                        <Clock size={9} />{ideia.criadaEm}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

      </main>

      {/* Modal nova ideia */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title="Nova ideia"
        subtitle="Adicionar ao banco de conteúdo"
        footer={
          <>
            <button onClick={() => setModal(false)}
              className="px-4 py-2 rounded-xl text-[12px] text-[#6B7280] bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.06]">
              Cancelar
            </button>
            <button onClick={addIdeia}
              className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-[#7C3AED] hover:bg-[#8B5CF6] transition-colors">
              Salvar ideia
            </button>
          </>
        }>
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">Título *</label>
            <input
              type="text"
              placeholder="Ex: Como a IA eliminou 3h de trabalho por dia no escritório"
              value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
              className="w-full bg-[#0C0C10] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(124,58,237,0.5)] transition-colors"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">Descrição / Ângulo</label>
            <textarea
              rows={2}
              placeholder="Ângulo, contexto, referência..."
              value={form.descricao}
              onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
              className="w-full bg-[#0C0C10] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(124,58,237,0.5)] transition-colors resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">Pilar</label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.entries(PILARES) as [Pilar, { label: string; color: string }][]).map(([key, p]) => (
                  <button key={key} onClick={() => setForm(f => ({ ...f, pilar: key }))}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all"
                    style={form.pilar === key
                      ? { background: `${p.color}20`, color: p.color, border: `1px solid ${p.color}35` }
                      : { background: "rgba(255,255,255,0.04)", color: "#6B7280", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">Prioridade</label>
              <div className="flex gap-1.5">
                {(Object.entries(PRIORIDADES) as [Prioridade, { label: string; color: string; bg: string }][]).map(([key, p]) => (
                  <button key={key} onClick={() => setForm(f => ({ ...f, prioridade: key }))}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                    style={form.prioridade === key
                      ? { background: p.bg, color: p.color, border: `1px solid ${p.color}40` }
                      : { background: "rgba(255,255,255,0.04)", color: "#6B7280", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
