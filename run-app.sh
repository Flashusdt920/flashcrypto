#!/bin/bash

echo "========================================"
echo "Starting Bolt Flasher Desktop Application"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

# Check if Electron is installed
if [ ! -d "node_modules/electron" ]; then
    echo "Installing Electron..."
    npm install electron electron-is-dev
fi

# Build the app if not built
if [ ! -d "server/public" ]; then
    echo "Building application..."
    npm run build
fi

# Start the Electron app
echo "Launching Bolt Flasher..."
npx electron electron/main.js