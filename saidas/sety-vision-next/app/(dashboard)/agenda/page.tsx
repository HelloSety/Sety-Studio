"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { motion } from "framer-motion";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import { Plus, ChevronLeft, ChevronRight, Clock, User, Phone, Video, CheckSquare, Circle, CheckCircle } from "lucide-react";

type View = "Mês" | "Semana" | "Dia" | "Lista";
const views: View[] = ["Mês", "Semana", "Dia", "Lista"];

const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const monthDays = Array.from({ length: 30 }, (_, i) => i + 1);

const events = [
  { day: 3, time: "09:00", duration: 60, title: "Reunião com Ricardo Pires", type: "reuniao", color: "#7C3AED", client: "Ricardo Pires" },
  { day: 5, time: "14:00", duration: 30, title: "Call de onboarding — Clínica Bella Vita", type: "call", color: "#3B82F6", client: "Clínica Bella Vita" },
  { day: 5, time: "16:30", duration: 45, title: "Demo do sistema — Ana Paula", type: "demo", color: "#22C55E", client: "Ana Paula Ribeiro" },
  { day: 10, time: "10:00", duration: 90, title: "Workshop de automações", type: "workshop", color: "#F59E0B", client: null },
  { day: 15, time: "11:00", duration: 30, title: "Follow-up — Gustavo Lima", type: "call", color: "#3B82F6", client: "Gustavo Lima" },
  { day: 18, time: "09:00", duration: 60, title: "Apresentação de proposta — Imob 360", type: "reuniao", color: "#7C3AED", client: "Imob 360" },
  { day: 20, time: "15:00", duration: 45, title: "Revisão trimestral — Studio Fitness", type: "reuniao", color: "#7C3AED", client: "Studio Fitness" },
  { day: 27, time: "10:30", duration: 30, title: "Call técnico — NovaTech", type: "call", color: "#3B82F6", client: "NovaTech" },
];

const tasks = [
  { id: 1, title: "Enviar proposta para Imob 360", done: true, priority: "alta", due: "Hoje" },
  { id: 2, title: "Preparar apresentação de onboarding", done: false, priority: "alta", due: "Hoje" },
  { id: 3, title: "Follow-up com lista de leads quentes", done: false, priority: "média", due: "Amanhã" },
  { id: 4, title: "Atualizar pipeline — remover deals mortos", done: false, priority: "baixa", due: "Sex" },
  { id: 5, title: "Criar conteúdo para Instagram", done: true, priority: "baixa", due: "Hoje" },
  { id: 6, title: "Revisar métricas de campanhas", done: false, priority: "média", due: "Amanhã" },
];

const priorityColor = { alta: "#EF4444", média: "#F59E0B", baixa: "#6B7280" };
const typeIcon = { reuniao: User, call: Phone, demo: Video, workshop: CheckSquare };

export default function AgendaPage() {
  const [view, setView] = useState<View>("Mês");
  const [currentDay, setCurrentDay] = useState(27);
  const [taskList, setTaskList] = useState(tasks);

  const todayEvents = events.filter(e => e.day === currentDay);
  const toggleTask = (id: number) => setTaskList(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  return (
    <>
      <Topbar
        title="Agenda"
        subtitle="Calendário, tarefas e compromissos"
        action={{ label: "Novo evento" }}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-full">

          {/* Calendar + Events */}
          <div className="lg:col-span-2 space-y-4">

            {/* View selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#6B7280] hover:text-white transition-all">
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[14px] font-bold text-white px-2">Junho 2026</span>
                <button className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#6B7280] hover:text-white transition-all">
                  <ChevronRight size={14} />
                </button>
              </div>
              <div className="flex gap-1">
                {views.map(v => (
                  <button key={v} onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all cursor-pointer ${
                      view === v ? "bg-[rgba(124,58,237,0.15)] text-[#A78BFA]" : "text-[#6B7280] hover:text-white"
                    }`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Month grid */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ ease: EASE }}
              className="rounded-2xl overflow-hidden"
              style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Week header */}
              <div className="grid grid-cols-7 border-b border-white/[0.06]">
                {weekDays.map(d => (
                  <div key={d} className="py-2.5 text-center text-[11px] font-semibold text-[#4B5563] uppercase tracking-wider">{d}</div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7">
                {/* Offset (Jun starts on Monday = col 1) */}
                <div className="p-2 min-h-[60px]" />
                {monthDays.map((day) => {
                  const dayEvents = events.filter(e => e.day === day);
                  const isSelected = day === currentDay;
                  const isToday = day === 27;
                  return (
                    <div
                      key={day}
                      onClick={() => setCurrentDay(day)}
                      className={`p-2 min-h-[60px] border-b border-r border-white/[0.04] cursor-pointer transition-colors ${
                        isSelected ? "bg-[rgba(124,58,237,0.08)]" : "hover:bg-white/[0.02]"
                      }`}
                    >
                      <div className={`text-[12px] font-semibold w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                        isToday ? "bg-[#7C3AED] text-white" : isSelected ? "text-[#A78BFA]" : "text-[#6B7280]"
                      }`}>{day}</div>
                      <div className="space-y-0.5">
                        {dayEvents.slice(0, 2).map((e, i) => (
                          <div key={i} className="text-[9px] px-1 py-0.5 rounded truncate font-medium"
                            style={{ background: `${e.color}20`, color: e.color }}>
                            {e.title.slice(0, 14)}…
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[9px] text-[#4B5563]">+{dayEvents.length - 2}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Day events */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ease: EASE }}
              className="rounded-2xl p-5"
              style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-[13px] font-bold text-white">
                  {currentDay === 27 ? "Hoje" : `Dia ${currentDay}`} — Junho 2026
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7C3AED] text-white text-[11px] font-semibold rounded-xl hover:bg-[#8B5CF6] transition-colors">
                  <Plus size={11} /> Evento
                </button>
              </div>
              {todayEvents.length === 0 ? (
                <div className="py-8 text-center text-[13px] text-[#4B5563]">Nenhum compromisso neste dia</div>
              ) : (
                <div className="space-y-2">
                  {todayEvents.map((e, i) => {
                    const Icon = typeIcon[e.type as keyof typeof typeIcon] || User;
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.02] cursor-pointer group transition-colors"
                        style={{ borderLeft: `3px solid ${e.color}` }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${e.color}15` }}>
                          <Icon size={13} style={{ color: e.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="text-[13px] font-semibold text-white">{e.title}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Clock size={10} className="text-[#4B5563]" />
                            <span className="text-[11px] text-[#6B7280]">{e.time} · {e.duration} min</span>
                            {e.client && <span className="text-[10px] text-[#4B5563]">· {e.client}</span>}
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                          <button className="px-2 py-1 rounded-lg bg-white/[0.06] text-[10px] text-[#9CA3AF] hover:text-white">Editar</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* Tasks */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, ease: EASE }}
              className="rounded-2xl p-5 sticky top-0"
              style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-[13px] font-bold text-white">Tarefas</div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#6B7280]">{taskList.filter(t => t.done).length}/{taskList.length}</span>
                  <button className="w-7 h-7 rounded-lg bg-[#7C3AED] hover:bg-[#8B5CF6] flex items-center justify-center transition-colors">
                    <Plus size={12} className="text-white" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {taskList.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    onClick={() => toggleTask(task.id)}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.02] cursor-pointer group transition-colors"
                    style={{ border: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {task.done
                        ? <CheckCircle size={15} className="text-[#22C55E]" />
                        : <Circle size={15} className="text-[#4B5563] group-hover:text-[#6B7280] transition-colors" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-[12px] font-medium leading-[1.4] ${task.done ? "line-through text-[#4B5563]" : "text-[#D1D5DB]"}`}>{task.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: `${priorityColor[task.priority as keyof typeof priorityColor]}15`, color: priorityColor[task.priority as keyof typeof priorityColor] }}>
                          {task.priority}
                        </span>
                        <span className="text-[10px] text-[#4B5563]">{task.due}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full bg-[#7C3AED] rounded-full transition-all"
                    style={{ width: `${(taskList.filter(t => t.done).length / taskList.length) * 100}%` }} />
                </div>
                <div className="text-[11px] text-[#6B7280] mt-1.5">{Math.round((taskList.filter(t => t.done).length / taskList.length) * 100)}% concluído</div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}
