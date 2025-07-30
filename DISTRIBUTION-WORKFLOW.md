# Bolt Crypto Flasher Distribution Workflow

## Important: Always Update All Versions

When making ANY changes to the Bolt Crypto Flasher application, you MUST rebuild all distribution versions to keep them synchronized.

## Quick Rebuild Command

```bash
node rebuild-all-versions.js
```

This single command will:
1. Build the web application
2. Create the .exe file  
3. Build the native desktop app
4. Package the portable version
5. Compress all packages for distribution

## Manual Steps (if needed)

```bash
# 1. Build web application
npm run build

# 2. Create standalone .exe
node create-exe.js

# 3. Create native desktop app  
node create-native-app.js

# 4. Create portable package
node package-desktop.js

# 5. Compress packages
cd native-app && tar -czf ../BoltCryptoFlasher-Native.tar.gz .
cd ../portable-app && tar -czf ../BoltCryptoFlasher-Portable.tar.gz .
```

## Distribution Files

After rebuilding, you'll have:

- **BoltCryptoFlasher.exe** (39MB) - Standalone executable
- **BoltCryptoFlasher-Native.tar.gz** (158MB) - Native desktop app
- **BoltCryptoFlasher-Portable.tar.gz** (144KB) - Portable web server
- **Web Application** - Live version (current running)

## User Requirements

- **Always apply changes to all distribution versions**
- Run `node rebuild-all-versions.js` after ANY code changes
- All versions must stay synchronized with the same features and fixes