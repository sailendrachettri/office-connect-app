import * as signalR from "@microsoft/signalr";

export const createChatConnection = (userId) => {
  return new signalR.HubConnectionBuilder()
    .withUrl(`http://192.168.1.3:5171/hubs/chat?userId=${userId}`, {
        withCredentials: true
    })
    .withAutomaticReconnect()
    .build();
};
