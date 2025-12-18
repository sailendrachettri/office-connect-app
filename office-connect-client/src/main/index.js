import { app, shell, BrowserWindow, ipcMain, screen } from 'electron'
import { join } from 'path'
import path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'


import Store from 'electron-store';

const store = new Store({
  name: 'office-connect',
  defaults: {
    user: null,
    accessToken: null,
    refreshToken: null
  }
});

ipcMain.handle('store-get', (_, key) => store.get(key));
ipcMain.handle('store-set', (_, key, value) => store.set(key, value));
ipcMain.handle('store-delete', (_, key) => store.delete(key));
ipcMain.handle('store-clear', () => store.clear());

ipcMain.on('window-minimize', () => {
  BrowserWindow.getFocusedWindow().minimize()
})

ipcMain.on('window-maximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  win.isMaximized() ? win.unmaximize() : win.maximize()
})

ipcMain.on('window-close', () => {
  BrowserWindow.getFocusedWindow().close()
})



function createWindow() {
  // Create the browser window.
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const mainWindow = new BrowserWindow({
    icon: path.join(process.cwd(), 'resources', 'icon.ico'),
    autoHideMenuBar: true,
    menuBarVisible: false,
    frame: false,
    titleBarOverlay: false,
    // fullscreen: true,
    width,
    height,
    show: false,
    autoHideMenuBar: true,
    // ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false,
      notifications: true
    }
  })

  if (is.dev) {
  mainWindow.webContents.openDevTools({ mode: 'detach' });
}

  mainWindow.setMenu(null)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  app.commandLine.appendSwitch('enable-font-antialiasing')
  app.commandLine.appendSwitch('enable-color-correct-rendering')
  app.commandLine.appendSwitch('disable-skia-runtime-opts')
  app.commandLine.appendSwitch('enable-gpu-rasterization')
  app.commandLine.appendSwitch('enable-zero-copy')
  app.commandLine.appendSwitch('enable-blink-features', 'ColorEmojiFont')
  app.commandLine.appendSwitch("ignore-certificate-errors");

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS(`
    * {
      font-family: "Segoe UI Emoji", "Noto Color Emoji", "Apple Color Emoji", sans-serif !important;
    }
  `)
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
