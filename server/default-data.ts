import { networkConfigs, type NetworkConfig } from "@shared/schema";

// Shape used when inserting default network configs
export type InsertNetworkConfig = typeof networkConfigs.$inferInsert;

export const DEFAULT_NETWORK_CONFIGS: InsertNetworkConfig[] = [
  {
    network: "ETH",
    name: "Ethereum",
    rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
    chainId: "1",
    blockExplorer: "https://etherscan.io",
    nativeCurrency: "ETH",
    isActive: true,
  },
  {
    network: "BSC",
    name: "BNB Smart Chain",
    rpcUrl: "https://bsc-dataseed1.binance.org",
    chainId: "56",
    blockExplorer: "https://bscscan.com",
    nativeCurrency: "BNB",
    isActive: true,
  },
  {
    network: "TRX",
    name: "TRON",
    rpcUrl: "https://api.trongrid.io",
    chainId: "mainnet",
    blockExplorer: "https://tronscan.org",
    nativeCurrency: "TRX",
    isActive: true,
  },
  {
    network: "BTC",
    name: "Bitcoin",
    rpcUrl: "https://blockstream.info/api",
    chainId: "mainnet",
    blockExplorer: "https://blockstream.info",
    nativeCurrency: "BTC",
    isActive: true,
  },
];

export const buildFallbackNetworkConfigs = (): NetworkConfig[] =>
  DEFAULT_NETWORK_CONFIGS.map((config) => ({
    ...config,
    id: `fallback-${config.network.toLowerCase()}`,
    createdAt: new Date(),
    isActive: config.isActive ?? true,
    chainId: config.chainId ?? null,
    blockExplorer: config.blockExplorer ?? null,
  }));
