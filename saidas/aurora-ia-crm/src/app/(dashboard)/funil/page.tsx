"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, MoreVertical, GripVertical, User, Flame } from "lucide-react";
import { mockLeads } from "@/lib/mock-data";
import { scoreToLabel, cn } from "@/lib/utils";
import type { Lead } from "@/types";
import Header from "@/components/layout/header";

const COLUMNS = [
  { id: "novo", label: "Novo Lead", color: "#64748B", count: 0 },
  { id: "contato", label: "Primeiro Contato", color: "#8B3FFF", count: 0 },
  { id: "qualificado", label: "Qualificado", color: "#06B6D4", count: 0 },
  { id: "proposta", label: "Proposta Enviada", color: "#F59E0B", count: 0 },
  { id: "negociacao", label: "Em Negociação", color: "#F97316", count: 0 },
  { id: "fechado", label: "Fechado", color: "#10B981", count: 0 },
  { id: "perdido", label: "Perdido", color: "#EF4444", count: 0 },
];

const stageMap: Record<string, string> = {
  "1": "contato",
  "2": "qualificado",
  "3": "proposta",
  "4": "negociacao",
  "5": "fechado",
  "6": "perdido",
  "7": "novo",
};

type Board = Record<string, Lead[]>;

function buildBoard(): Board {
  const board: Board = {};
  COLUMNS.forEach((c) => (board[c.id] = []));
  mockLeads.forEach((l, i) => {
    const col = stageMap[l.id] ?? COLUMNS[i % COLUMNS.length].id;
    board[col].push(l);
  });
  return board;
}

export default function FunilPage() {
  const [board, setBoard] = useState<Board>(buildBoard);
  const [dragging, setDragging] = useState<{ lead: Lead; from: string } | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const onDragStart = (lead: Lead, from: string) => setDragging({ lead, from });
  const onDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault();
    setDragOver(colId);
  };
  const onDrop = (colId: string) => {
    if (!dragging || dragging.from === colId) { setDragging(null); setDragOver(null); return; }
    setBoard((prev) => {
      const next = { ...prev };
      next[dragging.from] = next[dragging.from].filter((l) => l.id !== dragging.lead.id);
      next[colId] = [...next[colId], dragging.lead];
      return next;
    });
    setDragging(null);
    setDragOver(null);
  };

  const totalValue = mockLeads.length * 3500;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Funil de Vendas" subtitle={`${mockLeads.length} leads · R$ ${totalValue.toLocaleString("pt-BR")} em pipeline`} />

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <div className="flex gap-4 h-full" style={{ minWidth: `${COLUMNS.length * 232}px` }}>
          {COLUMNS.map((col) => {
            const leads = board[col.id] ?? [];
            const isDragTarget = dragOver === col.id;
            return (
              <div
                key={col.id}
                className="flex flex-col w-[220px] shrink-0"
                onDragOver={(e) => onDragOver(e, col.id)}
                onDrop={() => onDrop(col.id)}
              >
                {/* Column header */}
                <div className={cn(
                  "flex items-center justify-between mb-3 px-1 transition-all",
                )}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                    <span className="text-[12px] font-semibold text-slate-300">{col.label}</span>
                    <span className="text-[10px] bg-white/[0.08] text-slate-400 px-1.5 py-0.5 rounded-full">
                      {leads.length}
                    </span>
                  </div>
                  <button className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-white transition-colors rounded">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Drop zone */}
                <div className={cn(
                  "flex-1 rounded-xl p-2 space-y-2 overflow-y-auto transition-all",
                  isDragTarget
                    ? "bg-white/[0.06] border border-dashed"
                    : "bg-white/[0.02] border border-white/[0.05]",
                )} style={{ borderColor: isDragTarget ? col.color + "60" : undefined }}>
                  {leads.map((lead) => {
                    const score = scoreToLabel(lead.score);
                    return (
                      <motion.div
                        key={lead.id}
                        layout
                        draggable
                        onDragStart={() => onDragStart(lead, col.id)}
                        onDragEnd={() => setDragging(null)}
                        className="glass-card p-3 cursor-grab active:cursor-grabbing hover:border-white/[0.15] transition-all"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <GripVertical className="w-3 h-3 text-slate-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-semibold text-white truncate">{lead.name}</p>
                            <p className="text-[10px] text-slate-500 truncate">{lead.origin}</p>
                          </div>
                          <span className={`text-[10px] ${score.color} shrink-0`}>{score.emoji}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mb-2">{lead.last_message}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            {lead.temperature === "hot" && <Flame className="w-3 h-3 text-red-400" />}
                            <span className={`text-[10px] font-semibold ${score.color}`}>{lead.score}</span>
                          </div>
                          <div className="w-5 h-5 rounded-full bg-white/[0.08] flex items-center justify-center text-[9px] font-bold text-slate-400">
                            {lead.name[0]}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {leads.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-8 text-slate-600">
                      <User className="w-6 h-6 mb-1.5 opacity-50" />
                      <p className="text-[10px]">Sem leads</p>
                    </div>
                  )}
                </div>

                {/* Column total */}
                <div className="mt-2 px-1">
                  <p className="text-[10px] text-slate-600">
                    R$ {(leads.length * 3500).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
