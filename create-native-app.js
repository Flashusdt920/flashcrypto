import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Creating Native Desktop App (No Browser Required)...\n');

try {
  // Step 1: Build the web application
  console.log('📦 Building web application...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Web application built successfully\n');

  // Step 2: Create native app directory
  const nativeDir = path.join(__dirname, 'native-app');
  if (fs.existsSync(nativeDir)) {
    fs.rmSync(nativeDir, { recursive: true });
  }
  fs.mkdirSync(nativeDir, { recursive: true });

  // Step 3: Create Electron main process
  const electronMainContent = `const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const express = require('express');
const { createServer } = require('http');

let mainWindow;
let server;

// Express server for API endpoints
function createExpressServer() {
  const expressApp = express();
  const PORT = 0; // Use random available port
  
  expressApp.use(express.json());
  expressApp.use(express.static(path.join(__dirname, 'public')));

  // API endpoints
  expressApp.get('/api/subscription-plans', (req, res) => {
    res.json([
      { id: '1', name: 'Basic', price: 550, features: ['BTC', 'ETH'] },
      { id: '2', name: 'Pro', price: 950, features: ['BTC', 'ETH', 'USDT'] },
      { id: '3', name: 'Full', price: 3000, features: ['All Networks', 'Premium Support'] }
    ]);
  });

  expressApp.get('/api/auth/user', (req, res) => {
    res.json({
      id: 'admin',
      username: 'admin',
      hasActiveSubscription: true,
      subscriptionPlan: 'Full'
    });
  });

  expressApp.post('/api/transactions', (req, res) => {
    const { amount, recipient, currency, network } = req.body;
    const transaction = {
      id: Date.now().toString(),
      amount,
      recipient,
      currency,
      network,
      status: 'pending',
      flashFee: '0.019 ETH',
      flashAddress: 'TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y',
      createdAt: new Date().toISOString()
    };
    res.json(transaction);
  });

  const httpServer = createServer(expressApp);
  return new Promise((resolve) => {
    httpServer.listen(PORT, () => {
      const actualPort = httpServer.address().port;
      console.log(\`Server running on port \${actualPort}\`);
      resolve({ server: httpServer, port: actualPort });
    });
  });
}

async function createWindow() {
  // Start the server first
  const { server: expressServer, port } = await createExpressServer();
  server = expressServer;

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    titleBarStyle: 'default',
    show: false
  });

  // Load the app
  await mainWindow.loadURL(\`http://localhost:\${port}\`);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('Bolt Crypto Flasher is ready!');
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (server) {
      server.close();
    }
  });

  // Create application menu
  const template = [
    {
      label: 'Bolt Crypto Flasher',
      submenu: [
        {
          label: 'About Bolt Crypto Flasher',
          click: () => {
            // Show about dialog
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Cleanup on app quit
app.on('before-quit', () => {
  if (server) {
    server.close();
  }
});`;

  fs.writeFileSync(path.join(nativeDir, 'main.js'), electronMainContent);

  // Step 4: Create package.json for native app
  const nativePackageJson = {
    "name": "bolt-crypto-flasher-native",
    "version": "1.0.0",
    "description": "Bolt Crypto Flasher - Native Desktop Application",
    "main": "main.js",
    "author": "Bolt Crypto",
    "license": "MIT",
    "scripts": {
      "start": "electron .",
      "build": "electron-builder",
      "dist": "electron-builder --win"
    },
    "build": {
      "appId": "com.boltcrypto.flasher",
      "productName": "Bolt Crypto Flasher",
      "directories": {
        "output": "dist"
      },
      "files": [
        "main.js",
        "public/**/*",
        "assets/**/*",
        "node_modules/**/*"
      ],
      "win": {
        "target": "nsis",
        "icon": "assets/icon.ico"
      },
      "nsis": {
        "oneClick": false,
        "allowToChangeInstallationDirectory": true,
        "createDesktopShortcut": true,
        "createStartMenuShortcut": true
      }
    },
    "dependencies": {
      "express": "^4.18.2"
    },
    "devDependencies": {
      "electron": "^28.0.0",
      "electron-builder": "^24.0.0"
    }
  };

  fs.writeFileSync(path.join(nativeDir, 'package.json'), JSON.stringify(nativePackageJson, null, 2));

  // Step 5: Copy public files
  const distDir = path.join(__dirname, 'dist');
  const targetPublicDir = path.join(nativeDir, 'public');

  if (fs.existsSync(path.join(distDir, 'public'))) {
    fs.cpSync(path.join(distDir, 'public'), targetPublicDir, { recursive: true });
  }

  // Step 6: Create assets directory and icon
  const assetsDir = path.join(nativeDir, 'assets');
  fs.mkdirSync(assetsDir, { recursive: true });

  // Create a simple icon (you can replace with actual icon files)
  const iconContent = `<svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="boltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#FFA500;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF6B35;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="128" cy="128" r="120" fill="url(#boltGradient)"/>
  <path d="M80 60 L140 60 L120 120 L160 120 L100 196 L120 136 L80 136 Z" fill="white" stroke="#333" stroke-width="2"/>
  <text x="128" y="220" text-anchor="middle" font-family="Arial" font-size="16" fill="#333">BOLT</text>
</svg>`;

  fs.writeFileSync(path.join(assetsDir, 'icon.svg'), iconContent);

  console.log('📦 Installing native app dependencies...');
  process.chdir(nativeDir);
  execSync('npm install', { stdio: 'inherit' });

  // Step 7: Create startup script
  const startupScript = `@echo off
title Bolt Crypto Flasher - Native Desktop App
echo Starting Bolt Crypto Flasher Native Desktop App...
echo.
echo This will open in a native window (no browser required)
echo.
npm start
pause`;

  fs.writeFileSync(path.join(nativeDir, 'start-native.bat'), startupScript);

  // Step 8: Create README
  const readmeContent = `# Bolt Crypto Flasher - Native Desktop App

## What This Is
A TRUE native desktop application that runs in its own window - NO BROWSER REQUIRED!

## Quick Start
1. Double-click "start-native.bat"
2. Application opens in its own desktop window
3. Login with: admin / usdt123
4. Full cryptocurrency flash platform ready to use

## Features
- Native desktop window (not browser-based)
- Professional desktop application feel
- All cryptocurrency features included
- Multi-chain support (BTC, ETH, USDT, BNB)
- Flash fee system with Tron payment
- Admin access with no subscription required

## Requirements
- Windows 10 or later
- Node.js 16+ (download from nodejs.org if needed)

## How It's Different
- Runs as a native desktop app
- No browser tabs or web interface
- Professional desktop application experience
- Looks and feels like installed software

## Installation
No installation required - just run the start script!

---
Bolt Crypto Flasher - Native Desktop Application`;

  fs.writeFileSync(path.join(nativeDir, 'README.txt'), readmeContent);

  console.log('\n✅ Native desktop app created successfully!');
  console.log('📁 Location: native-app/');
  console.log('🚀 To run: Double-click "start-native.bat" in the native-app folder');
  console.log('🖥️  This opens as a NATIVE DESKTOP WINDOW - no browser needed!');
  console.log('\n💡 This provides a true desktop application experience');

} catch (error) {
  console.error('❌ Native app creation failed:', error.message);
  process.exit(1);
}