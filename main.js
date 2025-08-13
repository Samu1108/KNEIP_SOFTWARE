// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Migliora la compatibilità su Raspberry Pi (evita errori GBM/GL)
app.disableHardwareAcceleration();
// Abilita esplicitamente gli eventi touch (utile su alcuni display)
app.commandLine.appendSwitch('touch-events', 'enabled');

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#111111',
    show: false,             // mostriamo la finestra solo quando è pronta
    autoHideMenuBar: true,   // nasconde la menubar
    webPreferences: {
      // La tua /app usa solo HTML/CSS/JS “puro”, quindi niente Node nel renderer
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.once('ready-to-show', () => win.show());
  win.loadFile(path.join(__dirname, 'app', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // Su macOS riapri una finestra se l'app è attiva e non ce ne sono
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Su Linux/Windows chiudi l’app quando tutte le finestre sono chiuse
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
