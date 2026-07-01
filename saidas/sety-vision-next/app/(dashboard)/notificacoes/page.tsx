"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import {
  TrendingUp, Users, CreditCard, MessageSquare, Brain, Bell,
  ShoppingBag, AlertCircle, CheckCircle, X, Settings, BellOff
} from "lucide-react";

type FilterType = "Todos" | "Vendas" | "Leads" | "Pagamentos" | "IA" | "Sistema";

const filters: FilterType[] = ["Todos", "Vendas", "Leads", "Pagamentos", "IA", "Sistema"];

const notifications = [
  {
    id: 1, type: "Vendas", read: false, time: "agora mesmo",
    icon: TrendingUp, color: "#22C55E",
    title: "Nova venda realizada",
    desc: "Ricardo Pires assinou o plano Pro — R$ 197,00/mês",
    badge: "R$ 197",
  },
  {
    id: 2, type: "Leads", read: false, time: "há 3 min",
    icon: Users, color: "#7C3AED",
    title: "Novo lead via WhatsApp",
    desc: "Ana Paula Ribeiro enviou mensagem: 'Quero saber sobre o sistema'",
    badge: "Lead quente",
  },
  {
    id: 3, type: "Pagamentos", read: false, time: "há 8 min",
    icon: CreditCard, color: "#3B82F6",
    title: "Pagamento aprovado",
    desc: "Bruno Mendes — Pix R$ 97,00 confirmado automaticamente",
    badge: "R$ 97",
  },
  {
    id: 4, type: "IA", read: false, time: "há 12 min",
    icon: Brain, color: "#A78BFA",
    title: "IA qualificou 14 leads",
    desc: "O agente analisou e classificou 14 novos contatos do WhatsApp automaticamente",
    badge: "Automático",
  },
  {
    id: 5, type: "Vendas", read: true, time: "há 24 min",
    icon: ShoppingBag, color: "#22C55E",
    title: "Meta diária atingida",
    desc: "Você atingiu R$ 1.200 em vendas hoje — 120% da meta diária",
    badge: "Meta ✓",
  },
  {
    id: 6, type: "Leads", read: true, time: "há 41 min",
    icon: MessageSquare, color: "#F59E0B",
    title: "Carrinho abandonado recuperado",
    desc: "Fernanda Castro voltou e finalizou a compra após mensagem automática da IA",
    badge: "Recuperado",
  },
  {
    id: 7, type: "Pagamentos", read: true, time: "há 1h",
    icon: CreditCard, color: "#3B82F6",
    title: "Pagamento recusado",
    desc: "Gustavo Lima — cartão recusado. IA enviou link alternativo por WhatsApp",
    badge: "Pendente",
  },
  {
    id: 8, type: "IA", read: true, time: "há 2h",
    icon: Brain, color: "#A78BFA",
    title: "Relatório semanal gerado",
    desc: "Seu relatório de performance da semana está pronto. ROAS médio: 4,7x",
    badge: "Relatório",
  },
  {
    id: 9, type: "Sistema", read: true, time: "há 3h",
    icon: CheckCircle, color: "#22C55E",
    title: "WhatsApp reconectado",
    desc: "Número +55 11 9876-5432 reconectado com sucesso após atualização",
    badge: "Sistema",
  },
  {
    id: 10, type: "Vendas", read: true, time: "ontem 18:42",
    icon: TrendingUp, color: "#22C55E",
    title: "Venda de alto valor",
    desc: "Clínica Bella Vita fechou plano Business — R$ 397,00/mês",
    badge: "R$ 397",
  },
  {
    id: 11, type: "Leads", read: true, time: "ontem 15:30",
    icon: Users, color: "#7C3AED",
    title: "47 novos leads via Google Ads",
    desc: "Campanha 'Gestão Profissional' gerou 47 leads hoje com CPL de R$ 4,20",
    badge: "47 leads",
  },
  {
    id: 12, type: "Sistema", read: true, time: "ontem 09:00",
    icon: AlertCircle, color: "#F59E0B",
    title: "Backup automático realizado",
    desc: "Backup completo da base de dados realizado com sucesso — 847 MB",
    badge: "Backup",
  },
];

const typeColor: Record<string, string> = {
  "Vendas":    "#22C55E",
  "Leads":     "#7C3AED",
  "Pagamentos":"#3B82F6",
  "IA":        "#A78BFA",
  "Sistema":   "#F59E0B",
};

export default function NotificacoesPage() {
  const [filter, setFilter] = useState<FilterType>("Todos");
  const [items, setItems] = useState(notifications);

  const visible = filter === "Todos" ? items : items.filter(n => n.type === filter);
  const unread = items.filter(n => !n.read).length;

  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id: number) => setItems(prev => prev.filter(n => n.id !== id));
  const markRead = (id: number) => setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <>
      <Topbar
        title="Notificações"
        subtitle={unread > 0 ? `${unread} não lidas` : "Tudo em dia"}
        action={{ label: "Marcar tudo como lido" }}
      />

      <main className="flex-1 overflow-y-auto p-6">

        {/* Header row */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl text-[12px] font-medium transition-all border cursor-pointer ${
                  filter === f
                    ? "bg-[rgba(124,58,237,0.15)] text-[#A78BFA] border-[rgba(124,58,237,0.3)]"
                    : "text-[#6B7280] border-white/[0.06] hover:text-white hover:border-white/10 bg-transparent"
                }`}
              >
                {f}
                {f !== "Todos" && (
                  <span className="ml-1.5 text-[10px]">
                    {items.filter(n => n.type === f && !n.read).length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: typeColor[f] }} />
                    )}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-[12px] text-[#6B7280] hover:text-white transition-colors px-3 py-1.5 rounded-xl border border-white/[0.06] hover:border-white/10"
            >
              <CheckCircle size={13} />
              Marcar todas como lidas
            </button>
            <a href="/configuracoes" className="flex items-center gap-1.5 text-[12px] text-[#6B7280] hover:text-white transition-colors px-3 py-1.5 rounded-xl border border-white/[0.06] hover:border-white/10">
              <Settings size={13} />
              Preferências
            </a>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {[
            { label: "Vendas hoje", val: "R$ 1.891", color: "#22C55E", icon: TrendingUp },
            { label: "Novos leads", val: "23", color: "#7C3AED", icon: Users },
            { label: "Pagamentos", val: "11 aprovados", color: "#3B82F6", icon: CreditCard },
            { label: "IA ativa", val: "96% uptime", color: "#A78BFA", icon: Brain },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                  <Icon size={14} style={{ color: s.color }} />
                </div>
                <div>
                  <div className="text-[18px] font-black tracking-tight">{s.val}</div>
                  <div className="text-[11px] text-[#6B7280]">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notification list */}
        <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
          <AnimatePresence>
            {visible.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <BellOff size={32} className="text-[#4B5563] mb-3" />
                <div className="text-[14px] text-[#6B7280]">Nenhuma notificação nesta categoria</div>
              </div>
            ) : (
              visible.map((n, i) => {
                const Icon = n.icon;
                return (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.03, duration: 0.3, ease: EASE }}
                    onClick={() => markRead(n.id)}
                    className={`flex items-start gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 transition-colors cursor-pointer group ${
                      n.read ? "bg-transparent hover:bg-white/[0.01]" : "bg-[rgba(124,58,237,0.04)] hover:bg-[rgba(124,58,237,0.06)]"
                    }`}
                  >
                    {/* Unread dot */}
                    <div className="flex-shrink-0 mt-1">
                      {!n.read ? (
                        <div className="w-2 h-2 rounded-full mt-0.5" style={{ background: n.color }} />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-transparent" />
                      )}
                    </div>

                    {/* Icon */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${n.color}15`, border: `1px solid ${n.color}25` }}>
                      <Icon size={15} style={{ color: n.color }} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className={`text-[13px] font-semibold mb-0.5 ${n.read ? "text-[#9CA3AF]" : "text-white"}`}>{n.title}</div>
                          <div className="text-[12px] text-[#6B7280] leading-[1.5] truncate">{n.desc}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${n.color}15`, color: n.color }}>
                            {n.badge}
                          </span>
                          <span className="text-[10px] text-[#4B5563] whitespace-nowrap">{n.time}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                            className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg bg-white/[0.04] flex items-center justify-center text-[#6B7280] hover:text-white transition-all"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

        {/* Push notification promo */}
        <div
          className="mt-4 rounded-2xl p-5 flex items-center gap-4"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.05))", border: "1px solid rgba(124,58,237,0.15)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-[rgba(124,58,237,0.15)] flex items-center justify-center flex-shrink-0">
            <Bell size={18} className="text-[#A78BFA]" />
          </div>
          <div className="flex-1">
            <div className="text-[14px] font-semibold text-white mb-0.5">Ative notificações push no celular</div>
            <div className="text-[12px] text-[#6B7280]">Receba alertas de vendas em tempo real no seu iPhone ou Android</div>
          </div>
          <button className="flex-shrink-0 px-4 py-2 bg-[#7C3AED] text-white text-[12px] font-semibold rounded-xl hover:bg-[#8B5CF6] transition-colors">
            Ativar
          </button>
        </div>

      </main>
    </>
  );
}
