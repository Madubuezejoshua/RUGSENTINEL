"use client";

import { RiskFactor } from "@/types";
import { AlertTriangle, CheckCircle, AlertCircle, Info } from "lucide-react";
import { clsx } from "clsx";

interface RiskFactorsGridProps {
  factors: RiskFactor[];
}

export default function RiskFactorsGrid({ factors }: RiskFactorsGridProps) {
  const getIcon = (severity: string, triggered: boolean) => {
    if (!triggered) return <CheckCircle className="w-5 h-5" />;
    if (severity === "high") return <AlertTriangle className="w-5 h-5" />;
    if (severity === "medium") return <AlertCircle className="w-5 h-5" />;
    return <Info className="w-5 h-5" />;
  };

  const getColors = (severity: string, triggered: boolean) => {
    if (!triggered) {
      return {
        bg: "bg-safe/5",
        border: "border-safe/20",
        text: "text-safe",
        icon: "text-safe",
      };
    }
    if (severity === "high") {
      return {
        bg: "bg-danger/5",
        border: "border-danger/20",
        text: "text-danger",
        icon: "text-danger",
      };
    }
    if (severity === "medium") {
      return {
        bg: "bg-medium/5",
        border: "border-medium/20",
        text: "text-medium",
        icon: "text-medium",
      };
    }
    return {
      bg: "bg-subtle/5",
      border: "border-subtle/20",
      text: "text-muted",
      icon: "text-muted",
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Risk Factor Breakdown</h3>
        <span className="text-xs text-muted font-mono">
          {factors.filter((f) => f.triggered).length} / {factors.length} flags detected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {factors.map((factor) => {
          const colors = getColors(factor.severity, factor.triggered);
          return (
            <div
              key={factor.id}
              className={clsx(
                "rounded-xl p-5 border transition-all hover:scale-[1.02]",
                colors.bg,
                colors.border
              )}
            >
              <div className="flex items-start gap-3">
                <div className={clsx("mt-0.5", colors.icon)}>
                  {getIcon(factor.severity, factor.triggered)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-white text-sm">
                      {factor.label}
                    </h4>
                    {factor.pointsDeducted > 0 && (
                      <span className={clsx("text-xs font-mono font-bold", colors.text)}>
                        -{factor.pointsDeducted}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {factor.description}
                  </p>
                  {factor.value && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-muted font-mono">Value:</span>
                      <span className={clsx("text-xs font-mono font-semibold", colors.text)}>
                        {factor.value}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
