"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  Plus, Pencil, Trash2, ChevronDown, Search,
  Loader2, Tag, FolderPlus, ChevronLeft, ChevronRight,
} from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import ArticleModal from "@/components/admin/blog/ArticleModal";
import type { Article, ArticleCategory, ArticleStatus } from "@/components/admin/blog/types";
import { catStyle } from "@/components/admin/ui/categoryColors";
import CategoryModal from "@/components/admin/ui/CategoryModal";
import ConfirmDeleteModal from "@/components/admin/ui/ConfirmDeleteModal";
import StatusToggle from "@/components/admin/ui/StatusToggle";
import ToastStack from "@/components/admin/ui/Toast";
import { useToast } from "@/hooks/useToast";

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

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_CATEGORIES: ArticleCategory[] = [
  { id: "1", name: "Technologie",     article_count: 2 },
  { id: "2", name: "Entrepreneuriat", article_count: 3 },
  { id: "3", name: "Culture",         article_count: 2 },
  { id: "4", name: "Société",         article_count: 1 },
];

const MOCK_ARTICLES: Article[] = [
  {
    id: "1", slug: "economie-numerique-afrique-2025", categorie: "Technologie",
    titre: "L'économie numérique en Afrique : Bilan et Perspectives 2025",
    extrait: "Analyse complète des tendances qui vont façonner le paysage numérique africain.",
    auteur: "Jean-Marc Diop", date: "Il y a 2 jours", dateISO: "12 Octobre 2023",
    tempsLecture: "5 min de lecture", img: "/images/blog/article-featured.jpg",
    featured: true, status: "published",
    contenu: { intro: "Alors que le continent connaît une croissance démographique sans précédent…", sections: [{ sousTitre: "L'essor des Fintech", paragraphe: "Lorem ipsum dolor sit amet…" }], citation: "\"La technologie n'est pas une fin en soi.\"", conclusion: "L'Afrique de l'Ouest a tous les atouts." },
  },
  {
    id: "2", slug: "innovation-frugale-premiere-partie", categorie: "Entrepreneuriat",
    titre: "Innovation frugale : Faire mieux avec moins — Première Partie",
    extrait: "Comment les entrepreneurs africains réinventent les modèles économiques.",
    auteur: "Amina Sow", date: "Il y a 3 jours", dateISO: "15 Oct 2023",
    tempsLecture: "4 min de lecture", img: "/images/blog/article-1.jpg",
    featured: false, status: "published",
    contenu: { intro: "L'innovation frugale désigne la capacité à créer des solutions efficaces…", sections: [{ sousTitre: "Définir l'innovation frugale", paragraphe: "Lorem ipsum…" }] },
  },
  {
    id: "3", slug: "femmes-entrepreneures-afrique", categorie: "Culture",
    titre: "Femmes entrepreneures : les pionnières qui redessinent l'Afrique",
    extrait: "Elles dirigent des entreprises, créent des emplois et inspirent des générations.",
    auteur: "Fatoumata Traoré", date: "Il y a 1 semaine", dateISO: "8 Oct 2023",
    tempsLecture: "7 min de lecture", img: "/images/blog/article-3.jpg",
    featured: false, status: "draft",
    contenu: { intro: "À travers le continent, des femmes extraordinaires brisent les plafonds de verre…", sections: [{ sousTitre: "Le financement, premier obstacle", paragraphe: "Accéder au capital reste le défi majeur…" }] },
  },
];

// ─── PAGE ─────────────────────────────────────────────────────────────────────
const PAGE_SIZE = 8;

export default function AdminBlogPage() {
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

  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [categories, setCategories] = useState<ArticleCategory[]>(MOCK_CATEGORIES);
  const [loadingData] = useState(false);

  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<Article | null>(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [deletingArticle, setDeletingArticle] = useState(false);
  const [catToDelete, setCatToDelete] = useState<ArticleCategory | null>(null);
  const [deletingCat, setDeletingCat] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statFilter, setStatFilter] = useState<"all" | ArticleStatus>("all");
  const [page, setPage] = useState(1);

  const { toasts, add: addToast, dismiss } = useToast();

  const filtered = articles.filter((a) => {
    const matchS = a.titre.toLowerCase().includes(search.toLowerCase()) || a.auteur.toLowerCase().includes(search.toLowerCase());
    const matchC = catFilter === "all" || a.categorie === catFilter;
    const matchSt = statFilter === "all" || a.status === statFilter;
    return matchS && matchC && matchSt;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const resetPage = useCallback(() => setPage(1), []);

  const handleToggle = (article: Article) => {
    setTogglingId(article.id);
    setTimeout(() => {
      setArticles((prev) => prev.map((a) => a.id === article.id ? { ...a, status: a.status === "published" ? "draft" : "published" } : a));
      setTogglingId(null);
    }, 400);
  };

  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;
    setDeletingArticle(true);
    const tid = addToast("loading", "Suppression…");
    await new Promise((r) => setTimeout(r, 600));
    setArticles((prev) => prev.filter((a) => a.id !== articleToDelete.id));
    dismiss(tid);
    addToast("success", `« ${articleToDelete.titre} » supprimé.`);
    setArticleToDelete(null);
    setDeletingArticle(false);
  };

  const handleAddCategory = (name: string) => {
    const newCat: ArticleCategory = { id: Date.now().toString(), name, article_count: 0 };
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

  const handleSubmitArticle = (data: Omit<Article, "id">) => {
    if (articleToEdit) {
      setArticles((prev) => prev.map((a) => a.id === articleToEdit.id ? { ...a, ...data } : a));
      addToast("success", `Article « ${data.titre} » mis à jour.`);
      setArticleToEdit(null);
    } else {
      const created: Article = { ...data, id: Date.now().toString() };
      setArticles((prev) => [created, ...prev]);
      addToast("success", `Article « ${data.titre} » ${data.status === "published" ? "publié" : "enregistré"}.`);
    }
  };

  const nbPublished = articles.filter((a) => a.status === "published").length;
  const nbDraft = articles.filter((a) => a.status === "draft").length;

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
          <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">Articles &amp; Blog</h1>
          <p className="mt-1 text-sm text-stone-500">Gérez vos articles, catégories et publications.</p>
        </div>
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <button onClick={() => setIsCatModalOpen(true)}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-sky-400 px-4 py-2.5 text-sm font-semibold text-sky-500 hover:bg-sky-50 transition cursor-pointer sm:flex-none">
            <FolderPlus size={15} /> Catégorie
          </button>
          <button onClick={() => { setArticleToEdit(null); setIsArticleModalOpen(true); }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 transition cursor-pointer sm:flex-none">
            <Plus size={15} /> Nouvel article
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total",       val: articles.length,    color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
          { label: "Publiés",     val: nbPublished,         color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
          { label: "Brouillons",  val: nbDraft,             color: "#9ca3af", bg: "#f9fafb", border: "#e5e7eb" },
          { label: "Catégories",  val: categories.length,   color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
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
              placeholder="Rechercher un article ou auteur…"
              className="w-full rounded-xl border border-stone-200 bg-slate-50 pl-9 pr-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition" />
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-auto">
              <select value={catFilter} onChange={(e) => { setCatFilter(e.target.value); resetPage(); }}
                className="w-full appearance-none rounded-xl border border-stone-200 bg-slate-50 pl-4 pr-8 py-2.5 text-sm text-stone-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition cursor-pointer sm:w-auto">
                <option value="all">Toutes les catégories</option>
                {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
            </div>
            <div className="relative w-full sm:w-auto">
              <select value={statFilter} onChange={(e) => { setStatFilter(e.target.value as typeof statFilter); resetPage(); }}
                className="w-full appearance-none rounded-xl border border-stone-200 bg-slate-50 pl-4 pr-8 py-2.5 text-sm text-stone-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition cursor-pointer sm:w-auto">
                <option value="all">Tous les statuts</option>
                <option value="published">Publiés</option>
                <option value="draft">Brouillons</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Table (scroll horizontal sur petits écrans) */}
      <div className="overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                <th className="px-4 py-3.5 sm:px-5">Titre</th>
                <th className="px-4 py-3.5 sm:px-5">Auteur</th>
                <th className="px-4 py-3.5 sm:px-5">Catégorie</th>
                <th className="px-4 py-3.5 sm:px-5">Date</th>
                <th className="px-4 py-3.5 sm:px-5">Lecture</th>
                <th className="px-4 py-3.5 sm:px-5">À la une</th>
                <th className="px-4 py-3.5 sm:px-5">Statut</th>
                <th className="px-4 py-3.5 sm:px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {loadingData ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-stone-400"><Loader2 size={20} className="animate-spin mx-auto" /></td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-stone-400 italic">Aucun article trouvé.</td></tr>
              ) : paginated.map((article) => {
                const cs = catStyle(article.categorie);
                return (
                  <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5 sm:px-5 max-w-[240px]">
                      <p className="font-semibold text-stone-800 line-clamp-1">{article.titre}</p>
                      <p className="text-xs text-stone-400 font-mono mt-0.5 line-clamp-1">{article.slug}</p>
                    </td>
                    <td className="px-4 py-3.5 sm:px-5 text-stone-600 whitespace-nowrap">{article.auteur}</td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        style={{ background: cs.bg, color: cs.text, border: `1px solid ${cs.border}` }}>
                        <Tag size={9} /> {article.categorie}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 sm:px-5 text-stone-500 whitespace-nowrap text-xs">{article.dateISO}</td>
                    <td className="px-4 py-3.5 sm:px-5 text-stone-500 whitespace-nowrap text-xs">{article.tempsLecture}</td>
                    <td className="px-4 py-3.5 sm:px-5">
                      {article.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 border border-sky-200 px-2 py-0.5 text-[11px] font-semibold text-sky-600">⭐ Une</span>
                      ) : <span className="text-stone-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <StatusToggle active={article.status === "published"} loading={togglingId === article.id} onToggle={() => handleToggle(article)} />
                    </td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setArticleToEdit(article); setIsArticleModalOpen(true); }}
                          className="rounded-lg p-2 text-stone-400 hover:bg-sky-50 hover:text-sky-500 transition cursor-pointer" title="Modifier">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setArticleToDelete(article)}
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
              Page {page} / {totalPages} — {filtered.length} article{filtered.length !== 1 ? "s" : ""}
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
            <h3 className="text-sm font-bold text-stone-700">Catégories d&apos;articles</h3>
            <p className="text-xs text-stone-400 mt-0.5">Seules les catégories sans article peuvent être supprimées.</p>
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
              const hasArticles = cat.article_count > 0;
              const cs = catStyle(cat.name);
              return (
                <li key={cat.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-slate-50 group">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg" style={{ background: cs.bg, border: `1px solid ${cs.border}` }}>
                    <Tag size={12} style={{ color: cs.text }} />
                  </span>
                  <span className="flex-1 min-w-0 truncate text-sm font-medium text-stone-700">{cat.name}</span>
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums"
                    style={{ background: cs.bg, color: cs.text, border: `1px solid ${cs.border}` }}>
                    {cat.article_count} article{cat.article_count !== 1 ? "s" : ""}
                  </span>
                  <button onClick={() => { if (!hasArticles) setCatToDelete(cat); }}
                    disabled={hasArticles}
                    title={hasArticles ? "Suppression impossible — articles liés" : "Supprimer"}
                    className="shrink-0 opacity-0 group-hover:opacity-100 rounded-md p-1 transition-all disabled:cursor-not-allowed cursor-pointer focus-visible:opacity-100"
                    style={{ color: hasArticles ? "#d1d5db" : "#ef4444" }}>
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
      <ArticleModal
        key={isArticleModalOpen ? `article-${articleToEdit?.id ?? "new"}` : "article-closed"}
        isOpen={isArticleModalOpen}
        onClose={() => { setIsArticleModalOpen(false); setArticleToEdit(null); }}
        categories={categories}
        article={articleToEdit}
        onSubmit={handleSubmitArticle}
      />
      <CategoryModal
        key={isCatModalOpen ? "category-open" : "category-closed"}
        isOpen={isCatModalOpen}
        onClose={() => setIsCatModalOpen(false)}
        existing={categories}
        onSubmit={handleAddCategory}
      />
      <ConfirmDeleteModal
        isOpen={!!articleToDelete}
        onClose={() => { if (!deletingArticle) setArticleToDelete(null); }}
        onConfirm={handleDeleteArticle}
        loading={deletingArticle}
        title="Supprimer l'article ?"
        message={articleToDelete ? (
          <span>Supprimer définitivement <strong>« {articleToDelete.titre} »</strong> ?
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
