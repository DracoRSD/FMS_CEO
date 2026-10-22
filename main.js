// FMS CEO · versión de escritorio (Electron)
const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');

function create(){
  const win = new BrowserWindow({
    width: 1366, height: 860, minWidth: 900, minHeight: 600,
    backgroundColor: '#0a0a0f', title: 'FMS CEO',
    icon: path.join(__dirname, 'build', 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true }
  });
  Menu.setApplicationMenu(null);
  // los enlaces externos (perfil de X) se abren en el navegador normal
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (/^https?:/.test(url)) { e.preventDefault(); shell.openExternal(url); } });
  win.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(create);
app.on('window-all-closed', () => app.quit());
