const path = require("path");
const { app, Tray, Menu, BrowserWindow, ipcMain, nativeImage } = require("electron");
const configStore = require("./configStore");
const ObsBridge = require("./obsBridge");

const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
  process.exit(0);
}

const bridge = new ObsBridge();
let tray = null;
let settingsWindow = null;
let latestStatus = { socketConnected: false, obsConnected: false, streaming: false };
let lastLog = "";

function assetPath(file) {
  return path.join(__dirname, "assets", file);
}

function trayIcon() {
  const file = latestStatus.socketConnected ? "tray-connected.png" : "tray-disconnected.png";
  return nativeImage.createFromPath(assetPath(file));
}

function statusLabel() {
  if (!latestStatus.socketConnected) return "Agent OBS — déconnecté du site";
  if (!latestStatus.obsConnected) return "Agent OBS — connecté au site, OBS non détecté";
  return latestStatus.streaming ? "Agent OBS — en direct" : "Agent OBS — prêt";
}

function refreshTray() {
  if (!tray) return;
  tray.setImage(trayIcon());
  tray.setToolTip(statusLabel());
  tray.setContextMenu(buildMenu());
}

function buildMenu() {
  return Menu.buildFromTemplate([
    { label: statusLabel(), enabled: false },
    { type: "separator" },
    { label: "Ouvrir les paramètres", click: () => openSettingsWindow() },
    { type: "separator" },
    { label: "Quitter", click: () => { app.isQuitting = true; app.quit(); } },
  ]);
}

function openSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.show();
    settingsWindow.focus();
    return;
  }
  settingsWindow = new BrowserWindow({
    width: 460,
    height: 420,
    resizable: false,
    icon: assetPath("app-icon.png"),
    title: "Agent OBS - Paramètres",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  settingsWindow.setMenuBarVisibility(false);
  settingsWindow.loadFile(path.join(__dirname, "renderer", "settings.html"));
  settingsWindow.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      settingsWindow.hide();
    }
  });
  settingsWindow.on("closed", () => { settingsWindow = null; });
}

function startBridgeFromConfig() {
  const config = configStore.load(app);
  if (config.backendUrl && config.token) {
    bridge.start({ backendUrl: config.backendUrl, token: config.token });
  }
}

app.whenReady().then(() => {
  tray = new Tray(trayIcon());
  tray.setToolTip(statusLabel());
  tray.setContextMenu(buildMenu());
  tray.on("double-click", () => openSettingsWindow());

  bridge.on("status", (status) => {
    latestStatus = status;
    refreshTray();
    if (settingsWindow) settingsWindow.webContents.send("status", { ...status, lastLog });
  });
  bridge.on("log", (message) => {
    lastLog = message;
    if (settingsWindow) settingsWindow.webContents.send("status", { ...latestStatus, lastLog });
  });

  const config = configStore.load(app);
  if (!config.backendUrl || !config.token) {
    openSettingsWindow();
  } else {
    startBridgeFromConfig();
  }
});

app.on("window-all-closed", (event) => {
  // Tray app: stay resident even with no windows open.
  event?.preventDefault?.();
});

app.on("before-quit", () => { app.isQuitting = true; });

ipcMain.handle("get-config", () => {
  const config = configStore.load(app);
  return {
    backendUrl: config.backendUrl || "",
    token: config.token || "",
    launchAtStartup: config.launchAtStartup !== false,
  };
});

ipcMain.handle("get-status", () => ({ ...latestStatus, lastLog }));

ipcMain.handle("save-config", (_event, { backendUrl, token, launchAtStartup }) => {
  const config = { backendUrl: backendUrl.trim(), token: token.trim(), launchAtStartup: !!launchAtStartup };
  configStore.save(app, config);
  app.setLoginItemSettings({ openAtLogin: config.launchAtStartup });
  bridge.start({ backendUrl: config.backendUrl, token: config.token });
  return { ok: true };
});
