"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, ArrowRight, Search, Activity, Lock, Zap, TrendingUp, CheckCircle, AlertTriangle, Eye, Github } from "lucide-react";
import Navbar from "@/components/ui/Navbar";

/* ── ticker data ─────────────────────────────────────────────────────────── */
const TICKER = [
  { sym: "USDT", score: 82, lvl: "SAFE" },
  { sym: "PEPE", score: 24, lvl: "HIGH" },
  { sym: "USDC", score: 85, lvl: "SAFE" },
  { sym: "SHIB", score: 41, lvl: "MED"  },
  { sym: "LINK", score: 74, lvl: "SAFE" },
  { sym: "RUG2", score: 8,  lvl: "HIGH" },
  { sym: "UNI",  score: 71, lvl: "SAFE" },
  { sym: "SCAM", score: 12, lvl: "HIGH" },
  { sym: "DAI",  score: 78, lvl: "SAFE" },
  { sym: "AAVE", score: 73, lvl: "SAFE" },
];

/* ── feature cards (bottom row like ChainFund) ───────────────────────────── */
const FEATURES = [
  {
    icon: <Activity className="w-5 h-5" />,
    title: "On-Chain Analysis",
    desc: "Live blockchain data via Alchemy & Moralis for holder distribution and wallet activity.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Contract Security",
    desc: "Groq LLaMA3 translates complex risk data into plain English for every investor.",
  },
];

/* ── 3D floating token icons ─────────────────────────────────────────────── */
function FloatingCard({ cls, color, symbol, delay }: { cls: string; color: string; symbol: string; delay: string }) {
  return (
    <div
      className={`absolute ${cls} w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl`}
      style={{
        background: `linear-gradient(135deg, ${color}22, ${color}44)`,
        border: `1px solid ${color}55`,
        boxShadow: `0 8px 32px ${color}33, inset 0 1px 0 ${color}44`,
        animation: `float1 ${delay} ease-in-out infinite`,
        backdropFilter: "blur(12px)",
      }}
    >
      <span className="text-3xl font-black" style={{ color }}>{symbol}</span>
    </div>
  );
}

export default function LandingPage() {
  const [scanInput, setScanInput] = useState("");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const tickerDouble = [...TICKER, ...TICKER];

  return (
    <div className="min-h-screen" style={{ background: "var(--dash-bg)" }}>
      {/* ── NAVBAR ──────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b"
        style={{
          background: "rgba(15,16,16,0.92)",
          borderColor: "var(--dash-border)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#c8f135" }}>
              <Shield className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">
              Rug<span style={{ color: "#c8f135" }}>Sentinel</span>
            </span>
          </div>
          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: "/", label: "Home" },
              { href: "/how-it-works", label: "How It Works" },
              { href: "/features", label: "Features" },
              { href: "/scan", label: "Scan" },
              { href: "/history", label: "History" },
            ].map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3.5 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: l.href === "/" ? "rgba(200,241,53,0.1)" : "transparent",
                  color: l.href === "/" ? "#c8f135" : "#6b7070",
                  border: l.href === "/" ? "1px solid rgba(200,241,53,0.2)" : "1px solid transparent",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          {/* Right */}
          <div className="flex items-center gap-3">
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono"
              style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
              Live
            </div>
            <a
              href="https://github.com/Madubuezejoshua/RUGSENTINEL"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex p-2 rounded-lg transition-all"
              style={{ color: "#6b7070", border: "1px solid #252828" }}
            >
              <Github className="w-4 h-4" />
            </a>
            <Link href="/scan" className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all" style={{ background: "#c8f135", color: "#0f1010" }}>
              Scan Now
            </Link>
          </div>
        </div>
      </nav>

      {/* ── TICKER ──────────────────────────────────────────────────────── */}
      <div
        className="fixed top-14 left-0 right-0 z-40 overflow-hidden py-2 border-b"
        style={{ background: "rgba(15,16,16,0.85)", borderColor: "var(--dash-border)", backdropFilter: "blur(10px)" }}
      >
        <div className="ticker-track flex gap-8 whitespace-nowrap">
          {tickerDouble.map((t, i) => {
            const c = t.lvl === "SAFE" ? "#10b981" : t.lvl === "MED" ? "#f59e0b" : "#ef4444";
            return (
              <span key={i} className="inline-flex items-center gap-2 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: c }} />
                <span className="text-white font-semibold">{t.sym}</span>
                <span className="font-bold" style={{ color: c }}>{t.score}</span>
                <span style={{ color: "#252828" }}>|</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen dash-grid overflow-hidden"
        style={{ paddingTop: "9rem" }}
      >
        {/* Yellow-green radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 65% 45%, rgba(200,241,53,0.07) 0%, rgba(168,212,32,0.04) 50%, transparent 75%)",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, var(--dash-bg))" }}
        />

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-9rem)]">

            {/* LEFT: text */}
            <div className={`${mounted ? "fade-in" : "opacity-0"}`}>
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono mb-8"
                style={{ background: "rgba(200,241,53,0.08)", border: "1px solid rgba(200,241,53,0.25)", color: "#c8f135" }}
              >
                <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "#c8f135" }} />
                12,400+ tokens analyzed
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-white mb-6">
                Detect Rug Pulls<br />
                <span style={{ color: "#c8f135", textShadow: "0 0 40px rgba(200,241,53,0.4)" }}>
                  Before They Happen
                </span>
              </h1>

              <p className="text-lg mb-10 leading-relaxed max-w-lg" style={{ color: "#6b7070" }}>
                Real-time Web3 security intelligence. Analyze any ERC-20 token contract and get an AI-powered risk score in seconds.
              </p>

              {/* Scan input */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6b7070" }} />
                  <input
                    type="text"
                    value={scanInput}
                    onChange={e => setScanInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && scanInput.trim()) {
                        sessionStorage.setItem("prefill_address", scanInput.trim());
                        window.location.href = "/scan";
                      }
                    }}
                    placeholder="Paste contract address 0x..."
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-[#6b7070] font-mono text-sm focus:outline-none transition-all"
                    style={{
                      background: "#111313",
                      border: "1px solid var(--dash-border)",
                    }}
                    spellCheck={false}
                  />
                </div>
                <Link
                  href="/scan"
                  onClick={() => scanInput.trim() && sessionStorage.setItem("prefill_address", scanInput.trim())}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 text-sm flex-shrink-0 rounded-xl font-bold transition-all"
                  style={{ background: "#c8f135", color: "#0f1010" }}
                >
                  Get Started →
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6">
                {[
                  { icon: <CheckCircle className="w-4 h-4" />, label: "4 Data Sources" },
                  { icon: <Shield className="w-4 h-4" />,       label: "AI-Powered" },
                  { icon: <TrendingUp className="w-4 h-4" />,   label: "Real-Time" },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-2 text-sm" style={{ color: "#6b7070" }}>
                    <span style={{ color: "#c8f135" }}>{b.icon}</span>
                    {b.label}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: 3D floating cards */}
            <div className="relative h-[480px] hidden lg:block">
              {/* Glow orb */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(200,241,53,0.12) 0%, transparent 70%)", filter: "blur(40px)" }}
              />

              {/* Floating token cards */}
              <div
                className="absolute top-16 right-16 w-28 h-28 rounded-2xl flex flex-col items-center justify-center gap-1 float1"
                style={{
                  background: "linear-gradient(135deg, rgba(200,241,53,0.12), rgba(168,212,32,0.2))",
                  border: "1px solid rgba(200,241,53,0.3)",
                  boxShadow: "0 16px 48px rgba(200,241,53,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <span className="text-3xl">🛡️</span>
                <span className="text-xs font-bold text-white">SAFE</span>
                <span className="text-xs font-black" style={{ color: "#10b981" }}>82/100</span>
              </div>

              <div
                className="absolute top-40 right-4 w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-1 float2"
                style={{
                  background: "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.2))",
                  border: "1px solid rgba(239,68,68,0.3)",
                  boxShadow: "0 12px 36px rgba(239,68,68,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <span className="text-2xl">⚠️</span>
                <span className="text-xs font-bold text-white">HIGH</span>
                <span className="text-xs font-black text-red-400">18/100</span>
              </div>

              <div
                className="absolute top-56 right-32 w-32 h-32 rounded-2xl flex flex-col items-center justify-center gap-1 float3"
                style={{
                  background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.2))",
                  border: "1px solid rgba(16,185,129,0.3)",
                  boxShadow: "0 16px 48px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <span className="text-3xl">✅</span>
                <span className="text-xs font-bold text-white">VERIFIED</span>
                <span className="text-xs font-black" style={{ color: "#10b981" }}>74/100</span>
              </div>

              <div
                className="absolute bottom-24 right-20 w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 float1"
                style={{
                  background: "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.2))",
                  border: "1px solid rgba(245,158,11,0.3)",
                  boxShadow: "0 8px 24px rgba(245,158,11,0.15)",
                  animationDelay: "2s",
                }}
              >
                <span className="text-xl">🔍</span>
                <span className="text-xs font-black text-yellow-400">MED</span>
              </div>

              {/* Connecting lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 400 480">
                <line x1="280" y1="80" x2="220" y2="200" stroke="#c8f135" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="220" y1="200" x2="300" y2="320" stroke="#c8f135" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="300" y1="320" x2="260" y2="400" stroke="#c8f135" strokeWidth="1" strokeDasharray="4 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── BOTTOM FEATURE CARDS ──────────────────────────────────────── */}
        <div
          className="relative border-t"
          style={{ borderColor: "var(--dash-border)", background: "rgba(22,24,24,0.8)", backdropFilter: "blur(10px)" }}
        >
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x" style={{ borderColor: "var(--dash-border)" }}>
              {FEATURES.map((f, i) => (
                <div key={i} className="flex items-start gap-4 px-6 py-4 first:pl-0 last:pr-0">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(200,241,53,0.1)", border: "1px solid rgba(200,241,53,0.2)", color: "#c8f135" }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-1">{f.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "#6b7070" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS SECTION ───────────────────────────────────────────────── */}
      <section className="py-20 px-6 dash-grid" style={{ background: "var(--dash-surface)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Trusted Security Intelligence</h2>
            <p className="text-sm" style={{ color: "#6b7070" }}>Powered by industry-leading blockchain data providers</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: "12,400+", label: "Tokens Scanned" },
              { val: "6",       label: "Risk Factors" },
              { val: "4",       label: "Data Sources" },
              { val: "<10s",    label: "Scan Speed" },
            ].map(s => (
              <div
                key={s.label}
                className="text-center p-6 rounded-2xl"
                style={{ background: "var(--dash-card)", border: "1px solid var(--dash-border)" }}
              >
                <p className="text-4xl font-black mb-2" style={{ color: "#c8f135" }}>{s.val}</p>
                <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "#6b7070" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────── */}
      <section className="py-20 px-6" style={{ background: "var(--dash-bg)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">How RugSentinel Works</h2>
            <p className="text-sm" style={{ color: "#6b7070" }}>Three steps to protect your investment</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Paste Contract Address", desc: "Enter any ERC-20 token contract address from Ethereum mainnet.", icon: "📋" },
              { step: "02", title: "Multi-Source Analysis",  desc: "We query Alchemy, Moralis, Etherscan & CoinMarketCap simultaneously.", icon: "🔬" },
              { step: "03", title: "Get Risk Score + AI",    desc: "Receive a 0–100 score with AI explanation in plain English.", icon: "🤖" },
            ].map(s => (
              <div
                key={s.step}
                className="relative p-6 rounded-2xl card-hover"
                style={{ background: "var(--dash-card)", border: "1px solid var(--dash-border)" }}
              >
                <div
                  className="text-xs font-black font-mono mb-4 px-2.5 py-1 rounded-full inline-block"
                  style={{ background: "rgba(200,241,53,0.1)", color: "#c8f135", border: "1px solid rgba(200,241,53,0.2)" }}
                >
                  STEP {s.step}
                </div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="text-base font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6b7070" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RISK LEVELS ─────────────────────────────────────────────────── */}
      <section className="py-20 px-6 dash-grid" style={{ background: "var(--dash-surface)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-3">Risk Score Guide</h2>
            <p className="text-sm" style={{ color: "#6b7070" }}>What your score means in plain English</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { range: "70–100", level: "SAFE",      color: "#10b981", bg: "rgba(16,185,129,0.06)",  border: "rgba(16,185,129,0.2)",  desc: "Passes all major security checks. Low rug pull risk.", ex: "USDT · USDC · DAI" },
              { range: "40–69",  level: "MEDIUM",    color: "#f59e0b", bg: "rgba(245,158,11,0.06)",  border: "rgba(245,158,11,0.2)",  desc: "Some flags detected. Proceed with caution and DYOR.", ex: "Newer DeFi tokens" },
              { range: "0–39",   level: "HIGH RISK", color: "#ef4444", bg: "rgba(239,68,68,0.06)",   border: "rgba(239,68,68,0.2)",   desc: "Multiple red flags. High probability of scam.", ex: "Unverified meme coins" },
            ].map(r => (
              <div key={r.level} className="rounded-2xl p-6" style={{ background: r.bg, border: `1px solid ${r.border}` }}>
                <div className="text-4xl font-black mb-3" style={{ color: r.color }}>{r.range}</div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4"
                  style={{ border: `1px solid ${r.border}`, color: r.color }}
                >
                  <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: r.color }} />
                  {r.level}
                </div>
                <p className="text-sm mb-3 leading-relaxed" style={{ color: "#6b7070" }}>{r.desc}</p>
                <p className="text-xs font-mono" style={{ color: r.color }}>e.g. {r.ex}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 text-center relative overflow-hidden" style={{ background: "var(--dash-bg)" }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,241,53,0.06) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-2xl mx-auto">
          <AlertTriangle className="w-12 h-12 mx-auto mb-6" style={{ color: "#f59e0b" }} />
          <h2 className="text-4xl font-black text-white mb-4">Don&apos;t Get Rugged</h2>
          <p className="mb-10 leading-relaxed" style={{ color: "#6b7070" }}>
            Thousands of scam tokens launch every week. RugSentinel gives you the intelligence to protect your investments before it&apos;s too late.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/scan"
              className="flex items-center gap-2 px-10 py-4 text-base rounded-xl font-bold transition-all"
              style={{ background: "#c8f135", color: "#0f1010" }}
            >
              <Shield className="w-5 h-5" />
              Start Scanning Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/history"
              className="flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold transition-all"
              style={{ border: "1px solid var(--dash-border)", color: "#6b7070" }}
            >
              <Eye className="w-4 h-4" />
              View Scan History
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t py-8 px-6" style={{ borderColor: "var(--dash-border)", background: "var(--dash-surface)" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "#c8f135" }}>
              <Shield className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-bold text-white">Rug<span style={{ color: "#c8f135" }}>Sentinel</span></span>
          </div>
          <p className="text-xs text-center" style={{ color: "#4a5050" }}>For informational purposes only. Not financial advice. Always DYOR.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/Madubuezejoshua/RUGSENTINEL"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs transition-all hover:text-white"
              style={{ color: "#6b7070" }}
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
            <span style={{ color: "#252828" }}>·</span>
            <p className="text-xs" style={{ color: "#4a5050" }}>Built with Next.js · Groq AI · Web3 APIs</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
