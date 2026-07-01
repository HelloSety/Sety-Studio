"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { motion } from "framer-motion";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import {
  Play, Lock, CheckCircle, Clock, Star, BookOpen,
  TrendingUp, Users, Zap, Brain, BarChart3, ChevronRight, Award
} from "lucide-react";

type Tab = "Todos" | "Primeiros Passos" | "CRM" | "WhatsApp" | "IA" | "Marketing" | "Avançado";
const tabs: Tab[] = ["Todos", "Primeiros Passos", "CRM", "WhatsApp", "IA", "Marketing", "Avançado"];

const courses = [
  {
    id: 1, title: "Configuração inicial do sistema", category: "Primeiros Passos" as Tab,
    lessons: 6, duration: "42 min", level: "Iniciante", progress: 100,
    icon: Zap, color: "#22C55E", locked: false,
    lessons_list: ["Criando sua conta", "Configurando a empresa", "Convidando a equipe", "Conectando o WhatsApp", "Configurando o CRM", "Primeiras automações"],
  },
  {
    id: 2, title: "CRM completo — do lead ao fechamento", category: "CRM" as Tab,
    lessons: 8, duration: "1h 12min", level: "Iniciante", progress: 62,
    icon: Users, color: "#7C3AED", locked: false,
    lessons_list: ["O que é CRM e por que usar", "Criando contatos e leads", "Pipeline visual", "Stages e probabilidades", "Tarefas e follow-ups", "Propostas integradas", "Relatórios de vendas", "Boas práticas de CRM"],
  },
  {
    id: 3, title: "WhatsApp com IA — Atendimento que converte", category: "WhatsApp" as Tab,
    lessons: 10, duration: "1h 38min", level: "Intermediário", progress: 30,
    icon: Brain, color: "#3B82F6", locked: false,
    lessons_list: ["Conectando o WhatsApp", "Configurando o agente de IA", "Templates e mensagens", "Fluxos de qualificação", "Integração com CRM", "Automações de follow-up", "Recuperação de abandono", "Relatórios de atendimento", "Boas práticas de IA", "Cases de sucesso"],
  },
  {
    id: 4, title: "Automações que trabalham 24h por você", category: "IA" as Tab,
    lessons: 7, duration: "58 min", level: "Intermediário", progress: 0,
    icon: Zap, color: "#F59E0B", locked: false,
    lessons_list: ["Introdução às automações", "Gatilhos e condições", "Ações disponíveis", "Automação de boas-vindas", "Follow-up automático", "Relatório automático", "Construindo sua própria"],
  },
  {
    id: 5, title: "Tráfego pago + Sety Vision — A combinação perfeita", category: "Marketing" as Tab,
    lessons: 9, duration: "1h 24min", level: "Intermediário", progress: 0,
    icon: TrendingUp, color: "#EF4444", locked: false,
    lessons_list: ["Conectando Meta Ads", "Conectando Google Ads", "Pixel e eventos", "Relatórios unificados", "Campanhas por segmento", "ROAS e otimização", "Públicos do CRM", "Remarketing automático", "Painel de performance"],
  },
  {
    id: 6, title: "Hub de Integrações — Conecte tudo", category: "Avançado" as Tab,
    lessons: 12, duration: "2h 10min", level: "Avançado", progress: 0,
    icon: BarChart3, color: "#A78BFA", locked: true,
    lessons_list: ["Shopify completo", "WooCommerce", "Mercado Livre", "Stripe e pagamentos", "ERP integrado", "Logística", "API REST própria", "Webhooks", "Multi-tenancy", "White label", "Exportação de dados", "Segurança avançada"],
  },
  {
    id: 7, title: "IA Avançada — Piloto Automático total", category: "Avançado" as Tab,
    lessons: 8, duration: "1h 45min", level: "Avançado", progress: 0,
    icon: Brain, color: "#EC4899", locked: true,
    lessons_list: ["Configuração avançada da IA", "Treinamento personalizado", "Regras de comportamento", "Integração com CRM avançada", "Relatórios de IA", "Marketplace de agentes", "API da IA", "Cases enterprise"],
  },
];

const levelColor = { Iniciante: "#22C55E", Intermediário: "#F59E0B", Avançado: "#EF4444" };

export default function AcademiaPage() {
  const [tab, setTab] = useState<Tab>("Todos");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = tab === "Todos" ? courses : courses.filter(c => c.category === tab);
  const totalProgress = Math.round(courses.reduce((s, c) => s + c.progress, 0) / courses.length);

  return (
    <>
      <Topbar
        title="Academia"
        subtitle="Aprenda a dominar cada módulo do sistema"
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Progress banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ease: EASE }}
          className="rounded-2xl p-5"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.08))", border: "1px solid rgba(124,58,237,0.2)" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[rgba(124,58,237,0.2)] flex items-center justify-center">
                <Award size={26} className="text-[#A78BFA]" />
              </div>
              <div>
                <div className="text-[16px] font-black text-white mb-0.5">Sua jornada de aprendizado</div>
                <div className="text-[13px] text-[#9CA3AF]">{totalProgress}% do conteúdo concluído · 2 cursos finalizados</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {[
                { label: "Aulas", val: courses.reduce((s, c) => s + c.lessons, 0).toString(), color: "#7C3AED" },
                { label: "Horas", val: "12h+", color: "#3B82F6" },
                { label: "Certificados", val: "2", color: "#22C55E" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-[22px] font-black" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-[11px] text-[#6B7280]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] mb-1.5">
              <span className="text-[#6B7280]">Progresso geral</span>
              <span className="text-[#A78BFA] font-semibold">{totalProgress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/[0.06]">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#3B82F6]"
                initial={{ width: 0 }} animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 1, ease: EASE }} />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3.5 py-1.5 rounded-xl text-[12px] font-medium transition-all border cursor-pointer ${
                tab === t
                  ? "bg-[rgba(124,58,237,0.15)] text-[#A78BFA] border-[rgba(124,58,237,0.3)]"
                  : "text-[#6B7280] border-white/[0.06] hover:text-white hover:border-white/10 bg-transparent"
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Courses */}
        <div className="space-y-3">
          {filtered.map((course, i) => {
            const Icon = course.icon;
            const isExpanded = expanded === course.id;
            const lc = levelColor[course.level as keyof typeof levelColor];

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, ease: EASE }}
                className="rounded-2xl overflow-hidden"
                style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)", opacity: course.locked ? 0.7 : 1 }}
              >
                <div className="flex items-center gap-4 p-5 cursor-pointer hover:bg-white/[0.01] transition-colors"
                  onClick={() => !course.locked && setExpanded(isExpanded ? null : course.id)}>

                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${course.color}15`, border: `1px solid ${course.color}25` }}>
                    {course.locked ? <Lock size={18} className="text-[#4B5563]" /> : <Icon size={18} style={{ color: course.color }} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-[14px] font-bold text-white">{course.title}</span>
                      {course.locked && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.06)] text-[#6B7280]">Pro+</span>
                      )}
                      {course.progress === 100 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[rgba(34,197,94,0.12)] text-[#4ADE80] flex items-center gap-1">
                          <CheckCircle size={9} /> Concluído
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                        style={{ background: `${lc}15`, color: lc }}>
                        {course.level}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#6B7280]">
                        <BookOpen size={10} /> {course.lessons} aulas
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-[#6B7280]">
                        <Clock size={10} /> {course.duration}
                      </span>
                    </div>
                    {course.progress > 0 && course.progress < 100 && (
                      <div className="mt-2">
                        <div className="h-1 rounded-full bg-white/[0.06] w-48">
                          <div className="h-full rounded-full" style={{ width: `${course.progress}%`, background: course.color }} />
                        </div>
                        <div className="text-[10px] text-[#4B5563] mt-0.5">{course.progress}% concluído</div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!course.locked && (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-colors"
                        style={{ background: course.progress > 0 ? `${course.color}15` : "#7C3AED", color: course.progress > 0 ? course.color : "#fff" }}>
                        <Play size={10} />
                        {course.progress === 100 ? "Revisar" : course.progress > 0 ? "Continuar" : "Começar"}
                      </button>
                    )}
                    {course.locked && (
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-[#7C3AED] text-white transition-colors">
                        <Star size={10} /> Upgrade
                      </button>
                    )}
                    <ChevronRight size={14} className={`text-[#4B5563] transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                  </div>
                </div>

                {isExpanded && !course.locked && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    className="border-t border-white/[0.06] px-5 py-4"
                  >
                    <div className="text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider mb-3">Aulas do curso</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {course.lessons_list.map((lesson, li) => {
                        const done = li < Math.floor((course.progress / 100) * course.lessons);
                        return (
                          <div key={li}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-white/[0.03] transition-colors"
                          >
                            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: done ? `${course.color}15` : "rgba(255,255,255,0.04)" }}>
                              {done
                                ? <CheckCircle size={11} style={{ color: course.color }} />
                                : <Play size={9} className="text-[#4B5563]" />
                              }
                            </div>
                            <span className="text-[12px]" style={{ color: done ? "#9CA3AF" : "#D1D5DB" }}>{lesson}</span>
                            {li === Math.floor((course.progress / 100) * course.lessons) && (
                              <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[rgba(124,58,237,0.15)] text-[#A78BFA]">Atual</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

      </main>
    </>
  );
}
