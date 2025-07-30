import { ethers } from 'ethers';
import { WalletConnection, TransactionResult } from './types';

export class EthereumService {
  private provider: ethers.JsonRpcProvider;

  constructor(rpcUrl: string = 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY') {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  async createWallet(): Promise<WalletConnection> {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      balance: '0',
      network: 'ETH'
    };
  }

  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting ETH balance:', error);
      return '0';
    }
  }

  async sendTransaction(
    fromPrivateKey: string,
    toAddress: string,
    amount: string,
    gasPrice?: string
  ): Promise<TransactionResult> {
    try {
      const wallet = new ethers.Wallet(fromPrivateKey, this.provider);
      const tx = await wallet.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount),
        gasPrice: gasPrice ? ethers.parseUnits(gasPrice, 'gwei') : undefined
      });

      return {
        hash: tx.hash,
        status: 'pending',
        blockNumber: tx.blockNumber?.toString(),
        gasFee: tx.gasPrice?.toString()
      };
    } catch (error) {
      console.error('Error sending ETH transaction:', error);
      return {
        hash: '',
        status: 'failed'
      };
    }
  }

  async getTransactionStatus(hash: string): Promise<TransactionResult> {
    try {
      const receipt = await this.provider.getTransactionReceipt(hash);
      if (!receipt) {
        return { hash, status: 'pending' };
      }

      return {
        hash,
        status: receipt.status === 1 ? 'confirmed' : 'failed',
        blockNumber: receipt.blockNumber.toString(),
        confirmations: await this.provider.getBlockNumber() - receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error('Error getting transaction status:', error);
      return { hash, status: 'failed' };
    }
  }

  async estimateGas(fromAddress: string, toAddress: string, amount: string): Promise<string> {
    try {
      const gasEstimate = await this.provider.estimateGas({
        from: fromAddress,
        to: toAddress,
        value: ethers.parseEther(amount)
      });
      return gasEstimate.toString();
    } catch (error) {
      console.error('Error estimating gas:', error);
      return '21000'; // Default gas limit for simple ETH transfer
    }
  }
}