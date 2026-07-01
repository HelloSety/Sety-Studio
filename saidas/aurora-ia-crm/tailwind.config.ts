import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#09090B",
          sidebar: "#0F0F12",
          card: "#131318",
          hover: "#1A1A21",
          elevated: "#1E1E26",
        },
        aurora: {
          purple: "#7C3AED",
          glow: "#8B5CF6",
          green: "#25D366",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#A1A1AA",
          muted: "#52525B",
        },
        success: "#22C55E",
        danger: "#EF4444",
        warning: "#F59E0B",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        aurora: "0 0 0 1px rgba(124,58,237,0.25), 0 4px 24px rgba(124,58,237,0.2)",
        "aurora-glow": "0 0 40px rgba(124,58,237,0.3), 0 0 80px rgba(124,58,237,0.1)",
        "green-glow": "0 0 30px rgba(37,211,102,0.25)",
        card: "0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)",
        elevated: "0 4px 24px rgba(0,0,0,0.6)",
        float: "0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
        "float-purple": "0 8px 40px rgba(124,58,237,0.4), 0 0 60px rgba(124,58,237,0.2)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(124,58,237,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(124,58,237,0.6)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "fade-up": "fade-up 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
