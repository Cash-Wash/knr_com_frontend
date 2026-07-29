const dot = document.getElementById("dot");
const statusText = document.getElementById("statusText");
const backendUrlInput = document.getElementById("backendUrl");
const tokenInput = document.getElementById("token");
const launchAtStartupInput = document.getElementById("launchAtStartup");
const saveButton = document.getElementById("save");
const savedLabel = document.getElementById("saved");
const logLine = document.getElementById("log");

function renderStatus(status) {
  const connected = !!status.socketConnected;
  dot.classList.toggle("on", connected);
  if (!connected) {
    statusText.textContent = "Déconnecté du site";
  } else if (!status.obsConnected) {
    statusText.textContent = "Connecté au site — OBS non détecté";
  } else if (status.streaming) {
    statusText.textContent = "En direct";
  } else {
    statusText.textContent = "Prêt";
  }
  logLine.textContent = status.lastLog || "";
}

async function init() {
  const config = await window.agentObs.getConfig();
  backendUrlInput.value = config.backendUrl;
  tokenInput.value = config.token;
  launchAtStartupInput.checked = config.launchAtStartup;

  const status = await window.agentObs.getStatus();
  renderStatus(status);

  window.agentObs.onStatus(renderStatus);
}

saveButton.addEventListener("click", async () => {
  savedLabel.style.display = "none";
  await window.agentObs.saveConfig({
    backendUrl: backendUrlInput.value,
    token: tokenInput.value,
    launchAtStartup: launchAtStartupInput.checked,
  });
  savedLabel.style.display = "block";
  setTimeout(() => { savedLabel.style.display = "none"; }, 2500);
});

init();
