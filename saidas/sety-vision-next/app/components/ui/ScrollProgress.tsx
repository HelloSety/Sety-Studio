"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function ScrollProgress() {
  const [width, setWidth] = useState(0);
  const spring = useSpring(0, { stiffness: 180, damping: 30 });

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const pct = (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;
      spring.set(pct);
    };
    spring.on("change", (v) => setWidth(v));
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [spring]);

  return (
    <motion.div
      style={{
        position: "fixed", top: 0, left: 0, zIndex: 9999,
        height: 2.5,
        width: `${width}%`,
        background: "linear-gradient(90deg, #7C3AED, #A855F7, #D946EF)",
        boxShadow: "0 0 12px rgba(168,85,247,0.6)",
        transformOrigin: "left",
        borderRadius: "0 2px 2px 0",
      }}
    />
  );
}
