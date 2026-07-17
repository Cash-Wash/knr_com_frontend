"use client";

import { useEffect, useState } from "react";
import { PencilLine, Plus, Power, Trash2, Users } from "lucide-react";
import { getApiBase, authHeaders, resolveMediaUrl } from "@/lib/api";
import ImageUpload from "@/components/admin/ui/ImageUpload";

type Socials = {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  whatsapp?: string;
};

type Entrepreneur = {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo?: string;
  socials: Socials;
  active: boolean;
};

const emptyEntrepreneur = {
  name: "",
  role: "",
  bio: "",
  photo: "",
  socials: {} as Socials,
  active: true,
};

const socialFields: { key: keyof Socials; label: string; placeholder: string }[] = [
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@..." },
  { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/229..." },
];

export default function AdminEntrepreneursPage() {
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyEntrepreneur);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEntrepreneurs = async () => {
      try {
        const response = await fetch(`${getApiBase()}/api/entrepreneurs`, { headers: authHeaders() });
        if (!response.ok) return;
        const payload = await response.json();
        if (Array.isArray(payload)) setEntrepreneurs(payload);
      } catch {
        // list stays empty
      }
    };
    loadEntrepreneurs();
  }, []);

  const startNew = () => {
    setEditingId(null);
    setForm(emptyEntrepreneur);
    setShowForm(true);
  };

  const editEntrepreneur = (item: Entrepreneur) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      role: item.role,
      bio: item.bio ?? "",
      photo: item.photo ?? "",
      socials: item.socials ?? {},
      active: item.active,
    });
    setShowForm(true);
  };

  const saveEntrepreneur = async () => {
    setError(null);
    try {
      const response = await fetch(`${getApiBase()}/api/entrepreneurs${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload?.error || "Échec de l'enregistrement.");
        return;
      }

      setEntrepreneurs((current) =>
        editingId ? current.map((e) => (e.id === editingId ? payload : e)) : [payload, ...current]
      );
      setShowForm(false);
      setForm(emptyEntrepreneur);
      setEditingId(null);
    } catch {
      setError("Impossible de contacter le serveur.");
    }
  };

  const toggleActive = async (item: Entrepreneur) => {
    try {
      const response = await fetch(`${getApiBase()}/api/entrepreneurs/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ active: !item.active }),
      });
      if (!response.ok) return;
      const updated = await response.json();
      setEntrepreneurs((current) => current.map((e) => (e.id === item.id ? updated : e)));
    } catch {
      // ignore
    }
  };

  const removeEntrepreneur = async (id: string) => {
    try {
      await fetch(`${getApiBase()}/api/entrepreneurs/${id}`, { method: "DELETE", headers: authHeaders() });
    } catch {
      // fallback below
    }
    setEntrepreneurs((current) => current.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-8 text-slate-900">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700">
              <Users className="h-4 w-4" />
              Entrepreneurs
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Gérez les entrepreneurs affichés sur le site.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Seuls les entrepreneurs actifs apparaissent sur la page d&apos;accueil.
            </p>
            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          </div>
          <button
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-600"
          >
            <Plus className="h-4 w-4" />
            Nouvel entrepreneur
          </button>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="grid gap-4 xl:grid-cols-2">
          {entrepreneurs.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500 xl:col-span-2">
              Aucun entrepreneur pour le moment.
            </div>
          ) : (
            entrepreneurs.map((item) => (
              <div key={item.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    {item.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={resolveMediaUrl(item.photo)} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300">
                        <Users className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] ${
                          item.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.active ? "Actif" : "Inactif"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-sky-700">{item.role}</p>
                    {item.bio ? <p className="mt-2 text-sm text-slate-600">{item.bio}</p> : null}
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleActive(item)}
                    className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                      item.active
                        ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                        : "bg-emerald-500 text-white hover:bg-emerald-600"
                    }`}
                  >
                    <Power className="h-4 w-4" />
                    {item.active ? "Désactiver" : "Activer"}
                  </button>
                  <button
                    onClick={() => editEntrepreneur(item)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <PencilLine className="h-4 w-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => removeEntrepreneur(item.id)}
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
          <div className="flex w-full max-w-2xl max-h-[90vh] flex-col rounded-[32px] border border-slate-200 bg-white shadow-2xl">
            <div className="flex shrink-0 items-center justify-between gap-4 px-6 pt-6 pb-4">
              <div>
                <p className="text-sm text-slate-500">Configuration</p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {editingId ? "Modifier l'entrepreneur" : "Nouvel entrepreneur"}
                </h3>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700"
              >
                Fermer
              </button>
            </div>

            <div className="grid gap-4 overflow-y-auto px-6 pb-2">
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Nom complet"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
              />
              <input
                value={form.role}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                placeholder="Rôle / titre (ex. Fondateur & CEO)"
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

              <div className="rounded-2xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Réseaux sociaux</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {socialFields.map((field) => (
                    <input
                      key={field.key}
                      value={form.socials[field.key] ?? ""}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          socials: { ...current.socials, [field.key]: event.target.value },
                        }))
                      }
                      placeholder={`${field.label} — ${field.placeholder}`}
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                    />
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Actif (visible sur le site)
              </label>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3 px-6 pt-4 pb-6">
              <button onClick={saveEntrepreneur} className="rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white">
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
