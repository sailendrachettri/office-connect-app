const { spawn } = require("child_process");

const electron = spawn("electron-vite", ["dev"], { stdio: "inherit", shell: true });

electron.on("close", () => process.exit());
