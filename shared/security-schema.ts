import { pgTable, varchar, timestamp, boolean, integer, jsonb, text, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Two-Factor Authentication settings
export const twoFactorAuth = pgTable("two_factor_auth", {
  id: varchar("id").primaryKey().default("gen_random_uuid()"),
  userId: varchar("user_id").notNull(),
  secret: varchar("secret").notNull(),
  backupCodes: jsonb("backup_codes").$type<string[]>().notNull(),
  enabled: boolean("enabled").default(false),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_2fa_user").on(table.userId),
]);

// Login history tracking
export const loginHistory = pgTable("login_history", {
  id: varchar("id").primaryKey().default("gen_random_uuid()"),
  userId: varchar("user_id").notNull(),
  ipAddress: varchar("ip_address").notNull(),
  userAgent: text("user_agent"),
  location: varchar("location"),
  status: varchar("status").notNull(), // success, failed, blocked
  failureReason: varchar("failure_reason"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_login_user").on(table.userId),
  index("idx_login_created").on(table.createdAt),
]);

// Session management
export const userSessions = pgTable("user_sessions", {
  id: varchar("id").primaryKey().default("gen_random_uuid()"),
  userId: varchar("user_id").notNull(),
  token: varchar("token").notNull().unique(),
  ipAddress: varchar("ip_address"),
  userAgent: text("user_agent"),
  lastActivity: timestamp("last_activity").defaultNow(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_session_user").on(table.userId),
  index("idx_session_token").on(table.token),
  index("idx_session_expires").on(table.expiresAt),
]);

// Email verification tokens
export const emailVerifications = pgTable("email_verifications", {
  id: varchar("id").primaryKey().default("gen_random_uuid()"),
  userId: varchar("user_id").notNull(),
  email: varchar("email").notNull(),
  token: varchar("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_verification_token").on(table.token),
  index("idx_verification_user").on(table.userId),
]);

// Security settings per user
export const securitySettings = pgTable("security_settings", {
  id: varchar("id").primaryKey().default("gen_random_uuid()"),
  userId: varchar("user_id").notNull().unique(),
  antiPhishingCode: varchar("anti_phishing_code"),
  ipWhitelist: jsonb("ip_whitelist").$type<string[]>(),
  sessionTimeout: integer("session_timeout").default(30), // minutes
  emailNotifications: boolean("email_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
  loginAlerts: boolean("login_alerts").default(true),
  withdrawalWhitelist: jsonb("withdrawal_whitelist").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_security_user").on(table.userId),
]);

// Types
export type TwoFactorAuth = typeof twoFactorAuth.$inferSelect;
export type InsertTwoFactorAuth = typeof twoFactorAuth.$inferInsert;
export type LoginHistory = typeof loginHistory.$inferSelect;
export type InsertLoginHistory = typeof loginHistory.$inferInsert;
export type UserSession = typeof userSessions.$inferSelect;
export type InsertUserSession = typeof userSessions.$inferInsert;
export type EmailVerification = typeof emailVerifications.$inferSelect;
export type InsertEmailVerification = typeof emailVerifications.$inferInsert;
export type SecuritySettings = typeof securitySettings.$inferSelect;
export type InsertSecuritySettings = typeof securitySettings.$inferInsert;

// Schemas
export const insertTwoFactorAuthSchema = createInsertSchema(twoFactorAuth);
export const insertLoginHistorySchema = createInsertSchema(loginHistory);
export const insertUserSessionSchema = createInsertSchema(userSessions);
export const insertEmailVerificationSchema = createInsertSchema(emailVerifications);
export const insertSecuritySettingsSchema = createInsertSchema(securitySettings);