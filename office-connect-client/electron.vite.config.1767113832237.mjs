// electron.vite.config.mjs
import { resolve } from "path";
import { defineConfig } from "electron-vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
var electron_vite_config_default = defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src")
      }
    },
    plugins: [react(), tailwindcss()]
  },
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.1.50:5171",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
export {
  electron_vite_config_default as default
};
