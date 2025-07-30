import { EthereumService } from './ethereum';
import { TronService } from './tron';
import { BitcoinService } from './bitcoin';
import { MarketDataService } from './market';
import { WalletConnection, TransactionResult, MarketPrice } from './types';

export class BlockchainService {
  private ethereum: EthereumService;
  private tron: TronService;
  private bitcoin: BitcoinService;
  private market: MarketDataService;

  constructor() {
    this.ethereum = new EthereumService();
    this.tron = new TronService();
    this.bitcoin = new BitcoinService();
    this.market = new MarketDataService();
  }

  async createWallet(network: string): Promise<WalletConnection> {
    switch (network.toUpperCase()) {
      case 'ETH':
      case 'BSC':
        return await this.ethereum.createWallet();
      case 'TRX':
        return await this.tron.createWallet();
      case 'BTC':
        return await this.bitcoin.createWallet();
      default:
        throw new Error(`Unsupported network: ${network}`);
    }
  }

  async getBalance(address: string, network: string): Promise<string> {
    switch (network.toUpperCase()) {
      case 'ETH':
      case 'BSC':
        return await this.ethereum.getBalance(address);
      case 'TRX':
        return await this.tron.getBalance(address);
      case 'BTC':
        return await this.bitcoin.getBalance(address);
      default:
        return '0';
    }
  }

  async sendTransaction(
    fromPrivateKey: string,
    toAddress: string,
    amount: string,
    network: string,
    gasPrice?: string
  ): Promise<TransactionResult> {
    switch (network.toUpperCase()) {
      case 'ETH':
      case 'BSC':
        return await this.ethereum.sendTransaction(fromPrivateKey, toAddress, amount, gasPrice);
      case 'TRX':
        return await this.tron.sendTransaction(fromPrivateKey, toAddress, amount);
      case 'BTC':
        return await this.bitcoin.sendTransaction(fromPrivateKey, toAddress, amount);
      default:
        return { hash: '', status: 'failed' };
    }
  }

  async getTransactionStatus(hash: string, network: string): Promise<TransactionResult> {
    switch (network.toUpperCase()) {
      case 'ETH':
      case 'BSC':
        return await this.ethereum.getTransactionStatus(hash);
      case 'TRX':
        return await this.tron.getTransactionStatus(hash);
      case 'BTC':
        return await this.bitcoin.getTransactionStatus(hash);
      default:
        return { hash, status: 'failed' };
    }
  }

  async getCurrentPrice(symbol: string): Promise<MarketPrice | null> {
    return await this.market.getCurrentPrice(symbol);
  }

  async getMultiplePrices(symbols: string[]): Promise<MarketPrice[]> {
    return await this.market.getMultiplePrices(symbols);
  }

  async getHistoricalData(symbol: string, days: number = 7): Promise<Array<{timestamp: number, price: number}>> {
    return await this.market.getHistoricalData(symbol, days);
  }

  async startPriceUpdates(): Promise<void> {
    const symbols = ['BTC', 'ETH', 'BNB', 'TRX', 'SOL', 'USDT'];
    await this.market.startPriceUpdates(symbols, 30000); // Update every 30 seconds
  }
}

export const blockchainService = new BlockchainService();
export * from './types';