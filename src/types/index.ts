export interface TokenData {
  // Basic info
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  deployedAt: string | null;
  ageInDays: number;

  // Holder data (Moralis)
  holderCount: number;
  topHolderPercent: number; // % held by top wallet
  top10HolderPercent: number; // % held by top 10 wallets

  // Contract safety (Etherscan)
  isVerified: boolean;
  isOwnershipRenounced: boolean;
  hasProxyContract: boolean;
  contractCreator: string;
  sourceCodeAvailable: boolean;

  // Market data (CoinMarketCap)
  price: number | null;
  marketCap: number | null;
  volume24h: number | null;
  priceChange24h: number | null;
  liquidity: number | null;

  // On-chain activity (Alchemy)
  recentTransferCount: number;
  uniqueWallets: number;
  suspiciousActivity: boolean;

  // Raw flags
  lowLiquidity: boolean;
  abnormalVolume: boolean;
}

export interface RiskFactor {
  id: string;
  label: string;
  description: string;
  severity: "high" | "medium" | "low" | "safe";
  pointsDeducted: number;
  triggered: boolean;
  value?: string | number;
}

export interface RiskResult {
  tokenAddress: string;
  tokenData: TokenData;
  riskScore: number;
  riskLevel: "SAFE" | "MEDIUM" | "HIGH";
  riskFactors: RiskFactor[];
  aiExplanation: string;
  analyzedAt: string;
}

export interface ScanHistory {
  id: string;
  token_address: string;
  token_name: string;
  token_symbol: string;
  risk_score: number;
  risk_level: string;
  analyzed_at: string;
  ai_explanation: string;
}

export interface ApiError {
  error: string;
  details?: string;
}
