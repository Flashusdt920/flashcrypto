#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Building Crypto Gateway Desktop Application...\n');

try {
  // Step 1: Build the web application
  console.log('📦 Building web application...');
  execSync('npm run build', { stdio: 'inherit' });

  // Step 2: Create electron package directory
  const electronDir = path.join(__dirname, 'electron-package');
  if (fs.existsSync(electronDir)) {
    fs.rmSync(electronDir, { recursive: true });
  }
  fs.mkdirSync(electronDir, { recursive: true });

  // Step 3: Copy necessary files
  console.log('📁 Copying files for packaging...');
  
  // Copy dist folder
  if (fs.existsSync('dist')) {
    execSync(`cp -r dist electron-package/`, { stdio: 'inherit' });
  }

  // Copy electron files
  execSync(`cp -r electron electron-package/`, { stdio: 'inherit' });

  // Copy package.json with minimal dependencies
  const packageJson = {
    "name": "crypto-gateway",
    "version": "1.0.0",
    "description": "Professional Multi-Chain Crypto Wallet Platform",
    "main": "electron/main.js",
    "author": "Crypto Gateway",
    "license": "MIT",
    "homepage": "./",
    "build": {
      "appId": "com.cryptogateway.app",
      "productName": "Crypto Gateway",
      "directories": {
        "output": "../dist-electron"
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
      }
    }
  };

  fs.writeFileSync(
    path.join(electronDir, 'package.json'), 
    JSON.stringify(packageJson, null, 2)
  );

  // Step 4: Install production dependencies in electron package
  console.log('📦 Installing production dependencies...');
  process.chdir(electronDir);
  execSync('npm install electron electron-builder --save-dev', { stdio: 'inherit' });

  // Copy required production dependencies
  const productionDeps = [
    '@neondatabase/serverless',
    'drizzle-orm',
    'express',
    'zod'
  ];

  console.log('📦 Installing runtime dependencies...');
  execSync(`npm install ${productionDeps.join(' ')} --save`, { stdio: 'inherit' });

  // Step 5: Build the executable
  console.log('⚡ Building executable...');
  execSync('npx electron-builder --win', { stdio: 'inherit' });

  console.log('\n✅ Build completed successfully!');
  console.log('📁 Executable can be found in: dist-electron/');
  console.log('🎉 Your Crypto Gateway desktop app is ready!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}