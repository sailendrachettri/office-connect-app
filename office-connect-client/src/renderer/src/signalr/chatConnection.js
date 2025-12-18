import * as signalR from '@microsoft/signalr'
import { setConnected, setDisconnected } from '../store/connectionSlice'

export const createChatConnection = (userId) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(`http://192.168.1.50:5171/hubs/chat?userId=${userId}`, {
      withCredentials: true
    })
    .withAutomaticReconnect()
    .build()

  connection.onreconnecting(() => {
    store.dispatch(setDisconnected())
  })

  connection.onreconnected(() => {
    store.dispatch(setConnected('signalr'))
  })
  

  connection.onclose(() => {
    store.dispatch(setDisconnected())
  })

  return connection
}
