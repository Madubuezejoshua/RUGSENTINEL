"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import { Shield, Search, AlertCircle, Zap, ChevronRight, Activity, TrendingUp, Users, Clock } from "lucide-react";

const EXAMPLE_TOKENS = [
  { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", label: "Tether USD",   symbol: "USDT", score: 82, lvl: "SAFE"   },
  { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", label: "USD Coin",     symbol: "USDC", score: 85, lvl: "SAFE"   },
  { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", label: "Dai",           symbol: "DAI",  score: 78, lvl: "SAFE"   },
  { address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", label: "Chainlink",     symbol: "LINK", score: 74, lvl: "SAFE"   },
  { address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", label: "Uniswap",       symbol: "UNI",  score: 71, lvl: "SAFE"   },
  { address: "0xc00e94Cb662C3520282E6f5717214004A7f26888", label: "Compound",      symbol: "COMP", score: 55, lvl: "MEDIUM" },
];

const STATS = [
  { label: "Tokens Scanned Today", value: "1,247", icon: <Activity className="w-4 h-4" />, delta: "+12%" },
  { label: "High Risk Detected",   value: "384",   icon: <AlertCircle className="w-4 h-4" />, delta: "+5%", red: true },
  { label: "Avg Scan Time",        value: "8.4s",  icon: <Clock className="w-4 h-4" />, delta: "-2%" },
  { label: "Unique Wallets",       value: "9,821", icon: <Users className="w-4 h-4" />, delta: "+18%" },
];

function ScoreBadge({ score, lvl }: { score: number; lvl: string }) {
  const c = lvl === "SAFE" ? "#10b981" : lvl === "MEDIUM" ? "#f59e0b" : "#ef4444";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold"
      style={{ background: `${c}18`, color: c, border: `1px solid ${c}30` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
      {score} · {lvl}
    </span>
  );
}

export default function ScanPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const prefill = sessionStorage.getItem("prefill_address");
    if (prefill) { setAddress(prefill); sessionStorage.removeItem("prefill_address"); }
  }, []);

  const isValid = (a: string) => /^0x[a-fA-F0-9]{40}$/.test(a.trim());

  const handleScan = async (tokenAddress?: string) => {
    const target = (tokenAddress || address).trim();
    if (!target) { setError("Please enter a token contract address"); return; }
    if (!isValid(target)) { setError("Invalid Ethereum address — must be 0x + 40 hex chars"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenAddress: target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      sessionStorage.setItem("rugsentinel_result", JSON.stringify(data));
      router.push(`/results?address=${target}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen dash-grid" style={{ background: "var(--dash-bg, #0f1010)" }}>
      <Navbar />

      <div className="pt-20 pb-10 px-5 max-w-7xl mx-auto">

        {/* ── TOP STATS ROW ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {STATS.map(s => (
            <div
              key={s.label}
              className="rounded-xl p-4"
              style={{ background: "var(--dash-card, #1a1c1c)", border: "1px solid var(--dash-border, #252828)" }}
            >
              <div className="flex items-center justify-between mb-2">
                <span style={{ color: "#6b7070" }}>{s.icon}</span>
                <span
                  className="text-xs font-mono font-semibold"
                  style={{ color: s.red ? "#ef4444" : "#10b981" }}
                >
                  {s.delta}
                </span>
              </div>
              <p className="text-2xl font-black text-white">{s.value}</p>
              <p className="text-xs mt-0.5" style={{ color: "#6b7070" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── MAIN GRID ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* LEFT: scan panel */}
          <div className="lg:col-span-2 space-y-4">

            {/* Scan card */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "var(--dash-card, #1a1c1c)", border: "1px solid var(--dash-border, #252828)" }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#c8f13520", border: "1px solid #c8f13540" }}>
                  <Shield className="w-5 h-5" style={{ color: "#c8f135" }} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Token Security Scanner</h1>
                  <p className="text-xs" style={{ color: "#6b7070" }}>Paste any ERC-20 contract address to analyze</p>
                </div>
              </div>

              {/* Input */}
              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#6b7070" }}>
                  Contract Address
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6b7070" }} />
                  <input
                    type="text"
                    value={address}
                    onChange={e => { setAddress(e.target.value); setError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleScan()}
                    placeholder="0x..."
                    disabled={loading}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-[#6b7070] font-mono text-sm focus:outline-none transition-all disabled:opacity-50"
                    style={{
                      background: "#111313",
                      border: error ? "1px solid #ef4444" : "1px solid #252828",
                    }}
                    spellCheck={false}
                    autoComplete="off"
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: "#ef4444" }}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <p className="text-xs" style={{ color: "#4a5050" }}>
                  Ethereum mainnet ERC-20 only · Analysis takes ~8–15 seconds
                </p>
              </div>

              {/* Analyze button */}
              <button
                onClick={() => handleScan()}
                disabled={loading || !address.trim()}
                className="w-full mt-5 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: loading || !address.trim() ? "#252828" : "#c8f135",
                  color: loading || !address.trim() ? "#6b7070" : "#0f1010",
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Analyze Risk
                  </>
                )}
              </button>

              {/* What we check */}
              <div className="mt-5 pt-5" style={{ borderTop: "1px solid #252828" }}>
                <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "#6b7070" }}>What we analyze</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Holder Distribution", "Contract Verification",
                    "Liquidity Depth",     "Ownership Status",
                    "Token Age",           "Trading Patterns",
                  ].map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "#6b7070" }}>
                      <div className="w-1 h-1 rounded-full" style={{ background: "#c8f135" }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading state overlay */}
            {loading && (
              <div
                className="rounded-2xl p-6 text-center"
                style={{ background: "var(--dash-card, #1a1c1c)", border: "1px solid #c8f13530" }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#c8f135] animate-spin" />
                    <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-[#c8f13560] animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                    <Shield className="absolute inset-0 m-auto w-6 h-6" style={{ color: "#c8f135" }} />
                  </div>
                  <div>
                    <p className="font-bold text-white">Analyzing Token Security</p>
                    <p className="text-xs mt-1" style={{ color: "#6b7070" }}>Querying blockchain data sources...</p>
                  </div>
                  <div className="w-full space-y-2 text-left max-w-xs">
                    {["Fetching on-chain data", "Checking holder distribution", "Verifying contract", "Running risk engine", "Generating AI explanation"].map((s, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs" style={{ color: i < 2 ? "#10b981" : i === 2 ? "#c8f135" : "#4a5050" }}>
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: i < 2 ? "#10b981" : i === 2 ? "#c8f135" : "#252828" }} />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: example tokens */}
          <div className="space-y-4">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "var(--dash-card, #1a1c1c)", border: "1px solid var(--dash-border, #252828)" }}
            >
              <div className="px-5 py-4" style={{ borderBottom: "1px solid #252828" }}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white">Quick Scan</p>
                  <span className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "#10b981" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-dot" />
                    Live
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: "#6b7070" }}>Click any token to scan instantly</p>
              </div>

              <div className="divide-y" style={{ borderColor: "#252828" }}>
                {EXAMPLE_TOKENS.map(token => (
                  <button
                    key={token.address}
                    onClick={() => { setAddress(token.address); handleScan(token.address); }}
                    disabled={loading}
                    className="w-full flex items-center justify-between px-5 py-3.5 transition-all text-left group disabled:opacity-50"
                    style={{ background: "transparent" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#111313")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0"
                        style={{ background: "#111313", border: "1px solid #252828", color: "#c8f135" }}
                      >
                        {token.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{token.label}</p>
                        <p className="text-xs font-mono" style={{ color: "#6b7070" }}>{token.symbol}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ScoreBadge score={token.score} lvl={token.lvl} />
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#c8f135" }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Risk factor quick ref */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--dash-card, #1a1c1c)", border: "1px solid var(--dash-border, #252828)" }}
            >
              <p className="text-sm font-bold text-white mb-4">Risk Factors</p>
              <div className="space-y-2.5">
                {[
                  { label: "Whale >50%",    pts: "-35", color: "#ef4444" },
                  { label: "Low Liquidity", pts: "-25", color: "#ef4444" },
                  { label: "Unverified",    pts: "-20", color: "#ef4444" },
                  { label: "Active Owner",  pts: "-15", color: "#f59e0b" },
                  { label: "Age <7 days",   pts: "-10", color: "#f59e0b" },
                  { label: "Abnml Volume",  pts: "-10", color: "#f59e0b" },
                ].map(f => (
                  <div key={f.label} className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "#6b7070" }}>{f.label}</span>
                    <span className="text-xs font-bold font-mono" style={{ color: f.color }}>{f.pts} pts</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid #252828" }}>
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "#6b7070" }}>Starting score</span>
                  <span className="font-black text-white">100</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "#252828" }}>
                  <div className="h-full rounded-full" style={{ width: "100%", background: "linear-gradient(90deg, #ef4444, #f59e0b, #10b981)" }} />
                </div>
                <div className="flex justify-between text-xs mt-1" style={{ color: "#4a5050" }}>
                  <span>0 HIGH</span>
                  <span>40 MED</span>
                  <span>70 SAFE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
