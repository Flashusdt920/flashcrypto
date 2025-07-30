// Bolt Crypto Flasher Portable Server
const express = require('express');
const path = require('path');
const { createServer } = require('http');

const app = express();
const PORT = 5000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bolt Crypto Flasher is running' });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

console.log('🔥 Bolt Crypto Flasher is starting...');
console.log('💰 Professional Cryptocurrency Flash Platform');
console.log('🌐 Open your browser to: http://localhost:5000');
console.log('');

const server = createServer(app);

server.listen(PORT, () => {
  console.log('⚡ Server running on http://localhost:5000');
  console.log('🎯 Ready for flash transactions!');
  
  // Auto-open browser on Windows
  if (process.platform === 'win32') {
    const { exec } = require('child_process');
    exec('start http://localhost:5000');
  }
});