"use client";

import { useState } from "react";
import { Eye, FileVideo, PencilLine, Plus, Radio, Trash2 } from "lucide-react";
import { AdminEmission, adminSeedEmissions } from "@/lib/admin-demo-data";

const emptyEmission = {
  titre: "",
  description: "",
  date: "",
  views: "",
  thumbnail: "/images/webtv1.png",
};

export default function AdminEmissionsPage() {
  const [items, setItems] = useState<AdminEmission[]>(adminSeedEmissions);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyEmission);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyEmission);
    setShowForm(true);
  };

  const openEdit = (item: AdminEmission) => {
    setEditingId(item.id);
    setForm({
      titre: item.titre,
      description: item.description,
      date: item.date,
      views: item.views,
      thumbnail: item.thumbnail,
    });
    setShowForm(true);
  };

  const saveEmission = () => {
    const next: AdminEmission = {
      id: editingId ?? `emi_${Date.now()}`,
      titre: form.titre,
      description: form.description,
      date: form.date,
      status: editingId ? "draft" : "draft",
      views: form.views,
      thumbnail: form.thumbnail,
    };

    if (editingId) {
      setItems((current) => current.map((item) => (item.id === editingId ? { ...item, ...next } : item)));
    } else {
      setItems((current) => [next, ...current]);
    }

    setShowForm(false);
  };

  const togglePublish = (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "published" ? "draft" : "published",
            }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-100">
              <FileVideo className="h-4 w-4" />
              Emissions et replay
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Publiez et personnalisez les emissions du catalogue.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Ajoutez une emission, modifiez ses infos, puis publiez-la dans le catalogue public ou pour la WebTV.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950"
          >
            <Plus className="h-4 w-4" />
            Nouvelle emission
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Catalogue</p>
          <div className="mt-2 text-4xl font-black text-white">{items.length}</div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Publiees</p>
          <div className="mt-2 text-4xl font-black text-white">
            {items.filter((item) => item.status === "published").length}
          </div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Brouillons</p>
          <div className="mt-2 text-4xl font-black text-white">
            {items.filter((item) => item.status === "draft").length}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/60 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Replay</p>
            <h2 className="text-2xl font-bold text-white">Gestion des emissions</h2>
          </div>
          <Eye className="h-5 w-5 text-sky-400" />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="flex gap-4">
                <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-2xl bg-black/40">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.thumbnail})` }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{item.titre}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] ${
                        item.status === "published"
                          ? "bg-emerald-400/15 text-emerald-200"
                          : "bg-amber-400/15 text-amber-200"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
                    <span>Date: {item.date}</span>
                    <span>Vues: {item.views}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => togglePublish(item.id)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-3 py-2 text-sm font-semibold text-slate-950"
                >
                  <Radio className="h-4 w-4" />
                  {item.status === "published" ? "Depublier" : "Publier"}
                </button>
                <button
                  onClick={() => openEdit(item)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                >
                  <PencilLine className="h-4 w-4" />
                  Modifier
                </button>
                <button
                  onClick={() => removeItem(item.id)}
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
                <p className="text-sm text-slate-400">Emission</p>
                <h3 className="text-2xl font-bold text-white">
                  {editingId ? "Modifier l'emission" : "Nouvelle emission"}
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
              <input
                value={form.date}
                onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                placeholder="Date"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
              <input
                value={form.views}
                onChange={(event) => setForm((current) => ({ ...current, views: event.target.value }))}
                placeholder="Vues"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
              <input
                value={form.thumbnail}
                onChange={(event) => setForm((current) => ({ ...current, thumbnail: event.target.value }))}
                placeholder="Thumbnail"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Description"
                rows={5}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={saveEmission}
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
