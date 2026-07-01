"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { motion } from "framer-motion";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import { ArrowUpRight, ArrowDownRight, CreditCard, DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle, Plus } from "lucide-react";

type Tab = "Visão Geral" | "Entradas" | "Saídas" | "Assinaturas";
const tabs: Tab[] = ["Visão Geral", "Entradas", "Saídas", "Assinaturas"];

const transactions = [
  { id: "#1084", desc: "Ricardo Pires — Plano Pro", type: "entrada", val: "R$ 197,00", date: "27/06/2026", status: "aprovado", method: "Pix" },
  { id: "#1083", desc: "Ana Paula Ribeiro — Plano Business", type: "entrada", val: "R$ 397,00", date: "27/06/2026", status: "aprovado", method: "Cartão" },
  { id: "#1082", desc: "Servidor AWS — mensal", type: "saida", val: "R$ 312,00", date: "26/06/2026", status: "aprovado", method: "Débito auto" },
  { id: "#1081", desc: "Bruno Mendes — Plano Start", type: "entrada", val: "R$ 97,00", date: "26/06/2026", status: "aprovado", method: "Pix" },
  { id: "#1080", desc: "Gustavo Lima — Plano Pro", type: "entrada", val: "R$ 197,00", date: "25/06/2026", status: "pendente", method: "Boleto" },
  { id: "#1079", desc: "Fernanda Castro — Plano Business", type: "entrada", val: "R$ 397,00", date: "24/06/2026", status: "aprovado", method: "Pix" },
  { id: "#1078", desc: "Evolution API — licença", type: "saida", val: "R$ 149,00", date: "23/06/2026", status: "aprovado", method: "Cartão" },
  { id: "#1077", desc: "Marcos Oliveira — Plano Pro", type: "entrada", val: "R$ 197,00", date: "22/06/2026", status: "recusado", method: "Cartão" },
];

const statusStyle: Record<string, { bg: string; text: string; label: string }> = {
  "aprovado": { bg: "rgba(34,197,94,0.12)", text: "#4ADE80", label: "Aprovado" },
  "pendente":  { bg: "rgba(245,158,11,0.12)", text: "#FCD34D", label: "Pendente" },
  "recusado":  { bg: "rgba(239,68,68,0.12)", text: "#F87171", label: "Recusado" },
};

const mrr = [
  { month: "Jan", val: 4.2 },
  { month: "Fev", val: 5.8 },
  { month: "Mar", val: 7.1 },
  { month: "Abr", val: 9.4 },
  { month: "Mai", val: 12.8 },
  { month: "Jun", val: 16.7 },
];

export default function FinanceiroPage() {
  const [tab, setTab] = useState<Tab>("Visão Geral");

  return (
    <>
      <Topbar
        title="Financeiro"
        subtitle="Caixa, MRR e transações"
        action={{ label: "Nova transação" }}
      />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* KPIs */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "MRR", val: "R$ 16.741", change: "+23%", up: true, icon: TrendingUp, color: "#22C55E", sub: "Receita mensal recorrente" },
            { label: "ARR", val: "R$ 200.892", change: "+31%", up: true, icon: DollarSign, color: "#7C3AED", sub: "Receita anual recorrente" },
            { label: "Churn", val: "2,3%", change: "-0,8pts", up: true, icon: ArrowDownRight, color: "#3B82F6", sub: "Taxa de cancelamento" },
            { label: "LTV médio", val: "R$ 4.182", change: "+12%", up: true, icon: CreditCard, color: "#F59E0B", sub: "Valor vitalício do cliente" },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, ease: EASE }}
                className="rounded-2xl p-5"
                style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
                whileHover={{ y: -3 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-[12px] text-[#6B7280]">{kpi.label}</div>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}18`, border: `1px solid ${kpi.color}30` }}>
                    <Icon size={14} style={{ color: kpi.color }} />
                  </div>
                </div>
                <div className="text-[24px] font-black tracking-tight leading-none mb-1.5">{kpi.val}</div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: kpi.up ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: kpi.up ? "#22C55E" : "#EF4444" }}>
                    {kpi.change}
                  </span>
                </div>
                <div className="text-[11px] text-[#4B5563] mt-1">{kpi.sub}</div>
              </motion.div>
            );
          })}
        </div>

        {/* MRR Chart + quick stats */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ease: EASE }}
            className="col-span-2 rounded-2xl p-6"
            style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[14px] font-bold text-white">Crescimento do MRR</div>
                <div className="text-[12px] text-[#6B7280]">Últimos 6 meses</div>
              </div>
              <div className="text-right">
                <div className="text-[20px] font-black">R$ 16.741</div>
                <div className="text-[11px] text-[#22C55E]">▲ +23% vs mês anterior</div>
              </div>
            </div>
            <div className="flex items-end gap-3 h-40">
              {mrr.map((m, i) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="relative w-full" style={{ height: `${(m.val / 16.7) * 130}px` }}>
                    <div
                      className="w-full h-full rounded-t-xl"
                      style={{
                        background: i === mrr.length - 1 ? "#7C3AED" : `rgba(124,58,237,${0.2 + i * 0.1})`,
                      }}
                    />
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#18181B] border border-white/10 rounded-lg px-2 py-0.5 text-[10px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      R$ {m.val}k
                    </div>
                  </div>
                  <div className="text-[10px] text-[#6B7280]">{m.month}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, ease: EASE }}
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="text-[14px] font-bold text-white">Este mês</div>
            {[
              { label: "Receitas", val: "R$ 18.922", icon: ArrowUpRight, color: "#22C55E" },
              { label: "Despesas", val: "R$ 2.181", icon: ArrowDownRight, color: "#EF4444" },
              { label: "Lucro líquido", val: "R$ 16.741", icon: TrendingUp, color: "#7C3AED" },
              { label: "A receber", val: "R$ 1.194", icon: Clock, color: "#F59E0B" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}>
                      <Icon size={13} style={{ color: s.color }} />
                    </div>
                    <span className="text-[13px] text-[#9CA3AF]">{s.label}</span>
                  </div>
                  <span className="text-[13px] font-bold text-white">{s.val}</span>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
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
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7C3AED] text-white text-[12px] font-semibold rounded-xl hover:bg-[#8B5CF6] transition-colors">
              <Plus size={12} /> Lançar
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
            <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3 bg-[#0C0C10] border-b border-white/[0.06]">
              {["#","Descrição","Valor","Data","Método","Status"].map(h => (
                <div key={h} className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-[0.5px]">{h}</div>
              ))}
            </div>
            {transactions.map((t, i) => {
              const st = statusStyle[t.status];
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr] gap-4 px-5 py-3.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer items-center"
                >
                  <div className="text-[11px] text-[#4B5563] font-mono">{t.id}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.type === "entrada" ? "#22C55E" : "#EF4444" }} />
                    <span className="text-[13px] text-[#9CA3AF] truncate">{t.desc}</span>
                  </div>
                  <div className="text-[13px] font-bold" style={{ color: t.type === "entrada" ? "#4ADE80" : "#F87171" }}>
                    {t.type === "entrada" ? "+" : "-"}{t.val}
                  </div>
                  <div className="text-[12px] text-[#6B7280]">{t.date}</div>
                  <div className="text-[12px] text-[#6B7280]">{t.method}</div>
                  <div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.text }}>
                      {t.status === "aprovado" ? <CheckCircle className="inline w-2.5 h-2.5 mr-0.5" /> : <AlertCircle className="inline w-2.5 h-2.5 mr-0.5" />}
                      {st.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </main>
    </>
  );
}
