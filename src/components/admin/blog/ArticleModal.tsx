"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import type { Article, ArticleCategory, ArticleStatus } from "./types";
import ImageUpload from "@/components/admin/ui/ImageUpload";
import RichTextEditor from "@/components/admin/ui/RichTextEditor";

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ArticleCategory[];
  article?: Article | null;
  onSubmit: (data: Omit<Article, "id" | "auteur">) => void;
}

function buildInitialForm(article?: Article | null) {
  if (article) {
    return {
      slug: article.slug, categorie: article.categorie, titre: article.titre,
      extrait: article.extrait, tempsLecture: article.tempsLecture, img: article.img,
      featured: article.featured, status: article.status, content: article.content,
    };
  }
  return {
    slug: "", categorie: "", titre: "", extrait: "",
    tempsLecture: "", img: "", featured: false,
    status: "draft" as ArticleStatus, content: "",
  };
}

export default function ArticleModal({ isOpen, onClose, categories, article, onSubmit }: ArticleModalProps) {
  const isEdit = !!article;
  const [form, setForm] = useState(() => buildInitialForm(article));
  const [saving, setSaving] = useState(false);

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
      onSubmit({ ...form });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
      <div className="flex w-full max-w-3xl max-h-[90vh] flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-stone-100 px-4 py-4 sm:px-6">
          <h2 className="text-base font-bold text-stone-900 sm:text-lg">
            {isEdit ? "Modifier l'article" : "Nouvel article"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-4 py-5 space-y-5 sm:px-6">
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
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Temps de lecture</label>
              <input value={form.tempsLecture} onChange={(e) => setForm((f) => ({ ...f, tempsLecture: e.target.value }))}
                placeholder="ex: 5 min de lecture"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
          </div>

          <ImageUpload value={form.img} onChange={(url) => setForm((f) => ({ ...f, img: url }))} label="Vignette" />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Extrait *</label>
            <textarea required rows={2} value={form.extrait} onChange={(e) => setForm((f) => ({ ...f, extrait: e.target.value }))}
              placeholder="Résumé court de l'article (affiché dans les listes)"
              className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition resize-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Contenu *</label>
            <RichTextEditor value={form.content} onChange={(html) => setForm((f) => ({ ...f, content: html }))} />
          </div>

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
