"use client";

import { useEffect, useState } from "react";
import { Camera, CalendarDays, Loader2, PencilLine, Plus, Trash2, X } from "lucide-react";
import { getApiBase, authHeaders, resolveMediaUrl } from "@/lib/api";
import ImageUpload from "@/components/admin/ui/ImageUpload";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";

type Equipment = {
  id: string;
  name: string;
  category: string;
  status: string;
  description: string;
  location: string;
  image: string;
  tarifJour: number;
  caution: string;
  images: string[];
  specs: { label: string; valeur: string }[];
  conditions: string[];
  reservedDates: string[];
};

const emptyForm = {
  name: "",
  category: "",
  description: "",
  location: "",
  image: "",
  tarifJour: 0,
  caution: "",
  status: "AVAILABLE",
  images: [] as string[],
  specs: [] as { label: string; valeur: string }[],
  conditions: [] as string[],
  reservedDates: [] as string[],
};

export default function AdminLocationPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [specLabel, setSpecLabel] = useState("");
  const [specValeur, setSpecValeur] = useState("");
  const [conditionInput, setConditionInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [calendarFor, setCalendarFor] = useState<Equipment | null>(null);
  const [calendarDates, setCalendarDates] = useState<string[]>([]);
  const [savingCalendar, setSavingCalendar] = useState(false);

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const response = await fetch(`${getApiBase()}/api/equipment`, { headers: authHeaders() });
        if (!response.ok) return;
        const payload = await response.json();
        if (Array.isArray(payload)) setEquipment(payload);
      } catch {
        setEquipment([]);
      }
    };
    loadEquipment();
  }, []);

  const startNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const editEquipment = (item: Equipment) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category ?? "",
      description: item.description ?? "",
      location: item.location ?? "",
      image: item.image ?? "",
      tarifJour: item.tarifJour ?? 0,
      caution: item.caution ?? "",
      status: item.status || "AVAILABLE",
      images: Array.isArray(item.images) ? item.images : [],
      specs: Array.isArray(item.specs) ? item.specs : [],
      conditions: Array.isArray(item.conditions) ? item.conditions : [],
      reservedDates: Array.isArray(item.reservedDates) ? item.reservedDates : [],
    });
    setShowForm(true);
  };

  const saveEquipment = async () => {
    setError(null);
    try {
      const response = await fetch(`${getApiBase()}/api/equipment${editingId ? `/${editingId}` : ""}`, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload?.error || "Échec de l'enregistrement.");
        return;
      }
      setEquipment((current) =>
        editingId ? current.map((e) => (e.id === editingId ? payload : e)) : [...current, payload]
      );
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch {
      setError("Impossible de contacter le serveur.");
    }
  };

  const removeEquipment = async (id: string) => {
    try {
      await fetch(`${getApiBase()}/api/equipment/${id}`, { method: "DELETE", headers: authHeaders() });
    } catch {
      // fallback below
    }
    setEquipment((current) => current.filter((e) => e.id !== id));
  };

  const addSpec = () => {
    if (!specLabel.trim() || !specValeur.trim()) return;
    setForm((current) => ({ ...current, specs: [...current.specs, { label: specLabel, valeur: specValeur }] }));
    setSpecLabel("");
    setSpecValeur("");
  };

  const addCondition = () => {
    if (!conditionInput.trim()) return;
    setForm((current) => ({ ...current, conditions: [...current.conditions, conditionInput] }));
    setConditionInput("");
  };

  const addReservedDate = () => {
    if (!dateInput || form.reservedDates.includes(dateInput)) return;
    setForm((current) => ({ ...current, reservedDates: [...current.reservedDates, dateInput].sort() }));
    setDateInput("");
  };

  const openCalendar = (item: Equipment) => {
    setCalendarFor(item);
    setCalendarDates(Array.isArray(item.reservedDates) ? item.reservedDates : []);
  };

  const toggleCalendarDate = (iso: string) => {
    setCalendarDates((current) =>
      current.includes(iso) ? current.filter((d) => d !== iso) : [...current, iso].sort()
    );
  };

  const saveCalendar = async () => {
    if (!calendarFor) return;
    setSavingCalendar(true);
    try {
      const response = await fetch(`${getApiBase()}/api/equipment/${calendarFor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ reservedDates: calendarDates }),
      });
      if (!response.ok) return;
      const updated = await response.json();
      setEquipment((current) => current.map((e) => (e.id === calendarFor.id ? updated : e)));
      setCalendarFor(null);
    } finally {
      setSavingCalendar(false);
    }
  };

  const availableCount = equipment.filter((e) => e.status === "AVAILABLE").length;

  return (
    <div className="space-y-6 text-slate-900">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm text-sky-700">
              <Camera className="h-4 w-4" />
              Location d&apos;équipements
            </div>
            <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Gérez le catalogue d&apos;équipements proposés en location.
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              Ajoutez un produit, ses tarifs, ses photos et les jours déjà réservés — affiché automatiquement sur la page publique Location.
            </p>
            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          </div>
          <button
            onClick={startNew}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-600"
          >
            <Plus className="h-4 w-4" />
            Nouvel équipement
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Équipements</p>
          <div className="mt-2 text-4xl font-black text-slate-900">{equipment.length}</div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Disponibles</p>
          <div className="mt-2 text-4xl font-black text-slate-900">{availableCount}</div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-sm text-slate-500">Jours réservés (total)</p>
          <div className="mt-2 text-4xl font-black text-slate-900">
            {equipment.reduce((sum, e) => sum + (e.reservedDates?.length ?? 0), 0)}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-slate-200 bg-white p-5 sm:p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
        <div className="grid gap-4 xl:grid-cols-2">
          {equipment.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500 xl:col-span-2">
              Aucun équipement pour le moment.
            </p>
          ) : (
            equipment.map((item) => (
              <div key={item.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      {item.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={resolveMediaUrl(item.image)} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-300">
                          <Camera className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] uppercase tracking-[0.2em] ${
                            item.status === "AVAILABLE" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{item.category}</p>
                      <p className="mt-2 text-xs text-slate-500">{item.tarifJour ? `${item.tarifJour.toLocaleString("fr-FR")} FCFA / jour` : "Sur devis"}</p>
                      {item.reservedDates?.length ? (
                        <p className="mt-2 text-xs text-amber-600">{item.reservedDates.length} jour(s) déjà réservé(s)</p>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    onClick={() => openCalendar(item)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
                  >
                    <CalendarDays className="h-4 w-4" />
                    Voir disponibilité
                  </button>
                  <button
                    onClick={() => editEquipment(item)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    <PencilLine className="h-4 w-4" />
                    Modifier
                  </button>
                  <button
                    onClick={() => removeEquipment(item.id)}
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
                  {editingId ? "Modifier l'équipement" : "Nouvel équipement"}
                </h3>
              </div>
              <button onClick={() => setShowForm(false)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                Fermer
              </button>
            </div>

            <div className="grid gap-4 overflow-y-auto px-6 pb-2">
              <input value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
                placeholder="Nom de l'équipement"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20" />

              <div className="grid grid-cols-2 gap-4">
                <input value={form.category} onChange={(e) => setForm((c) => ({ ...c, category: e.target.value }))}
                  placeholder="Catégorie (ex. Drones)"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20" />
                <select value={form.status} onChange={(e) => setForm((c) => ({ ...c, status: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20">
                  <option value="AVAILABLE">Disponible</option>
                  <option value="RESERVED">Réservé</option>
                </select>
              </div>

              <textarea value={form.description} onChange={(e) => setForm((c) => ({ ...c, description: e.target.value }))}
                placeholder="Description" rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20" />

              <div className="grid grid-cols-2 gap-4">
                <input type="number" value={form.tarifJour} onChange={(e) => setForm((c) => ({ ...c, tarifJour: Number(e.target.value) || 0 }))}
                  placeholder="Tarif / jour (FCFA)"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20" />
                <input value={form.caution} onChange={(e) => setForm((c) => ({ ...c, caution: e.target.value }))}
                  placeholder="Caution (ex. 500 000 FCFA)"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20" />
              </div>

              <input value={form.location} onChange={(e) => setForm((c) => ({ ...c, location: e.target.value }))}
                placeholder="Localisation / emplacement"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20" />

              <ImageUpload value={form.image} onChange={(url) => setForm((c) => ({ ...c, image: url }))} label="Photo principale" />

              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Galerie</p>
                <div className="flex flex-wrap gap-3">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative">
                      <ImageUpload
                        value={img}
                        onChange={(url) => setForm((c) => ({ ...c, images: c.images.map((v, idx) => (idx === i ? url : v)) }))}
                      />
                      <button type="button" onClick={() => setForm((c) => ({ ...c, images: c.images.filter((_, idx) => idx !== i) }))}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={() => setForm((c) => ({ ...c, images: [...c.images, ""] }))}
                  className="mt-2 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                  <Plus className="h-4 w-4" /> Ajouter une photo à la galerie
                </button>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Caractéristiques techniques</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.specs.map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-xs text-sky-700">
                      {s.label}: {s.valeur}
                      <button type="button" onClick={() => setForm((c) => ({ ...c, specs: c.specs.filter((_, idx) => idx !== i) }))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={specLabel} onChange={(e) => setSpecLabel(e.target.value)} placeholder="Label (ex. Autonomie)"
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400" />
                  <input value={specValeur} onChange={(e) => setSpecValeur(e.target.value)} placeholder="Valeur (ex. 43 minutes)"
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400" />
                  <button type="button" onClick={addSpec} className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white">Ajouter</button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Conditions de location</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.conditions.map((cond, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                      {cond}
                      <button type="button" onClick={() => setForm((c) => ({ ...c, conditions: c.conditions.filter((_, idx) => idx !== i) }))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input value={conditionInput} onChange={(e) => setConditionInput(e.target.value)} placeholder="ex. Pièce d'identité requise"
                    className="flex-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400" />
                  <button type="button" onClick={addCondition} className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white">Ajouter</button>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-slate-700 mb-2">Jours déjà réservés</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.reservedDates.map((d) => (
                    <span key={d} className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs text-amber-700">
                      {d}
                      <button type="button" onClick={() => setForm((c) => ({ ...c, reservedDates: c.reservedDates.filter((x) => x !== d) }))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="date" value={dateInput} onChange={(e) => setDateInput(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-sky-400" />
                  <button type="button" onClick={addReservedDate} className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white">Ajouter</button>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3 px-6 pt-4 pb-6">
              <button onClick={saveEquipment} className="rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white">Enregistrer</button>
              <button onClick={() => setShowForm(false)} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-700">Annuler</button>
            </div>
          </div>
        </div>
      ) : null}

      {calendarFor ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Disponibilité</p>
                <h3 className="text-xl font-bold text-slate-900">{calendarFor.name}</h3>
              </div>
              <button onClick={() => setCalendarFor(null)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                Fermer
              </button>
            </div>

            <div className="mt-5">
              <AvailabilityCalendar
                reservedDates={calendarDates}
                onToggleDate={toggleCalendarDate}
                title="Occupation"
                className=""
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={saveCalendar}
                disabled={savingCalendar}
                className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingCalendar ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Enregistrer
              </button>
              <button onClick={() => setCalendarFor(null)} className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-700">
                Annuler
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
