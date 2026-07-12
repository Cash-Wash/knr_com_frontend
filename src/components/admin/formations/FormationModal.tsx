"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Plus, Upload, X } from "lucide-react";
import type { Formation } from "@/lib/formations-data";
import type { FormationCategory } from "./types";

interface FormationModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FormationCategory[];
  formation?: Formation | null;
  onSubmit: (data: Formation, originalSlug?: string) => void;
}

type ModuleDraft = { titre: string; desc: string };

function buildInitialForm(formation?: Formation | null) {
  if (formation) {
    return {
      slug: formation.slug, categorie: formation.categorie, titre: formation.titre,
      sousTitre: formation.sousTitre, description: formation.description,
      prix: formation.prix, duree: formation.duree, niveau: formation.niveau,
      lieu: formation.lieu, debut: formation.debut, fin: formation.fin,
      placesRestantes: formation.placesRestantes, joursClotureInscription: formation.joursClotureInscription,
      img: formation.img,
      formateurNom: formation.formateur.nom, formateurTitre: formation.formateur.titre,
      formateurBio: formation.formateur.bio, formateurPhoto: formation.formateur.photo,
    };
  }
  return {
    slug: "", categorie: "", titre: "", sousTitre: "", description: "",
    prix: "", duree: "", niveau: "", lieu: "KNR COM, BENIN (Cotonou)", debut: "", fin: "",
    placesRestantes: 0, joursClotureInscription: 0, img: "",
    formateurNom: "", formateurTitre: "", formateurBio: "", formateurPhoto: "",
  };
}

function buildInitialCompetences(formation?: Formation | null): string[] {
  return formation && formation.competences.length > 0 ? formation.competences : [""];
}

function buildInitialModules(formation?: Formation | null): ModuleDraft[] {
  return formation && formation.modules.length > 0
    ? formation.modules.map((m) => ({ titre: m.titre, desc: m.desc }))
    : [{ titre: "", desc: "" }];
}

// Remonté via une `key` côté appelant à chaque ouverture (voir page.tsx) : l'état
// initial ci-dessous suffit donc à refléter la formation éditée, sans effet de reset.
export default function FormationModal({ isOpen, onClose, categories, formation, onSubmit }: FormationModalProps) {
  const isEdit = !!formation;
  const [form, setForm] = useState(() => buildInitialForm(formation));
  const [competences, setCompetences] = useState<string[]>(() => buildInitialCompetences(formation));
  const [modules, setModules] = useState<ModuleDraft[]>(() => buildInitialModules(formation));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const slugify = (str: string) =>
    str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleTitreChange = (v: string) => {
    setForm((f) => ({ ...f, titre: v, slug: isEdit ? f.slug : slugify(v) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      onSubmit({
        slug: form.slug, categorie: form.categorie, titre: form.titre,
        sousTitre: form.sousTitre, description: form.description,
        prix: form.prix, duree: form.duree, niveau: form.niveau,
        lieu: form.lieu, debut: form.debut, fin: form.fin,
        placesRestantes: form.placesRestantes, joursClotureInscription: form.joursClotureInscription,
        img: form.img,
        competences: competences.filter((c) => c.trim() !== ""),
        modules: modules
          .filter((m) => m.titre.trim() !== "")
          .map((m, i) => ({ numero: i + 1, label: `Module ${i + 1}`, titre: m.titre, desc: m.desc })),
        formateur: {
          nom: form.formateurNom, titre: form.formateurTitre,
          bio: form.formateurBio, photo: form.formateurPhoto,
        },
      }, formation?.slug);
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
            {isEdit ? "Modifier la formation" : "Nouvelle formation"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-4 py-5 space-y-5 sm:px-6">
          {/* Titre + slug */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Titre *</label>
              <input required value={form.titre} onChange={(e) => handleTitreChange(e.target.value)}
                placeholder="Titre de la formation"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Slug *</label>
              <input required value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="slug-de-la-formation"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition font-mono" />
            </div>
          </div>

          {/* Sous-titre */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Sous-titre *</label>
            <input required value={form.sousTitre} onChange={(e) => setForm((f) => ({ ...f, sousTitre: e.target.value }))}
              placeholder="ex: Growth Marketing Africa"
              className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
          </div>

          {/* Catégorie + Niveau */}
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
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Niveau *</label>
              <input required value={form.niveau} onChange={(e) => setForm((f) => ({ ...f, niveau: e.target.value }))}
                placeholder="ex: Débutant à Intermédiaire"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
          </div>

          {/* Prix + Durée + Lieu */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Prix *</label>
              <input required value={form.prix} onChange={(e) => setForm((f) => ({ ...f, prix: e.target.value }))}
                placeholder="ex: 150 000 XOF"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Durée *</label>
              <input required value={form.duree} onChange={(e) => setForm((f) => ({ ...f, duree: e.target.value }))}
                placeholder="ex: 3 mois (120 heures)"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Lieu *</label>
              <input required value={form.lieu} onChange={(e) => setForm((f) => ({ ...f, lieu: e.target.value }))}
                placeholder="ex: KNR COM, BENIN (Cotonou)"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
          </div>

          {/* Début + Fin */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Date de début *</label>
              <input required value={form.debut} onChange={(e) => setForm((f) => ({ ...f, debut: e.target.value }))}
                placeholder="ex: 15 Octobre 2026"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Date de fin *</label>
              <input required value={form.fin} onChange={(e) => setForm((f) => ({ ...f, fin: e.target.value }))}
                placeholder="ex: 15 Janvier 2027"
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
          </div>

          {/* Places restantes + jours clôture */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Places restantes *</label>
              <input required type="number" min={0} value={form.placesRestantes}
                onChange={(e) => setForm((f) => ({ ...f, placesRestantes: Number(e.target.value) }))}
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Jours avant clôture *</label>
              <input required type="number" min={0} value={form.joursClotureInscription}
                onChange={(e) => setForm((f) => ({ ...f, joursClotureInscription: Number(e.target.value) }))}
                className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
          </div>

          {/* Image */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Image (chemin)</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input value={form.img} onChange={(e) => setForm((f) => ({ ...f, img: e.target.value }))}
                placeholder="/images/formations/formation-1.jpg"
                className="flex-1 rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
              <button type="button" className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 px-3 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition cursor-pointer">
                <Upload size={13} /> Upload
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Description *</label>
            <textarea required rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Description complète de la formation"
              className="rounded-xl border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition resize-none" />
          </div>

          {/* Compétences */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Compétences acquises</label>
              <button type="button" onClick={() => setCompetences((c) => [...c, ""])}
                className="inline-flex items-center gap-1 rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs font-semibold text-sky-600 hover:bg-sky-100 transition cursor-pointer">
                <Plus size={12} /> Ajouter une compétence
              </button>
            </div>
            {competences.map((comp, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={comp}
                  onChange={(e) => setCompetences((c) => c.map((x, j) => j === i ? e.target.value : x))}
                  placeholder="ex: Élaborer une stratégie social media complète"
                  className="flex-1 rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
                {competences.length > 1 && (
                  <button type="button" onClick={() => setCompetences((c) => c.filter((_, j) => j !== i))}
                    className="shrink-0 text-red-400 hover:text-red-600 transition cursor-pointer">
                    <X size={15} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Modules */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Modules du programme</label>
              <button type="button" onClick={() => setModules((m) => [...m, { titre: "", desc: "" }])}
                className="inline-flex items-center gap-1 rounded-lg bg-sky-50 border border-sky-200 px-2.5 py-1 text-xs font-semibold text-sky-600 hover:bg-sky-100 transition cursor-pointer">
                <Plus size={12} /> Ajouter un module
              </button>
            </div>
            {modules.map((mod, i) => (
              <div key={i} className="rounded-xl border border-stone-100 bg-stone-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500">Module {i + 1}</span>
                  {modules.length > 1 && (
                    <button type="button" onClick={() => setModules((m) => m.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-600 transition cursor-pointer">
                      <X size={13} />
                    </button>
                  )}
                </div>
                <input value={mod.titre}
                  onChange={(e) => setModules((m) => m.map((x, j) => j === i ? { ...x, titre: e.target.value } : x))}
                  placeholder="Titre du module"
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
                <textarea rows={2} value={mod.desc}
                  onChange={(e) => setModules((m) => m.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))}
                  placeholder="Description du module"
                  className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition resize-none" />
              </div>
            ))}
          </div>

          {/* Formateur */}
          <div className="flex flex-col gap-3 rounded-xl border border-stone-100 bg-stone-50 p-4">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Formateur</label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input required value={form.formateurNom} onChange={(e) => setForm((f) => ({ ...f, formateurNom: e.target.value }))}
                placeholder="Nom du formateur *"
                className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
              <input required value={form.formateurTitre} onChange={(e) => setForm((f) => ({ ...f, formateurTitre: e.target.value }))}
                placeholder="Titre / spécialité *"
                className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
            </div>
            <textarea required rows={2} value={form.formateurBio} onChange={(e) => setForm((f) => ({ ...f, formateurBio: e.target.value }))}
              placeholder="Bio du formateur *"
              className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition resize-none" />
            <div className="flex flex-col gap-2 sm:flex-row">
              <input value={form.formateurPhoto} onChange={(e) => setForm((f) => ({ ...f, formateurPhoto: e.target.value }))}
                placeholder="/images/team/formateur-1.jpg"
                className="flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
              <button type="button" className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 transition cursor-pointer">
                <Upload size={13} /> Upload photo
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-stone-100 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <button type="button" onClick={onClose}
              className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition cursor-pointer">
              Annuler
            </button>
            <button type="submit" disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 disabled:opacity-60 transition cursor-pointer">
              {saving ? <><Loader2 size={14} className="animate-spin" /> Enregistrement…</> : isEdit ? <><CheckCircle2 size={14} /> Mettre à jour</> : "Créer la formation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
