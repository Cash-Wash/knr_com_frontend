"use client";

import { useEffect, useState } from "react";
import { PencilLine, Plus, Trash2, Users } from "lucide-react";
import { getApiBase, authHeaders, resolveMediaUrl } from "@/lib/api";
import ImageUpload from "@/components/admin/ui/ImageUpload";

type TeamMember = {
  id: string;
  name: string;
  poste: string;
  bio?: string;
  photo?: string;
  status: "draft" | "published";
};

const emptyMember = {
  name: "",
  poste: "",
  bio: "",
  photo: "",
  status: "draft" as TeamMember["status"],
};

export default function AdminEquipePage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyMember);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await fetch(`${getApiBase()}/api/team`, { headers: authHeaders() });
        if (!response.ok) return;
        const payload = await response.json();
        if (Array.isArray(payload)) setMembers(payload);
      } catch {
        // ignore, list stays empty
      }
    };
    loadMembers();
  }, []);

  const startNew = () => {
    setEditingId(null);
    setForm(emptyMember);
    setShowForm(true);
  };

  const editMember = (member: TeamMember) => {
    setEditingId(member.id);
    setForm({
      name: member.name,
      poste: member.poste,
      bio: member.bio ?? "",
      photo: member.photo ?? "",
      status: member.status,
    });
    setShowForm(true);
  };

  const saveMember = async () => {
    setError(null);
    try {
      const response = await fetch(`${getApiBase()}/api/team${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload?.error || "Échec de l'enregistrement.");
        return;
      }

      setMembers((current) =>
        editingId ? current.map((m) => (m.id === editingId ? payload : m)) : [...current, payload]
      );
      setShowForm(false);
      setForm(emptyMember);
      setEditingId(null);
    } catch {
      setError("Impossible de contacter le serveur.");
    }
  };

  const removeMember = async (id: string) => {
    try {
      await fetch(`${getApiBase()}/api/team/${id}`, { method: "DELETE", headers: authHeaders() });
    } catch {
      // fallback below
    }
    setMembers((current) => current.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-8 text-slate-900">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700">
              <Users className="h-4 w-4" />
              Notre équipe
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Gérez les membres affichés publiquement.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Les fiches publiées apparaissent sur la page d&apos;accueil et sur la page à propos.
            </p>
            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          </div>
          <button
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-600"
          >
            <Plus className="h-4 w-4" />
            Nouveau membre
          </button>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="grid gap-4 xl:grid-cols-2">
          {members.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 xl:col-span-2">
              Aucun membre pour le moment.
            </div>
          ) : (
            members.map((member) => (
                <div key={member.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      {member.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={resolveMediaUrl(member.photo)} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                          <Users className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] ${
                            member.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {member.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-sky-700">{member.poste}</p>
                      {member.bio ? <p className="mt-2 text-sm text-slate-600">{member.bio}</p> : null}
                    </div>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button
                      onClick={() => editMember(member)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      <PencilLine className="h-4 w-4" />
                      Modifier
                    </button>
                    <button
                      onClick={() => removeMember(member.id)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </section>

      {showForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Configuration</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {editingId ? "Modifier le membre" : "Nouveau membre"}
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
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Nom complet"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              <input
                value={form.poste}
                onChange={(event) => setForm((current) => ({ ...current, poste: event.target.value }))}
                placeholder="Poste / rôle"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              <ImageUpload
                value={form.photo}
                onChange={(url) => setForm((current) => ({ ...current, photo: url }))}
                label="Photo"
              />
              <textarea
                value={form.bio}
                onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
                placeholder="Courte bio"
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({ ...current, status: event.target.value as TeamMember["status"] }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
              </select>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={saveMember} className="rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white">
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
