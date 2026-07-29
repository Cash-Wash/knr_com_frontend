"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, Eye, EyeOff, Settings2, XCircle } from "lucide-react";
import { getApiBase, authHeaders } from "@/lib/api";

type Settings = {
  youtubeApiKey: string;
  youtubeChannelId: string;
  agentObsToken: string;
  obsWsPort: string;
  obsWsPassword: string;
};

type AgentStatus = {
  online: boolean;
  obsConnected: boolean;
  streaming: boolean;
};

const emptySettings: Settings = {
  youtubeApiKey: "",
  youtubeChannelId: "",
  agentObsToken: "",
  obsWsPort: "4455",
  obsWsPassword: "",
};

function DiagnosticLine({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {ok ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-400" />}
      <span className={ok ? "text-slate-700" : "text-slate-500"}>{label}</span>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(emptySettings);
  const [showSecrets, setShowSecrets] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${getApiBase()}/api/settings`, { headers: authHeaders() });
        if (!response.ok) return;
        const payload = await response.json();
        setSettings({
          youtubeApiKey: payload.youtubeApiKey ?? "",
          youtubeChannelId: payload.youtubeChannelId ?? "",
          agentObsToken: payload.agentObsToken ?? "",
          obsWsPort: payload.obsWsPort ?? "4455",
          obsWsPassword: payload.obsWsPassword ?? "",
        });
      } catch {
        // keep defaults
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await fetch(`${getApiBase()}/api/agent/status`, { headers: authHeaders() });
        if (!response.ok) return;
        const payload = await response.json();
        setAgentStatus({ online: !!payload.online, obsConnected: !!payload.obsConnected, streaming: !!payload.streaming });
      } catch {
        setAgentStatus(null);
      }
    };
    loadStatus();
    const interval = setInterval(loadStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const downloadAgentConfig = () => {
    const content = [
      `BACKEND_URL=${getApiBase()}`,
      `AGENT_OBS_TOKEN=${settings.agentObsToken}`,
      "",
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = ".env";
    link.click();
    URL.revokeObjectURL(url);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const response = await fetch(`${getApiBase()}/api/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(settings),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload?.error || "Échec de l'enregistrement.");
        return;
      }
      setSaved(true);
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 text-slate-900">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700">
          <Settings2 className="h-4 w-4" />
          Parametres globaux
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Configurez la diffusion depuis l&apos;interface.
        </h1>
        {error ? (
          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        ) : null}
        {saved ? (
          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Paramètres enregistrés.
          </div>
        ) : null}
      </section>

      <section className="grid gap-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <Settings2 className="h-5 w-5 text-sky-500" />
          <h2 className="mt-4 text-xl font-bold text-slate-900">Diffusion (OBS / YouTube)</h2>
          <p className="mt-2 text-sm text-slate-600">
            Le port et le mot de passe obs-websocket sont envoyés automatiquement à l&apos;Agent OBS dès l&apos;enregistrement
            — aucun fichier à modifier ni à replacer sur le PC de diffusion après la première installation.
          </p>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            Dans OBS (Outils → obs-websocket Settings), la case <strong>&quot;Utiliser l&apos;authentification&quot;</strong> doit
            être cochée avec un mot de passe défini, sinon l&apos;Agent OBS ne pourra pas se connecter même avec le bon
            token ci-dessous.
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Diagnostic</p>
            <DiagnosticLine ok={!!agentStatus?.online} label="Agent OBS connecté au serveur" />
            <DiagnosticLine ok={!!agentStatus?.obsConnected} label="OBS Studio connecté à l'agent" />
            <DiagnosticLine ok={!!settings.agentObsToken} label="Token Agent OBS renseigné" />
            <DiagnosticLine ok={!!settings.youtubeApiKey} label="Clé API YouTube renseignée" />
            <DiagnosticLine ok={!!settings.youtubeChannelId} label="ID de chaîne YouTube renseigné" />
            <DiagnosticLine ok={!!settings.obsWsPort} label="Port obs-websocket renseigné" />
            <DiagnosticLine ok={!!settings.obsWsPassword} label="Mot de passe obs-websocket renseigné" />
          </div>

          <div className="mt-5 grid gap-4">
            <input
              type={showSecrets ? "text" : "password"}
              value={settings.youtubeApiKey}
              onChange={(e) => setSettings((s) => ({ ...s, youtubeApiKey: e.target.value }))}
              placeholder="Clé API YouTube Data"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
            <input
              value={settings.youtubeChannelId}
              onChange={(e) => setSettings((s) => ({ ...s, youtubeChannelId: e.target.value }))}
              placeholder="ID de la chaîne YouTube"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
            <input
              type={showSecrets ? "text" : "password"}
              value={settings.agentObsToken}
              onChange={(e) => setSettings((s) => ({ ...s, agentObsToken: e.target.value }))}
              placeholder="Token partagé Agent OBS"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                value={settings.obsWsPort}
                onChange={(e) => setSettings((s) => ({ ...s, obsWsPort: e.target.value }))}
                placeholder="Port obs-websocket (ex: 4455)"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              <input
                type={showSecrets ? "text" : "password"}
                value={settings.obsWsPassword}
                onChange={(e) => setSettings((s) => ({ ...s, obsWsPassword: e.target.value }))}
                placeholder="Mot de passe obs-websocket"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
            </div>
            <p className="text-xs text-slate-500">
              Le port et le mot de passe se trouvent dans OBS via <strong>Outils → obs-websocket Settings</strong>.
            </p>
            <button
              type="button"
              onClick={() => setShowSecrets((v) => !v)}
              className="inline-flex w-fit items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
            >
              {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showSecrets ? "Masquer" : "Afficher"} les valeurs
            </button>

            <a
              href="/downloads/agent-obs-setup.exe"
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
            >
              <Download className="h-4 w-4" />
              Télécharger l&apos;Agent OBS (installeur Windows)
            </a>
            <p className="text-xs text-slate-500">
              À installer une seule fois sur le PC de diffusion. Une icône apparaît dans la barre des tâches ; double-cliquez
              dessus pour entrer l&apos;URL du site et le token Agent OBS ci-dessus. Le port et le mot de passe OBS ne sont
              jamais saisis dans l&apos;agent — il les reçoit automatiquement du serveur, y compris si vous les changez plus
              tard.
            </p>

            <details className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                Option avancée : installation manuelle (Node.js + pm2)
              </summary>
              <div className="mt-3 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={downloadAgentConfig}
                  disabled={!settings.agentObsToken}
                  className="inline-flex w-fit items-center gap-2 rounded-2xl border border-sky-200 bg-white px-4 py-2.5 text-sm font-semibold text-sky-700 transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Télécharger la configuration (.env)
                </button>
                <p className="text-xs text-slate-500">
                  Enregistrez ce fichier sous le nom <code>.env</code> dans le dossier <code>agent-obs/</code> du projet
                  (à côté de <code>index.js</code>), puis lancez <code>npm install</code> et{" "}
                  <code>npm run legacy:start</code> (ou <code>npm run service:start</code> avec pm2 pour rester actif en
                  permanence). Voir <code>configurationlive.md</code> à la racine du projet pour le guide complet.
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      <button
        onClick={save}
        disabled={saving}
        className="rounded-2xl bg-sky-500 px-6 py-3 font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Enregistrement..." : "Enregistrer les paramètres"}
      </button>
    </div>
  );
}
