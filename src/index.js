const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { Client, Bulb } = require("tplink-smarthome-api");
const client = new Client();
const LightManager = require("./LightManger");

let win;

const createWindow = async () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js"), // use a preload script
    },
  });

  win.removeMenu();
  win.loadFile("src/index.html");
  win.webContents.openDevTools();
};

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.on("toMain", async (event, args) => {
  // Send result back to renderer process
  win.webContents.send("fromMain", args);

  let lightManager = new LightManager(client);
  await lightManager.toggleRoomLights();
});
