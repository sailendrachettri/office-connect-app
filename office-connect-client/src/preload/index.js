
import { contextBridge, ipcRenderer } from 'electron'


contextBridge.exposeInMainWorld('electron', {
  notifyNewMessage: () => ipcRenderer.send('new-message'),
  clearUnread: () => ipcRenderer.send('clear-unread')
})

contextBridge.exposeInMainWorld("api", {
  minimize: () => ipcRenderer.send("window-minimize"),
  maximize: () => ipcRenderer.send("window-maximize"),
  close: () => ipcRenderer.send("window-close"),
});

contextBridge.exposeInMainWorld('store', {
  get: (key) => ipcRenderer.invoke('store-get', key),
  set: (key, value) => ipcRenderer.invoke('store-set', key, value),
  delete: (key) => ipcRenderer.invoke('store-delete', key),
  clear: () => ipcRenderer.invoke('store-clear'),
});
 