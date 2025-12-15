import * as signalR from "@microsoft/signalr";

export const createChatConnection = (userId) => {
  return new signalR.HubConnectionBuilder()
    .withUrl(`https://localhost:44303/hubs/chat?userId=${userId}`, {
        withCredentials: true
    })
    .withAutomaticReconnect()
    .build();
};
