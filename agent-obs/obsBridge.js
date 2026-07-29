// Core Agent OBS logic: connects to the KNR backend over Socket.IO and
// bridges start/stop commands to OBS Studio via obs-websocket. Adapted from
// the original standalone index.js so it can run inside the Electron main
// process and report live status to the tray/settings window.
const { EventEmitter } = require("events");
const { io } = require("socket.io-client");
const OBSWebSocket = require("obs-websocket-js").default;

const OBS_RECONNECT_DELAY_MS = 5000;
const STREAM_STATE_TIMEOUT_MS = 15000;
const HEARTBEAT_INTERVAL_MS = 10000;

class ObsBridge extends EventEmitter {
  constructor() {
    super();
    this.socket = null;
    this.obs = new OBSWebSocket();
    this.obsConnected = false;
    this.knownStreaming = false;
    this.socketConnected = false;
    this.obsWsUrl = null;
    this.obsWsPassword = "";
    this.currentLiveId = null;
    this.pendingAction = null;
    this.heartbeatTimer = null;
    this.obsReconnectTimer = null;

    this.obs.on("ConnectionClosed", () => {
      this.obsConnected = false;
      this.emitStatus();
      if (this.obsReconnectTimer) clearTimeout(this.obsReconnectTimer);
      this.obsReconnectTimer = setTimeout(() => this.connectObs(), OBS_RECONNECT_DELAY_MS);
    });

    this.obs.on("StreamStateChanged", (data) => {
      const nowStreaming = !!data.outputActive;
      const wasStreaming = this.knownStreaming;
      this.knownStreaming = nowStreaming;
      this.emitStatus();
      if (!nowStreaming && wasStreaming && !this.pendingAction && this.currentLiveId && this.socket) {
        this.socket.emit("stream:ended_externally", { liveId: this.currentLiveId });
      }
    });
  }

  start({ backendUrl, token }) {
    this.stop();

    this.socket = io(`${backendUrl}/agent`, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 15000,
    });

    this.socket.on("connect", () => {
      this.socketConnected = true;
      this.emitStatus();
    });
    this.socket.on("disconnect", () => {
      this.socketConnected = false;
      this.emitStatus();
    });
    this.socket.on("connect_error", (err) => {
      this.socketConnected = false;
      this.emit("log", `Connexion serveur impossible: ${err.message}`);
      this.emitStatus();
    });

    this.socket.on("agent:config", (config) => this.applyObsConfig(config));

    this.socket.on("cmd:start_stream", async ({ liveId }, callback) => {
      if (!this.obsConnected) return callback?.({ ok: false, error: "OBS non connecte" });
      if (this.knownStreaming) {
        this.currentLiveId = liveId;
        return callback?.({ ok: true });
      }
      this.pendingAction = "start";
      this.currentLiveId = liveId;
      try {
        await this.obs.call("StartStream");
        await this.waitForStreamState(true, STREAM_STATE_TIMEOUT_MS);
        callback?.({ ok: true });
      } catch (err) {
        callback?.({ ok: false, error: err.message });
      } finally {
        this.pendingAction = null;
      }
    });

    this.socket.on("cmd:stop_stream", async ({ liveId }, callback) => {
      if (!this.obsConnected) return callback?.({ ok: false, error: "OBS non connecte" });
      if (!this.knownStreaming) return callback?.({ ok: true });
      this.pendingAction = "stop";
      try {
        await this.obs.call("StopStream");
        await this.waitForStreamState(false, STREAM_STATE_TIMEOUT_MS);
        callback?.({ ok: true });
      } catch (err) {
        callback?.({ ok: false, error: err.message });
      } finally {
        this.pendingAction = null;
        if (this.currentLiveId === liveId) this.currentLiveId = null;
      }
    });

    this.heartbeatTimer = setInterval(() => {
      if (this.socket?.connected) {
        this.socket.emit("agent:obs_status", { obsConnected: this.obsConnected, streaming: this.knownStreaming });
      }
    }, HEARTBEAT_INTERVAL_MS);
  }

  stop() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (this.obsReconnectTimer) clearTimeout(this.obsReconnectTimer);
    this.heartbeatTimer = null;
    this.obsReconnectTimer = null;
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.socketConnected = false;
  }

  applyObsConfig({ obsWsPort, obsWsPassword }) {
    const url = `ws://127.0.0.1:${obsWsPort || 4455}`;
    if (url === this.obsWsUrl && (obsWsPassword || "") === this.obsWsPassword) return;
    this.obsWsUrl = url;
    this.obsWsPassword = obsWsPassword || "";
    if (this.obsConnected) {
      this.obs.disconnect().catch(() => {});
    }
    this.connectObs();
  }

  async connectObs() {
    if (!this.obsWsUrl) {
      this.emit("log", "En attente de la configuration OBS depuis le serveur...");
      return;
    }
    try {
      await this.obs.connect(this.obsWsUrl, this.obsWsPassword || undefined);
      this.obsConnected = true;
      const status = await this.obs.call("GetStreamStatus");
      this.knownStreaming = !!status.outputActive;
      this.emitStatus();
    } catch {
      this.obsConnected = false;
      this.emitStatus();
      if (this.obsReconnectTimer) clearTimeout(this.obsReconnectTimer);
      this.obsReconnectTimer = setTimeout(() => this.connectObs(), OBS_RECONNECT_DELAY_MS);
    }
  }

  waitForStreamState(active, timeoutMs) {
    return new Promise((resolve, reject) => {
      if (this.knownStreaming === active) return resolve();
      const timeout = setTimeout(() => {
        this.obs.off("StreamStateChanged", onChange);
        reject(new Error("Timeout en attente de la confirmation OBS"));
      }, timeoutMs);
      const onChange = (data) => {
        if (!!data.outputActive === active) {
          clearTimeout(timeout);
          this.obs.off("StreamStateChanged", onChange);
          resolve();
        }
      };
      this.obs.on("StreamStateChanged", onChange);
    });
  }

  emitStatus() {
    this.emit("status", {
      socketConnected: this.socketConnected,
      obsConnected: this.obsConnected,
      streaming: this.knownStreaming,
    });
  }

  getStatus() {
    return {
      socketConnected: this.socketConnected,
      obsConnected: this.obsConnected,
      streaming: this.knownStreaming,
    };
  }
}

module.exports = ObsBridge;
