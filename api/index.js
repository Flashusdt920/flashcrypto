// Vercel serverless function for Bolt Crypto Flasher
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // In-memory user storage for demo
  const users = [
    {
      id: 'admin-001',
      username: 'admin',
      email: 'admin@boltflasher.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'henry-001',
      username: 'SoftwareHenry',
      email: 'henry@boltflasher.com',
      firstName: 'Software',
      lastName: 'Henry',
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const { method, url } = req;
  const urlPath = url.split('?')[0];

// Authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  // Admin authentication
  if (username === 'admin' && password === 'usdt123') {
    const user = users.find(u => u.username === 'admin');
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token: 'admin-token-' + Date.now()
    });
  } else if (username === 'SoftwareHenry' && password === 'Rmabuw190') {
    const user = users.find(u => u.username === 'SoftwareHenry');
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token: 'henry-token-' + Date.now()
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, firstName, lastName, password } = req.body;
  
  // Check if username exists
  if (users.find(u => u.username === username)) {
    return res.status(400).json({
      success: false,
      message: 'Username already exists'
    });
  }
  
  // Check if email exists
  if (email && users.find(u => u.email === email)) {
    return res.status(400).json({
      success: false,
      message: 'Email already exists'
    });
  }
  
  // Create new user
  const newUser = {
    id: 'user-' + Date.now(),
    username,
    email: email || null,
    firstName: firstName || null,
    lastName: lastName || null,
    role: 'user',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  
  res.json({
    success: true,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role
    },
    token: 'user-token-' + Date.now(),
    message: 'Registration successful. Please purchase a subscription to access the platform.'
  });
});

// Admin endpoints
app.get('/api/admin/users', (req, res) => {
  // Remove passwords from response
  const safeUsers = users.map(({ password, ...user }) => user);
  res.json(safeUsers);
});

app.get('/api/admin/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const { password, ...safeUser } = user;
  res.json(safeUser);
});

app.put('/api/admin/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, firstName, lastName, isActive, role } = req.body;
  
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Check for username conflicts
  if (username && username !== users[userIndex].username) {
    const existingUser = users.find(u => u.username === username && u.id !== id);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
  }
  
  // Check for email conflicts
  if (email && email !== users[userIndex].email) {
    const existingUser = users.find(u => u.email === email && u.id !== id);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
  }
  
  // Update user
  users[userIndex] = {
    ...users[userIndex],
    username: username || users[userIndex].username,
    email: email || users[userIndex].email,
    firstName: firstName || users[userIndex].firstName,
    lastName: lastName || users[userIndex].lastName,
    isActive: isActive !== undefined ? isActive : users[userIndex].isActive,
    role: role || users[userIndex].role,
    updatedAt: new Date().toISOString(),
  };
  
  const { password, ...safeUser } = users[userIndex];
  res.json(safeUser);
});

app.delete('/api/admin/users/:id', (req, res) => {
  const { id } = req.params;
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const user = users[userIndex];
  if (user.username === 'admin' || user.username === 'SoftwareHenry') {
    return res.status(400).json({ message: 'Cannot delete admin users' });
  }
  
  users.splice(userIndex, 1);
  res.json({ message: 'User deleted successfully' });
});

// Subscription endpoints
app.get('/api/subscriptions/:userId', (req, res) => {
  const { userId } = req.params;
  
  // Admin users get automatic subscription
  const user = users.find(u => u.id === userId);
  if (user && (user.username === 'admin' || user.username === 'SoftwareHenry')) {
    return res.json({
      id: `admin-sub-${userId}`,
      userId,
      planId: 'admin-plan',
      status: 'active',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    });
  }
  
  // Regular users need to purchase subscription
  res.status(404).json({ message: 'No active subscription found' });
});

// Subscription plans
app.get('/api/subscription-plans', (req, res) => {
  res.json([
    {
      id: 'basic-plan',
      name: 'Basic Plan',
      price: '$550',
      features: ['BTC Flash', 'ETH Flash', 'Basic Support']
    },
    {
      id: 'pro-plan',
      name: 'Pro Plan',
      price: '$950',
      features: ['All Basic Features', 'USDT Flash', 'BNB Flash', 'Priority Support']
    },
    {
      id: 'full-plan',
      name: 'Full Plan',
      price: '$3000',
      features: ['All Pro Features', 'Advanced Analytics', '24/7 Support', 'Custom Networks']
    }
  ]);
});

// Default API info
app.get('/', (req, res) => {
  res.json({
    service: 'Bolt Crypto Flasher API',
    version: '1.0.0',
    features: [
      'Multi-chain cryptocurrency support',
      'Flash transaction processing',
      'Real-time balance tracking',
      'Subscription management',
      'User registration with email',
      'Admin user management'
    ],
    status: 'operational'
  });
});

// Handle all other routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

module.exports = app;