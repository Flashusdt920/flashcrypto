import { 
  users, wallets, transactions, subscriptionPlans, userSubscriptions,
  type User, type InsertUser,
  type Wallet, type InsertWallet,
  type Transaction, type InsertTransaction,
  type SubscriptionPlan, type InsertSubscriptionPlan,
  type UserSubscription, type InsertUserSubscription
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
          features: ["Basic crypto transactions", "Standard support", "Single wallet"],
        },
        {
          name: "Pro", 
          price: "950",
          features: ["Advanced trading tools", "Priority support", "Multiple wallets", "Analytics dashboard"],
        },
        {
          name: "Full",
          price: "3000", 
          features: ["All features", "24/7 dedicated support", "Unlimited wallets", "Advanced analytics", "API access"],
        }
      ]).returning();

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
}

export const storage = new DatabaseStorage();