"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import RiskScoreCard from "@/components/dashboard/RiskScoreCard";
import RiskFactorsGrid from "@/components/dashboard/RiskFactorsGrid";
import AIExplanationBox from "@/components/dashboard/AIExplanationBox";
import TokenInfoCard from "@/components/dashboard/TokenInfoCard";
import RiskChart from "@/components/dashboard/RiskChart";
import ScanHistory from "@/components/dashboard/ScanHistory";
import { RiskResult } from "@/types";
import { ArrowLeft, RefreshCw, Share2, ExternalLink, Check } from "lucide-react";
import Link from "next/link";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const address = searchParams.get("address");

  const [result, setResult] = useState<RiskResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Try to get result from sessionStorage first
    const stored = sessionStorage.getItem("rugsentinel_result");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.tokenAddress === address?.toLowerCase()) {
          setResult(parsed);
          setLoading(false);
          return;
        }
      } catch {
        // Fall through to fetch
      }
    }

    // Fetch fresh if not in storage
    if (address) {
      fetchAnalysis(address);
    } else {
      router.push("/scan");
    }
  }, [address, router]);

  const fetchAnalysis = async (tokenAddress: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenAddress }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
      sessionStorage.setItem("rugsentinel_result", JSON.stringify(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background grid-bg">
        <Navbar />
        <div className="pt-24 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Skeleton loading */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <div className="lg:col-span-1 space-y-6">
                <div className="h-96 rounded-2xl shimmer" />
                <div className="h-64 rounded-2xl shimmer" />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="h-48 rounded-2xl shimmer" />
                <div className="h-64 rounded-2xl shimmer" />
                <div className="h-48 rounded-2xl shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background grid-bg">
        <Navbar />
        <div className="pt-32 px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">Analysis Failed</h2>
            <p className="text-muted mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/scan"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted hover:text-white transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Scan
              </Link>
              {address && (
                <button
                  onClick={() => fetchAnalysis(address)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold transition-all hover:bg-accent-glow"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const analyzedDate = new Date(result.analyzedAt).toLocaleString();

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Top bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Link
                href="/scan"
                className="flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                New Scan
              </Link>
              <span className="text-border">|</span>
              <span className="text-xs text-muted font-mono">
                Analyzed: {analyzedDate}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://etherscan.io/token/${result.tokenAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-white hover:border-accent/30 transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Etherscan
              </a>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-white hover:border-accent/30 transition-all"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-safe" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
                {copied ? "Copied!" : "Share"}
              </button>
              <button
                onClick={() => address && fetchAnalysis(address)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-white hover:border-accent/30 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Risk Score */}
              <RiskScoreCard
                score={result.riskScore}
                level={result.riskLevel}
                tokenName={result.tokenData.name}
                tokenSymbol={result.tokenData.symbol}
              />

              {/* Token Info */}
              <TokenInfoCard tokenData={result.tokenData} />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Explanation */}
              <AIExplanationBox
                explanation={result.aiExplanation}
                riskLevel={result.riskLevel}
              />

              {/* Risk Factors */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <RiskFactorsGrid factors={result.riskFactors} />
              </div>

              {/* Charts */}
              <div className="rounded-2xl border border-border bg-card p-6">
                <RiskChart
                  riskFactors={result.riskFactors}
                  riskScore={result.riskScore}
                />
              </div>

              {/* Scan History */}
              <ScanHistory />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background grid-bg flex items-center justify-center">
          <div className="text-muted">Loading...</div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
