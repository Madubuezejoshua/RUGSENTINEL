"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Shield, Search, AlertCircle, Zap, ChevronRight } from "lucide-react";

const EXAMPLE_TOKENS = [
  {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    label: "USDT (Tether)",
    badge: "SAFE",
  },
  {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    label: "USDC",
    badge: "SAFE",
  },
  {
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    label: "DAI",
    badge: "SAFE",
  },
];

export default function ScanPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidAddress = (addr: string) =>
    /^0x[a-fA-F0-9]{40}$/.test(addr.trim());

  const handleScan = async (tokenAddress?: string) => {
    const target = (tokenAddress || address).trim();

    if (!target) {
      setError("Please enter a token contract address");
      return;
    }

    if (!isValidAddress(target)) {
      setError(
        "Invalid Ethereum address. Must start with 0x followed by 40 hex characters."
      );
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenAddress: target }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      // Store result in sessionStorage and navigate to results
      sessionStorage.setItem("rugsentinel_result", JSON.stringify(data));
      router.push(`/results?address=${target}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Analysis failed. Please try again."
      );
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleScan();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background grid-bg">
        <Navbar />
        <div className="pt-24 px-4">
          <div className="max-w-2xl mx-auto">
            <LoadingSpinner message="Analyzing Token Security..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Navbar />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mb-6">
              <Shield className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-4xl font-black text-white mb-3">
              Scan Token
            </h1>
            <p className="text-muted text-lg">
              Enter any ERC-20 token contract address to analyze its security
            </p>
          </div>

          {/* Input Card */}
          <div className="rounded-2xl border border-border bg-card p-8 space-y-6">
            {/* Address Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">
                Token Contract Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Search className="w-4 h-4 text-muted" />
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    setError("");
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="0x..."
                  className="w-full pl-11 pr-4 py-4 rounded-xl bg-surface border border-border text-white placeholder-muted font-mono text-sm focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/30 transition-all"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 text-danger text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <p className="text-xs text-muted">
                Ethereum mainnet ERC-20 tokens only. Example:{" "}
                <span className="font-mono text-accent/70">
                  0xdAC17F958D2ee523a2206206994597C13D831ec7
                </span>
              </p>
            </div>

            {/* Analyze Button */}
            <button
              onClick={() => handleScan()}
              disabled={!address.trim()}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-accent hover:bg-accent-glow disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-base transition-all hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-5 h-5" />
              Analyze Risk
            </button>

            {/* What we check */}
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted mb-3 font-mono uppercase tracking-wider">
                What we analyze
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Holder Distribution",
                  "Contract Verification",
                  "Liquidity Depth",
                  "Ownership Status",
                  "Token Age",
                  "Trading Patterns",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-muted">
                    <div className="w-1 h-1 rounded-full bg-accent" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Example Tokens */}
          <div className="mt-8 space-y-3">
            <p className="text-sm text-muted font-mono uppercase tracking-wider text-center">
              Try an example
            </p>
            <div className="grid grid-cols-1 gap-2">
              {EXAMPLE_TOKENS.map((token) => (
                <button
                  key={token.address}
                  onClick={() => {
                    setAddress(token.address);
                    handleScan(token.address);
                  }}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-accent/30 hover:bg-surface transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-safe/10 border border-safe/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-safe">✓</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-white">
                        {token.label}
                      </p>
                      <p className="text-xs font-mono text-muted">
                        {token.address.slice(0, 14)}...
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-muted/60 mt-8">
            RugSentinel is for informational purposes only. Not financial advice.
            Analysis may take up to 15 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}
