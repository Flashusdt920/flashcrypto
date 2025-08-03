// Embedded API server for static website deployment
// This creates a mock backend API for the static website version

class StaticAPIServer {
  constructor() {
    this.users = [
      { id: 'admin-id', username: 'admin', password: 'usdt123', role: 'admin', email: null, firstName: null, lastName: null, isActive: true, createdAt: new Date().toISOString() },
      { id: 'henry-id', username: 'SoftwareHenry', password: 'Rmabuw190', role: 'admin', email: null, firstName: null, lastName: null, isActive: true, createdAt: new Date().toISOString() }
    ];
    this.transactions = [];
    this.subscriptionPlans = [
      { id: 'basic', name: 'Basic', price: '550', features: ['Basic crypto transactions', 'Standard support', 'Single wallet'] },
      { id: 'pro', name: 'Pro', price: '950', features: ['Advanced trading tools', 'Priority support', 'Multiple wallets', 'Analytics dashboard'] },
      { id: 'full', name: 'Full', price: '3000', features: ['All features', '24/7 dedicated support', 'Unlimited wallets', 'Advanced analytics', 'API access'] }
    ];
    this.subscriptions = [];
    this.gasReceiverAddress = 'TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y';
  }

  // API endpoint handlers
  async handleRequest(method, path, body) {
    try {
      if (method === 'POST' && path === '/api/auth/login') {
        const { username, password } = body;
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user) {
          const { password: _, ...safeUser } = user;
          return { success: true, data: { user: safeUser, token: `token_${user.id}` } };
        }
        return { success: false, error: 'Invalid credentials' };
      }

      if (method === 'POST' && path === '/api/auth/register') {
        const { username, email, firstName, lastName, password } = body;
        
        // Check if username exists
        if (this.users.find(u => u.username === username)) {
          return { success: false, error: 'Username already exists' };
        }

        // Check if email exists
        if (email && this.users.find(u => u.email === email)) {
          return { success: false, error: 'Email already exists' };
        }

        const newUser = {
          id: 'user_' + Date.now(),
          username,
          email: email || null,
          firstName: firstName || null,
          lastName: lastName || null,
          password,
          role: 'user',
          isActive: true,
          createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        const { password: _, ...safeUser } = newUser;
        return { 
          success: true, 
          data: { 
            user: safeUser, 
            token: `token_${newUser.id}`,
            message: 'Registration successful. Please purchase a subscription to access the platform.'
          } 
        };
      }

      if (method === 'GET' && path === '/api/subscription-plans') {
        return { success: true, data: this.subscriptionPlans };
      }

      if (method === 'GET' && path === '/api/admin/users') {
        const safeUsers = this.users.map(({ password, ...user }) => user);
        return { success: true, data: safeUsers };
      }

      if (method === 'POST' && path === '/api/transactions') {
        const { toAddress, amount, token, network, userId } = body;
        
        if (!toAddress || !amount || !token || !network) {
          return { success: false, error: 'Missing required fields' };
        }

        const transaction = {
          id: 'tx_' + Date.now(),
          userId: userId || 'anonymous',
          toAddress,
          amount,
          token,
          network,
          status: 'pending',
          gasReceiverAddress: this.gasReceiverAddress,
          createdAt: new Date().toISOString()
        };

        this.transactions.push(transaction);
        return { success: true, data: transaction };
      }

      if (method === 'GET' && path.startsWith('/api/subscriptions/')) {
        const userId = path.split('/').pop();
        if (userId === 'admin-id' || userId === 'henry-id') {
          return {
            success: true,
            data: {
              id: `admin-sub-${userId}`,
              userId,
              planId: 'admin-plan',
              status: 'active',
              createdAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            }
          };
        }
        return { success: false, error: 'No active subscription found' };
      }

      if (method === 'GET' && path === '/api/admin/gas-receiver') {
        return { success: true, data: { address: this.gasReceiverAddress } };
      }

      // Default 404 for unhandled routes
      return { success: false, error: `API endpoint not found: ${path}` };

    } catch (error) {
      return { success: false, error: error.message || 'Internal server error' };
    }
  }
}

// Global API instance
window.staticAPI = new StaticAPIServer();

// Override fetch for API calls
const originalFetch = window.fetch;
window.fetch = async function(url, options = {}) {
  // Check if this is an API call
  if (typeof url === 'string' && url.startsWith('/api/')) {
    try {
      const method = options.method || 'GET';
      let body = null;
      
      if (options.body) {
        try {
          body = JSON.parse(options.body);
        } catch (e) {
          body = options.body;
        }
      }

      const result = await window.staticAPI.handleRequest(method, url, body);
      
      if (result.success) {
        return {
          ok: true,
          status: 200,
          statusText: 'OK',
          json: async () => result.data,
          text: async () => JSON.stringify(result.data)
        };
      } else {
        return {
          ok: false,
          status: result.error === 'Invalid credentials' ? 401 : 
                 result.error.includes('already exists') ? 409 :
                 result.error.includes('not found') ? 404 : 400,
          statusText: 'Error',
          json: async () => ({ message: result.error }),
          text: async () => JSON.stringify({ message: result.error })
        };
      }
    } catch (error) {
      return {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Internal server error' }),
        text: async () => JSON.stringify({ message: 'Internal server error' })
      };
    }
  }

  // For non-API calls, use original fetch
  return originalFetch.call(this, url, options);
};

console.log('Static API server initialized successfully');