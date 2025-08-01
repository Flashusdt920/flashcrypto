// Vercel API endpoint for authentication
export default async function handler(req, res) {
  // Set CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST' && req.url.includes('/login')) {
    const { username, password } = req.body || {};
    
    // Admin authentication
    if (username === 'admin' && password === 'usdt123') {
      res.status(200).json({
        success: true,
        user: {
          id: 'admin-001',
          username: 'admin',
          role: 'admin',
          email: 'admin@boltflasher.com'
        },
        token: 'admin-token-' + Date.now()
      });
    } else if (username === 'SoftwareHenry' && password === 'Rmabuw190') {
      res.status(200).json({
        success: true,
        user: {
          id: 'henry-001',
          username: 'SoftwareHenry',
          role: 'admin',
          email: 'henry@boltflasher.com'
        },
        token: 'henry-token-' + Date.now()
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    return;
  }

  // Default API info
  res.status(200).json({
    service: 'Bolt Crypto Flasher API',
    version: '1.0.0',
    features: [
      'Multi-chain cryptocurrency support',
      'Flash transaction processing',
      'Real-time balance tracking',
      'Subscription management'
    ],
    status: 'operational'
  });
}