export interface BlockchainNetwork {
  name: string;
  symbol: string;
  chainId: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: string;
}

export interface WalletConnection {
  address: string;
  privateKey?: string;
  balance: string;
  network: string;
}

export interface TransactionResult {
  hash: string;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: string;
  confirmations?: number;
  gasUsed?: string;
  gasFee?: string;
}

export interface MarketPrice {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  timestamp: number;
}

export interface NetworkConfig {
  ETH: BlockchainNetwork;
  BSC: BlockchainNetwork;
  TRX: BlockchainNetwork;
  SOL: BlockchainNetwork;
  BTC: BlockchainNetwork;
}

export const NETWORK_CONFIGS: NetworkConfig = {
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    chainId: '1',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: 'ETH'
  },
  BSC: {
    name: 'BNB Smart Chain',
    symbol: 'BNB',
    chainId: '56',
    rpcUrl: 'https://bsc-dataseed1.binance.org',
    blockExplorer: 'https://bscscan.com',
    nativeCurrency: 'BNB'
  },
  TRX: {
    name: 'TRON',
    symbol: 'TRX',
    chainId: 'mainnet',
    rpcUrl: 'https://api.trongrid.io',
    blockExplorer: 'https://tronscan.org',
    nativeCurrency: 'TRX'
  },
  SOL: {
    name: 'Solana',
    symbol: 'SOL',
    chainId: 'mainnet-beta',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    blockExplorer: 'https://explorer.solana.com',
    nativeCurrency: 'SOL'
  },
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    chainId: 'mainnet',
    rpcUrl: 'https://blockstream.info/api',
    blockExplorer: 'https://blockstream.info',
    nativeCurrency: 'BTC'
  }
};