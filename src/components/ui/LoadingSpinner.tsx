"use client";

import { Shield } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  stage?: string;
}

const stages = [
  "Connecting to blockchain...",
  "Fetching holder distribution...",
  "Checking contract verification...",
  "Analyzing market data...",
  "Running risk engine...",
  "Generating AI explanation...",
];

export default function LoadingSpinner({ message, stage }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8">
      {/* Animated shield */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-accent/20 blur-2xl animate-pulse-slow" />
        <div className="relative w-20 h-20 rounded-full border-2 border-accent/30 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin" />
          <Shield className="w-8 h-8 text-accent" />
        </div>
      </div>

      {/* Status text */}
      <div className="text-center space-y-2">
        <p className="text-white font-semibold text-lg">
          {message || "Analyzing Token..."}
        </p>
        <p className="text-muted text-sm font-mono">
          {stage || "Processing blockchain data"}
        </p>
      </div>

      {/* Stage indicators */}
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {stages.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: i < 3 ? "#10b981" : i === 3 ? "#6366f1" : "#374151",
                animation: i === 3 ? "pulse 1s infinite" : "none",
              }}
            />
            <span
              className="text-xs font-mono"
              style={{
                color: i < 3 ? "#10b981" : i === 3 ? "#e2e8f0" : "#374151",
              }}
            >
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
