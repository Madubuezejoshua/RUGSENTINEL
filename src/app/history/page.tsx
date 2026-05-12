"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/ui/Navbar";
import RiskBadge from "@/components/ui/RiskBadge";
import { ScanHistory } from "@/types";
import { Clock, ExternalLink, Search, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HistoryPage() {
  const [history, setHistory] = useState<ScanHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => {
        setHistory(data.history || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = history.filter(
    (h) =>
      h.token_name?.toLowerCase().includes(search.toLowerCase()) ||
      h.token_symbol?.toLowerCase().includes(search.toLowerCase()) ||
      h.token_address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Navbar />

      <div className="pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Scan History</h1>
            <p className="text-muted">
              All previously analyzed tokens stored in Supabase
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, symbol, or address..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border text-white placeholder-muted text-sm focus:outline-none focus:border-accent/60 transition-all"
            />
          </div>

          {/* Table */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 rounded-xl shimmer" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Clock className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {search ? "No results found" : "No scans yet"}
              </h3>
              <p className="text-muted mb-6">
                {search
                  ? "Try a different search term"
                  : "Start scanning tokens to build your history"}
              </p>
              <Link
                href="/scan"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-glow transition-all"
              >
                Scan a Token
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((scan) => (
                <div
                  key={scan.id}
                  className="rounded-xl border border-border bg-card p-5 hover:border-accent/30 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Token info */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-accent">
                          {scan.token_symbol?.slice(0, 2) || "??"}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white">
                            {scan.token_name || "Unknown Token"}
                          </p>
                          <span className="text-xs text-muted font-mono">
                            {scan.token_symbol}
                          </span>
                        </div>
                        <p className="text-xs text-muted font-mono mt-0.5">
                          {scan.token_address.slice(0, 16)}...{scan.token_address.slice(-8)}
                        </p>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {/* Score */}
                      <div className="text-center">
                        <p className="text-2xl font-black text-white tabular-nums">
                          {scan.risk_score}
                        </p>
                        <p className="text-xs text-muted font-mono">/100</p>
                      </div>

                      <RiskBadge
                        level={scan.risk_level as "SAFE" | "MEDIUM" | "HIGH"}
                      />

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://etherscan.io/token/${scan.token_address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-muted hover:text-accent transition-colors"
                          title="View on Etherscan"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <Link
                          href={`/results?address=${scan.token_address}`}
                          className="p-2 rounded-lg text-muted hover:text-accent transition-colors"
                          title="View full analysis"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* AI explanation preview */}
                  {scan.ai_explanation && (
                    <p className="mt-3 text-xs text-muted line-clamp-2 pl-14">
                      {scan.ai_explanation}
                    </p>
                  )}

                  {/* Timestamp */}
                  <div className="mt-2 pl-14">
                    <span className="text-xs text-muted/60 font-mono">
                      {new Date(scan.analyzed_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
