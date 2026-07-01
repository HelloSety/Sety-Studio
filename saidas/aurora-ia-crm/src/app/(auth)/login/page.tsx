"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-[#09090B] flex items-center justify-center overflow-hidden relative">
      {/* Background orbs */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-[300px] h-[300px] rounded-full opacity-[0.03]"
        style={{ background: "radial-gradient(circle, #25D366 0%, transparent 70%)" }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[380px] px-4"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center mb-4"
            style={{ boxShadow: "0 0 40px rgba(124,58,237,0.4), 0 0 80px rgba(124,58,237,0.15)" }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <h1 className="text-[22px] font-bold text-white">Aurora IA CRM</h1>
          <p className="text-[13px] text-[#52525B] mt-1">Plataforma de vendas inteligente</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-7 border"
          style={{
            background: "rgba(19,19,24,0.8)",
            backdropFilter: "blur(24px)",
            borderColor: "rgba(255,255,255,0.06)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)",
          }}
        >
          <h2 className="text-[16px] font-semibold text-white mb-1">Entrar na conta</h2>
          <p className="text-[12px] text-[#52525B] mb-6">Bem-vindo de volta, Seven</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-medium text-[#52525B] block mb-1.5">E-mail</label>
              <input
                type="email"
                defaultValue="sevendsgnn@gmail.com"
                className="input-dark"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-[#52525B] block mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  defaultValue="••••••••"
                  className="input-dark pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3F3F46] hover:text-[#A1A1AA] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <label className="flex items-center gap-2 text-[#52525B] cursor-pointer">
                <input type="checkbox" defaultChecked className="w-3.5 h-3.5 accent-[#7C3AED]" />
                Lembrar de mim
              </label>
              <button type="button" className="text-[#7C3AED] hover:text-[#8B5CF6] transition-colors font-medium">
                Esqueci a senha
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all"
              style={{
                background: loading ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg, #7C3AED, #8B5CF6)",
                boxShadow: loading ? "none" : "0 4px 20px rgba(124,58,237,0.35)",
              }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Entrar <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-[#3F3F46] mt-6">
          Aurora IA CRM · Sety Studio · 2026
        </p>
      </motion.div>
    </div>
  );
}
