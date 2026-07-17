"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  Plus, Pencil, Trash2, ChevronDown, Search,
  Loader2, Tag, FolderPlus, ChevronLeft, ChevronRight, Clock, Play, Star, Radio, ListVideo, Tv2,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import EmissionModal from "@/components/admin/emissions/EmissionModal";
import EpisodeManagerModal from "@/components/admin/emissions/EpisodeManagerModal";
import type { EmissionCategory } from "@/components/admin/emissions/types";
import { catStyle } from "@/components/admin/ui/categoryColors";
import CategoryModal from "@/components/admin/ui/CategoryModal";
import ConfirmDeleteModal from "@/components/admin/ui/ConfirmDeleteModal";
import ToastStack from "@/components/admin/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { emissions as INITIAL_EMISSIONS, type Emission } from "@/lib/emissions-data";
import { getApiBase, authHeaders, resolveMediaUrl } from "@/lib/api";

type AdminEmission = Emission & { id?: string; featured?: boolean; status?: string };

function fromApi(item: {
  id: string;
  titre: string;
  slug: string;
  sousTitre?: string;
  categorie?: string;
  animateur?: string;
  episodes?: number;
  duree?: string;
  tags?: string[];
  description?: string;
  thumbnail?: string;
  youtubeUrl?: string;
  featured?: boolean;
  status?: string;
}): AdminEmission {
  return {
    id: item.id,
    titre: item.titre,
    slug: item.slug,
    sousTitre: item.sousTitre ?? "",
    categorie: item.categorie ?? "",
    description: item.description ?? "",
    episodes: item.episodes ?? 0,
    duree: item.duree ?? "",
    img: item.thumbnail ?? "",
    videoUrl: item.youtubeUrl ?? "",
    animateur: item.animateur ?? "",
    tags: Array.isArray(item.tags) ? item.tags : [],
    featured: !!item.featured,
    status: item.status ?? "draft",
  };
}

function toApiPayload(data: AdminEmission) {
  return {
    titre: data.titre,
    sousTitre: data.sousTitre,
    categorie: data.categorie,
    animateur: data.animateur,
    duree: data.duree,
    tags: data.tags,
    description: data.description,
    thumbnail: data.img,
    youtubeUrl: data.videoUrl,
  };
}

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

// ─── MOCK CATEGORIES (dérivées des émissions existantes) ─────────────────────
function buildInitialCategories(list: Emission[]): EmissionCategory[] {
  const names = ["Technologie", "Culture", "Business", "Société", "Sport"];
  return names.map((name, i) => ({
    id: String(i + 1),
    name,
    count: list.filter((e) => e.categorie === name).length,
  }));
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 8;

export default function AdminEmissionsPage() {
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

  const [emissions, setEmissions] = useState<AdminEmission[]>(INITIAL_EMISSIONS);
  const [categories, setCategories] = useState<EmissionCategory[]>(() => buildInitialCategories(INITIAL_EMISSIONS));
  const [loadingData] = useState(false);

  const [isEmissionModalOpen, setIsEmissionModalOpen] = useState(false);
  const [emissionToEdit, setEmissionToEdit] = useState<AdminEmission | null>(null);
  const [emissionForEpisodes, setEmissionForEpisodes] = useState<AdminEmission | null>(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [emissionToDelete, setEmissionToDelete] = useState<AdminEmission | null>(null);
  const [deletingEmission, setDeletingEmission] = useState(false);
  const [catToDelete, setCatToDelete] = useState<EmissionCategory | null>(null);
  const [deletingCat, setDeletingCat] = useState(false);

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { toasts, add: addToast, dismiss } = useToast();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch(`${getApiBase()}/api/emissions`, { headers: authHeaders() });
        if (!response.ok) return;
        const payload = await response.json();
        if (Array.isArray(payload) && payload.length > 0) {
          const mapped = payload.map(fromApi);
          setEmissions(mapped);
          setCategories(buildInitialCategories(mapped));
        }
      } catch {
        // keep static seed data
      }
    };
    load();
  }, []);

  const filtered = emissions.filter((e) => {
    const q = search.toLowerCase();
    const matchS = e.titre.toLowerCase().includes(q) || e.sousTitre.toLowerCase().includes(q) || e.animateur.toLowerCase().includes(q);
    const matchC = catFilter === "all" || e.categorie === catFilter;
    return matchS && matchC;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const resetPage = useCallback(() => setPage(1), []);

  const handleDeleteEmission = async () => {
    if (!emissionToDelete) return;
    setDeletingEmission(true);
    const tid = addToast("loading", "Suppression…");
    if (emissionToDelete.id) {
      try {
        await fetch(`${getApiBase()}/api/emissions/${emissionToDelete.id}`, { method: "DELETE", headers: authHeaders() });
      } catch {
        // fallback below still removes it locally
      }
    }
    setEmissions((prev) => prev.filter((e) => e.slug !== emissionToDelete.slug));
    setCategories((prev) => prev.map((c) => c.name === emissionToDelete.categorie ? { ...c, count: Math.max(0, c.count - 1) } : c));
    dismiss(tid);
    addToast("success", `« ${emissionToDelete.titre} » supprimée.`);
    setEmissionToDelete(null);
    setDeletingEmission(false);
  };

  const setPublished = async (emission: AdminEmission, published: boolean) => {
    if (!emission.id) return;
    try {
      const response = await fetch(`${getApiBase()}/api/emissions/${emission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ status: published ? "published" : "draft" }),
      });
      if (!response.ok) return;
      const updated = fromApi(await response.json());
      setEmissions((prev) => prev.map((e) => (e.id === emission.id ? updated : e)));
      addToast("success", published ? `« ${emission.titre} » publiée.` : `« ${emission.titre} » dépubliée.`);
    } catch {
      addToast("error", "Impossible de contacter le serveur.");
    }
  };

  const setFeatured = async (emission: AdminEmission) => {
    if (!emission.id) return;
    try {
      const response = await fetch(`${getApiBase()}/api/emissions/${emission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ featured: true }),
      });
      if (!response.ok) return;
      const updated = fromApi(await response.json());
      setEmissions((prev) => prev.map((e) => (e.id === emission.id ? updated : { ...e, featured: false })));
      addToast("success", `« ${emission.titre} » est maintenant à la une.`);
    } catch {
      addToast("error", "Impossible de contacter le serveur.");
    }
  };

  const handleAddCategory = (name: string) => {
    const newCat: EmissionCategory = { id: Date.now().toString(), name, count: 0 };
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

  const handleSubmitEmission = async (data: AdminEmission, originalSlug?: string) => {
    const previous = originalSlug ? emissions.find((e) => e.slug === originalSlug) : undefined;
    let saved: AdminEmission = data;

    try {
      const response = await fetch(`${getApiBase()}/api/emissions${previous?.id ? `/${previous.id}` : ""}`, {
        method: previous?.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(toApiPayload(data)),
      });
      if (response.ok) {
        saved = fromApi(await response.json());
      }
    } catch {
      // fallback below keeps the locally-entered data
    }

    if (originalSlug) {
      setEmissions((prev) => prev.map((e) => (e.slug === originalSlug ? saved : e)));
      if (previous && previous.categorie !== saved.categorie) {
        setCategories((prev) => prev.map((c) => {
          if (c.name === previous.categorie) return { ...c, count: Math.max(0, c.count - 1) };
          if (c.name === saved.categorie) return { ...c, count: c.count + 1 };
          return c;
        }));
      }
      addToast("success", `Émission « ${saved.titre} » mise à jour.`);
      setEmissionToEdit(null);
    } else {
      setEmissions((prev) => [saved, ...prev]);
      setCategories((prev) => prev.map((c) => c.name === saved.categorie ? { ...c, count: c.count + 1 } : c));
      addToast("success", `Émission « ${saved.titre} » créée.`);
    }
  };

  const totalEpisodes = emissions.reduce((sum, e) => sum + e.episodes, 0);
  const nbAnimateurs = new Set(emissions.map((e) => e.animateur)).size;

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

        <main className="admin-light px-4 pb-12 pt-5 space-y-5 lg:px-8 lg:pt-6">

          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">Émissions Web TV</h1>
              <p className="mt-1 text-sm text-stone-500">Gérez vos émissions, catégories et épisodes.</p>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              <button onClick={() => setIsCatModalOpen(true)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-sky-400 px-4 py-2.5 text-sm font-semibold text-sky-500 hover:bg-sky-50 transition cursor-pointer sm:flex-none">
                <FolderPlus size={15} /> Catégorie
              </button>
              <button onClick={() => { setEmissionToEdit(null); setIsEmissionModalOpen(true); }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 transition cursor-pointer sm:flex-none">
                <Plus size={15} /> Nouvelle émission
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Émissions",   val: emissions.length,  color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
              { label: "Épisodes",    val: totalEpisodes,     color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
              { label: "Catégories",  val: categories.length, color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
              { label: "Animateurs",  val: nbAnimateurs,      color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
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
                  placeholder="Rechercher une émission ou un animateur…"
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
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                    <th className="px-4 py-3.5 sm:px-5">Émission</th>
                    <th className="px-4 py-3.5 sm:px-5">Animateur</th>
                    <th className="px-4 py-3.5 sm:px-5">Catégorie</th>
                    <th className="px-4 py-3.5 sm:px-5">Épisodes</th>
                    <th className="px-4 py-3.5 sm:px-5">Durée</th>
                    <th className="px-4 py-3.5 sm:px-5">Tags</th>
                    <th className="px-4 py-3.5 sm:px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {loadingData ? (
                    <tr><td colSpan={7} className="px-5 py-10 text-center text-stone-400"><Loader2 size={20} className="animate-spin mx-auto" /></td></tr>
                  ) : paginated.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-stone-400 italic">Aucune émission trouvée.</td></tr>
                  ) : paginated.map((emission) => {
                    const cs = catStyle(emission.categorie);
                    return (
                      <tr key={emission.slug} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3.5 sm:px-5 max-w-[280px]">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-stone-100 bg-stone-50">
                              {emission.img ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={resolveMediaUrl(emission.img)} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-stone-300">
                                  <Tv2 size={16} />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="font-semibold text-stone-800 line-clamp-1">{emission.titre}</p>
                                {emission.featured ? <Star size={12} className="shrink-0 fill-amber-400 text-amber-400" /> : null}
                              </div>
                              <p className="text-xs text-stone-400 font-mono mt-0.5 line-clamp-1">{emission.slug}</p>
                              <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${emission.status === "published" ? "bg-emerald-50 text-emerald-600" : "bg-stone-100 text-stone-500"}`}>
                                {emission.status === "published" ? "Publiée" : "Brouillon"}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 sm:px-5 text-stone-600 whitespace-nowrap">{emission.animateur}</td>
                        <td className="px-4 py-3.5 sm:px-5">
                          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                            style={{ background: cs.bg, color: cs.text, border: `1px solid ${cs.border}` }}>
                            <Tag size={9} /> {emission.categorie}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 sm:px-5 text-stone-600 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1"><Play size={11} className="text-sky-400" /> {emission.episodes}</span>
                        </td>
                        <td className="px-4 py-3.5 sm:px-5 text-stone-500 whitespace-nowrap text-xs">
                          <span className="inline-flex items-center gap-1"><Clock size={11} /> {emission.duree}</span>
                        </td>
                        <td className="px-4 py-3.5 sm:px-5">
                          <div className="flex flex-wrap gap-1 max-w-[180px]">
                            {emission.tags.slice(0, 2).map((tag) => (
                              <span key={tag} className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-500">{tag}</span>
                            ))}
                            {emission.tags.length > 2 && (
                              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-400">+{emission.tags.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 sm:px-5">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => setEmissionForEpisodes(emission)}
                              disabled={!emission.id}
                              className="rounded-lg p-2 text-stone-400 hover:bg-sky-50 hover:text-sky-500 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                              title="Gérer les épisodes">
                              <ListVideo size={14} />
                            </button>
                            <button onClick={() => setFeatured(emission)}
                              disabled={!emission.id || emission.featured}
                              className="rounded-lg p-2 text-stone-400 hover:bg-amber-50 hover:text-amber-500 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                              title={emission.featured ? "Déjà à la une" : "Mettre à la une"}>
                              <Star size={14} />
                            </button>
                            <button onClick={() => setPublished(emission, emission.status !== "published")}
                              disabled={!emission.id}
                              className="rounded-lg p-2 text-stone-400 hover:bg-emerald-50 hover:text-emerald-500 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                              title={emission.status === "published" ? "Dépublier" : "Publier"}>
                              <Radio size={14} />
                            </button>
                            <button onClick={() => { setEmissionToEdit(emission); setIsEmissionModalOpen(true); }}
                              className="rounded-lg p-2 text-stone-400 hover:bg-sky-50 hover:text-sky-500 transition cursor-pointer" title="Modifier">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => setEmissionToDelete(emission)}
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
                  Page {page} / {totalPages} — {filtered.length} émission{filtered.length !== 1 ? "s" : ""}
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
                <h3 className="text-sm font-bold text-stone-700">Catégories d&apos;émissions</h3>
                <p className="text-xs text-stone-400 mt-0.5">Seules les catégories sans émission peuvent être supprimées.</p>
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
                  const hasEmissions = cat.count > 0;
                  const cs = catStyle(cat.name);
                  return (
                    <li key={cat.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50 group">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: cs.bg, border: `1px solid ${cs.border}` }}>
                        <Tag size={12} style={{ color: cs.text }} />
                      </span>
                      <span className="flex-1 min-w-0 truncate text-sm font-medium text-stone-700">{cat.name}</span>
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums"
                        style={{ background: cs.bg, color: cs.text, border: `1px solid ${cs.border}` }}>
                        {cat.count} émission{cat.count !== 1 ? "s" : ""}
                      </span>
                      <button onClick={() => { if (!hasEmissions) setCatToDelete(cat); }}
                        disabled={hasEmissions}
                        title={hasEmissions ? "Suppression impossible — émissions liées" : "Supprimer"}
                        className="shrink-0 opacity-0 group-hover:opacity-100 rounded-md p-1 transition-all disabled:cursor-not-allowed cursor-pointer focus-visible:opacity-100"
                        style={{ color: hasEmissions ? "#d1d5db" : "#ef4444" }}>
                        <Trash2 size={13} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <EmissionModal
        key={isEmissionModalOpen ? `emission-${emissionToEdit?.slug ?? "new"}` : "emission-closed"}
        isOpen={isEmissionModalOpen}
        onClose={() => { setIsEmissionModalOpen(false); setEmissionToEdit(null); }}
        categories={categories}
        emission={emissionToEdit}
        onSubmit={handleSubmitEmission}
      />
      <EpisodeManagerModal
        isOpen={!!emissionForEpisodes}
        onClose={() => setEmissionForEpisodes(null)}
        emissionId={emissionForEpisodes?.id ?? null}
        emissionTitre={emissionForEpisodes?.titre ?? ""}
        onCountChange={(count) => {
          if (!emissionForEpisodes) return;
          setEmissions((prev) => prev.map((e) => (e.id === emissionForEpisodes.id ? { ...e, episodes: count } : e)));
        }}
      />
      <CategoryModal
        key={isCatModalOpen ? "category-open" : "category-closed"}
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        existing={categories}
        onSubmit={handleAddCategory}
        title="Nouvelle catégorie d'émission"
      />
      <ConfirmDeleteModal
        isOpen={!!emissionToDelete}
        onClose={() => { if (!deletingEmission) setEmissionToDelete(null); }}
        onConfirm={handleDeleteEmission}
        loading={deletingEmission}
        title="Supprimer l'émission ?"
        message={emissionToDelete ? (
          <span>Supprimer définitivement <strong>« {emissionToDelete.titre} »</strong> ?
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
