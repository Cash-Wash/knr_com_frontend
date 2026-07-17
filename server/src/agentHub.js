const { EventEmitter } = require("events");
const settingsStore = require("./settingsStore");

const events = new EventEmitter();

let agentSocket = null;
let obsStatus = { obsConnected: false, streaming: false };
let lastHeartbeatAt = null;

function registerAgentNamespace(io) {
  const nsp = io.of("/agent");

  nsp.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    const expected = settingsStore.getAgentObsToken();
    if (token && expected && token === expected) {
      return next();
    }
    next(new Error("unauthorized"));
  });

  nsp.on("connection", (socket) => {
    agentSocket = socket;
    lastHeartbeatAt = new Date();
    io.emit("agent:status", { online: true });
    socket.emit("agent:config", {
      obsWsPort: settingsStore.getObsWsPort(),
      obsWsPassword: settingsStore.getObsWsPassword(),
    });

    socket.on("agent:obs_status", (status) => {
      obsStatus = {
        obsConnected: !!status?.obsConnected,
        streaming: !!status?.streaming,
      };
      lastHeartbeatAt = new Date();
    });

    socket.on("stream:ended_externally", ({ liveId } = {}) => {
      if (liveId) {
        events.emit("ended_externally", { liveId });
      }
    });

    socket.on("disconnect", () => {
      if (agentSocket === socket) {
        agentSocket = null;
        obsStatus = { obsConnected: false, streaming: false };
      }
      io.emit("agent:status", { online: false });
    });
  });

  return nsp;
}

function onExternalStreamEnded(handler) {
  events.on("ended_externally", handler);
}

function isAgentOnline() {
  return !!agentSocket;
}

function pushConfigToAgent() {
  if (!agentSocket) return;
  agentSocket.emit("agent:config", {
    obsWsPort: settingsStore.getObsWsPort(),
    obsWsPassword: settingsStore.getObsWsPassword(),
  });
}

function getAgentStatus() {
  return {
    online: isAgentOnline(),
    obsConnected: obsStatus.obsConnected,
    streaming: obsStatus.streaming,
    lastHeartbeatAt: lastHeartbeatAt ? lastHeartbeatAt.toISOString() : null,
  };
}

function sendCommand(event, payload, timeoutMs = 20000) {
  if (!agentSocket) {
    return Promise.reject(new Error("AGENT_OFFLINE"));
  }

  return new Promise((resolve, reject) => {
    agentSocket
      .timeout(timeoutMs)
      .emit(event, payload, (err, response) => {
        if (err) {
          return reject(new Error("Agent OBS n'a pas répondu à temps."));
        }
        if (!response?.ok) {
          return reject(new Error(response?.error || "Échec de la commande OBS."));
        }
        resolve(response);
      });
  });
}

module.exports = {
  registerAgentNamespace,
  onExternalStreamEnded,
  isAgentOnline,
  getAgentStatus,
  pushConfigToAgent,
  startStream: (liveId) => sendCommand("cmd:start_stream", { liveId }),
  stopStream: (liveId) => sendCommand("cmd:stop_stream", { liveId }),
};
