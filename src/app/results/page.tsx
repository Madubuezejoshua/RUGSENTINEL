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
import { ArrowLeft, RefreshCw, Share2, ExternalLink, Check, Shield } from "lucide-react";
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
    const stored = sessionStorage.getItem("rugsentinel_result");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.tokenAddress === address?.toLowerCase()) {
          setResult(parsed); setLoading(false); return;
        }
      } catch { /* fall through */ }
    }
    if (address) fetchAnalysis(address);
    else router.push("/scan");
  }, [address, router]);

  const fetchAnalysis = async (addr: string) => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tokenAddress: addr }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
      sessionStorage.setItem("rugsentinel_result", JSON.stringify(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally { setLoading(false); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen dash-grid" style={{ background: "#0c0c14" }}>
        <Navbar />
        <div className="pt-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
              <div className="space-y-4">
                <div className="h-96 rounded-2xl shimmer" />
                <div className="h-64 rounded-2xl shimmer" />
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="h-40 rounded-2xl shimmer" />
                <div className="h-56 rounded-2xl shimmer" />
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
      <div className="min-h-screen dash-grid flex items-center justify-center" style={{ background: "#0c0c14" }}>
        <Navbar />
        <div className="text-center pt-16">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Analysis Failed</h2>
          <p className="text-muted mb-6 max-w-sm">{error}</p>
          <div className="flex gap-3 justify-center">
            <Link href="/scan" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-muted hover:text-white transition-all text-sm" style={{ borderColor: "#1e1e2e" }}>
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            {address && (
              <button onClick={() => fetchAnalysis(address)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-black" style={{ background: "#c8f135" }}>
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen dash-grid" style={{ background: "#0c0c14" }}>
      <Navbar />
      <div className="pt-20 pb-10 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Top bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4 mb-4 border-b" style={{ borderColor: "#1e1e2e" }}>
            <div className="flex items-center gap-3">
              <Link href="/scan" className="flex items-center gap-1.5 text-sm text-muted hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" /> New Scan
              </Link>
              <span className="text-border text-muted">|</span>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-lime" />
                <span className="text-xs font-mono text-muted truncate max-w-[200px]">{result.tokenAddress}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a href={`https://etherscan.io/token/${result.tokenAddress}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs text-muted hover:text-white transition-all" style={{ borderColor: "#1e1e2e" }}>
                <ExternalLink className="w-3.5 h-3.5" /> Etherscan
              </a>
              <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs text-muted hover:text-white transition-all" style={{ borderColor: "#1e1e2e" }}>
                {copied ? <Check className="w-3.5 h-3.5 text-lime" /> : <Share2 className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Share"}
              </button>
              <button onClick={() => address && fetchAnalysis(address)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs text-muted hover:text-white transition-all" style={{ borderColor: "#1e1e2e" }}>
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-1 space-y-4">
              <RiskScoreCard score={result.riskScore} level={result.riskLevel} tokenName={result.tokenData.name} tokenSymbol={result.tokenData.symbol} />
              <TokenInfoCard tokenData={result.tokenData} />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <AIExplanationBox explanation={result.aiExplanation} riskLevel={result.riskLevel} />
              <div className="rounded-2xl border p-5" style={{ background: "#111118", borderColor: "#1e1e2e" }}>
                <RiskFactorsGrid factors={result.riskFactors} />
              </div>
              <div className="rounded-2xl border p-5" style={{ background: "#111118", borderColor: "#1e1e2e" }}>
                <RiskChart riskFactors={result.riskFactors} riskScore={result.riskScore} />
              </div>
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
    <Suspense fallback={<div className="min-h-screen dash-grid flex items-center justify-center" style={{ background: "#0c0c14" }}><div className="text-muted text-sm font-mono">Loading...</div></div>}>
      <ResultsContent />
    </Suspense>
  );
}
