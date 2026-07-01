"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/motion";

/* ── Scenarios ─────────────────────────────────────────── */
interface Msg { id: string; from: "lead" | "bot"; text: string; time: string; delay: number }
interface Scenario { contact: string; subtitle: string; avatar: string; color: string; messages: Msg[] }

const scenarios: Scenario[] = [
  {
    contact: "Clínica Sorriso",
    subtitle: "Odontologia · São Paulo",
    avatar: "CS",
    color: "#7C3AED",
    messages: [
      { id: "a1", from: "lead", text: "Oi! Vi o anúncio de vocês no Instagram 👋", time: "14:32", delay: 400 },
      { id: "a2", from: "bot",  text: "Olá! 😊 Aqui é a assistente da Clínica Sorriso. Como posso te ajudar hoje?", time: "14:32", delay: 2200 },
      { id: "a3", from: "lead", text: "Quanto custa um clareamento dental?", time: "14:33", delay: 2800 },
      { id: "a4", from: "bot",  text: "O clareamento a laser fica entre R$ 800 e R$ 1.200 dependendo do caso 🦷\n\nGostaria de agendar uma avaliação gratuita?", time: "14:33", delay: 2200 },
      { id: "a5", from: "lead", text: "Sim! Pode ser essa semana?", time: "14:34", delay: 2400 },
      { id: "a6", from: "bot",  text: "Perfeito! 🗓️ Temos disponível:\n• Quinta-feira às 14h\n• Sexta-feira às 10h\n\nQual prefere?", time: "14:34", delay: 2000 },
      { id: "a7", from: "lead", text: "Quinta às 14h", time: "14:35", delay: 2200 },
      { id: "a8", from: "bot",  text: "✅ Agendado! Quinta às 14h com o Dr. Carlos.\n\nVou enviar a confirmação com o endereço. Até lá! 👋", time: "14:35", delay: 1800 },
    ],
  },
  {
    contact: "Imobiliária Total",
    subtitle: "Imóveis · Rio de Janeiro",
    avatar: "IT",
    color: "#22C55E",
    messages: [
      { id: "b1", from: "lead", text: "Boa tarde! Vi um apartamento no anúncio de vocês", time: "16:10", delay: 400 },
      { id: "b2", from: "bot",  text: "Boa tarde! 🏠 Que ótimo que entrou em contato! Me conta qual imóvel você se interessou?", time: "16:10", delay: 2000 },
      { id: "b3", from: "lead", text: "O apto de 3 quartos em Ipanema por R$ 1,2M", time: "16:11", delay: 2800 },
      { id: "b4", from: "bot",  text: "Ótima escolha! 🌟 Apartamento em Ipanema:\n• 3 quartos · 120m² · 2 vagas\n• Varanda gourmet · Vista parcial mar\n\nPosso agendar uma visita para você?", time: "16:12", delay: 2200 },
      { id: "b5", from: "lead", text: "Com certeza! Quando tem horário?", time: "16:12", delay: 2400 },
      { id: "b6", from: "bot",  text: "📅 Disponibilidade esta semana:\n• Sábado às 10h ou 15h\n• Domingo às 11h\n\nQual prefere?", time: "16:13", delay: 1800 },
      { id: "b7", from: "lead", text: "Sábado às 15h perfeito", time: "16:13", delay: 2200 },
      { id: "b8", from: "bot",  text: "✅ Visita confirmada! Sábado às 15h.\n\nNosso corretor Ricardo vai te receber. Enviando localização agora! 📍", time: "16:14", delay: 1800 },
    ],
  },
  {
    contact: "Studio Estética",
    subtitle: "Beleza · Belo Horizonte",
    avatar: "SE",
    color: "#EC4899",
    messages: [
      { id: "c1", from: "lead", text: "Oi! Queria fazer botox, vocês atendem?", time: "10:05", delay: 400 },
      { id: "c2", from: "bot",  text: "Oi! 💆‍♀️ Sim, atendemos! O Studio Estética é especialista em tratamentos faciais.\n\nQual área te interessa?", time: "10:05", delay: 2000 },
      { id: "c3", from: "lead", text: "Testa e ao redor dos olhos", time: "10:06", delay: 2500 },
      { id: "c4", from: "bot",  text: "Perfeito! Para testa + área dos olhos, temos o pacote completo a partir de R$ 950.\n\n✨ Resultado natural e duração de 4-6 meses!\n\nQuer agendar uma avaliação?", time: "10:07", delay: 2200 },
      { id: "c5", from: "lead", text: "Quero sim! Tem horário essa semana?", time: "10:07", delay: 2400 },
      { id: "c6", from: "bot",  text: "Temos sim! 🗓️\n• Quarta às 11h\n• Quinta às 14h\n• Sexta às 9h\n\nA avaliação é gratuita e rápida (20min)!", time: "10:08", delay: 2000 },
      { id: "c7", from: "lead", text: "Quinta às 14h", time: "10:08", delay: 2000 },
      { id: "c8", from: "bot",  text: "✅ Agendado! Quinta-feira às 14h com Dra. Fernanda.\n\nTe mando o endereço e um lembrete no dia anterior. Até lá! 💜", time: "10:09", delay: 1800 },
    ],
  },
];

/* ── Typing dots ─────────────────────────────────────────── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="w-2 h-2 rounded-full bg-[#6B7280]"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export function WhatsAppDemo() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [visibleMsgs, setVisibleMsgs] = useState<Msg[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef(null);
  const inView = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { inView.current = e.isIntersecting; }, { threshold: 0.3 });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    setVisibleMsgs([]);
    setIsTyping(false);
    const scenario = scenarios[scenarioIdx];
    let cancelled = false;

    const processMsg = (idx: number) => {
      if (cancelled || idx >= scenario.messages.length) {
        if (!cancelled) {
          setTimeout(() => {
            if (!cancelled) setScenarioIdx(p => (p + 1) % scenarios.length);
          }, 3800);
        }
        return;
      }
      const msg = scenario.messages[idx];
      setTimeout(() => {
        if (cancelled) return;
        if (msg.from === "bot") {
          setIsTyping(true);
          setTimeout(() => {
            if (cancelled) return;
            setIsTyping(false);
            setVisibleMsgs(p => [...p, msg]);
            processMsg(idx + 1);
          }, 1500);
        } else {
          setVisibleMsgs(p => [...p, msg]);
          processMsg(idx + 1);
        }
      }, msg.delay);
    };
    processMsg(0);
    return () => { cancelled = true; };
  }, [scenarioIdx]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [visibleMsgs, isTyping]);

  const scenario = scenarios[scenarioIdx];
  const sectionRef = useRef(null);
  const [sectionInView, setSectionInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setSectionInView(e.isIntersecting), { threshold: 0.15 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="automacao" className="section-pad" style={{ background: "#FAFAFB", borderTop: "1px solid #ECECEC" }} ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Left: text ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="text-[12px] font-semibold uppercase tracking-[0.1em] mb-5" style={{ color: "#6B7280" }}>
              Bot de WhatsApp
            </div>
            <h2 className="text-[clamp(28px,4vw,52px)] font-black tracking-[-2px] leading-[1.1] mb-6" style={{ color: "#111111" }}>
              Responde em segundos.<br />
              <span style={{ color: "#6B7280" }}>Converte o ano todo.</span>
            </h2>
            <p className="text-[16px] leading-[1.7] mb-8 max-w-[420px]" style={{ color: "#6B7280" }}>
              O bot da Sety Vision responde leads na hora certa, qualifica automaticamente e agenda reuniões — sem nenhum humano precisar intervir.
            </p>

            <div className="flex flex-col gap-4 mb-10">
              {[
                { icon: "⚡", label: "Resposta em menos de 4 segundos",      color: "#7C3AED" },
                { icon: "🤖", label: "IA que qualifica e agenda sozinha",      color: "#22C55E" },
                { icon: "📅", label: "Agenda integrada, sem duplo agendamento",color: "#3B82F6" },
                { icon: "🔄", label: "Ativa 24h por dia, 7 dias por semana",  color: "#F59E0B" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
                    style={{ background: `${item.color}12`, border: `1px solid ${item.color}25` }}>
                    {item.icon}
                  </div>
                  <span className="text-[14px]" style={{ color: "#374151" }}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Scenario pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] mr-1" style={{ color: "#9CA3AF" }}>Ver demo para:</span>
              {scenarios.map((s, i) => (
                <button key={s.contact} onClick={() => setScenarioIdx(i)}
                  className="px-3 py-1.5 rounded-full text-[12px] font-medium transition-all border"
                  style={{
                    background: i === scenarioIdx ? `${s.color}12` : "#FFFFFF",
                    borderColor: i === scenarioIdx ? `${s.color}40` : "#ECECEC",
                    color: i === scenarioIdx ? s.color : "#6B7280",
                  }}>
                  {s.contact}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── Right: phone mockup ── */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }} animate={sectionInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
            className="flex justify-center"
            ref={containerRef}
          >
            <div className="relative" style={{ width: 320 }}>

              {/* Phone frame */}
              <div className="rounded-[40px] overflow-hidden shadow-2xl"
                style={{
                  background: "#111",
                  border: "8px solid #1a1a1a",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)",
                }}>

                {/* Status bar */}
                <div className="flex items-center justify-between px-6 py-2 text-[11px] font-semibold text-white"
                  style={{ background: "#1a5c4c" }}>
                  <span>9:41</span>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span>●●●●</span> <span>WiFi</span> <span>🔋</span>
                  </div>
                </div>

                {/* WA Header */}
                <div className="flex items-center gap-3 px-4 py-3"
                  style={{ background: "#1a5c4c" }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0"
                    style={{ background: scenario.color }}>
                    {scenario.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-white truncate">{scenario.contact}</div>
                    <div className="text-[10px] text-white/60">{scenario.subtitle}</div>
                  </div>
                  <div className="flex gap-3 text-white/80">
                    <span className="text-[15px]">📞</span>
                    <span className="text-[15px]">⋮</span>
                  </div>
                </div>

                {/* Chat area */}
                <div
                  ref={chatRef}
                  className="flex flex-col gap-1 p-3 overflow-y-auto"
                  style={{
                    background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%230d1117'/%3E%3Cpath d='M0 40L40 0M-10 10L10-10M30 50L50 30' stroke='%23ffffff06' stroke-width='1'/%3E%3C/svg%3E\")",
                    minHeight: 340,
                    maxHeight: 340,
                    scrollBehavior: "smooth",
                  }}
                >
                  {/* Date chip */}
                  <div className="text-center mb-2">
                    <span className="text-[10px] text-white/50 bg-black/30 px-3 py-1 rounded-full">Hoje</span>
                  </div>

                  <AnimatePresence initial={false}>
                    {visibleMsgs.map(msg => (
                      <motion.div key={msg.id}
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.25 }}
                        className={`flex ${msg.from === "lead" ? "justify-end" : "justify-start"} mb-1`}
                      >
                        {msg.from === "bot" && (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black text-white mr-1 mt-auto mb-1 shrink-0"
                            style={{ background: scenario.color }}>
                            IA
                          </div>
                        )}
                        <div className="max-w-[78%]">
                          <div
                            className="px-3 py-2 text-[12px] leading-[1.5] whitespace-pre-wrap"
                            style={{
                              background: msg.from === "lead" ? "#075e54" : "#1f2c34",
                              color: "#E5E7EB",
                              borderRadius: msg.from === "bot"
                                ? "4px 14px 14px 14px"
                                : "14px 4px 14px 14px",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                            }}
                          >
                            {msg.text}
                          </div>
                          <div className={`text-[9px] text-white/30 mt-0.5 ${msg.from === "lead" ? "text-right pr-1" : "pl-1"}`}>
                            {msg.time} {msg.from === "lead" && "✓✓"}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing indicator */}
                  <AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="flex items-end gap-1 mb-1"
                      >
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black text-white shrink-0"
                          style={{ background: scenario.color }}>
                          IA
                        </div>
                        <div className="px-3 py-1 rounded-[4px_14px_14px_14px]"
                          style={{ background: "#1f2c34", boxShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
                          <TypingDots />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Input bar */}
                <div className="flex items-center gap-2 px-3 py-2" style={{ background: "#1a1a24" }}>
                  <div className="flex-1 flex items-center gap-2 bg-[#2a2a38] rounded-full px-4 py-2">
                    <span className="text-[14px]">🙂</span>
                    <span className="text-[12px] text-white/30 flex-1">Mensagem</span>
                    <span className="text-[14px]">📎</span>
                  </div>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "#128C7E" }}>
                    <span className="text-white text-[14px]">🎤</span>
                  </div>
                </div>
              </div>

              {/* Response time badge */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-8 rounded-2xl px-4 py-3"
                style={{ background: "#FFFFFF", border: "1px solid #ECECEC", boxShadow: "0 12px 32px rgba(15,23,42,0.10)" }}
              >
                <div className="text-[10px] mb-0.5" style={{ color: "#9CA3AF" }}>Tempo de resposta</div>
                <div className="text-[20px] font-black" style={{ color: "#22C55E" }}>3,2s</div>
              </motion.div>

              {/* Leads converted badge */}
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-8 rounded-2xl px-4 py-3"
                style={{ background: "#FFFFFF", border: "1px solid #ECECEC", boxShadow: "0 12px 32px rgba(15,23,42,0.10)" }}
              >
                <div className="text-[10px] mb-0.5" style={{ color: "#9CA3AF" }}>Convertidos hoje</div>
                <div className="text-[20px] font-black" style={{ color: "#7C3AED" }}>+38</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
