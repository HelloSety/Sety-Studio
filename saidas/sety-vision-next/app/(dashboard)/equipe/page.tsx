"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { motion } from "framer-motion";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import { Plus, Shield, Users, TrendingUp, Mail, Phone, MoreHorizontal, Crown, Eye, Edit, Trash2 } from "lucide-react";

type Tab = "Membros" | "Permissões" | "Convites";
const tabs: Tab[] = ["Membros", "Permissões", "Convites"];

const members = [
  {
    id: 1, name: "Seven Santos", email: "seven@setystudio.com.br",
    role: "Proprietário", avatar: "S", color: "#7C3AED",
    status: "online", lastSeen: "agora",
    permissions: ["Todas as permissões"],
    stats: { deals: 47, revenue: "R$ 94k", tasks: 12 },
  },
  {
    id: 2, name: "Carla Menezes", email: "carla@setystudio.com.br",
    role: "SDR", avatar: "C", color: "#3B82F6",
    status: "online", lastSeen: "agora",
    permissions: ["CRM", "WhatsApp", "Agenda", "Propostas"],
    stats: { deals: 23, revenue: "R$ 38k", tasks: 8 },
  },
  {
    id: 3, name: "Rafael Nunes", email: "rafael@setystudio.com.br",
    role: "Marketing", avatar: "R", color: "#22C55E",
    status: "ausente", lastSeen: "há 23 min",
    permissions: ["Campanhas", "Landing Pages", "Relatórios"],
    stats: { deals: 0, revenue: "—", tasks: 15 },
  },
  {
    id: 4, name: "Juliana Ferreira", email: "juliana@setystudio.com.br",
    role: "Suporte", avatar: "J", color: "#F59E0B",
    status: "offline", lastSeen: "há 2h",
    permissions: ["WhatsApp", "CRM (leitura)"],
    stats: { deals: 0, revenue: "—", tasks: 6 },
  },
];

const roles = [
  { name: "Proprietário", desc: "Acesso total — sem restrições", count: 1, color: "#7C3AED", icon: Crown },
  { name: "Admin", desc: "Acesso completo exceto faturamento", count: 0, color: "#3B82F6", icon: Shield },
  { name: "SDR / Vendedor", desc: "CRM, WhatsApp, Propostas, Agenda", count: 1, color: "#22C55E", icon: Users },
  { name: "Marketing", desc: "Campanhas, Landing Pages, Relatórios", count: 1, color: "#F59E0B", icon: TrendingUp },
  { name: "Suporte", desc: "WhatsApp e CRM (somente leitura)", count: 1, color: "#EC4899", icon: Mail },
  { name: "Visualizador", desc: "Acesso somente leitura em tudo", count: 0, color: "#6B7280", icon: Eye },
];

const statusColor: Record<string, string> = {
  online: "#22C55E",
  ausente: "#F59E0B",
  offline: "#6B7280",
};

export default function EquipePage() {
  const [tab, setTab] = useState<Tab>("Membros");

  return (
    <>
      <Topbar
        title="Equipe"
        subtitle="Membros, funções e permissões"
        action={{ label: "Convidar membro" }}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Membros", val: members.length.toString(), color: "#7C3AED", icon: Users },
            { label: "Online agora", val: members.filter(m => m.status === "online").length.toString(), color: "#22C55E", icon: TrendingUp },
            { label: "Cargos", val: roles.filter(r => r.count > 0).length.toString(), color: "#3B82F6", icon: Shield },
            { label: "Tarefas abertas", val: members.reduce((s, m) => s + m.stats.tasks, 0).toString(), color: "#F59E0B", icon: TrendingUp },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ease: EASE }}
                className="rounded-2xl p-4 flex items-center gap-3"
                style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                  <Icon size={16} style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-[22px] font-black leading-none">{s.val}</div>
                  <div className="text-[11px] text-[#6B7280] mt-0.5">{s.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-1.5">
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
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#7C3AED] text-white text-[12px] font-semibold rounded-xl hover:bg-[#8B5CF6] transition-colors">
            <Plus size={13} /> Convidar
          </button>
        </div>

        {tab === "Membros" && (
          <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
            <div className="grid grid-cols-[3fr_1fr_2fr_1fr_auto] gap-4 px-5 py-3 bg-[#0C0C10] border-b border-white/[0.06]">
              {["Membro","Cargo","Permissões","Status",""].map((h, i) => (
                <div key={i} className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-[0.5px]">{h}</div>
              ))}
            </div>
            {members.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                className="grid grid-cols-[3fr_1fr_2fr_1fr_auto] gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer group items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[13px] font-black text-white flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}aa)` }}>
                      {m.avatar}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0C0C10]"
                      style={{ background: statusColor[m.status] }} />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-white">{m.name}</div>
                    <div className="flex items-center gap-1 text-[11px] text-[#4B5563]">
                      <Mail size={9} /> {m.email}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${m.color}15`, color: m.color }}>
                    {m.role === "Proprietário" && <Crown className="inline w-2.5 h-2.5 mr-0.5" />}
                    {m.role}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {m.permissions.slice(0, 3).map(p => (
                    <span key={p} className="text-[9px] font-medium px-1.5 py-0.5 rounded-md bg-white/[0.06] text-[#6B7280]">{p}</span>
                  ))}
                  {m.permissions.length > 3 && <span className="text-[9px] text-[#4B5563]">+{m.permissions.length - 3}</span>}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: statusColor[m.status] }} />
                  <span className="text-[11px] text-[#6B7280] capitalize">{m.status}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#6B7280] hover:text-white transition-all">
                    <Edit size={11} />
                  </button>
                  {m.role !== "Proprietário" && (
                    <button className="w-7 h-7 rounded-lg bg-[rgba(239,68,68,0.08)] hover:bg-[rgba(239,68,68,0.15)] flex items-center justify-center text-[#F87171] transition-all">
                      <Trash2 size={11} />
                    </button>
                  )}
                  <button className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#6B7280] transition-all">
                    <MoreHorizontal size={11} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {tab === "Permissões" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {roles.map((role, i) => {
              const Icon = role.icon;
              return (
                <motion.div
                  key={role.name}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, ease: EASE }}
                  className="rounded-2xl p-5 cursor-pointer"
                  style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
                  whileHover={{ y: -2, borderColor: `${role.color}30` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${role.color}15` }}>
                      <Icon size={15} style={{ color: role.color }} />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-white">{role.name}</div>
                      <div className="text-[10px] text-[#6B7280]">{role.count} membro{role.count !== 1 ? "s" : ""}</div>
                    </div>
                  </div>
                  <p className="text-[12px] text-[#6B7280] leading-[1.5] mb-3">{role.desc}</p>
                  <button className="w-full py-1.5 rounded-xl text-[11px] font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-[#9CA3AF] hover:text-white transition-colors">
                    Editar permissões
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}

        {tab === "Convites" && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ease: EASE }}
            className="rounded-2xl p-8 flex flex-col items-center gap-4"
            style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="w-14 h-14 rounded-2xl bg-[rgba(124,58,237,0.12)] flex items-center justify-center">
              <Mail size={24} className="text-[#A78BFA]" />
            </div>
            <div className="text-center">
              <div className="text-[15px] font-bold text-white mb-1">Nenhum convite pendente</div>
              <div className="text-[13px] text-[#6B7280]">Convide membros da equipe para colaborar na plataforma</div>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#7C3AED] text-white text-[13px] font-semibold rounded-xl hover:bg-[#8B5CF6] transition-colors">
              <Plus size={14} /> Enviar convite
            </button>
          </motion.div>
        )}

      </main>
    </>
  );
}
