// Simple Vercel function that serves the built React app
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle API routes
  if (req.url.startsWith('/api/')) {
    res.status(200).json({ 
      message: 'API endpoint', 
      url: req.url,
      method: req.method 
    });
    return;
  }

  // Serve the React app
  try {
    const indexPath = path.join(process.cwd(), 'client', 'index.html');
    
    if (fs.existsSync(indexPath)) {
      const html = fs.readFileSync(indexPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
    } else {
      res.status(200).json({ 
        message: 'Bolt Crypto Flasher Loading... (Cache Cleared)', 
        path: req.url,
        cwd: process.cwd(),
        files: fs.readdirSync(process.cwd())
      });
    }
  } catch (error) {
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message,
      cwd: process.cwd()
    });
  }
};