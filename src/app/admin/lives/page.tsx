"use client";

import { useMemo, useState } from "react";
import {
  CalendarClock,
  CirclePlay,
  Eye,
  PauseCircle,
  PencilLine,
  Plus,
  Radio,
  Square,
  Trash2,
} from "lucide-react";
import {
  AdminLive,
  adminSeedLives,
  getYoutubeEmbedUrl,
  formatDateTime,
} from "@/lib/admin-demo-data";

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

  const activeLive = useMemo(() => lives.find((live) => live.status === "live") ?? null, [lives]);

  const startNewLive = () => {
    setEditingId(null);
    setForm(emptyLive);
    setShowForm(true);
  };

  const editLive = (live: AdminLive) => {
    setEditingId(live.id);
    setForm({
      titre: live.titre,
      youtubeUrl: live.youtubeUrl,
      youtubeId: live.youtubeId ?? "",
      programme: live.programme,
    });
    setShowForm(true);
  };

  const saveLive = () => {
    const youtubeId = form.youtubeId || undefined;
    const nextLive: AdminLive = {
      id: editingId ?? `live_${Date.now()}`,
      titre: form.titre,
      youtubeUrl: form.youtubeUrl,
      youtubeId,
      status: editingId ? "scheduled" : "scheduled",
      viewers: editingId ? lives.find((live) => live.id === editingId)?.viewers ?? 0 : 0,
      programme: form.programme,
    };

    if (editingId) {
      setLives((current) => current.map((live) => (live.id === editingId ? { ...live, ...nextLive } : live)));
    } else {
      setLives((current) => [nextLive, ...current]);
    }

    setShowForm(false);
    setForm(emptyLive);
    setEditingId(null);
  };

  const setLiveStatus = (id: string, status: AdminLive["status"]) => {
    setLives((current) =>
      current.map((live) =>
        live.id === id
          ? {
              ...live,
              status,
              startedAt: status === "live" ? new Date().toISOString() : live.startedAt,
              endedAt: status === "ended" ? new Date().toISOString() : live.endedAt,
            }
          : live
      )
    );
  };

  const removeLive = (id: string) => {
    setLives((current) => current.filter((live) => live.id !== id));
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-100">
              <Radio className="h-4 w-4" />
              Gestion du live et de la diffusion automatique YouTube
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Demarrer un live se fait ici, pas sur la page publique.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
              Prevoyez la source YouTube, activez le direct, puis laissez la WebTV afficher automatiquement le flux sur le site.
            </p>
          </div>
          <button
            onClick={startNewLive}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            Nouveau live
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/60 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Live actif</p>
              <h2 className="text-2xl font-bold text-white">Pilotage direct</h2>
            </div>
            <CirclePlay className="h-5 w-5 text-sky-400" />
          </div>

          {activeLive ? (
            <div className="mt-5 space-y-4">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black">
                <iframe
                  title={activeLive.titre}
                  src={getYoutubeEmbedUrl(activeLive.youtubeUrl, activeLive.youtubeId) ?? undefined}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="rounded-[28px] border border-red-400/20 bg-red-500/10 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-red-200">En direct</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">{activeLive.titre}</h3>
                    <p className="mt-1 text-sm text-slate-300">{activeLive.programme}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-white">{activeLive.viewers.toLocaleString("fr-FR")}</div>
                    <p className="text-sm text-slate-300">spectateurs</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[28px] border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-lg font-semibold text-white">Aucun live en cours</p>
              <p className="mt-2 text-sm text-slate-300">
                Configurez un live dans l&apos;espace admin pour qu&apos;il apparaisse automatiquement sur la page WebTV.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Conseils de diffusion</p>
              <h2 className="text-2xl font-bold text-white">Flux YouTube</h2>
            </div>
            <CalendarClock className="h-5 w-5 text-sky-400" />
          </div>
          <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
            <p>1. Renseignez l&apos;URL YouTube ou l&apos;ID de la video.</p>
            <p>2. Passez le live en statut &quot;live&quot; pour le rendre visible sur WebTV.</p>
            <p>3. Marquez-le comme termine quand la diffusion s&apos;arrete.</p>
            <p>4. Le programme du jour reste editable depuis l&apos;onglet Programme.</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {activeLive ? (
              <>
                <button
                  onClick={() => setLiveStatus(activeLive.id, "live")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-400"
                >
                  <Radio className="h-4 w-4" />
                  En direct
                </button>
                <button
                  onClick={() => setLiveStatus(activeLive.id, "ended")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <Square className="h-4 w-4" />
                  Terminer
                </button>
              </>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/60 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Liste des lives</p>
            <h2 className="text-2xl font-bold text-white">Planification et historique</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300">
            <Eye className="h-3.5 w-3.5" />
            {lives.length} element(s)
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {lives.map((live) => (
            <div key={live.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{live.titre}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] ${
                        live.status === "live"
                          ? "bg-red-500/15 text-red-200"
                          : live.status === "ended"
                          ? "bg-white/10 text-slate-400"
                          : "bg-sky-400/15 text-sky-200"
                      }`}
                    >
                      {live.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{live.programme}</p>
                  <p className="mt-2 text-xs text-slate-400">{live.youtubeUrl}</p>
                  {live.startedAt ? (
                    <p className="mt-2 text-xs text-slate-400">Debut: {formatDateTime(live.startedAt)}</p>
                  ) : null}
                </div>
                <div className="text-right">
                  <div className="rounded-2xl bg-sky-400/10 px-3 py-2 text-sm font-semibold text-sky-100">
                    {live.viewers.toLocaleString("fr-FR")} vues
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => editLive(live)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  <PencilLine className="h-4 w-4" />
                  Modifier
                </button>
                <button
                  onClick={() => setLiveStatus(live.id, "live")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
                >
                  <Radio className="h-4 w-4" />
                  Demarrer
                </button>
                <button
                  onClick={() => setLiveStatus(live.id, "ended")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
                >
                  <PauseCircle className="h-4 w-4" />
                  Arreter
                </button>
                <button
                  onClick={() => removeLive(live.id)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-100 transition hover:bg-red-500/20"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Configuration</p>
                <h3 className="text-2xl font-bold text-white">
                  {editingId ? "Modifier le live" : "Nouveau live"}
                </h3>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
              >
                Fermer
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              <input
                value={form.titre}
                onChange={(event) => setForm((current) => ({ ...current, titre: event.target.value }))}
                placeholder="Titre du live"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
              <input
                value={form.youtubeUrl}
                onChange={(event) => setForm((current) => ({ ...current, youtubeUrl: event.target.value }))}
                placeholder="URL YouTube"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
              <input
                value={form.youtubeId}
                onChange={(event) => setForm((current) => ({ ...current, youtubeId: event.target.value }))}
                placeholder="ID YouTube (facultatif)"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
              <textarea
                value={form.programme}
                onChange={(event) => setForm((current) => ({ ...current, programme: event.target.value }))}
                placeholder="Description / programme"
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={saveLive}
                className="rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white"
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
