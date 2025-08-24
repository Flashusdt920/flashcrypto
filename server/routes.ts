import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { blockchainService } from "./blockchain";
import { insertTransactionSchema, gasPaymentSchema as gasSchema } from "@shared/schema";
import { z } from "zod";
import { registerSEORoutes } from "./seo-routes";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

// Using gas payment schema from shared/schema.ts

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);

      const user = await storage.getUserByUsername(username.toLowerCase());
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Check password
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In production, use proper session management
      res.json({ 
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        token: `token_${user.id}` // Simplified token
      });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, firstName, lastName } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      // Check if user already exists by username (case-insensitive)
      const existingUser = await storage.getUserByUsername(username.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Check if email already exists (if provided)
      if (email) {
        const existingEmailUser = await storage.getUserByEmail(email);
        if (existingEmailUser) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }

      // Create new user with email support (username stored in lowercase)
      const newUser = await storage.createUser({
        username: username.toLowerCase(),
        email: email || null,
        password, // In production, hash this password
        firstName: firstName || null,
        lastName: lastName || null,
      });

      res.json({ 
        user: { 
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        },
        token: `token_${newUser.id}`, // Simplified token
        message: "Registration successful. Please purchase a subscription to access the platform."
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: "Registration failed" });
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
      const { confirmed } = gasSchema.parse(req.body);
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

  // Admin User Management Routes
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put("/api/admin/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, firstName, lastName, isActive, role } = req.body;
      
      // Validate that user exists
      const existingUser = await storage.getUser(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check for username conflicts (if username is being changed)
      if (username && username !== existingUser.username) {
        const userWithUsername = await storage.getUserByUsername(username);
        if (userWithUsername && userWithUsername.id !== id) {
          return res.status(400).json({ message: "Username already exists" });
        }
      }
      
      // Check for email conflicts (if email is being changed)
      if (email && email !== existingUser.email) {
        const userWithEmail = await storage.getUserByEmail(email);
        if (userWithEmail && userWithEmail.id !== id) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }
      
      const updatedUser = await storage.updateUser(id, {
        username,
        email,
        firstName,
        lastName,
        isActive,
        role,
      });
      
      // Remove password from response
      const { password, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate that user exists
      const existingUser = await storage.getUser(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Prevent deletion of admin users
      if (existingUser.username === 'admin' || existingUser.username === 'SoftwareHenry') {
        return res.status(400).json({ message: "Cannot delete admin users" });
      }
      
      await storage.deleteUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  app.post("/api/admin/users/:id/reset-password", async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      
      if (!newPassword) {
        return res.status(400).json({ message: "New password is required" });
      }
      
      // Validate that user exists
      const existingUser = await storage.getUser(id);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      await storage.updateUser(id, { password: newPassword } as any);
      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Admin endpoints for subscription approval
  app.get("/api/admin/subscriptions/pending", async (req, res) => {
    try {
      const pendingSubscriptions = await storage.getPendingSubscriptions();
      res.json(pendingSubscriptions);
    } catch (error) {
      console.error("Error fetching pending subscriptions:", error);
      res.status(500).json({ message: "Failed to fetch pending subscriptions" });
    }
  });

  app.post("/api/admin/subscriptions/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const subscription = await storage.updateSubscriptionStatus(id, "active");
      res.json({ message: "Subscription approved successfully", subscription });
    } catch (error) {
      console.error("Error approving subscription:", error);
      res.status(500).json({ message: "Failed to approve subscription" });
    }
  });

  app.post("/api/admin/subscriptions/:id/reject", async (req, res) => {
    try {
      const { id } = req.params;
      const subscription = await storage.updateSubscriptionStatus(id, "rejected");
      res.json({ message: "Subscription rejected successfully", subscription });
    } catch (error) {
      console.error("Error rejecting subscription:", error);
      res.status(500).json({ message: "Failed to reject subscription" });
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

  // Create subscription (pending approval)
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
        status: "pending", // Changed to pending - requires admin approval
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

  // Email Verification Endpoints
  app.post("/api/auth/send-verification", async (req, res) => {
    try {
      const { userId, email } = req.body;
      
      // Generate verification token
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      // Store verification token (would need to add to storage interface)
      console.log(`Verification email would be sent to ${email} with token: ${token}`);
      
      res.json({ 
        message: "Verification email sent successfully",
        // In development, return token for testing
        devToken: token 
      });
    } catch (error) {
      console.error("Error sending verification email:", error);
      res.status(500).json({ message: "Failed to send verification email" });
    }
  });
  
  app.post("/api/auth/verify-email", async (req, res) => {
    try {
      const { token, code } = req.body;
      
      // For demo purposes, accept code "123456"
      if (code === "123456") {
        res.json({ message: "Email verified successfully", verified: true });
      } else {
        res.status(400).json({ message: "Invalid verification code" });
      }
    } catch (error) {
      console.error("Error verifying email:", error);
      res.status(500).json({ message: "Failed to verify email" });
    }
  });

  // 2FA Endpoints
  app.post("/api/auth/2fa/setup", async (req, res) => {
    try {
      const { userId } = req.body;
      
      // Generate secret
      const secret = "JBSWY3DPEHPK3PXP"; // Example secret
      
      // Generate backup codes
      const backupCodes = Array.from({ length: 10 }, () => 
        Math.random().toString(36).substring(2, 10).toUpperCase()
      );
      
      // In production, generate proper QR code
      const qrCodeUrl = `otpauth://totp/BoltFlasher:user?secret=${secret}&issuer=BoltFlasher`;
      
      res.json({
        secret,
        qrCodeUrl,
        backupCodes,
        enabled: false
      });
    } catch (error) {
      console.error("Error setting up 2FA:", error);
      res.status(500).json({ message: "Failed to setup 2FA" });
    }
  });
  
  app.post("/api/auth/2fa/verify", async (req, res) => {
    try {
      const { userId, code } = req.body;
      
      // For demo purposes, accept code "123456"
      if (code === "123456") {
        res.json({ message: "2FA verified successfully", verified: true });
      } else {
        res.status(400).json({ message: "Invalid 2FA code" });
      }
    } catch (error) {
      console.error("Error verifying 2FA:", error);
      res.status(500).json({ message: "Failed to verify 2FA" });
    }
  });
  
  app.post("/api/auth/2fa/disable", async (req, res) => {
    try {
      const { userId } = req.body;
      
      res.json({ message: "2FA disabled successfully" });
    } catch (error) {
      console.error("Error disabling 2FA:", error);
      res.status(500).json({ message: "Failed to disable 2FA" });
    }
  });

  // Security Settings Endpoints
  app.get("/api/security/settings/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Return default settings for demo
      res.json({
        userId,
        antiPhishingCode: null,
        ipWhitelist: [],
        sessionTimeout: 30,
        emailNotifications: true,
        smsNotifications: false,
        loginAlerts: true,
        withdrawalWhitelist: [],
        twoFactorEnabled: false,
        emailVerified: false
      });
    } catch (error) {
      console.error("Error fetching security settings:", error);
      res.status(500).json({ message: "Failed to fetch security settings" });
    }
  });
  
  app.put("/api/security/settings/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const settings = req.body;
      
      // Return updated settings
      res.json({
        ...settings,
        userId,
        message: "Settings updated successfully"
      });
    } catch (error) {
      console.error("Error updating security settings:", error);
      res.status(500).json({ message: "Failed to update security settings" });
    }
  });
  
  // Anti-Phishing Code
  app.post("/api/security/anti-phishing", async (req, res) => {
    try {
      const { userId, code } = req.body;
      
      if (!code || code.length < 4) {
        return res.status(400).json({ message: "Code must be at least 4 characters" });
      }
      
      res.json({ message: "Anti-phishing code set successfully", code });
    } catch (error) {
      console.error("Error setting anti-phishing code:", error);
      res.status(500).json({ message: "Failed to set anti-phishing code" });
    }
  });
  
  // IP Whitelist
  app.post("/api/security/ip-whitelist", async (req, res) => {
    try {
      const { userId, ipAddress } = req.body;
      
      // Validate IP format
      const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (!ipRegex.test(ipAddress)) {
        return res.status(400).json({ message: "Invalid IP address format" });
      }
      
      res.json({ message: "IP address added to whitelist", ipAddress });
    } catch (error) {
      console.error("Error adding to IP whitelist:", error);
      res.status(500).json({ message: "Failed to add to IP whitelist" });
    }
  });
  
  app.delete("/api/security/ip-whitelist", async (req, res) => {
    try {
      const { userId, ipAddress } = req.body;
      
      res.json({ message: "IP address removed from whitelist" });
    } catch (error) {
      console.error("Error removing from IP whitelist:", error);
      res.status(500).json({ message: "Failed to remove from IP whitelist" });
    }
  });
  
  // Login History
  app.get("/api/security/login-history/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Return sample login history
      const history = [
        {
          id: "1",
          userId,
          ipAddress: "192.168.1.1",
          location: "New York, US",
          userAgent: "Chrome/120.0",
          status: "success",
          createdAt: new Date().toISOString()
        },
        {
          id: "2",
          userId,
          ipAddress: "10.0.0.1",
          location: "London, UK",
          userAgent: "Firefox/121.0",
          status: "success",
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      
      res.json(history);
    } catch (error) {
      console.error("Error fetching login history:", error);
      res.status(500).json({ message: "Failed to fetch login history" });
    }
  });
  
  // Session Management
  app.get("/api/security/sessions/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Return sample sessions
      const sessions = [
        {
          id: "session1",
          userId,
          ipAddress: "192.168.1.1",
          userAgent: "Chrome/120.0",
          lastActivity: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 3600000).toISOString()
        }
      ];
      
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });
  
  app.delete("/api/security/sessions/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      res.json({ message: "Session terminated successfully" });
    } catch (error) {
      console.error("Error terminating session:", error);
      res.status(500).json({ message: "Failed to terminate session" });
    }
  });

  // Register SEO routes for better search engine optimization
  registerSEORoutes(app);

  // API 404 handler - must come after all API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({ message: `API endpoint not found: ${req.originalUrl}` });
  });

  const httpServer = createServer(app);
  return httpServer;
}