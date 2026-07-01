"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  href?: string;
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  onClick,
  href,
  icon,
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 font-semibold rounded-[18px] transition-all duration-300 cursor-pointer select-none no-underline";

  const variants = {
    primary:
      "bg-[#7C3AED] text-white hover:bg-[#8B5CF6] hover:shadow-[0_8px_32px_rgba(124,58,237,0.35)]",
    ghost:
      "bg-white/[0.04] border border-white/10 text-[#9CA3AF] hover:bg-white/[0.08] hover:text-white",
    outline:
      "border border-[rgba(124,58,237,0.3)] text-[#A78BFA] hover:bg-[rgba(124,58,237,0.08)]",
  };

  const sizes = {
    sm: "text-[13px] px-4 py-2",
    md: "text-[15px] px-6 py-3",
    lg: "text-[16px] px-9 py-[18px] rounded-[20px]",
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  const content = (
    <>
      {children}
      {icon && <span className="w-3.5 h-3.5">{icon}</span>}
    </>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      className={classes}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      {content}
    </motion.button>
  );
}
