import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 13) {
    return `+${digits.slice(0,2)} (${digits.slice(2,4)}) ${digits.slice(4,9)}-${digits.slice(9)}`;
  }
  return phone;
}

export function timeAgo(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export function scoreToLabel(score: number): { label: string; color: string; emoji: string } {
  if (score >= 80) return { label: "Muito Quente", color: "text-red-400", emoji: "🔥🔥" };
  if (score >= 60) return { label: "Quente", color: "text-orange-400", emoji: "🔥" };
  if (score >= 40) return { label: "Morno", color: "text-yellow-400", emoji: "🟡" };
  return { label: "Frio", color: "text-slate-400", emoji: "⚪" };
}
