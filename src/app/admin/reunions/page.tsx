"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const loadReunions = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
        const response = await fetch(`${apiBase}/api/reunions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
        });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        if (Array.isArray(payload) && payload.length > 0) {
          setReunions(payload);
        }
      } catch {
        // keep local seed data
      }
    };

    loadReunions();
  }, []);

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

  const saveReunion = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
      const response = await fetch(`${apiBase}/api/reunions${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: JSON.stringify({
          titre: form.titre,
          description: form.description,
          scheduledAt: new Date(form.scheduledAt).toISOString(),
          host: form.host,
          participants: editingId ? reunions.find((item) => item.id === editingId)?.participants ?? [] : [],
        }),
      });

      if (!response.ok) {
        throw new Error("save reunion failed");
      }

      const saved = await response.json();
      setReunions((current) =>
        editingId ? current.map((item) => (item.id === editingId ? saved : item)) : [saved, ...current]
      );
    } catch {
      const next: AdminReunion = {
        id: editingId ?? `meet_${Date.now()}`,
        titre: form.titre,
        description: form.description,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        host: form.host,
        status: "scheduled",
        participants: editingId ? reunions.find((item) => item.id === editingId)?.participants ?? [] : [],
      };

      if (editingId) {
        setReunions((current) => current.map((item) => (item.id === editingId ? { ...item, ...next } : item)));
      } else {
        setReunions((current) => [next, ...current]);
      }
    }

    setShowForm(false);
  };

  const setStatus = async (id: string, status: AdminReunion["status"]) => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
      const response = await fetch(`${apiBase}/api/reunions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("status failed");
      }
    } catch {
      // fallback below
    }

    setReunions((current) => current.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  const removeReunion = async (id: string) => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
      await fetch(`${apiBase}/api/reunions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
      });
    } catch {
      // fallback below
    }

    setReunions((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-8 text-slate-900">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700">
              <MessageCircle className="h-4 w-4" />
              Reunions admin, pas sur la page publique
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Ordonnez les reunions de production et les points editoriaux.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              L&apos;espace admin sert a planifier, demarrer et terminer les reunions sans afficher les controles au public.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-600"
          >
            <Plus className="h-4 w-4" />
            Nouvelle reunion
          </button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Reunions totales</p>
          <div className="mt-2 text-4xl font-black text-slate-900">{reunions.length}</div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">En cours</p>
          <div className="mt-2 text-4xl font-black text-slate-900">
            {reunions.filter((item) => item.status === "in-progress").length}
          </div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Participants totalises</p>
          <div className="mt-2 text-4xl font-black text-slate-900">
            {reunions.reduce((count, item) => count + item.participants.length, 0)}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Planning</p>
            <h2 className="text-2xl font-bold text-slate-900">Reunions programmees</h2>
          </div>
          <CalendarClock className="h-5 w-5 text-sky-500" />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {reunions.map((reunion) => (
            <div key={reunion.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-900">{reunion.titre}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] ${
                        reunion.status === "in-progress"
                          ? "bg-sky-50 text-sky-700"
                          : reunion.status === "ended"
                            ? "bg-slate-100 text-slate-500"
                            : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {reunion.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{reunion.description}</p>
                  <p className="mt-2 text-xs text-slate-500">Debut: {formatDateTime(reunion.scheduledAt)}</p>
                  <p className="mt-1 text-xs text-slate-500">Responsable: {reunion.host}</p>
                </div>
                <div className="rounded-2xl bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700">
                  {reunion.participants.length} participants
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <Users className="h-4 w-4 text-sky-500" />
                {reunion.participants.join(" - ")}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => setStatus(reunion.id, "in-progress")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-3 py-2 text-sm font-semibold text-white"
                >
                  <PlayCircle className="h-4 w-4" />
                  Demarrer
                </button>
                <button
                  onClick={() => setStatus(reunion.id, "ended")}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                >
                  Terminer
                </button>
                <button
                  onClick={() => openEdit(reunion)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                >
                  <PencilLine className="h-4 w-4" />
                  Modifier
                </button>
                <button
                  onClick={() => removeReunion(reunion.id)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
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
                <p className="text-sm text-slate-500">Preparation</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {editingId ? "Modifier la reunion" : "Nouvelle reunion"}
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
                placeholder="Titre"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Description"
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              <input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(event) => setForm((current) => ({ ...current, scheduledAt: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              <input
                value={form.host}
                onChange={(event) => setForm((current) => ({ ...current, host: event.target.value }))}
                placeholder="Responsable"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={saveReunion} className="rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white">
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
