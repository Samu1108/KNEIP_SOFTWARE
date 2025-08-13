const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;

// Controllo se siamo in sviluppo
const isDev = process.env.NODE_ENV !== 'production';

// Funzione per ottenere il percorso corretto della cartella /app
function getAppPath() {
  return isDev
    ? path.join(__dirname, 'app')          // in sviluppo
    : path.join(process.resourcesPath, 'app'); // dopo il build
}

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,    // ora possiamo accedere direttamente alle API Node
      contextIsolation: false   // disattivato isolamento
    }
  });

  // Carica la pagina iniziale (check.html)
  win.loadFile(path.join(__dirname, 'check.html'));
}

// Evento per aprire l'app principale
ipcMain.on('open-app', () => {
  win.loadFile(path.join(getAppPath(), 'index.html'));
});

// Creazione finestra all'avvio dell'app
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Chiudi l'app quando tutte le finestre sono chiuse
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
