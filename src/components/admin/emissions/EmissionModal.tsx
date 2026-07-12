"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Plus, Upload, X } from "lucide-react";
import type { Emission } from "@/lib/emissions-data";
import type { EmissionCategory } from "./types";

interface EmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: EmissionCategory[];
  emission?: Emission | null;
  onSubmit: (data: Emission, originalSlug?: string) => void;
}

function buildInitialForm(emission?: Emission | null) {
  if (emission) return { ...emission };
  return {
    slug: "", categorie: "", titre: "", sousTitre: "", description: "",
    episodes: 0, duree: "", img: "", videoUrl: "", animateur: "",
  };
}

// Remonté via une `key` côté appelant à chaque ouverture (voir page.tsx) : l'état
// initial ci-dessous suffit donc à refléter l'émission éditée, sans effet de reset.
export default function EmissionModal({ isOpen, onClose, categories, emission, onSubmit }: EmissionModalProps) {
  const isEdit = !!emission;
  const [form, setForm] = useState(() => buildInitialForm(emission));
  const [tags, setTags] = useState<string[]>(() => emission?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const slugify = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleTitreChange = (v: string) => {
    setForm((f) => ({ ...f, titre: v, slug: isEdit ? f.slug : slugify(v) }));
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) setTags((t) => [...t, trimmed]);
    setTagInput("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      onSubmit({ ...form, tags }, emission?.slug);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
      <div className="flex w-full max-w-3xl max-h-[90vh] flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-stone-100 px-4 py-4 sm:px-6">
          <h2 className="text-base font-bold text-stone-900 sm:text-lg">
            {isEdit ? "Modifier l'émission" : "Nouvelle émission"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-4 py-5 space-y-5 sm:px-6">
          {/* Titre + slug */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Titre *</label>
              <input required value={form.titre} onChange={(e) => handleTitreChange(e.target.value)}
                placeholder="Titre de l'émission"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Slug *</label>
              <input required value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="slug-de-lemission"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition font-mono" />
            </div>
          </div>

          {/* Sous-titre */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Sous-titre *</label>
            <input required value={form.sousTitre} onChange={(e) => setForm((f) => ({ ...f, sousTitre: e.target.value }))}
              placeholder="ex: L'innovation au quotidien"
              className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
          </div>

          {/* Catégorie + Animateur */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Catégorie *</label>
              <select required value={form.categorie} onChange={(e) => setForm((f) => ({ ...f, categorie: e.target.value }))}
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition cursor-pointer">
                <option value="">Sélectionner une catégorie</option>
                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Animateur *</label>
              <input required value={form.animateur} onChange={(e) => setForm((f) => ({ ...f, animateur: e.target.value }))}
                placeholder="Nom de l'animateur"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
          </div>

          {/* Episodes + durée */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Nombre d&apos;épisodes *</label>
              <input required type="number" min={0} value={form.episodes}
                onChange={(e) => setForm((f) => ({ ...f, episodes: Number(e.target.value) }))}
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Durée / épisode *</label>
              <input required value={form.duree} onChange={(e) => setForm((f) => ({ ...f, duree: e.target.value }))}
                placeholder="ex: 45 min"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
          </div>

          {/* Image + Vidéo */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Image (chemin)</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input value={form.img} onChange={(e) => setForm((f) => ({ ...f, img: e.target.value }))}
                placeholder="/images/emission.jpg"
                className="flex-1 rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
              <button type="button" className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition cursor-pointer">
                <Upload size={13} /> Upload
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">URL de la vidéo (embed) *</label>
            <input required value={form.videoUrl} onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
              placeholder="https://www.youtube.com/embed/..."
              className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition font-mono" />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Description *</label>
            <textarea required rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Description complète de l'émission"
              className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition resize-none" />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Tags</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="ex: Tech (Entrée pour ajouter)"
                className="flex-1 rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
              <button type="button" onClick={addTag}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-xs font-semibold text-sky-600 hover:bg-sky-100 transition cursor-pointer">
                <Plus size={13} /> Ajouter
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-xs font-semibold text-sky-600">
                    {tag}
                    <button type="button" onClick={() => setTags((t) => t.filter((x) => x !== tag))}
                      className="text-sky-400 hover:text-sky-700 transition cursor-pointer">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <button type="button" onClick={onClose}
              className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition cursor-pointer">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 disabled:opacity-60 transition cursor-pointer">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Enregistrement…</> : isEdit ? <><CheckCircle2 size={14} /> Mettre à jour</> : "Créer l'émission"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
