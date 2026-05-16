import Navbar from "@/components/ui/Navbar";
import { Activity, Shield, Brain, LayoutDashboard, Clock, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: <Activity className="w-5 h-5" />,
    title: "Real-Time Analysis",
    desc: "Pulls live data from Alchemy, Moralis, Etherscan, and CoinMarketCap for up-to-date risk assessment.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Deterministic Risk Engine",
    desc: "6-factor scoring system starting at 100, deducting for each red flag detected on-chain.",
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "AI Explanations",
    desc: "Groq LLaMA3 explains risks in plain English so every investor can understand the results.",
  },
  {
    icon: <LayoutDashboard className="w-5 h-5" />,
    title: "Modern Dashboard",
    desc: "Bloomberg-terminal-inspired dark UI for a professional, data-dense experience.",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Scan History",
    desc: "All results are stored in Supabase for easy access, review, and comparison over time.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Contract Security",
    desc: "Checks contract verification status, ownership renouncement, and proxy patterns.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen dash-grid" style={{ background: "var(--dash-bg)" }}>
      <Navbar />
      <main className="max-w-4xl mx-auto pt-28 pb-16 px-4">
        {/* Header */}
        <div className="mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4"
            style={{ background: "rgba(200,241,53,0.08)", border: "1px solid rgba(200,241,53,0.2)", color: "#c8f135" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#c8f135" }} />
            Platform Features
          </div>
          <h1 className="text-3xl font-black text-white mb-3">What RugSentinel Does</h1>
          <p className="text-sm" style={{ color: "#6b7070" }}>
            Everything you need to evaluate ERC-20 token safety before investing.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5 rounded-2xl card-hover"
              style={{ background: "var(--dash-card)", border: "1px solid var(--dash-border)" }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(200,241,53,0.1)", border: "1px solid rgba(200,241,53,0.2)", color: "#c8f135" }}
              >
                {f.icon}
              </div>
              <div>
                <p className="font-bold text-white mb-1">{f.title}</p>
                <p className="text-sm leading-relaxed" style={{ color: "#6b7070" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
