export const showSystemNotification = (message) => {
    if (document.hasFocus()) return
  // Ask permission once (safe to call multiple times)
  if (Notification.permission !== 'granted') {
    Notification.requestPermission()
  }

  // Show notification
  new Notification('New Message', {
    body: message.messageText || 'You received a new message',
    silent: false // 🔔 plays OS notification sound
  })
}
