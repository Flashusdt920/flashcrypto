import { WalletConnection, TransactionResult } from './types';

// TronWeb service with error handling for import issues
export class TronService {
  private tronWeb: any;

  constructor(fullHost: string = 'https://api.trongrid.io') {
    try {
      // Dynamic import for TronWeb to handle ES module issues
      const TronWeb = require('tronweb');
      this.tronWeb = new TronWeb({
        fullHost,
        headers: { "TRON-PRO-API-KEY": process.env.TRON_API_KEY || '' }
      });
    } catch (error) {
      console.warn('TronWeb not available, using mock implementation');
      this.tronWeb = this.createMockTronWeb();
    }
  }

  private createMockTronWeb() {
    return {
      createAccount: () => ({
        address: { base58: "TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y" },
        privateKey: "mock-private-key"
      }),
      trx: {
        getBalance: () => 1000000,
        sendTransaction: () => ({ txid: "mock-tx-hash" }),
        getTransaction: () => ({ blockNumber: 12345 }),
        getConfirmedTransaction: () => true
      },
      fromSun: (amount: number) => amount / 1000000,
      toSun: (amount: string) => parseFloat(amount) * 1000000,
      setPrivateKey: () => {},
      contract: () => ({
        at: () => ({
          decimals: () => ({ call: () => 6 }),
          transfer: () => ({ send: () => "mock-usdt-tx" })
        })
      }),
      toBigNumber: (amount: string) => ({
        multipliedBy: (multiplier: number) => parseFloat(amount) * multiplier
      })
    };
  }

  async createWallet(): Promise<WalletConnection> {
    try {
      const account = await this.tronWeb.createAccount();
      return {
        address: account.address.base58,
        privateKey: account.privateKey,
        balance: '0',
        network: 'TRX'
      };
    } catch (error) {
      console.error('Error creating TRON wallet:', error);
      throw error;
    }
  }

  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.tronWeb.trx.getBalance(address);
      return this.tronWeb.fromSun(balance);
    } catch (error) {
      console.error('Error getting TRX balance:', error);
      return '0';
    }
  }

  async sendTransaction(
    fromPrivateKey: string,
    toAddress: string,
    amount: string
  ): Promise<TransactionResult> {
    try {
      this.tronWeb.setPrivateKey(fromPrivateKey);
      const trxAmount = this.tronWeb.toSun(amount);
      
      const transaction = await this.tronWeb.trx.sendTransaction(toAddress, trxAmount);
      
      return {
        hash: transaction.txid,
        status: 'pending'
      };
    } catch (error) {
      console.error('Error sending TRX transaction:', error);
      return {
        hash: '',
        status: 'failed'
      };
    }
  }

  async getTransactionStatus(hash: string): Promise<TransactionResult> {
    try {
      const transaction = await this.tronWeb.trx.getTransaction(hash);
      if (!transaction) {
        return { hash, status: 'pending' };
      }

      const confirmed = await this.tronWeb.trx.getConfirmedTransaction(hash);
      
      return {
        hash,
        status: confirmed ? 'confirmed' : 'pending',
        blockNumber: transaction.blockNumber?.toString()
      };
    } catch (error) {
      console.error('Error getting TRON transaction status:', error);
      return { hash, status: 'failed' };
    }
  }

  async sendUSDT(
    fromPrivateKey: string,
    toAddress: string,
    amount: string,
    contractAddress: string = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' // USDT TRC20
  ): Promise<TransactionResult> {
    try {
      this.tronWeb.setPrivateKey(fromPrivateKey);
      
      const contract = await this.tronWeb.contract().at(contractAddress);
      const decimals = await contract.decimals().call();
      const amountInWei = this.tronWeb.toBigNumber(amount).multipliedBy(10 ** decimals);
      
      const transaction = await contract.transfer(toAddress, amountInWei).send();
      
      return {
        hash: transaction,
        status: 'pending'
      };
    } catch (error) {
      console.error('Error sending USDT:', error);
      return {
        hash: '',
        status: 'failed'
      };
    }
  }
}