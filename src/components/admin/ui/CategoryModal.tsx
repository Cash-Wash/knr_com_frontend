"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  existing: { id: string; name: string }[];
  onSubmit: (name: string) => void;
  title?: string;
  nameLabel?: string;
  placeholder?: string;
}

// Remonté via une `key` côté appelant à chaque ouverture (voir page.tsx) : les
// valeurs initiales ci-dessous suffisent donc à repartir d'un formulaire vide.
export default function CategoryModal({
  isOpen,
  onClose,
  existing,
  onSubmit,
  title = "Nouvelle catégorie",
  nameLabel = "Nom de la catégorie *",
  placeholder = "ex: Technologie",
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { setError("Le nom est requis."); return; }
    if (existing.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setError("Cette catégorie existe déjà."); return;
    }
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      onSubmit(trimmed);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="flex w-full max-w-sm max-h-[90vh] flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-stone-100 px-5 py-4">
          <h2 className="text-base font-bold text-stone-900">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 transition cursor-pointer">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-4 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wide">{nameLabel}</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder={placeholder}
              className={`rounded-xl border px-3 py-2.5 text-sm text-stone-800 outline-none focus:ring-2 transition ${
                error ? "border-red-300 focus:border-red-400 focus:ring-red-400/20" : "border-stone-200 focus:border-sky-400 focus:ring-sky-400/20"
              }`}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            <button type="button" onClick={onClose} className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50 transition cursor-pointer">
              Annuler
            </button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-60 transition cursor-pointer">
              {saving ? <Loader2 size={13} className="animate-spin" /> : null} Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
