const settingsStore = require("./settingsStore");

const POLL_INTERVAL_MS = 5000;
const MAX_ATTEMPTS = 24; // ~2 minutes avant abandon

const activePolls = new Map(); // liveId -> intervalId

async function fetchLiveVideoId() {
  const apiKey = settingsStore.getYoutubeApiKey();
  const channelId = settingsStore.getYoutubeChannelId();
  if (!apiKey || !channelId) return null;

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(channelId)}&eventType=live&type=video&key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`YouTube API a répondu ${response.status}`);
  }
  const data = await response.json();
  return data.items?.[0]?.id?.videoId ?? null;
}

function startDiscovery(liveId, { onFound, onGiveUp }) {
  if (activePolls.has(liveId)) return;
  if (!settingsStore.getYoutubeApiKey() || !settingsStore.getYoutubeChannelId()) return;

  let attempts = 0;
  const timer = setInterval(async () => {
    attempts += 1;
    try {
      const videoId = await fetchLiveVideoId();
      if (videoId) {
        stopDiscovery(liveId);
        onFound(videoId);
        return;
      }
    } catch (error) {
      console.error("[youtubeDiscovery]", error.message);
    }

    if (attempts >= MAX_ATTEMPTS) {
      stopDiscovery(liveId);
      onGiveUp();
    }
  }, POLL_INTERVAL_MS);

  activePolls.set(liveId, timer);
}

function stopDiscovery(liveId) {
  const timer = activePolls.get(liveId);
  if (timer) clearInterval(timer);
  activePolls.delete(liveId);
}

module.exports = { startDiscovery, stopDiscovery };
