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
      const response = await axios.get(`${this.apiBaseUrl}/address/${address}`, {
        timeout: 5000,
        validateStatus: (status) => status < 500 // Accept any status less than 500
      });
      
      // Handle proxy authentication errors
      if (response.status === 407) {
        console.warn('Proxy authentication required for external API. Using fallback data.');
        return '0';
      }
      
      const satoshis = response.data.chain_stats.funded_txo_sum - response.data.chain_stats.spent_txo_sum;
      return (satoshis / 100000000).toString(); // Convert to BTC
    } catch (error: any) {
      // Handle specific error codes
      if (error.response?.status === 407) {
        console.warn('HTTP 407: Proxy authentication required. Using fallback balance.');
      } else if (error.code === 'ECONNABORTED') {
        console.warn('Request timeout. External API might be blocked.');
      } else {
        console.error('Error getting BTC balance:', error.message || error);
      }
      return '0';
    }
  }

  async getUTXOs(address: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/address/${address}/utxo`, {
        timeout: 5000,
        validateStatus: (status) => status < 500
      });
      
      if (response.status === 407) {
        console.warn('Proxy authentication required. Returning empty UTXOs.');
        return [];
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 407) {
        console.warn('HTTP 407: Proxy authentication required for UTXO fetch.');
      } else {
        console.error('Error getting UTXOs:', error.message || error);
      }
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
      const response = await axios.get(`${this.apiBaseUrl}/tx/${txid}/hex`, {
        timeout: 5000,
        validateStatus: (status) => status < 500
      });
      
      if (response.status === 407) {
        console.warn('Proxy authentication required for transaction fetch.');
        return '';
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 407) {
        console.warn('HTTP 407: Proxy authentication required.');
      } else {
        console.error('Error getting raw transaction:', error.message || error);
      }
      return '';
    }
  }

  async getTransactionStatus(hash: string): Promise<TransactionResult> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/tx/${hash}/status`, {
        timeout: 5000,
        validateStatus: (status) => status < 500
      });
      
      if (response.status === 407) {
        console.warn('Proxy authentication required. Returning pending status.');
        return { hash, status: 'pending' };
      }
      
      return {
        hash,
        status: response.data.confirmed ? 'confirmed' : 'pending',
        blockNumber: response.data.block_height?.toString(),
        confirmations: response.data.confirmations
      };
    } catch (error: any) {
      if (error.response?.status === 407) {
        console.warn('HTTP 407: Cannot check transaction status due to proxy.');
        return { hash, status: 'pending' };
      }
      console.error('Error getting BTC transaction status:', error.message || error);
      return { hash, status: 'failed' };
    }
  }
}