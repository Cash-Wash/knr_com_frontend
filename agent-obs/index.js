require("dotenv").config();

const OBSWebSocket = require("obs-websocket-js").default;
const { io } = require("socket.io-client");

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";
const AGENT_OBS_TOKEN = process.env.AGENT_OBS_TOKEN || "";

const OBS_RECONNECT_DELAY_MS = 5000;
const STREAM_STATE_TIMEOUT_MS = 15000;
const HEARTBEAT_INTERVAL_MS = 10000;

const obs = new OBSWebSocket();

// Reçus du serveur via l'évènement "agent:config" — plus besoin de les définir
// à la main dans .env, ils viennent des Paramètres de l'admin.
let obsWsUrl = null;
let obsWsPassword = "";

let obsConnected = false;
let knownStreaming = false;
let pendingAction = null; // "start" | "stop" | null
let currentLiveId = null;
let reconnectTimer = null;

function log(...args) {
  console.log(new Date().toISOString(), "-", ...args);
}

function waitForStreamState(active, timeoutMs) {
  if (knownStreaming === active) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      obs.off("StreamStateChanged", handler);
      reject(new Error("Délai dépassé en attendant la confirmation d'OBS."));
    }, timeoutMs);

    function handler(data) {
      if (data.outputActive === active) {
        clearTimeout(timer);
        obs.off("StreamStateChanged", handler);
        resolve();
      }
    }

    obs.on("StreamStateChanged", handler);
  });
}

async function connectObs() {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (!obsWsUrl) {
    log("En attente de la configuration OBS depuis le serveur...");
    return;
  }

  try {
    await obs.connect(obsWsUrl, obsWsPassword || undefined);
    obsConnected = true;
    try {
      const status = await obs.call("GetStreamStatus");
      knownStreaming = !!status.outputActive;
    } catch {
      knownStreaming = false;
    }
    log("Connecté à OBS", obsWsUrl, "- diffusion en cours:", knownStreaming);
  } catch (error) {
    obsConnected = false;
    log("Connexion OBS échouée, nouvelle tentative dans", OBS_RECONNECT_DELAY_MS / 1000, "s -", error.message);
    reconnectTimer = setTimeout(connectObs, OBS_RECONNECT_DELAY_MS);
  }
}

function applyObsConfig({ obsWsPort, obsWsPassword: nextPassword } = {}) {
  const nextUrl = `ws://127.0.0.1:${obsWsPort || 4455}`;
  if (nextUrl === obsWsUrl && (nextPassword ?? "") === obsWsPassword) {
    return; // configuration inchangée
  }

  obsWsUrl = nextUrl;
  obsWsPassword = nextPassword ?? "";
  log("Nouvelle configuration OBS reçue du serveur:", obsWsUrl);

  if (obsConnected) {
    obs.disconnect();
    obsConnected = false;
  }
  connectObs();
}

obs.on("ConnectionClosed", () => {
  obsConnected = false;
  log("Connexion OBS perdue, nouvelle tentative dans", OBS_RECONNECT_DELAY_MS / 1000, "s");
  reconnectTimer = setTimeout(connectObs, OBS_RECONNECT_DELAY_MS);
});

obs.on("StreamStateChanged", (data) => {
  const wasStreaming = knownStreaming;
  knownStreaming = !!data.outputActive;

  if (wasStreaming && !knownStreaming && !pendingAction && currentLiveId) {
    const liveId = currentLiveId;
    currentLiveId = null;
    log("OBS a arrêté la diffusion en dehors d'une commande de la plateforme.");
    socket.emit("stream:ended_externally", { liveId });
  }
});

const socket = io(`${BACKEND_URL}/agent`, {
  auth: { token: AGENT_OBS_TOKEN },
  reconnection: true,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 15000,
});

socket.on("connect", () => log("Connecté au backend KNR"));
socket.on("disconnect", (reason) => log("Déconnecté du backend KNR:", reason));
socket.on("connect_error", (error) => log("Erreur de connexion au backend:", error.message));
socket.on("agent:config", applyObsConfig);

socket.on("cmd:start_stream", async ({ liveId } = {}, callback) => {
  if (!obsConnected) {
    return callback({ ok: false, error: "OBS non connecté à l'agent." });
  }
  if (knownStreaming) {
    currentLiveId = liveId ?? currentLiveId;
    return callback({ ok: true });
  }

  pendingAction = "start";
  try {
    await obs.call("StartStream");
    await waitForStreamState(true, STREAM_STATE_TIMEOUT_MS);
    currentLiveId = liveId ?? null;
    callback({ ok: true });
  } catch (error) {
    callback({ ok: false, error: error.message });
  } finally {
    pendingAction = null;
  }
});

socket.on("cmd:stop_stream", async ({ liveId } = {}, callback) => {
  if (!obsConnected) {
    return callback({ ok: false, error: "OBS non connecté à l'agent." });
  }
  if (!knownStreaming) {
    currentLiveId = null;
    return callback({ ok: true });
  }

  pendingAction = "stop";
  try {
    await obs.call("StopStream");
    await waitForStreamState(false, STREAM_STATE_TIMEOUT_MS);
    currentLiveId = null;
    callback({ ok: true });
  } catch (error) {
    callback({ ok: false, error: error.message });
  } finally {
    pendingAction = null;
  }
});

setInterval(() => {
  if (socket.connected) {
    socket.emit("agent:obs_status", { obsConnected, streaming: knownStreaming });
  }
}, HEARTBEAT_INTERVAL_MS);

log("Agent démarré, connexion à OBS en attente de la configuration du serveur...");
