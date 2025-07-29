import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTransactionSchema } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const gasPaymentSchema = z.object({
  transactionId: z.string(),
  confirmed: z.boolean(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Check password
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In production, use proper session management
      res.json({ 
        user: { id: user.id, username: user.username },
        token: `token_${user.id}` // Simplified token
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create new user
      const newUser = await storage.createUser({
        username,
        password, // In production, hash this password
      });

      res.json({ 
        user: { id: newUser.id, username: newUser.username },
        token: `token_${newUser.id}`, // Simplified token
        message: "Registration successful"
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.json({ message: "Logged out successfully" });
  });

  // Wallets
  app.get("/api/wallets/:userId", async (req, res) => {
    try {
      const wallets = await storage.getWalletsByUserId(req.params.userId);
      res.json(wallets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });

  // Transactions
  app.get("/api/transactions/:userId", async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByUserId(req.params.userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      
      // Validate gas fee payment for all networks
      if (!transactionData.gasFeePaid) {
        return res.status(400).json({ 
          message: "Gas fee payment required for all transactions" 
        });
      }

      const transaction = await storage.createTransaction(transactionData);
      
      // Simulate transaction processing
      setTimeout(async () => {
        await storage.updateTransaction(transaction.id, { 
          status: "completed" 
        });
      }, 5000);

      res.json(transaction);
    } catch (error) {
      console.error("Transaction creation error:", error);
      res.status(400).json({ message: "Failed to create transaction" });
    }
  });

  app.patch("/api/transactions/:id/gas-payment", async (req, res) => {
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

  // Gas fee information
  app.get("/api/gas-fees", (req, res) => {
    const gasReceiverAddress = storage.getGasReceiverAddress() || "TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y";
    res.json({
      receiverAddress: gasReceiverAddress,
      fees: {
        slow: "0.0006",
        medium: "0.0009", 
        fast: "0.0012"
      }
    });
  });

  // Admin endpoint to update gas receiver address
  app.post("/api/admin/gas-receiver", async (req, res) => {
    try {
      const { address } = req.body;
      
      if (!address || typeof address !== 'string') {
        return res.status(400).json({ message: 'Valid wallet address is required' });
      }

      // Basic validation for wallet address format (supports Ethereum and Tron)
      const isEthereumAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
      const isTronAddress = /^T[A-Za-z1-9]{33}$/.test(address);
      
      if (!isEthereumAddress && !isTronAddress) {
        return res.status(400).json({ message: 'Invalid wallet address format. Must be Ethereum (0x...) or Tron (T...) address' });
      }

      storage.setGasReceiverAddress(address);
      res.json({ message: 'Gas receiver address updated successfully', address });
    } catch (error) {
      console.error('Error updating gas receiver address:', error);
      res.status(500).json({ message: 'Failed to update gas receiver address' });
    }
  });

  // Get current gas receiver address (admin only)
  app.get("/api/admin/gas-receiver", (req, res) => {
    const address = storage.getGasReceiverAddress();
    res.json({ address });
  });

  

  // Subscription plans
  app.get("/api/subscription-plans", async (req, res) => {
    try {
      const plans = await storage.getSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscription plans" });
    }
  });

  // Create subscription
  app.post("/api/subscriptions", async (req, res) => {
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
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      });

      res.json(subscription);
    } catch (error) {
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });

  // Get user subscription
  app.get("/api/subscriptions/:userId", async (req, res) => {
    try {
      const subscription = await storage.getUserSubscription(req.params.userId);
      res.json(subscription || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscription" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
