import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { blockchainService } from "./blockchain";
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
        slow: "0.019 ETH",
        medium: "0.019 ETH", 
        fast: "0.019 ETH"
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

  // Blockchain integration endpoints
  app.post("/api/blockchain/create-wallet", async (req, res) => {
    try {
      const { network } = req.body;
      const wallet = await blockchainService.createWallet(network);
      res.json(wallet);
    } catch (error) {
      console.error("Error creating wallet:", error);
      res.status(500).json({ message: "Failed to create wallet" });
    }
  });

  app.get("/api/blockchain/balance/:address/:network", async (req, res) => {
    try {
      const { address, network } = req.params;
      const balance = await blockchainService.getBalance(address, network);
      res.json({ balance });
    } catch (error) {
      console.error("Error getting balance:", error);
      res.status(500).json({ message: "Failed to get balance" });
    }
  });

  app.post("/api/blockchain/send", async (req, res) => {
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

  app.get("/api/blockchain/transaction/:hash/:network", async (req, res) => {
    try {
      const { hash, network } = req.params;
      const status = await blockchainService.getTransactionStatus(hash, network);
      res.json(status);
    } catch (error) {
      console.error("Error getting transaction status:", error);
      res.status(500).json({ message: "Failed to get transaction status" });
    }
  });

  // Market data endpoints
  app.get("/api/market/prices", async (req, res) => {
    try {
      const symbols = ['BTC', 'ETH', 'BNB', 'TRX', 'SOL', 'USDT'];
      const prices = await blockchainService.getMultiplePrices(symbols);
      res.json(prices);
    } catch (error) {
      console.error("Error fetching market prices:", error);
      res.status(500).json({ message: "Failed to fetch market prices" });
    }
  });

  app.get("/api/market/price/:symbol", async (req, res) => {
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

  app.get("/api/market/history/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const { days = '7' } = req.query;
      const data = await blockchainService.getHistoricalData(symbol, parseInt(days as string));
      
      // Format data for charts
      const chartData = data.map(point => ({
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

  // Network configurations
  app.get("/api/networks", async (req, res) => {
    try {
      const networks = await storage.getNetworkConfigs();
      res.json(networks);
    } catch (error) {
      console.error("Error fetching networks:", error);
      res.status(500).json({ message: "Failed to fetch network configurations" });
    }
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
      const { userId } = req.params;

      // For admin users, return active subscription
      if (userId === 'admin' || userId === 'SoftwareHenry') {
        return res.json({
          id: `admin-sub-${userId}`,
          userId,
          planId: 'admin-plan',
          status: 'active',
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
        });
      }

      // Check if user has any active subscriptions
      const userSubscriptions = await storage.getUserSubscriptions(userId);
      const activeSubscription = userSubscriptions.find(sub => sub.status === 'active');

      if (!activeSubscription) {
        return res.status(404).json({ message: "No active subscription found" });
      }

      res.json(activeSubscription);
    } catch (error) {
      console.error('Get subscription error:', error);
      res.status(500).json({ message: "Failed to get subscription" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}