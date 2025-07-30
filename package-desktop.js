import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Creating Bolt Crypto Flasher Desktop Package...\n');

try {
  // Step 1: Build the web application
  console.log('📦 Building web application...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Web application built successfully\n');

  // Step 2: Create a portable package structure
  console.log('📁 Creating portable package...');
  
  const packageDir = path.join(__dirname, 'portable-app');
  if (fs.existsSync(packageDir)) {
    fs.rmSync(packageDir, { recursive: true });
  }
  fs.mkdirSync(packageDir, { recursive: true });

  // Step 3: Create startup script
  const startupScript = `@echo off
title Bolt Crypto Flasher
echo Starting Bolt Crypto Flasher...
echo.
echo Your cryptocurrency flash transaction platform is loading...
echo Open your browser to: http://localhost:5000
echo.
node server.cjs
pause`;

  fs.writeFileSync(path.join(packageDir, 'start.bat'), startupScript);

  // Step 4: Create server file (CommonJS format)
  const serverContent = `// Bolt Crypto Flasher Portable Server
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
});`;

  fs.writeFileSync(path.join(packageDir, 'server.cjs'), serverContent);

  // Step 5: Copy built files
  const distDir = path.join(__dirname, 'dist');
  const targetPublicDir = path.join(packageDir, 'public');
  const targetServerDir = path.join(packageDir, 'server');

  // Copy public files
  if (fs.existsSync(path.join(distDir, 'public'))) {
    fs.cpSync(path.join(distDir, 'public'), targetPublicDir, { recursive: true });
  }

  // Copy server files
  if (fs.existsSync(path.join(distDir, 'index.js'))) {
    fs.mkdirSync(targetServerDir, { recursive: true });
    fs.copyFileSync(path.join(distDir, 'index.js'), path.join(targetServerDir, 'index.js'));
  }

  // Step 6: Create package.json for portable app
  const portablePackageJson = {
    "name": "bolt-crypto-flasher-portable",
    "version": "1.0.0",
    "type": "commonjs",
    "main": "server.cjs",
    "scripts": {
      "start": "node server.cjs"
    },
    "dependencies": {
      "express": "^4.18.2"
    }
  };

  fs.writeFileSync(path.join(packageDir, 'package.json'), JSON.stringify(portablePackageJson, null, 2));

  // Step 7: Create README
  const readmeContent = `# Bolt Crypto Flasher - Portable Version

## Quick Start
1. Double-click "start.bat" to launch the application
2. Browser will open automatically to: http://localhost:5000
3. Login with: admin / usdt123

## Features
- Multi-chain cryptocurrency support (BTC, ETH, USDT, BNB)
- Flash transaction processing with 0.019 ETH fees
- Dynamic balance tracking
- Professional interface
- Mobile-responsive design

## Requirements
- Windows 10 or later
- Node.js 16+ (download from nodejs.org if needed)

## Troubleshooting
- If browser doesn't open, manually go to: http://localhost:5000
- Close the console window to stop the server
- Check firewall settings if connection fails

## Flash Fee Payment
All transactions require flash fee payment to:
Tron Address: TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y

---
Bolt Crypto Flasher - Professional Cryptocurrency Platform`;

  fs.writeFileSync(path.join(packageDir, 'README.txt'), readmeContent);

  console.log('✅ Portable package created successfully!\n');
  console.log('📁 Package location:', packageDir);
  console.log('🚀 To run: Double-click "start.bat" in the portable-app folder');
  console.log('🌐 Then open browser to: http://localhost:5000');
  console.log('\n💡 This package can be distributed as a ZIP file');
  console.log('💡 Users just need to extract and run start.bat');

} catch (error) {
  console.error('❌ Package creation failed:', error.message);
  process.exit(1);
}