import Navbar from "@/components/ui/Navbar";

const STEPS = [
  {
    step: "01",
    icon: "📋",
    title: "Enter a Token Address",
    desc: "Paste any ERC-20 contract address into the scan bar. Ethereum mainnet only.",
  },
  {
    step: "02",
    icon: "🔗",
    title: "Data Aggregation",
    desc: "The platform fetches live data from Alchemy, Moralis, Etherscan, and CoinMarketCap simultaneously.",
  },
  {
    step: "03",
    icon: "⚙️",
    title: "Risk Analysis",
    desc: "The risk engine evaluates 6 key factors and deducts points for each red flag found.",
  },
  {
    step: "04",
    icon: "🤖",
    title: "AI Explanation",
    desc: "Groq LLaMA3 generates a plain-English summary of the risks so anyone can understand.",
  },
  {
    step: "05",
    icon: "📊",
    title: "Results & History",
    desc: "Your scan result and explanation are displayed on the dashboard and saved to Supabase for future reference.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen dash-grid" style={{ background: "var(--dash-bg)" }}>
      <Navbar />
      <main className="max-w-3xl mx-auto pt-28 pb-16 px-4">
        {/* Header */}
        <div className="mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4"
            style={{ background: "rgba(200,241,53,0.08)", border: "1px solid rgba(200,241,53,0.2)", color: "#c8f135" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#c8f135" }} />
            The Process
          </div>
          <h1 className="text-3xl font-black text-white mb-3">How It Works</h1>
          <p className="text-sm" style={{ color: "#6b7070" }}>
            From contract address to AI-powered risk score in under 15 seconds.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className="flex items-start gap-5 p-5 rounded-2xl card-hover"
              style={{ background: "var(--dash-card)", border: "1px solid var(--dash-border)" }}
            >
              {/* Step number */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-black font-mono"
                style={{ background: "rgba(200,241,53,0.1)", border: "1px solid rgba(200,241,53,0.2)", color: "#c8f135" }}
              >
                {s.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{s.icon}</span>
                  <p className="font-bold text-white">{s.title}</p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#6b7070" }}>{s.desc}</p>
              </div>
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div
                  className="absolute left-[2.75rem] mt-14 w-px h-4"
                  style={{ background: "var(--dash-border)" }}
                />
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
