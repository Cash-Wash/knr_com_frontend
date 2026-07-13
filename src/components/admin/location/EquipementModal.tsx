"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Plus, Upload, X } from "lucide-react";
import type { Equipement } from "@/lib/equipements-data";
import type { EquipementCategory } from "./types";

interface EquipementModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: EquipementCategory[];
  equipement?: Equipement | null;
  onSubmit: (data: Equipement, originalSlug?: string) => void;
}

type Spec = { label: string; valeur: string };

const DAYS = ["L", "M", "M", "J", "V", "S", "D"];

function formatPrix(prixJour: number) {
  return `${prixJour.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
}

function buildInitialForm(equipement?: Equipement | null) {
  if (equipement) {
    return {
      slug: equipement.slug, categorie: equipement.categorie, nom: equipement.nom,
      prixJour: equipement.prixJour, disponible: equipement.disponible, caution: equipement.caution,
      img: equipement.img, description: equipement.description,
    };
  }
  return {
    slug: "", categorie: "", nom: "", prixJour: 0, disponible: true, caution: "",
    img: "", description: "",
  };
}

function buildInitialImages(equipement?: Equipement | null): string[] {
  return equipement && equipement.images.length > 0 ? equipement.images : [""];
}
function buildInitialSpecs(equipement?: Equipement | null): Spec[] {
  return equipement && equipement.specs.length > 0 ? equipement.specs : [{ label: "", valeur: "" }];
}
function buildInitialConditions(equipement?: Equipement | null): string[] {
  return equipement && equipement.conditions.length > 0 ? equipement.conditions : [""];
}

function MiniCalendarPicker({ joursReserves, onToggleDay }: { joursReserves: number[]; onToggleDay: (day: number) => void }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d, i) => (
          <div key={i} className="text-center text-[11px] font-bold text-stone-400">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const reserved = joursReserves.includes(day);
          return (
            <button
              key={i}
              type="button"
              onClick={() => onToggleDay(day)}
              className={`aspect-square w-full rounded-lg text-sm font-medium transition cursor-pointer ${
                reserved ? "bg-red-50 text-red-500 border border-red-200" : "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-stone-100">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-green-100 border border-green-300" />
          <span className="text-xs text-stone-500">Disponible</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-50 border border-red-300" />
          <span className="text-xs text-stone-500">Réservé</span>
        </div>
      </div>
    </div>
  );
}

// Remonté via une `key` côté appelant à chaque ouverture (voir page.tsx) : l'état
// initial ci-dessous suffit donc à refléter l'équipement édité, sans effet de reset.
export default function EquipementModal({ isOpen, onClose, categories, equipement, onSubmit }: EquipementModalProps) {
  const isEdit = !!equipement;
  const [form, setForm] = useState(() => buildInitialForm(equipement));
  const [images, setImages] = useState<string[]>(() => buildInitialImages(equipement));
  const [specs, setSpecs] = useState<Spec[]>(() => buildInitialSpecs(equipement));
  const [conditions, setConditions] = useState<string[]>(() => buildInitialConditions(equipement));
  const [joursReserves, setJoursReserves] = useState<number[]>(() => equipement?.joursReserves ?? []);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const slugify = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleNomChange = (v: string) => {
    setForm((f) => ({ ...f, nom: v, slug: isEdit ? f.slug : slugify(v) }));
  };

  const toggleDay = (day: number) => {
    setJoursReserves((d) => d.includes(day) ? d.filter((x) => x !== day) : [...d, day].sort((a, b) => a - b));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      onSubmit({
        slug: form.slug, categorie: form.categorie, nom: form.nom,
        prix: formatPrix(form.prixJour), prixJour: form.prixJour,
        disponible: form.disponible, caution: form.caution,
        img: form.img, images: images.filter((i) => i.trim() !== ""),
        specs: specs.filter((s) => s.label.trim() !== "" && s.valeur.trim() !== ""),
        description: form.description,
        conditions: conditions.filter((c) => c.trim() !== ""),
        joursReserves,
      }, equipement?.slug);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4">
      <div className="flex w-full max-w-3xl max-h-[90vh] flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-stone-100 px-4 py-4 sm:px-6">
          <h2 className="text-base font-bold text-stone-900 sm:text-lg">
            {isEdit ? "Modifier l'équipement" : "Nouvel équipement"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-4 py-5 space-y-5 sm:px-6">
          {/* Nom + slug */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Nom *</label>
              <input required value={form.nom} onChange={(e) => handleNomChange(e.target.value)}
                placeholder="ex: DJI Mavic 3 Pro"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Slug *</label>
              <input required value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="slug-de-lequipement"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition font-mono" />
            </div>
          </div>

          {/* Catégorie + Prix/jour */}
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
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Prix / jour (FCFA) *</label>
              <input required type="number" min={0} value={form.prixJour}
                onChange={(e) => setForm((f) => ({ ...f, prixJour: Number(e.target.value) }))}
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
              {form.prixJour > 0 && <p className="text-xs text-stone-400">Affiché : {formatPrix(form.prixJour)}</p>}
            </div>
          </div>

          {/* Caution */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Caution *</label>
            <input required value={form.caution} onChange={(e) => setForm((f) => ({ ...f, caution: e.target.value }))}
              placeholder="ex: 500 000 FCFA"
              className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
          </div>

          {/* Image principale */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Image principale (chemin)</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input value={form.img} onChange={(e) => setForm((f) => ({ ...f, img: e.target.value }))}
                placeholder="/images/equipements/mon-equipement.jpg"
                className="flex-1 rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
              <button type="button" className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition cursor-pointer">
                <Upload size={13} /> Upload
              </button>
            </div>
          </div>

          {/* Galerie d'images */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Galerie d&apos;images</label>
              <button type="button" onClick={() => setImages((i) => [...i, ""])}
                className="inline-flex items-center gap-1 rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs font-semibold text-sky-600 hover:bg-sky-100 transition cursor-pointer">
                <Plus size={12} /> Ajouter une image
              </button>
            </div>
            {images.map((img, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={img}
                  onChange={(e) => setImages((arr) => arr.map((x, j) => j === i ? e.target.value : x))}
                  placeholder="/images/equipements/photo.jpg"
                  className="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
                {images.length > 1 && (
                  <button type="button" onClick={() => setImages((arr) => arr.filter((_, j) => j !== i))}
                    className="shrink-0 text-red-400 hover:text-red-600 transition cursor-pointer">
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Description *</label>
            <textarea required rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder={"Description complète.\n\nSéparez les paragraphes par une ligne vide."}
              className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition resize-none" />
          </div>

          {/* Spécifications */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Spécifications techniques</label>
              <button type="button" onClick={() => setSpecs((s) => [...s, { label: "", valeur: "" }])}
                className="inline-flex items-center gap-1 rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs font-semibold text-sky-600 hover:bg-sky-100 transition cursor-pointer">
                <Plus size={12} /> Ajouter une spec
              </button>
            </div>
            {specs.map((spec, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={spec.label}
                  onChange={(e) => setSpecs((s) => s.map((x, j) => j === i ? { ...x, label: e.target.value } : x))}
                  placeholder="ex: Résolution Vidéo"
                  className="w-1/2 rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
                <input value={spec.valeur}
                  onChange={(e) => setSpecs((s) => s.map((x, j) => j === i ? { ...x, valeur: e.target.value } : x))}
                  placeholder="ex: 5.1K / 50fps"
                  className="w-1/2 rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
                {specs.length > 1 && (
                  <button type="button" onClick={() => setSpecs((s) => s.filter((_, j) => j !== i))}
                    className="shrink-0 text-red-400 hover:text-red-600 transition cursor-pointer">
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Conditions de location */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Conditions de location</label>
              <button type="button" onClick={() => setConditions((c) => [...c, ""])}
                className="inline-flex items-center gap-1 rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs font-semibold text-sky-600 hover:bg-sky-100 transition cursor-pointer">
                <Plus size={12} /> Ajouter une condition
              </button>
            </div>
            {conditions.map((cond, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={cond}
                  onChange={(e) => setConditions((c) => c.map((x, j) => j === i ? e.target.value : x))}
                  placeholder="ex: Pièce d'identité valide requise"
                  className="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
                {conditions.length > 1 && (
                  <button type="button" onClick={() => setConditions((c) => c.filter((_, j) => j !== i))}
                    className="shrink-0 text-red-400 hover:text-red-600 transition cursor-pointer">
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Jours réservés (calendrier) */}
          <div className="flex flex-col gap-2 rounded-xl border border-stone-100 bg-stone-50 p-4">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Jours réservés (mois en cours)</label>
            <MiniCalendarPicker joursReserves={joursReserves} onToggleDay={toggleDay} />
          </div>

          {/* Disponibilité */}
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-stone-100 bg-stone-50 px-4 py-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.disponible}
                onChange={(e) => setForm((f) => ({ ...f, disponible: e.target.checked }))}
                className="rounded border-stone-300 text-sky-500 focus:ring-sky-400" />
              <span className="text-sm font-medium text-stone-700">Disponible à la location</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <button type="button" onClick={onClose}
              className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition cursor-pointer">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 disabled:opacity-60 transition cursor-pointer">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Enregistrement…</> : isEdit ? <><CheckCircle2 size={14} /> Mettre à jour</> : "Créer l'équipement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
