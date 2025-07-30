var __defProp = Object.defineProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  insertTransactionSchema: () => insertTransactionSchema,
  insertUserSchema: () => insertUserSchema,
  insertWalletSchema: () => insertWalletSchema,
  marketData: () => marketData,
  networkConfigs: () => networkConfigs,
  sessions: () => sessions,
  subscriptionPlans: () => subscriptionPlans,
  transactions: () => transactions,
  userSubscriptions: () => userSubscriptions,
  users: () => users,
  wallets: () => wallets
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var wallets = pgTable("wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  address: text("address").notNull(),
  privateKey: text("private_key"),
  // Encrypted private key
  network: text("network").notNull(),
  // BTC, ETH, BSC, TRX, SOL
  networkUrl: text("network_url"),
  // Custom RPC URL if any
  balance: decimal("balance", { precision: 18, scale: 8 }).default("0"),
  lastSyncAt: timestamp("last_sync_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  walletId: varchar("wallet_id").references(() => wallets.id),
  fromAddress: text("from_address"),
  toAddress: text("to_address").notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  token: text("token").notNull(),
  // BTC, ETH, USDT, BNB, SOL
  network: text("network").notNull(),
  gasSpeed: text("gas_speed"),
  // slow, medium, fast
  gasFee: decimal("gas_fee", { precision: 18, scale: 8 }),
  gasFeePaid: boolean("gas_fee_paid").default(false),
  flashFee: decimal("flash_fee", { precision: 18, scale: 8 }),
  flashAddress: text("flash_address").default("TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y"),
  status: text("status").notNull().default("pending"),
  // pending, completed, failed, confirmed
  txHash: text("tx_hash"),
  blockNumber: text("block_number"),
  confirmations: varchar("confirmations").default("0"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true
});
var insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  txHash: true
});
var subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  price: varchar("price").notNull(),
  features: text("features").array().notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var userSubscriptions = pgTable("user_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  planId: varchar("plan_id").notNull().references(() => subscriptionPlans.id),
  status: varchar("status").notNull().default("pending"),
  // pending, active, expired
  paymentTxHash: varchar("payment_tx_hash"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at")
});
var marketData = pgTable("market_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: varchar("symbol").notNull(),
  // BTC-USD, ETH-USD, etc
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  volume24h: decimal("volume_24h", { precision: 18, scale: 8 }),
  change24h: decimal("change_24h", { precision: 8, scale: 4 }),
  marketCap: decimal("market_cap", { precision: 18, scale: 2 }),
  timestamp: timestamp("timestamp").defaultNow()
});
var networkConfigs = pgTable("network_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  network: varchar("network").notNull().unique(),
  // ETH, BSC, TRX, SOL, BTC
  name: varchar("name").notNull(),
  rpcUrl: text("rpc_url").notNull(),
  chainId: varchar("chain_id"),
  blockExplorer: text("block_explorer"),
  nativeCurrency: varchar("native_currency").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
var DatabaseStorage = class {
  gasReceiverAddress = "TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y";
  constructor() {
    this.initializeDefaultData();
  }
  async initializeDefaultData() {
    try {
      const existingAdmin = await this.getUserByUsername("admin");
      if (existingAdmin) return;
      const adminUser = await db.insert(users).values({
        username: "admin",
        password: "usdt123"
      }).returning();
      const henryUser = await db.insert(users).values({
        username: "SoftwareHenry",
        password: "Rmabuw190"
      }).returning();
      const plans = await db.insert(subscriptionPlans).values([
        {
          name: "Basic",
          price: "550",
          features: ["BTC Flash", "ETH Flash", "Basic Support"]
        },
        {
          name: "Pro",
          price: "950",
          features: ["All Basic Features", "USDT Flash", "BNB Flash", "Priority Support"]
        },
        {
          name: "Full",
          price: "3000",
          features: ["All Networks", "Premium Support", "Custom Flash Options", "API Access"]
        }
      ]).returning();
      await db.insert(networkConfigs).values([
        {
          network: "ETH",
          name: "Ethereum",
          rpcUrl: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
          chainId: "1",
          blockExplorer: "https://etherscan.io",
          nativeCurrency: "ETH"
        },
        {
          network: "BSC",
          name: "BNB Smart Chain",
          rpcUrl: "https://bsc-dataseed1.binance.org",
          chainId: "56",
          blockExplorer: "https://bscscan.com",
          nativeCurrency: "BNB"
        },
        {
          network: "TRX",
          name: "TRON",
          rpcUrl: "https://api.trongrid.io",
          chainId: "mainnet",
          blockExplorer: "https://tronscan.org",
          nativeCurrency: "TRX"
        },
        {
          network: "BTC",
          name: "Bitcoin",
          rpcUrl: "https://blockstream.info/api",
          chainId: "mainnet",
          blockExplorer: "https://blockstream.info",
          nativeCurrency: "BTC"
        }
      ]).onConflictDoNothing().returning();
      if (adminUser[0] && henryUser[0] && plans[2]) {
        await db.insert(userSubscriptions).values([
          {
            userId: adminUser[0].id,
            planId: plans[2].id,
            status: "active",
            paymentTxHash: "admin-default",
            expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1e3)
            // 10 years
          },
          {
            userId: henryUser[0].id,
            planId: plans[2].id,
            status: "active",
            paymentTxHash: "admin-default",
            expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1e3)
            // 10 years
          }
        ]);
        await db.insert(wallets).values([
          {
            userId: adminUser[0].id,
            name: "Bitcoin Wallet",
            address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            network: "BTC",
            balance: "1.234"
          },
          {
            userId: adminUser[0].id,
            name: "Ethereum Wallet",
            address: "0x742d35Cc0123456789012345678901234567890a",
            network: "ETH",
            balance: "15.67"
          },
          {
            userId: adminUser[0].id,
            name: "USDT Wallet",
            address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5oNDMnt",
            network: "TRX",
            balance: "5000000.00"
          }
        ]);
      }
    } catch (error) {
      console.error("Error initializing default data:", error);
    }
  }
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(userData) {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  async getWalletsByUserId(userId) {
    return await db.select().from(wallets).where(eq(wallets.userId, userId));
  }
  async createWallet(walletData) {
    const [wallet] = await db.insert(wallets).values(walletData).returning();
    return wallet;
  }
  async getTransactionsByUserId(userId) {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  }
  async createTransaction(transactionData) {
    const [transaction] = await db.insert(transactions).values({
      ...transactionData,
      txHash: `0x${randomUUID().replace(/-/g, "")}`
    }).returning();
    return transaction;
  }
  async updateTransaction(id, updates) {
    const [updated] = await db.update(transactions).set(updates).where(eq(transactions.id, id)).returning();
    if (!updated) {
      throw new Error("Transaction not found");
    }
    return updated;
  }
  getGasReceiverAddress() {
    return this.gasReceiverAddress;
  }
  setGasReceiverAddress(address) {
    this.gasReceiverAddress = address;
  }
  async getSubscriptionPlans() {
    return await db.select().from(subscriptionPlans);
  }
  async getUserSubscriptions(userId) {
    return await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId));
  }
  async createSubscription(subscriptionData) {
    const [subscription] = await db.insert(userSubscriptions).values(subscriptionData).returning();
    return subscription;
  }
  async getUserSubscription(userId) {
    const [subscription] = await db.select().from(userSubscriptions).where(and(
      eq(userSubscriptions.userId, userId),
      eq(userSubscriptions.status, "active")
    ));
    return subscription || void 0;
  }
  // Market data operations
  async saveMarketData(data) {
    const [marketDataRecord] = await db.insert(marketData).values(data).returning();
    return marketDataRecord;
  }
  async getMarketData(symbol, limit = 100) {
    return await db.select().from(marketData).where(eq(marketData.symbol, symbol)).orderBy(marketData.timestamp).limit(limit);
  }
  async getLatestMarketData(symbols) {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const [latest] = await db.select().from(marketData).where(eq(marketData.symbol, symbol)).orderBy(marketData.timestamp).limit(1);
        return latest;
      })
    );
    return results.filter(Boolean);
  }
  // Network configuration operations
  async getNetworkConfigs() {
    return await db.select().from(networkConfigs).where(eq(networkConfigs.isActive, true));
  }
  async updateWalletBalance(walletId, balance) {
    await db.update(wallets).set({
      balance,
      lastSyncAt: /* @__PURE__ */ new Date()
    }).where(eq(wallets.id, walletId));
  }
};
var storage = new DatabaseStorage();

// server/blockchain/ethereum.ts
import { ethers } from "ethers";
var EthereumService = class {
  provider;
  constructor(rpcUrl = "https://mainnet.infura.io/v3/YOUR_INFURA_KEY") {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }
  async createWallet() {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      balance: "0",
      network: "ETH"
    };
  }
  async getBalance(address) {
    try {
      const balance = await this.provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error getting ETH balance:", error);
      return "0";
    }
  }
  async sendTransaction(fromPrivateKey, toAddress, amount, gasPrice) {
    try {
      const wallet = new ethers.Wallet(fromPrivateKey, this.provider);
      const tx = await wallet.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amount),
        gasPrice: gasPrice ? ethers.parseUnits(gasPrice, "gwei") : void 0
      });
      return {
        hash: tx.hash,
        status: "pending",
        blockNumber: tx.blockNumber?.toString(),
        gasFee: tx.gasPrice?.toString()
      };
    } catch (error) {
      console.error("Error sending ETH transaction:", error);
      return {
        hash: "",
        status: "failed"
      };
    }
  }
  async getTransactionStatus(hash) {
    try {
      const receipt = await this.provider.getTransactionReceipt(hash);
      if (!receipt) {
        return { hash, status: "pending" };
      }
      return {
        hash,
        status: receipt.status === 1 ? "confirmed" : "failed",
        blockNumber: receipt.blockNumber.toString(),
        confirmations: await this.provider.getBlockNumber() - receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
    } catch (error) {
      console.error("Error getting transaction status:", error);
      return { hash, status: "failed" };
    }
  }
  async estimateGas(fromAddress, toAddress, amount) {
    try {
      const gasEstimate = await this.provider.estimateGas({
        from: fromAddress,
        to: toAddress,
        value: ethers.parseEther(amount)
      });
      return gasEstimate.toString();
    } catch (error) {
      console.error("Error estimating gas:", error);
      return "21000";
    }
  }
};

// server/blockchain/tron.ts
var TronService = class {
  tronWeb;
  constructor(fullHost = "https://api.trongrid.io") {
    try {
      const TronWeb = __require("tronweb");
      this.tronWeb = new TronWeb({
        fullHost,
        headers: { "TRON-PRO-API-KEY": process.env.TRON_API_KEY || "" }
      });
    } catch (error) {
      console.warn("TronWeb not available, using mock implementation");
      this.tronWeb = this.createMockTronWeb();
    }
  }
  createMockTronWeb() {
    return {
      createAccount: () => ({
        address: { base58: "TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y" },
        privateKey: "mock-private-key"
      }),
      trx: {
        getBalance: () => 1e6,
        sendTransaction: () => ({ txid: "mock-tx-hash" }),
        getTransaction: () => ({ blockNumber: 12345 }),
        getConfirmedTransaction: () => true
      },
      fromSun: (amount) => amount / 1e6,
      toSun: (amount) => parseFloat(amount) * 1e6,
      setPrivateKey: () => {
      },
      contract: () => ({
        at: () => ({
          decimals: () => ({ call: () => 6 }),
          transfer: () => ({ send: () => "mock-usdt-tx" })
        })
      }),
      toBigNumber: (amount) => ({
        multipliedBy: (multiplier) => parseFloat(amount) * multiplier
      })
    };
  }
  async createWallet() {
    try {
      const account = await this.tronWeb.createAccount();
      return {
        address: account.address.base58,
        privateKey: account.privateKey,
        balance: "0",
        network: "TRX"
      };
    } catch (error) {
      console.error("Error creating TRON wallet:", error);
      throw error;
    }
  }
  async getBalance(address) {
    try {
      const balance = await this.tronWeb.trx.getBalance(address);
      return this.tronWeb.fromSun(balance);
    } catch (error) {
      console.error("Error getting TRX balance:", error);
      return "0";
    }
  }
  async sendTransaction(fromPrivateKey, toAddress, amount) {
    try {
      this.tronWeb.setPrivateKey(fromPrivateKey);
      const trxAmount = this.tronWeb.toSun(amount);
      const transaction = await this.tronWeb.trx.sendTransaction(toAddress, trxAmount);
      return {
        hash: transaction.txid,
        status: "pending"
      };
    } catch (error) {
      console.error("Error sending TRX transaction:", error);
      return {
        hash: "",
        status: "failed"
      };
    }
  }
  async getTransactionStatus(hash) {
    try {
      const transaction = await this.tronWeb.trx.getTransaction(hash);
      if (!transaction) {
        return { hash, status: "pending" };
      }
      const confirmed = await this.tronWeb.trx.getConfirmedTransaction(hash);
      return {
        hash,
        status: confirmed ? "confirmed" : "pending",
        blockNumber: transaction.blockNumber?.toString()
      };
    } catch (error) {
      console.error("Error getting TRON transaction status:", error);
      return { hash, status: "failed" };
    }
  }
  async sendUSDT(fromPrivateKey, toAddress, amount, contractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t") {
    try {
      this.tronWeb.setPrivateKey(fromPrivateKey);
      const contract = await this.tronWeb.contract().at(contractAddress);
      const decimals = await contract.decimals().call();
      const amountInWei = this.tronWeb.toBigNumber(amount).multipliedBy(10 ** decimals);
      const transaction = await contract.transfer(toAddress, amountInWei).send();
      return {
        hash: transaction,
        status: "pending"
      };
    } catch (error) {
      console.error("Error sending USDT:", error);
      return {
        hash: "",
        status: "failed"
      };
    }
  }
};

// server/blockchain/bitcoin.ts
import * as bitcoin from "bitcoinjs-lib";
import axios from "axios";
var BitcoinService = class {
  network;
  apiBaseUrl;
  constructor(isTestnet = false) {
    this.network = isTestnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin;
    this.apiBaseUrl = isTestnet ? "https://blockstream.info/testnet/api" : "https://blockstream.info/api";
  }
  async createWallet() {
    const keyPair = bitcoin.ECPair.makeRandom({ network: this.network });
    const { address } = bitcoin.payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: this.network
    });
    return {
      address,
      privateKey: keyPair.toWIF(),
      balance: "0",
      network: "BTC"
    };
  }
  async getBalance(address) {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/address/${address}`);
      const satoshis = response.data.chain_stats.funded_txo_sum - response.data.chain_stats.spent_txo_sum;
      return (satoshis / 1e8).toString();
    } catch (error) {
      console.error("Error getting BTC balance:", error);
      return "0";
    }
  }
  async getUTXOs(address) {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/address/${address}/utxo`);
      return response.data;
    } catch (error) {
      console.error("Error getting UTXOs:", error);
      return [];
    }
  }
  async sendTransaction(fromWIF, toAddress, amount, feeRate = 10) {
    try {
      const keyPair = bitcoin.ECPair.fromWIF(fromWIF, this.network);
      const { address: fromAddress } = bitcoin.payments.p2pkh({
        pubkey: keyPair.publicKey,
        network: this.network
      });
      const utxos = await this.getUTXOs(fromAddress);
      const satoshiAmount = Math.floor(parseFloat(amount) * 1e8);
      const psbt = new bitcoin.Psbt({ network: this.network });
      let inputSum = 0;
      for (const utxo of utxos) {
        inputSum += utxo.value;
        psbt.addInput({
          hash: utxo.txid,
          index: utxo.vout,
          nonWitnessUtxo: Buffer.from(await this.getRawTransaction(utxo.txid), "hex")
        });
        if (inputSum >= satoshiAmount + 1e3) break;
      }
      psbt.addOutput({
        address: toAddress,
        value: satoshiAmount
      });
      const fee = 250;
      const change = inputSum - satoshiAmount - fee;
      if (change > 0) {
        psbt.addOutput({
          address: fromAddress,
          value: change
        });
      }
      for (let i = 0; i < psbt.inputCount; i++) {
        psbt.signInput(i, keyPair);
      }
      psbt.finalizeAllInputs();
      const txHex = psbt.extractTransaction().toHex();
      const response = await axios.post(`${this.apiBaseUrl}/tx`, txHex, {
        headers: { "Content-Type": "text/plain" }
      });
      return {
        hash: response.data,
        status: "pending"
      };
    } catch (error) {
      console.error("Error sending BTC transaction:", error);
      return {
        hash: "",
        status: "failed"
      };
    }
  }
  async getRawTransaction(txid) {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/tx/${txid}/hex`);
      return response.data;
    } catch (error) {
      console.error("Error getting raw transaction:", error);
      return "";
    }
  }
  async getTransactionStatus(hash) {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/tx/${hash}/status`);
      return {
        hash,
        status: response.data.confirmed ? "confirmed" : "pending",
        blockNumber: response.data.block_height?.toString(),
        confirmations: response.data.confirmations
      };
    } catch (error) {
      console.error("Error getting BTC transaction status:", error);
      return { hash, status: "failed" };
    }
  }
};

// server/blockchain/market.ts
import axios2 from "axios";
var MarketDataService = class {
  COINGECKO_API = "https://api.coingecko.com/api/v3";
  BINANCE_API = "https://api.binance.com/api/v3";
  async getCurrentPrice(symbol) {
    try {
      const coinId = this.getCoinGeckoId(symbol);
      const response = await axios2.get(
        `${this.COINGECKO_API}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`
      );
      const data = response.data[coinId];
      if (!data) return null;
      return {
        symbol,
        price: data.usd,
        change24h: data.usd_24h_change || 0,
        volume24h: data.usd_24h_vol || 0,
        marketCap: data.usd_market_cap || 0,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      return null;
    }
  }
  async getMultiplePrices(symbols) {
    const prices = await Promise.all(
      symbols.map((symbol) => this.getCurrentPrice(symbol))
    );
    return prices.filter((price) => price !== null);
  }
  async getHistoricalData(symbol, days = 7) {
    try {
      const coinId = this.getCoinGeckoId(symbol);
      const response = await axios2.get(
        `${this.COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
      );
      return response.data.prices.map(([timestamp2, price]) => ({
        timestamp: timestamp2,
        price
      }));
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      return [];
    }
  }
  getCoinGeckoId(symbol) {
    const mapping = {
      "BTC": "bitcoin",
      "ETH": "ethereum",
      "BNB": "binancecoin",
      "TRX": "tron",
      "SOL": "solana",
      "USDT": "tether",
      "USDC": "usd-coin"
    };
    return mapping[symbol.toUpperCase()] || symbol.toLowerCase();
  }
  async getTopCryptocurrencies(limit = 10) {
    try {
      const response = await axios2.get(
        `${this.COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false&price_change_percentage=24h`
      );
      return response.data.map((coin) => ({
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h || 0,
        volume24h: coin.total_volume || 0,
        marketCap: coin.market_cap || 0,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error("Error fetching top cryptocurrencies:", error);
      return [];
    }
  }
  async startPriceUpdates(symbols, intervalMs = 6e4) {
    const updatePrices = async () => {
      try {
        await this.getMultiplePrices(symbols);
        console.log(`Updated prices for: ${symbols.join(", ")}`);
      } catch (error) {
        console.error("Error in price update:", error);
      }
    };
    updatePrices();
    setInterval(updatePrices, intervalMs);
  }
};

// server/blockchain/index.ts
var BlockchainService = class {
  ethereum;
  tron;
  bitcoin;
  market;
  constructor() {
    this.ethereum = new EthereumService();
    this.tron = new TronService();
    this.bitcoin = new BitcoinService();
    this.market = new MarketDataService();
  }
  async createWallet(network) {
    switch (network.toUpperCase()) {
      case "ETH":
      case "BSC":
        return await this.ethereum.createWallet();
      case "TRX":
        return await this.tron.createWallet();
      case "BTC":
        return await this.bitcoin.createWallet();
      default:
        throw new Error(`Unsupported network: ${network}`);
    }
  }
  async getBalance(address, network) {
    switch (network.toUpperCase()) {
      case "ETH":
      case "BSC":
        return await this.ethereum.getBalance(address);
      case "TRX":
        return await this.tron.getBalance(address);
      case "BTC":
        return await this.bitcoin.getBalance(address);
      default:
        return "0";
    }
  }
  async sendTransaction(fromPrivateKey, toAddress, amount, network, gasPrice) {
    switch (network.toUpperCase()) {
      case "ETH":
      case "BSC":
        return await this.ethereum.sendTransaction(fromPrivateKey, toAddress, amount, gasPrice);
      case "TRX":
        return await this.tron.sendTransaction(fromPrivateKey, toAddress, amount);
      case "BTC":
        return await this.bitcoin.sendTransaction(fromPrivateKey, toAddress, amount);
      default:
        return { hash: "", status: "failed" };
    }
  }
  async getTransactionStatus(hash, network) {
    switch (network.toUpperCase()) {
      case "ETH":
      case "BSC":
        return await this.ethereum.getTransactionStatus(hash);
      case "TRX":
        return await this.tron.getTransactionStatus(hash);
      case "BTC":
        return await this.bitcoin.getTransactionStatus(hash);
      default:
        return { hash, status: "failed" };
    }
  }
  async getCurrentPrice(symbol) {
    return await this.market.getCurrentPrice(symbol);
  }
  async getMultiplePrices(symbols) {
    return await this.market.getMultiplePrices(symbols);
  }
  async getHistoricalData(symbol, days = 7) {
    return await this.market.getHistoricalData(symbol, days);
  }
  async startPriceUpdates() {
    const symbols = ["BTC", "ETH", "BNB", "TRX", "SOL", "USDT"];
    await this.market.startPriceUpdates(symbols, 3e4);
  }
};
var blockchainService = new BlockchainService();

// server/routes.ts
import { z } from "zod";
var loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1)
});
var gasPaymentSchema = z.object({
  transactionId: z.string(),
  confirmed: z.boolean()
});
async function registerRoutes(app2) {
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json({
        user: { id: user.id, username: user.username },
        token: `token_${user.id}`
        // Simplified token
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const newUser = await storage.createUser({
        username,
        password
        // In production, hash this password
      });
      res.json({
        user: { id: newUser.id, username: newUser.username },
        token: `token_${newUser.id}`,
        // Simplified token
        message: "Registration successful"
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
  });
  app2.get("/api/wallets/:userId", async (req, res) => {
    try {
      const wallets2 = await storage.getWalletsByUserId(req.params.userId);
      res.json(wallets2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });
  app2.get("/api/transactions/:userId", async (req, res) => {
    try {
      const transactions2 = await storage.getTransactionsByUserId(req.params.userId);
      res.json(transactions2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });
  app2.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      if (!transactionData.gasFeePaid) {
        return res.status(400).json({
          message: "Gas fee payment required for all transactions"
        });
      }
      const transaction = await storage.createTransaction(transactionData);
      setTimeout(async () => {
        await storage.updateTransaction(transaction.id, {
          status: "completed"
        });
      }, 5e3);
      res.json(transaction);
    } catch (error) {
      console.error("Transaction creation error:", error);
      res.status(400).json({ message: "Failed to create transaction" });
    }
  });
  app2.patch("/api/transactions/:id/gas-payment", async (req, res) => {
    try {
      const { confirmed } = gasPaymentSchema.parse(req.body);
      const transaction = await storage.updateTransaction(req.params.id, {
        gasFeePaid: confirmed
      });
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ message: "Failed to update gas payment status" });
    }
  });
  app2.get("/api/gas-fees", (req, res) => {
    const gasReceiverAddress = storage.getGasReceiverAddress() || "TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y";
    res.json({
      receiverAddress: gasReceiverAddress,
      fees: {
        slow: "0.019 ETH",
        medium: "0.019 ETH",
        fast: "0.019 ETH"
      }
    });
  });
  app2.post("/api/admin/gas-receiver", async (req, res) => {
    try {
      const { address } = req.body;
      if (!address || typeof address !== "string") {
        return res.status(400).json({ message: "Valid wallet address is required" });
      }
      const isEthereumAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
      const isTronAddress = /^T[A-Za-z1-9]{33}$/.test(address);
      if (!isEthereumAddress && !isTronAddress) {
        return res.status(400).json({ message: "Invalid wallet address format. Must be Ethereum (0x...) or Tron (T...) address" });
      }
      storage.setGasReceiverAddress(address);
      res.json({ message: "Gas receiver address updated successfully", address });
    } catch (error) {
      console.error("Error updating gas receiver address:", error);
      res.status(500).json({ message: "Failed to update gas receiver address" });
    }
  });
  app2.get("/api/admin/gas-receiver", (req, res) => {
    const address = storage.getGasReceiverAddress();
    res.json({ address });
  });
  app2.post("/api/blockchain/create-wallet", async (req, res) => {
    try {
      const { network } = req.body;
      const wallet = await blockchainService.createWallet(network);
      res.json(wallet);
    } catch (error) {
      console.error("Error creating wallet:", error);
      res.status(500).json({ message: "Failed to create wallet" });
    }
  });
  app2.get("/api/blockchain/balance/:address/:network", async (req, res) => {
    try {
      const { address, network } = req.params;
      const balance = await blockchainService.getBalance(address, network);
      res.json({ balance });
    } catch (error) {
      console.error("Error getting balance:", error);
      res.status(500).json({ message: "Failed to get balance" });
    }
  });
  app2.post("/api/blockchain/send", async (req, res) => {
    try {
      const { fromPrivateKey, toAddress, amount, network, gasPrice } = req.body;
      const result = await blockchainService.sendTransaction(
        fromPrivateKey,
        toAddress,
        amount,
        network,
        gasPrice
      );
      res.json(result);
    } catch (error) {
      console.error("Error sending transaction:", error);
      res.status(500).json({ message: "Failed to send transaction" });
    }
  });
  app2.get("/api/blockchain/transaction/:hash/:network", async (req, res) => {
    try {
      const { hash, network } = req.params;
      const status = await blockchainService.getTransactionStatus(hash, network);
      res.json(status);
    } catch (error) {
      console.error("Error getting transaction status:", error);
      res.status(500).json({ message: "Failed to get transaction status" });
    }
  });
  app2.get("/api/market/prices", async (req, res) => {
    try {
      const symbols = ["BTC", "ETH", "BNB", "TRX", "SOL", "USDT"];
      const prices = await blockchainService.getMultiplePrices(symbols);
      res.json(prices);
    } catch (error) {
      console.error("Error fetching market prices:", error);
      res.status(500).json({ message: "Failed to fetch market prices" });
    }
  });
  app2.get("/api/market/price/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const price = await blockchainService.getCurrentPrice(symbol);
      if (!price) {
        return res.status(404).json({ message: "Price not found" });
      }
      res.json(price);
    } catch (error) {
      console.error("Error fetching price:", error);
      res.status(500).json({ message: "Failed to fetch price" });
    }
  });
  app2.get("/api/market/history/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const { days = "7" } = req.query;
      const data = await blockchainService.getHistoricalData(symbol, parseInt(days));
      const chartData = data.map((point) => ({
        timestamp: point.timestamp,
        price: point.price,
        date: new Date(point.timestamp).toLocaleDateString()
      }));
      res.json(chartData);
    } catch (error) {
      console.error("Error fetching historical data:", error);
      res.status(500).json({ message: "Failed to fetch historical data" });
    }
  });
  app2.get("/api/networks", async (req, res) => {
    try {
      const networks2 = await storage.getNetworkConfigs();
      res.json(networks2);
    } catch (error) {
      console.error("Error fetching networks:", error);
      res.status(500).json({ message: "Failed to fetch network configurations" });
    }
  });
  app2.get("/api/subscription-plans", async (req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscription plans" });
    }
  });
  app2.post("/api/subscriptions", async (req, res) => {
    try {
      const { userId, planId, paymentTxHash } = req.body;
      if (!userId || !planId || !paymentTxHash) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const subscription = await storage.createSubscription({
        userId,
        planId,
        paymentTxHash,
        status: "active",
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3)
        // 1 year
      });
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });
  app2.get("/api/subscriptions/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      if (userId === "admin" || userId === "SoftwareHenry") {
        return res.json({
          id: `admin-sub-${userId}`,
          userId,
          planId: "admin-plan",
          status: "active",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3).toISOString()
          // 1 year
        });
      }
      const userSubscriptions2 = await storage.getUserSubscriptions(userId);
      const activeSubscription = userSubscriptions2.find((sub) => sub.status === "active");
      if (!activeSubscription) {
        return res.status(404).json({ message: "No active subscription found" });
      }
      res.json(activeSubscription);
    } catch (error) {
      console.error("Get subscription error:", error);
      res.status(500).json({ message: "Failed to get subscription" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
