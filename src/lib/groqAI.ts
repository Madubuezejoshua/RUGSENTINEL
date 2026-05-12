import Groq from "groq-sdk";
import { TokenData, RiskFactor } from "@/types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function generateAIExplanation(
  riskScore: number,
  riskLevel: string,
  tokenData: TokenData,
  riskFactors: RiskFactor[]
): Promise<string> {
  const triggeredFactors = riskFactors.filter((f) => f.triggered);
  const safeFactors = riskFactors.filter((f) => !f.triggered);

  const factorSummary = triggeredFactors
    .map((f) => `- ${f.label}: ${f.description}`)
    .join("\n");

  const safeSummary = safeFactors
    .map((f) => `- ${f.label}: ${f.description}`)
    .join("\n");

  const prompt = `You are a crypto security analyst. Analyze this token and explain the risk in simple English for a non-technical investor.

TOKEN INFORMATION:
- Name: ${tokenData.name} (${tokenData.symbol})
- Contract: ${tokenData.address}
- Age: ${tokenData.ageInDays} days old
- Holders: ${tokenData.holderCount.toLocaleString()}
- Top wallet holds: ${tokenData.topHolderPercent.toFixed(1)}% of supply
- Contract verified: ${tokenData.isVerified ? "Yes" : "No"}
- Ownership renounced: ${tokenData.isOwnershipRenounced ? "Yes" : "No"}
- Market cap: ${tokenData.marketCap ? "$" + tokenData.marketCap.toLocaleString() : "Unknown"}
- 24h volume: ${tokenData.volume24h ? "$" + tokenData.volume24h.toLocaleString() : "Unknown"}

RISK SCORE: ${riskScore}/100 — ${riskLevel}

RISK FLAGS DETECTED:
${factorSummary || "None — token appears clean"}

SAFE INDICATORS:
${safeSummary || "None"}

Write a 4-6 sentence explanation of why this token is ${riskLevel === "SAFE" ? "relatively safe" : riskLevel === "MEDIUM" ? "moderately risky" : "HIGH RISK"}. 
Use plain English. No bullet points. No markdown. No technical jargon. 
Start with the most important risk or safety factor. 
End with a clear recommendation for investors.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are RugSentinel AI, a crypto security expert. You explain token risks in simple, clear English to protect investors from scams. Be direct, honest, and concise.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.3,
      max_tokens: 300,
    });

    return (
      completion.choices[0]?.message?.content?.trim() ||
      "Unable to generate AI explanation at this time."
    );
  } catch (error) {
    console.error("Groq AI error:", error);
    return generateFallbackExplanation(riskScore, riskLevel, triggeredFactors);
  }
}

function generateFallbackExplanation(
  riskScore: number,
  riskLevel: string,
  triggeredFactors: RiskFactor[]
): string {
  if (riskLevel === "SAFE") {
    return `This token scored ${riskScore}/100 on our security analysis, indicating a relatively low risk profile. The contract appears to be verified and shows healthy distribution patterns. While no token is completely risk-free in crypto, this one passes our key security checks. Always do your own research before investing.`;
  } else if (riskLevel === "MEDIUM") {
    const topFactor = triggeredFactors[0]?.label || "several risk factors";
    return `This token scored ${riskScore}/100, placing it in the medium risk category. Our analysis flagged ${topFactor} as a concern. While not an immediate red flag, investors should proceed with caution and only invest what they can afford to lose. Monitor this token closely for any sudden changes in holder distribution or liquidity.`;
  } else {
    const factors = triggeredFactors.map((f) => f.label).join(", ");
    return `WARNING: This token scored only ${riskScore}/100 — HIGH RISK. Our analysis detected multiple serious red flags including: ${factors}. These are common characteristics of rug pull scams. We strongly advise against investing in this token. If you already hold this token, consider exiting your position.`;
  }
}
