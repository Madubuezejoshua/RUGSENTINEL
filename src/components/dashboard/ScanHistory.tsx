"use client";

import { useEffect, useState } from "react";
import { ScanHistory as ScanHistoryType } from "@/types";
import { Clock, ExternalLink, ChevronRight } from "lucide-react";
import RiskBadge from "@/components/ui/RiskBadge";
import Link from "next/link";

export default function ScanHistory() {
  const [history, setHistory] = useState<ScanHistoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => {
        setHistory(data.history || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-bold text-white mb-4">Recent Scans</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-bold text-white mb-4">Recent Scans</h3>
        <div className="text-center py-8">
          <Clock className="w-8 h-8 text-muted mx-auto mb-2" />
          <p className="text-muted text-sm">No scans yet</p>
          <p className="text-muted/60 text-xs mt-1">
            Analyzed tokens will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white">Recent Scans</h3>
        <Link
          href="/history"
          className="text-xs text-accent hover:text-accent-glow transition-colors flex items-center gap-1"
        >
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-2">
        {history.slice(0, 5).map((scan) => (
          <div
            key={scan.id}
            className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border hover:border-accent/30 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-accent">
                  {scan.token_symbol?.slice(0, 2) || "??"}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {scan.token_name || "Unknown"}
                </p>
                <p className="text-xs text-muted font-mono truncate">
                  {scan.token_address.slice(0, 10)}...
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <RiskBadge
                level={scan.risk_level as "SAFE" | "MEDIUM" | "HIGH"}
                size="sm"
              />
              <a
                href={`https://etherscan.io/token/${scan.token_address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
