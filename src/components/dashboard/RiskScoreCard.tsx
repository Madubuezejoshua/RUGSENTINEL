"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

interface RiskScoreCardProps {
  score: number;
  level: "SAFE" | "MEDIUM" | "HIGH";
  tokenName: string;
  tokenSymbol: string;
}

export default function RiskScoreCard({
  score,
  level,
  tokenName,
  tokenSymbol,
}: RiskScoreCardProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [score]);

  const config = {
    SAFE: {
      color: "#10b981",
      glow: "rgba(16,185,129,0.3)",
      bg: "rgba(16,185,129,0.05)",
      border: "rgba(16,185,129,0.2)",
      label: "SAFE",
      sublabel: "Low Risk Token",
      textClass: "text-safe",
    },
    MEDIUM: {
      color: "#f59e0b",
      glow: "rgba(245,158,11,0.3)",
      bg: "rgba(245,158,11,0.05)",
      border: "rgba(245,158,11,0.2)",
      label: "MEDIUM RISK",
      sublabel: "Proceed with Caution",
      textClass: "text-medium",
    },
    HIGH: {
      color: "#ef4444",
      glow: "rgba(239,68,68,0.3)",
      bg: "rgba(239,68,68,0.05)",
      border: "rgba(239,68,68,0.2)",
      label: "HIGH RISK",
      sublabel: "Potential Rug Pull",
      textClass: "text-danger",
    },
  };

  const { color, glow, bg, border, label, sublabel, textClass } = config[level];

  // SVG circle progress
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayScore / 100) * circumference;
  const strokeDashoffset = circumference - progress;

  return (
    <div
      className="relative rounded-2xl p-8 flex flex-col items-center gap-6 border"
      style={{ background: bg, borderColor: border, boxShadow: `0 0 40px ${glow}` }}
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-sm font-mono text-muted uppercase tracking-widest mb-1">
          Security Score
        </h2>
        <p className="text-white font-bold text-xl">
          {tokenName}{" "}
          <span className="text-muted font-normal text-base">({tokenSymbol})</span>
        </p>
      </div>

      {/* Circular progress */}
      <div className="relative w-52 h-52">
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-30"
          style={{ background: color }}
        />

        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 200 200"
        >
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.05s ease" }}
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={clsx("text-6xl font-black tabular-nums", textClass)}
            style={{ textShadow: `0 0 30px ${glow}` }}
          >
            {displayScore}
          </span>
          <span className="text-muted text-sm font-mono">/100</span>
        </div>
      </div>

      {/* Risk level badge */}
      <div className="text-center">
        <div
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full border font-bold text-sm tracking-widest uppercase"
          style={{ borderColor: border, color, background: bg }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: color }}
          />
          {label}
        </div>
        <p className="text-muted text-xs mt-2">{sublabel}</p>
      </div>

      {/* Score interpretation bar */}
      <div className="w-full space-y-2">
        <div className="flex justify-between text-xs text-muted font-mono">
          <span>HIGH RISK</span>
          <span>MEDIUM</span>
          <span>SAFE</span>
        </div>
        <div className="relative h-2 rounded-full overflow-hidden bg-surface">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000"
            style={{
              width: `${displayScore}%`,
              background: `linear-gradient(90deg, #ef4444, #f59e0b, #10b981)`,
            }}
          />
          {/* Marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white transition-all duration-1000"
            style={{
              left: `calc(${displayScore}% - 6px)`,
              background: color,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted font-mono">
          <span>0</span>
          <span>40</span>
          <span>70</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
