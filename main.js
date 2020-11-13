// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
let mainWindow, splash

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 960,
    height: 720,
    titleBarStyle: 'hidden',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      webSecurity: false
    }
  })

  splash = new BrowserWindow({width: 200, height: 200, transparent: true, frame: false, alwaysOnTop: true});
  splash.loadURL(`file://${__dirname}/splash.html`);
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // if main window is ready to show, then destroy the splash window and show up the main window
  async function closeSplash() {
    //await sleep(3000);
    splash.destroy();
    mainWindow.show();
  };

  mainWindow.once('ready-to-show', () => {
    closeSplash();
  });

  // Open the DevTools.
  mainWindow.removeMenu()
  //mainWindow.webContents.openDevTools();

  // Set flag on close
  mainWindow.on('closed', function () {
    appClosed = true;
  });
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}