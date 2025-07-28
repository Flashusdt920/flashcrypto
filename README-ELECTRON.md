# Crypto Gateway Desktop Application

Your React web application has been converted into a desktop Electron app that can be packaged as a .exe file.

## What Was Added

1. **Electron Main Process** (`electron/main.js`) - Controls the desktop window and application lifecycle
2. **Electron Preload Script** (`electron/preload.js`) - Handles secure communication between processes
3. **Build Configuration** (`electron.config.json`) - Configures how the app gets packaged
4. **Build Script** (`build-electron.js`) - Automated script to create the .exe file

## How It Works

The Electron app:
- Wraps your existing React web application in a desktop window
- Automatically starts the Express server when the app launches
- Provides a native desktop experience with menus and shortcuts
- Can be distributed as a standalone .exe file

## Building the Desktop App

### Development Mode
To test the desktop app while developing:
```bash
# Start the web server first
npm run dev

# In another terminal, start the Electron app
npx electron electron/main.js
```

### Production Build
To create a distributable .exe file:
```bash
# Run the automated build script
node build-electron.js
```

This will:
1. Build your web application (`npm run build`)
2. Package everything for Electron
3. Create a Windows installer (.exe) in the `dist-electron/` folder

## Distribution

After building, you'll find:
- **Installer**: `dist-electron/Crypto Gateway Setup 1.0.0.exe` - Distributable installer
- **Unpacked**: `dist-electron/win-unpacked/` - Portable version

## Features

The desktop app includes:
- Professional desktop window with custom icon
- System menu integration
- Auto-updater support (can be configured)
- Security hardening for desktop environment
- Embedded Express server (no need for separate installation)

## Requirements

Users who install your .exe file will need:
- Windows 10 or later
- No additional software (everything is bundled)

## Security

The Electron app follows security best practices:
- Context isolation enabled
- Node integration disabled in renderer
- External links open in default browser
- Secure communication between processes

Your crypto wallet application is now ready for desktop distribution!