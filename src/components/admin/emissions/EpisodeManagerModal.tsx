"use client";

import { useEffect, useState } from "react";
import { Loader2, Play, Plus, Trash2, X } from "lucide-react";
import { getApiBase, authHeaders, formatRelativeDate } from "@/lib/api";

type Episode = {
  id: string;
  emissionId: string;
  titre: string | null;
  youtubeUrl: string;
  createdAt: string;
};

interface EpisodeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  emissionId: string | null;
  emissionTitre: string;
  onCountChange?: (count: number) => void;
}

export default function EpisodeManagerModal({
  isOpen,
  onClose,
  emissionId,
  emissionTitre,
  onCountChange,
}: EpisodeManagerModalProps) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [titre, setTitre] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !emissionId) return;
    const load = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${getApiBase()}/api/emissions/${emissionId}/episodes`, { headers: authHeaders() });
        if (response.ok) setEpisodes(await response.json());
      } catch {
        setEpisodes([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isOpen, emissionId]);

  if (!isOpen) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emissionId || !youtubeUrl.trim()) return;
    setError("");
    setSaving(true);
    try {
      const response = await fetch(`${getApiBase()}/api/emissions/${emissionId}/episodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ titre: titre.trim(), youtubeUrl: youtubeUrl.trim() }),
      });
      if (!response.ok) {
        setError("Impossible d'ajouter l'épisode.");
        return;
      }
      const created: Episode = await response.json();
      const next = [created, ...episodes];
      setEpisodes(next);
      onCountChange?.(next.length);
      setTitre("");
      setYoutubeUrl("");
    } catch {
      setError("Impossible de contacter le serveur.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (episode: Episode) => {
    if (!emissionId) return;
    setDeletingId(episode.id);
    try {
      const response = await fetch(`${getApiBase()}/api/emissions/${emissionId}/episodes/${episode.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!response.ok) return;
      const next = episodes.filter((ep) => ep.id !== episode.id);
      setEpisodes(next);
      onCountChange?.(next.length);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
      <div className="flex w-full max-w-2xl max-h-[90vh] flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-stone-100 px-4 py-4 sm:px-6">
          <div>
            <h2 className="text-base font-bold text-stone-900 sm:text-lg">Épisodes</h2>
            <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">{emissionTitre}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto px-4 py-5 space-y-5 sm:px-6">
          <form onSubmit={handleAdd} className="rounded-xl border border-stone-100 bg-stone-50 p-4 space-y-3">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Ajouter un épisode</label>
            <input
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Titre de l'épisode (optionnel)"
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition"
            />
            <input
              required
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition font-mono"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 disabled:opacity-60 transition cursor-pointer">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} Ajouter l&apos;épisode
            </button>
          </form>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
                Épisodes enregistrés ({episodes.length})
              </label>
            </div>
            {loading ? (
              <div className="py-8 text-center text-stone-400"><Loader2 size={18} className="animate-spin mx-auto" /></div>
            ) : episodes.length === 0 ? (
              <p className="py-6 text-center text-sm text-stone-400 italic">Aucun épisode pour le moment.</p>
            ) : (
              <ul className="divide-y divide-stone-50">
                {episodes.map((ep, i) => (
                  <li key={ep.id} className="flex items-center gap-3 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-500">
                      <Play size={13} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-stone-800">
                        {ep.titre || `Épisode ${episodes.length - i}`}
                      </p>
                      <p className="truncate text-xs text-stone-400 font-mono">{ep.youtubeUrl}</p>
                      <p className="text-[11px] text-stone-400">{formatRelativeDate(ep.createdAt)}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(ep)}
                      disabled={deletingId === ep.id}
                      className="shrink-0 rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-500 transition cursor-pointer disabled:opacity-50"
                      title="Supprimer"
                    >
                      {deletingId === ep.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
