"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { RiskFactor } from "@/types";

interface RiskChartProps {
  riskFactors: RiskFactor[];
  riskScore: number;
}

export default function RiskChart({ riskFactors, riskScore }: RiskChartProps) {
  // Radar chart data — invert deductions to show "safety" level
  const radarData = riskFactors.map((f) => ({
    subject: f.label.split(" ")[0], // Short label
    fullLabel: f.label,
    score: f.triggered ? Math.max(10, 100 - f.pointsDeducted * 2) : 100,
    fullMark: 100,
  }));

  // Bar chart data
  const barData = riskFactors.map((f) => ({
    name: f.label,
    deducted: f.pointsDeducted,
    safe: f.triggered ? 0 : f.pointsDeducted || 10,
    color: f.triggered
      ? f.severity === "high"
        ? "#ef4444"
        : "#f59e0b"
      : "#10b981",
  }));

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{ payload: { fullLabel: string; score: number } }>;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 text-xs">
          <p className="text-white font-semibold">{payload[0].payload.fullLabel}</p>
          <p className="text-accent">Safety: {payload[0].payload.score}/100</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-white">Risk Visualization</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted mb-4 font-mono">Safety Radar</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#6b7280", fontSize: 11, fontFamily: "monospace" }}
              />
              <Radar
                name="Safety"
                dataKey="score"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm text-muted mb-4 font-mono">Risk Deductions</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ left: 10, right: 20 }}
            >
              <XAxis
                type="number"
                domain={[0, 40]}
                tick={{ fill: "#6b7280", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fill: "#6b7280", fontSize: 9, fontFamily: "monospace" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#13131f",
                  border: "1px solid #1e1e2e",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#e2e8f0" }}
                formatter={(value: number) => [`-${value} pts`, "Deducted"]}
              />
              <Bar dataKey="deducted" radius={[0, 4, 4, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Score summary */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted font-mono">FINAL SECURITY SCORE</p>
            <p className="text-2xl font-black text-white tabular-nums">
              {riskScore}
              <span className="text-muted text-base font-normal">/100</span>
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs text-muted font-mono">POINTS DEDUCTED</p>
            <p className="text-2xl font-black text-danger tabular-nums">
              -{100 - riskScore}
            </p>
          </div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-surface overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${riskScore}%`,
              background: `linear-gradient(90deg, #ef4444, #f59e0b ${riskScore < 40 ? "100%" : "50%"}, #10b981)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
