"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import {
  Target, TrendingUp, Users, Video, Calendar, DollarSign,
  Share2, MessageCircle, CheckCircle2, Plus, Minus, ChevronRight,
  Megaphone, Lightbulb, Globe, Settings2, Layers, ArrowRight
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const STORAGE_KEY = "sety_mkt_kpis";

type KPIData = {
  prospeccoes: number;
  postsIG: number;
  postsLI: number;
  videos: number;
  reunioes: number;
  receita: number;
};

const defaultKPIs: KPIData = {
  prospeccoes: 0,
  postsIG: 0,
  postsLI: 0,
  videos: 0,
  reunioes: 0,
  receita: 0,
};

const METAS = {
  prospeccoes: 50,
  postsIG: 4,
  postsLI: 3,
  videos: 2,
  reunioes: 10,
  receita: 10000,
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: EASE }
  }),
};

const FUNIL = [
  { label: "Conteúdo", icon: Megaphone, color: "#7C3AED" },
  { label: "Landing Page", icon: Globe, color: "#3B82F6" },
  { label: "Diagnóstico", icon: Lightbulb, color: "#0891B2" },
  { label: "Proposta", icon: Layers, color: "#059669" },
  { label: "Implementação", icon: Settings2, color: "#D97706" },
  { label: "Mensalidade", icon: DollarSign, color: "#22C55E" },
];

const PILARES = [
  { label: "Dor do mercado", desc: "Mostrar os problemas reais dos empresários", color: "#EF4444", day: "Seg" },
  { label: "Demonstrações", desc: "Solução funcionando na prática", color: "#7C3AED", day: "Ter" },
  { label: "Educação", desc: "IA, CRM e automação acessíveis", color: "#3B82F6", day: "Qua" },
  { label: "Bastidores", desc: "Como construímos e operamos", color: "#F59E0B", day: "Qui" },
  { label: "Cases", desc: "Resultados e números reais", color: "#22C55E", day: "Sex" },
  { label: "Dicas", desc: "Conteúdo prático e acionável", color: "#0891B2", day: "Sáb" },
  { label: "Reel IA", desc: "Demonstração de ferramenta em vídeo", color: "#EC4899", day: "Dom" },
];

function pct(val: number, meta: number) {
  return Math.min(100, Math.round((val / meta) * 100));
}

export default function PlanoMarketingPage() {
  const router = useRouter();
  const [kpis, setKPIs] = useState<KPIData>(defaultKPIs);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setKPIs(JSON.parse(saved));
    } catch {}
  }, []);

  const update = useCallback((key: keyof KPIData, delta: number) => {
    setKPIs(prev => {
      const next = { ...prev, [key]: Math.max(0, prev[key] + delta) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultKPIs));
    setKPIs(defaultKPIs);
  }, []);

  const kpiCards = [
    {
      key: "prospeccoes" as keyof KPIData,
      label: "Prospecções hoje",
      meta: METAS.prospeccoes,
      icon: Users,
      color: "#7C3AED",
      unit: "",
      period: "meta: 50/dia",
    },
    {
      key: "postsIG" as keyof KPIData,
      label: "Posts Instagram",
      meta: METAS.postsIG,
      icon: Share2,
      color: "#EC4899",
      unit: "",
      period: "meta: 4/semana",
    },
    {
      key: "postsLI" as keyof KPIData,
      label: "Posts LinkedIn",
      meta: METAS.postsLI,
      icon: MessageCircle,
      color: "#3B82F6",
      unit: "",
      period: "meta: 3/semana",
    },
    {
      key: "videos" as keyof KPIData,
      label: "Vídeos demo",
      meta: METAS.videos,
      icon: Video,
      color: "#F59E0B",
      unit: "",
      period: "meta: 2/semana",
    },
    {
      key: "reunioes" as keyof KPIData,
      label: "Reuniões",
      meta: METAS.reunioes,
      icon: Calendar,
      color: "#22C55E",
      unit: "",
      period: "meta: 10/mês",
    },
    {
      key: "receita" as keyof KPIData,
      label: "Receita pipeline",
      meta: METAS.receita,
      icon: TrendingUp,
      color: "#0891B2",
      unit: "R$",
      step: 1000,
      period: "meta: R$10k/mês",
    },
  ];

  return (
    <>
      <Topbar
        title="Plano de Marketing"
        subtitle="SETY VISION — acompanhamento de execução"
        action={{ label: "Ir ao Calendário", onClick: () => router.push("/plano-marketing/calendario") }}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Header posicionamento */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible"
          className="rounded-2xl p-5 flex items-start gap-5"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(59,130,246,0.08) 100%)", border: "1px solid rgba(124,58,237,0.2)" }}>
          <div className="w-10 h-10 rounded-2xl bg-[#7C3AED] flex items-center justify-center flex-shrink-0">
            <Target size={18} className="text-white" />
          </div>
          <div>
            <div className="text-[14px] font-bold text-white">Posicionamento</div>
            <p className="text-[12px] text-[#9CA3AF] mt-1 leading-relaxed">
              Não vender apenas sites. Vender um <span className="text-[#A78BFA] font-semibold">Sistema Operacional para Empresas</span>. O site é apenas uma parte da solução.
            </p>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-[13px] font-bold text-white">KPIs da semana</div>
            <button onClick={reset} className="text-[11px] text-[#6B7280] hover:text-white transition-colors">Resetar contadores</button>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
            {kpiCards.map((kpi, i) => {
              const Icon = kpi.icon;
              const val = kpis[kpi.key];
              const step = (kpi as { step?: number }).step ?? 1;
              const progress = pct(val, kpi.meta);
              const done = progress >= 100;
              return (
                <motion.div key={kpi.key} custom={i + 1} variants={fadeUp} initial="hidden" animate="visible"
                  className="rounded-2xl p-5" style={{ background: "#111114", border: `1px solid ${done ? kpi.color + "40" : "rgba(255,255,255,0.06)"}` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-[11px] text-[#6B7280]">{kpi.label}</div>
                      <div className="text-[11px] text-[#4B5563] mt-0.5">{kpi.period}</div>
                    </div>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{ background: `${kpi.color}18`, border: `1px solid ${kpi.color}30` }}>
                      {done
                        ? <CheckCircle2 size={14} style={{ color: kpi.color }} />
                        : <Icon size={14} style={{ color: kpi.color }} />
                      }
                    </div>
                  </div>
                  <div className="text-[28px] font-black tracking-tight leading-none mb-1" style={{ color: done ? kpi.color : "white" }}>
                    {kpi.unit}{val.toLocaleString("pt-BR")}
                    <span className="text-[14px] font-normal text-[#4B5563] ml-1">/ {kpi.unit}{kpi.meta.toLocaleString("pt-BR")}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1 rounded-full bg-white/[0.06] mb-3">
                    <motion.div className="h-full rounded-full" style={{ background: kpi.color }}
                      initial={{ width: 0 }} animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: EASE }} />
                  </div>
                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold" style={{ color: done ? kpi.color : "#6B7280" }}>
                      {progress}%{done ? " ✓ Meta batida!" : ""}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => update(kpi.key, -step)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-[#6B7280] hover:text-white"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <Minus size={11} />
                      </button>
                      <button onClick={() => update(kpi.key, step)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-white"
                        style={{ background: `${kpi.color}20`, border: `1px solid ${kpi.color}30` }}>
                        <Plus size={11} style={{ color: kpi.color }} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Funil */}
        <motion.div custom={8} variants={fadeUp} initial="hidden" animate="visible"
          className="rounded-2xl p-6" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-[13px] font-bold text-white mb-4">Funil de vendas</div>
          <div className="flex items-center gap-2 flex-wrap">
            {FUNIL.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.label} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl"
                    style={{ background: `${step.color}12`, border: `1px solid ${step.color}25` }}>
                    <Icon size={16} style={{ color: step.color }} />
                    <span className="text-[11px] font-semibold whitespace-nowrap" style={{ color: step.color }}>{step.label}</span>
                  </div>
                  {i < FUNIL.length - 1 && <ArrowRight size={14} className="text-[#374151] flex-shrink-0" />}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Pilares + Calendário */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div custom={9} variants={fadeUp} initial="hidden" animate="visible"
            className="col-span-2 rounded-2xl p-6" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="text-[13px] font-bold text-white">Pilares de conteúdo</div>
              <button onClick={() => router.push("/plano-marketing/calendario")}
                className="text-[11px] text-[#7C3AED] hover:text-[#A78BFA] flex items-center gap-1 transition-colors">
                Ver calendário <ChevronRight size={11} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {PILARES.map((p) => (
                <div key={p.label} className="rounded-xl p-3 cursor-pointer transition-all hover:scale-[1.02]"
                  style={{ background: `${p.color}10`, border: `1px solid ${p.color}20` }}>
                  <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: p.color }}>{p.day}</div>
                  <div className="text-[12px] font-semibold text-white leading-tight mb-1">{p.label}</div>
                  <div className="text-[10px] text-[#6B7280] leading-tight">{p.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Estrutura interna */}
          <motion.div custom={10} variants={fadeUp} initial="hidden" animate="visible"
            className="rounded-2xl p-6" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-[13px] font-bold text-white mb-4">Estrutura interna</div>
            <div className="space-y-2">
              {[
                { label: "CRM", done: true },
                { label: "Pipeline comercial", done: true },
                { label: "Playbook de vendas", done: false },
                { label: "Playbook de onboarding", done: false },
                { label: "Portal do cliente", done: false },
                { label: "Biblioteca de automações", done: false },
                { label: "Propostas", done: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5 py-1.5">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? "bg-[rgba(34,197,94,0.15)]" : "bg-white/[0.04]"}`}
                    style={{ border: `1px solid ${item.done ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}` }}>
                    {item.done && <CheckCircle2 size={9} className="text-[#22C55E]" />}
                  </div>
                  <span className={`text-[12px] ${item.done ? "text-[#9CA3AF]" : "text-[#6B7280]"}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </main>
    </>
  );
}
