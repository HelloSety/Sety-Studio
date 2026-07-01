"use client";

import { useEffect, useRef } from "react";

/* ── Mouse Glow ──────────────────────────────────────────────── */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rx = e.clientX / window.innerWidth;
      // Shift color left→right: purple → blue → pink
      const stops =
        rx < 0.33
          ? ["rgba(139,92,246,0.12)", "rgba(124,58,237,0.05)"]
          : rx < 0.66
          ? ["rgba(142,197,255,0.10)", "rgba(124,58,237,0.04)"]
          : ["rgba(214,70,239,0.10)", "rgba(217,70,239,0.04)"];

      ref.current.style.background =
        `radial-gradient(640px circle at ${e.clientX}px ${e.clientY}px, ${stops[0]} 0%, ${stops[1]} 30%, transparent 60%)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "fixed", inset: 0,
        pointerEvents: "none", zIndex: 1,
        transition: "background 0.15s ease",
      }}
    />
  );
}
