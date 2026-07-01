"use client";

import { motion } from "framer-motion";
import { UserCheck, MessageSquare, Zap, Target, DollarSign, TrendingUp, Filter } from "lucide-react";
import { mockLeads } from "@/lib/mock-data";
import { timeAgo, scoreToLabel, cn } from "@/lib/utils";
import Header from "@/components/layout/header";

const hotLeads = mockLeads
  .filter((l) => l.score >= 60)
  .sort((a, b) => b.score - a.score);

// ── Score Ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const r = (size / 2) - 5;
  const circ = 2 * Math.PI * r;
  const progress = (score / 100) * circ;
  const color = score >= 80 ? "#22C55E" : score >= 60 ? "#F59E0B" : "#3F3F46";
  const label = score >= 90 ? "Excelente" : score >= 80 ? "Muito Quente" : score >= 60 ? "Quente" : "Morno";
  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${progress} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ filter: `drop-shadow(0 0 4px ${color}70)` }}
        />
        <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central" fill="white" fontSize="13" fontWeight="700">
          {score}
        </text>
      </svg>
      <p className="text-[10px] font-medium mt-1" style={{ color }}>{label}</p>
    </div>
  );
}

// ── Metric chip ───────────────────────────────────────────────────────────────
function Metric({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="w-3 h-3 shrink-0" style={{ color }} />
      <div>
        <p className="text-[9px] text-[#3F3F46] leading-none">{label}</p>
        <p className="text-[11px] font-semibold text-white leading-tight">{value}</p>
      </div>
    </div>
  );
}

const FILTERS = ["Todos", "Score 80+", "Pediram Proposta", "Prontos para Fechar"];

export default function LeadsQuentesPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Leads Quentes"
        subtitle={`${hotLeads.length} leads com alta intenção`}
        actions={
          <button className="btn-ghost text-[12px] border border-white/[0.06]">
            <Filter className="w-3.5 h-3.5" />
            Filtrar
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* Stats strip */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Extremamente Quentes", value: hotLeads.filter(l => l.score >= 90).length, color: "#EF4444", bg: "bg-red-500/08", border: "border-red-500/12" },
            { label: "Muito Quentes", value: hotLeads.filter(l => l.score >= 80 && l.score < 90).length, color: "#F97316", bg: "bg-orange-500/08", border: "border-orange-500/12" },
            { label: "Quentes", value: hotLeads.filter(l => l.score >= 60 && l.score < 80).length, color: "#F59E0B", bg: "bg-yellow-500/08", border: "border-yellow-500/12" },
            { label: "Prontos p/ Fechar", value: 2, color: "#22C55E", bg: "bg-green-500/08", border: "border-green-500/12" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4`}>
              <p className="text-[26px] font-bold leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[11px] text-[#52525B] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2">
          {FILTERS.map((f, i) => (
            <button
              key={f}
              className={cn(
                "px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all border",
                i === 0
                  ? "bg-[#7C3AED]/12 text-[#8B5CF6] border-[#7C3AED]/25"
                  : "bg-transparent text-[#52525B] border-white/[0.05] hover:border-white/[0.09] hover:text-[#A1A1AA]"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Lead cards grid */}
        <div className="grid grid-cols-2 gap-4">
          {hotLeads.map((lead, i) => {
            const score = scoreToLabel(lead.score);
            const isVeryHot = lead.score >= 80;
            const buyProb = Math.max(0, lead.score - 5);
            const urgency = lead.score >= 80 ? "Alta" : "Média";
            const potential = lead.score >= 80 ? "R$ 4-8k" : "R$ 2-4k";

            return (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.3 }}
                className={cn(
                  "rounded-2xl p-5 cursor-pointer transition-all duration-200 group",
                  isVeryHot
                    ? "gradient-border-green hover:bg-[#1A1A21]"
                    : "glass-card hover:bg-[#1A1A21]"
                )}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7C3AED]/30 to-[#8B5CF6]/30 flex items-center justify-center text-[15px] font-bold text-white">
                        {lead.name[0]}
                      </div>
                      {isVeryHot && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.8, repeat: Infinity }}
                          className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[8px]"
                          style={{ boxShadow: "0 0 8px rgba(239,68,68,0.6)" }}
                        >
                          🔥
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-white">{lead.name}</p>
                      <p className="text-[11px] text-[#52525B]">{lead.origin}</p>
                    </div>
                  </div>
                  <ScoreRing score={lead.score} size={52} />
                </div>

                {/* 4 metrics */}
                <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                  <Metric icon={TrendingUp}   label="Temperatura"  value={score.label}    color="#EF4444" />
                  <Metric icon={Target}        label="Interesse"    value={`${buyProb}%`}  color="#7C3AED" />
                  <Metric icon={DollarSign}    label="Potencial"    value={potential}      color="#22C55E" />
                  <Metric icon={Zap}           label="Urgência"     value={urgency}        color="#F59E0B" />
                </div>

                {/* Last message */}
                <div className="mb-4">
                  <p className="text-[11px] text-[#52525B] mb-1">Última mensagem</p>
                  <p className="text-[12px] text-[#A1A1AA] leading-relaxed line-clamp-2">{lead.last_message}</p>
                  {lead.last_message_at && (
                    <p className="text-[10px] text-[#3F3F46] mt-1">{timeAgo(lead.last_message_at)}</p>
                  )}
                </div>

                {/* Tags */}
                {lead.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {lead.tags.map((t) => (
                      <span key={t} className="tag-purple">{t}</span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-semibold text-white transition-all"
                    style={{
                      background: "linear-gradient(135deg, #7C3AED, #8B5CF6)",
                      boxShadow: "0 4px 14px rgba(124,58,237,0.3)",
                    }}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Assumir Conversa
                  </motion.button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#52525B] hover:text-white hover:bg-white/[0.07] transition-all">
                    <MessageSquare className="w-[15px] h-[15px]" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
