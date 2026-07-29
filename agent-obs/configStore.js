// Minimal persistent JSON config store (avoids pulling in electron-store,
// whose recent major versions are ESM-only and awkward inside a CommonJS
// Electron main process for a small single-file config need).
const fs = require("fs");
const path = require("path");

function configPath(app) {
  return path.join(app.getPath("userData"), "config.json");
}

function load(app) {
  try {
    const raw = fs.readFileSync(configPath(app), "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function save(app, data) {
  fs.mkdirSync(path.dirname(configPath(app)), { recursive: true });
  fs.writeFileSync(configPath(app), JSON.stringify(data, null, 2), "utf8");
}

module.exports = { load, save };
