import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Landing palette (navy/purple) ── */
        "land-bg":      "#0a0b1a",
        "land-surface": "#0d0f24",
        "land-card":    "#111328",
        "land-border":  "#1e2240",
        "land-accent":  "#5b6ef5",
        "land-accent2": "#7c8ff7",

        /* ── Dashboard palette (dark + yellow-green) ── */
        background: "#0f1010",
        surface:    "#161818",
        card:       "#1a1c1c",
        border:     "#252828",
        accent:     "#c8f135",   /* yellow-green */
        "accent2":  "#a8d420",
        muted:      "#6b7070",
        subtle:     "#2e3030",

        /* ── Semantic ── */
        safe:         "#10b981",
        medium:       "#f59e0b",
        danger:       "#ef4444",
        "safe-dim":   "#064e3b",
        "medium-dim": "#78350f",
        "danger-dim": "#7f1d1d",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      animation: {
        "spin-slow":   "spin 8s linear infinite",
        "pulse-slow":  "pulse 3s ease-in-out infinite",
        "float1":      "float1 4s ease-in-out infinite",
        "float2":      "float2 5s ease-in-out infinite 0.8s",
        "float3":      "float3 3.5s ease-in-out infinite 1.5s",
        "ticker":      "ticker 28s linear infinite",
        "fade-in":     "fadeIn 0.5s ease-out forwards",
      },
      boxShadow: {
        "glow-blue":   "0 0 40px rgba(91,110,245,0.3)",
        "glow-green":  "0 0 30px rgba(200,241,53,0.25)",
        "glow-safe":   "0 0 20px rgba(16,185,129,0.3)",
        "glow-danger": "0 0 20px rgba(239,68,68,0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
