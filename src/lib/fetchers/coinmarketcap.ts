import axios from "axios";

const CMC_API_KEY = process.env.COINMARKETCAP_API_KEY!;
const CMC_BASE_URL = "https://pro-api.coinmarketcap.com/v1";

export interface CoinMarketCapData {
  price: number | null;
  marketCap: number | null;
  volume24h: number | null;
  priceChange24h: number | null;
  liquidity: number | null;
  lowLiquidity: boolean;
  abnormalVolume: boolean;
}

export async function fetchCoinMarketCapData(
  tokenAddress: string,
  tokenSymbol?: string
): Promise<CoinMarketCapData> {
  const headers = {
    "X-CMC_PRO_API_KEY": CMC_API_KEY,
    Accept: "application/json",
  };

  try {
    // Try to get token info by contract address first
    let quoteData: Record<string, unknown> | null = null;

    try {
      const infoRes = await axios.get(`${CMC_BASE_URL}/cryptocurrency/info`, {
        headers,
        params: {
          address: tokenAddress,
        },
        timeout: 15000,
      });

      const tokenInfo = Object.values(infoRes.data?.data || {})[0] as { id?: number } | undefined;
      if (tokenInfo?.id) {
        const quoteRes = await axios.get(`${CMC_BASE_URL}/cryptocurrency/quotes/latest`, {
          headers,
          params: {
            id: tokenInfo.id,
            convert: "USD",
          },
          timeout: 15000,
        });
        quoteData = Object.values(quoteRes.data?.data || {})[0] as Record<string, unknown> | null;
      }
    } catch {
      // Try by symbol if address lookup fails
      if (tokenSymbol && tokenSymbol !== "???") {
        try {
          const quoteRes = await axios.get(`${CMC_BASE_URL}/cryptocurrency/quotes/latest`, {
            headers,
            params: {
              symbol: tokenSymbol,
              convert: "USD",
            },
            timeout: 15000,
          });
          quoteData = Object.values(quoteRes.data?.data || {})[0] as Record<string, unknown> | null;
        } catch {
          // Symbol lookup also failed
        }
      }
    }

    if (!quoteData) {
      return {
        price: null,
        marketCap: null,
        volume24h: null,
        priceChange24h: null,
        liquidity: null,
        lowLiquidity: true,
        abnormalVolume: false,
      };
    }

    const quote = (quoteData as { quote?: { USD?: Record<string, number> } })?.quote?.USD || {};
    const price = quote.price ?? null;
    const marketCap = quote.market_cap ?? null;
    const volume24h = quote.volume_24h ?? null;
    const priceChange24h = quote.percent_change_24h ?? null;

    // Estimate liquidity from market cap (rough approximation)
    const liquidity = marketCap ? marketCap * 0.05 : null;

    // Low liquidity: market cap < $100k or volume < $10k
    const lowLiquidity =
      (marketCap !== null && marketCap < 100000) ||
      (volume24h !== null && volume24h < 10000) ||
      marketCap === null;

    // Abnormal volume: volume > 5x market cap (wash trading signal)
    const abnormalVolume =
      marketCap !== null &&
      volume24h !== null &&
      marketCap > 0 &&
      volume24h / marketCap > 5;

    return {
      price,
      marketCap,
      volume24h,
      priceChange24h,
      liquidity,
      lowLiquidity,
      abnormalVolume,
    };
  } catch (error) {
    console.error("CoinMarketCap fetch error:", error);
    return {
      price: null,
      marketCap: null,
      volume24h: null,
      priceChange24h: null,
      liquidity: null,
      lowLiquidity: true,
      abnormalVolume: false,
    };
  }
}
