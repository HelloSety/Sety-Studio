"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/lib/motion";
import { MessageSquare, TrendingUp, Clock, Bot, ArrowUpRight, ChevronRight } from "lucide-react";

/* ── KPIs ─────────────────────────────────────────────────── */
const kpis = [
  { icon: MessageSquare, label: "Conversas hoje",        val: "284",  change: "+12%", up: true,  color: "#A78BFA" },
  { icon: TrendingUp,    label: "Vendas geradas",        val: "R$18k",change: "+34%", up: true,  color: "#22C55E" },
  { icon: Clock,         label: "Tempo de resposta",     val: "1,2s", change: "-0,4s",up: true,  color: "#3B82F6" },
  { icon: Bot,           label: "Taxa de automação",     val: "96%",  change: "+2%",  up: true,  color: "#F59E0B" },
];

/* ── Activity feed ────────────────────────────────────────── */
type FeedItem = { id: number; emoji: string; text: string; tag: string; tagColor: string; delay: number };

const pool: Omit<FeedItem, "id">[] = [
  { emoji: "💬", text: "IA respondeu João Silva — Clínica Norte",        tag: "WhatsApp",   tagColor: "#22C55E", delay: 0    },
  { emoji: "🔥", text: "Lead qualificado: Ana Paula Ribeiro (score 91)", tag: "Lead quente",tagColor: "#EF4444", delay: 1200 },
  { emoji: "📅", text: "Reunião agendada com Marcos Oliveira — 15h",     tag: "Agenda",     tagColor: "#3B82F6", delay: 900  },
  { emoji: "💳", text: "Proposta enviada: Studio Fitness — R$ 8.400",    tag: "Proposta",   tagColor: "#A78BFA", delay: 800  },
  { emoji: "✅", text: "Pagamento confirmado: Clínica Bella Vita",       tag: "Venda",      tagColor: "#22C55E", delay: 700  },
  { emoji: "🤖", text: "IA qualificou 12 leads automaticamente",         tag: "Automação",  tagColor: "#A78BFA", delay: 1100 },
  { emoji: "📩", text: "Novo lead: Ricardo Pires via Meta Ads",          tag: "Novo",       tagColor: "#6B7280", delay: 600  },
  { emoji: "🎯", text: "Follow-up enviado: 7 clientes (D+3)",            tag: "Auto",       tagColor: "#3B82F6", delay: 800  },
  { emoji: "⭐", text: "Avaliação 5 estrelas recebida",                  tag: "Reputação",  tagColor: "#F59E0B", delay: 1000 },
  { emoji: "💬", text: "IA respondeu Carla Drummond em 0,8s",            tag: "WhatsApp",   tagColor: "#22C55E", delay: 700  },
];

function LiveActivityFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const counter = useRef(0);
  const idx = useRef(0);

  useEffect(() => {
    const next = () => {
      const base = pool[idx.current % pool.length];
      idx.current++;
      const item: FeedItem = { ...base, id: counter.current++ };
      setItems(prev => [item, ...prev].slice(0, 10));
      const nxt = pool[idx.current % pool.length];
      setTimeout(next, nxt.delay + 500 + Math.random() * 500);
    };
    const t = setTimeout(next, 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-2 mt-4">
      <AnimatePresence initial={false}>
        {items.map((item, i) => (
          <motion.div key={item.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: Math.max(0.2, 1 - i * 0.08), y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <span className="text-[16px] shrink-0">{item.emoji}</span>
            <span className="flex-1 text-[13px] text-[#9CA3AF] truncate">{item.text}</span>
            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full shrink-0"
              style={{ background: `${item.tagColor}15`, color: item.tagColor }}>
              {item.tag}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ── Recent leads (compact) ──────────────────────────────── */
const leads = [
  { name: "Ana Paula Ribeiro",  company: "Clínica Bella Vita",  stage: "Proposta",   val: "R$8.4k",  hot: true },
  { name: "Ricardo Pires",      company: "Studio Fitness",       stage: "Fechamento", val: "R$22k",   hot: true },
  { name: "Marcos Oliveira",    company: "Imob 360",             stage: "Qualificado",val: "R$15.2k", hot: false },
  { name: "Carla Drummond",     company: "Auto Center Premium",  stage: "Contato",    val: "R$4.7k",  hot: false },
];

const stageColor: Record<string, string> = {
  "Proposta":    "#A78BFA",
  "Fechamento":  "#22C55E",
  "Qualificado": "#60A5FA",
  "Contato":     "#6B7280",
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.45, ease: EASE } }),
};

export default function PainelPage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <>
      <Topbar title="Dashboard" subtitle={`${greeting}, Seven`} />

      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-5 max-w-[1200px]">

        {/* ── 4 KPIs ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div key={kpi.label} custom={i} variants={fadeUp} initial="hidden" animate="visible"
                className="rounded-2xl p-5"
                style={{ background: "#0C0C12", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] text-[#52525B] font-medium">{kpi.label}</span>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${kpi.color}12` }}>
                    <Icon size={13} style={{ color: kpi.color }} />
                  </div>
                </div>
                <div className="text-[28px] font-black tracking-[-1.5px] leading-none mb-2">{kpi.val}</div>
                <div className="text-[11px] font-semibold" style={{ color: "#22C55E" }}>
                  {kpi.change} hoje
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Main content: feed + leads ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

          {/* Activity feed */}
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="visible"
            className="lg:col-span-3 rounded-2xl p-5"
            style={{ background: "#0C0C12", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] font-bold">Atividade em tempo real</div>
                <div className="text-[11px] text-[#52525B] mt-0.5">O sistema trabalhando por você</div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#22C55E] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                Ao vivo
              </div>
            </div>
            <LiveActivityFeed />
          </motion.div>

          {/* Recent leads */}
          <motion.div custom={5} variants={fadeUp} initial="hidden" animate="visible"
            className="lg:col-span-2 rounded-2xl overflow-hidden"
            style={{ background: "#0C0C12", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.04]">
              <div className="text-[13px] font-bold">Quem precisa de atenção</div>
              <a href="/crm" className="flex items-center gap-0.5 text-[11px] text-[#52525B] hover:text-white transition-colors no-underline">
                Ver todos <ArrowUpRight size={11} />
              </a>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {leads.map((lead) => {
                const color = stageColor[lead.stage] ?? "#6B7280";
                return (
                  <a key={lead.name} href="/crm"
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors no-underline group cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-[#1a1a2e] flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
                      {lead.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-semibold text-white truncate">{lead.name}</span>
                        {lead.hot && <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] shrink-0" />}
                      </div>
                      <div className="text-[10px] text-[#52525B] truncate">{lead.company}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-bold" style={{ color }}>{lead.stage}</div>
                      <div className="text-[11px] font-semibold text-white">{lead.val}</div>
                    </div>
                    <ChevronRight size={12} className="text-[#374151] group-hover:text-white transition-colors shrink-0" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>

      </main>
    </>
  );
}
