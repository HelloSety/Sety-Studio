"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { whatsappLink } from "@/lib/utils";
import { siteConfig } from "@/lib/data";

export default function CTA() {
  return (
    <section className="relative py-36 overflow-hidden bg-gwm-dark">
      <div className="absolute inset-0 z-0">
        <Image
          src="/cars/haval-h6-gt/hero.webp"
          alt="Alex Messias GWM"
          fill
          className="object-cover opacity-25"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-b from-gwm-dark via-gwm-dark/80 to-gwm-dark" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-center gap-4 mb-7">
            <div className="w-8 h-px bg-gwm-red" />
            <span className="text-gwm-red text-[0.65rem] font-bold tracking-[0.3em] uppercase">
              Próximo Passo
            </span>
            <div className="w-8 h-px bg-gwm-red" />
          </div>

          <h2 className="heading-xl text-white mb-6">
            Pronto para
            <br />encontrar sua{" "}
            <span className="text-gwm-red">GWM?</span>
          </h2>

          <p className="text-white/50 text-lg max-w-lg mx-auto mb-10 leading-relaxed font-light">
            Fale com Alex agora. Sem enrolação, sem pressão. Só consultoria especializada para você tomar a melhor decisão.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={whatsappLink(siteConfig.whatsapp, "Olá Alex! Quero encontrar minha próxima GWM.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-gwm-red text-white text-[0.75rem] font-black tracking-widest uppercase px-9 py-5 hover:bg-[#c5000f] transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Falar com Alex
            </a>
            <a
              href={whatsappLink(siteConfig.whatsapp, "Olá Alex! Quero agendar um test drive GWM.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white text-[0.75rem] font-bold tracking-widest uppercase px-9 py-5 hover:border-white/60 hover:bg-white/5 transition-all"
            >
              Agendar Test Drive
              <ArrowRight size={14} />
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-5 mt-12 text-white/20 text-[0.65rem] tracking-widest uppercase">
            {siteConfig.locations.map((l, i) => (
              <>
                {i > 0 && <span key={`dot-${l}`}>·</span>}
                <span key={l}>{l}</span>
              </>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
