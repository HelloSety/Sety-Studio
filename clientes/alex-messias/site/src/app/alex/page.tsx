"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
import { whatsappLink } from "@/lib/utils";
import { siteConfig } from "@/lib/data";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const fadeUpInView = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

const stats = [
  { value: "300+", label: "Clientes atendidos" },
  { value: "10+", label: "Anos de experiência" },
  { value: "5★", label: "Avaliação Google" },
  { value: "7", label: "Modelos GWM" },
];

const especialidades = [
  "Haval H6 HEV",
  "Haval H6 PHEV",
  "Haval H6 GT",
  "ORA 03",
  "Tank 300",
  "Consórcio GWM",
  "Financiamento",
  "Test Drive",
];

export default function AlexPage() {
  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden bg-gwm-dark">
        <div className="absolute inset-0 z-0">
          {/* foto-5: polo azul encostado no Tank 300 branco — impacto visual máximo */}
          <Image
            src="/images/alex/foto-5.jpg"
            alt="Alex Messias GWM"
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/60 to-black/10" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/40" />
        </div>

        <div className="absolute top-24 left-6 z-10">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/50 text-[0.65rem] tracking-widest uppercase hover:text-white transition-colors"
          >
            <ArrowRight size={12} className="rotate-180" />
            Voltar
          </Link>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 pt-44 w-full">
          <motion.div {...fadeUp(0.2)} className="flex items-center gap-4 mb-7">
            <div className="w-8 h-px bg-gwm-red" />
            <span className="text-gwm-red text-[0.65rem] font-bold tracking-[0.35em] uppercase">
              Consultor Especialista GWM
            </span>
          </motion.div>

          <motion.h1 {...fadeUp(0.35)} className="heading-xl text-white mb-5 max-w-2xl">
            Alex Messias
          </motion.h1>

          <motion.p {...fadeUp(0.5)} className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl font-light">
            O maior especialista em GWM do interior de São Paulo. Consultoria personalizada, pós-venda real e resultado garantido.
          </motion.p>

          <motion.div {...fadeUp(0.65)} className="flex flex-wrap gap-4">
            <a
              href={whatsappLink(siteConfig.whatsapp, "Olá Alex! Quero conhecer melhor seu trabalho.")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gwm-red text-white text-[0.7rem] font-bold tracking-widest uppercase px-7 py-4 hover:bg-[#c5000f] transition-colors"
            >
              Falar com Alex
            </a>
            <a
              href="#galeria"
              className="border border-white/30 text-white text-[0.7rem] font-bold tracking-widest uppercase px-7 py-4 hover:bg-white/10 hover:border-white/60 transition-all"
            >
              Ver Fotos
            </a>
          </motion.div>

          <motion.div {...fadeUp(0.85)} className="flex flex-wrap gap-10 mt-16 pt-10 border-t border-white/10">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-white/40 text-[0.6rem] tracking-widest uppercase mt-0.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BIO */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-start">

            {/* Foto bio — close-up profissional */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="relative"
            >
              <div className="relative aspect-3/4 overflow-hidden">
                {/* foto-1: camisa preta, close-up profissional */}
                <Image
                  src="/images/alex/foto-1.jpg"
                  alt="Alex Messias"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute top-0 left-0 w-14 h-14 border-t-2 border-l-2 border-gwm-red pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-14 h-14 border-b-2 border-r-2 border-gwm-red pointer-events-none" />
              </div>

              <div className="absolute -bottom-6 -right-4 bg-gwm-dark text-white px-8 py-6 shadow-2xl">
                <p className="text-3xl font-black text-gwm-red">10+</p>
                <p className="text-white/60 text-[0.65rem] tracking-widest uppercase mt-1">Anos no mercado</p>
              </div>
            </motion.div>

            {/* Texto */}
            <div className="lg:pt-12">
              <motion.div {...fadeUpInView(0.1)} className="flex items-center gap-4 mb-8">
                <div className="w-8 h-px bg-gwm-red" />
                <span className="text-gwm-red text-[0.65rem] font-bold tracking-[0.3em] uppercase">
                  Quem é Alex Messias
                </span>
              </motion.div>

              <motion.h2 {...fadeUpInView(0.2)} className="heading-lg text-gwm-dark mb-8">
                Mais que um<br />
                <span className="text-gwm-red">consultor.</span>
              </motion.h2>

              <motion.div {...fadeUpInView(0.3)} className="space-y-5 text-gwm-gray text-[0.95rem] leading-relaxed mb-12">
                <p>
                  Alex Messias construiu sua carreira no mercado automotivo com um propósito claro: transformar a compra de um carro em uma experiência sem estresse, sem pressão e com resultado real para cada cliente.
                </p>
                <p>
                  Especialista na linha GWM — Haval, ORA e Tank — Alex conhece cada detalhe técnico dos modelos híbridos, plug-in e elétricos. Isso permite que ele encontre o veículo ideal para cada estilo de vida, rotina e orçamento.
                </p>
                <p>
                  Com mais de 300 clientes atendidos e avaliação 5 estrelas no Google, Alex se tornou referência em consultoria GWM no interior de São Paulo. O atendimento vai do primeiro contato até o pós-venda — sempre disponível.
                </p>
              </motion.div>

              <motion.div {...fadeUpInView(0.4)} className="mb-12">
                <p className="text-[0.6rem] font-bold tracking-widest uppercase text-gwm-gray mb-5">Especialidades</p>
                <div className="flex flex-wrap gap-2">
                  {especialidades.map((e) => (
                    <span
                      key={e}
                      className="border border-gwm-border text-gwm-gray text-[0.65rem] font-semibold tracking-widest uppercase px-4 py-2"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div {...fadeUpInView(0.5)} className="space-y-3 mb-10">
                {siteConfig.locations.map((loc) => (
                  <div key={loc} className="flex items-center gap-2 text-gwm-gray text-sm">
                    <MapPin size={14} className="text-gwm-red shrink-0" />
                    {loc}
                  </div>
                ))}
                <a
                  href="https://www.instagram.com/alexmessiasoficial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gwm-gray text-sm hover:text-gwm-dark transition-colors"
                >
                  <span className="text-gwm-red shrink-0"><InstagramIcon size={14} /></span>
                  @alexmessiasoficial
                </a>
              </motion.div>

              <motion.div {...fadeUpInView(0.6)}>
                <a
                  href={whatsappLink(siteConfig.whatsapp, "Olá Alex! Gostaria de mais informações.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gwm-dark text-white text-[0.7rem] font-bold tracking-widest uppercase px-7 py-4 hover:bg-gwm-charcoal transition-colors"
                >
                  Entrar em Contato
                  <ArrowRight size={14} />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* GALERIA */}
      <section id="galeria" className="py-32 bg-gwm-light">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div {...fadeUpInView()} className="mb-16">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-px bg-gwm-red" />
              <span className="text-gwm-red text-[0.65rem] font-bold tracking-[0.3em] uppercase">Galeria</span>
            </div>
            <h2 className="heading-lg text-gwm-dark">
              Alex no<br />
              <span className="text-gwm-red">Showroom</span>
            </h2>
          </motion.div>

          {/* Grid — todas as fotos em retrato, sem corte */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { src: "/images/alex/foto-4.jpg", alt: "Alex Messias — Consultor GWM" },
              { src: "/images/alex/foto-1.jpg", alt: "Alex Messias — GWM" },
              { src: "/images/alex/foto-5.jpg", alt: "Alex Messias — Tank 300" },
              { src: "/images/alex/foto-2.jpg", alt: "Alex Messias — Showroom" },
              { src: "/images/alex/foto-7.jpg", alt: "Alex Messias" },
              { src: "/images/alex/foto-6.jpg", alt: "Alex Messias — Editorial" },
              { src: "/images/alex/foto-3.jpg", alt: "Alex Messias" },
            ].map((photo, i) => (
              <motion.div
                key={photo.src}
                {...fadeUpInView(i * 0.07)}
                className="relative overflow-hidden aspect-3/4 bg-gwm-light"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 bg-gwm-dark relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/alex/foto-4.jpg"
            alt="Alex Messias"
            fill
            className="object-cover object-center opacity-15"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-b from-gwm-dark via-gwm-dark/95 to-gwm-dark" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeUpInView()} className="flex items-center justify-center gap-4 mb-6">
            <div className="w-8 h-px bg-gwm-red" />
            <span className="text-gwm-red text-[0.65rem] font-bold tracking-[0.35em] uppercase">Pronto para começar?</span>
            <div className="w-8 h-px bg-gwm-red" />
          </motion.div>

          <motion.h2 {...fadeUpInView(0.1)} className="heading-lg text-white mb-6">
            Fale com Alex<br />
            <span className="text-gwm-red">agora mesmo.</span>
          </motion.h2>

          <motion.p {...fadeUpInView(0.2)} className="text-white/50 text-sm leading-relaxed mb-10 max-w-md mx-auto">
            Sem enrolação. Alex responde pessoalmente no WhatsApp e encontra o melhor GWM para você.
          </motion.p>

          <motion.div {...fadeUpInView(0.3)} className="flex flex-wrap gap-4 justify-center">
            <a
              href={whatsappLink(siteConfig.whatsapp, "Olá Alex! Quero conhecer os veículos GWM.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gwm-red text-white text-[0.7rem] font-bold tracking-widest uppercase px-9 py-5 hover:bg-[#c5000f] transition-colors"
            >
              Falar no WhatsApp
              <ArrowRight size={14} />
            </a>
            <Link
              href="/#veiculos"
              className="inline-flex items-center gap-3 border border-white/20 text-white text-[0.7rem] font-bold tracking-widest uppercase px-9 py-5 hover:border-white/50 hover:bg-white/5 transition-all"
            >
              Ver Veículos
            </Link>
          </motion.div>
        </div>
      </section>

    </main>
  );
}
