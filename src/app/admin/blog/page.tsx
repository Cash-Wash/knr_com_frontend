"use client";

import { useState } from "react";
import { FileText, PencilLine, Plus, Radio, ShieldCheck, Trash2 } from "lucide-react";
import { AdminArticle, adminSeedArticles, createSlug } from "@/lib/admin-demo-data";

const emptyArticle = {
  titre: "",
  content: "",
  category: "Actualite",
  status: "draft" as const,
  author: "Aminata Diallo",
};

export default function AdminBlogPage() {
  const [articles, setArticles] = useState<AdminArticle[]>(adminSeedArticles);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyArticle);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyArticle);
    setShowForm(true);
  };

  const openEdit = (article: AdminArticle) => {
    setEditingId(article.id);
    setForm({
      titre: article.titre,
      content: article.content,
      category: article.category,
      status: article.status,
      author: article.author,
    });
    setShowForm(true);
  };

  const saveArticle = () => {
    const next: AdminArticle = {
      id: editingId ?? `art_${Date.now()}`,
      titre: form.titre,
      slug: createSlug(form.titre),
      content: form.content,
      status: form.status,
      author: form.author,
      category: form.category,
      publishedAt: form.status === "published" ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      setArticles((current) => current.map((article) => (article.id === editingId ? { ...article, ...next } : article)));
    } else {
      setArticles((current) => [next, ...current]);
    }

    setShowForm(false);
  };

  const togglePublish = (id: string) => {
    setArticles((current) =>
      current.map((article) =>
        article.id === id
          ? {
              ...article,
              status: article.status === "published" ? "draft" : "published",
              publishedAt: article.status === "published" ? undefined : new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : article
      )
    );
  };

  const removeArticle = (id: string) => {
    setArticles((current) => current.filter((article) => article.id !== id));
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-100">
              <FileText className="h-4 w-4" />
              Edition et publication
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Publiez des articles plus vite, avec une presentation plus forte.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
              Les brouillons, les articles publies et la signature de l&apos;auteur sont gerees depuis le panneau admin.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950"
          >
            <Plus className="h-4 w-4" />
            Nouvel article
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Articles totaux</p>
          <div className="mt-2 text-4xl font-black text-white">{articles.length}</div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Publies</p>
          <div className="mt-2 text-4xl font-black text-white">
            {articles.filter((article) => article.status === "published").length}
          </div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Brouillons</p>
          <div className="mt-2 text-4xl font-black text-white">
            {articles.filter((article) => article.status === "draft").length}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/60 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Contenu</p>
            <h2 className="text-2xl font-bold text-white">Articles du blog</h2>
          </div>
          <ShieldCheck className="h-5 w-5 text-sky-400" />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {articles.map((article) => (
            <article key={article.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{article.titre}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] ${
                        article.status === "published"
                          ? "bg-emerald-400/15 text-emerald-200"
                          : "bg-amber-400/15 text-amber-200"
                      }`}
                    >
                      {article.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{article.content}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                    <span>Auteur: {article.author}</span>
                    <span>Slug: {article.slug}</span>
                    <span>Categorie: {article.category}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => togglePublish(article.id)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-3 py-2 text-sm font-semibold text-slate-950"
                >
                  <Radio className="h-4 w-4" />
                  {article.status === "published" ? "Repasser en brouillon" : "Publier"}
                </button>
                <button
                  onClick={() => openEdit(article)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                >
                  <PencilLine className="h-4 w-4" />
                  Modifier
                </button>
                <button
                  onClick={() => removeArticle(article.id)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-slate-950 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Redaction</p>
                <h3 className="text-2xl font-bold text-white">
                  {editingId ? "Modifier l'article" : "Nouveau article"}
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
                placeholder="Titre"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  placeholder="Categorie"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                />
                <input
                  value={form.author}
                  onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))}
                  placeholder="Auteur"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                />
              </div>
              <textarea
                value={form.content}
                onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                placeholder="Contenu"
                rows={8}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={saveArticle}
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
