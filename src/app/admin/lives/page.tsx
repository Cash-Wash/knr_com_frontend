"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CirclePlay,
  Eye,
  PauseCircle,
  PencilLine,
  Plus,
  Radio,
  Square,
  Trash2,
  Wifi,
  WifiOff,
} from "lucide-react";
import { AdminLive, adminSeedLives, getYoutubeEmbedUrl, formatDateTime } from "@/lib/admin-demo-data";
import { getApiBase, authHeaders } from "@/lib/api";
import { getSocket } from "@/lib/socket";

const emptyLive = {
  titre: "",
  youtubeUrl: "",
  youtubeId: "",
  programme: "",
};

export default function AdminLivesPage() {
  const [lives, setLives] = useState<AdminLive[]>(adminSeedLives);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyLive);
  const [agentOnline, setAgentOnline] = useState<boolean | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const activeLive = useMemo(() => lives.find((live) => live.status === "live") ?? null, [lives]);

  const mergeLive = (updated: AdminLive) => {
    setLives((current) =>
      current.some((live) => live.id === updated.id)
        ? current.map((live) => (live.id === updated.id ? updated : live))
        : current
    );
  };

  useEffect(() => {
    const loadLives = async () => {
      try {
        const response = await fetch(`${getApiBase()}/api/lives`, { headers: authHeaders() });
        if (!response.ok) return;

        const payload = await response.json();
        if (Array.isArray(payload) && payload.length > 0) {
          setLives(payload);
        }
      } catch {
        // keep local seed data
      }
    };

    const loadAgentStatus = async () => {
      try {
        const response = await fetch(`${getApiBase()}/api/agent/status`, { headers: authHeaders() });
        if (!response.ok) return;
        const status = await response.json();
        setAgentOnline(!!status.online);
      } catch {
        setAgentOnline(null);
      }
    };

    loadLives();
    loadAgentStatus();

    const socket = getSocket();
    const onAgentStatus = (payload: { online: boolean }) => setAgentOnline(payload.online);
    const onLiveStarted = (live: AdminLive) => mergeLive(live);
    const onLiveStopped = (live: AdminLive) => mergeLive(live);
    const onYoutubeReady = (live: AdminLive) => mergeLive(live);
    const onViewersUpdated = (live: AdminLive) => mergeLive(live);
    const onYoutubePending = () =>
      setNotice("Détection automatique de la vidéo YouTube en échec — renseignez l'URL manuellement si besoin.");

    socket.on("agent:status", onAgentStatus);
    socket.on("live:started", onLiveStarted);
    socket.on("live:stopped", onLiveStopped);
    socket.on("live:youtube_ready", onYoutubeReady);
    socket.on("live:viewers_updated", onViewersUpdated);
    socket.on("live:youtube_pending", onYoutubePending);

    return () => {
      socket.off("agent:status", onAgentStatus);
      socket.off("live:started", onLiveStarted);
      socket.off("live:stopped", onLiveStopped);
      socket.off("live:youtube_ready", onYoutubeReady);
      socket.off("live:viewers_updated", onViewersUpdated);
      socket.off("live:youtube_pending", onYoutubePending);
    };
  }, []);

  const startNewLive = () => {
    setEditingId(null);
    setForm(emptyLive);
    setShowForm(true);
  };

  const editLive = (live: AdminLive) => {
    setEditingId(live.id);
    setForm({
      titre: live.titre,
      youtubeUrl: live.youtubeUrl ?? "",
      youtubeId: live.youtubeId ?? "",
      programme: live.programme,
    });
    setShowForm(true);
  };

  const saveLive = async () => {
    try {
      const response = await fetch(`${getApiBase()}/api/lives${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders(),
        },
        body: JSON.stringify({
          titre: form.titre,
          youtubeUrl: form.youtubeUrl,
          youtubeId: form.youtubeId || undefined,
          programme: form.programme,
          status: "scheduled",
          viewers: editingId ? lives.find((live) => live.id === editingId)?.viewers ?? 0 : 0,
        }),
      });

      if (!response.ok) {
        throw new Error("save live failed");
      }

      const saved = await response.json();
      setLives((current) =>
        editingId ? current.map((live) => (live.id === editingId ? saved : live)) : [saved, ...current]
      );
    } catch {
      const youtubeId = form.youtubeId || undefined;
      const nextLive: AdminLive = {
        id: editingId ?? `live_${Date.now()}`,
        titre: form.titre,
        youtubeUrl: form.youtubeUrl,
        youtubeId,
        status: "scheduled",
        viewers: editingId ? lives.find((live) => live.id === editingId)?.viewers ?? 0 : 0,
        programme: form.programme,
      };

      if (editingId) {
        setLives((current) => current.map((live) => (live.id === editingId ? { ...live, ...nextLive } : live)));
      } else {
        setLives((current) => [nextLive, ...current]);
      }
    }

    setShowForm(false);
    setForm(emptyLive);
    setEditingId(null);
  };

  const setLiveStatus = async (id: string, status: AdminLive["status"]) => {
    setActionError(null);
    setNotice(null);
    try {
      const endpoint = status === "live" ? "start" : "stop";
      const response = await fetch(`${getApiBase()}/api/lives/${id}/${endpoint}`, {
        method: "POST",
        headers: authHeaders(),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setActionError(payload?.error || "La mise à jour du live a échoué.");
        return;
      }

      if (payload.warning) {
        setNotice(payload.warning);
      }

      setLives((current) =>
        current.map((live) =>
          live.id === id
            ? payload.live
            : status === "live" && live.status === "live"
              ? { ...live, status: "ended", endedAt: new Date().toISOString() }
              : live
        )
      );
    } catch {
      setActionError("Impossible de contacter le serveur. Réessayez.");
    }
  };

  const removeLive = async (id: string) => {
    try {
      await fetch(`${getApiBase()}/api/lives/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
    } catch {
      // fallback below
    }

    setLives((current) => current.filter((live) => live.id !== id));
  };

  return (
    <div className="space-y-8 text-slate-900">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                <Radio className="h-4 w-4" />
                Diffusion pilotée par l&apos;Agent OBS
              </div>
              {agentOnline === true ? (
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                  <Wifi className="h-4 w-4" />
                  Agent OBS connecté
                </div>
              ) : agentOnline === false ? (
                <>
                  <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
                    <WifiOff className="h-4 w-4" />
                    Agent OBS hors ligne
                  </div>
                  <a
                    href="/downloads/agent-obs-setup.exe"
                    className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
                  >
                    Télécharger l&apos;Agent OBS
                  </a>
                </>
              ) : null}
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Demarrer un live se fait ici, pas sur la page publique.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Cliquer sur &quot;Démarrer&quot; déclenche réellement la diffusion OBS sur le PC de streaming. L&apos;ID YouTube est détecté automatiquement et la WebTV s&apos;actualise seule.
            </p>
            {actionError ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {actionError}
              </div>
            ) : null}
            {notice ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {notice}
              </div>
            ) : null}
          </div>
          <button
            onClick={startNewLive}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-600"
          >
            <Plus className="h-4 w-4" />
            Nouveau live
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Live actif</p>
              <h2 className="text-2xl font-bold text-slate-900">Pilotage direct</h2>
            </div>
            <CirclePlay className="h-5 w-5 text-sky-500" />
          </div>

          {activeLive ? (
            <div className="mt-5 space-y-4">
              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-black">
                <iframe
                  title={activeLive.titre}
                  src={getYoutubeEmbedUrl(activeLive.youtubeUrl, activeLive.youtubeId) ?? undefined}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="rounded-[28px] border border-red-200 bg-red-50 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-red-600">En direct</p>
                    <h3 className="mt-2 text-xl font-semibold text-slate-900">{activeLive.titre}</h3>
                    <p className="mt-1 text-sm text-slate-600">{activeLive.programme}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900">{activeLive.viewers.toLocaleString("fr-FR")}</div>
                    <p className="text-sm text-slate-500">spectateurs</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[28px] border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-lg font-semibold text-slate-900">Aucun live en cours</p>
              <p className="mt-2 text-sm text-slate-600">
                Configurez un live dans l&apos;espace admin pour qu&apos;il apparaisse automatiquement sur la page WebTV.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Conseils de diffusion</p>
              <h2 className="text-2xl font-bold text-slate-900">Flux YouTube</h2>
            </div>
            <CalendarClock className="h-5 w-5 text-sky-500" />
          </div>
          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-600">
            <p>1. Assurez-vous que l&apos;Agent OBS est connecté (pastille verte ci-dessus).</p>
            <p>2. Cliquez &quot;Démarrer&quot; : OBS lance réellement la diffusion vers Restream.</p>
            <p>3. L&apos;ID YouTube est détecté automatiquement ; la WebTV s&apos;actualise seule.</p>
            <p>4. Cliquez &quot;Arrêter&quot; pour couper la diffusion depuis la plateforme.</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {activeLive ? (
              <>
                <button
                  onClick={() => setLiveStatus(activeLive.id, "live")}
                  disabled={agentOnline === false}
                  className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Radio className="h-4 w-4" />
                  En direct
                </button>
                <button
                  onClick={() => setLiveStatus(activeLive.id, "ended")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <Square className="h-4 w-4" />
                  Terminer
                </button>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Liste des lives</p>
            <h2 className="text-2xl font-bold text-slate-900">Planification et historique</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-700">
            <Eye className="h-3.5 w-3.5" />
            {lives.length} element(s)
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {lives.map((live) => (
            <div key={live.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">{live.titre}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] ${
                        live.status === "live"
                          ? "bg-red-50 text-red-700"
                          : live.status === "ended"
                            ? "bg-slate-100 text-slate-500"
                            : "bg-sky-50 text-sky-700"
                      }`}
                    >
                      {live.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{live.programme}</p>
                  <p className="mt-2 text-xs text-slate-500">{live.youtubeUrl}</p>
                  {live.startedAt ? (
                    <p className="mt-2 text-xs text-slate-500">Debut: {formatDateTime(live.startedAt)}</p>
                  ) : null}
                </div>
                <div className="text-right">
                  <div className="rounded-2xl bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700">
                    {live.viewers.toLocaleString("fr-FR")} vues
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => editLive(live)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <PencilLine className="h-4 w-4" />
                  Modifier
                </button>
                <button
                  onClick={() => setLiveStatus(live.id, "live")}
                  disabled={agentOnline === false}
                  title={agentOnline === false ? "Agent OBS hors ligne : impossible de démarrer." : undefined}
                  className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Radio className="h-4 w-4" />
                  Demarrer
                </button>
                <button
                  onClick={() => setLiveStatus(live.id, "ended")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <PauseCircle className="h-4 w-4" />
                  Arreter
                </button>
                <button
                  onClick={() => removeLive(live.id)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 transition hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Configuration</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {editingId ? "Modifier le live" : "Nouveau live"}
                </h3>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700"
              >
                Fermer
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <input
                value={form.titre}
                onChange={(event) => setForm((current) => ({ ...current, titre: event.target.value }))}
                placeholder="Titre du live"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              <p className="text-xs text-slate-500 -mb-2">
                Substitution manuelle (optionnel) — laissez vide pour laisser l&apos;Agent OBS + la détection automatique YouTube s&apos;en charger.
              </p>
              <input
                value={form.youtubeUrl}
                onChange={(event) => setForm((current) => ({ ...current, youtubeUrl: event.target.value }))}
                placeholder="URL YouTube (facultatif)"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              <input
                value={form.youtubeId}
                onChange={(event) => setForm((current) => ({ ...current, youtubeId: event.target.value }))}
                placeholder="ID YouTube (facultatif)"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              <textarea
                value={form.programme}
                onChange={(event) => setForm((current) => ({ ...current, programme: event.target.value }))}
                placeholder="Description / programme"
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={saveLive} className="rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white">
                Enregistrer
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-700"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
