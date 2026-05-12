"use client";

import { TokenData } from "@/types";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

interface TokenInfoCardProps {
  tokenData: TokenData;
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string | number | null;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span
        className={`text-xs text-white font-medium ${mono ? "font-mono" : ""}`}
      >
        {value ?? "—"}
      </span>
    </div>
  );
}

function formatNumber(num: number | null): string {
  if (num === null) return "—";
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
  return `$${num.toFixed(4)}`;
}

export default function TokenInfoCard({ tokenData }: TokenInfoCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tokenData.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortAddress = `${tokenData.address.slice(0, 8)}...${tokenData.address.slice(-6)}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-white">Token Information</h3>
        <a
          href={`https://etherscan.io/token/${tokenData.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-accent hover:text-accent-glow transition-colors"
        >
          Etherscan <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Contract address */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-border">
        <div>
          <p className="text-xs text-muted mb-0.5">Contract Address</p>
          <p className="text-xs font-mono text-white">{shortAddress}</p>
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md text-muted hover:text-white hover:bg-border transition-all"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-safe" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Token details */}
      <div>
        <InfoRow label="Token Name" value={tokenData.name} />
        <InfoRow label="Symbol" value={tokenData.symbol} mono />
        <InfoRow label="Decimals" value={tokenData.decimals} mono />
        <InfoRow
          label="Total Supply"
          value={
            tokenData.totalSupply
              ? parseFloat(tokenData.totalSupply) > 0
                ? (parseFloat(tokenData.totalSupply) / Math.pow(10, tokenData.decimals)).toLocaleString(undefined, { maximumFractionDigits: 0 })
                : tokenData.totalSupply
              : "—"
          }
          mono
        />
        <InfoRow label="Holder Count" value={tokenData.holderCount.toLocaleString()} mono />
        <InfoRow label="Token Age" value={`${tokenData.ageInDays} days`} mono />
      </div>

      {/* Market data */}
      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted uppercase tracking-wider mb-3">Market Data</p>
        <InfoRow
          label="Price"
          value={tokenData.price ? `$${tokenData.price.toFixed(8)}` : null}
          mono
        />
        <InfoRow label="Market Cap" value={formatNumber(tokenData.marketCap)} mono />
        <InfoRow label="24h Volume" value={formatNumber(tokenData.volume24h)} mono />
        <InfoRow
          label="24h Change"
          value={
            tokenData.priceChange24h !== null
              ? `${tokenData.priceChange24h > 0 ? "+" : ""}${tokenData.priceChange24h.toFixed(2)}%`
              : null
          }
          mono
        />
      </div>

      {/* On-chain activity */}
      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted uppercase tracking-wider mb-3">On-Chain Activity</p>
        <InfoRow label="Recent Transfers" value={tokenData.recentTransferCount} mono />
        <InfoRow label="Unique Wallets" value={tokenData.uniqueWallets} mono />
        <InfoRow
          label="Top Holder"
          value={`${tokenData.topHolderPercent.toFixed(1)}% of supply`}
          mono
        />
        <InfoRow
          label="Top 10 Holders"
          value={`${tokenData.top10HolderPercent.toFixed(1)}% of supply`}
          mono
        />
      </div>
    </div>
  );
}
