import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  notifyNewMessage: () => ipcRenderer.send('new-message'),
  clearUnread: () => ipcRenderer.send('clear-unread'),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),

  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),

  onUpdateProgress: (callback) =>
    ipcRenderer.on('update-progress', (_, progress) => callback(progress)),

  installUpdate: () => ipcRenderer.send('install-update'),
  checkForUpdate: () => ipcRenderer.invoke('check-for-update')
})

contextBridge.exposeInMainWorld('api', {
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close')
})

contextBridge.exposeInMainWorld('store', {
  get: (key) => ipcRenderer.invoke('store-get', key),
  set: (key, value) => ipcRenderer.invoke('store-set', key, value),
  delete: (key) => ipcRenderer.invoke('store-delete', key),
  clear: () => ipcRenderer.invoke('store-clear')
})
