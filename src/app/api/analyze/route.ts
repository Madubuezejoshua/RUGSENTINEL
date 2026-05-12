import { NextRequest, NextResponse } from "next/server";
import { fetchAlchemyData } from "@/lib/fetchers/alchemy";
import { fetchMoralisData } from "@/lib/fetchers/moralis";
import { fetchEtherscanData } from "@/lib/fetchers/etherscan";
import { fetchCoinMarketCapData } from "@/lib/fetchers/coinmarketcap";
import { calculateRiskScore } from "@/lib/riskEngine";
import { generateAIExplanation } from "@/lib/groqAI";
import { createServerSupabaseClient } from "@/lib/supabase";
import { TokenData } from "@/types";

// Validate Ethereum address
function isValidEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenAddress } = body;

    // Input validation
    if (!tokenAddress || typeof tokenAddress !== "string") {
      return NextResponse.json(
        { error: "Token address is required" },
        { status: 400 }
      );
    }

    const cleanAddress = tokenAddress.trim().toLowerCase();

    if (!isValidEthAddress(cleanAddress)) {
      return NextResponse.json(
        { error: "Invalid Ethereum contract address. Must be 0x followed by 40 hex characters." },
        { status: 400 }
      );
    }

    console.log(`[RugSentinel] Analyzing token: ${cleanAddress}`);

    // ─── Fetch all data in parallel ──────────────────────────────────────────
    const [alchemyData, moralisData, etherscanData, cmcData] = await Promise.allSettled([
      fetchAlchemyData(cleanAddress),
      fetchMoralisData(cleanAddress),
      fetchEtherscanData(cleanAddress),
      fetchCoinMarketCapData(cleanAddress),
    ]);

    const alchemy = alchemyData.status === "fulfilled" ? alchemyData.value : {
      recentTransferCount: 0,
      uniqueWallets: 0,
      suspiciousActivity: false,
      deployedAt: null,
      contractCreator: "Unknown",
    };

    const moralis = moralisData.status === "fulfilled" ? moralisData.value : {
      name: "Unknown Token",
      symbol: "???",
      decimals: 18,
      totalSupply: "0",
      holderCount: 0,
      topHolderPercent: 0,
      top10HolderPercent: 0,
      deployedAt: null,
    };

    const etherscan = etherscanData.status === "fulfilled" ? etherscanData.value : {
      isVerified: false,
      isOwnershipRenounced: false,
      hasProxyContract: false,
      contractCreator: "Unknown",
      sourceCodeAvailable: false,
      deployedAt: null,
    };

    const cmc = cmcData.status === "fulfilled" ? cmcData.value : {
      price: null,
      marketCap: null,
      volume24h: null,
      priceChange24h: null,
      liquidity: null,
      lowLiquidity: true,
      abnormalVolume: false,
    };

    // ─── Determine token age ──────────────────────────────────────────────────
    const deployedAt = etherscan.deployedAt || alchemy.deployedAt || moralis.deployedAt;
    let ageInDays = 0;
    if (deployedAt) {
      const deployDate = new Date(deployedAt);
      const now = new Date();
      ageInDays = Math.floor((now.getTime() - deployDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    // ─── Build normalized tokenData object ───────────────────────────────────
    const tokenData: TokenData = {
      address: cleanAddress,
      name: moralis.name,
      symbol: moralis.symbol,
      decimals: moralis.decimals,
      totalSupply: moralis.totalSupply,
      deployedAt,
      ageInDays,

      holderCount: moralis.holderCount,
      topHolderPercent: moralis.topHolderPercent,
      top10HolderPercent: moralis.top10HolderPercent,

      isVerified: etherscan.isVerified,
      isOwnershipRenounced: etherscan.isOwnershipRenounced,
      hasProxyContract: etherscan.hasProxyContract,
      contractCreator: etherscan.contractCreator || alchemy.contractCreator,
      sourceCodeAvailable: etherscan.sourceCodeAvailable,

      price: cmc.price,
      marketCap: cmc.marketCap,
      volume24h: cmc.volume24h,
      priceChange24h: cmc.priceChange24h,
      liquidity: cmc.liquidity,

      recentTransferCount: alchemy.recentTransferCount,
      uniqueWallets: alchemy.uniqueWallets,
      suspiciousActivity: alchemy.suspiciousActivity,

      lowLiquidity: cmc.lowLiquidity,
      abnormalVolume: cmc.abnormalVolume,
    };

    // ─── Run Risk Engine ──────────────────────────────────────────────────────
    const { riskScore, riskLevel, riskFactors } = calculateRiskScore(tokenData);

    // ─── Generate AI Explanation ──────────────────────────────────────────────
    const aiExplanation = await generateAIExplanation(
      riskScore,
      riskLevel,
      tokenData,
      riskFactors
    );

    // ─── Save to Supabase ─────────────────────────────────────────────────────
    try {
      const supabase = createServerSupabaseClient();
      await supabase.from("scan_history").insert({
        token_address: cleanAddress,
        token_name: tokenData.name,
        token_symbol: tokenData.symbol,
        risk_score: riskScore,
        risk_level: riskLevel,
        ai_explanation: aiExplanation,
        token_data: tokenData,
        risk_factors: riskFactors,
        analyzed_at: new Date().toISOString(),
      });
    } catch (dbError) {
      console.error("[RugSentinel] Supabase save error:", dbError);
      // Non-critical — continue
    }

    // ─── Return result ────────────────────────────────────────────────────────
    return NextResponse.json({
      tokenAddress: cleanAddress,
      tokenData,
      riskScore,
      riskLevel,
      riskFactors,
      aiExplanation,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[RugSentinel] Analysis error:", error);
    return NextResponse.json(
      {
        error: "Analysis failed. Please check the contract address and try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
