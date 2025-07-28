import { 
  users, wallets, transactions,
  type User, type InsertUser,
  type Wallet, type InsertWallet,
  type Transaction, type InsertTransaction
} from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private wallets: Map<string, Wallet>;
  private transactions: Map<string, Transaction>;
  private gasReceiverAddress: string;

  constructor() {
    this.users = new Map();
    this.wallets = new Map();
    this.transactions = new Map();
    this.gasReceiverAddress = "TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y";
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default users
    const adminUser: User = {
      id: randomUUID(),
      username: "admin",
      password: "usdt123",
      createdAt: new Date(),
    };
    
    const henryUser: User = {
      id: randomUUID(),
      username: "SoftwareHenry",
      password: "Rmabuw190",
      createdAt: new Date(),
    };

    this.users.set(adminUser.id, adminUser);
    this.users.set(henryUser.id, henryUser);

    // Create default wallets for admin user
    const btcWallet: Wallet = {
      id: randomUUID(),
      userId: adminUser.id,
      name: "Bitcoin Wallet",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      network: "BTC",
      balance: "1.234",
      createdAt: new Date(),
    };

    const ethWallet: Wallet = {
      id: randomUUID(),
      userId: adminUser.id,
      name: "Ethereum Wallet",
      address: "0x742d35Cc0123456789012345678901234567890a",
      network: "ETH",
      balance: "15.67",
      createdAt: new Date(),
    };

    const usdtWallet: Wallet = {
      id: randomUUID(),
      userId: adminUser.id,
      name: "USDT Wallet",
      address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5oNDMnt",
      network: "TRX",
      balance: "5000000.00",
      createdAt: new Date(),
    };

    this.wallets.set(btcWallet.id, btcWallet);
    this.wallets.set(ethWallet.id, ethWallet);
    this.wallets.set(usdtWallet.id, usdtWallet);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async getWalletsByUserId(userId: string): Promise<Wallet[]> {
    return Array.from(this.wallets.values()).filter(
      (wallet) => wallet.userId === userId,
    );
  }

  async createWallet(insertWallet: InsertWallet): Promise<Wallet> {
    const id = randomUUID();
    const wallet: Wallet = { 
      ...insertWallet, 
      id, 
      createdAt: new Date(),
      balance: insertWallet.balance || "0"
    };
    this.wallets.set(id, wallet);
    return wallet;
  }

  async getTransactionsByUserId(userId: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((tx) => tx.userId === userId)
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      status: "pending",
      txHash: `0x${randomUUID().replace(/-/g, '')}`,
      createdAt: new Date() 
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactions.get(id);
    if (!transaction) {
      throw new Error("Transaction not found");
    }
    const updated = { ...transaction, ...updates };
    this.transactions.set(id, updated);
    return updated;
  }

  getGasReceiverAddress(): string | undefined {
    return this.gasReceiverAddress;
  }

  setGasReceiverAddress(address: string): void {
    this.gasReceiverAddress = address;
  }
}

export const storage = new MemStorage();
