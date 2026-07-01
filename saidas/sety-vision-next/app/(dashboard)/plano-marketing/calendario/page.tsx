"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { Modal } from "@/app/components/ui/Modal";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/motion";
import { Plus, X, Check, ChevronLeft, ChevronRight, Video, FileText, Image, Share2, MessageCircle } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "sety_mkt_calendario";

type PostStatus = "ideia" | "criando" | "pronto" | "publicado";

type Post = {
  id: string;
  tema: string;
  tipo: "carrossel" | "reels" | "feed" | "artigo" | "video";
  plataforma: "instagram" | "linkedin" | "ambos" | "youtube";
  status: PostStatus;
  nota?: string;
  day: number;
};

const DIAS = [
  { idx: 0, label: "Segunda", short: "Seg", tema: "Dor", color: "#EF4444" },
  { idx: 1, label: "Terça", short: "Ter", tema: "Demonstração", color: "#7C3AED" },
  { idx: 2, label: "Quarta", short: "Qua", tema: "Educação", color: "#3B82F6" },
  { idx: 3, label: "Quinta", short: "Qui", tema: "Bastidores", color: "#F59E0B" },
  { idx: 4, label: "Sexta", short: "Sex", tema: "Cases", color: "#22C55E" },
  { idx: 5, label: "Sábado", short: "Sáb", tema: "Dicas", color: "#0891B2" },
  { idx: 6, label: "Domingo", short: "Dom", tema: "Reel IA", color: "#EC4899" },
];

const STATUS_LABELS: Record<PostStatus, { label: string; color: string; bg: string }> = {
  ideia:     { label: "Ideia", color: "#9CA3AF", bg: "rgba(107,114,128,0.15)" },
  criando:   { label: "Criando", color: "#F59E0B", bg: "rgba(245,158,11,0.15)" },
  pronto:    { label: "Pronto", color: "#3B82F6", bg: "rgba(59,130,246,0.15)" },
  publicado: { label: "Publicado", color: "#22C55E", bg: "rgba(34,197,94,0.15)" },
};

const TIPOS = ["carrossel", "reels", "feed", "artigo", "video"] as const;
const PLATAFORMAS = ["instagram", "linkedin", "ambos", "youtube"] as const;
const STATUS_ORDER: PostStatus[] = ["ideia", "criando", "pronto", "publicado"];

function PlataformaIcon({ p }: { p: Post["plataforma"] }) {
  if (p === "instagram") return <Share2 size={11} className="text-[#EC4899]" />;
  if (p === "linkedin") return <MessageCircle size={11} className="text-[#3B82F6]" />;
  if (p === "youtube") return <Video size={11} className="text-[#EF4444]" />;
  return (
    <div className="flex gap-0.5">
      <Share2 size={10} className="text-[#EC4899]" />
      <MessageCircle size={10} className="text-[#3B82F6]" />
    </div>
  );
}

function TipoIcon({ t }: { t: Post["tipo"] }) {
  if (t === "reels" || t === "video") return <Video size={10} className="text-[#6B7280]" />;
  if (t === "artigo") return <FileText size={10} className="text-[#6B7280]" />;
  return <Image size={10} className="text-[#6B7280]" />;
}

function getWeekLabel(weekOffset: number) {
  const now = new Date();
  const monday = new Date(now);
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(now.getDate() + diff + weekOffset * 7);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

const blankForm = { tema: "", tipo: "carrossel" as Post["tipo"], plataforma: "instagram" as Post["plataforma"], status: "ideia" as PostStatus, nota: "" };

export default function CalendarioPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [week, setWeek] = useState(0);
  const [modal, setModal] = useState(false);
  const [editPost, setEditPost] = useState<Post | null>(null);
  const [form, setForm] = useState(blankForm);
  const [activeDay, setActiveDay] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setPosts(JSON.parse(saved));
    } catch {}
  }, []);

  const save = (updated: Post[]) => {
    setPosts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const openCreate = (day: number) => {
    setEditPost(null);
    setActiveDay(day);
    setForm({ ...blankForm });
    setModal(true);
  };

  const openEdit = (post: Post) => {
    setEditPost(post);
    setActiveDay(post.day);
    setForm({ tema: post.tema, tipo: post.tipo, plataforma: post.plataforma, status: post.status, nota: post.nota ?? "" });
    setModal(true);
  };

  const confirmPost = useCallback(() => {
    if (!form.tema.trim()) return;
    if (editPost) {
      save(posts.map(p => p.id === editPost.id ? { ...editPost, ...form } : p));
    } else {
      const newPost: Post = { id: Date.now().toString(), day: activeDay!, ...form };
      save([...posts, newPost]);
    }
    setModal(false);
  }, [form, editPost, posts, activeDay]);

  const deletePost = (id: string) => save(posts.filter(p => p.id !== id));

  const advanceStatus = (post: Post) => {
    const idx = STATUS_ORDER.indexOf(post.status);
    if (idx < STATUS_ORDER.length - 1) {
      save(posts.map(p => p.id === post.id ? { ...p, status: STATUS_ORDER[idx + 1] } : p));
    }
  };

  const weekPosts = posts.filter(p => {
    const meta = (p as { week?: number }).week;
    return meta === undefined ? week === 0 : meta === week;
  });

  const postsForDay = (dayIdx: number) => weekPosts.filter(p => p.day === dayIdx);

  const totalPublicados = weekPosts.filter(p => p.status === "publicado").length;
  const totalProntos = weekPosts.filter(p => p.status === "pronto").length;

  return (
    <>
      <Topbar
        title="Calendário Editorial"
        subtitle={getWeekLabel(week)}
        action={{ label: "Novo post", onClick: () => openCreate(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1) }}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Nav semana + resumo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setWeek(w => w - 1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#6B7280] hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <ChevronLeft size={14} />
            </button>
            <span className="text-[12px] font-semibold text-[#9CA3AF]">{getWeekLabel(week)}</span>
            <button onClick={() => setWeek(w => w + 1)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#6B7280] hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <ChevronRight size={14} />
            </button>
            {week !== 0 && (
              <button onClick={() => setWeek(0)} className="text-[11px] text-[#7C3AED] hover:text-[#A78BFA] transition-colors">
                Ir para hoje
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <Check size={11} className="text-[#22C55E]" />
              <span className="text-[11px] font-semibold text-[#22C55E]">{totalPublicados} publicados</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
              <FileText size={11} className="text-[#3B82F6]" />
              <span className="text-[11px] font-semibold text-[#3B82F6]">{totalProntos} prontos</span>
            </div>
          </div>
        </div>

        {/* Grid dos dias */}
        <div className="grid grid-cols-7 gap-3">
          {DIAS.map((dia) => {
            const dayPosts = postsForDay(dia.idx);
            const isToday = new Date().getDay() === (dia.idx + 1) % 7 && week === 0;
            return (
              <motion.div key={dia.idx}
                className="rounded-2xl flex flex-col min-h-[280px]"
                style={{
                  background: isToday ? "rgba(124,58,237,0.06)" : "#111114",
                  border: `1px solid ${isToday ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.06)"}`,
                }}>
                {/* Header do dia */}
                <div className="px-3 pt-3 pb-2 border-b border-white/[0.05]">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: dia.color }}>{dia.short}</span>
                    {isToday && <span className="text-[8px] font-bold text-[#7C3AED] bg-[rgba(124,58,237,0.15)] px-1.5 py-0.5 rounded-full">HOJE</span>}
                  </div>
                  <div className="text-[11px] font-semibold text-[#9CA3AF]">{dia.tema}</div>
                </div>

                {/* Posts do dia */}
                <div className="flex-1 p-2 space-y-1.5 overflow-y-auto">
                  <AnimatePresence>
                    {dayPosts.map((post) => {
                      const st = STATUS_LABELS[post.status];
                      return (
                        <motion.div key={post.id}
                          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                          className="rounded-xl p-2.5 group cursor-pointer transition-all"
                          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
                          onClick={() => openEdit(post)}>
                          <div className="flex items-start justify-between gap-1 mb-1.5">
                            <span className="text-[11px] font-semibold text-white leading-tight line-clamp-2">{post.tema}</span>
                            <button onClick={e => { e.stopPropagation(); deletePost(post.id); }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-[#6B7280] hover:text-[#EF4444]">
                              <X size={10} />
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold" style={{ background: st.bg, color: st.color }}>
                              {st.label}
                            </span>
                            <TipoIcon t={post.tipo} />
                            <PlataformaIcon p={post.plataforma} />
                          </div>
                          {post.status !== "publicado" && (
                            <button onClick={e => { e.stopPropagation(); advanceStatus(post); }}
                              className="mt-1.5 w-full text-[9px] font-semibold py-1 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                              style={{ background: "rgba(124,58,237,0.15)", color: "#A78BFA" }}>
                              Avançar →
                            </button>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Botão de adicionar */}
                <button onClick={() => openCreate(dia.idx)}
                  className="mx-2 mb-2 flex items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-semibold text-[#6B7280] hover:text-white transition-all"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.08)" }}
                  onMouseEnter={e => { (e.currentTarget.style.borderColor) = `${dia.color}40`; }}
                  onMouseLeave={e => { (e.currentTarget.style.borderColor) = "rgba(255,255,255,0.08)"; }}>
                  <Plus size={11} /> Adicionar
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Legenda de status */}
        <div className="flex items-center gap-4 pt-1">
          <span className="text-[11px] text-[#4B5563]">Status:</span>
          {STATUS_ORDER.map(s => {
            const st = STATUS_LABELS[s];
            return (
              <div key={s} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: st.color }} />
                <span className="text-[11px] text-[#6B7280]">{st.label}</span>
              </div>
            );
          })}
        </div>

      </main>

      {/* Modal criar/editar post */}
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editPost ? "Editar post" : "Novo post"}
        subtitle={editPost ? `${DIAS[editPost.day].label} · ${DIAS[editPost.day].tema}` : activeDay !== null ? `${DIAS[activeDay].label} · ${DIAS[activeDay].tema}` : ""}
        footer={
          <>
            <button onClick={() => setModal(false)}
              className="px-4 py-2 rounded-xl text-[12px] text-[#6B7280] bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.06]">
              Cancelar
            </button>
            <button onClick={confirmPost}
              className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-[#7C3AED] hover:bg-[#8B5CF6] transition-colors">
              {editPost ? "Salvar" : "Criar post"}
            </button>
          </>
        }>
        <div className="space-y-4">
          {/* Tema */}
          <div>
            <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">Tema / Título *</label>
            <input
              type="text"
              placeholder="Ex: 3 erros que fazem empresas perder vendas todos os dias"
              value={form.tema}
              onChange={e => setForm(f => ({ ...f, tema: e.target.value }))}
              className="w-full bg-[#0C0C10] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(124,58,237,0.5)] transition-colors"
            />
          </div>
          {/* Tipo e Plataforma */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">Tipo</label>
              <div className="flex flex-wrap gap-1.5">
                {TIPOS.map(t => (
                  <button key={t} onClick={() => setForm(f => ({ ...f, tipo: t }))}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-all"
                    style={form.tipo === t
                      ? { background: "rgba(124,58,237,0.2)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.3)" }
                      : { background: "rgba(255,255,255,0.04)", color: "#6B7280", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">Plataforma</label>
              <div className="flex flex-wrap gap-1.5">
                {PLATAFORMAS.map(p => (
                  <button key={p} onClick={() => setForm(f => ({ ...f, plataforma: p }))}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize transition-all"
                    style={form.plataforma === p
                      ? { background: "rgba(124,58,237,0.2)", color: "#A78BFA", border: "1px solid rgba(124,58,237,0.3)" }
                      : { background: "rgba(255,255,255,0.04)", color: "#6B7280", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Status */}
          <div>
            <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">Status</label>
            <div className="flex gap-1.5">
              {STATUS_ORDER.map(s => {
                const st = STATUS_LABELS[s];
                return (
                  <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
                    style={form.status === s
                      ? { background: st.bg, color: st.color, border: `1px solid ${st.color}40` }
                      : { background: "rgba(255,255,255,0.04)", color: "#6B7280", border: "1px solid rgba(255,255,255,0.06)" }}>
                    {st.label}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Nota */}
          <div>
            <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">Nota (opcional)</label>
            <textarea
              rows={2}
              placeholder="Referência, ângulo, call to action..."
              value={form.nota}
              onChange={e => setForm(f => ({ ...f, nota: e.target.value }))}
              className="w-full bg-[#0C0C10] border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13px] text-white outline-none focus:border-[rgba(124,58,237,0.5)] transition-colors resize-none"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
