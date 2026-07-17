const prisma = require("./prismaClient");

const SINGLETON_ID = "singleton";

let cache = {
  siteName: null,
  siteTagline: null,
  youtubeApiKey: null,
  youtubeChannelId: null,
  agentObsToken: null,
  obsWsPort: null,
  obsWsPassword: null,
};

async function refreshSettings() {
  const row = await prisma.appSettings.findUnique({ where: { id: SINGLETON_ID } });
  cache = {
    siteName: row?.siteName ?? null,
    siteTagline: row?.siteTagline ?? null,
    youtubeApiKey: row?.youtubeApiKey ?? null,
    youtubeChannelId: row?.youtubeChannelId ?? null,
    agentObsToken: row?.agentObsToken ?? null,
    obsWsPort: row?.obsWsPort ?? null,
    obsWsPassword: row?.obsWsPassword ?? null,
  };
  return cache;
}

function getSettings() {
  return cache;
}

function getAgentObsToken() {
  return cache.agentObsToken || process.env.AGENT_OBS_TOKEN || "";
}

function getYoutubeApiKey() {
  return cache.youtubeApiKey || process.env.YOUTUBE_API_KEY || "";
}

function getYoutubeChannelId() {
  return cache.youtubeChannelId || process.env.YOUTUBE_CHANNEL_ID || "";
}

function getObsWsPort() {
  return cache.obsWsPort || "4455";
}

function getObsWsPassword() {
  return cache.obsWsPassword || "";
}

module.exports = {
  refreshSettings,
  getSettings,
  getAgentObsToken,
  getYoutubeApiKey,
  getYoutubeChannelId,
  getObsWsPort,
  getObsWsPassword,
};
