// src/store/electron-store.js
import Store from "electron-store";

const schema = {
  user: {
    type: "object",
    properties: {
      userId: { type: "string" },
      fullName: { type: "string" },
      email: { type: "string" },
      profileImage: { type: ["string", "null"] },
    },
    default: {}
  },
  accessToken: { type: "string", default: "" },
  refreshToken: { type: "string", default: "" }
};

const store = new Store({ schema });

// User
export const setUserId = (user_id) => store.set("userId", user_id);
export const getUserId = () => store.get("userId");
export const removeUser = () => store.delete("userId");

// Access Token
export const setAccessToken = (token) => store.set("accessToken", token);
export const getAccessToken = () => store.get("accessToken");
export const removeAccessToken = () => store.delete("accessToken");

// Refresh Token
export const setRefreshToken = (token) => store.set("refreshToken", token);
export const getRefreshToken = () => store.get("refreshToken");
export const removeRefreshToken = () => store.delete("refreshToken");

// Clear all (logout)
export const clearAll = () => store.clear();

export default store;
