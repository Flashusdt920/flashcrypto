import { 
  users, wallets, transactions, subscriptionPlans, userSubscriptions, marketData, networkConfigs,
  type User, type InsertUser, type UpdateUser,
  type Wallet, type InsertWallet,
  type Transaction, type InsertTransaction,
  type SubscriptionPlan, type InsertSubscriptionPlan,
  type UserSubscription, type InsertUserSubscription,
  type MarketData, type NetworkConfig
} from "@shared/schema";
import { db } from './db';
import { eq, and, sql } from 'drizzle-orm';
import { randomUUID } from "crypto";
import { offlineStorage } from './offline-storage';

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: UpdateUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: string): Promise<void>;

  // Wallet operations
  getWalletsByUserId(userId: string): Promise<Wallet[]>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  resetWalletBalances(userId: string): Promise<void>;

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
  getPendingSubscriptions(): Promise<UserSubscription[]>;
  updateSubscriptionStatus(id: string, status: string): Promise<UserSubscription>;

  // Market data operations
  saveMarketData(data: Omit<MarketData, 'id' | 'timestamp'>): Promise<MarketData>;
  getMarketData(symbol: string, limit?: number): Promise<MarketData[]>;
  getLatestMarketData(symbols: string[]): Promise<MarketData[]>;

  // Network configuration operations
  getNetworkConfigs(): Promise<NetworkConfig[]>;
  updateWalletBalance(walletId: string, balance: string): Promise<void>;
}



export class DatabaseStorage implements IStorage {
  private isOfflineMode = !db;
  
  // Return offline storage methods if db is null
  private checkDb() {
    if (this.isOfflineMode) {
      throw new Error("Database operations not available in offline mode");
    }
  }
  private gasReceiverAddress: string = "TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y";

  constructor() {
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    try {
      if (!db) return; // Skip initialization if database is not available
      
      // Check if default users already exist
      let existingAdmin = await this.getUserByUsername("admin");
      let existingHenry = await this.getUserByUsername("SoftwareHenry");
      
      // Always update wallet balances on initialization

      // Create default users if they don't exist
      let adminUser = existingAdmin ? [existingAdmin] : await db.insert(users).values({
        username: "admin",
        email: "admin@boltflasher.com",
        password: "usdt123",
        role: "admin",
        firstName: "Admin",
        lastName: "User",
      }).returning();

      let henryUser = existingHenry ? [existingHenry] : await db.insert(users).values({
        username: "SoftwareHenry", 
        email: "henry@boltflasher.com",
        password: "Rmabuw190",
        role: "admin", 
        firstName: "Henry",
        lastName: "Software",
      }).returning();

      // Create premium subscription plan (if it doesn't exist)
      const plans = await db.insert(subscriptionPlans).values([
        {
          id: 'premium',
          name: 'Premium Access',
          price: '16700',
          features: [
            'Unlimited Flash Transactions',
            'All Networks Supported (BTC, ETH, USDT, BNB, TRX)',
            'Priority 24/7 Support',
            'Advanced Security Features',
            'Bulk Transaction Processing',
            'Transaction Templates',
            'Portfolio Tracker',
            'Price Alerts & Notifications',
            'API Access',
            'Affiliate Program Access',
            'Custom Integration Support',
            'Lifetime Updates'
          ]
        }
      ]).onConflictDoNothing().returning();

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

      // Get or verify the premium plan exists
      let premiumPlan = plans[0];
      if (!premiumPlan) {
        // Plan already exists, fetch it
        const existingPlans = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, 'premium'));
        premiumPlan = existingPlans[0];
      }
      
      // Create admin subscriptions if they don't exist
      if (adminUser[0] && henryUser[0] && premiumPlan) {
        // Check if subscriptions exist
        const adminSub = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, adminUser[0].id));
        const henrySub = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, henryUser[0].id));
        
        if (adminSub.length === 0) {
          await db.insert(userSubscriptions).values({
            userId: adminUser[0].id,
            planId: premiumPlan.id,
            status: "active",
            paymentTxHash: "admin-default",
            expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
          });
        }
        
        if (henrySub.length === 0) {
          await db.insert(userSubscriptions).values({
            userId: henryUser[0].id,
            planId: premiumPlan.id,
            status: "active", 
            paymentTxHash: "admin-default",
            expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years
          });
        }

        // Delete existing wallets and create new ones with updated balances
        await db.delete(wallets).where(eq(wallets.userId, adminUser[0].id));
        await db.delete(wallets).where(eq(wallets.userId, henryUser[0].id));
        
        // Create default wallets for admin with new balances
        await db.insert(wallets).values([
          {
            userId: adminUser[0].id,
            name: "Bitcoin Wallet",
            address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            network: "BTC",
            balance: "3000000.00",
          },
          {
            userId: adminUser[0].id,
            name: "Ethereum Wallet", 
            address: "0x742d35Cc0123456789012345678901234567890a",
            network: "ETH",
            balance: "7000000.00",
          },
          {
            userId: adminUser[0].id,
            name: "USDT Wallet",
            address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5oNDMnt",
            network: "TRX",
            balance: "8000000.00",
          },
          {
            userId: adminUser[0].id,
            name: "BNB Wallet",
            address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
            network: "BSC",
            balance: "4500000.00",
          }
        ]);

        // Create default wallets for SoftwareHenry
        await db.insert(wallets).values([
          {
            userId: henryUser[0].id,
            name: "Bitcoin Wallet",
            address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
            network: "BTC",
            balance: "3500000.00",
          },
          {
            userId: henryUser[0].id,
            name: "Ethereum Wallet",
            address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
            network: "ETH",
            balance: "7500000.00",
          },
          {
            userId: henryUser[0].id,
            name: "USDT Wallet",
            address: "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs",
            network: "TRX",
            balance: "8500000.00",
          },
          {
            userId: henryUser[0].id,
            name: "BNB Wallet",
            address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
            network: "BSC",
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
    const [user] = await db.select().from(users).where(
      sql`LOWER(${users.username}) = LOWER(${username})`
    );
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values({
      ...userData,
      updatedAt: new Date(),
    }).returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async updateUser(id: string, updates: UpdateUser): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
  
  async resetWalletBalances(userId: string): Promise<void> {
    // Check if user is admin
    const user = await this.getUser(userId);
    if (!user || (user.username !== 'admin' && user.username !== 'SoftwareHenry')) {
      throw new Error('Unauthorized: Only admin can reset wallet balances');
    }

    // Reset wallet balances for ALL users
    const allUsers = await this.getAllUsers();
    
    for (const targetUser of allUsers) {
      // Set different initial balances for admin users vs regular users
      let initialBalances = {
        BTC: '100000.00',  // Regular users get 100k
        ETH: '200000.00',  
        TRX: '150000.00',  // USDT on TRX network
        BSC: '80000.00'    // BNB on BSC network
      };
      
      // Admin accounts get higher balances
      if (targetUser.username === 'admin') {
        initialBalances = {
          BTC: '3000000.00',
          ETH: '7000000.00',
          TRX: '8000000.00',
          BSC: '4500000.00'
        };
      } else if (targetUser.username === 'SoftwareHenry') {
        initialBalances = {
          BTC: '3500000.00',
          ETH: '7500000.00',
          TRX: '8500000.00',
          BSC: '5000000.00'
        };
      }
      
      // Check if wallets exist for this user, create them if not
      const userWallets = await db.select().from(wallets).where(eq(wallets.userId, targetUser.id));
      
      if (userWallets.length === 0) {
        // Create wallets for this user
        for (const [network, balance] of Object.entries(initialBalances)) {
          await db.insert(wallets).values({
            userId: targetUser.id,
            address: `0x${randomUUID().replace(/-/g, '').substring(0, 40)}`,
            network: network,
            balance: balance,
          });
        }
      } else {
        // Update existing wallets
        for (const [network, balance] of Object.entries(initialBalances)) {
          await db.update(wallets)
            .set({ balance })
            .where(and(
              eq(wallets.userId, targetUser.id),
              eq(wallets.network, network)
            ));
        }
      }
    }
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
    // First, create the transaction
    const [transaction] = await db.insert(transactions).values({
      ...transactionData,
      txHash: `0x${randomUUID().replace(/-/g, '')}`,
    }).returning();
    
    // Update wallet balance if transaction is successful
    if (transaction && (transaction.status === 'completed' || transaction.status === 'pending')) {
      try {
        // Get the user's wallet for the specific network/token
        const userWallets = await db.select().from(wallets)
          .where(and(
            eq(wallets.userId, transaction.userId),
            eq(wallets.network, transaction.network)
          ));
        
        if (userWallets.length > 0) {
          const wallet = userWallets[0];
          const currentBalance = parseFloat(wallet.balance);
          const transactionAmount = parseFloat(transaction.amount);
          
          // Calculate new balance (deduct transaction amount)
          const newBalance = Math.max(0, currentBalance - transactionAmount);
          
          // Update wallet with new balance
          await db.update(wallets)
            .set({ balance: newBalance.toFixed(2) })
            .where(eq(wallets.id, wallet.id));
        }
      } catch (error) {
        console.error('Error updating wallet balance:', error);
      }
    }
    
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
    // Return single premium plan
    return [{
      id: 'premium',
      name: 'Premium Access',
      price: '7500',
      features: [
        'Unlimited Flash Transactions',
        'All Networks Supported (BTC, ETH, USDT, BNB, TRX)',
        'Priority 24/7 Support',
        'Advanced Security Features',
        'Bulk Transaction Processing',
        'Transaction Templates',
        'Portfolio Tracker',
        'Price Alerts & Notifications',
        'API Access',
        'Affiliate Program Access',
        'Custom Integration Support',
        'Lifetime Updates'
      ],
      createdAt: new Date()
    }];
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

  async getPendingSubscriptions(): Promise<UserSubscription[]> {
    return await db.select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.status, 'pending'))
      .orderBy(userSubscriptions.createdAt);
  }

  async updateSubscriptionStatus(id: string, status: string): Promise<UserSubscription> {
    const [updated] = await db.update(userSubscriptions)
      .set({ status })
      .where(eq(userSubscriptions.id, id))
      .returning();
    
    if (!updated) {
      throw new Error("Subscription not found");
    }
    return updated;
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

// Use offline storage for production exe builds
const isProductionExe = process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL;
export const storage = isProductionExe ? offlineStorage : new DatabaseStorage();