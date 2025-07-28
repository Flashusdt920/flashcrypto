#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('📦 Preparing Electron package for Windows build...\n');

try {
  // Step 1: Build the web application
  console.log('🔨 Building web application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Step 2: Create electron package directory
  const electronDir = path.join(__dirname, 'electron-ready');
  if (fs.existsSync(electronDir)) {
    fs.rmSync(electronDir, { recursive: true });
  }
  fs.mkdirSync(electronDir, { recursive: true });

  // Step 3: Copy necessary files
  console.log('📁 Copying application files...');
  
  // Copy dist folder
  if (fs.existsSync('dist')) {
    execSync(`cp -r dist electron-ready/`, { stdio: 'inherit' });
  }

  // Copy electron files
  execSync(`cp -r electron electron-ready/`, { stdio: 'inherit' });

  // Create package.json for the electron app
  const packageJson = {
    "name": "crypto-gateway",
    "version": "1.0.0",
    "description": "Professional Multi-Chain Crypto Wallet Platform",
    "main": "electron/main.js",
    "author": "Crypto Gateway",
    "license": "MIT",
    "scripts": {
      "start": "electron .",
      "build-win": "electron-builder --win",
      "build-mac": "electron-builder --mac",
      "build-linux": "electron-builder --linux"
    },
    "devDependencies": {
      "electron": "^37.2.4",
      "electron-builder": "^26.0.12"
    },
    "dependencies": {
      "@neondatabase/serverless": "^0.10.4",
      "drizzle-orm": "^0.39.1",
      "express": "^4.19.2",
      "zod": "^3.23.8"
    },
    "build": {
      "appId": "com.cryptogateway.app",
      "productName": "Crypto Gateway",
      "directories": {
        "output": "dist-electron"
      },
      "files": [
        "dist/**/*",
        "electron/**/*",
        "node_modules/**/*"
      ],
      "win": {
        "target": "nsis",
        "icon": "electron/assets/icon.ico"
      },
      "nsis": {
        "oneClick": false,
        "allowElevation": true,
        "allowToChangeInstallationDirectory": true,
        "createDesktopShortcut": true,
        "createStartMenuShortcut": true
      },
      "mac": {
        "target": "dmg"
      },
      "linux": {
        "target": "AppImage"
      }
    }
  };

  fs.writeFileSync(
    path.join(electronDir, 'package.json'), 
    JSON.stringify(packageJson, null, 2)
  );

  // Step 4: Create build instructions
  const buildInstructions = `# Building Crypto Gateway Desktop App

This folder contains everything needed to build your desktop application.

## Prerequisites (for building .exe on Windows)
1. Install Node.js (https://nodejs.org/)
2. Install Git (https://git-scm.com/)

## Build Instructions

### On Windows (to create .exe):
\`\`\`bash
cd electron-ready
npm install
npm run build-win
\`\`\`

### On macOS (to create .dmg):
\`\`\`bash
cd electron-ready  
npm install
npm run build-mac
\`\`\`

### On Linux (to create AppImage):
\`\`\`bash
cd electron-ready
npm install  
npm run build-linux
\`\`\`

## Testing in Development
\`\`\`bash
cd electron-ready
npm install
npm start
\`\`\`

## Output
After building, your executable will be in:
- Windows: \`dist-electron/Crypto Gateway Setup 1.0.0.exe\`
- macOS: \`dist-electron/Crypto Gateway-1.0.0.dmg\`  
- Linux: \`dist-electron/Crypto Gateway-1.0.0.AppImage\`

## Distribution
The generated installer/executable is standalone and can be distributed to users without requiring them to install anything else.
`;

  fs.writeFileSync(path.join(electronDir, 'BUILD-INSTRUCTIONS.md'), buildInstructions);

  console.log('\n✅ Electron package prepared successfully!');
  console.log('📁 Package location: electron-ready/');
  console.log('📋 Next steps:');
  console.log('   1. Download the electron-ready folder');
  console.log('   2. Run on a Windows machine: cd electron-ready && npm install && npm run build-win');
  console.log('   3. Find your .exe in the dist-electron folder');

} catch (error) {
  console.error('❌ Packaging failed:', error.message);
  process.exit(1);
}