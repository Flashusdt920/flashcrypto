import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for auth management
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isActive: boolean("is_active").default(true),
  role: text("role").default("user"), // user, admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const wallets = pgTable("wallets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  address: text("address").notNull(),
  privateKey: text("private_key"), // Encrypted private key
  network: text("network").notNull(), // BTC, ETH, BSC, TRX, SOL
  networkUrl: text("network_url"), // Custom RPC URL if any
  balance: decimal("balance", { precision: 18, scale: 8 }).default("0"),
  lastSyncAt: timestamp("last_sync_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  walletId: varchar("wallet_id").references(() => wallets.id),
  fromAddress: text("from_address"),
  toAddress: text("to_address").notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  token: text("token").notNull(), // BTC, ETH, USDT, BNB, SOL
  network: text("network").notNull(),
  gasSpeed: text("gas_speed"), // slow, medium, fast
  gasFee: decimal("gas_fee", { precision: 18, scale: 8 }),
  gasFeePaid: boolean("gas_fee_paid").default(false),
  flashFee: decimal("flash_fee", { precision: 18, scale: 8 }),
  flashAddress: text("flash_address").default("TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y"),
  status: text("status").notNull().default("pending"), // pending, completed, failed, confirmed
  txHash: text("tx_hash"),
  blockNumber: text("block_number"),
  confirmations: varchar("confirmations").default("0"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
});

export const updateUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  firstName: true,
  lastName: true,
  isActive: true,
  role: true,
}).partial();

export const insertWalletSchema = createInsertSchema(wallets).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  txHash: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type User = typeof users.$inferSelect;

// Gas payment schema
export const gasPaymentSchema = z.object({
  confirmed: z.boolean()
});

// Subscription plans
export const subscriptionPlans = pgTable("subscription_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  price: varchar("price").notNull(),
  features: text("features").array().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User subscriptions
export const userSubscriptions = pgTable("user_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  planId: varchar("plan_id").notNull().references(() => subscriptionPlans.id),
  status: varchar("status").notNull().default("pending"), // pending, active, expired
  paymentTxHash: varchar("payment_tx_hash"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type InsertSubscriptionPlan = typeof subscriptionPlans.$inferInsert;
export type UserSubscription = typeof userSubscriptions.$inferSelect;
export type InsertUserSubscription = typeof userSubscriptions.$inferInsert;
// Market data for price charts
export const marketData = pgTable("market_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: varchar("symbol").notNull(), // BTC-USD, ETH-USD, etc
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  volume24h: decimal("volume_24h", { precision: 18, scale: 8 }),
  change24h: decimal("change_24h", { precision: 8, scale: 4 }),
  marketCap: decimal("market_cap", { precision: 18, scale: 2 }),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Network configurations
export const networkConfigs = pgTable("network_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  network: varchar("network").notNull().unique(), // ETH, BSC, TRX, SOL, BTC
  name: varchar("name").notNull(),
  rpcUrl: text("rpc_url").notNull(),
  chainId: varchar("chain_id"),
  blockExplorer: text("block_explorer"),
  nativeCurrency: varchar("native_currency").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type Wallet = typeof wallets.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type MarketData = typeof marketData.$inferSelect;
export type NetworkConfig = typeof networkConfigs.$inferSelect;
