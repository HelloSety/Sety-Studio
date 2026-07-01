"use client";

import { motion } from "framer-motion";
import { User, Award, Car, Shield, TrendingUp, MapPin, Headphones, Star } from "lucide-react";
import { differentials } from "@/lib/data";

const iconMap: Record<string, React.ReactNode> = {
  user: <User size={22} />,
  award: <Award size={22} />,
  car: <Car size={22} />,
  shield: <Shield size={22} />,
  "trending-up": <TrendingUp size={22} />,
  "map-pin": <MapPin size={22} />,
  headphones: <Headphones size={22} />,
  star: <Star size={22} />,
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
});

export default function Differentials() {
  return (
    <section id="diferenciais" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div {...fadeUp()} className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 h-px bg-gwm-red" />
            <span className="text-gwm-red text-[0.65rem] font-bold tracking-[0.3em] uppercase">
              Por que Alex Messias
            </span>
            <div className="w-8 h-px bg-gwm-red" />
          </div>
          <h2 className="heading-lg text-gwm-dark">
            Diferenciais que<br />
            <span className="text-gwm-red">fazem diferença</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gwm-border">
          {differentials.map((item, i) => (
            <motion.div
              key={item.title}
              {...fadeUp(i * 0.08)}
              className="group bg-white p-10 hover:bg-gwm-light transition-colors duration-300 relative overflow-hidden"
            >
              <span className="absolute top-4 right-6 text-7xl font-black text-gwm-light select-none leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="w-11 h-11 border border-gwm-border flex items-center justify-center text-gwm-red mb-7 group-hover:bg-gwm-red group-hover:text-white group-hover:border-gwm-red transition-all duration-300">
                {iconMap[item.icon] ?? <Car size={22} />}
              </div>

              <h3 className="text-sm font-black text-gwm-dark uppercase tracking-wide mb-3">
                {item.title}
              </h3>
              <p className="text-gwm-gray text-sm leading-relaxed">{item.description}</p>

              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gwm-red group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
