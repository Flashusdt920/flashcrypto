# Bolt Flasher Desktop Commands

Since we cannot directly edit package.json, these wrapper scripts provide the same functionality as adding scripts to package.json.

## Available Commands

### Running the Desktop App

**Windows:**
```bash
# Option 1: Use the quick launcher
run-desktop.bat

# Option 2: Use npm-style command
npm-start.bat

# Option 3: Direct command
npx electron electron/integrated-main.js
```

**Mac/Linux:**
```bash
# Option 1: Use npm-style command
./npm-start.sh

# Option 2: Direct command
npx electron electron/integrated-main.js
```

### Building Distributions

**Windows:**
```bash
# Build .exe installer
npm-dist.bat
```

**Mac/Linux:**
```bash
# Build .dmg/.AppImage
./npm-dist.sh
```

## What These Commands Do

1. **npm-start** scripts: Launch the Electron desktop app with the integrated backend
2. **npm-dist** scripts: Build distributable installers for Windows/Mac/Linux
3. **run-desktop.bat**: Windows-only quick launcher with dependency check

## Output Locations

- **Built React app**: `server/public/`
- **Desktop distributions**: `dist-electron/`
- **Logs**: Console output during runtime

## Equivalent package.json Scripts

These wrapper scripts replace what would normally be:
```json
"scripts": {
  "start": "electron electron/integrated-main.js",
  "dist": "electron-builder"
}
```

## Notes

- The integrated version (`electron/integrated-main.js`) runs both frontend and backend in a single process
- Backend runs on port 5000 internally
- All API routes and database connections work within the desktop app
- No separate server process is needed