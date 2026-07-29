const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("agentObs", {
  getConfig: () => ipcRenderer.invoke("get-config"),
  saveConfig: (config) => ipcRenderer.invoke("save-config", config),
  getStatus: () => ipcRenderer.invoke("get-status"),
  onStatus: (callback) => {
    const listener = (_event, status) => callback(status);
    ipcRenderer.on("status", listener);
    return () => ipcRenderer.removeListener("status", listener);
  },
});
