"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, User, Calendar, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getApiBase, resolveMediaUrl, formatRelativeDate } from "@/lib/api";

export type Article = {
    slug: string;
    categorie: string;
    titre: string;
    extrait: string;
    auteur: string;
    createdAt: string;
    thumbnail: string;
    featured: boolean;
};

type MotionDivProps = import("framer-motion").MotionProps & {
    className?: string; style?: React.CSSProperties;
};
const fadeUp = (delay = 0): MotionDivProps => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut", delay },
});

const categories = ["Toutes", "Entrepreneuriat", "Culture", "Technologie"];

export default function BlogPage() {
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("Toutes");
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const response = await fetch(`${getApiBase()}/api/public/articles`);
                if (response.ok) {
                    const payload = await response.json();
                    if (Array.isArray(payload)) {
                        setArticles(
                            payload.map((a) => ({
                                slug: a.slug,
                                categorie: a.category ?? "",
                                titre: a.titre,
                                extrait: a.excerpt ?? "",
                                auteur: a.author ?? "",
                                createdAt: a.createdAt ?? "",
                                thumbnail: a.thumbnail ?? "",
                                featured: !!a.featured,
                            }))
                        );
                    }
                }
            } catch {
                setArticles([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const featured = articles.find((a) => a.featured);
    const rest = articles.filter((a) => !a.featured);

    const filtered = rest.filter((a) => {
        const matchCat = activeCategory === "Toutes" || a.categorie === activeCategory;
        const matchSearch =
            a.titre.toLowerCase().includes(search.toLowerCase()) ||
            a.auteur.toLowerCase().includes(search.toLowerCase()) ||
            a.categorie.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    return (
        <>
            <Navbar />
            <main className="w-full overflow-x-hidden bg-stone-50">

                {/* ── HERO ── */}
                <section className="relative w-full h-80 sm:h-96 bg-neutral-800 overflow-hidden flex items-end justify-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-neutral-700/60 to-neutral-950/80" />
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="relative z-10 flex flex-col items-center gap-4 text-center px-5 pb-14"
                    >
                        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-bold font-['Inter']">
                            Actualités &amp; Blog
                        </h1>
                        <p className="text-orange-50 text-lg sm:text-2xl md:text-3xl font-normal font-['Inter'] max-w-[700px]">
                            Une question ? Un projet ? Notre équipe est à votre écoute.
                        </p>
                    </motion.div>
                </section>

                <div className="w-full max-w-[1560px] mx-auto px-5 sm:px-8 py-8">

                    {/* ── SEARCH + FILTERS ── */}
                    <motion.div {...fadeUp()} className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-14">
                        <div className="relative w-full sm:w-auto sm:flex-1 max-w-[480px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher une formation..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-700 text-base font-['Poppins'] placeholder:text-gray-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:ml-auto">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`h-11 px-5 rounded-xl text-sm font-medium font-['Poppins'] transition-all cursor-pointer ${activeCategory === cat
                                        ? "bg-neutral-950 text-white"
                                        : "bg-gray-50 text-gray-600 border-2 border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                            <button className="h-11 px-4 flex items-center gap-2 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-600 text-sm font-['Poppins'] hover:border-gray-300 transition-all cursor-pointer">
                                <SlidersHorizontal className="w-4 h-4" /> Filtres
                            </button>
                        </div>
                    </motion.div>

                    {/* ── FEATURED ARTICLE ── */}
                    {featured && activeCategory === "Toutes" && search === "" && (
                        <motion.div {...fadeUp(0.05)} className="mb-14">
                            <Link
                                href={`/blog/${featured.slug}`}
                                className="flex flex-col md:flex-row items-stretch bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                            >
                                {/* Image */}
                                <div className="relative w-full md:w-1/2 min-h-[300px] md:min-h-[380px] overflow-hidden flex-shrink-0">
                                    <Image
                                        src={resolveMediaUrl(featured.thumbnail) || "/images/emission.jpg"}
                                        alt={featured.titre}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        priority
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col justify-center gap-5 p-8 md:p-12 flex-1">
                                    <p className="text-zinc-950 text-2xl sm:text-3xl font-bold font-['Inter']">
                                        À LA UNE
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <h2 className="text-sky-400 text-xl sm:text-2xl md:text-3xl font-bold font-['Inter'] leading-9 hover:text-sky-500 transition-colors">
                                            {featured.titre}
                                        </h2>
                                        <p className="text-gray-900 text-base md:text-lg font-normal font-['Inter'] leading-8">
                                            {featured.extrait}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between flex-wrap gap-3 mt-2">
                                        <span className="text-zinc-600 text-base font-normal font-['Inter']">
                                            Par {featured.auteur}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-zinc-600 text-base font-normal font-['Inter']">•</span>
                                            <span className="text-zinc-600 text-xs font-normal font-['Inter']">
                                                {formatRelativeDate(featured.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )}

                    {/* ── ARTICLES GRID ── */}
                    {loading ? (
                        <div className="text-center py-20 text-gray-500 text-xl font-['Poppins']">Chargement...</div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 text-xl font-['Poppins']">
                            Aucun article trouvé.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-11">
                            {/* First row: 3 cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                                {filtered.slice(0, 3).map((article, i) => (
                                    <ArticleCard key={article.slug} article={article} delay={i * 0.07} />
                                ))}
                            </div>
                            {/* Second row: 3 cards */}
                            {filtered.length > 3 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                                    {filtered.slice(3, 6).map((article, i) => (
                                        <ArticleCard key={article.slug} article={article} delay={i * 0.07} />
                                    ))}
                                </div>
                            )}
                            {/* Third row: 3 cards */}
                            {filtered.length > 6 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                                    {filtered.slice(6, 9).map((article, i) => (
                                        <ArticleCard key={article.slug} article={article} delay={i * 0.07} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}

function ArticleCard({ article, delay }: { article: Article; delay: number }) {
    return (
        <div
            className="flex flex-col group hover:-translate-y-1 transition-all duration-300"
            style={{
                animation: `fadeInUp 0.6s ease-out ${delay}s both`,
            }}
        >
            <Link href={`/blog/${article.slug}`} className="flex flex-col h-full">
                <div className="relative w-full h-64 rounded-t-[10px] overflow-hidden flex-shrink-0">
                    <Image
                        src={resolveMediaUrl(article.thumbnail) || "/images/emission.jpg"}
                        alt={article.titre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 z-10">
                        <span className="px-3 py-1 bg-white shadow-sm text-neutral-700 text-xs font-bold font-['Inter'] rounded-sm">
                            {article.categorie}
                        </span>
                    </div>
                </div>
                <div className="bg-white rounded-b-[10px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] p-5 flex flex-col gap-3 flex-1">
                    <div className="flex items-center gap-8 flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4 text-zinc-600" />
                            <span className="text-zinc-600 text-xs font-normal font-['Inter']">{article.auteur}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-zinc-600" />
                            <span className="text-zinc-600 text-[10px] font-normal font-['Inter']">{formatRelativeDate(article.createdAt)}</span>
                        </div>
                    </div>
                    <h3 className="text-zinc-950 text-lg font-bold font-['Inter'] leading-7 group-hover:text-sky-400 transition-colors">
                        {article.titre}
                    </h3>
                    <p className="text-gray-900 text-xs font-normal font-['Inter'] leading-5 flex-1">
                        {article.extrait}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-sky-400 text-xs font-semibold font-['Inter'] group-hover:underline transition-all">
                            Lire l&apos;article
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-sky-400" />
                    </div>
                </div>
            </Link>
        </div>
    );
}
