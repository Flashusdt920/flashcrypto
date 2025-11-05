const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const isDev = require('electron-is-dev');

let mainWindow;
let serverProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, '..', 'client', 'public', 'bolt-logo-256.png'),
    titleBarStyle: 'default',
    show: false,
    title: 'Bolt Flasher - Professional Cryptocurrency Flash Platform',
    backgroundColor: '#1a1a1a'
  });

  // Set custom menu
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Home',
          click: () => mainWindow.loadURL('http://localhost:5000/home')
        },
        {
          label: 'Dashboard',
          click: () => mainWindow.loadURL('http://localhost:5000/dashboard')
        },
        { type: 'separator' },
        {
          label: 'Exit',
          click: () => app.quit()
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Support',
          click: () => shell.openExternal('https://t.me/Henryphilipbolt')
        },
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Bolt Flasher',
              message: 'Bolt Flasher',
              detail: 'Version 1.0.0\n\nProfessional Cryptocurrency Flash Platform\n\n© 2025 Bolt Flasher. All rights reserved.',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ]);

  Menu.setApplicationMenu(menu);

  // Start the Express server
  startServer();

  // Load the app after a short delay to ensure server is ready
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:5000/home');
  }, 3000);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startServer() {
  const serverPath = isDev 
    ? path.join(__dirname, '..', 'server', 'index.ts')
    : path.join(__dirname, '..', 'dist', 'index.js');
  
  const command = isDev ? 'tsx' : 'node';
  
  serverProcess = spawn(command, [serverPath], {
    cwd: path.join(__dirname, '..'),
    env: { 
      ...process.env, 
      NODE_ENV: isDev ? 'development' : 'production',
      PORT: '5000'
    }
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`Server: ${data}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`Server Error: ${data}`);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (serverProcess) {
    serverProcess.kill();
  }
});