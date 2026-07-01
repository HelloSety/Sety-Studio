"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { vehicles } from "@/lib/data";
import { whatsappLink } from "@/lib/utils";
import { siteConfig } from "@/lib/data";

const COMPARE_KEYS = ["Motor", "Potência", "Torque", "0–100", "Tração", "Autonomia", "Preço"];

export default function Comparator() {
  const featured = vehicles.filter((v) => v.featured).slice(0, 4);
  const [left, setLeft] = useState(featured[0]?.id ?? "");
  const [right, setRight] = useState(featured[3]?.id ?? "");

  const vLeft = vehicles.find((v) => v.id === left);
  const vRight = vehicles.find((v) => v.id === right);

  return (
    <section id="comparador" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-8 h-px bg-gwm-red" />
            <span className="text-gwm-red text-[0.65rem] font-bold tracking-[0.3em] uppercase">
              Comparador
            </span>
            <div className="w-8 h-px bg-gwm-red" />
          </div>
          <h2 className="heading-lg text-gwm-dark">
            Compare os<br />
            <span className="text-gwm-red">modelos GWM</span>
          </h2>
        </motion.div>

        {/* Selects */}
        <div className="grid md:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
          <div>
            <label className="text-gwm-gray text-[0.65rem] font-bold tracking-widest uppercase block mb-2">
              Modelo 1
            </label>
            <select
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              className="w-full border border-gwm-border bg-white text-gwm-dark text-sm px-4 py-3 focus:outline-none focus:border-gwm-dark"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} {v.version}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-gwm-gray text-[0.65rem] font-bold tracking-widest uppercase block mb-2">
              Modelo 2
            </label>
            <select
              value={right}
              onChange={(e) => setRight(e.target.value)}
              className="w-full border border-gwm-border bg-white text-gwm-dark text-sm px-4 py-3 focus:outline-none focus:border-gwm-dark"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} {v.version}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Compare table */}
        {vLeft && vRight && (
          <div className="border border-gwm-border overflow-hidden">
            {/* Vehicle headers */}
            <div className="grid grid-cols-3 border-b border-gwm-border">
              <div className="bg-gwm-light p-6" />
              {[vLeft, vRight].map((v) => (
                <div key={v.id} className="p-6 text-center border-l border-gwm-border">
                  <div className="relative h-28 mb-4">
                    <Image
                      src={v.hero}
                      alt={v.name}
                      fill
                      className="object-contain"
                      sizes="200px"
                    />
                  </div>
                  <p className="text-[0.65rem] text-gwm-gray tracking-widest uppercase">{v.version}</p>
                  <p className="text-gwm-dark font-black text-lg">{v.name}</p>
                  {v.badge && (
                    <span className="inline-block bg-gwm-red text-white text-[0.55rem] font-bold tracking-widest uppercase px-2 py-0.5 mt-1">
                      {v.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Spec rows */}
            {COMPARE_KEYS.map((key, i) => (
              <div
                key={key}
                className={`grid grid-cols-3 border-b border-gwm-border ${i % 2 === 0 ? "bg-white" : "bg-gwm-light/50"}`}
              >
                <div className="px-6 py-4 flex items-center">
                  <span className="text-gwm-gray text-xs font-semibold tracking-wide uppercase">{key}</span>
                </div>
                {[vLeft, vRight].map((v) => (
                  <div key={v.id} className="px-6 py-4 text-center border-l border-gwm-border flex items-center justify-center">
                    <span className="text-gwm-dark text-sm font-medium">
                      {v.compareSpecs[key] ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            ))}

            {/* CTA row */}
            <div className="grid grid-cols-3 bg-gwm-light">
              <div className="p-6" />
              {[vLeft, vRight].map((v) => (
                <div key={v.id} className="p-6 border-l border-gwm-border">
                  <a
                    href={whatsappLink(siteConfig.whatsapp, `Olá Alex! Tenho interesse no ${v.name} ${v.version}. Pode me enviar mais detalhes?`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-gwm-red text-white text-[0.65rem] font-bold tracking-widest uppercase px-4 py-3 text-center hover:bg-[#c5000f] transition-colors"
                  >
                    Quero Este
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
