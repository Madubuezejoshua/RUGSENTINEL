import axios from "axios";

const MORALIS_API_KEY = process.env.MORALIS_API_KEY!;
const MORALIS_BASE_URL = "https://deep-index.moralis.io/api/v2.2";

export interface MoralisData {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  holderCount: number;
  topHolderPercent: number;
  top10HolderPercent: number;
  deployedAt: string | null;
}

export async function fetchMoralisData(tokenAddress: string): Promise<MoralisData> {
  const headers = {
    "X-API-Key": MORALIS_API_KEY,
    accept: "application/json",
  };

  try {
    // Fetch token metadata
    const metaRes = await axios.get(
      `${MORALIS_BASE_URL}/erc20/metadata?chain=eth&addresses%5B0%5D=${tokenAddress}`,
      { headers, timeout: 15000 }
    );

    const meta = metaRes.data?.[0] || {};

    // Fetch top token holders
    let topHolderPercent = 0;
    let top10HolderPercent = 0;
    let holderCount = 0;

    try {
      const holdersRes = await axios.get(
        `${MORALIS_BASE_URL}/erc20/${tokenAddress}/owners?chain=eth&order=DESC&limit=10`,
        { headers, timeout: 15000 }
      );

      const holders = holdersRes.data?.result || [];
      holderCount = holdersRes.data?.total || holders.length;

      if (holders.length > 0) {
        const totalSupplyNum = parseFloat(meta.total_supply || "0");
        const decimals = parseInt(meta.decimals || "18");
        const divisor = Math.pow(10, decimals);

        if (totalSupplyNum > 0) {
          const topBalance = parseFloat(holders[0]?.balance || "0") / divisor;
          const totalSupplyAdjusted = totalSupplyNum / divisor;
          topHolderPercent = (topBalance / totalSupplyAdjusted) * 100;

          const top10Balance = holders
            .slice(0, 10)
            .reduce((sum: number, h: { balance?: string }) => sum + parseFloat(h.balance || "0") / divisor, 0);
          top10HolderPercent = (top10Balance / totalSupplyAdjusted) * 100;
        }
      }
    } catch (err) {
      console.error("Moralis holders fetch error:", err);
    }

    return {
      name: meta.name || "Unknown Token",
      symbol: meta.symbol || "???",
      decimals: parseInt(meta.decimals || "18"),
      totalSupply: meta.total_supply || "0",
      holderCount,
      topHolderPercent: Math.min(topHolderPercent, 100),
      top10HolderPercent: Math.min(top10HolderPercent, 100),
      deployedAt: null,
    };
  } catch (error) {
    console.error("Moralis fetch error:", error);
    return {
      name: "Unknown Token",
      symbol: "???",
      decimals: 18,
      totalSupply: "0",
      holderCount: 0,
      topHolderPercent: 0,
      top10HolderPercent: 0,
      deployedAt: null,
    };
  }
}
