const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { Client, Bulb } = require("tplink-smarthome-api");
const client = new Client();
const LightManager = require("./LightManger");
let lightManager = new LightManager(client);

let win;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

  switch (args) {
    case "discover":
      await lightManager.startSearchingAndAddBulbs();
      await sleep(4000);
      await lightManager.stopSearching();
      win.webContents.send("fromMain", "Done Searching");
      break;
    case "onOff":
      await lightManager.toggleRoomLights();
      win.webContents.send("fromMain", "toggle");
      break;
    case "on":
      await lightManager.turnOnRoomLights();
      win.webContents.send("fromMain", "on");
      break;
    case "off":
      await lightManager.turnOffRoomLights();
      win.webContents.send("fromMain", "off");
      break;
    default:
      break;
  }
});
