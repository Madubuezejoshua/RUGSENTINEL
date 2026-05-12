import axios from "axios";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY!;
const ALCHEMY_BASE_URL = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

export interface AlchemyData {
  recentTransferCount: number;
  uniqueWallets: number;
  suspiciousActivity: boolean;
  deployedAt: string | null;
  contractCreator: string;
}

export async function fetchAlchemyData(tokenAddress: string): Promise<AlchemyData> {
  try {
    // Get token transfers (last 100)
    const transfersRes = await axios.post(
      ALCHEMY_BASE_URL,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "alchemy_getAssetTransfers",
        params: [
          {
            fromBlock: "0x0",
            toBlock: "latest",
            contractAddresses: [tokenAddress],
            category: ["erc20"],
            withMetadata: true,
            excludeZeroValue: true,
            maxCount: "0x64", // 100
          },
        ],
      },
      { timeout: 15000 }
    );

    const transfers = transfersRes.data?.result?.transfers || [];
    const uniqueAddresses = new Set<string>();
    transfers.forEach((t: { from?: string; to?: string }) => {
      if (t.from) uniqueAddresses.add(t.from.toLowerCase());
      if (t.to) uniqueAddresses.add(t.to.toLowerCase());
    });

    // Detect suspicious: if >80% of transfers are from same wallet
    const fromCounts: Record<string, number> = {};
    transfers.forEach((t: { from?: string }) => {
      if (t.from) {
        fromCounts[t.from.toLowerCase()] = (fromCounts[t.from.toLowerCase()] || 0) + 1;
      }
    });
    const maxFromCount = Math.max(...Object.values(fromCounts), 0);
    const suspiciousActivity =
      transfers.length > 10 && maxFromCount / transfers.length > 0.8;

    // Get contract creation info
    let deployedAt: string | null = null;
    let contractCreator = "Unknown";

    try {
      const creationRes = await axios.post(
        ALCHEMY_BASE_URL,
        {
          jsonrpc: "2.0",
          id: 2,
          method: "eth_getTransactionByHash",
          params: [transfers[transfers.length - 1]?.hash || "0x0"],
        },
        { timeout: 10000 }
      );
      if (creationRes.data?.result?.blockNumber) {
        const blockRes = await axios.post(
          ALCHEMY_BASE_URL,
          {
            jsonrpc: "2.0",
            id: 3,
            method: "eth_getBlockByNumber",
            params: [creationRes.data.result.blockNumber, false],
          },
          { timeout: 10000 }
        );
        const timestamp = blockRes.data?.result?.timestamp;
        if (timestamp) {
          deployedAt = new Date(parseInt(timestamp, 16) * 1000).toISOString();
        }
      }
    } catch {
      // Non-critical, continue
    }

    return {
      recentTransferCount: transfers.length,
      uniqueWallets: uniqueAddresses.size,
      suspiciousActivity,
      deployedAt,
      contractCreator,
    };
  } catch (error) {
    console.error("Alchemy fetch error:", error);
    return {
      recentTransferCount: 0,
      uniqueWallets: 0,
      suspiciousActivity: false,
      deployedAt: null,
      contractCreator: "Unknown",
    };
  }
}
