#!/usr/bin/env node

/**
 * Bolt Crypto Flasher - Rebuild All Distribution Versions
 * This script rebuilds all three distribution formats to keep them in sync
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Rebuilding ALL Bolt Crypto Flasher Distribution Versions...\n');

function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully!\n`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

// Step 1: Build the web application
runCommand('npm run build', 'Building web application');

// Step 2: Create .exe file
runCommand('node create-exe.js', 'Creating standalone .exe file');

// Step 3: Create native desktop app
runCommand('node create-native-app.js', 'Creating native desktop application');

// Step 4: Create portable package
runCommand('node package-desktop.js', 'Creating portable web package');

// Step 5: Compress packages for distribution
console.log('📁 Creating distribution packages...');

try {
  // Create native app package
  if (fs.existsSync('native-app')) {
    execSync('cd native-app && tar -czf ../BoltCryptoFlasher-Native.tar.gz .', { stdio: 'inherit' });
    console.log('✅ Native app package created: BoltCryptoFlasher-Native.tar.gz');
  }

  // Create portable app package  
  if (fs.existsSync('portable-app')) {
    execSync('cd portable-app && tar -czf ../BoltCryptoFlasher-Portable.tar.gz .', { stdio: 'inherit' });
    console.log('✅ Portable app package created: BoltCryptoFlasher-Portable.tar.gz');
  }

  // Show file sizes
  console.log('\n📊 Distribution File Sizes:');
  try {
    const stats = execSync('ls -lah *.exe *.tar.gz 2>/dev/null', { encoding: 'utf8' });
    console.log(stats);
  } catch (e) {
    console.log('Files created but unable to show sizes');
  }

} catch (error) {
  console.error('❌ Package creation failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 ALL DISTRIBUTION VERSIONS REBUILT SUCCESSFULLY!');
console.log('\n📋 Available Formats:');
console.log('1. 🌐 Web Application - Live version (current running)');
console.log('2. 💻 BoltCryptoFlasher.exe - Standalone executable (~39MB)');
console.log('3. 🖥️  BoltCryptoFlasher-Native.tar.gz - Native desktop app (~158MB)');
console.log('4. 📦 BoltCryptoFlasher-Portable.tar.gz - Portable web server (~144KB)');
console.log('\n✨ All versions are now synchronized with your latest changes!');