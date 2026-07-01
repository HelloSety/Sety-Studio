"use client";

import { Topbar } from "@/app/components/dashboard/Topbar";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { EASE } from "@/lib/motion";
import { BrandLogo } from "@/app/components/ui/BrandLogo";
import { Modal } from "@/app/components/ui/Modal";
import { useToast } from "@/app/components/ui/Toast";
import {
  CheckCircle, XCircle, AlertCircle, RefreshCw, Zap, Plus,
  Shield, Activity, Clock, ChevronRight, X, Lock, Globe,
  TrendingUp, BarChart3, ShoppingCart, MessageSquare,
  Package, ExternalLink, Copy, Wifi, QrCode
} from "lucide-react";

type Category = "Todas" | "Marketing" | "E-commerce" | "Pagamentos" | "WhatsApp" | "ERP" | "Logística";
const categories: Category[] = ["Todas", "Marketing", "E-commerce", "Pagamentos", "WhatsApp", "ERP", "Logística"];

type Status = "conectada" | "desconectada" | "erro" | "sincronizando";

interface Integration {
  id: string; name: string; category: Category; status: Status;
  description: string; lastSync?: string; health?: number;
  apiUsage?: string; auth: string; color: string; bg: string;
  metrics?: { label: string; val: string; color: string }[];
}

const initialIntegrations: Integration[] = [
  { id: "meta", name: "Meta Ads", category: "Marketing", status: "conectada", description: "Facebook Ads + Instagram Ads. Campanhas, criativos, ROAS, conversões e públicos.", lastSync: "há 2 min", health: 98, apiUsage: "12.4k / 100k req", auth: "OAuth 2.0", color: "#1877F2", bg: "#1877F210", metrics: [{ label: "ROAS", val: "4,7x", color: "#22C55E" }, { label: "Invest.", val: "R$ 4.200", color: "#3B82F6" }, { label: "Leads", val: "347", color: "#A78BFA" }, { label: "CTR", val: "2,3%", color: "#F59E0B" }] },
  { id: "google", name: "Google Ads", category: "Marketing", status: "conectada", description: "Google Ads, Analytics 4, Search Console, Tag Manager e Business Profile.", lastSync: "há 5 min", health: 100, apiUsage: "8.1k / 50k req", auth: "OAuth 2.0", color: "#4285F4", bg: "#4285F410", metrics: [{ label: "Conversões", val: "94", color: "#22C55E" }, { label: "CPC", val: "R$ 1,48", color: "#3B82F6" }, { label: "Impressões", val: "48.2k", color: "#A78BFA" }, { label: "CPL", val: "R$ 10,50", color: "#F59E0B" }] },
  { id: "whatsapp", name: "WhatsApp", category: "WhatsApp", status: "desconectada", description: "Mensagens, contatos, templates e histórico. Conecte via QR Code com o Sety Server.", auth: "QR Code", color: "#25D366", bg: "#25D36610" },
  { id: "tiktok", name: "TikTok Ads", category: "Marketing", status: "desconectada", description: "Campanhas, criativos, Pixel, ROAS, conversões e investimento.", auth: "OAuth 2.0", color: "#010101", bg: "#ffffff08" },
  { id: "shopify", name: "Shopify", category: "E-commerce", status: "conectada", description: "Produtos, pedidos, clientes, estoque, pagamentos e carrinhos em tempo real.", lastSync: "há 1 min", health: 97, apiUsage: "22.7k / 200k req", auth: "OAuth 2.0", color: "#96BF48", bg: "#96BF4810", metrics: [{ label: "Pedidos", val: "182", color: "#22C55E" }, { label: "Receita", val: "R$ 38.4k", color: "#3B82F6" }, { label: "Ticket", val: "R$ 211", color: "#A78BFA" }, { label: "Estoque", val: "1.240", color: "#F59E0B" }] },
  { id: "nuvemshop", name: "Nuvemshop", category: "E-commerce", status: "desconectada", description: "Produtos, pedidos, clientes, categorias, estoque e pagamentos.", auth: "Token", color: "#00A6FF", bg: "#00A6FF10" },
  { id: "woocommerce", name: "WooCommerce", category: "E-commerce", status: "desconectada", description: "Integração completa via API REST. Produtos, pedidos, clientes e estoque.", auth: "API Key", color: "#96588A", bg: "#96588A10" },
  { id: "mercadolivre", name: "Mercado Livre", category: "E-commerce", status: "erro", description: "Produtos, pedidos, perguntas, mensagens e estoque.", lastSync: "erro há 3h", health: 0, apiUsage: "—", auth: "OAuth 2.0", color: "#FFE600", bg: "#FFE60010" },
  { id: "shopee", name: "Shopee", category: "E-commerce", status: "desconectada", description: "Pedidos, produtos, estoque e gestão de clientes.", auth: "API Key", color: "#EE4D2D", bg: "#EE4D2D10" },
  { id: "amazon", name: "Amazon", category: "E-commerce", status: "desconectada", description: "Pedidos, produtos, receita e gestão de vendas.", auth: "API Key", color: "#FF9900", bg: "#FF990010" },
  { id: "stripe", name: "Stripe", category: "Pagamentos", status: "desconectada", description: "Assinaturas, pagamentos, receitas e reembolsos.", auth: "API Key", color: "#635BFF", bg: "#635BFF10" },
  { id: "mercadopago", name: "Mercado Pago", category: "Pagamentos", status: "conectada", description: "Pix, boletos, cartões, assinaturas e receitas em tempo real.", lastSync: "há 4 min", health: 99, apiUsage: "5.2k / 100k req", auth: "OAuth 2.0", color: "#009EE3", bg: "#009EE310", metrics: [{ label: "Transações", val: "94", color: "#22C55E" }, { label: "Receita", val: "R$ 18.9k", color: "#3B82F6" }, { label: "Pix", val: "71%", color: "#A78BFA" }, { label: "Taxa", val: "2,49%", color: "#F59E0B" }] },
  { id: "asaas", name: "Asaas", category: "Pagamentos", status: "desconectada", description: "Cobranças, Pix, boletos e assinaturas recorrentes.", auth: "API Key", color: "#00A7A7", bg: "#00A7A710" },
  { id: "bling", name: "Bling ERP", category: "ERP", status: "desconectada", description: "ERP completo: pedidos, produtos, financeiro, fiscal e estoque.", auth: "OAuth 2.0", color: "#E37B1F", bg: "#E37B1F10" },
  { id: "tiny", name: "Tiny ERP", category: "ERP", status: "sincronizando", description: "Sincronização completa: pedidos, notas, estoque e financeiro.", lastSync: "sincronizando...", health: 85, apiUsage: "1.2k / 30k req", auth: "Token", color: "#3B8BD6", bg: "#3B8BD610" },
  { id: "melhorenvio", name: "Melhor Envio", category: "Logística", status: "desconectada", description: "Fretes, etiquetas e rastreamento de envios.", auth: "OAuth 2.0", color: "#2563EB", bg: "#2563EB10" },
  { id: "correios", name: "Correios", category: "Logística", status: "desconectada", description: "Envios e rastreamento via API dos Correios.", auth: "API Key", color: "#F5A623", bg: "#F5A62310" },
];

const statusConfig: Record<Status, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  conectada:    { label: "Conectada", color: "#22C55E", bg: "rgba(34,197,94,0.12)", icon: CheckCircle },
  desconectada: { label: "Desconectada", color: "#6B7280", bg: "rgba(107,114,128,0.12)", icon: X },
  erro:         { label: "Erro", color: "#EF4444", bg: "rgba(239,68,68,0.12)", icon: XCircle },
  sincronizando:{ label: "Sincronizando", color: "#F59E0B", bg: "rgba(245,158,11,0.12)", icon: RefreshCw },
};

const aiInsights = [
  { icon: TrendingUp, text: "Seu ROAS caiu 18% nos últimos 7 dias. Criativos de vídeo performam 2x melhor que imagem.", color: "#EF4444", priority: "alta" },
  { icon: ShoppingCart, text: "Aumento de 23% no abandono de carrinho. IA enviou recuperação automática para 47 clientes.", color: "#F59E0B", priority: "média" },
  { icon: MessageSquare, text: "Atendimento via IA converte 32% mais que manual. Habilite Piloto Automático.", color: "#22C55E", priority: "oportunidade" },
  { icon: Package, text: "Produto 'Kit Premium' terminará o estoque em aprox. 4 dias. Reabastecer agora.", color: "#F59E0B", priority: "média" },
  { icon: BarChart3, text: "Clientes do Instagram têm ticket médio 47% maior. Aumente investimento nessa plataforma.", color: "#A78BFA", priority: "oportunidade" },
  { icon: Clock, text: "A maioria das vendas ocorre entre 19h e 22h. Programe campanhas para esse horário.", color: "#3B82F6", priority: "dica" },
];

// QR code mock (SVG pattern)
function QRMock() {
  const cells = Array.from({ length: 7 }, (_, r) =>
    Array.from({ length: 7 }, (_, c) => {
      const corner = (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2);
      const inner = r > 0 && r < 6 && c > 0 && c < 6 && Math.random() > 0.5;
      return corner || inner;
    })
  );
  return (
    <div className="grid gap-0.5 p-3 rounded-xl bg-white" style={{ gridTemplateColumns: "repeat(7,1fr)", width: 90, height: 90 }}>
      {cells.flat().map((on, i) => (
        <div key={i} className="rounded-[1px]" style={{ background: on ? "#000" : "#fff", aspectRatio: "1" }} />
      ))}
    </div>
  );
}

export default function IntegracoesPage() {
  const { success, error: toastError, info, warning } = useToast();
  const [category, setCategory] = useState<Category>("Todas");
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [selected, setSelected] = useState<Integration | null>(null);
  const [connectModal, setConnectModal] = useState<Integration | null>(null);
  const [connectStep, setConnectStep] = useState(0);
  const [apiKey, setApiKey] = useState("");
  const [syncing, setSyncing] = useState<string | null>(null);
  const [revokeModal, setRevokeModal] = useState<Integration | null>(null);

  const filtered = category === "Todas" ? integrations : integrations.filter(i => i.category === category);
  const connected = integrations.filter(i => i.status === "conectada").length;
  const withErrors = integrations.filter(i => i.status === "erro").length;

  const startConnect = (integ: Integration) => {
    setConnectModal(integ);
    setConnectStep(0);
    setApiKey("");
  };

  const finishConnect = (integ: Integration) => {
    setIntegrations(prev => prev.map(i =>
      i.id === integ.id ? { ...i, status: "sincronizando" as Status, lastSync: "sincronizando..." } : i
    ));
    setConnectModal(null);
    info("Conectando...", `Sincronizando dados do ${integ.name}`);
    setTimeout(() => {
      setIntegrations(prev => prev.map(i =>
        i.id === integ.id ? {
          ...i, status: "conectada" as Status,
          lastSync: "há 1 min", health: 98, apiUsage: "0 / req"
        } : i
      ));
      success(`${integ.name} conectado!`, "Dados sendo sincronizados em tempo real");
    }, 2500);
  };

  const handleSync = (id: string, name: string) => {
    setSyncing(id);
    info("Sincronizando...", `Atualizando dados do ${name}`);
    setTimeout(() => {
      setSyncing(null);
      setIntegrations(prev => prev.map(i => i.id === id ? { ...i, lastSync: "agora mesmo" } : i));
      success("Sincronizado!", "Todos os dados estão atualizados");
    }, 2000);
  };

  const handleRevoke = (integ: Integration) => {
    setIntegrations(prev => prev.map(i =>
      i.id === integ.id ? { ...i, status: "desconectada" as Status, lastSync: undefined, health: undefined, metrics: undefined } : i
    ));
    setRevokeModal(null);
    setSelected(null);
    warning(`${integ.name} desconectado`, "Acesso revogado com sucesso");
  };

  const handleReconnect = (integ: Integration) => {
    setIntegrations(prev => prev.map(i =>
      i.id === integ.id ? { ...i, status: "sincronizando" as Status, lastSync: "reconectando..." } : i
    ));
    info("Reconectando...", `Tentando restaurar conexão com ${integ.name}`);
    setTimeout(() => {
      setIntegrations(prev => prev.map(i =>
        i.id === integ.id ? { ...i, status: "conectada" as Status, lastSync: "há 1 min", health: 94 } : i
      ));
      success(`${integ.name} reconectado!`, "Conexão restaurada com sucesso");
    }, 2000);
  };

  const handleCopyUrl = () => {
    success("Webhook copiado!", "URL copiada para a área de transferência");
  };

  return (
    <>
      <Topbar title="Integrações" subtitle="Hub Operacional — Todas as ferramentas em um lugar" action={{ label: "Explorar" }} />

      <main className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Conectadas", val: connected.toString(), color: "#22C55E", icon: CheckCircle },
            { label: "Disponíveis", val: integrations.length.toString(), color: "#7C3AED", icon: Globe },
            { label: "Com erro", val: withErrors.toString(), color: "#EF4444", icon: AlertCircle },
            { label: "Segurança", val: "AES-256", color: "#3B82F6", icon: Shield },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: EASE }}
                className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}
                whileHover={{ y: -2 }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
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

        {/* AI Insights */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ease: EASE }}
          className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(59,130,246,0.04))", border: "1px solid rgba(124,58,237,0.2)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={15} className="text-[#A78BFA]" />
            <span className="text-[13px] font-bold text-white">Hub de Dados — Insights da IA</span>
            <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(124,58,237,0.15)] text-[#A78BFA]">Tempo real</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {aiInsights.map((insight, i) => {
              const Icon = insight.icon;
              const priorityBg = insight.priority === "alta" ? "rgba(239,68,68,0.1)" : insight.priority === "oportunidade" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)";
              const priorityColor = insight.priority === "alta" ? "#F87171" : insight.priority === "oportunidade" ? "#4ADE80" : insight.priority === "dica" ? "#60A5FA" : "#FCD34D";
              return (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.04, ease: EASE }}
                  className="flex items-start gap-3 p-3 rounded-xl cursor-pointer group hover:bg-white/[0.03] transition-colors"
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)" }}
                  onClick={() => info("Analisando insight...", insight.text)}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${insight.color}15` }}>
                    <Icon size={13} style={{ color: insight.color }} />
                  </div>
                  <p className="flex-1 text-[12px] text-[#D1D5DB] leading-[1.5]">{insight.text}</p>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full capitalize flex-shrink-0" style={{ background: priorityBg, color: priorityColor }}>
                    {insight.priority}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Category tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3.5 py-1.5 rounded-xl text-[12px] font-medium transition-all border cursor-pointer ${category === c ? "bg-[rgba(124,58,237,0.15)] text-[#A78BFA] border-[rgba(124,58,237,0.3)]" : "text-[#6B7280] border-white/[0.06] hover:text-white hover:border-white/10 bg-transparent"}`}>
              {c}
              {c !== "Todas" && <span className="ml-1.5 text-[10px] opacity-60">{integrations.filter(i => i.category === c).length}</span>}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((integ, i) => {
            const st = statusConfig[integ.status];
            const StatusIcon = st.icon;
            const isConnected = integ.status === "conectada";
            const isSyncing = syncing === integ.id || integ.status === "sincronizando";

            return (
              <motion.div key={integ.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, ease: EASE }}
                className="rounded-2xl overflow-hidden group cursor-pointer"
                style={{ background: "#111114", border: `1px solid ${isConnected ? `${integ.color}25` : "rgba(255,255,255,0.06)"}` }}
                whileHover={{ y: -2, boxShadow: `0 16px 40px rgba(0,0,0,0.35)` }}
                onClick={() => isConnected && setSelected(integ)}>
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: integ.bg, border: `1px solid ${integ.color}30` }}>
                        <BrandLogo brand={integ.name} size={22} />
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-white">{integ.name}</div>
                        <div className="text-[10px] text-[#6B7280] mt-0.5">{integ.category} · {integ.auth}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                      style={{ background: st.bg, color: st.color }}>
                      <StatusIcon size={9} className={isSyncing ? "animate-spin" : ""} />
                      {st.label}
                    </span>
                  </div>

                  <p className="text-[12px] text-[#6B7280] leading-[1.5] mb-4">{integ.description}</p>

                  {/* Metrics */}
                  {isConnected && integ.metrics && (
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {integ.metrics.map(m => (
                        <div key={m.label} className="text-center">
                          <div className="text-[12px] font-bold" style={{ color: m.color }}>{m.val}</div>
                          <div className="text-[9px] text-[#4B5563]">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Health */}
                  {isConnected && integ.health !== undefined && (
                    <div className="mb-4">
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-[#6B7280]">Saúde</span>
                        <span style={{ color: integ.health > 90 ? "#22C55E" : "#F59E0B" }}>{integ.health}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full" style={{ width: `${integ.health}%`, background: integ.health > 90 ? "#22C55E" : "#F59E0B" }} />
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {integ.lastSync && <div className="flex items-center gap-1 text-[10px] text-[#4B5563]"><Clock size={9} />{integ.lastSync}</div>}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {integ.status === "erro" && (
                        <button onClick={() => handleReconnect(integ)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors bg-[rgba(239,68,68,0.1)] text-[#F87171] hover:bg-[rgba(239,68,68,0.2)]">
                          <RefreshCw size={9} /> Reconectar
                        </button>
                      )}
                      {integ.status === "desconectada" && (
                        <button onClick={() => startConnect(integ)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[#7C3AED] text-white hover:bg-[#8B5CF6] transition-colors">
                          <Plus size={9} /> Conectar
                        </button>
                      )}
                      {isConnected && (
                        <>
                          <button onClick={() => handleSync(integ.id, integ.name)}
                            className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#6B7280] hover:text-white transition-all"
                            title="Sincronizar">
                            <RefreshCw size={11} className={syncing === integ.id ? "animate-spin" : ""} />
                          </button>
                          <button onClick={() => setSelected(integ)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] text-[#9CA3AF] text-[10px] hover:bg-white/[0.08] hover:text-white transition-all">
                            <Activity size={9} /> Detalhes
                          </button>
                        </>
                      )}
                      <button className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#6B7280] hover:text-white transition-all">
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Security banner */}
        <div className="rounded-2xl p-5 flex items-center gap-5 flex-wrap" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-10 h-10 rounded-xl bg-[rgba(59,130,246,0.1)] flex items-center justify-center flex-shrink-0">
            <Lock size={18} className="text-[#60A5FA]" />
          </div>
          <div className="flex-1 min-w-[200px]">
            <div className="text-[14px] font-bold text-white mb-0.5">Segurança de nível enterprise</div>
            <div className="text-[12px] text-[#6B7280]">OAuth 2.0 · AES-256 · Refresh Token automático · Zero exposição de credenciais</div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {["OAuth 2.0", "AES-256", "Zero Trust", "Audit Log"].map(tag => (
              <span key={tag} className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-[rgba(59,130,246,0.1)] text-[#60A5FA] border border-[rgba(59,130,246,0.2)] cursor-pointer hover:bg-[rgba(59,130,246,0.2)] transition-colors"
                onClick={() => info("Segurança", `${tag} está ativo em todas as integrações`)}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* --- DETAIL DRAWER --- */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40" onClick={() => setSelected(null)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 h-full w-full max-w-md z-50 overflow-y-auto"
              style={{ background: "#0C0C10", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: selected.bg, border: `1px solid ${selected.color}30` }}>
                      <BrandLogo brand={selected.name} size={22} />
                    </div>
                    <div>
                      <div className="text-[16px] font-bold text-white">{selected.name}</div>
                      <div className="text-[11px] text-[#6B7280]">{selected.category} · {selected.auth}</div>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-[#6B7280] hover:text-white transition-all">
                    <X size={14} />
                  </button>
                </div>

                {selected.health !== undefined && (
                  <div className="rounded-2xl p-4 space-y-3" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider">Status da Conexão</div>
                    {[
                      { label: "Última sync", val: selected.lastSync ?? "—" },
                      { label: "Uso de API", val: selected.apiUsage ?? "—" },
                      { label: "Saúde", val: `${selected.health}%` },
                      { label: "Autenticação", val: selected.auth },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between text-[13px]">
                        <span className="text-[#6B7280]">{row.label}</span>
                        <span className="text-white font-medium">{row.val}</span>
                      </div>
                    ))}
                  </div>
                )}

                {selected.metrics && (
                  <div className="rounded-2xl p-4" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Métricas</div>
                    <div className="grid grid-cols-2 gap-3">
                      {selected.metrics.map(m => (
                        <div key={m.label} className="rounded-xl p-3" style={{ background: "#18181B" }}>
                          <div className="text-[18px] font-black" style={{ color: m.color }}>{m.val}</div>
                          <div className="text-[11px] text-[#6B7280]">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-2xl p-4 space-y-2" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Webhook URL</div>
                  <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: "#18181B" }}>
                    <code className="text-[11px] text-[#A78BFA] flex-1 truncate">https://api.setyvision.com/wh/{selected.id}</code>
                    <button onClick={handleCopyUrl} className="flex-shrink-0 text-[#6B7280] hover:text-white transition-colors"><Copy size={12} /></button>
                  </div>
                </div>

                <div className="rounded-2xl p-4 space-y-2" style={{ background: "#111114", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider mb-3">Histórico de Sincronizações</div>
                  {["há 2 min — 847 registros", "há 17 min — 203 registros", "há 32 min — 1.204 registros", "há 1h — 892 registros"].map((log, i) => (
                    <div key={i} className="flex items-center gap-2 text-[12px]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] flex-shrink-0" />
                      <span className="text-[#6B7280] flex-1">{log}</span>
                      <CheckCircle size={10} className="text-[#22C55E]" />
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleSync(selected.id, selected.name)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[rgba(255,255,255,0.04)] text-[#9CA3AF] text-[12px] font-semibold rounded-xl hover:bg-white/[0.08] transition-colors border border-white/[0.06]">
                    <RefreshCw size={12} /> Sincronizar agora
                  </button>
                  <button onClick={() => setRevokeModal(selected)}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-[rgba(239,68,68,0.08)] text-[#F87171] text-[12px] font-semibold rounded-xl hover:bg-[rgba(239,68,68,0.15)] transition-colors border border-[rgba(239,68,68,0.15)]">
                    <XCircle size={12} /> Revogar
                  </button>
                  <button className="px-4 py-2.5 bg-white/[0.04] text-[#6B7280] text-[12px] rounded-xl hover:bg-white/[0.08] transition-colors border border-white/[0.06]">
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- CONNECT MODAL --- */}
      <Modal
        open={!!connectModal}
        onClose={() => setConnectModal(null)}
        title={connectModal ? `Conectar ${connectModal.name}` : ""}
        subtitle={connectModal?.auth}
        size="md"
      >
        {connectModal && (
          <div className="space-y-5">
            {/* Brand header */}
            <div className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: connectModal.bg, border: `1px solid ${connectModal.color}20` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${connectModal.color}20` }}>
                <BrandLogo brand={connectModal.name} size={28} />
              </div>
              <div>
                <div className="text-[14px] font-bold text-white">{connectModal.name}</div>
                <div className="text-[12px] text-[#6B7280]">{connectModal.description}</div>
              </div>
            </div>

            {/* WhatsApp — Wizard 3 passos (Sety Server) */}
            {connectModal.id === "whatsapp" && (
              <div className="space-y-5">
                {/* Step indicator */}
                <div className="flex items-center gap-2">
                  {[0,1,2].map(n => (
                    <div key={n} className="flex items-center gap-2 flex-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${connectStep >= n ? "bg-[#25D366] text-white" : "bg-white/[0.08] text-[#4B5563]"}`}>{n+1}</div>
                      {n < 2 && <div className="flex-1 h-0.5 rounded" style={{ background: connectStep > n ? "#25D366" : "rgba(255,255,255,0.08)" }} />}
                    </div>
                  ))}
                  <span className="text-[11px] text-[#4B5563] shrink-0">Passo {connectStep+1} de 3</span>
                </div>

                {/* Passo 1: Iniciar Sety Server */}
                {connectStep === 0 && (
                  <div className="space-y-4">
                    <div>
                      <div className="text-[15px] font-bold text-white mb-1">Inicie o Sety Server</div>
                      <div className="text-[12px] text-[#6B7280]">O Sety Server é um programa gratuito que roda no seu PC e conecta o WhatsApp ao sistema.</div>
                    </div>
                    <div className="p-4 rounded-2xl space-y-3" style={{ background: "rgba(37,211,102,0.05)", border: "1px solid rgba(37,211,102,0.15)" }}>
                      <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "#0C0C10", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="w-9 h-9 rounded-lg bg-[rgba(37,211,102,0.15)] flex items-center justify-center shrink-0 text-[16px]">📁</div>
                        <div>
                          <div className="text-[13px] font-semibold text-white">iniciar.bat</div>
                          <div className="text-[10px] text-[#25D366] flex items-center gap-1"><ChevronRight size={9} /> Duplo clique para iniciar o Sety Server</div>
                        </div>
                      </div>
                      {["Abra a pasta sety-server no Explorer", "Dê duplo clique no arquivo iniciar.bat — uma janela preta vai abrir", "Aguarde até aparecer \"Sety Server rodando em localhost:3007\""].map((step, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-[rgba(37,211,102,0.2)] text-[#25D366] text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</div>
                          <span className="text-[12px] text-[#9CA3AF]">{step}</span>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
                      <span className="text-[14px] shrink-0">⚠️</span>
                      <span className="text-[11px] text-[#FCD34D]"><strong>Não feche a janela preta</strong> enquanto estiver usando o WhatsApp no Sety Vision.</span>
                    </div>
                    <button onClick={() => setConnectStep(1)}
                      className="w-full py-3 rounded-xl bg-[#25D366] text-white font-semibold text-[13px] hover:bg-[#1fbd5a] transition-colors flex items-center justify-center gap-2">
                      Servidor iniciado — Próximo →
                    </button>
                    <button onClick={() => info("Download", "Acesse saidas/sety-server para obter os arquivos")}
                      className="w-full py-2 rounded-xl text-[12px] text-[#6B7280] hover:text-white transition-colors" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      Ainda não tenho o Sety Server — Baixar grátis
                    </button>
                  </div>
                )}

                {/* Passo 2: Aguardando servidor */}
                {connectStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <div className="text-[15px] font-bold text-white mb-1">Confirme que o servidor está rodando</div>
                      <div className="text-[12px] text-[#6B7280]">A janela preta deve estar mostrando a mensagem abaixo:</div>
                    </div>
                    <div className="p-4 rounded-xl font-mono text-[12px] leading-[1.8]" style={{ background: "#010101", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="text-[#6B7280]">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                      <div className="text-[#25D366]"> 🟢 Sety Server rodando em localhost:3007</div>
                      <div className="text-[#6B7280]">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                      <div className="text-[#A78BFA]"> ✅ QR Code gerado — acesse localhost:3007</div>
                    </div>
                    <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: "rgba(37,211,102,0.06)", border: "1px solid rgba(37,211,102,0.15)" }}>
                      <Wifi size={13} className="text-[#25D366] shrink-0 mt-0.5 animate-pulse" />
                      <span className="text-[11px] text-[#4ADE80]">Da próxima vez, só execute o <strong>iniciar.bat</strong> — o Sety Vision reconecta sozinho.</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setConnectStep(0)} className="px-4 py-2.5 rounded-xl text-[12px] text-[#6B7280] bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.06]">← Voltar</button>
                      <button onClick={() => setConnectStep(2)}
                        className="flex-1 py-2.5 rounded-xl bg-[#25D366] text-white font-semibold text-[13px] hover:bg-[#1fbd5a] transition-colors flex items-center justify-center gap-2">
                        Ativar Sety Server agora →
                      </button>
                    </div>
                  </div>
                )}

                {/* Passo 3: QR Code */}
                {connectStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <div className="text-[15px] font-bold text-white mb-1">Conecte o WhatsApp</div>
                      <div className="text-[12px] text-[#6B7280]">Com o servidor rodando, escaneie o QR code com seu celular.</div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <div className="p-3 rounded-2xl bg-white" style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.3)" }}>
                          <QRMock />
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-[#6B7280]">
                          <Wifi size={9} className="animate-pulse text-[#22C55E]" /> Aguardando...
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        {["Abra o WhatsApp no celular", "Toque em ⋮ Menu → Aparelhos Conectados (Android)\nou Ajustes → Aparelhos Conectados (iPhone)", "Toque em Conectar Aparelho", "Aponte a câmera para o QR ao lado"].map((step, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#25D366] text-white text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i+1}</span>
                            <span className="text-[11px] text-[#9CA3AF] whitespace-pre-line leading-[1.4]">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setConnectStep(1)} className="px-4 py-2.5 rounded-xl text-[12px] text-[#6B7280] bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.06]">← Voltar</button>
                      <button onClick={() => finishConnect(connectModal)}
                        className="flex-1 py-2.5 rounded-xl bg-[#25D366] text-white font-semibold text-[13px] hover:bg-[#1fbd5a] transition-colors flex items-center justify-center gap-2">
                        <QrCode size={13} /> Já escaneei — Conectar!
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* OAuth flow */}
            {connectModal.auth === "OAuth 2.0" && connectModal.id !== "whatsapp" && (
              <div className="space-y-4">
                {connectStep === 0 && (
                  <>
                    <div className="p-4 rounded-xl space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div className="text-[12px] font-semibold text-[#9CA3AF]">Permissões que serão solicitadas:</div>
                      {["Leitura de campanhas e métricas", "Gerenciamento de anúncios", "Acesso a dados de conversão", "Sincronização de audiências"].map(p => (
                        <div key={p} className="flex items-center gap-2 text-[12px] text-[#6B7280]">
                          <CheckCircle size={11} className="text-[#22C55E] flex-shrink-0" /> {p}
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setConnectStep(1)}
                      className="w-full py-3 rounded-xl font-semibold text-[13px] text-white transition-colors"
                      style={{ background: connectModal.color }}>
                      Autorizar com {connectModal.name}
                    </button>
                  </>
                )}
                {connectStep === 1 && (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[rgba(34,197,94,0.12)] flex items-center justify-center mx-auto">
                      <CheckCircle size={32} className="text-[#22C55E]" />
                    </div>
                    <div>
                      <div className="text-[15px] font-bold text-white mb-1">Autorização concedida!</div>
                      <div className="text-[12px] text-[#6B7280]">O Sety Vision pode acessar seus dados com segurança</div>
                    </div>
                    <button onClick={() => finishConnect(connectModal)}
                      className="w-full py-3 rounded-xl bg-[#7C3AED] text-white font-semibold text-[13px] hover:bg-[#8B5CF6] transition-colors">
                      Finalizar e sincronizar dados
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* API Key flow */}
            {(connectModal.auth === "API Key" || connectModal.auth === "Token" || connectModal.auth === "API Key / MWS") && (
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider block mb-1.5">
                    {connectModal.auth === "Token" ? "Token de acesso" : "API Key"}
                  </label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    placeholder={`Cole sua ${connectModal.auth} aqui...`}
                    className="w-full bg-[#0C0C10] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-[rgba(124,58,237,0.5)] transition-colors font-mono"
                  />
                  <p className="text-[11px] text-[#4B5563] mt-1.5">
                    Encontre sua chave em: {connectModal.name} → Configurações → API / Desenvolvedores
                  </p>
                </div>
                <button
                  onClick={() => apiKey.trim() ? finishConnect(connectModal) : toastError("Chave inválida", "Cole a API Key correta para continuar")}
                  className="w-full py-3 rounded-xl bg-[#7C3AED] text-white font-semibold text-[13px] hover:bg-[#8B5CF6] transition-colors disabled:opacity-50">
                  Conectar e sincronizar
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* --- REVOKE MODAL --- */}
      <Modal
        open={!!revokeModal}
        onClose={() => setRevokeModal(null)}
        title="Revogar acesso"
        subtitle="Esta ação não pode ser desfeita"
        size="sm"
        footer={
          <>
            <button onClick={() => setRevokeModal(null)} className="px-4 py-2 rounded-xl text-[12px] font-semibold text-[#6B7280] hover:text-white bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.06]">
              Cancelar
            </button>
            <button onClick={() => revokeModal && handleRevoke(revokeModal)} className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white bg-[#EF4444] hover:bg-red-400 transition-colors">
              Sim, revogar acesso
            </button>
          </>
        }
      >
        {revokeModal && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: revokeModal.bg }}>
                <BrandLogo brand={revokeModal.name} size={20} />
              </div>
              <div>
                <div className="text-[13px] font-bold text-white">{revokeModal.name}</div>
                <div className="text-[11px] text-[#F87171]">Todos os dados serão desvinculados</div>
              </div>
            </div>
            <div className="text-[13px] text-[#9CA3AF] leading-[1.5]">
              Revogar o acesso irá desconectar a integração e parar todas as sincronizações automáticas. Você poderá reconectar quando quiser.
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
