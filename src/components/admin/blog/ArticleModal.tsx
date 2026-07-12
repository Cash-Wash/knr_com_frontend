"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Plus, Upload, X } from "lucide-react";
import type { Article, ArticleCategory, ArticleStatus, Section } from "./types";

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ArticleCategory[];
  article?: Article | null;
  onSubmit: (data: Omit<Article, "id">) => void;
}

function buildInitialForm(article?: Article | null) {
  if (article) {
    return {
      slug: article.slug, categorie: article.categorie, titre: article.titre,
      extrait: article.extrait, auteur: article.auteur, date: article.date,
      dateISO: article.dateISO, tempsLecture: article.tempsLecture, img: article.img,
      featured: article.featured, status: article.status,
      intro: article.contenu.intro, citation: article.contenu.citation ?? "",
      conclusion: article.contenu.conclusion ?? "",
    };
  }
  return {
    slug: "", categorie: "", titre: "", extrait: "", auteur: "",
    date: "", dateISO: "", tempsLecture: "", img: "", featured: false,
    status: "draft" as ArticleStatus,
    intro: "", citation: "", conclusion: "",
  };
}

function buildInitialSections(article?: Article | null): Section[] {
  return article && article.contenu.sections.length > 0
    ? article.contenu.sections
    : [{ sousTitre: "", paragraphe: "" }];
}

// Remonté via une `key` côté appelant à chaque ouverture (voir page.tsx) : l'état
// initial ci-dessous suffit donc à refléter l'article édité, sans effet de reset.
export default function ArticleModal({ isOpen, onClose, categories, article, onSubmit }: ArticleModalProps) {
  const isEdit = !!article;
  const [form, setForm] = useState(() => buildInitialForm(article));
  const [sections, setSections] = useState<Section[]>(() => buildInitialSections(article));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      onSubmit({
        slug: form.slug, categorie: form.categorie, titre: form.titre,
        extrait: form.extrait, auteur: form.auteur, date: form.date,
        dateISO: form.dateISO, tempsLecture: form.tempsLecture, img: form.img,
        featured: form.featured, status: form.status,
        contenu: { intro: form.intro, sections, citation: form.citation, conclusion: form.conclusion },
      });
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
            {isEdit ? "Modifier l'article" : "Nouvel article"}
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
                placeholder="Titre de l'article"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Slug *</label>
              <input required value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="slug-de-larticle"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition font-mono" />
            </div>
          </div>

          {/* Catégorie + Auteur */}
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
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Auteur *</label>
              <input required value={form.auteur} onChange={(e) => setForm((f) => ({ ...f, auteur: e.target.value }))}
                placeholder="Nom de l'auteur"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
          </div>

          {/* Date + temps de lecture */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Date affichée</label>
              <input value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                placeholder="ex: Il y a 2 jours"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Date ISO</label>
              <input value={form.dateISO} onChange={(e) => setForm((f) => ({ ...f, dateISO: e.target.value }))}
                placeholder="ex: 12 Octobre 2023"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Temps de lecture</label>
              <input value={form.tempsLecture} onChange={(e) => setForm((f) => ({ ...f, tempsLecture: e.target.value }))}
                placeholder="ex: 5 min de lecture"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
          </div>

          {/* Image URL */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Image (chemin)</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input value={form.img} onChange={(e) => setForm((f) => ({ ...f, img: e.target.value }))}
                placeholder="/images/blog/article.jpg"
                className="flex-1 rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
              <button type="button" className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition cursor-pointer">
                <Upload size={13} /> Upload
              </button>
            </div>
          </div>

          {/* Extrait */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Extrait *</label>
            <textarea required rows={2} value={form.extrait} onChange={(e) => setForm((f) => ({ ...f, extrait: e.target.value }))}
              placeholder="Résumé court de l'article (affiché dans les listes)"
              className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition resize-none" />
          </div>

          {/* Contenu — Intro */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Introduction *</label>
            <textarea required rows={3} value={form.intro} onChange={(e) => setForm((f) => ({ ...f, intro: e.target.value }))}
              placeholder="Paragraphe d'introduction de l'article"
              className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition resize-none" />
          </div>

          {/* Sections */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Sections du contenu</label>
              <button type="button" onClick={() => setSections((s) => [...s, { sousTitre: "", paragraphe: "" }])}
                className="inline-flex items-center gap-1 rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs font-semibold text-sky-600 hover:bg-sky-100 transition cursor-pointer">
                <Plus size={12} /> Ajouter une section
              </button>
            </div>
            {sections.map((sec, i) => (
              <div key={i} className="rounded-xl border border-stone-100 bg-stone-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500">Section {i + 1}</span>
                  {sections.length > 1 && (
                    <button type="button" onClick={() => setSections((s) => s.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-600 transition cursor-pointer">
                      <X size={13} />
                    </button>
                  )}
                </div>
                <input value={sec.sousTitre}
                  onChange={(e) => setSections((s) => s.map((x, j) => j === i ? { ...x, sousTitre: e.target.value } : x))}
                  placeholder="Sous-titre (optionnel)"
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
                <textarea rows={3} value={sec.paragraphe}
                  onChange={(e) => setSections((s) => s.map((x, j) => j === i ? { ...x, paragraphe: e.target.value } : x))}
                  placeholder="Contenu du paragraphe *"
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition resize-none" />
              </div>
            ))}
          </div>

          {/* Citation */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Citation (optionnel)</label>
            <input value={form.citation} onChange={(e) => setForm((f) => ({ ...f, citation: e.target.value }))}
              placeholder="&quot;Une citation marquante de l'article&quot;"
              className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
          </div>

          {/* Conclusion */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Conclusion (optionnel)</label>
            <textarea rows={2} value={form.conclusion} onChange={(e) => setForm((f) => ({ ...f, conclusion: e.target.value }))}
              placeholder="Paragraphe de conclusion"
              className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition resize-none" />
          </div>

          {/* Options */}
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-stone-100 bg-stone-50 px-4 py-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                className="rounded border-stone-300 text-sky-500 focus:ring-sky-400" />
              <span className="text-sm font-medium text-stone-700">Article à la une</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.status === "published"}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.checked ? "published" : "draft" }))}
                className="rounded border-stone-300 text-sky-500 focus:ring-sky-400" />
              <span className="text-sm font-medium text-stone-700">Publier immédiatement</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <button type="button" onClick={onClose}
              className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition cursor-pointer">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 disabled:opacity-60 transition cursor-pointer">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Enregistrement…</> : isEdit ? <><CheckCircle2 size={14} /> Mettre à jour</> : "Créer l'article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
