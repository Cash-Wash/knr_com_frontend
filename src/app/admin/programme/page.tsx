"use client";

import { useState } from "react";
import { CalendarDays, Clock3, PencilLine, Plus, Radio, Trash2 } from "lucide-react";
import { AdminProgrammeItem, adminSeedProgramme } from "@/lib/admin-demo-data";

const emptyProgramme = {
  heure: "",
  titre: "",
  description: "",
};

export default function AdminProgrammePage() {
  const [items, setItems] = useState<AdminProgrammeItem[]>(adminSeedProgramme);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProgramme);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyProgramme);
    setShowForm(true);
  };

  const openEdit = (item: AdminProgrammeItem) => {
    setEditingId(item.id);
    setForm({
      heure: item.heure,
      titre: item.titre,
      description: item.description,
    });
    setShowForm(true);
  };

  const saveItem = () => {
    const next: AdminProgrammeItem = {
      id: editingId ?? `pro_${Date.now()}`,
      heure: form.heure,
      titre: form.titre,
      description: form.description,
      statut: editingId ? "scheduled" : "scheduled",
      date: "2026-07-12",
    };

    if (editingId) {
      setItems((current) => current.map((item) => (item.id === editingId ? { ...item, ...next } : item)));
    } else {
      setItems((current) => [...current, next]);
    }

    setShowForm(false);
  };

  const markCurrent = (id: string) => {
    setItems((current) =>
      current.map((item) => ({
        ...item,
        statut: item.id === id ? "en-cours" : item.statut === "en-cours" ? "passé" : item.statut,
      }))
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
              <CalendarDays className="h-4 w-4" />
              Programme du jour administrable
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Planifiez le flux editorial et la grille du jour.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Cette grille alimente la page WebTV quand aucun live n&apos;est en direct, et peut etre adaptee depuis l&apos;espace admin.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950"
          >
            <Plus className="h-4 w-4" />
            Ajouter un slot
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Elements prevus</p>
          <div className="mt-2 text-4xl font-black text-white">{items.length}</div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">En cours</p>
          <div className="mt-2 text-4xl font-black text-white">
            {items.filter((item) => item.statut === "en-cours").length}
          </div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">A venir</p>
          <div className="mt-2 text-4xl font-black text-white">
            {items.filter((item) => item.statut === "scheduled").length}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/60 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Grille</p>
            <h2 className="text-2xl font-bold text-white">Programme du jour</h2>
          </div>
          <Clock3 className="h-5 w-5 text-sky-400" />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {items
            .slice()
            .sort((left, right) => left.heure.localeCompare(right.heure))
            .map((item) => (
              <div key={item.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-sky-400/10 px-3 py-2 text-sm font-bold text-sky-100">
                        {item.heure}
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] ${
                          item.statut === "en-cours"
                            ? "bg-sky-400/15 text-sky-200"
                            : item.statut === "passé"
                            ? "bg-white/10 text-slate-400"
                            : "bg-emerald-400/15 text-emerald-200"
                        }`}
                      >
                        {item.statut}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">{item.titre}</h3>
                    <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => markCurrent(item.id)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-3 py-2 text-sm font-semibold text-slate-950"
                  >
                    <Radio className="h-4 w-4" />
                    Marquer en cours
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
              </div>
            ))}
        </div>
      </section>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-[32px] border border-white/10 bg-slate-950 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Edition</p>
                <h3 className="text-2xl font-bold text-white">
                  {editingId ? "Modifier le slot" : "Nouveau slot"}
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
                type="time"
                value={form.heure}
                onChange={(event) => setForm((current) => ({ ...current, heure: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              />
              <input
                value={form.titre}
                onChange={(event) => setForm((current) => ({ ...current, titre: event.target.value }))}
                placeholder="Titre"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Description"
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={saveItem} className="rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950">
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
