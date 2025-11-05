@echo off
:: This script replaces "npm run dist" for building distributions
:: It builds the app and creates installers

echo ===============================================
echo Building Bolt Flasher Distributions
echo ===============================================
echo.

:: First build the React app
echo Building React application...
call npm run build

if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Creating desktop distributions...

:: Run electron-builder
npx electron-builder --config electron-builder.json

echo.
echo ===============================================
echo Build complete! Check dist-electron folder
echo ===============================================
pause