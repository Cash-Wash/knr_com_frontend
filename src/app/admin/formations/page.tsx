"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  Plus, Pencil, Trash2, ChevronDown, Search,
  Loader2, Tag, FolderPlus, ChevronLeft, ChevronRight, AlertTriangle, Users,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import FormationModal from "@/components/admin/formations/FormationModal";
import type { FormationCategory } from "@/components/admin/formations/types";
import { catStyle } from "@/components/admin/ui/categoryColors";
import CategoryModal from "@/components/admin/ui/CategoryModal";
import ConfirmDeleteModal from "@/components/admin/ui/ConfirmDeleteModal";
import ToastStack from "@/components/admin/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { formations as INITIAL_FORMATIONS, type Formation } from "@/lib/formations-data";

// ─── SIDEBAR COLLAPSE PREFERENCE (persisted, hydration-safe) ─────────────────
const SIDEBAR_COLLAPSE_KEY = "knr-admin-sidebar-collapsed";
let sidebarCollapseListeners: Array<() => void> = [];

function getSidebarCollapsedSnapshot() {
  return window.localStorage.getItem(SIDEBAR_COLLAPSE_KEY) === "1";
}
function getSidebarCollapsedServerSnapshot() {
  return false;
}
function subscribeSidebarCollapsed(listener: () => void) {
  sidebarCollapseListeners.push(listener);
  return () => { sidebarCollapseListeners = sidebarCollapseListeners.filter((l) => l !== listener); };
}
function setSidebarCollapsedPreference(next: boolean) {
  window.localStorage.setItem(SIDEBAR_COLLAPSE_KEY, next ? "1" : "0");
  sidebarCollapseListeners.forEach((listener) => listener());
}

// ─── MOCK CATEGORIES (dérivées des formations existantes) ────────────────────
function buildInitialCategories(list: Formation[]): FormationCategory[] {
  const names = ["Audiovisuel", "Marketing", "Média"];
  return names.map((name, i) => ({
    id: String(i + 1),
    name,
    count: list.filter((f) => f.categorie === name).length,
  }));
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 8;

export default function AdminFormationsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isSidebarCollapsed = useSyncExternalStore(
    subscribeSidebarCollapsed,
    getSidebarCollapsedSnapshot,
    getSidebarCollapsedServerSnapshot
  );

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isSidebarOpen]);

  const toggleSidebarCollapse = () => setSidebarCollapsedPreference(!isSidebarCollapsed);

  const [formations, setFormations] = useState<Formation[]>(INITIAL_FORMATIONS);
  const [categories, setCategories] = useState<FormationCategory[]>(() => buildInitialCategories(INITIAL_FORMATIONS));
  const [loadingData] = useState(false);

  const [isFormationModalOpen, setIsFormationModalOpen] = useState(false);
  const [formationToEdit, setFormationToEdit] = useState<Formation | null>(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [formationToDelete, setFormationToDelete] = useState<Formation | null>(null);
  const [deletingFormation, setDeletingFormation] = useState(false);
  const [catToDelete, setCatToDelete] = useState<FormationCategory | null>(null);
  const [deletingCat, setDeletingCat] = useState(false);

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { toasts, add: addToast, dismiss } = useToast();

  const filtered = formations.filter((f) => {
    const q = search.toLowerCase();
    const matchS = f.titre.toLowerCase().includes(q) || f.categorie.toLowerCase().includes(q) || f.formateur.nom.toLowerCase().includes(q);
    const matchC = catFilter === "all" || f.categorie === catFilter;
    return matchS && matchC;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const resetPage = useCallback(() => setPage(1), []);

  const handleDeleteFormation = async () => {
    if (!formationToDelete) return;
    setDeletingFormation(true);
    const tid = addToast("loading", "Suppression…");
    await new Promise((r) => setTimeout(r, 600));
    setFormations((prev) => prev.filter((f) => f.slug !== formationToDelete.slug));
    setCategories((prev) => prev.map((c) => c.name === formationToDelete.categorie ? { ...c, count: Math.max(0, c.count - 1) } : c));
    dismiss(tid);
    addToast("success", `« ${formationToDelete.titre} » supprimée.`);
    setFormationToDelete(null);
    setDeletingFormation(false);
  };

  const handleAddCategory = (name: string) => {
    const newCat: FormationCategory = { id: Date.now().toString(), name, count: 0 };
    setCategories((prev) => [...prev, newCat]);
    addToast("success", `Catégorie « ${name} » créée.`);
  };

  const handleDeleteCategory = async () => {
    if (!catToDelete) return;
    setDeletingCat(true);
    await new Promise((r) => setTimeout(r, 400));
    setCategories((prev) => prev.filter((c) => c.id !== catToDelete.id));
    addToast("success", `Catégorie « ${catToDelete.name} » supprimée.`);
    setCatToDelete(null);
    setDeletingCat(false);
  };

  const handleSubmitFormation = (data: Formation, originalSlug?: string) => {
    if (originalSlug) {
      const previous = formations.find((f) => f.slug === originalSlug);
      setFormations((prev) => prev.map((f) => f.slug === originalSlug ? data : f));
      if (previous && previous.categorie !== data.categorie) {
        setCategories((prev) => prev.map((c) => {
          if (c.name === previous.categorie) return { ...c, count: Math.max(0, c.count - 1) };
          if (c.name === data.categorie) return { ...c, count: c.count + 1 };
          return c;
        }));
      }
      addToast("success", `Formation « ${data.titre} » mise à jour.`);
      setFormationToEdit(null);
    } else {
      setFormations((prev) => [data, ...prev]);
      setCategories((prev) => prev.map((c) => c.name === data.categorie ? { ...c, count: c.count + 1 } : c));
      addToast("success", `Formation « ${data.titre} » créée.`);
    }
  };

  const totalPlacesRestantes = formations.reduce((sum, f) => sum + f.placesRestantes, 0);
  const nbFormateurs = new Set(formations.map((f) => f.formateur.nom)).size;

  return (
    <div className="min-h-screen bg-slate-50 text-stone-900">
      <ToastStack toasts={toasts} />

      <AdminSidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={() => setIsSidebarOpen(false)}
        toggleCollapse={toggleSidebarCollapse}
      />

      <div className={`min-h-screen transition-all duration-300 ${isSidebarCollapsed ? "lg:pl-20" : "lg:pl-[265px]"}`}>
        <AdminNavbar
          onMenuClick={() => setIsSidebarOpen((v) => !v)}
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={toggleSidebarCollapse}
        />

        <main className="px-4 pb-12 pt-5 lg:px-8 lg:pt-6 space-y-5">

          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">Formations</h1>
              <p className="mt-1 text-sm text-stone-500">Gérez vos formations, catégories et inscriptions.</p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <button onClick={() => setIsCatModalOpen(true)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-sky-400 px-4 py-2.5 text-sm font-semibold text-sky-500 hover:bg-sky-50 transition cursor-pointer sm:flex-none">
                <FolderPlus size={15} /> Catégorie
              </button>
              <button onClick={() => { setFormationToEdit(null); setIsFormationModalOpen(true); }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 transition cursor-pointer sm:flex-none">
                <Plus size={15} /> Nouvelle formation
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Formations",         val: formations.length,       color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
              { label: "Places restantes",   val: totalPlacesRestantes,    color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
              { label: "Catégories",         val: categories.length,       color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
              { label: "Formateurs",         val: nbFormateurs,            color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
            ].map(({ label, val, color, bg, border }) => (
              <div key={label} className="rounded-2xl px-3 py-4 text-center sm:px-4" style={{ background: bg, border: `1.5px solid ${border}` }}>
                <p className="text-xl font-black sm:text-2xl" style={{ color }}>{val}</p>
                <p className="text-xs text-stone-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-3 px-4 py-4 sm:px-5">
              <div className="relative w-full sm:flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input type="text" value={search}
                  onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                  placeholder="Rechercher une formation ou un formateur…"
                  className="w-full rounded-xl border border-stone-200 bg-slate-50 pl-9 pr-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
              </div>
              <div className="relative w-full sm:w-auto">
                <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value); resetPage(); }}
                  className="w-full appearance-none rounded-xl border border-stone-200 bg-slate-50 pl-4 pr-8 py-2.5 text-sm text-stone-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition cursor-pointer sm:w-auto">
                  <option value="all">Toutes les catégories</option>
                  {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
              </div>
            </div>
          </div>

          {/* Table (scroll horizontal sur petits écrans) */}
          <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                    <th className="px-4 py-3.5 sm:px-5">Formation</th>
                    <th className="px-4 py-3.5 sm:px-5">Formateur</th>
                    <th className="px-4 py-3.5 sm:px-5">Catégorie</th>
                    <th className="px-4 py-3.5 sm:px-5">Niveau</th>
                    <th className="px-4 py-3.5 sm:px-5">Prix</th>
                    <th className="px-4 py-3.5 sm:px-5">Places</th>
                    <th className="px-4 py-3.5 sm:px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {loadingData ? (
                    <tr><td colSpan={7} className="px-5 py-10 text-center text-stone-400"><Loader2 size={20} className="animate-spin mx-auto" /></td></tr>
                  ) : paginated.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-stone-400 italic">Aucune formation trouvée.</td></tr>
                  ) : paginated.map((formation) => {
                    const cs = catStyle(formation.categorie);
                    const lowPlaces = formation.placesRestantes <= 5;
                    return (
                      <tr key={formation.slug} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5 sm:px-5 max-w-[240px]">
                          <p className="font-semibold text-stone-800 line-clamp-1">{formation.titre}</p>
                          <p className="text-xs text-stone-400 font-mono mt-0.5 line-clamp-1">{formation.slug}</p>
                        </td>
                        <td className="px-4 py-3.5 sm:px-5 text-stone-600 whitespace-nowrap">{formation.formateur.nom}</td>
                        <td className="px-4 py-3.5 sm:px-5">
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                            style={{ background: cs.bg, color: cs.text, border: `1px solid ${cs.border}` }}>
                            <Tag size={9} /> {formation.categorie}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 sm:px-5 text-stone-500 whitespace-nowrap text-xs">{formation.niveau}</td>
                        <td className="px-4 py-3.5 sm:px-5 text-stone-600 whitespace-nowrap font-semibold text-xs">{formation.prix}</td>
                        <td className="px-4 py-3.5 sm:px-5 whitespace-nowrap">
                          {lowPlaces ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-semibold text-amber-600">
                              <AlertTriangle size={10} /> {formation.placesRestantes}
                            </span>
                          ) : (
                            <span className="text-stone-600 text-xs">{formation.placesRestantes}</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 sm:px-5">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => { setFormationToEdit(formation); setIsFormationModalOpen(true); }}
                              className="rounded-lg p-2 text-stone-400 hover:bg-sky-50 hover:text-sky-500 transition cursor-pointer" title="Modifier">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => setFormationToDelete(formation)}
                              className="rounded-lg p-2 text-stone-400 hover:bg-red-50 hover:text-red-500 transition cursor-pointer" title="Supprimer">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 bg-slate-50 px-5 py-3">
                <span className="text-xs text-stone-400">
                  Page {page} / {totalPages} — {filtered.length} formation{filtered.length !== 1 ? "s" : ""}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="rounded-lg p-2 text-stone-500 hover:bg-stone-200 disabled:opacity-30 transition cursor-pointer">
                    <ChevronLeft size={15} />
                  </button>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="rounded-lg p-2 text-stone-500 hover:bg-stone-200 disabled:opacity-30 transition cursor-pointer">
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Catégories */}
          <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-5 py-3.5">
              <div>
                <h3 className="text-sm font-bold text-stone-700">Catégories de formations</h3>
                <p className="text-xs text-stone-400 mt-0.5">Seules les catégories sans formation peuvent être supprimées.</p>
              </div>
              <button onClick={() => setIsCatModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400 px-3 py-1.5 text-xs font-semibold text-sky-500 hover:bg-sky-50 transition cursor-pointer">
                <Plus size={12} /> Ajouter
              </button>
            </div>
            {categories.length === 0 ? (
              <p className="px-5 py-6 text-sm text-stone-400 italic text-center">Aucune catégorie.</p>
            ) : (
              <ul className="divide-y divide-stone-50 px-2 py-2">
                {categories.map((cat) => {
                  const hasFormations = cat.count > 0;
                  const cs = catStyle(cat.name);
                  return (
                    <li key={cat.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50 group">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: cs.bg, border: `1px solid ${cs.border}` }}>
                        <Tag size={12} style={{ color: cs.text }} />
                      </span>
                      <span className="flex-1 min-w-0 truncate text-sm font-medium text-stone-700">{cat.name}</span>
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums"
                        style={{ background: cs.bg, color: cs.text, border: `1px solid ${cs.border}` }}>
                        {cat.count} formation{cat.count !== 1 ? "s" : ""}
                      </span>
                      <button onClick={() => { if (!hasFormations) setCatToDelete(cat); }}
                        disabled={hasFormations}
                        title={hasFormations ? "Suppression impossible — formations liées" : "Supprimer"}
                        className="shrink-0 opacity-0 group-hover:opacity-100 rounded-md p-1 transition-all disabled:cursor-not-allowed cursor-pointer focus-visible:opacity-100"
                        style={{ color: hasFormations ? "#d1d5db" : "#ef4444" }}>
                        <Trash2 size={13} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Formateurs */}
          <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-2 border-b border-stone-100 px-5 py-3.5">
              <Users size={15} className="text-sky-400" />
              <h3 className="text-sm font-bold text-stone-700">Formateurs actifs</h3>
            </div>
            <ul className="divide-y divide-stone-50 px-2 py-2">
              {Array.from(new Set(formations.map((f) => f.formateur.nom))).map((nom) => {
                const f = formations.find((x) => x.formateur.nom === nom)!;
                const nbFormationsFormateur = formations.filter((x) => x.formateur.nom === nom).length;
                return (
                  <li key={nom} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">
                      {nom.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-stone-700">{nom}</p>
                      <p className="truncate text-xs text-stone-400">{f.formateur.titre}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-bold text-stone-500 tabular-nums">
                      {nbFormationsFormateur} formation{nbFormationsFormateur !== 1 ? "s" : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </main>
      </div>

      {/* Modals */}
      <FormationModal
        key={isFormationModalOpen ? `formation-${formationToEdit?.slug ?? "new"}` : "formation-closed"}
        isOpen={isFormationModalOpen}
        onClose={() => { setIsFormationModalOpen(false); setFormationToEdit(null); }}
        categories={categories}
        formation={formationToEdit}
        onSubmit={handleSubmitFormation}
      />
      <CategoryModal
        key={isCatModalOpen ? "category-open" : "category-closed"}
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        existing={categories}
        onSubmit={handleAddCategory}
        title="Nouvelle catégorie de formation"
      />
      <ConfirmDeleteModal
        isOpen={!!formationToDelete}
        onClose={() => { if (!deletingFormation) setFormationToDelete(null); }}
        onConfirm={handleDeleteFormation}
        loading={deletingFormation}
        title="Supprimer la formation ?"
        message={formationToDelete ? (
          <span>Supprimer définitivement <strong>« {formationToDelete.titre} »</strong> ?
            <span className="mt-1.5 block text-red-500 text-[12px]">Cette action est irréversible.</span>
          </span>
        ) : ""}
      />
      <ConfirmDeleteModal
        isOpen={!!catToDelete}
        onClose={() => { if (!deletingCat) setCatToDelete(null); }}
        onConfirm={handleDeleteCategory}
        loading={deletingCat}
        title="Supprimer la catégorie ?"
        message={catToDelete ? <span>Supprimer <strong>« {catToDelete.name} »</strong> ?</span> : ""}
      />
    </div>
  );
}
