# Building Crypto Gateway Desktop App

This folder contains everything needed to build your desktop application.

## Prerequisites (for building .exe on Windows)
1. Install Node.js (https://nodejs.org/)
2. Install Git (https://git-scm.com/)

## Build Instructions

### On Windows (to create .exe):
```bash
cd electron-ready
npm install
npm run build-win
```

### On macOS (to create .dmg):
```bash
cd electron-ready  
npm install
npm run build-mac
```

### On Linux (to create AppImage):
```bash
cd electron-ready
npm install  
npm run build-linux
```

## Testing in Development
```bash
cd electron-ready
npm install
npm start
```

## Output
After building, your executable will be in:
- Windows: `dist-electron/Crypto Gateway Setup 1.0.0.exe`
- macOS: `dist-electron/Crypto Gateway-1.0.0.dmg`  
- Linux: `dist-electron/Crypto Gateway-1.0.0.AppImage`

## Distribution
The generated installer/executable is standalone and can be distributed to users without requiring them to install anything else.
