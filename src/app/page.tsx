"use client";

import Link from "next/link";
import { Shield, Zap, Lock, TrendingUp, ArrowRight, Activity, Eye, AlertTriangle } from "lucide-react";
import Navbar from "@/components/ui/Navbar";

const features = [
  {
    icon: <Activity className="w-5 h-5" />,
    title: "Real-Time Blockchain Analysis",
    description:
      "Pulls live data from Alchemy, Moralis, and Etherscan to analyze wallet activity, holder distribution, and contract safety.",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Market Intelligence",
    description:
      "Integrates CoinMarketCap data to detect abnormal trading volumes, low liquidity, and suspicious price movements.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Contract Security Audit",
    description:
      "Checks contract verification status, ownership renouncement, proxy patterns, and source code availability.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "AI-Powered Explanations",
    description:
      "Groq LLaMA3 AI translates complex risk data into plain English so any investor can understand the risks.",
  },
];

const stats = [
  { label: "Risk Factors Analyzed", value: "6+" },
  { label: "Data Sources", value: "4" },
  { label: "AI Model", value: "LLaMA3" },
  { label: "Response Time", value: "<10s" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background grid-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-danger/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-mono mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Web3 Security Intelligence Platform
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-6">
            <span className="text-white">Rug</span>
            <span
              className="text-accent"
              style={{ textShadow: "0 0 40px rgba(99,102,241,0.5)" }}
            >
              Sentinel
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted max-w-2xl mx-auto mb-4 leading-relaxed">
            Detect rug pulls{" "}
            <span className="text-white font-semibold">before they happen</span>
          </p>
          <p className="text-base text-muted/70 max-w-xl mx-auto mb-12">
            Analyze any ERC-20 token contract in seconds. Get a real-time risk
            score powered by blockchain data, market intelligence, and AI.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/scan"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-accent hover:bg-accent-glow text-white font-bold text-base transition-all hover:shadow-glow hover:scale-105"
            >
              <Shield className="w-5 h-5" />
              Scan Token Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/history"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border border-border hover:border-accent/40 text-muted hover:text-white font-semibold text-base transition-all"
            >
              <Eye className="w-5 h-5" />
              View Recent Scans
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border bg-surface/50 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-black text-accent mb-1">{stat.value}</p>
              <p className="text-xs text-muted font-mono uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Risk Score Demo */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              How the Risk Score Works
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              Our deterministic scoring engine analyzes 6 critical risk factors
              and deducts points for each red flag detected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                score: "70-100",
                level: "SAFE",
                color: "#10b981",
                bg: "rgba(16,185,129,0.05)",
                border: "rgba(16,185,129,0.2)",
                desc: "Token passes all major security checks. Low risk of rug pull.",
              },
              {
                score: "40-69",
                level: "MEDIUM",
                color: "#f59e0b",
                bg: "rgba(245,158,11,0.05)",
                border: "rgba(245,158,11,0.2)",
                desc: "Some risk factors detected. Proceed with caution and DYOR.",
              },
              {
                score: "0-39",
                level: "HIGH RISK",
                color: "#ef4444",
                bg: "rgba(239,68,68,0.05)",
                border: "rgba(239,68,68,0.2)",
                desc: "Multiple red flags. High probability of scam or rug pull.",
              },
            ].map((item) => (
              <div
                key={item.level}
                className="rounded-2xl border p-6 text-center"
                style={{ background: item.bg, borderColor: item.border }}
              >
                <div
                  className="text-4xl font-black mb-2"
                  style={{ color: item.color }}
                >
                  {item.score}
                </div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ borderColor: item.border, color: item.color }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: item.color }}
                  />
                  {item.level}
                </div>
                <p className="text-muted text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Powered by Real Data
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              RugSentinel aggregates data from multiple industry-leading APIs to
              give you the most accurate risk assessment possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 hover:border-accent/30 transition-all group card-hover"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk Factors */}
      <section className="py-20 px-4 border-t border-border bg-surface/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              6 Critical Risk Factors
            </h2>
            <p className="text-muted">
              Every scan checks these key indicators of rug pull risk
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: "Whale Concentration", deduction: "-35 pts", icon: "🐋" },
              { label: "Liquidity Risk", deduction: "-25 pts", icon: "💧" },
              { label: "Contract Verification", deduction: "-20 pts", icon: "🔍" },
              { label: "Ownership Status", deduction: "-15 pts", icon: "🔑" },
              { label: "Token Age", deduction: "-10 pts", icon: "📅" },
              { label: "Trading Behavior", deduction: "-10 pts", icon: "📊" },
            ].map((factor) => (
              <div
                key={factor.label}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card"
              >
                <span className="text-2xl">{factor.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {factor.label}
                  </p>
                  <p className="text-xs text-danger font-mono">{factor.deduction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <AlertTriangle className="w-12 h-12 text-medium mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            Don&apos;t Get Rugged
          </h2>
          <p className="text-muted mb-8 leading-relaxed">
            Thousands of scam tokens are launched every week. RugSentinel gives
            you the intelligence to protect your investments before it&apos;s too late.
          </p>
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-accent hover:bg-accent-glow text-white font-bold text-lg transition-all hover:shadow-glow hover:scale-105"
          >
            <Shield className="w-5 h-5" />
            Start Scanning Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            <span className="font-bold text-white">
              Rug<span className="text-accent">Sentinel</span>
            </span>
          </div>
          <p className="text-xs text-muted text-center">
            For informational purposes only. Not financial advice. Always DYOR.
          </p>
          <p className="text-xs text-muted">
            Built with Next.js, Groq AI & Web3 APIs
          </p>
        </div>
      </footer>
    </div>
  );
}
