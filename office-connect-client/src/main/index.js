import { app, shell, BrowserWindow, ipcMain, screen, nativeImage } from 'electron'
import { join } from 'path'
import path from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import Store from 'electron-store'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'

let mainWindow
let isBackground = false
let hasUnread = false

autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

// optional but recommended
autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = true

if (is.dev) {
  autoUpdater.forceDevUpdateConfig = true
}

const store = new Store({
  name: 'office-connect',
  defaults: {
    user: null,
    accessToken: null,
    refreshToken: null
  }
})

function clearAttention() {
  hasUnread = false
  updateUnreadDot()

  if (process.platform === 'win32' && mainWindow) {
    mainWindow.flashFrame(false)
  }

  setTimeout(() => {
    if (mainWindow) mainWindow.flashFrame(false)
  }, 3000)
}

ipcMain.on('new-message', () => {
  hasUnread = true
  updateUnreadDot()
  if (process.platform === 'win32' && mainWindow && isBackground) {
    mainWindow.flashFrame(true)
  }
})

ipcMain.on('clear-unread', () => {
  hasUnread = false
  updateUnreadDot()
})

function updateUnreadDot() {
  if (!mainWindow) return

  if (hasUnread && isBackground) {
    const iconPath = is.dev
      ? path.join(process.cwd(), 'resources', 'red_dot.png')
      : path.join(process.resourcesPath, 'resources', 'red_dot.png')

    const dotIcon = nativeImage.createFromPath(iconPath)

    if (!dotIcon.isEmpty()) {
      mainWindow.setOverlayIcon(dotIcon, 'Unread messages')
    }
  } else {
    mainWindow.setOverlayIcon(null, '')
  }
}

ipcMain.handle('store-get', (_, key) => store.get(key))
ipcMain.handle('store-set', (_, key, value) => store.set(key, value))
ipcMain.handle('store-delete', (_, key) => store.delete(key))
ipcMain.handle('store-clear', () => store.clear())

ipcMain.on('window-minimize', () => {
  BrowserWindow.getFocusedWindow()?.minimize()
})

ipcMain.on('window-maximize', () => {
  const win = BrowserWindow.getFocusedWindow()
  if (!win) return

  win.setFullScreen(!win.isFullScreen())
})

ipcMain.on('window-close', () => {
  BrowserWindow.getFocusedWindow()?.close()
})

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  mainWindow = new BrowserWindow({
    icon: path.join(process.cwd(), 'resources', 'icon.ico'),
    width: 1200,
    height: 800,
    show: false,

    frame: false, // custom titlebar
    autoHideMenuBar: true,
    fullscreenable: true, // REQUIRED
    maximizable: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false,
      notifications: true,
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  if (is.dev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  }

  mainWindow.setMenu(null)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('minimize', () => {
    isBackground = true
  })

  mainWindow.on('blur', () => {
    isBackground = true
  })

  mainWindow.on('restore', () => {
    isBackground = false
    hasUnread = false
    updateUnreadDot()
    clearAttention();
  })

  mainWindow.on('focus', () => {
    isBackground = false
    hasUnread = false
    updateUnreadDot();
    clearAttention()
  })

  mainWindow.on('show', clearAttention)

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  app.commandLine.appendSwitch('enable-font-antialiasing')
  app.commandLine.appendSwitch('enable-color-correct-rendering')
  app.commandLine.appendSwitch('disable-skia-runtime-opts')
  app.commandLine.appendSwitch('enable-gpu-rasterization')
  app.commandLine.appendSwitch('enable-zero-copy')
  app.commandLine.appendSwitch('enable-blink-features', 'ColorEmojiFont')
  app.commandLine.appendSwitch('ignore-certificate-errors')

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.insertCSS(`
    * {
      font-family: "Segoe UI Emoji", "Noto Color Emoji", "Apple Color Emoji", sans-serif !important;
    }
  `)
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.on('install-update', () => {
  if (autoUpdater.isDownloading) return
  autoUpdater.quitAndInstall()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  electronApp.setAppUserModelId('office.connect')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  setTimeout(() => {
    autoUpdater.checkForUpdatesAndNotify()
  }, 3000)

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

ipcMain.handle('check-for-update', async () => {
  return autoUpdater.checkForUpdatesAndNotify()
})
ipcMain.on('check-update', () => {
  autoUpdater.checkForUpdatesAndNotify()
})

autoUpdater.on('update-available', () => {
  mainWindow?.webContents.send('update-available')
})

autoUpdater.on('update-not-available', () => {
  mainWindow?.webContents.send('update-not-available')
})

autoUpdater.on('error', (err) => {
  mainWindow?.webContents.send('update-error', err.message)
})

autoUpdater.on('download-progress', (progress) => {
  mainWindow?.webContents.send('update-progress', progress)
})

autoUpdater.on('update-downloaded', () => {
  mainWindow?.webContents.send('update-downloaded')
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
