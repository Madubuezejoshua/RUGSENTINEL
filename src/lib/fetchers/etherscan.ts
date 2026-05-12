import axios from "axios";

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY!;
const ETHERSCAN_BASE_URL = "https://api.etherscan.io/api";

export interface EtherscanData {
  isVerified: boolean;
  isOwnershipRenounced: boolean;
  hasProxyContract: boolean;
  contractCreator: string;
  sourceCodeAvailable: boolean;
  deployedAt: string | null;
}

export async function fetchEtherscanData(tokenAddress: string): Promise<EtherscanData> {
  try {
    // Check contract verification
    const sourceRes = await axios.get(ETHERSCAN_BASE_URL, {
      params: {
        module: "contract",
        action: "getsourcecode",
        address: tokenAddress,
        apikey: ETHERSCAN_API_KEY,
      },
      timeout: 15000,
    });

    const sourceData = sourceRes.data?.result?.[0] || {};
    const isVerified = sourceData.SourceCode && sourceData.SourceCode.length > 0;
    const sourceCodeAvailable = isVerified;
    const hasProxyContract = sourceData.Proxy === "1" || sourceData.Implementation?.length > 0;

    // Check contract creator
    let contractCreator = "Unknown";
    let deployedAt: string | null = null;

    try {
      const creatorRes = await axios.get(ETHERSCAN_BASE_URL, {
        params: {
          module: "contract",
          action: "getcontractcreation",
          contractaddresses: tokenAddress,
          apikey: ETHERSCAN_API_KEY,
        },
        timeout: 15000,
      });

      const creatorData = creatorRes.data?.result?.[0];
      if (creatorData?.contractCreator) {
        contractCreator = creatorData.contractCreator;
      }

      // Get creation transaction timestamp
      if (creatorData?.txHash) {
        const txRes = await axios.get(ETHERSCAN_BASE_URL, {
          params: {
            module: "proxy",
            action: "eth_getTransactionByHash",
            txhash: creatorData.txHash,
            apikey: ETHERSCAN_API_KEY,
          },
          timeout: 10000,
        });

        if (txRes.data?.result?.blockNumber) {
          const blockRes = await axios.get(ETHERSCAN_BASE_URL, {
            params: {
              module: "proxy",
              action: "eth_getBlockByNumber",
              tag: txRes.data.result.blockNumber,
              boolean: false,
              apikey: ETHERSCAN_API_KEY,
            },
            timeout: 10000,
          });

          const timestamp = blockRes.data?.result?.timestamp;
          if (timestamp) {
            deployedAt = new Date(parseInt(timestamp, 16) * 1000).toISOString();
          }
        }
      }
    } catch {
      // Non-critical
    }

    // Check ownership renouncement (look for owner() function and check if it's zero address)
    let isOwnershipRenounced = false;
    try {
      // Try to read owner from contract
      const ownerRes = await axios.get(ETHERSCAN_BASE_URL, {
        params: {
          module: "proxy",
          action: "eth_call",
          to: tokenAddress,
          data: "0x8da5cb5b", // owner() function signature
          tag: "latest",
          apikey: ETHERSCAN_API_KEY,
        },
        timeout: 10000,
      });

      const owner = ownerRes.data?.result;
      // Check if owner is zero address
      if (owner && (owner === "0x0000000000000000000000000000000000000000" || 
          owner === "0x0000000000000000000000000000000000000000000000000000000000000000")) {
        isOwnershipRenounced = true;
      }
    } catch {
      // If owner() doesn't exist or fails, assume not renounced
      isOwnershipRenounced = false;
    }

    return {
      isVerified,
      isOwnershipRenounced,
      hasProxyContract,
      contractCreator,
      sourceCodeAvailable,
      deployedAt,
    };
  } catch (error) {
    console.error("Etherscan fetch error:", error);
    return {
      isVerified: false,
      isOwnershipRenounced: false,
      hasProxyContract: false,
      contractCreator: "Unknown",
      sourceCodeAvailable: false,
      deployedAt: null,
    };
  }
}
