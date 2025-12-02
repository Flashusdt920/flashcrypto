// Offline storage implementation for production exe builds
import type { IStorage } from "./storage";
import { buildFallbackNetworkConfigs } from "./default-data";
import { 
  type User, type InsertUser, type UpdateUser,
  type Wallet, type InsertWallet,
  type Transaction, type InsertTransaction,
  type SubscriptionPlan,
  type UserSubscription, type InsertUserSubscription,
} from "@shared/schema";

class OfflineStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private wallets: Map<string, Wallet[]> = new Map();
  private transactions: Map<string, Transaction[]> = new Map();
  private subscriptions: Map<string, UserSubscription> = new Map();
  private gasReceiverAddress = "TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y";

  constructor() {
    // Initialize with admin users
    const adminUser: User = {
      id: "admin-1",
      username: "admin",
      email: "admin@boltflasher.com",
      password: "usdt123",
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const henryUser: User = {
      id: "admin-2", 
      username: "softwarehenry",
      email: "henry@boltflasher.com",
      password: "Rmabuw190",
      role: "admin",
      firstName: "Henry",
      lastName: "Software",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.users.set(adminUser.id, adminUser);
    this.users.set(henryUser.id, henryUser);
    
    // Add admin subscriptions
    const adminSub: UserSubscription = {
      id: "sub-1",
      userId: adminUser.id,
      planId: "plan-full",
      status: "active",
      paymentTxHash: "admin-default",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000),
    };
    
    this.subscriptions.set(adminUser.id, adminSub);
    this.subscriptions.set(henryUser.id, { ...adminSub, id: "sub-2", userId: henryUser.id });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.username.toLowerCase() === username.toLowerCase()) {
        return user;
      }
    }
    return undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of this.users.values()) {
      if (user.email?.toLowerCase() === email.toLowerCase()) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      id: `user-${Date.now()}`,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: string, updates: UpdateUser): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async deleteUser(id: string): Promise<void> {
    this.users.delete(id);
  }

  async getWalletsByUserId(userId: string): Promise<Wallet[]> {
    return this.wallets.get(userId) || [];
  }

  async createWallet(walletData: InsertWallet): Promise<Wallet> {
    const wallet: Wallet = {
      id: `wallet-${Date.now()}`,
      ...walletData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const userWallets = this.wallets.get(walletData.userId) || [];
    userWallets.push(wallet);
    this.wallets.set(walletData.userId, userWallets);
    
    return wallet;
  }

  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return this.transactions.get(userId) || [];
  }

  async createTransaction(transactionData: InsertTransaction): Promise<Transaction> {
    const transaction: Transaction = {
      id: `tx-${Date.now()}`,
      ...transactionData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const userTxs = this.transactions.get(transactionData.userId) || [];
    userTxs.push(transaction);
    this.transactions.set(transactionData.userId, userTxs);
    
    return transaction;
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    for (const [userId, txs] of this.transactions.entries()) {
      const txIndex = txs.findIndex(tx => tx.id === id);
      if (txIndex !== -1) {
        txs[txIndex] = { ...txs[txIndex], ...updates, updatedAt: new Date() };
        return txs[txIndex];
      }
    }
    throw new Error("Transaction not found");
  }

  getGasReceiverAddress(): string | undefined {
    return this.gasReceiverAddress;
  }

  setGasReceiverAddress(address: string): void {
    this.gasReceiverAddress = address;
  }

  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return [
      {
        id: "plan-basic",
        name: "Basic",
        price: "550",
        features: ["BTC Flash", "ETH Flash", "Basic Support"],
        createdAt: new Date()
      },
      {
        id: "plan-pro",
        name: "Pro",
        price: "950", 
        features: ["All Basic Features", "USDT Flash", "BNB Flash", "Priority Support"],
        createdAt: new Date()
      },
      {
        id: "plan-full",
        name: "Full",
        price: "3000",
        features: ["All Networks", "Premium Support", "Custom Flash Options", "API Access"],
        createdAt: new Date()
      }
    ];
  }

  async createSubscription(subscription: InsertUserSubscription): Promise<UserSubscription> {
    const sub: UserSubscription = {
      id: `sub-${Date.now()}`,
      ...subscription,
      createdAt: new Date(),
      expiresAt: subscription.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    };
    this.subscriptions.set(subscription.userId, sub);
    return sub;
  }

  async getUserSubscription(userId: string): Promise<UserSubscription | undefined> {
    return this.subscriptions.get(userId);
  }

  async getUserSubscriptions(userId: string): Promise<UserSubscription[]> {
    const sub = this.subscriptions.get(userId);
    return sub ? [sub] : [];
  }

  async getPendingSubscriptions(): Promise<UserSubscription[]> {
    return Array.from(this.subscriptions.values()).filter(sub => sub.status === "pending");
  }

  async updateSubscriptionStatus(id: string, status: string): Promise<UserSubscription> {
    for (const [userId, sub] of this.subscriptions.entries()) {
      if (sub.id === id) {
        sub.status = status;
        return sub;
      }
    }
    throw new Error("Subscription not found");
  }

  async getNetworkConfigs() {
    return buildFallbackNetworkConfigs();
  }

  async getMarketData() {
    return [];
  }
}

export const offlineStorage = new OfflineStorage();