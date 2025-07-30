const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const express = require('express');
const { createServer } = require('http');

let mainWindow;
let server;

// Express server for API endpoints
function createExpressServer() {
  const expressApp = express();
  const PORT = 0; // Use random available port
  
  expressApp.use(express.json());
  expressApp.use(express.static(path.join(__dirname, 'public')));

  // API endpoints
  expressApp.get('/api/subscription-plans', (req, res) => {
    res.json([
      { id: '1', name: 'Basic', price: 550, features: ['BTC', 'ETH'] },
      { id: '2', name: 'Pro', price: 950, features: ['BTC', 'ETH', 'USDT'] },
      { id: '3', name: 'Full', price: 3000, features: ['All Networks', 'Premium Support'] }
    ]);
  });

  expressApp.get('/api/auth/user', (req, res) => {
    res.json({
      id: 'admin',
      username: 'admin',
      hasActiveSubscription: true,
      subscriptionPlan: 'Full'
    });
  });

  expressApp.post('/api/transactions', (req, res) => {
    const { amount, recipient, currency, network } = req.body;
    const transaction = {
      id: Date.now().toString(),
      amount,
      recipient,
      currency,
      network,
      status: 'pending',
      flashFee: '0.019 ETH',
      flashAddress: 'TQm8yS3XZHgXiHMtMWbrQwwmLCztyvAG8y',
      createdAt: new Date().toISOString()
    };
    res.json(transaction);
  });

  const httpServer = createServer(expressApp);
  return new Promise((resolve) => {
    httpServer.listen(PORT, () => {
      const actualPort = httpServer.address().port;
      console.log(`Server running on port ${actualPort}`);
      resolve({ server: httpServer, port: actualPort });
    });
  });
}

async function createWindow() {
  // Start the server first
  const { server: expressServer, port } = await createExpressServer();
  server = expressServer;

  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    titleBarStyle: 'default',
    show: false
  });

  // Load the app
  await mainWindow.loadURL(`http://localhost:${port}`);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    console.log('Bolt Crypto Flasher is ready!');
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    if (server) {
      server.close();
    }
  });

  // Create application menu
  const template = [
    {
      label: 'Bolt Crypto Flasher',
      submenu: [
        {
          label: 'About Bolt Crypto Flasher',
          click: () => {
            // Show about dialog
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Cleanup on app quit
app.on('before-quit', () => {
  if (server) {
    server.close();
  }
});