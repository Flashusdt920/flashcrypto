// Vercel serverless function that serves Bolt Crypto Flasher
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Set security and CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // For root path, serve the HTML page
  if (req.url === '/' || req.url === '/index.html') {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bolt Crypto Flasher - Professional Flash Transaction Gateway</title>
    <meta name="description" content="Professional cryptocurrency flash transaction platform supporting BTC, ETH, USDT, BNB with advanced flash fee management and real-time balance tracking.">
    <meta name="theme-color" content="#1a1a1a">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: #ffffff;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            text-align: center;
            max-width: 600px;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        .logo {
            font-size: 3rem;
            font-weight: bold;
            background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
            text-shadow: 0 0 30px rgba(59, 130, 246, 0.3);
        }
        .subtitle {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            color: #a0a0a0;
        }
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
        }
        .feature {
            padding: 1rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .login-form {
            max-width: 300px;
            margin: 0 auto;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .form-group {
            margin-bottom: 1rem;
            text-align: left;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
            color: #a0a0a0;
        }
        input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            color: #ffffff;
            font-size: 1rem;
        }
        input::placeholder {
            color: #666;
        }
        input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        .btn {
            width: 100%;
            padding: 0.75rem;
            background: linear-gradient(45deg, #3b82f6, #8b5cf6);
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
        }
        .status {
            margin-top: 1rem;
            padding: 0.5rem;
            border-radius: 5px;
            font-size: 0.9rem;
        }
        .success { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .error { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
        .info { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">⚡ BOLT CRYPTO FLASHER</div>
        <div class="subtitle">Professional Flash Transaction Gateway</div>
        
        <div class="features">
            <div class="feature">
                <h3>Multi-Chain Support</h3>
                <p>BTC, ETH, USDT, BNB</p>
            </div>
            <div class="feature">
                <h3>Flash Transactions</h3>
                <p>Advanced Flash Fee Management</p>
            </div>
            <div class="feature">
                <h3>Real-Time Tracking</h3>
                <p>Live Balance Updates</p>
            </div>
        </div>

        <div class="login-form">
            <h3 style="margin-bottom: 1rem; color: #ffffff;">Admin Access</h3>
            <div id="loginForm">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" placeholder="admin" value="admin">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="usdt123" value="usdt123">
                </div>
                <button class="btn" onclick="login()">Access Platform</button>
                <div id="status" class="status info">
                    Ready to access your crypto flash platform
                </div>
            </div>
        </div>
    </div>

    <script>
        function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const status = document.getElementById('status');
            
            status.className = 'status info';
            status.textContent = 'Connecting to platform...';
            
            // Simulate login (in production this would be a real API call)
            setTimeout(() => {
                if (username === 'admin' && password === 'usdt123') {
                    status.className = 'status success';
                    status.textContent = 'Login successful! Welcome to Bolt Crypto Flasher';
                    
                    setTimeout(() => {
                        status.textContent = 'Redirecting to dashboard...';
                        // In production, redirect to actual dashboard
                        window.location.href = '/dashboard';
                    }, 1500);
                } else {
                    status.className = 'status error';
                    status.textContent = 'Invalid credentials. Use admin/usdt123';
                }
            }, 1000);
        }
        
        // Allow Enter key to submit
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    </script>
</body>
</html>`;
    
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
    return;
  }

  // Handle API routes with proper responses
  if (req.url.startsWith('/api/')) {
    const apiResponse = {
      service: 'Bolt Crypto Flasher API',
      version: '1.0.0',
      endpoint: req.url,
      method: req.method,
      status: 'operational',
      features: [
        'Multi-chain cryptocurrency support',
        'Flash transaction processing', 
        'Real-time balance tracking',
        'Subscription management'
      ]
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(apiResponse);
    return;
  }

  // For any other routes, redirect to home
  res.writeHead(302, { Location: '/' });
  res.end();
};