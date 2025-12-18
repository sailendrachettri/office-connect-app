export const showSystemNotification = (message) => {
    if (document.hasFocus()) return
 
  if (Notification.permission !== 'granted') {
    Notification.requestPermission()
  }

 
  new Notification('New Message', {
    body: message.messageText || 'You received a new message',
    silent: false
  })
}
