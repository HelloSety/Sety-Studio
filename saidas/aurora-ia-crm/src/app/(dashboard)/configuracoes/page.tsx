"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Bot, Bell, Shield, Globe, Save,
  Eye, EyeOff, ToggleLeft, ToggleRight, Filter, X, Plus
} from "lucide-react";
import Header from "@/components/layout/header";
import { cn } from "@/lib/utils";
import { CONTACT_TYPE_CONFIG } from "@/lib/contact-classifier";
import type { ContactType } from "@/types";

const TABS = [
  { id: "perfil",   label: "Perfil",        icon: User   },
  { id: "aurora",   label: "Aurora IA",     icon: Bot    },
  { id: "filtro",   label: "Filtro SDR",    icon: Filter },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "seguranca", label: "Segurança",    icon: Shield },
  { id: "integracao", label: "Integrações", icon: Globe  },
];

const DEFAULT_KEYWORDS = [
  "site", "loja virtual", "shopify", "tráfego pago", "google ads", "meta ads",
  "landing page", "automação", "crm", "orçamento", "quanto custa", "vender mais",
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="shrink-0">
      {on ? <ToggleRight className="w-5 h-5 text-[#8B3FFF]" /> : <ToggleLeft className="w-5 h-5 text-slate-600" />}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-3">{title}</p>
      <div className="glass-card divide-y divide-white/[0.06]">{children}</div>
    </div>
  );
}

function Row({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <div>
        <p className="text-[13px] text-white">{label}</p>
        {sub && <p className="text-[11px] text-slate-500 mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState("perfil");
  const [showKey, setShowKey] = useState(false);
  const [toggles, setToggles] = useState({
    hotLeadAlerts: true,
    messageNotifs: true,
    emailDigest: false,
    soundAlerts: true,
    twoFactor: false,
    humanTransfer: true,
    portfolioAuto: true,
    scoreVisible: true,
    filterGroups: true,
    filterEmpty: true,
    filterSpam: true,
    respondNewUnknown: false,
  });

  // Filtro SDR — estado
  const [autoRespondTypes, setAutoRespondTypes] = useState<Set<ContactType>>(
    new Set(["cliente_potencial", "cliente_ativo", "cliente_antigo"])
  );
  const [transferThreshold, setTransferThreshold] = useState(80);
  const [keywords, setKeywords] = useState<string[]>(DEFAULT_KEYWORDS);
  const [newKeyword, setNewKeyword] = useState("");

  const toggle = (key: keyof typeof toggles) =>
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleContactType = (type: ContactType) => {
    setAutoRespondTypes((prev) => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  const addKeyword = () => {
    const kw = newKeyword.trim().toLowerCase();
    if (kw && !keywords.includes(kw)) {
      setKeywords((prev) => [...prev, kw]);
    }
    setNewKeyword("");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Configurações" subtitle="Personalize o AURORA IA CRM" />

      <div className="flex flex-1 overflow-hidden">
        {/* Tabs */}
        <aside className="w-[200px] shrink-0 border-r border-white/[0.07] p-4 space-y-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] transition-all",
                tab === t.id
                  ? "bg-[#8B3FFF]/15 text-[#A066FF] border border-[#8B3FFF]/25"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              <t.icon className="w-4 h-4 shrink-0" />
              {t.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="max-w-xl space-y-6"
            >
              {/* PERFIL */}
              {tab === "perfil" && (
                <>
                  <Section title="Dados Pessoais">
                    <div className="p-4 flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8B3FFF] to-[#06B6D4] flex items-center justify-center text-xl font-bold text-white">
                        S
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Seven</p>
                        <p className="text-xs text-slate-500">sevendsgnn@gmail.com</p>
                        <button className="text-[11px] text-[#8B3FFF] hover:text-[#A066FF] mt-1 transition-colors">Alterar foto</button>
                      </div>
                    </div>
                    <Row label="Nome completo">
                      <input defaultValue="Seven" className="input-dark w-36 text-right" />
                    </Row>
                    <Row label="E-mail">
                      <input defaultValue="sevendsgnn@gmail.com" className="input-dark w-48 text-right text-[12px]" />
                    </Row>
                    <Row label="Empresa">
                      <input defaultValue="Sety Studio" className="input-dark w-36 text-right" />
                    </Row>
                  </Section>

                  <div className="flex justify-end">
                    <button className="btn-primary flex items-center gap-2">
                      <Save className="w-3.5 h-3.5" />
                      Salvar Perfil
                    </button>
                  </div>
                </>
              )}

              {/* AURORA IA */}
              {tab === "aurora" && (
                <>
                  <Section title="Identidade do Agente">
                    <Row label="Nome do agente" sub="Nome exibido nas conversas">
                      <input defaultValue="Lucas" className="input-dark w-32 text-right" />
                    </Row>
                    <Row label="Cargo" sub="Como ele se apresenta">
                      <input defaultValue="Consultor Comercial" className="input-dark w-44 text-right text-[12px]" />
                    </Row>
                    <Row label="Empresa" sub="Mencionada nas conversas">
                      <input defaultValue="Sety Studio" className="input-dark w-36 text-right" />
                    </Row>
                  </Section>

                  <Section title="Comportamento">
                    <Row label="Transferência automática" sub="Envia alerta quando score ≥ 80">
                      <Toggle on={toggles.humanTransfer} onToggle={() => toggle("humanTransfer")} />
                    </Row>
                    <Row label="Portfólio automático" sub="Envia portfólio quando relevante">
                      <Toggle on={toggles.portfolioAuto} onToggle={() => toggle("portfolioAuto")} />
                    </Row>
                    <Row label="Score visível" sub="Mostra score para o lead">
                      <Toggle on={toggles.scoreVisible} onToggle={() => toggle("scoreVisible")} />
                    </Row>
                  </Section>

                  <Section title="API Key Claude">
                    <Row label="Anthropic API Key">
                      <div className="flex items-center gap-2">
                        <input
                          type={showKey ? "text" : "password"}
                          defaultValue="sk-ant-api03-xxxxxxxxxxxxxxxx"
                          className="input-dark w-44 text-right text-[11px] font-mono"
                        />
                        <button onClick={() => setShowKey(!showKey)} className="text-slate-500 hover:text-slate-300">
                          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </Row>
                    <Row label="Modelo" sub="Recomendado: claude-sonnet-4-6">
                      <select className="input-dark w-52 text-right text-[12px]">
                        <option value="claude-sonnet-4-6">claude-sonnet-4-6</option>
                        <option value="claude-haiku-4-5-20251001">claude-haiku-4-5-20251001</option>
                        <option value="claude-opus-4-8">claude-opus-4-8</option>
                      </select>
                    </Row>
                  </Section>
                </>
              )}

              {/* FILTRO SDR */}
              {tab === "filtro" && (
                <>
                  <Section title="Tipos de Contato — Resposta Automática">
                    <div className="p-4 space-y-2">
                      <p className="text-[11px] text-slate-500 mb-3">
                        Selecione quais tipos recebem resposta automática da Aurora IA.
                      </p>
                      {(Object.entries(CONTACT_TYPE_CONFIG) as [ContactType, typeof CONTACT_TYPE_CONFIG[ContactType]][]).map(([type, cfg]) => (
                        <button
                          key={type}
                          onClick={() => toggleContactType(type)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all text-left",
                            autoRespondTypes.has(type)
                              ? "border-[#8B3FFF]/40 bg-[#8B3FFF]/10"
                              : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-base">{cfg.emoji}</span>
                            <div>
                              <p className="text-[13px] text-white">{cfg.label}</p>
                              <p className="text-[11px] text-slate-500">
                                {cfg.autoRespond ? "Habilitado por padrão" : "Bloqueado por padrão"}
                              </p>
                            </div>
                          </div>
                          <div className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 rounded",
                            autoRespondTypes.has(type)
                              ? "text-emerald-400 bg-emerald-400/10"
                              : "text-slate-500 bg-slate-700/50"
                          )}>
                            {autoRespondTypes.has(type) ? "RESPONDE" : "IGNORA"}
                          </div>
                        </button>
                      ))}
                    </div>
                  </Section>

                  <Section title="Proteções Automáticas">
                    <Row label="Bloquear grupos" sub="Nunca responder mensagens de grupos">
                      <Toggle on={toggles.filterGroups} onToggle={() => toggle("filterGroups")} />
                    </Row>
                    <Row label="Ignorar mensagens vazias" sub="Áudios sem transcrição, etc.">
                      <Toggle on={toggles.filterEmpty} onToggle={() => toggle("filterEmpty")} />
                    </Row>
                    <Row label="Detectar spam" sub="Filtra mensagens promocionais indesejadas">
                      <Toggle on={toggles.filterSpam} onToggle={() => toggle("filterSpam")} />
                    </Row>
                    <Row label="Responder desconhecidos" sub="Contatos sem classificação prévia">
                      <Toggle on={toggles.respondNewUnknown} onToggle={() => toggle("respondNewUnknown")} />
                    </Row>
                  </Section>

                  <Section title="Transferência para Humano">
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[13px] text-white">Score mínimo para alerta</p>
                          <p className="text-[11px] text-slate-500">Notifica o responsável quando ≥ este valor</p>
                        </div>
                        <span className="text-lg font-bold text-[#8B3FFF]">{transferThreshold}</span>
                      </div>
                      <input
                        type="range"
                        min={40}
                        max={100}
                        step={5}
                        value={transferThreshold}
                        onChange={(e) => setTransferThreshold(Number(e.target.value))}
                        className="w-full accent-[#8B3FFF]"
                      />
                      <div className="flex justify-between text-[10px] text-slate-600">
                        <span>40 — Qualquer interesse</span>
                        <span>80 — Alta intenção</span>
                        <span>100 — Certeza</span>
                      </div>
                    </div>
                    <Row label="Responsável" sub="Telefone que recebe o alerta no WhatsApp">
                      <input
                        placeholder="5511999999999"
                        className="input-dark w-44 text-right text-[12px] font-mono placeholder:text-slate-600"
                      />
                    </Row>
                  </Section>

                  <Section title="Palavras-chave de Interesse Comercial">
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          value={newKeyword}
                          onChange={(e) => setNewKeyword(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                          placeholder="Adicionar palavra-chave..."
                          className="input-dark flex-1 text-[13px]"
                        />
                        <button onClick={addKeyword} className="btn-ghost p-2 border border-white/[0.08]">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {keywords.map((kw) => (
                          <span
                            key={kw}
                            className="inline-flex items-center gap-1 text-[11px] bg-[#8B3FFF]/10 border border-[#8B3FFF]/20 text-[#A066FF] rounded-full px-2.5 py-1"
                          >
                            {kw}
                            <button
                              onClick={() => setKeywords((prev) => prev.filter((k) => k !== kw))}
                              className="hover:text-white transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </Section>

                  <div className="flex justify-end">
                    <button className="btn-primary flex items-center gap-2">
                      <Save className="w-3.5 h-3.5" />
                      Salvar Filtros
                    </button>
                  </div>
                </>
              )}

              {/* NOTIFICAÇÕES */}
              {tab === "notificacoes" && (
                <>
                  <Section title="Alertas">
                    <Row label="Leads quentes" sub="Notificar quando score ≥ 80">
                      <Toggle on={toggles.hotLeadAlerts} onToggle={() => toggle("hotLeadAlerts")} />
                    </Row>
                    <Row label="Novas mensagens" sub="Alertar ao receber mensagem">
                      <Toggle on={toggles.messageNotifs} onToggle={() => toggle("messageNotifs")} />
                    </Row>
                    <Row label="Som de alerta" sub="Tocar som para notificações">
                      <Toggle on={toggles.soundAlerts} onToggle={() => toggle("soundAlerts")} />
                    </Row>
                    <Row label="Resumo por e-mail" sub="Relatório diário às 8h">
                      <Toggle on={toggles.emailDigest} onToggle={() => toggle("emailDigest")} />
                    </Row>
                  </Section>

                  <Section title="Telegram (Alertas de Leads Quentes)">
                    <Row label="Bot Token">
                      <input placeholder="5847xxxxxxx:AAF..." className="input-dark w-48 text-right text-[11px] font-mono placeholder:text-slate-600" />
                    </Row>
                    <Row label="Chat ID">
                      <input placeholder="-100xxxxxxxx" className="input-dark w-36 text-right text-[11px] font-mono placeholder:text-slate-600" />
                    </Row>
                  </Section>
                </>
              )}

              {/* SEGURANÇA */}
              {tab === "seguranca" && (
                <>
                  <Section title="Autenticação">
                    <Row label="Dois fatores (2FA)" sub="Protege o acesso com código extra">
                      <Toggle on={toggles.twoFactor} onToggle={() => toggle("twoFactor")} />
                    </Row>
                    <Row label="Senha">
                      <button className="text-xs text-[#8B3FFF] hover:text-[#A066FF] transition-colors">Alterar senha →</button>
                    </Row>
                    <Row label="Sessões ativas">
                      <button className="text-xs text-red-400 hover:text-red-300 transition-colors">Ver sessões →</button>
                    </Row>
                  </Section>

                  <Section title="Dados">
                    <Row label="Exportar dados" sub="Baixar todos os leads e conversas">
                      <button className="text-xs btn-ghost py-1 px-3 border border-white/[0.08]">Exportar CSV</button>
                    </Row>
                    <Row label="Excluir conta" sub="Ação irreversível">
                      <button className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 px-3 py-1 rounded-lg transition-all">
                        Excluir
                      </button>
                    </Row>
                  </Section>
                </>
              )}

              {/* INTEGRAÇÕES */}
              {tab === "integracao" && (
                <>
                  <Section title="WhatsApp">
                    <Row label="Evolution API URL" sub="Endpoint da instância">
                      <input defaultValue="http://67.207.90.199:8080" className="input-dark w-52 text-right text-[11px] font-mono" />
                    </Row>
                    <Row label="API Key">
                      <input type="password" defaultValue="sety_evolution_2024" className="input-dark w-44 text-right text-[11px] font-mono" />
                    </Row>
                    <Row label="Instância">
                      <input defaultValue="aurora-ia" className="input-dark w-32 text-right" />
                    </Row>
                  </Section>

                  <Section title="Telegram (Alertas)">
                    <Row label="Bot Token">
                      <input placeholder="Token do bot" className="input-dark w-48 text-right text-[11px] font-mono placeholder:text-slate-600" />
                    </Row>
                    <Row label="Chat ID">
                      <input placeholder="-100xxxxxxxx" className="input-dark w-36 text-right text-[11px] font-mono placeholder:text-slate-600" />
                    </Row>
                  </Section>

                  <Section title="Supabase">
                    <Row label="URL do projeto">
                      <input placeholder="https://xxx.supabase.co" className="input-dark w-48 text-right text-[11px] font-mono placeholder:text-slate-600" />
                    </Row>
                    <Row label="Anon Key">
                      <input type="password" placeholder="eyJhbGci..." className="input-dark w-44 text-right text-[11px] font-mono placeholder:text-slate-600" />
                    </Row>
                  </Section>

                  <div className="flex justify-end">
                    <button className="btn-primary flex items-center gap-2">
                      <Save className="w-3.5 h-3.5" />
                      Salvar Integrações
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
