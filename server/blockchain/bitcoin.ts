import * as bitcoin from 'bitcoinjs-lib';
import axios from 'axios';
import { WalletConnection, TransactionResult } from './types';

export class BitcoinService {
  private network: bitcoin.Network;
  private apiBaseUrl: string;

  constructor(isTestnet: boolean = false) {
    this.network = isTestnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
    this.apiBaseUrl = isTestnet 
      ? 'https://blockstream.info/testnet/api'
      : 'https://blockstream.info/api';
  }

  async createWallet(): Promise<WalletConnection> {
    const keyPair = bitcoin.ECPair.makeRandom({ network: this.network });
    const { address } = bitcoin.payments.p2pkh({ 
      pubkey: keyPair.publicKey, 
      network: this.network 
    });

    return {
      address: address!,
      privateKey: keyPair.toWIF(),
      balance: '0',
      network: 'BTC'
    };
  }

  async getBalance(address: string): Promise<string> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/address/${address}`);
      const satoshis = response.data.chain_stats.funded_txo_sum - response.data.chain_stats.spent_txo_sum;
      return (satoshis / 100000000).toString(); // Convert to BTC
    } catch (error) {
      console.error('Error getting BTC balance:', error);
      return '0';
    }
  }

  async getUTXOs(address: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/address/${address}/utxo`);
      return response.data;
    } catch (error) {
      console.error('Error getting UTXOs:', error);
      return [];
    }
  }

  async sendTransaction(
    fromWIF: string,
    toAddress: string,
    amount: string,
    feeRate: number = 10
  ): Promise<TransactionResult> {
    try {
      const keyPair = bitcoin.ECPair.fromWIF(fromWIF, this.network);
      const { address: fromAddress } = bitcoin.payments.p2pkh({ 
        pubkey: keyPair.publicKey, 
        network: this.network 
      });

      const utxos = await this.getUTXOs(fromAddress!);
      const satoshiAmount = Math.floor(parseFloat(amount) * 100000000);

      const psbt = new bitcoin.Psbt({ network: this.network });
      let inputSum = 0;

      // Add inputs
      for (const utxo of utxos) {
        inputSum += utxo.value;
        psbt.addInput({
          hash: utxo.txid,
          index: utxo.vout,
          nonWitnessUtxo: Buffer.from(await this.getRawTransaction(utxo.txid), 'hex')
        });

        if (inputSum >= satoshiAmount + 1000) break; // Basic fee estimation
      }

      // Add output
      psbt.addOutput({
        address: toAddress,
        value: satoshiAmount
      });

      // Add change output if needed
      const fee = 250; // Basic fee estimation
      const change = inputSum - satoshiAmount - fee;
      if (change > 0) {
        psbt.addOutput({
          address: fromAddress!,
          value: change
        });
      }

      // Sign all inputs
      for (let i = 0; i < psbt.inputCount; i++) {
        psbt.signInput(i, keyPair);
      }

      psbt.finalizeAllInputs();
      const txHex = psbt.extractTransaction().toHex();

      // Broadcast transaction
      const response = await axios.post(`${this.apiBaseUrl}/tx`, txHex, {
        headers: { 'Content-Type': 'text/plain' }
      });

      return {
        hash: response.data,
        status: 'pending'
      };
    } catch (error) {
      console.error('Error sending BTC transaction:', error);
      return {
        hash: '',
        status: 'failed'
      };
    }
  }

  async getRawTransaction(txid: string): Promise<string> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/tx/${txid}/hex`);
      return response.data;
    } catch (error) {
      console.error('Error getting raw transaction:', error);
      return '';
    }
  }

  async getTransactionStatus(hash: string): Promise<TransactionResult> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/tx/${hash}/status`);
      
      return {
        hash,
        status: response.data.confirmed ? 'confirmed' : 'pending',
        blockNumber: response.data.block_height?.toString(),
        confirmations: response.data.confirmations
      };
    } catch (error) {
      console.error('Error getting BTC transaction status:', error);
      return { hash, status: 'failed' };
    }
  }
}