import { TokenData, RiskFactor, RiskResult } from "@/types";

export function calculateRiskScore(tokenData: TokenData): {
  riskScore: number;
  riskLevel: "SAFE" | "MEDIUM" | "HIGH";
  riskFactors: RiskFactor[];
} {
  let riskScore = 100;
  const riskFactors: RiskFactor[] = [];

  // ─── Factor 1: Whale Concentration ───────────────────────────────────────
  const whaleTriggered = tokenData.topHolderPercent > 50;
  const whaleDeduction = whaleTriggered ? 35 : 0;
  riskScore -= whaleDeduction;
  riskFactors.push({
    id: "whale_concentration",
    label: "Whale Concentration",
    description: whaleTriggered
      ? `Top wallet holds ${tokenData.topHolderPercent.toFixed(1)}% of supply — extreme dump risk`
      : `Top wallet holds ${tokenData.topHolderPercent.toFixed(1)}% of supply — acceptable distribution`,
    severity: whaleTriggered ? "high" : "safe",
    pointsDeducted: whaleDeduction,
    triggered: whaleTriggered,
    value: `${tokenData.topHolderPercent.toFixed(1)}%`,
  });

  // ─── Factor 2: Liquidity Risk ─────────────────────────────────────────────
  const liquidityTriggered = tokenData.lowLiquidity;
  const liquidityDeduction = liquidityTriggered ? 25 : 0;
  riskScore -= liquidityDeduction;
  riskFactors.push({
    id: "liquidity_risk",
    label: "Liquidity Risk",
    description: liquidityTriggered
      ? `Low or unstable liquidity detected — token may be hard to sell`
      : `Liquidity appears adequate for trading`,
    severity: liquidityTriggered ? "high" : "safe",
    pointsDeducted: liquidityDeduction,
    triggered: liquidityTriggered,
    value: tokenData.liquidity
      ? `$${formatNumber(tokenData.liquidity)}`
      : "No data",
  });

  // ─── Factor 3: Contract Verification ─────────────────────────────────────
  const unverifiedTriggered = !tokenData.isVerified;
  const unverifiedDeduction = unverifiedTriggered ? 20 : 0;
  riskScore -= unverifiedDeduction;
  riskFactors.push({
    id: "contract_verification",
    label: "Contract Verification",
    description: unverifiedTriggered
      ? "Contract source code is NOT verified on Etherscan — hidden malicious code possible"
      : "Contract is verified on Etherscan — source code is publicly auditable",
    severity: unverifiedTriggered ? "high" : "safe",
    pointsDeducted: unverifiedDeduction,
    triggered: unverifiedTriggered,
    value: tokenData.isVerified ? "Verified" : "Unverified",
  });

  // ─── Factor 4: Ownership Renouncement ────────────────────────────────────
  const ownershipTriggered = !tokenData.isOwnershipRenounced;
  const ownershipDeduction = ownershipTriggered ? 15 : 0;
  riskScore -= ownershipDeduction;
  riskFactors.push({
    id: "ownership_renounced",
    label: "Ownership Status",
    description: ownershipTriggered
      ? "Contract ownership has NOT been renounced — developer can modify contract"
      : "Ownership has been renounced — no single party controls the contract",
    severity: ownershipTriggered ? "medium" : "safe",
    pointsDeducted: ownershipDeduction,
    triggered: ownershipTriggered,
    value: tokenData.isOwnershipRenounced ? "Renounced" : "Active Owner",
  });

  // ─── Factor 5: Token Age ──────────────────────────────────────────────────
  const newTokenTriggered = tokenData.ageInDays < 7;
  const ageDeduction = newTokenTriggered ? 10 : 0;
  riskScore -= ageDeduction;
  riskFactors.push({
    id: "token_age",
    label: "Token Age",
    description: newTokenTriggered
      ? `Token is only ${tokenData.ageInDays} day(s) old — very new tokens carry higher risk`
      : `Token has been live for ${tokenData.ageInDays} days — established presence`,
    severity: newTokenTriggered ? "medium" : "safe",
    pointsDeducted: ageDeduction,
    triggered: newTokenTriggered,
    value: `${tokenData.ageInDays} days`,
  });

  // ─── Factor 6: Abnormal Volume ────────────────────────────────────────────
  const volumeTriggered = tokenData.abnormalVolume || tokenData.suspiciousActivity;
  const volumeDeduction = volumeTriggered ? 10 : 0;
  riskScore -= volumeDeduction;
  riskFactors.push({
    id: "trading_volume",
    label: "Trading Behavior",
    description: volumeTriggered
      ? "Abnormal trading patterns detected — possible wash trading or coordinated activity"
      : "Trading volume appears organic and normal",
    severity: volumeTriggered ? "medium" : "safe",
    pointsDeducted: volumeDeduction,
    triggered: volumeTriggered,
    value: tokenData.volume24h
      ? `$${formatNumber(tokenData.volume24h)}`
      : "No data",
  });

  // Clamp score between 0 and 100
  riskScore = Math.max(0, Math.min(100, riskScore));

  // Determine risk level
  // Note: lower score = more risky (we subtracted from 100)
  // Invert: high score = safe, low score = risky
  let riskLevel: "SAFE" | "MEDIUM" | "HIGH";
  if (riskScore >= 70) {
    riskLevel = "SAFE";
  } else if (riskScore >= 40) {
    riskLevel = "MEDIUM";
  } else {
    riskLevel = "HIGH";
  }

  return { riskScore, riskLevel, riskFactors };
}

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toFixed(2);
}

export function buildRiskResult(
  tokenAddress: string,
  tokenData: TokenData,
  aiExplanation: string
): RiskResult {
  const { riskScore, riskLevel, riskFactors } = calculateRiskScore(tokenData);

  return {
    tokenAddress,
    tokenData,
    riskScore,
    riskLevel,
    riskFactors,
    aiExplanation,
    analyzedAt: new Date().toISOString(),
  };
}
