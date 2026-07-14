"use client";

import { useEffect, useState } from "react";
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
  const [backendError, setBackendError] = useState("");

  useEffect(() => {
    const loadProgramme = async () => {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
        const response = await fetch(`${apiBase}/api/programme`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
        });

        if (!response.ok) {
          throw new Error("Impossible de charger le programme depuis MySQL.");
        }

        const payload = await response.json();
        setItems(Array.isArray(payload) && payload.length > 0 ? payload : []);
        setBackendError("");
      } catch {
        setItems([]);
        setBackendError("Connexion MySQL indisponible. Demarre XAMPP pour enregistrer le programme.");
      }
    };

    loadProgramme();
  }, []);

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

  const saveItem = async () => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
      const response = await fetch(`${apiBase}/api/programme${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: JSON.stringify({
          heure: form.heure,
          titre: form.titre,
          description: form.description,
          statut: "scheduled",
          date: new Date().toISOString().slice(0, 10),
        }),
      });

      if (!response.ok) {
        throw new Error("save programme failed");
      }

      const saved = await response.json();
      setItems((current) => (editingId ? current.map((item) => (item.id === editingId ? saved : item)) : [saved, ...current]));
      setBackendError("");
    } catch {
      setBackendError("Impossible d'enregistrer: verifie que XAMPP/MySQL et le backend sont ouverts.");
    }

    setShowForm(false);
  };

  const markCurrent = async (id: string) => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
      const response = await fetch(`${apiBase}/api/programme/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: JSON.stringify({ statut: "CURRENT" }),
      });

      if (!response.ok) {
        throw new Error("status failed");
      }

      const saved = await response.json();
      setItems((current) =>
        current.map((item) =>
          item.id === id
            ? saved
            : item.statut === "en-cours"
              ? { ...item, statut: "passé" }
              : item
        )
      );
      setBackendError("");
    } catch {
      setBackendError("Connexion MySQL indisponible. Le programme doit etre relance depuis le backend.");
    }
  };

  const removeItem = async (id: string) => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
      const response = await fetch(`${apiBase}/api/programme/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
      });

      if (!response.ok && response.status !== 204) {
        throw new Error("delete failed");
      }
      setBackendError("");
    } catch {
      setBackendError("Connexion MySQL indisponible. Suppression impossible hors backend.");
    }

    setItems((current) => current.filter((item) => item.id !== id));
  };

  const sortedItems = [...items].sort((left, right) => left.heure.localeCompare(right.heure));
  const currentCount = items.filter((item) => item.statut === "en-cours").length;
  const scheduledCount = items.filter((item) => item.statut === "scheduled").length;

  return (
    <div className="space-y-8 text-slate-900">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700">
              <CalendarDays className="h-4 w-4" />
              Programme du jour administrable
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Planifiez le flux editorial et la grille du jour.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Cette grille alimente la page WebTV quand aucun live n&apos;est en direct, et peut etre adaptee depuis l&apos;espace admin.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Ajouter un slot
          </button>
        </div>

        {backendError ? (
          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {backendError}
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Elements prevus</p>
          <div className="mt-2 text-4xl font-black text-slate-900">{items.length}</div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">En cours</p>
          <div className="mt-2 text-4xl font-black text-slate-900">{currentCount}</div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">A venir</p>
          <div className="mt-2 text-4xl font-black text-slate-900">{scheduledCount}</div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Grille</p>
            <h2 className="text-2xl font-bold text-slate-900">Programme du jour</h2>
          </div>
          <Clock3 className="h-5 w-5 text-sky-500" />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {sortedItems.length > 0 ? (
            sortedItems.map((item) => (
              <div key={item.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-sky-50 px-3 py-2 text-sm font-bold text-sky-700">
                        {item.heure}
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] ${
                          item.statut === "en-cours"
                            ? "bg-sky-50 text-sky-700"
                            : item.statut === "passé"
                              ? "bg-slate-100 text-slate-500"
                              : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {item.statut}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.titre}</h3>
                    <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => markCurrent(item.id)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-3 py-2 text-sm font-semibold text-white"
                  >
                    <Radio className="h-4 w-4" />
                    Marquer en cours
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                  >
                    <PencilLine className="h-4 w-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500 xl:col-span-2">
              Aucun slot programme pour le moment. Ajoute le planning depuis le backend MySQL.
            </div>
          )}
        </div>
      </section>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Edition</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {editingId ? "Modifier le slot" : "Nouveau slot"}
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
                type="time"
                value={form.heure}
                onChange={(event) => setForm((current) => ({ ...current, heure: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
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
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={saveItem} className="rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white">
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
