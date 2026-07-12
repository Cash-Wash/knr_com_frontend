"use client";

import { useState } from "react";
import { CalendarClock, MessageCircle, PencilLine, Plus, PlayCircle, Trash2, Users } from "lucide-react";
import { AdminReunion, adminSeedReunions, formatDateTime } from "@/lib/admin-demo-data";

const emptyReunion = {
  titre: "",
  description: "",
  scheduledAt: "",
  host: "",
};

export default function AdminReunionsPage() {
  const [reunions, setReunions] = useState<AdminReunion[]>(adminSeedReunions);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyReunion);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyReunion);
    setShowForm(true);
  };

  const openEdit = (reunion: AdminReunion) => {
    setEditingId(reunion.id);
    setForm({
      titre: reunion.titre,
      description: reunion.description,
      scheduledAt: reunion.scheduledAt.slice(0, 16),
      host: reunion.host,
    });
    setShowForm(true);
  };

  const saveReunion = () => {
    const next: AdminReunion = {
      id: editingId ?? `meet_${Date.now()}`,
      titre: form.titre,
      description: form.description,
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      host: form.host,
      status: editingId ? "scheduled" : "scheduled",
      participants: editingId ? reunions.find((item) => item.id === editingId)?.participants ?? [] : [],
    };

    if (editingId) {
      setReunions((current) => current.map((item) => (item.id === editingId ? { ...item, ...next } : item)));
    } else {
      setReunions((current) => [next, ...current]);
    }

    setShowForm(false);
  };

  const setStatus = (id: string, status: AdminReunion["status"]) => {
    setReunions((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const removeReunion = (id: string) => {
    setReunions((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-sm text-sky-100">
              <MessageCircle className="h-4 w-4" />
              Reunions admin, pas sur la page publique
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Ordonnez les reunions de production et les points editoriaux.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
              L&apos;espace admin sert a planifier, demarrer et terminer les reunions sans afficher les controles au public.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            Nouvelle reunion
          </button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Reunions totales</p>
          <div className="mt-2 text-4xl font-black text-white">{reunions.length}</div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">En cours</p>
          <div className="mt-2 text-4xl font-black text-white">
            {reunions.filter((item) => item.status === "in-progress").length}
          </div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Participants totalises</p>
          <div className="mt-2 text-4xl font-black text-white">
            {reunions.reduce((count, item) => count + item.participants.length, 0)}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-slate-950/60 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-400">Planning</p>
            <h2 className="text-2xl font-bold text-white">Reunions programmees</h2>
          </div>
          <CalendarClock className="h-5 w-5 text-sky-400" />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {reunions.map((reunion) => (
            <div key={reunion.id} className="rounded-[28px] border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{reunion.titre}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] ${
                        reunion.status === "in-progress"
                          ? "bg-sky-400/15 text-sky-200"
                          : reunion.status === "ended"
                          ? "bg-white/10 text-slate-400"
                          : "bg-emerald-400/15 text-emerald-200"
                      }`}
                    >
                      {reunion.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{reunion.description}</p>
                  <p className="mt-2 text-xs text-slate-400">Debut: {formatDateTime(reunion.scheduledAt)}</p>
                  <p className="mt-1 text-xs text-slate-400">Responsable: {reunion.host}</p>
                </div>
                <div className="rounded-2xl bg-sky-400/10 px-3 py-2 text-sm font-semibold text-sky-100">
                  {reunion.participants.length} participants
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                <Users className="h-4 w-4 text-sky-300" />
                {reunion.participants.join(" - ")}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => setStatus(reunion.id, "in-progress")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-sky-400 px-3 py-2 text-sm font-semibold text-slate-950"
                >
                  <PlayCircle className="h-4 w-4" />
                  Demarrer
                </button>
                <button
                  onClick={() => setStatus(reunion.id, "ended")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                >
                  Terminer
                </button>
                <button
                  onClick={() => openEdit(reunion)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
                >
                  <PencilLine className="h-4 w-4" />
                  Modifier
                </button>
                <button
                  onClick={() => removeReunion(reunion.id)}
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
          <div className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-slate-950 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Preparation</p>
                <h3 className="text-2xl font-bold text-white">
                  {editingId ? "Modifier la reunion" : "Nouvelle reunion"}
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
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Description"
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(event) => setForm((current) => ({ ...current, scheduledAt: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              />
              <input
                value={form.host}
                onChange={(event) => setForm((current) => ({ ...current, host: event.target.value }))}
                placeholder="Responsable"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={saveReunion}
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
