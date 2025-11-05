@echo off
echo ========================================
echo Starting Bolt Flasher Desktop Application
echo ========================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b
)

:: Check if Electron is installed
if not exist node_modules\electron (
    echo Installing Electron...
    npm install electron electron-is-dev
)

:: Build the app if not built
if not exist server\public (
    echo Building application...
    npm run build
)

:: Start the Electron app
echo Launching Bolt Flasher...
npx electron electron/main.js

pause