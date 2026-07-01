"use client";

import { useState, useRef } from "react";
import { vehicles as initialVehicles, testimonials as initialTestimonials, siteConfig as initialConfig } from "@/lib/data";
import type { Vehicle } from "@/lib/data";
import {
  Car, Star, Settings, ImageIcon, LogOut, Plus, Edit2, Trash2, Save,
  ChevronRight, Upload, CheckCircle2, Home, BarChart2
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "dashboard" | "vehicles" | "testimonials" | "gallery" | "config";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [saved, setSaved] = useState(false);
  const [vehicleData, setVehicleData] = useState<Vehicle[]>(initialVehicles);
  const [testimonialData, setTestimonialData] = useState([...initialTestimonials]);
  const [config, setConfig] = useState({ ...initialConfig });
  const [editingVehicle, setEditingVehicle] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (password === "alex2024") setAuthed(true);
    else alert("Senha incorreta");
  }

  function showSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function updateVehicle(id: string, field: keyof Vehicle, value: unknown) {
    setVehicleData((prev) =>
      prev.map((v) => v.id === id ? { ...v, [field]: value } : v)
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gwm-dark flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-0.5 h-7 bg-gwm-red" />
            <div>
              <p className="text-white font-black text-sm tracking-widest uppercase">Alex Messias</p>
              <p className="text-white/30 text-[0.65rem]">Área Administrativa</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-white/40 text-[0.65rem] tracking-widest uppercase block mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-gwm-red transition-colors placeholder:text-white/20"
                placeholder="••••••••"
                autoFocus
              />
            </div>
            <button type="submit" className="w-full bg-gwm-red text-white font-bold text-sm tracking-widest uppercase py-4 hover:bg-[#c5000f] transition-colors">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Painel", icon: <Home size={15} /> },
    { id: "vehicles", label: "Veículos", icon: <Car size={15} /> },
    { id: "testimonials", label: "Depoimentos", icon: <Star size={15} /> },
    { id: "gallery", label: "Galeria", icon: <ImageIcon size={15} /> },
    { id: "config", label: "Configurações", icon: <Settings size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-gwm-light flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gwm-dark flex flex-col shrink-0">
        <div className="px-5 py-6 border-b border-white/5">
          <p className="text-white font-black text-xs tracking-widest uppercase">Alex Messias</p>
          <p className="text-white/30 text-[0.6rem] mt-0.5">Admin v3</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold tracking-wide uppercase transition-colors",
                tab === t.id ? "bg-gwm-red text-white" : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/5">
          <a href="/" target="_blank" className="flex items-center gap-2 px-4 py-2.5 text-white/30 text-xs hover:text-white transition-colors">
            <BarChart2 size={14} />Ver Site
          </a>
          <button onClick={() => setAuthed(false)} className="flex items-center gap-2 px-4 py-2.5 text-white/30 text-xs hover:text-white transition-colors w-full">
            <LogOut size={14} />Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="bg-white border-b border-gwm-border px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gwm-gray">
            <span>Admin</span>
            <ChevronRight size={12} />
            <span className="text-gwm-dark font-semibold">{tabs.find((t) => t.id === tab)?.label}</span>
          </div>
          {saved && (
            <div className="flex items-center gap-2 text-gwm-red text-xs font-bold">
              <CheckCircle2 size={14} />Salvo com sucesso!
            </div>
          )}
        </div>

        <div className="p-8">

          {/* Dashboard */}
          {tab === "dashboard" && (
            <div>
              <h1 className="text-xl font-black text-gwm-dark uppercase tracking-wide mb-6">Painel Principal</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Veículos", value: vehicleData.length, color: "bg-gwm-red" },
                  { label: "Destaques", value: vehicleData.filter((v) => v.featured).length, color: "bg-gwm-dark" },
                  { label: "Depoimentos", value: testimonialData.length, color: "bg-gwm-dark" },
                  { label: "Modelos", value: "7", color: "bg-gwm-red" },
                ].map((s) => (
                  <div key={s.label} className={cn("p-5 text-white", s.color)}>
                    <p className="text-3xl font-black">{s.value}</p>
                    <p className="text-white/60 text-xs tracking-widest uppercase mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-gwm-border p-6">
                <h3 className="text-gwm-dark font-bold text-sm uppercase tracking-wide mb-4">Ações Rápidas</h3>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setTab("vehicles")} className="flex items-center gap-2 bg-gwm-red text-white text-xs font-bold tracking-widest uppercase px-5 py-2.5 hover:bg-[#c5000f] transition-colors">
                    <Plus size={13} />Novo Veículo
                  </button>
                  <button onClick={() => setTab("testimonials")} className="flex items-center gap-2 border border-gwm-border text-gwm-gray-mid text-xs font-bold tracking-widest uppercase px-5 py-2.5 hover:border-gwm-dark hover:text-gwm-dark transition-all">
                    <Plus size={13} />Novo Depoimento
                  </button>
                  <button onClick={() => setTab("config")} className="flex items-center gap-2 border border-gwm-border text-gwm-gray-mid text-xs font-bold tracking-widest uppercase px-5 py-2.5 hover:border-gwm-dark hover:text-gwm-dark transition-all">
                    <Settings size={13} />Configurações
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Vehicles */}
          {tab === "vehicles" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-black text-gwm-dark uppercase tracking-wide">Veículos</h1>
                <button className="flex items-center gap-2 bg-gwm-red text-white text-xs font-bold tracking-widest uppercase px-4 py-2.5 hover:bg-[#c5000f] transition-colors">
                  <Plus size={13} />Novo Veículo
                </button>
              </div>

              <div className="space-y-3">
                {vehicleData.map((v) => (
                  <div key={v.id} className="bg-white border border-gwm-border">
                    <div
                      className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gwm-light/50 transition-colors"
                      onClick={() => setEditingVehicle(editingVehicle === v.id ? null : v.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-10 bg-gwm-light overflow-hidden shrink-0">
                          <img src={v.hero} alt={v.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-gwm-dark font-bold text-sm">{v.name} <span className="text-gwm-gray font-normal">{v.version}</span></p>
                          <p className="text-gwm-gray text-xs">{v.category} · {v.featured ? "Em destaque" : "Não destacado"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {v.badge && (
                          <span className="bg-gwm-red text-white text-[0.55rem] font-bold tracking-widest uppercase px-2 py-0.5">
                            {v.badge}
                          </span>
                        )}
                        <ChevronRight size={16} className={cn("text-gwm-gray transition-transform", editingVehicle === v.id && "rotate-90")} />
                      </div>
                    </div>

                    {editingVehicle === v.id && (
                      <div className="border-t border-gwm-border p-6 bg-gwm-light/30">
                        <div className="grid md:grid-cols-2 gap-4">
                          {[
                            { field: "name", label: "Nome" },
                            { field: "version", label: "Versão" },
                            { field: "category", label: "Categoria" },
                            { field: "tagline", label: "Tagline" },
                            { field: "price", label: "Preço" },
                            { field: "badge", label: "Badge" },
                          ].map(({ field, label }) => (
                            <div key={field}>
                              <label className="text-gwm-gray text-[0.6rem] tracking-widest uppercase block mb-1">{label}</label>
                              <input
                                value={(v[field as keyof Vehicle] as string) ?? ""}
                                onChange={(e) => updateVehicle(v.id, field as keyof Vehicle, e.target.value)}
                                className="w-full bg-white border border-gwm-border text-gwm-dark text-sm px-3 py-2 focus:outline-none focus:border-gwm-dark transition-colors"
                              />
                            </div>
                          ))}
                          <div className="md:col-span-2">
                            <label className="text-gwm-gray text-[0.6rem] tracking-widest uppercase block mb-1">Descrição</label>
                            <textarea
                              value={v.description}
                              rows={3}
                              onChange={(e) => updateVehicle(v.id, "description", e.target.value)}
                              className="w-full bg-white border border-gwm-border text-gwm-dark text-sm px-3 py-2 focus:outline-none focus:border-gwm-dark transition-colors resize-none"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              id={`feat-${v.id}`}
                              checked={v.featured}
                              onChange={(e) => updateVehicle(v.id, "featured", e.target.checked)}
                              className="accent-gwm-red w-4 h-4"
                            />
                            <label htmlFor={`feat-${v.id}`} className="text-gwm-gray-mid text-sm">Em Destaque</label>
                          </div>
                        </div>

                        {/* Specs editor */}
                        <div className="mt-6">
                          <p className="text-gwm-gray text-[0.6rem] tracking-widest uppercase mb-3">Ficha Técnica</p>
                          <div className="space-y-2">
                            {v.specs.map((s, si) => (
                              <div key={si} className="grid grid-cols-2 gap-2">
                                <input
                                  value={s.label}
                                  onChange={(e) => {
                                    const ns = [...v.specs];
                                    ns[si] = { ...ns[si], label: e.target.value };
                                    updateVehicle(v.id, "specs", ns);
                                  }}
                                  className="bg-white border border-gwm-border text-gwm-gray text-xs px-3 py-2 focus:outline-none"
                                  placeholder="Campo"
                                />
                                <input
                                  value={s.value}
                                  onChange={(e) => {
                                    const ns = [...v.specs];
                                    ns[si] = { ...ns[si], value: e.target.value };
                                    updateVehicle(v.id, "specs", ns);
                                  }}
                                  className="bg-white border border-gwm-border text-gwm-dark text-xs px-3 py-2 focus:outline-none"
                                  placeholder="Valor"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-5 border-t border-gwm-border">
                          <button
                            onClick={showSaved}
                            className="flex items-center gap-2 bg-gwm-red text-white text-xs font-bold tracking-widest uppercase px-5 py-2.5 hover:bg-[#c5000f] transition-colors"
                          >
                            <Save size={12} />Salvar
                          </button>
                          <button className="flex items-center gap-2 text-gwm-gray text-xs hover:text-red-500 transition-colors">
                            <Trash2 size={12} />Excluir
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Testimonials */}
          {tab === "testimonials" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-black text-gwm-dark uppercase tracking-wide">Depoimentos</h1>
                <button className="flex items-center gap-2 bg-gwm-red text-white text-xs font-bold tracking-widest uppercase px-4 py-2.5 hover:bg-[#c5000f] transition-colors">
                  <Plus size={13} />Novo Depoimento
                </button>
              </div>
              <div className="space-y-3">
                {testimonialData.map((t, i) => (
                  <div key={t.id} className="bg-white border border-gwm-border p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { field: "name", label: "Nome" },
                        { field: "location", label: "Cidade" },
                        { field: "vehicle", label: "Veículo Comprado" },
                      ].map(({ field, label }) => (
                        <div key={field}>
                          <label className="text-gwm-gray text-[0.6rem] tracking-widest uppercase block mb-1">{label}</label>
                          <input
                            value={t[field as keyof typeof t] as string}
                            onChange={(e) => {
                              const nd = [...testimonialData];
                              nd[i] = { ...nd[i], [field]: e.target.value };
                              setTestimonialData(nd);
                            }}
                            className="w-full bg-gwm-light border border-gwm-border text-gwm-dark text-sm px-3 py-2 focus:outline-none focus:border-gwm-dark"
                          />
                        </div>
                      ))}
                      <div>
                        <label className="text-gwm-gray text-[0.6rem] tracking-widest uppercase block mb-1">Avaliação</label>
                        <select
                          value={t.rating}
                          onChange={(e) => {
                            const nd = [...testimonialData];
                            nd[i] = { ...nd[i], rating: Number(e.target.value) };
                            setTestimonialData(nd);
                          }}
                          className="w-full bg-gwm-light border border-gwm-border text-gwm-dark text-sm px-3 py-2 focus:outline-none"
                        >
                          {[5, 4, 3].map((r) => <option key={r} value={r}>{r} estrelas</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-gwm-gray text-[0.6rem] tracking-widest uppercase block mb-1">Texto</label>
                        <textarea
                          value={t.text}
                          rows={3}
                          onChange={(e) => {
                            const nd = [...testimonialData];
                            nd[i] = { ...nd[i], text: e.target.value };
                            setTestimonialData(nd);
                          }}
                          className="w-full bg-gwm-light border border-gwm-border text-gwm-dark text-sm px-3 py-2 focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gwm-border">
                      <button onClick={showSaved} className="flex items-center gap-2 bg-gwm-red text-white text-xs font-bold tracking-widest uppercase px-4 py-2 hover:bg-[#c5000f] transition-colors">
                        <Save size={12} />Salvar
                      </button>
                      <button className="text-gwm-gray text-xs hover:text-red-500 transition-colors flex items-center gap-1">
                        <Trash2 size={12} />Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gallery */}
          {tab === "gallery" && (
            <div>
              <h1 className="text-xl font-black text-gwm-dark uppercase tracking-wide mb-6">Galeria</h1>
              <input type="file" ref={fileRef} className="hidden" multiple accept="image/*" />
              <div
                className="bg-white border-2 border-dashed border-gwm-border hover:border-gwm-red transition-colors p-16 text-center cursor-pointer mb-6"
                onClick={() => fileRef.current?.click()}
              >
                <Upload size={28} className="text-gwm-gray mx-auto mb-3" />
                <p className="text-gwm-gray text-sm mb-2">Arraste imagens ou clique para fazer upload</p>
                <p className="text-gwm-gray text-xs">PNG, JPG, WebP, AVIF — máx. 10MB por arquivo</p>
                <button className="mt-4 bg-gwm-red text-white text-xs font-bold tracking-widest uppercase px-5 py-2.5 hover:bg-[#c5000f] transition-colors">
                  Selecionar Imagens
                </button>
              </div>
              <div className="bg-white border border-gwm-border p-5">
                <p className="text-gwm-gray text-xs leading-relaxed">
                  As imagens enviadas ficam em <code className="text-gwm-red bg-gwm-light px-1">/public/images/gallery/</code> e aparecem automaticamente na galeria do site após o próximo deploy.
                  Para as fotos de veículos específicos, use as pastas <code className="text-gwm-red bg-gwm-light px-1">/public/cars/[modelo]/</code>.
                </p>
              </div>
            </div>
          )}

          {/* Config */}
          {tab === "config" && (
            <div className="max-w-2xl">
              <h1 className="text-xl font-black text-gwm-dark uppercase tracking-wide mb-6">Configurações</h1>
              <div className="bg-white border border-gwm-border p-6 space-y-4 mb-4">
                <h3 className="text-gwm-dark font-bold text-xs uppercase tracking-wide border-b border-gwm-border pb-3">Contato</h3>
                {[
                  { field: "whatsapp", label: "WhatsApp (com DDI, sem +)", placeholder: "5519999999999" },
                  { field: "phone", label: "Telefone (exibição)", placeholder: "(19) 9 9999-9999" },
                  { field: "email", label: "E-mail", placeholder: "alex@exemplo.com" },
                  { field: "instagram", label: "Instagram URL", placeholder: "https://instagram.com/..." },
                ].map(({ field, label, placeholder }) => (
                  <div key={field}>
                    <label className="text-gwm-gray text-[0.6rem] tracking-widest uppercase block mb-1">{label}</label>
                    <input
                      value={config[field as keyof typeof config] as string}
                      onChange={(e) => setConfig({ ...config, [field]: e.target.value })}
                      className="w-full bg-gwm-light border border-gwm-border text-gwm-dark text-sm px-3 py-2.5 focus:outline-none focus:border-gwm-dark transition-colors"
                      placeholder={placeholder}
                    />
                  </div>
                ))}
              </div>
              <button onClick={showSaved} className="flex items-center gap-2 bg-gwm-red text-white text-xs font-bold tracking-widest uppercase px-6 py-3 hover:bg-[#c5000f] transition-colors">
                <Save size={13} />Salvar Configurações
              </button>
              <div className="mt-4 bg-gwm-light border border-gwm-border p-4">
                <p className="text-gwm-gray text-xs leading-relaxed">
                  <strong className="text-gwm-dark">Atenção:</strong> Para as alterações persistirem no deploy, é necessário atualizar o arquivo <code className="text-gwm-red">src/lib/data.ts</code>. Em uma próxima versão isso será conectado a um banco de dados em tempo real.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
