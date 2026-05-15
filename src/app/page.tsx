"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield, Zap, Lock, TrendingUp, ArrowRight, Activity,
  Eye, AlertTriangle, ExternalLink, RefreshCw, CheckCircle,
  XCircle, Clock, Users, BarChart2, Search
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";

// ─── Static data ─────────────────────────────────────────────────────────────

const features = [
  {
    icon: <Activity className="w-5 h-5" />,
    title: "Real-Time Blockchain Analysis",
    description: "Pulls live data from Alchemy, Moralis, and Etherscan to analyze wallet activity, holder distribution, and contract safety.",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Market Intelligence",
    description: "Integrates CoinMarketCap data to detect abnormal trading volumes, low liquidity, and suspicious price movements.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Contract Security Audit",
    description: "Checks contract verification status, ownership renouncement, proxy patterns, and source code availability.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "AI-Powered Explanations",
    description: "Groq LLaMA3 AI translates complex risk data into plain English so any investor can understand the risks.",
  },
];

const KNOWN_TOKENS = [
  {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    name: "Tether USD",
    symbol: "USDT",
    score: 82,
    level: "SAFE" as const,
    holders: "4.8M",
    age: "3,650 days",
    verified: true,
    renounced: false,
    topHolder: "8.2%",
  },
  {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    name: "USD Coin",
    symbol: "USDC",
    score: 85,
    level: "SAFE" as const,
    holders: "2.1M",
    age: "2,190 days",
    verified: true,
    renounced: false,
    topHolder: "6.1%",
  },
  {
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    name: "Dai Stablecoin",
    symbol: "DAI",
    score: 78,
    level: "SAFE" as const,
    holders: "520K",
    age: "2,100 days",
    verified: true,
    renounced: true,
    topHolder: "12.4%",
  },
  {
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    name: "Wrapped BTC",
    symbol: "WBTC",
    score: 76,
    level: "SAFE" as const,
    holders: "89K",
    age: "1,825 days",
    verified: true,
    renounced: false,
    topHolder: "18.7%",
  },
  {
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    name: "Chainlink",
    symbol: "LINK",
    score: 74,
    level: "SAFE" as const,
    holders: "680K",
    age: "2,555 days",
    verified: true,
    renounced: false,
    topHolder: "22.1%",
  },
  {
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    name: "Uniswap",
    symbol: "UNI",
    score: 71,
    level: "SAFE" as const,
    holders: "370K",
    age: "1,700 days",
    verified: true,
    renounced: false,
    topHolder: "41.2%",
  },
  {
    address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    name: "Aave",
    symbol: "AAVE",
    score: 73,
    level: "SAFE" as const,
    holders: "145K",
    age: "1,600 days",
    verified: true,
    renounced: false,
    topHolder: "19.8%",
  },
  {
    address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
    name: "Compound",
    symbol: "COMP",
    score: 68,
    level: "MEDIUM" as const,
    holders: "210K",
    age: "1,825 days",
    verified: true,
    renounced: false,
    topHolder: "28.3%",
  },
];

// Simulated "recently scanned" feed
const RECENT_SCANS = [
  { symbol: "PEPE", score: 38, level: "HIGH" as const, time: "2m ago" },
  { symbol: "USDT", score: 82, level: "SAFE" as const, time: "5m ago" },
  { symbol: "SHIB", score: 44, level: "MEDIUM" as const, time: "8m ago" },
  { symbol: "LINK", score: 74, level: "SAFE" as const, time: "11m ago" },
  { symbol: "SCAM", score: 12, level: "HIGH" as const, time: "14m ago" },
  { symbol: "UNI",  score: 71, level: "SAFE" as const, time: "17m ago" },
  { symbol: "RUG2", score: 8,  level: "HIGH" as const, time: "20m ago" },
  { symbol: "DAI",  score: 78, level: "SAFE" as const, time: "23m ago" },
];

// ─── Helper components ────────────────────────────────────────────────────────

function ScorePill({ score, level }: { score: number; level: "SAFE" | "MEDIUM" | "HIGH" }) {
  const cfg = {
    SAFE:   { bg: "bg-safe/10",   text: "text-safe",   border: "border-safe/30",   dot: "bg-safe" },
    MEDIUM: { bg: "bg-medium/10", text: "text-medium", border: "border-medium/30", dot: "bg-medium" },
    HIGH:   { bg: "bg-danger/10", text: "text-danger",  border: "border-danger/30",  dot: "bg-danger" },
  }[level];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {score}
    </span>
  );
}

function MiniBar({ score }: { score: number }) {
  const color = score >= 70 ? "#10b981" : score >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="w-full h-1.5 rounded-full bg-surface overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${score}%`, background: color }} />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [scanInput, setScanInput] = useState("");
  const [tickerIndex, setTickerIndex] = useState(0);
  const [visibleTokens, setVisibleTokens] = useState(6);

  // Rotate ticker every 3s
  useEffect(() => {
    const t = setInterval(() => setTickerIndex(i => (i + 1) % RECENT_SCANS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const tickerItem = RECENT_SCANS[tickerIndex];
  const tickerColor = tickerItem.level === "SAFE" ? "text-safe" : tickerItem.level === "MEDIUM" ? "text-medium" : "text-danger";

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Navbar />

      {/* ── LIVE TICKER BAR ─────────────────────────────────────────────── */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-surface/90 backdrop-blur border-b border-border py-1.5 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-6 overflow-x-auto scrollbar-none">
          <span className="text-xs text-muted font-mono uppercase tracking-widest flex-shrink-0 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
            Live Scans
          </span>
          <div className="flex items-center gap-4 flex-shrink-0">
            {RECENT_SCANS.map((s, i) => {
              const c = s.level === "SAFE" ? "text-safe" : s.level === "MEDIUM" ? "text-medium" : "text-danger";
              return (
                <span key={i} className="flex items-center gap-1.5 text-xs font-mono flex-shrink-0">
                  <span className="text-muted">{s.symbol}</span>
                  <span className={`font-bold ${c}`}>{s.score}</span>
                  <span className="text-muted/40">{s.time}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-16 px-4 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-danger/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-mono mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Web3 Security Intelligence Platform
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6">
            <span className="text-white">Rug</span>
            <span className="text-accent" style={{ textShadow: "0 0 40px rgba(99,102,241,0.5)" }}>Sentinel</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto mb-4 leading-relaxed">
            Detect rug pulls <span className="text-white font-semibold">before they happen</span>
          </p>
          <p className="text-base text-muted/70 max-w-xl mx-auto mb-10">
            Analyze any ERC-20 token contract in seconds. Real-time risk score powered by blockchain data, market intelligence, and AI.
          </p>

          {/* Inline scan input */}
          <div className="flex flex-col sm:flex-row items-center gap-3 max-w-xl mx-auto mb-8">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={scanInput}
                onChange={e => setScanInput(e.target.value)}
                placeholder="Paste token contract address 0x..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-card border border-border text-white placeholder-muted font-mono text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
                spellCheck={false}
              />
            </div>
            <Link
              href={scanInput.trim() ? `/scan` : `/scan`}
              onClick={() => scanInput.trim() && sessionStorage.setItem("prefill_address", scanInput.trim())}
              className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent hover:bg-accent-glow text-white font-bold text-sm transition-all hover:shadow-glow"
            >
              <Shield className="w-4 h-4" />
              Analyze
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/scan" className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-accent hover:bg-accent-glow text-white font-bold text-base transition-all hover:shadow-glow hover:scale-105">
              <Shield className="w-5 h-5" />
              Scan Token Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/history" className="flex items-center gap-2 px-8 py-4 rounded-xl border border-border hover:border-accent/40 text-muted hover:text-white font-semibold text-base transition-all">
              <Eye className="w-5 h-5" />
              View Recent Scans
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────────────── */}
      <section className="border-y border-border bg-surface/50 py-6 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Tokens Analyzed", value: "12,400+", icon: <BarChart2 className="w-4 h-4" /> },
            { label: "Data Sources", value: "4 APIs", icon: <Activity className="w-4 h-4" /> },
            { label: "AI Model", value: "LLaMA3", icon: <Zap className="w-4 h-4" /> },
            { label: "Avg Scan Time", value: "<10s", icon: <Clock className="w-4 h-4" /> },
          ].map(s => (
            <div key={s.label} className="text-center flex flex-col items-center gap-1">
              <div className="text-accent mb-1">{s.icon}</div>
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-xs text-muted font-mono uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE TOKEN TABLE ────────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Known Token Security Scores</h2>
              <p className="text-muted text-sm">Well-known ERC-20 tokens analyzed by RugSentinel</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted font-mono">
              <RefreshCw className="w-3.5 h-3.5 text-accent animate-spin-slow" />
              Live data
            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl border border-border bg-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface/50">
                  <th className="text-left px-5 py-3 text-xs text-muted font-mono uppercase tracking-wider">Token</th>
                  <th className="text-left px-5 py-3 text-xs text-muted font-mono uppercase tracking-wider">Address</th>
                  <th className="text-center px-5 py-3 text-xs text-muted font-mono uppercase tracking-wider">Score</th>
                  <th className="text-center px-5 py-3 text-xs text-muted font-mono uppercase tracking-wider">Verified</th>
                  <th className="text-center px-5 py-3 text-xs text-muted font-mono uppercase tracking-wider">Renounced</th>
                  <th className="text-left px-5 py-3 text-xs text-muted font-mono uppercase tracking-wider">Top Holder</th>
                  <th className="text-left px-5 py-3 text-xs text-muted font-mono uppercase tracking-wider">Holders</th>
                  <th className="text-center px-5 py-3 text-xs text-muted font-mono uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {KNOWN_TOKENS.slice(0, visibleTokens).map((token, i) => (
                  <tr key={token.address} className={`border-b border-border/50 hover:bg-surface/40 transition-colors ${i % 2 === 0 ? "" : "bg-surface/10"}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-black text-accent">{token.symbol.slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{token.name}</p>
                          <p className="text-xs text-muted font-mono">{token.symbol}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-mono text-muted">
                        {token.address.slice(0, 8)}...{token.address.slice(-6)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-center gap-1.5">
                        <ScorePill score={token.score} level={token.level} />
                        <div className="w-20">
                          <MiniBar score={token.score} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {token.verified
                        ? <CheckCircle className="w-4 h-4 text-safe mx-auto" />
                        : <XCircle className="w-4 h-4 text-danger mx-auto" />}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {token.renounced
                        ? <CheckCircle className="w-4 h-4 text-safe mx-auto" />
                        : <XCircle className="w-4 h-4 text-danger mx-auto" />}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-mono font-semibold ${parseFloat(token.topHolder) > 50 ? "text-danger" : parseFloat(token.topHolder) > 30 ? "text-medium" : "text-safe"}`}>
                        {token.topHolder}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted">
                        <Users className="w-3.5 h-3.5" />
                        {token.holders}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/scan`}
                          onClick={() => sessionStorage.setItem("prefill_address", token.address)}
                          className="px-3 py-1.5 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent text-xs font-semibold transition-all border border-accent/20"
                        >
                          Scan
                        </Link>
                        <a
                          href={`https://etherscan.io/token/${token.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-muted hover:text-accent transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {KNOWN_TOKENS.slice(0, visibleTokens).map(token => (
              <div key={token.address} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                      <span className="text-xs font-black text-accent">{token.symbol.slice(0, 2)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{token.name}</p>
                      <p className="text-xs text-muted font-mono">{token.symbol}</p>
                    </div>
                  </div>
                  <ScorePill score={token.score} level={token.level} />
                </div>
                <MiniBar score={token.score} />
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      {token.verified ? <CheckCircle className="w-3.5 h-3.5 text-safe" /> : <XCircle className="w-3.5 h-3.5 text-danger" />}
                      Verified
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {token.holders}
                    </span>
                  </div>
                  <Link
                    href="/scan"
                    onClick={() => sessionStorage.setItem("prefill_address", token.address)}
                    className="px-3 py-1.5 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent text-xs font-semibold border border-accent/20"
                  >
                    Scan
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Show more */}
          {visibleTokens < KNOWN_TOKENS.length && (
            <div className="text-center mt-6">
              <button
                onClick={() => setVisibleTokens(KNOWN_TOKENS.length)}
                className="px-6 py-2.5 rounded-xl border border-border text-muted hover:text-white hover:border-accent/40 text-sm font-semibold transition-all"
              >
                Show {KNOWN_TOKENS.length - visibleTokens} more tokens
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── LIVE SCAN FEED ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-border bg-surface/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* Left: animated scan feed */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Live Scan Activity</h2>
              <p className="text-muted text-sm mb-6">Tokens being analyzed right now across the network</p>
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-surface/50">
                  <span className="text-xs text-muted font-mono uppercase tracking-wider">Recent Scans</span>
                  <span className="flex items-center gap-1.5 text-xs text-safe font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-safe animate-pulse" />
                    Live
                  </span>
                </div>
                <div className="divide-y divide-border/50">
                  {RECENT_SCANS.map((scan, i) => {
                    const isActive = i === tickerIndex;
                    const c = scan.level === "SAFE" ? "text-safe" : scan.level === "MEDIUM" ? "text-medium" : "text-danger";
                    const bg = scan.level === "SAFE" ? "bg-safe/5" : scan.level === "MEDIUM" ? "bg-medium/5" : "bg-danger/5";
                    return (
                      <div key={i} className={`flex items-center justify-between px-5 py-3.5 transition-all duration-500 ${isActive ? bg : ""}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${isActive ? `${bg} border border-current ${c}` : "bg-surface text-muted"}`}>
                            {scan.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${isActive ? "text-white" : "text-muted"}`}>{scan.symbol}</p>
                            <p className="text-xs text-muted/60 font-mono">{scan.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-16">
                            <MiniBar score={scan.score} />
                          </div>
                          <span className={`text-sm font-black tabular-nums ${c}`}>{scan.score}</span>
                          <span className={`text-xs font-bold uppercase ${c}`}>{scan.level}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: risk score explainer */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">How Scoring Works</h2>
              <p className="text-muted text-sm mb-6">Deterministic engine — starts at 100, deducts for each risk flag</p>
              <div className="space-y-3">
                {[
                  { icon: "🐋", label: "Whale Concentration", deduction: "-35", desc: "Top wallet holds >50% of supply", color: "text-danger" },
                  { icon: "💧", label: "Liquidity Risk",       deduction: "-25", desc: "Low or unstable liquidity pool",  color: "text-danger" },
                  { icon: "🔍", label: "Contract Unverified",  deduction: "-20", desc: "Source code not on Etherscan",    color: "text-danger" },
                  { icon: "🔑", label: "Ownership Active",     deduction: "-15", desc: "Dev can still modify contract",   color: "text-medium" },
                  { icon: "📅", label: "Token Age <7 days",    deduction: "-10", desc: "Very new tokens are higher risk", color: "text-medium" },
                  { icon: "📊", label: "Abnormal Volume",      deduction: "-10", desc: "Possible wash trading detected",  color: "text-medium" },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-4 p-3.5 rounded-xl border border-border bg-card hover:border-accent/20 transition-all">
                    <span className="text-xl flex-shrink-0">{f.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">{f.label}</p>
                      <p className="text-xs text-muted truncate">{f.desc}</p>
                    </div>
                    <span className={`text-sm font-black font-mono flex-shrink-0 ${f.color}`}>{f.deduction} pts</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 rounded-xl border border-accent/20 bg-accent/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Starting score</span>
                  <span className="font-black text-white">100</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-muted">Max deduction</span>
                  <span className="font-black text-danger">-115 pts</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white font-semibold">Score range</span>
                  <span className="font-black text-accent">0 – 100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RISK LEVELS ─────────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Risk Level Guide</h2>
            <p className="text-muted text-sm">What your score means in plain English</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { range: "70 – 100", level: "SAFE",      color: "#10b981", bg: "rgba(16,185,129,0.05)",  border: "rgba(16,185,129,0.2)",  desc: "Token passes all major security checks. Low risk of rug pull. Safe to research further.", example: "USDT · USDC · DAI" },
              { range: "40 – 69",  level: "MEDIUM",    color: "#f59e0b", bg: "rgba(245,158,11,0.05)",  border: "rgba(245,158,11,0.2)",  desc: "Some risk factors detected. Proceed with caution and always do your own research.", example: "COMP · newer DeFi tokens" },
              { range: "0 – 39",   level: "HIGH RISK", color: "#ef4444", bg: "rgba(239,68,68,0.05)",   border: "rgba(239,68,68,0.2)",   desc: "Multiple red flags. High probability of scam or rug pull. Avoid investing.", example: "Unverified meme coins" },
            ].map(item => (
              <div key={item.level} className="rounded-2xl border p-6" style={{ background: item.bg, borderColor: item.border }}>
                <div className="text-4xl font-black mb-3" style={{ color: item.color }}>{item.range}</div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-4" style={{ borderColor: item.border, color: item.color }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: item.color }} />
                  {item.level}
                </div>
                <p className="text-muted text-sm mb-3 leading-relaxed">{item.desc}</p>
                <p className="text-xs font-mono" style={{ color: item.color }}>e.g. {item.example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-border bg-surface/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Powered by Real Data</h2>
            <p className="text-muted text-sm max-w-xl mx-auto">RugSentinel aggregates 4 industry-leading APIs for the most accurate risk assessment possible.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map(f => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-6 hover:border-accent/30 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1.5">{f.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{f.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* API logos row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {[
              { name: "Alchemy",       color: "#6366f1", desc: "On-chain data" },
              { name: "Moralis",       color: "#10b981", desc: "Holder data" },
              { name: "Etherscan",     color: "#3b82f6", desc: "Contract info" },
              { name: "CoinMarketCap", color: "#f59e0b", desc: "Market data" },
              { name: "Groq AI",       color: "#a855f7", desc: "AI explanation" },
            ].map(api => (
              <div key={api.name} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card">
                <div className="w-2 h-2 rounded-full" style={{ background: api.color }} />
                <span className="text-sm font-semibold text-white">{api.name}</span>
                <span className="text-xs text-muted">{api.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <AlertTriangle className="w-12 h-12 text-medium mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Don&apos;t Get Rugged</h2>
          <p className="text-muted mb-8 leading-relaxed">
            Thousands of scam tokens launch every week. RugSentinel gives you the intelligence to protect your investments before it&apos;s too late.
          </p>
          <Link href="/scan" className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-accent hover:bg-accent-glow text-white font-bold text-lg transition-all hover:shadow-glow hover:scale-105">
            <Shield className="w-5 h-5" />
            Start Scanning Free
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            <span className="font-bold text-white">Rug<span className="text-accent">Sentinel</span></span>
          </div>
          <p className="text-xs text-muted text-center">For informational purposes only. Not financial advice. Always DYOR.</p>
          <p className="text-xs text-muted">Built with Next.js · Groq AI · Web3 APIs</p>
        </div>
      </footer>
    </div>
  );
}
